import { NS } from "@ns";

export interface ServerData {
  depth: number;
  scanned: boolean;
  hackable: boolean;
  hackingLevelRequired: number;
  maxMoney: number;
  moneyAvailable: number;
  portsRequired: number;
  ram: number;
  parent: string;
}

// scans all servers up to a certain depth, starting at home
// tags (but does not remove) personal servers and blacklisted
// servers (see below)
/** @param {NS} ns */
export function scanServers(ns: NS, maxDepth?: number) {
  maxDepth = maxDepth ?? 50;
  const servers = new Map<string, ServerData>();
  servers.set("home", {
    depth: 0,
    scanned: false
    // FIXME this data type is a bit too open. We should probably
    // only return data for scanned servers or something?
  } as ServerData);
  let foundNewServer = false;
  do {
    foundNewServer = false;
    for (const [server, data] of servers) {
      if (!data.scanned) {
        if (data.depth < maxDepth) {
          const connectedHosts = ns.scan(server);
          for (const host of connectedHosts) {
            const existingEntry = servers.get(host);
            if (existingEntry) {
              if (existingEntry.depth > data.depth + 1) {
                servers.set(host, {
                  ...existingEntry,
                  depth: data.depth + 1,
                  parent: server,
                });
              }
            } else {
              servers.set(host, {
                depth: data.depth + 1,
                parent: server,
                scanned: false
                // FIXME see above
              } as ServerData)
              foundNewServer = true;
            }
          }
        }
        const portsRequired = ns.getServerNumPortsRequired(server);
        const ram = ns.getServerMaxRam(server);
        const hackingLevelRequired = ns.getServerRequiredHackingLevel(server);
        const maxMoney = ns.getServerMaxMoney(server);
        const moneyAvailable = ns.getServerMoneyAvailable(server);
        const blackListedServers = ["darkweb", "home"];
        const hackable = !(blackListedServers.includes(server) || server.startsWith("pserv-"))
        servers.set(server, {
          ...data,
          hackable,
          hackingLevelRequired,
          maxMoney,
          moneyAvailable,
          portsRequired,
          ram,
          scanned: true
        });
      }
    }
  } while (foundNewServer)

  return servers;
}
