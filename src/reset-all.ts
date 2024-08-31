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
  let currentTargetName: string | undefined = ns.args[1] as string | undefined;
  // if money has decreased, we have successfully extracted money from
  // this server and are allowed to move on to the next one
  // initialized to infinity to get the ball rolling on the first target
  let initialMoney = Infinity;
  // eslint-disable-next-line no-constant-condition

  if (currentTargetName) {
    ns.killall("home", true);
    initialMoney = ns.getServerMoneyAvailable(currentTargetName);
    ns.toast("Switching to requested target: " + currentTargetName, "info");
    ns.exec("purchase-and-upgrade-servers.js", "home", 1, currentTargetName, minMoney);
    ns.exec("restart-purchased-servers.js", "home", 1, currentTargetName);
    ns.exec("hack-servers.js", "home", 1, currentTargetName);
    installHackScript(ns, "home", currentTargetName);
  }
  while (true) {
    const servers = findHackTargets(ns);
    const [currentTarget, currentData ]: [string | undefined, ServerData | undefined] = currentTargetName ?
      servers.find(([n, d]) => currentTargetName == n) as [string, ServerData] : [undefined, undefined];
    const [nextTarget, nextData] = servers.at(-1) as [string, ServerData];
    const moneyHasDecreased = !currentData || currentData.moneyAvailable < initialMoney;
    if (currentTarget !== nextTarget && moneyHasDecreased) {
      ns.killall("home", true);
      ns.toast("Switching to new target: " + nextTarget, "info");
      //ns.exec("command-and-control.js", "home", 1, minMoney);
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
