import request from "request-promise-native";

// import { sendEmail } from "./eMail.js";
import { defaultLogger } from "./winston-config.js";
import { updateAgent } from "./updateAgent.js";
import {
  standbyRosterUrl,
  updateTokenUrlAddress,
  getAgentsUrl,
} from "./params.js";
import toShortFormat from "./ShortDate.js";

const to = process.env.EMAILTO;
const from = process.env.EMAILFROM;
const subject = "Standby Callout - Zoho";
var body = "";

// get current date in 'DD Mon YYYY' format
var currentDate = new Date().toShortFormat();
currentDate = "29 Jun 2020";

export var options = {
  method: "",
  url: "",
  json: true,
  resolveWithFullResponse: true,
  timeout: 30000,
};

async function makeRequest() {
  try {
    // Make a POST call to get an access token
    Object.assign(options, { method: "POST", url: updateTokenUrlAddress });
    var response = await request(options);
    // Setup a POST call to get Standby records from Standby Spreadsheet
    Object.assign(options, {
      method: "POST",
      url: standbyRosterUrl,
      headers: {
        orgId: process.env.ORGID,
        Authorization: "Zoho-oauthtoken " + response.body.access_token,
      },
    });

    // Make a POST call to get Standby records from Standby Spreadsheet
    response = await request(options);

    // get records from body
    var records = response.body.records;

    defaultLogger.info(`[main]: Current Date: ${currentDate}`);

    // get the correct record for today's date (a Monday)
    const standbyRecord = records.filter(
      (datum) => datum["Start (8:00 am)"] === currentDate
    );

    // Grab first array element, and then the first string element
    var infraStandby = standbyRecord[0]["1st Standby Infrastructure"].split(
      " "
    )[0];
    var softwareStandby = standbyRecord[0]["1st Standby Software"].split(
      " "
    )[0];
    // Setup a call to get Standby records from Standby Spreadsheet
    Object.assign(options, { method: "GET", url: getAgentsUrl });

    response = await request(options);
    // get agents from body
    const agents = response.body.data;

    // find the current agents
    const clearAgentRecord = agents.filter(
      (datum) =>
        datum.aboutInfo === "InfraStandby" ||
        datum.aboutInfo === "SoftwareStandby"
    );

    // Clear both current Standby agents
    const asyncRes = await Promise.all(
      clearAgentRecord.map(async (agent) => {
        updateAgent(agents, agent.firstName, "", options);
      })
    );

    // set both new Standby agents
    updateAgent(agents, infraStandby, "InfraStandby", options);
    updateAgent(agents, softwareStandby, "SoftwareStandby", options);
    body += "</body></html>";
    body += `<html>`;
    body += `<head>`;
    body += `<style>`;
    body += `  * { font-family: verdana;}`;
    body += `  body {background-color: black;}`;
    body += `  h2   {color: white;}`;
    body += `  tr   {color: white;}`;
    body += `span   {color: red;}`;
    body += `</style>`;
    body += `</head>`;
    body += `<body>`;
    body += `  <h2> Standby for week starting: <span style='color:powderblue;'>${currentDate}</span></h2>`;
    body += `<table width='50%'>`;
    body += `<tr><td width='30%'>Updated Infrastructure Standby to:</td><td style='color:red;' width='30%'>${infraStandby}</td></tr>`;
    body += `<tr><td width='30%'>Updated Software Standby to:</td><td style='color:red;' width='30%'>${softwareStandby}</td></tr>`;
    body += `</table>`;
    body += `</body>`;
    body += `</html>`;
  } catch (error) {
    defaultLogger.error(`[main]: ${error}`);
  }
}

// main
async function main() {
  defaultLogger.info("[main]: Program start.");
  await makeRequest().catch((error) => defaultLogger.error(error));
  // sendEmail(to, from, subject, body);
  defaultLogger.info("[main]: Program End.");
}

main();
