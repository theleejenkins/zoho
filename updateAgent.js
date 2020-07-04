import request from "request-promise-native";

import defaultLogger from "./winston-config.js";
import { options } from "./main.js";
import { updateAgentUrl } from "./params.js";

// update agent
export function updateAgent(allAgents, agent, standbyType) {
  try {
    // Find current Standby agent
    const [agentRecord] = allAgents.filter(
      (datum) => datum.firstName === agent
    );

    // set current Standby agent
    Object.assign(options, {
      method: "PATCH",
      url: `${updateAgentUrl}${agentRecord.id}`,
      body: { aboutInfo: standbyType.toString() },
    });

    var response = request(options).catch(() => {
      defaultLogger.error(`[updateAgent]: Error updating agent: ${error}`);
    });
    if (standbyType)
      defaultLogger.info(`[updateAgent]: Updated ${standbyType} to ${agent}`);
  } catch (error) {
    defaultLogger.error(`[updateAgent]: ${error}`);
  }
  return true;
}
