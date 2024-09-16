import { NS } from "@ns";
import { scanServers } from "util/scan-servers";

/** @param {NS} ns */
export async function main(ns: NS) {
  const servers = scanServers(ns);
  for (const server of servers) {
    ns.tprint(server[0]);
  }
}
