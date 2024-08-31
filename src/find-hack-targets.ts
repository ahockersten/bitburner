import { NS } from "@ns";
import { findHackTargets } from "util/find-hack-targets";

/** @param {NS} ns */
export async function main(ns: NS) {
  const ignoreConstraints = ns.args[0] as boolean | undefined ?? false;
  const servers = findHackTargets(ns, ignoreConstraints);
  for (const server of servers) {
    ns.tprint(server);
  }
}
