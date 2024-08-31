import { NS } from "@ns";

/** @param {NS} ns */
export function maxPortsRequired(ns: NS) {
  let maxPortsRequired = 0;
  if (ns.fileExists("BruteSSH.exe")) {
    maxPortsRequired = 1;
  }
  if (ns.fileExists("FTPCrack.exe")) {
    maxPortsRequired = 2;
  }
  if (ns.fileExists("relaySMTP.exe")) {
    maxPortsRequired = 3;
  }
  if (ns.fileExists("HTTPWorm.exe")) {
    maxPortsRequired = 4;
  }
  if (ns.fileExists("SQLInject.exe")) {
    maxPortsRequired = 5;
  }
  return maxPortsRequired;
}
