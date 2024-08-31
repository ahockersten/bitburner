import { NS } from "@ns";

/** @param {NS} ns */
export async function main(ns: NS) {
	ns.deleteServer(ns.args[0] as string);
}
