import { NS } from "@ns";

import { installHackScript } from "util/install-hack-script";
import { maxPortsRequired } from "util/max-ports-required";
import { scanServers, ServerData } from "util/scan-servers";

// hack a given server
/** @param {NS} ns */
function hackServer(
  ns: NS,
  server: string,
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hackingLevelRequired,
    portsRequired,
  }: ServerData,
  serverToStealFrom: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  myHackingLevel: number) {
  if (portsRequired > 0) {
    ns.brutessh(server);
  }
  if (portsRequired > 1) {
    ns.ftpcrack(server);
  }
  if (portsRequired > 2) {
    ns.relaysmtp(server);
  }
  if (portsRequired > 3) {
    ns.httpworm(server);
  }
  if (portsRequired > 4) {
    ns.sqlinject(server);
  }
  ns.nuke(server);
  // placeholder for future work, this is unlockable?
  // if (hackingLevelRequired < myHackingLevel) {
  //  ns.installBackDoor(server);
  //}
  installHackScript(ns, server, serverToStealFrom);
}

/** @param {NS} ns */
export async function main(ns: NS) {
  const serverToStealFrom = ns.args[0] as string;
  const myHackingLevel = ns.getHackingLevel();
  const servers = scanServers(ns);
  //ns.tprint("found servers", servers);
  while (servers.size > 0) {
    //for (const [s, data] of servers) {
      //ns.tprint("remaining servers", s, data);
    //}
    const portsRequired = maxPortsRequired(ns);

    for (const [server, data] of servers) {
      //ns.tprint("checking server", server, data);
      if (!data.hackable) {
        servers.delete(server);
      }
      if (data.portsRequired <= portsRequired) {
        hackServer(ns, server, data, serverToStealFrom, myHackingLevel);
        servers.delete(server);
      }
    }
    await ns.sleep(1000);
  }
}
