import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
  const target = ns.args[0] as string;
  // Defines how much money a server should have before we hack it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const moneyThresh = ns.args[1] as number;
  // Defines the minimum security level the target server can
  // have. If the target's security level is higher than this,
  // we'll weaken it before doing anything else
  const securityThresh = ns.args[2] as number;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThresh) {
      // If the server's security level is above our threshold, weaken it
      await ns.weaken(target);
    }
    await ns.sleep(1000);
  }
}
