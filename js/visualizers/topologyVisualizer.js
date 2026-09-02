// Interactive Topology Explorer & Device Inspector Visualizer
class TopologyVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      selectedNode: "client"
    };
    this.nodes = {
      client: {
        id: "client",
        name: "Engineer Workstation (You)",
        icon: "💻",
        role: "Host Endpoint",
        subnet: "192.168.1.0/24",
        ip: "192.168.1.10",
        mac: "02:42:AC:11:00:02",
        gateway: "192.168.1.1",
        dns: "1.1.1.1",
        routes: [
          { dest: "127.0.0.0/8", gw: "0.0.0.0", iface: "lo" },
          { dest: "192.168.1.0/24", gw: "0.0.0.0", iface: "eth0" },
          { dest: "0.0.0.0/0 (Default)", gw: "192.168.1.1", iface: "eth0" }
        ],
        ports: [
          { port: 22, proto: "TCP", name: "sshd", state: "LISTEN" },
          { port: 3000, proto: "TCP", name: "node (web app)", state: "LISTEN" }
        ],
        desc: "Your local Linux workstation. Packets destined for addresses outside 192.168.1.0/24 are sent to default gateway 192.168.1.1."
      },
      switch1: {
        id: "switch1",
        name: "Building L2 Switch",
        icon: "🔀",
        role: "Layer 2 Bridge",
        subnet: "192.168.1.0/24",
        ip: "Unmanaged / None",
        mac: "N/A (Transparent L2)",
        gateway: "N/A",
        dns: "N/A",
        routes: [],
        macTable: [
          { port: 1, mac: "02:42:AC:11:00:02", host: "client (192.168.1.10)" },
          { port: 2, mac: "02:42:AC:11:00:50", host: "internal-app (192.168.1.50)" },
          { port: 24, mac: "02:42:AC:11:00:01", host: "gateway-router (192.168.1.1)" }
        ],
        ports: [],
        desc: "Switches frames purely using MAC addresses. Does not examine IP headers. Connects local devices together at full wire speed."
      },
      router: {
        id: "router",
        name: "Gateway Router (L3 Edge)",
        icon: "🌐",
        role: "Layer 3 Router & NAT Gateway",
        subnet: "Dual Interface: 192.168.1.0/24 & 10.0.0.0/16",
        ip: "eth0: 192.168.1.1 | eth1: 10.0.0.1",
        mac: "eth0: 02:42:AC:11:00:01 | eth1: 02:42:AC:10:00:01",
        gateway: "ISP Uplink",
        dns: "1.1.1.1",
        routes: [
          { dest: "192.168.1.0/24", gw: "Direct (eth0)", iface: "eth0" },
          { dest: "10.0.0.0/16", gw: "Direct (eth1)", iface: "eth1" },
          { dest: "0.0.0.0/0", gw: "198.51.100.1 (ISP)", iface: "eth2" }
        ],
        ports: [
          { port: 53, proto: "UDP", name: "dnsmasq-cache", state: "LISTEN" }
        ],
        desc: "The boundary between subnets. Inspects Destination IP, decrements TTL, re-calculates IP checksum, and forwards across physical interfaces."
      },
      dnsServer: {
        id: "dnsServer",
        name: "DNS Resolver Server",
        icon: "📡",
        role: "DNS Recursive Nameserver",
        subnet: "Public Internet (Anycast)",
        ip: "1.1.1.1",
        mac: "52:54:00:12:34:56",
        gateway: "Upstream Transit",
        dns: "Self",
        routes: [
          { dest: "0.0.0.0/0", gw: "BGP Anycast Edge", iface: "eth0" }
        ],
        ports: [
          { port: 53, proto: "UDP", name: "named (DNS Query Engine)", state: "LISTEN" },
          { port: 53, proto: "TCP", name: "named (Zone Transfers)", state: "LISTEN" },
          { port: 853, proto: "TCP", name: "DoT (DNS over TLS)", state: "LISTEN" }
        ],
        desc: "High-performance public DNS resolver that receives UDP queries on port 53, walks the root/TLD hierarchy, and returns numeric A/AAAA records."
      },
      webServer: {
        id: "webServer",
        name: "Production Web Server",
        icon: "🗄️",
        role: "HTTPS Application Host",
        subnet: "10.0.0.0/16",
        ip: "10.0.0.50",
        mac: "02:42:AC:10:00:50",
        gateway: "10.0.0.1",
        dns: "1.1.1.1",
        routes: [
          { dest: "10.0.0.0/16", gw: "Direct", iface: "eth0" },
          { dest: "0.0.0.0/0", gw: "10.0.0.1", iface: "eth0" }
        ],
        ports: [
          { port: 80, proto: "TCP", name: "nginx (HTTP)", state: "LISTEN" },
          { port: 443, proto: "TCP", name: "nginx (HTTPS / TLS 1.3)", state: "LISTEN" }
        ],
        desc: "Linux server hosting web APIs. Listens on TCP port 80 and port 443 with TLS certificates installed."
      }
    };
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    const node = this.nodes[this.state.selectedNode] || this.nodes.client;

    this.container.innerHTML = `
      <div class="vis-wrapper topo-vis">
        <div class="vis-header">
          <div class="vis-title">
            <span class="pulse-dot"></span>
            <strong>Interactive Multi-Node Network Topology Explorer</strong>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Click any device to inspect its kernel network tables</span>
        </div>

        <div class="topo-diagram-layout">
          <!-- Topology Nodes Map -->
          <div class="topo-nodes-grid">
            ${Object.values(this.nodes).map(n => `
              <div class="topo-node-card ${n.id === this.state.selectedNode ? 'topo-node-active' : ''}" data-node="${n.id}">
                <div class="topo-icon">${n.icon}</div>
                <strong>${n.name}</strong>
                <small>${n.ip}</small>
                <span class="badge-role">${n.role}</span>
              </div>
            `).join('')}
          </div>

          <!-- Device Kernel Inspector -->
          <div class="device-inspector-panel">
            <div class="device-header">
              <div class="dev-title-row">
                <span class="dev-icon">${node.icon}</span>
                <div>
                  <h4>${node.name}</h4>
                  <small>${node.role}</small>
                </div>
              </div>
              <button class="btn-vis btn-subtle" onclick="TerminalApp.runSampleCommand('ping ${node.ip.split(' ')[0]}')">Ping This Host ↵</button>
            </div>

            <p class="dev-desc">${node.desc}</p>

            <div class="dev-specs-grid">
              <div class="spec-item">
                <span class="spec-label">IP Address</span>
                <code>${node.ip}</code>
              </div>
              <div class="spec-item">
                <span class="spec-label">MAC Address</span>
                <code>${node.mac}</code>
              </div>
              <div class="spec-item">
                <span class="spec-label">Subnet</span>
                <code>${node.subnet}</code>
              </div>
              <div class="spec-item">
                <span class="spec-label">Default Gateway</span>
                <code>${node.gateway}</code>
              </div>
            </div>

            ${node.macTable ? `
              <div class="kernel-table-wrap">
                <strong>Hardware L2 MAC Forwarding Table:</strong>
                <table class="kernel-table">
                  <thead><tr><th>Switch Port</th><th>MAC Address</th><th>Connected Host</th></tr></thead>
                  <tbody>
                    ${node.macTable.map(m => `<tr><td>Port ${m.port}</td><td><code>${m.mac}</code></td><td>${m.host}</td></tr>`).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            ${node.routes.length > 0 ? `
              <div class="kernel-table-wrap">
                <strong>Kernel Routing Table (<code>ip route</code>):</strong>
                <table class="kernel-table">
                  <thead><tr><th>Destination</th><th>Gateway</th><th>Interface</th></tr></thead>
                  <tbody>
                    ${node.routes.map(r => `<tr><td><code>${r.dest}</code></td><td>${r.gw}</td><td><code>${r.iface}</code></td></tr>`).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            ${node.ports.length > 0 ? `
              <div class="kernel-table-wrap">
                <strong>Listening Sockets / Ports (<code>netstat -tlpn</code>):</strong>
                <table class="kernel-table">
                  <thead><tr><th>Proto</th><th>Port</th><th>Process</th><th>State</th></tr></thead>
                  <tbody>
                    ${node.ports.map(p => `<tr><td>${p.proto}</td><td><code>${p.port}</code></td><td>${p.name}</td><td><span class="badge-listen">${p.state}</span></td></tr>`).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Bind click events
    this.container.querySelectorAll(".topo-node-card").forEach(card => {
      card.addEventListener("click", () => {
        this.state.selectedNode = card.dataset.node;
        this.render();
      });
    });
  }
}

window.TopologyVisualizer = TopologyVisualizer;
