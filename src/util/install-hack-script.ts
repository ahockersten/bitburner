import { NS } from "@ns";

/** @param {NS} ns */
export function installHackScript(ns: NS, server: string, target: string) {
  /*ns.scriptKill("util/weaken.js", server);
  ns.scriptKill("util/grow.js", server);
  ns.scriptKill("util/hack.js", server);
  ns.scp("util/weaken.js", server);
  ns.scp("util/grow.js", server);
  ns.scp("util/hack.js", server);

  // Defines how much money a server should have before we hack it
  const moneyThresh = ns.getServerMaxMoney(target) * 0.75;

  // Defines the minimum security level the target server can
  // have. If the target's security level is higher than this,
  // we'll weaken it before doing anything else
  const securityThresh = ns.getServerMinSecurityLevel(target) + 5;

  const weakenUsage = ns.getScriptRam("util/weaken.js");
  const growUsage = ns.getScriptRam("util/grow.js");
  const hackUsage = ns.getScriptRam("util/hack.js");
  const bundledUsage = weakenUsage + growUsage + hackUsage;
  const numThreads = Math.floor(ns.getServerMaxRam(server) / bundledUsage);
  if (numThreads > 0) {
    ns.exec("util/weaken.js", server, numThreads, target, moneyThresh, securityThresh);
    ns.exec("util/grow.js", server, numThreads, target, moneyThresh, securityThresh);
    ns.exec("util/hack.js", server, numThreads, target, moneyThresh, securityThresh);
  }*/

  ns.scriptKill("util/multi-hack.js", server);
  ns.scp("util/multi-hack.js", server);
  const multiHackUsage = ns.getScriptRam("util/multi-hack.js");
  const numThreads = Math.floor(ns.getServerMaxRam(server) / multiHackUsage);
  if (numThreads > 0) {
    ns.exec("util/multi-hack.js", server, numThreads, target);
  }
}
