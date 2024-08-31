import { NS } from "@ns";
import { installHackScript } from "util/install-hack-script";

// purchases and upgrades all purchased servers iteratively
/** @param {NS} ns */
export async function main(ns: NS): Promise<void> {
  const servers = ns.getPurchasedServers();
  // the server to steal from
  const serverToStealFrom = ns.args[0] as string;
  const minMoneyToReserve = ns.args[1] as number | undefined ?? 0;

  // Iterator we'll use for our loop
  let i = servers.length;
  const purchaseCost = ns.getPurchasedServerCost(8);

  while (i < ns.getPurchasedServerLimit()) {
    while (ns.getServerMoneyAvailable("home") < minMoneyToReserve + purchaseCost) {
      await ns.sleep(1000);
    }
    const hostname = ns.purchaseServer("pserv-" + i, 8);
    installHackScript(ns, hostname, serverToStealFrom);
    ++i;
  }
  const updatedServers = ns.getPurchasedServers();

  for (let i = 8; i < 1048576; i *= 2) {
    for (const server of updatedServers) {
      let serverRam = ns.getServerMaxRam(server);
      if (serverRam < i) {
        serverRam = i * 2;
        const upgradeCost = ns.getPurchasedServerUpgradeCost(server, serverRam);
        while (ns.getServerMoneyAvailable("home") < minMoneyToReserve + upgradeCost) {
          await ns.sleep(1000);
        }
        ns.upgradePurchasedServer(server, serverRam);
      }
      ns.killall(server);
      installHackScript(ns, server, serverToStealFrom);
    }
  }
}
