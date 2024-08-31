import { NS } from "@ns";

import { maxPortsRequired } from "util/max-ports-required";
import { scanServers, ServerData } from "util/scan-servers";

// returns appropriate servers to hack, sorted by max money ASCENDING
/** @param {NS} ns */
export function findHackTargets(ns: NS, ignoreConstraints = false) {
  const servers = scanServers(ns);
  const viableServers = new Map<string, ServerData>();
  const userHackingLevel = ns.getHackingLevel();
  const portsRequired = maxPortsRequired(ns);
  for (const [server, data] of servers) {
    if (ignoreConstraints || (data.hackable &&
        (data.hackingLevelRequired == 1 || data.hackingLevelRequired < userHackingLevel / 2) &&
      data.portsRequired <= portsRequired)) {
      viableServers.set(server, data);
    }
  }
  const sortedServers = Array.from(viableServers.entries()).sort(([aServer, aData], [bServer, bData]) => {
    if (aData.maxMoney < bData.maxMoney) {
      return -1;
    } else if (aData.maxMoney > bData.maxMoney) {
      return 1;
    } else {
      return 0;
    }
  });
  return sortedServers;
}
