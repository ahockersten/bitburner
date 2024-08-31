import { NS } from "@ns";
import { findHackTargets } from "util/find-hack-targets";
import { scanServers, ServerData } from "./util/scan-servers";
import { maxPortsRequired } from "./util/max-ports-required";

/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  const minMoney = (ns.args[0] as number | undefined ?? 0) * 1_000_000;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const myHackingLevel = ns.getHackingLevel();
    const portsRequired = maxPortsRequired(ns);
    const purchasedServers = ns.getPurchasedServers();
    const allServers = scanServers(ns);
    const hackedServers = new Map<string, ServerData>();
    for (const [server, data] of allServers.entries()) {
      if (data.hackable &&
        data.hackingLevelRequired < myHackingLevel &&
        data.portsRequired < portsRequired) {
        hackedServers.set(server, data);
      }
    }
    const servers = findHackTargets(ns);
    for (const [server, data] of servers.reverse()) {

    }

    await ns.sleep(1000);
  }

}
