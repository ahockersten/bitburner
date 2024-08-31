import { NS } from "@ns";

import { installHackScript } from "util/install-hack-script";
import { findHackTargets } from "util/find-hack-targets";
import { ServerData } from "./util/scan-servers";

// resets all hacking efforts to the best possible target
// params:
// 0: number, the number of MILLIONS of money that should be preserved
/** @param {NS} ns */
export async function main(ns: NS) {
  const minMoney = (ns.args[0] as number | undefined ?? 0) * 1_000_000;
  let currentTargetName: string | null = null;
  // if money has decreased, we have successfully extracted money from
  // this server and are allowed to move on to the next one
  // initialized to 0 to get the ball rolling on the first target
  let initialMoney = Infinity;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const servers = findHackTargets(ns);
    //@ts-expect-error I don't know why this happens
    const [currentTarget, currentData ]: [string, ServerData] = currentTargetName ?
      servers.find(([n, d]) => currentTargetName == n) as [string, ServerData] : ["", {} as ServerData];
    const [nextTarget, nextData] = servers.at(-1) as [string, ServerData];
    const moneyHasDecreased = !currentData || currentData.moneyAvailable < initialMoney;
    if (currentTarget !== nextTarget && moneyHasDecreased) {
      ns.killall("home", true);
      ns.exec("purchase-and-upgrade-servers.js", "home", 1, nextTarget, minMoney);
      ns.exec("restart-purchased-servers.js", "home", 1, nextTarget);
      ns.exec("hack-servers.js", "home", 1, nextTarget);
      installHackScript(ns, "home", nextTarget);
      initialMoney = nextData.moneyAvailable;
      currentTargetName = nextTarget;
    }
    // every second, re-evaluate if we should target a new server
    await ns.sleep(1000);
  }
}
