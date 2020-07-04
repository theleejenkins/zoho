import google from "googleapis";

import defaultLogger from "./winston-config.js";
import googleAuth from "./googleAuth.js";

export async function sendEmail(from, to, subject, body) {
  const auth = googleAuth();
  const gmail = google.google.gmail({ version: "v1", auth: auth });

  // You can use UTF-8 encoding for the subject using the method below.
  // You can also just use a plain string if you don't need anything fancy.
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const messageParts = [
    "From: " + from,
    "To: " + to,
    "Content-Type: text/html; charset=utf-8",
    "Content-Transfer-Encoding: base64" + "MIME-Version: 1.0",
    `Subject: ${utf8Subject}`,
    "",
    body,
  ];
  const message = messageParts.join("\n");

  // The body needs to be base64url encoded.
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  defaultLogger.info(`[eMail]: Sending email To: ${to}`);
  try {
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
    defaultLogger.info(`[eMail]: Email sent: ${res.statusText}:${res.status}`);
  } catch (err) {
    defaultLogger.error(`[eMail]: ${error}`);
  }
}

// var body = "";
// body += "<html><body>";
// body += "<table width='100%'><tr><td>"; // Outer table
// body += "<table width='60%'>"; // Nested table
// body +=
//   "<tr><td width='70%'>This is a row</td><td width='30%'>999999</td></tr>";
// body += "<tr><td width='70%'>So is this</td><td width='30%'>9999</td></tr>";
// body += "</table>";
// body += "</td></tr></table>";
// body += "</body></html>";

// sendEmail(
//   "Lee Jenkins <lee.jenkins@ets.group>",
//   "Lee Jenkins <lee.jenkins@blacktusk.co.za>; \
//   Lee Jenkins <lee.jenkins@ets.group>",
//   "So... Hello!🤘❤️😎",
//   body
// );
