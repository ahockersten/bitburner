import { NS } from "@ns";

import { installHackScript } from "util/install-hack-script";

// restarts all of the purchased servers
/** @param {NS} ns */
export async function main(ns: NS) {
  const servers = ns.getPurchasedServers();
  // the server to steal from
  const serverToStealFrom = ns.args[0] as string;

  for (const server of servers) {
    ns.killall(server);
    installHackScript(ns, server, serverToStealFrom);
  }
}
