import { NS } from "@ns";
import { scanServers } from "util/scan-servers"

/** @param {NS} ns */
export async function main(ns: NS) {
  const serverName = ns.args[0] as string;
  const servers = scanServers(ns);
  const route = [];
  let target = serverName;
  while (target !== "home") {
    route.push(target);
    const parent = servers.get(target)?.parent;
    if (!parent) {
      // happens when you pass in a server that does not exist
      ns.tprint("No parent found for target: ", target);
      ns.exit();
    }
    target = parent;
  }
  route.push("home");
  const reversedRoute = route.reverse();
  ns.tprint(reversedRoute.join(" -> "));
}
