"use strict";
const path = require("node:path");
const electron = require("electron");
const fs = require("node:fs");
const nodemailer = require("nodemailer");
function machinesDir() {
  if (electron.app.isPackaged) {
    return path.join(electron.app.getAppPath(), "dist", "machines");
  }
  return path.join(__dirname, "../public", "machines");
}
function machinePath(filename) {
  if (typeof filename !== 'string') return null;
  const safe = path.basename(filename);
  if (safe !== filename || !/^[a-z-]+\.svg$/.test(safe)) return null;
  const full = path.join(machinesDir(), safe);
  return fs.existsSync(full) && fs.statSync(full).isFile() ? full : null;
}
function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function buildWorkoutHtml(payload) {
  const rows = payload.exercises.map((ex) => {
    const guess = ex.estimated ? ' <em style="color:#7d8d9a">(guess — overwrite in the app)</em>' : "";
    const replay = ex.replay ? ' <span style="color:#2dd4bf">replay · same weight</span>' : "";
    return `
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #1c222b;width:88px;vertical-align:middle">
            <img src="cid:${escapeHtml(ex.id)}" width="72" height="54" alt="${escapeHtml(ex.name)}" style="display:block;border:1px solid #2dd4bf55;background:#14181e" />
          </td>
          <td style="padding:12px 8px;border-bottom:1px solid #1c222b;color:#d7e2ea;font-family:Segoe UI,Arial,sans-serif">
            <div style="font-size:16px;letter-spacing:0.04em">${escapeHtml(ex.name.toUpperCase())}${replay}</div>
            <div style="margin-top:4px;color:#2dd4bf;font-family:Consolas,monospace;font-size:14px">
              ${ex.sets} × ${ex.minReps}–${ex.maxReps} @ ${ex.kg} kg${guess}
            </div>
          </td>
        </tr>`;
  }).join("");
  return `<!doctype html>
<html>
<body style="margin:0;background:#080a0c;color:#d7e2ea">
  <div style="max-width:560px;margin:0 auto;padding:28px 20px;font-family:Segoe UI,Arial,sans-serif">
    <div style="font-size:11px;letter-spacing:0.28em;color:#2dd4bf;text-transform:uppercase">Worlds Simplest Gym</div>
    <h1 style="margin:10px 0 4px;font-weight:600;letter-spacing:0.06em">${escapeHtml(payload.sessionName)}</h1>
    <p style="margin:0 0 22px;color:#7d8d9a">${escapeHtml(payload.dateLabel)}</p>
    <table style="width:100%;border-collapse:collapse;background:#14181e;border:1px solid #2dd4bf44">
      ${rows}
    </table>
    <p style="margin:22px 0 0;color:#7d8d9a;font-size:12px">
      Double progression: hit 12 on every set, then add 2.5 kg next time.
    </p>
  </div>
</body>
</html>`;
}
function transporter(smtp) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    auth: {
      user: smtp.user,
      pass: smtp.appPassword
    }
  });
}
function mailError(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (/invalid login|username and password|eauth/i.test(message)) {
    return "Gmail rejected the login. Use the Gmail address and a 16-character app password, not your normal password.";
  }
  if (/enotfound|econnrefused|etimedout|edns/i.test(message)) {
    return "Could not reach smtp.gmail.com. Check the network, then try again.";
  }
  return message;
}
async function sendWorkoutEmail(smtp, to, payload) {
  try {
    const attachments = payload.exercises.flatMap((ex) => {
      const file = machinePath(ex.image);
      if (!file) return [];
      return [
        {
          filename: ex.image,
          path: file,
          cid: ex.id,
          contentType: "image/svg+xml"
        }
      ];
    });
    await transporter(smtp).sendMail({
      from: `Worlds Simplest Gym <${smtp.user}>`,
      to,
      subject: `Today: ${payload.sessionName}`,
      html: buildWorkoutHtml(payload),
      attachments
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: mailError(error) };
  }
}
async function sendTestEmail(smtp, to) {
  try {
    await transporter(smtp).sendMail({
      from: `Worlds Simplest Gym <${smtp.user}>`,
      to,
      subject: "Worlds Simplest Gym — test",
      html: `<p style="font-family:Segoe UI,Arial,sans-serif;color:#14181e">
        SMTP works. You can email today's workout from the Today screen.
      </p>`
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: mailError(error) };
  }
}

module.exports = {sendWorkoutEmail, sendTestEmail};
