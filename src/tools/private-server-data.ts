import { NS } from "@ns";
import { scanServers } from "../util/scan-servers";

/** @param {NS} ns */
export async function main(ns: NS) {
  const servers = scanServers(ns);
  const privateServers = new Map();
  for (const [server, data] of servers) {
    if (server.startsWith("pserv-")) {
      privateServers.set(server, data);
    }
  }
  for (const server of privateServers) {
    ns.tprint(server);
  }
}
