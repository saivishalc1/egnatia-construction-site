/**
 * Egnatia Construction: Google review requests
 * ---------------------------------------------
 * Runs inside a Google Sheet (Extensions → Apps Script). When a project is marked
 * complete, it emails the client a short thank-you with a one-tap link to leave a
 * Google review, sends ONE polite reminder a week later, then stops.
 *
 * Every client gets the same request. No filtering by how happy they seem and no
 * incentives: both break Google's review policy and the FTC rule on consumer
 * reviews (16 CFR Part 465).
 *
 * Setup: see README.md in this folder.
 */

const CONFIG = {
  sheetName: 'Review requests',
  reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJBVgIVRlFwokRzoaH2eIn7Dk',
  businessName: 'Egnatia Construction',
  replyTo: 'info@egnatiaconstruction.com',
  phoneDisplay: '(212) 392-5544',
  daysAfterCompletion: 2, // wait a couple of days after handover before asking
  reminderAfterDays: 7, // one reminder, a week after the first email
  dailyHour: 10, // run once a day around 10am (spreadsheet time zone)
}

const HEADERS = [
  'Client name',
  'Email',
  'Phone',
  'Language (EN/ES)',
  'Project',
  'Completed on',
  'Status',
  'Request sent',
  'Reminder sent',
  'Text message',
  'Notes',
]
const COL = Object.fromEntries(HEADERS.map((h, i) => [h, i]))
const STATUS = {
  requested: 'Requested',
  reminded: 'Reminded',
  reviewed: 'Reviewed',
  optOut: 'Do not contact',
}

/* ─── Menu ─────────────────────────────────────────────── */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⭐ Reviews')
    .addItem('Send due requests now', 'processReviewRequests')
    .addItem('Send me a test email', 'sendTestEmail')
    .addSeparator()
    .addItem('Turn on daily automation', 'installDailyTrigger')
    .addItem('Turn off daily automation', 'removeDailyTrigger')
    .addSeparator()
    .addItem('Instant mode ON (email as soon as a row is filled)', 'instantModeOn')
    .addItem('Instant mode OFF', 'instantModeOff')
    .addSeparator()
    .addItem('Set up / repair the sheet', 'setupSheet')
    .addToUi()
}

/* ─── Setup ────────────────────────────────────────────── */

function setupSheet() {
  const ss = SpreadsheetApp.getActive()
  const sheet = ss.getSheetByName(CONFIG.sheetName) || ss.insertSheet(CONFIG.sheetName)
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setBackground('#efe9df')
  sheet.setFrozenRows(1)

  const rows = Math.max(sheet.getMaxRows() - 1, 200)
  const lang = SpreadsheetApp.newDataValidation().requireValueInList(['EN', 'ES'], true).setAllowInvalid(false).build()
  sheet.getRange(2, COL['Language (EN/ES)'] + 1, rows).setDataValidation(lang)
  const status = SpreadsheetApp.newDataValidation()
    .requireValueInList(['', STATUS.requested, STATUS.reminded, STATUS.reviewed, STATUS.optOut], true)
    .setAllowInvalid(true)
    .build()
  sheet.getRange(2, COL['Status'] + 1, rows).setDataValidation(status)
  ;['Completed on', 'Request sent', 'Reminder sent'].forEach((h) =>
    sheet.getRange(2, COL[h] + 1, rows).setNumberFormat('yyyy-mm-dd'),
  )
  sheet.autoResizeColumns(1, HEADERS.length)
  SpreadsheetApp.getActive().toast('Sheet is ready. Add a client, then use ⭐ Reviews → Send me a test email.', 'Reviews')
}

function installDailyTrigger() {
  removeDailyTrigger(true)
  ScriptApp.newTrigger('processReviewRequests').timeBased().everyDays(1).atHour(CONFIG.dailyHour).create()
  SpreadsheetApp.getActive().toast(`Daily automation is on (runs around ${CONFIG.dailyHour}:00).`, 'Reviews')
}

function removeDailyTrigger(silent) {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'processReviewRequests')
    .forEach((t) => ScriptApp.deleteTrigger(t))
  if (silent !== true) SpreadsheetApp.getActive().toast('Daily automation is off.', 'Reviews')
}

/*
 * Instant mode (great for demos): no 2-day wait, and the sheet checks for due emails
 * every time it's edited, so the request goes out seconds after a row is filled in.
 */
function instantModeOn() {
  instantModeOff(true)
  PropertiesService.getScriptProperties().setProperty('INSTANT', '1')
  ScriptApp.newTrigger('onSheetEdited').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create()
  SpreadsheetApp.getActive().toast('Instant mode is on. Type the "Completed on" date last: the email goes out within seconds.', 'Reviews', 8)
}

function instantModeOff(silent) {
  PropertiesService.getScriptProperties().deleteProperty('INSTANT')
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onSheetEdited')
    .forEach((t) => ScriptApp.deleteTrigger(t))
  if (silent !== true) SpreadsheetApp.getActive().toast('Instant mode is off (back to 2 days after completion).', 'Reviews')
}

function onSheetEdited(e) {
  if (e && e.range && e.range.getSheet().getName() !== CONFIG.sheetName) return
  processReviewRequests()
}

function isInstant() {
  return PropertiesService.getScriptProperties().getProperty('INSTANT') === '1'
}

/* ─── Main job ─────────────────────────────────────────── */

function processReviewRequests() {
  // Quick edits can fire several runs at once; the lock stops a client getting two emails
  const lock = LockService.getScriptLock()
  if (!lock.tryLock(30000)) return
  try {
    sendDueEmails()
  } finally {
    lock.releaseLock()
  }
}

function sendDueEmails() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.sheetName)
  if (!sheet) throw new Error(`No sheet named "${CONFIG.sheetName}". Run ⭐ Reviews → Set up / repair the sheet.`)
  const lastRow = sheet.getLastRow()
  if (lastRow < 2) return

  const range = sheet.getRange(2, 1, lastRow - 1, HEADERS.length)
  const rows = range.getValues()
  const today = startOfDay(new Date())
  const wait = isInstant() ? 0 : CONFIG.daysAfterCompletion
  let sent = 0

  rows.forEach((row, i) => {
    const r = i + 2
    const name = String(row[COL['Client name']]).trim()
    const email = String(row[COL['Email']]).trim()
    const phone = String(row[COL['Phone']]).trim()
    const lang = String(row[COL['Language (EN/ES)']]).trim().toUpperCase() === 'ES' ? 'ES' : 'EN'
    const project = String(row[COL['Project']]).trim()
    const status = String(row[COL['Status']]).trim()
    const completed = asDate(row[COL['Completed on']])
    const requestSent = asDate(row[COL['Request sent']])
    const reminderSent = asDate(row[COL['Reminder sent']])

    if (!name) return

    // Keep a one-tap "text this client" link for phone numbers (free, sent from her own phone)
    if (phone) sheet.getRange(r, COL['Text message'] + 1).setFormula(smsFormula(phone, lang, name))

    if (!email || status === STATUS.reviewed || status === STATUS.optOut || !completed) return
    if (MailApp.getRemainingDailyQuota() < 1) return

    try {
      if (!requestSent && daysBetween(completed, today) >= wait) {
        sendEmail(email, lang, 'request', name, project)
        sheet.getRange(r, COL['Request sent'] + 1).setValue(today)
        sheet.getRange(r, COL['Status'] + 1).setValue(STATUS.requested)
        sent++
      } else if (requestSent && !reminderSent && daysBetween(requestSent, today) >= CONFIG.reminderAfterDays) {
        sendEmail(email, lang, 'reminder', name, project)
        sheet.getRange(r, COL['Reminder sent'] + 1).setValue(today)
        sheet.getRange(r, COL['Status'] + 1).setValue(STATUS.reminded)
        sent++
      }
    } catch (err) {
      sheet.getRange(r, COL['Notes'] + 1).setValue(`Email failed ${formatDate(today)}: ${err.message}`)
    }
  })

  if (sent) SpreadsheetApp.getActive().toast(`Sent ${sent} review email(s).`, 'Reviews')
}

function sendTestEmail() {
  const me = Session.getActiveUser().getEmail()
  sendEmail(me, 'EN', 'request', 'Maria', 'kitchen renovation')
  sendEmail(me, 'ES', 'request', 'María', 'la remodelación de su cocina')
  SpreadsheetApp.getActive().toast(`Test emails (EN + ES) sent to ${me}.`, 'Reviews')
}

/* ─── Messages ─────────────────────────────────────────── */

function sendEmail(to, lang, kind, name, project) {
  const m = message(lang, kind, name, project)
  MailApp.sendEmail({ to, subject: m.subject, body: m.text, htmlBody: m.html, name: CONFIG.businessName, replyTo: CONFIG.replyTo })
}

function message(lang, kind, name, project) {
  const first = name.split(' ')[0]
  const es = lang === 'ES'
  const what = project || (es ? 'su proyecto' : 'your project')
  const subject = es
    ? kind === 'request'
      ? `Gracias de parte de ${CONFIG.businessName}`
      : `Un recordatorio rápido de ${CONFIG.businessName}`
    : kind === 'request'
      ? `Thank you from ${CONFIG.businessName}`
      : `A quick reminder from ${CONFIG.businessName}`
  const lines = es
    ? kind === 'request'
      ? [
          `Hola ${first},`,
          `Gracias por confiar en nosotros con ${what}. Fue un gusto trabajar en su hogar.`,
          `¿Nos regalaría un minuto para contar su experiencia en Google? Sus palabras ayudan a otras familias de Nueva York a elegir contratista con confianza.`,
        ]
      : [
          `Hola ${first},`,
          `Solo un recordatorio amable: si tiene un minuto, nos encantaría conocer su opinión sobre ${what} en Google.`,
          `Si ya la dejó, ¡gracias! Puede ignorar este mensaje.`,
        ]
    : kind === 'request'
      ? [
          `Hi ${first},`,
          `Thank you for trusting us with your ${what}. It was a pleasure working on your home.`,
          `Would you take a minute to share your experience on Google? Your words help other New York families choose a contractor with confidence.`,
        ]
      : [
          `Hi ${first},`,
          `Just a friendly nudge: if you have a minute, we'd really value your thoughts on your ${what} on Google.`,
          `If you've already left one, thank you, and please ignore this note.`,
        ]
  const button = es ? 'Dejar una reseña en Google' : 'Leave a Google review'
  const sign = es ? `Con gratitud,<br>El equipo de ${CONFIG.businessName}` : `With thanks,<br>The ${CONFIG.businessName} team`
  const note = es
    ? `¿Preguntas o algo que debamos saber? Responda a este correo o llame al ${CONFIG.phoneDisplay}.`
    : `Questions, or anything we should know? Just reply to this email or call ${CONFIG.phoneDisplay}.`

  const html = `
  <div style="font-family:Georgia,'Times New Roman',serif;color:#1b1814;max-width:520px;margin:0 auto;padding:24px;line-height:1.6">
    ${lines.map((l) => `<p style="margin:0 0 14px;font-size:16px">${l}</p>`).join('')}
    <p style="margin:24px 0">
      <a href="${CONFIG.reviewUrl}" style="background:#9c6a2c;color:#ffffff;text-decoration:none;padding:13px 22px;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;letter-spacing:.04em;display:inline-block">★ ${button}</a>
    </p>
    <p style="margin:0 0 20px;font-size:16px">${sign}</p>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#6b645b">${note}</p>
  </div>`
  const text = `${lines.join('\n\n')}\n\n${button}: ${CONFIG.reviewUrl}\n\n${sign.replace('<br>', '\n')}\n\n${note}`
  return { subject, html, text }
}

function smsFormula(phone, lang, name) {
  const digits = phone.replace(/[^\d+]/g, '')
  const e164 = digits.startsWith('+') ? digits : `+1${digits.replace(/^1/, '')}`
  const first = name.split(' ')[0]
  const body =
    lang === 'ES'
      ? `Hola ${first}, gracias por elegir ${CONFIG.businessName}. Si tiene un minuto, nos ayudaría mucho su reseña en Google: ${CONFIG.reviewUrl}`
      : `Hi ${first}, thank you for choosing ${CONFIG.businessName}! If you have a minute, a Google review would mean a lot to us: ${CONFIG.reviewUrl}`
  // "sms:+1...?&body=" opens a pre-filled text on both iPhone and Android
  const url = `sms:${e164}?&body=${encodeURIComponent(body)}`
  return `=HYPERLINK("${url.replace(/"/g, '""')}","📱 Text ${first}")`
}

/* ─── Dates ────────────────────────────────────────────── */

function asDate(v) {
  // toString check (not instanceof) also recognises dates coming from other contexts
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v)) return startOfDay(v)
  if (typeof v === 'string' && v.trim()) {
    const d = new Date(v)
    return isNaN(d) ? null : startOfDay(d)
  }
  return null
}
function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86400000)
}
function formatDate(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd')
}
