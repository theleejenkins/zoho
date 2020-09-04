import request from "request-promise-native";

import { sendEmail } from "./eMail.js";
import defaultLogger from "./winston-config.js";
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
//currentDate = "29 Jun 2020";

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

    defaultLogger.info(`[main]       : Current Date: ${currentDate}`);

    // get the correct record for today's date (a Monday)
    const standbyRecord = records.filter(
      (datum) => datum["Start (8:00 am)"] === currentDate
    );

    if (standbyRecord.length == 0) throw new Error("No Standby date match");

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
    // body += "</body></html>";
    // body += `<html>`;
    // body += `<head>`;
    // body += `<style>`;
    // body += `  * { font-family: verdana;}`;
    // body += `  body {background-color: black;}`;
    // body += `  h2   {background-color: black;color: white;}`;
    // body += `  tr   {background-color: black;color: white;}`;
    // body += `span   {color: red;}`;
    // body += `</style>`;
    // body += `</head>`;
    // body += `<body>`;
    // body += `  <h2> Standby for week starting: <span style='color:powderblue;'>${currentDate}</span></h2>`;
    // body += `<table width='50%'>`;
    // body += `<tr><td width='30%'>Updated Infrastructure Standby to:</td><td style='color:red;' width='30%'>${infraStandby}</td></tr>`;
    // body += `<tr><td width='30%'>Updated Software Standby to:</td><td style='color:red;' width='30%'>${softwareStandby}</td></tr>`;
    // body += `</table>`;
    // body += `</body>`;
    // body += `</html>`;
    // body += "<!doctype html>";
    body += "<!doctype html>";
    body += "<html>";
    body += "  <head>";
    body += '    <meta name="viewport" content="width=device-width" />';
    body +=
      '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />';
    body += "    <title>Zoho Support Standby</title>";
    body += "    <style>";
    body += "      /* -------------------------------------";
    body += "          GLOBAL RESETS";
    body += "      ------------------------------------- */";
    body += "      ";
    body += "      /*All the styling goes here*/";
    body += "      ";
    body += "      img {";
    body += "        border: none;";
    body += "        -ms-interpolation-mode: bicubic;";
    body += "        max-width: 100%; ";
    body += "      }";
    body += "";
    body += "      body {";
    body += "        background-color: #f6f6f6;";
    body += "        font-family: sans-serif;";
    body += "        -webkit-font-smoothing: antialiased;";
    body += "        font-size: 14px;";
    body += "        line-height: 1.4;";
    body += "        margin: 0;";
    body += "        padding: 0;";
    body += "        -ms-text-size-adjust: 100%;";
    body += "        -webkit-text-size-adjust: 100%; ";
    body += "      }";
    body += "";
    body += "      table {";
    body += "        border-collapse: separate;";
    body += "        mso-table-lspace: 0pt;";
    body += "        mso-table-rspace: 0pt;";
    body += "        width: 100%; }";
    body += "        table td {";
    body += "          font-family: calibri;";
    body += "          font-size: 14px;";
    body += "          vertical-align: top; ";
    body += "      }";
    body += "";
    body += "      /* -------------------------------------";
    body += "          BODY & CONTAINER";
    body += "      ------------------------------------- */";
    body += "";
    body += "      .body {";
    body += "        background-color: #f6f6f6;";
    body += "        width: 100%; ";
    body += "      }";
    body += "";
    body +=
      "      /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */";
    body += "      .container {";
    body += "        display: block;";
    body += "        margin: 0 auto !important;";
    body += "        /* makes it centered */";
    body += "        max-width: 580px;";
    body += "        padding: 10px;";
    body += "        width: 580px; ";
    body += "      }";
    body += "";
    body +=
      "      /* This should also be a block element, so that it will fill 100% of the .container */";
    body += "      .content {";
    body += "        box-sizing: border-box;";
    body += "        display: block;";
    body += "        margin: 0 auto;";
    body += "        max-width: 580px;";
    body += "        padding: 10px; ";
    body += "      }";
    body += "";
    body += "      /* -------------------------------------";
    body += "          HEADER, FOOTER, MAIN";
    body += "      ------------------------------------- */";
    body += "      .main {";
    body += "        background: #ffffff;";
    body += "        border-radius: 3px;";
    body += "        width: 100%; ";
    body += "      }";
    body += "";
    body += "      .wrapper {";
    body += "        box-sizing: border-box;";
    body += "        padding: 20px; ";
    body += "      }";
    body += "";
    body += "      .content-block {";
    body += "        padding-bottom: 10px;";
    body += "        padding-top: 10px;";
    body += "      }";
    body += "";
    body += "      .footer {";
    body += "        clear: both;";
    body += "        margin-top: 10px;";
    body += "        text-align: center;";
    body += "        width: 100%; ";
    body += "      }";
    body += "        .footer td,";
    body += "        .footer p,";
    body += "        .footer span,";
    body += "        .footer a {";
    body += "          color: #999999;";
    body += "          font-size: 12px;";
    body += "          text-align: center; ";
    body += "      }";
    body += "";
    body += "      /* -------------------------------------";
    body += "          TYPOGRAPHY";
    body += "      ------------------------------------- */";
    body += "      h1,";
    body += "      h2,";
    body += "      h3,";
    body += "      h4 {";
    body += "        color: #000000;";
    body += "        font-family: sans-serif;";
    body += "        font-weight: 400;";
    body += "        line-height: 1.4;";
    body += "        margin: 0;";
    body += "        margin-bottom: 30px; ";
    body += "      }";
    body += "";
    body += "      h1 {";
    body += "        font-size: 35px;";
    body += "        font-weight: 300;";
    body += "        text-align: center;";
    body += "        text-transform: capitalize; ";
    body += "      }";
    body += "";
    body += "      p,";
    body += "      ul,";
    body += "      ol {";
    body += "        font-family: calibri;";
    body += "        font-size: 14px;";
    body += "        font-weight: normal;";
    body += "        margin: 0;";
    body += "        margin-bottom: 15px; ";
    body += "      }";
    body += "        p li,";
    body += "        ul li,";
    body += "        ol li {";
    body += "          list-style-position: inside;";
    body += "          margin-left: 5px; ";
    body += "      }";
    body += "";
    body += "      a {";
    body += "        color: #3498db;";
    body += "        text-decoration: underline; ";
    body += "      }";
    body += "      /* -------------------------------------";
    body += "          OTHER STYLES THAT MIGHT BE USEFUL";
    body += "      ------------------------------------- */";
    body += "      .last {";
    body += "        margin-bottom: 0; ";
    body += "      }";
    body += "";
    body += "      .first {";
    body += "        margin-top: 0; ";
    body += "      }";
    body += "";
    body += "      .align-center {";
    body += "        text-align: center; ";
    body += "      }";
    body += "";
    body += "      .align-right {";
    body += "        text-align: right; ";
    body += "      }";
    body += "";
    body += "      .align-left {";
    body += "        text-align: left; ";
    body += "      }";
    body += "";
    body += "      .clear {";
    body += "        clear: both; ";
    body += "      }";
    body += "";
    body += "      .mt0 {";
    body += "        margin-top: 0; ";
    body += "      }";
    body += "";
    body += "      .mb0 {";
    body += "        margin-bottom: 0; ";
    body += "      }";
    body += "";
    body += "      .preheader {";
    body += "        color: transparent;";
    body += "        display: none;";
    body += "        height: 0;";
    body += "        max-height: 0;";
    body += "        max-width: 0;";
    body += "        opacity: 0;";
    body += "        overflow: hidden;";
    body += "        mso-hide: all;";
    body += "        visibility: hidden;";
    body += "        width: 0; ";
    body += "      }";
    body += "";
    body += "      .powered-by a {";
    body += "        text-decoration: none; ";
    body += "      }";
    body += "";
    body += "      hr {";
    body += "        border: 0;";
    body += "        border-bottom: 1px solid #f6f6f6;";
    body += "        margin: 20px 0; ";
    body += "      }";
    body += "";
    body += "      /* -------------------------------------";
    body += "          RESPONSIVE AND MOBILE FRIENDLY STYLES";
    body += "      ------------------------------------- */";
    body += "      @media only screen and (max-width: 620px) {";
    body += "        table[class=body] h1 {";
    body += "          font-size: 28px !important;";
    body += "          margin-bottom: 10px !important; ";
    body += "        }";
    body += "        table[class=body] p,";
    body += "        table[class=body] ul,";
    body += "        table[class=body] ol,";
    body += "        table[class=body] td,";
    body += "        table[class=body] span,";
    body += "        table[class=body] a {";
    body += "          font-size: 16px !important; ";
    body += "        }";
    body += "        table[class=body] .wrapper,";
    body += "        table[class=body] .article {";
    body += "          padding: 10px !important; ";
    body += "        }";
    body += "        table[class=body] .content {";
    body += "          padding: 0 !important; ";
    body += "        }";
    body += "        table[class=body] .container {";
    body += "          padding: 0 !important;";
    body += "          width: 100% !important; ";
    body += "        }";
    body += "        table[class=body] .main {";
    body += "          border-left-width: 0 !important;";
    body += "          border-radius: 0 !important;";
    body += "          border-right-width: 0 !important; ";
    body += "        }";
    body += "        table[class=body] .btn table {";
    body += "          width: 100% !important; ";
    body += "        }";
    body += "        table[class=body] .btn a {";
    body += "          width: 100% !important; ";
    body += "        }";
    body += "        table[class=body] .img-responsive {";
    body += "          height: auto !important;";
    body += "          max-width: 100% !important;";
    body += "          width: auto !important; ";
    body += "        }";
    body += "      }";
    body += "";
    body += "      /* -------------------------------------";
    body += "          PRESERVE THESE STYLES IN THE HEAD";
    body += "      ------------------------------------- */";
    body += "      @media all {";
    body += "        .ExternalClass {";
    body += "          width: 100%; ";
    body += "        }";
    body += "        .ExternalClass,";
    body += "        .ExternalClass p,";
    body += "        .ExternalClass span,";
    body += "        .ExternalClass font,";
    body += "        .ExternalClass td,";
    body += "        .ExternalClass div {";
    body += "          line-height: 100%; ";
    body += "        }";
    body += "        .apple-link a {";
    body += "          color: inherit !important;";
    body += "          font-family: inherit !important;";
    body += "          font-size: inherit !important;";
    body += "          font-weight: inherit !important;";
    body += "          line-height: inherit !important;";
    body += "          text-decoration: none !important; ";
    body += "        }";
    body += "        #MessageViewBody a {";
    body += "          color: inherit;";
    body += "          text-decoration: none;";
    body += "          font-size: inherit;";
    body += "          font-family: inherit;";
    body += "          font-weight: inherit;";
    body += "          line-height: inherit;";
    body += "        }";
    body += "      }";
    body += "    </style>";
    body += "  </head>";
    body += '  <body class="">';
    body += '    <span class="preheader">Zoho Support Standby</span>';
    body +=
      '    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">';
    body += "      <tr>";
    body += "        <td>&nbsp;</td>";
    body += '        <td class="container">';
    body += '          <div class="content">';
    body += "";
    body += "            <!-- START CENTERED WHITE CONTAINER -->";
    body += '            <table role="presentation" class="main">';
    body += "";
    body += "              <!-- START MAIN CONTENT AREA -->";
    body += "              <tr>";
    body += '                <td class="wrapper">';
    body +=
      '                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">';
    body += "                    <tr>";
    body += "                      <td>";
    body += "                        <p>Hello,</p>";
    body += `<table style="width:70%">`;
    body += `<tr><td>Standby for week starting:</td><td style='color:red;'>${currentDate}</td></tr>`;
    body += `<tr><td>Updated Infrastructure Standby to:</td><td style='color:red;'>${infraStandby}</td></tr>`;
    body += `<tr><td>Updated Software Standby to:</td><td style='color:red;'>${softwareStandby}</td></tr>`;
    body += `</table>`;
    body += "                        <br>";
    body += "                        <p>From Zoho Desk</p>";
    body += "                      </td>";
    body += "                    </tr>";
    body += "                  </table>";
    body += "                </td>";
    body += "              </tr>";
    body += "            <!-- END MAIN CONTENT AREA -->";
    body += "            </table>";
    body += "            <!-- END CENTERED WHITE CONTAINER -->";
    body += "          </div>";
    body += "        </td>";
    body += "        <td>&nbsp;</td>";
    body += "      </tr>";
    body += "    </table>";
    body += "  </body>";
    body += "</html>";
  } catch (error) {
    throw new Error(error.message);
    defaultLogger.error(`[main]: ${error}`);
  }
}

// main
async function main() {
  defaultLogger.info("[main]       : Program start.");
  try {
    await makeRequest();
    await sendEmail(from, to, subject, body);
    defaultLogger.info("[main]       : Program End.");
  } catch (error) {
    defaultLogger.error(error);
  }
}

main();
