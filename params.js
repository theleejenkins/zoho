import dotenv from "dotenv";

const result = dotenv.config({ silent: process.env.NODE_ENV === "production" });

if (result.error) {
  throw new Error(result.error);
}

export const standbyRosterUrl = `https://sheet.zoho.com/api/v2/${process.env.STANDBYROSTER}`;
export const getAgentsUrl = "https://desk.zoho.com/api/v1/agents?limit=99";
export const updateAgentUrl = "https://desk.zoho.com/api/v1/agents/";
export const updateTokenParameters = `?refresh_token=${process.env.REFRESHTOKEN}&client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}&grant_type=refresh_token`;
export const updateTokenUrlAddress = `https://accounts.zoho.com/oauth/v2/token${updateTokenParameters}`;
