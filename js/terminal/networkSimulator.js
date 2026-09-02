// Simulated Virtual Network Engine
class MockNetworkSimulator {
  constructor() {
    this.resetNetwork();
  }

  resetNetwork() {
    // Current simulated client host
    this.client = {
      hostname: "engineer-workstation",
      ip: "192.168.1.10",
      netmask: "255.255.255.0",
      cidr: 24,
      mac: "02:42:AC:11:00:02",
      gateway: "192.168.1.1",
      dns: "1.1.1.1",
      listeningPorts: [
        { proto: "tcp", localPort: 22, process: "sshd", state: "LISTEN" },
        { proto: "tcp", localPort: 3000, process: "node (dev-server)", state: "LISTEN" }
      ]
    };

    // Simulated ARP table on client
    this.arpTable = [
      { ip: "192.168.1.1", mac: "02:42:AC:11:00:01", iface: "eth0", type: "dynamic" },
      { ip: "192.168.1.50", mac: "02:42:AC:11:00:50", iface: "eth0", type: "dynamic" }
    ];

    // Simulated DNS Zone Database
    this.dnsDatabase = {
      "google.com": { a: "142.250.190.46", ttl: 300 },
      "cloudflare.com": { a: "104.16.132.229", ttl: 300 },
      "api.github.com": { a: "140.82.121.6", ttl: 300 },
      "mysite.internal": { a: "192.168.1.50", ttl: 120 },
      "dev.local": { a: "192.168.1.10", ttl: 60 },
      "secure.internal": { a: "10.0.0.50", ttl: 300 },
      "api.cluster.local": { a: "192.168.1.99", ttl: 300 } // Intentional mismatch for Challenge 2
    };

    // Network Nodes / Servers in topology
    this.nodes = {
      "192.168.1.1": {
        name: "local-gateway",
        isRouter: true,
        rtt: "0.8 ms",
        ports: {}
      },
      "192.168.1.50": {
        name: "internal-app-server",
        rtt: "1.2 ms",
        ports: {
          8080: {
            service: "http",
            response: "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nHello from Internal App Server (Port 8080)!"
          }
          // Note: Port 80 is closed by default to teach port troubleshooting in Challenge 1!
        }
      },
      "10.0.0.50": {
        name: "remote-web-server",
        rtt: "24.5 ms",
        ports: {
          80: {
            service: "http",
            response: "HTTP/1.1 200 OK\r\nServer: nginx/1.24\r\nContent-Type: text/html\r\n\r\n<html><body><h1>Production Web Server</h1><p>Status: All systems nominal.</p></body></html>"
          },
          443: {
            service: "https",
            tlsCert: "CN=secure.internal, Issuer=Internal-CA, Valid until 2029",
            response: "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"status\":\"authenticated\",\"service\":\"internal-vault\",\"data\":\"ok\"}"
          }
        }
      },
      "1.1.1.1": {
        name: "one.one.one.one",
        rtt: "14.2 ms",
        ports: { 53: { service: "dns" } }
      },
      "8.8.8.8": {
        name: "dns.google",
        rtt: "16.1 ms",
        ports: { 53: { service: "dns" } }
      },
      "10.0.8.2": {
        name: "backup-node",
        rtt: "462.8 ms",
        ports: { 22: { service: "ssh" } }
      }
    };

    // Traceroute hops map
    this.routes = {
      "10.0.0.50": [
        { hop: 1, ip: "192.168.1.1", name: "gateway.local", rtt: "0.9 ms" },
        { hop: 2, ip: "172.16.0.1", name: "core-switch-01.dc", rtt: "4.2 ms" },
        { hop: 3, ip: "10.0.0.1", name: "wan-router-east.net", rtt: "18.6 ms" },
        { hop: 4, ip: "10.0.0.50", name: "remote-web-server", rtt: "24.5 ms" }
      ],
      "1.1.1.1": [
        { hop: 1, ip: "192.168.1.1", name: "gateway.local", rtt: "0.8 ms" },
        { hop: 2, ip: "198.51.100.1", name: "isp-edge-router.net", rtt: "6.4 ms" },
        { hop: 3, ip: "1.1.1.1", name: "one.one.one.one", rtt: "14.2 ms" }
      ],
      "8.8.8.8": [
        { hop: 1, ip: "192.168.1.1", name: "gateway.local", rtt: "0.8 ms" },
        { hop: 2, ip: "198.51.100.1", name: "isp-edge-router.net", rtt: "6.2 ms" },
        { hop: 3, ip: "72.14.238.10", name: "google-peer.net", rtt: "12.8 ms" },
        { hop: 4, ip: "8.8.8.8", name: "dns.google", rtt: "16.1 ms" }
      ],
      "10.0.8.2": [
        { hop: 1, ip: "192.168.1.1", name: "gateway.local", rtt: "0.8 ms" },
        { hop: 2, ip: "172.16.0.1", name: "core-switch-01.dc", rtt: "3.9 ms" },
        { hop: 3, ip: "10.0.8.1", name: "congested-vpn-bridge.internal", rtt: "451.2 ms ⚠️ (Congested link)" },
        { hop: 4, ip: "10.0.8.2", name: "backup-node", rtt: "462.8 ms" }
      ]
    };

    // Active Mission Tracking
    this.currentChallenge = null;
  }

  resolveDNS(domain) {
    const clean = domain.toLowerCase().trim();
    if (this.dnsDatabase[clean]) {
      return this.dnsDatabase[clean].a;
    }
    // If it's already an IP
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(clean)) {
      return clean;
    }
    return null;
  }
}

window.MockNetworkSimulator = MockNetworkSimulator;
