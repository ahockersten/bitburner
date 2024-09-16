import { NS } from "@ns";

// buys maxed out hacknet nodes, but will first max out any existing
// nodes
/** @param {NS} ns */
export async function main(ns: NS) {
  const amount = ns.args[0] as number ?? 1;
  let numberOfUnmaxedNodes = 0;
  for (let i = 0; i < ns.hacknet.numNodes(); i++) {
    const nodeStats = ns.hacknet.getNodeStats(i);
    if (!(nodeStats.level === 200 && nodeStats.ram === 64 && nodeStats.cores === 16)) {
      if (!ns.hacknet.upgradeLevel(i, 200)) {
        ns.tprint("Failed to upgrade level of node ", i);
        ns.exit();
      }
      if (!ns.hacknet.upgradeRam(i, 64)) {
        ns.tprint("Failed to upgrade ram of node ", i);
        ns.exit();
      }
      if (!ns.hacknet.upgradeCore(i, 16)) {
        ns.tprint("Failed to upgrade cores of node ", i);
        ns.exit();
      }
        numberOfUnmaxedNodes++;
    }
  }
  if (numberOfUnmaxedNodes > 0) {
    ns.tprint(`Upgraded ${numberOfUnmaxedNodes} nodes`);
  }

  for (let i = 1; i <= amount; i++) {
    const boughtNode = ns.hacknet.purchaseNode();
    if (boughtNode === -1) {
      ns.tprint("Failed to buy node number ", i, " out of ", amount);
      ns.exit();
    }
    if (!ns.hacknet.upgradeLevel(boughtNode, 200)) {
      ns.tprint("Failed to upgrade level of node ", boughtNode);
      ns.exit();
    }
    if (!ns.hacknet.upgradeRam(boughtNode, 64)) {
      ns.tprint("Failed to upgrade ram of node ", boughtNode);
      ns.exit();
    }
    if (!ns.hacknet.upgradeCore(boughtNode, 16)) {
      ns.tprint("Failed to upgrade cores of node ", boughtNode);
      ns.exit();
    }
  }
  ns.tprint(`Bought ${amount} fully upgraded nodes`);
}
