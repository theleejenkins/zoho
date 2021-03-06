import fs from "fs";
import google from "googleapis";

import defaultLogger from "./winston-config.js";

const SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.send",
];
const TOKEN_PATH = "token.json";

export default function googleAuth() {
  try {
    // Load client secrets from a local file.
    const credentials = JSON.parse(fs.readFileSync("credentials.json"));
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Check if we have previously stored a token.
    const token = fs.readFileSync("token.json");
    oAuth2Client.setCredentials(JSON.parse(token));
    defaultLogger.info("[googleAuth] : Set Google oAuth2Client credentials.");

    return oAuth2Client;
  } catch (error) {
    throw new Error(error);
  }
}
