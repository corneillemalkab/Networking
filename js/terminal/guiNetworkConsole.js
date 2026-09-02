// Interactive RouterOS / Cloud Network Management Web GUI
class GUINetworkConsole {
  constructor(mountId) {
    this.container = document.getElementById(mountId);
    this.activeTab = "interfaces"; // 'interfaces', 'dhcp', 'firewall', 'vlans', 'routes'
    this.interfaces = [
      { name: "eth0 (LAN Uplink)", ip: "192.168.1.1/24", mac: "02:42:AC:11:00:01", status: "UP", speed: "1000 Mbps", rx: "1.4 GB", tx: "842 MB", vlan: "Trunk (10, 20)" },
      { name: "eth1 (PC1 - Eng)", ip: "192.168.10.1/24", mac: "02:42:AC:11:00:10", status: "UP", speed: "1000 Mbps", rx: "420 MB", tx: "310 MB", vlan: "VLAN 10" },
      { name: "eth2 (PC2 - Fin)", ip: "192.168.20.1/24", mac: "02:42:AC:11:00:20", status: "UP", speed: "1000 Mbps", rx: "180 MB", tx: "95 MB", vlan: "VLAN 20" },
      { name: "sfp1 (WAN Fiber)", ip: "203.0.113.45/30", mac: "02:42:AC:11:00:FE", status: "UP", speed: "10 Gbps", rx: "12.8 GB", tx: "8.4 GB", vlan: "Untagged" }
    ];

    this.dhcpLeases = [
      { ip: "192.168.1.10", mac: "02:42:AC:11:00:02", hostname: "engineer-workstation", expires: "23h 45m", status: "Active" },
      { ip: "192.168.1.50", mac: "02:42:AC:11:00:50", hostname: "internal-app-server", expires: "Static Reservation", status: "Static" },
      { ip: "192.168.1.105", mac: "02:42:AC:11:00:99", hostname: "voip-phone-desk1", expires: "18h 12m", status: "Active" }
    ];

    this.firewallRules = [
      { id: 1, action: "ACCEPT", proto: "TCP", src: "0.0.0.0/0", dstPort: "443 (HTTPS)", log: "Enabled", hits: "48,219" },
      { id: 2, action: "ACCEPT", proto: "TCP", src: "0.0.0.0/0", dstPort: "80 (HTTP)", log: "Enabled", hits: "12,840" },
      { id: 3, action: "ACCEPT", proto: "TCP", src: "192.168.1.0/24", dstPort: "22 (SSH)", log: "Enabled", hits: "1,402" },
      { id: 4, action: "DROP", proto: "ALL", src: "0.0.0.0/0", dstPort: "Any (Default Deny)", log: "Enabled", hits: "3,891" }
    ];

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="gui-console-wrapper">
        <!-- GUI Header Bar -->
        <div class="gui-header-bar">
          <div class="gui-brand">
            <span class="gui-icon">🎛️</span>
            <div>
              <strong>RouterOS Cloud GUI</strong>
              <small>Gateway 192.168.1.1 &bull; v7.14</small>
            </div>
          </div>
          <span class="gui-badge-online">● Online</span>
        </div>

        <!-- GUI Navigation Tabs -->
        <div class="gui-nav-tabs">
          <button class="gui-tab-btn ${this.activeTab === 'interfaces' ? 'tab-active' : ''}" data-tab="interfaces">Interfaces</button>
          <button class="gui-tab-btn ${this.activeTab === 'dhcp' ? 'tab-active' : ''}" data-tab="dhcp">DHCP Server</button>
          <button class="gui-tab-btn ${this.activeTab === 'firewall' ? 'tab-active' : ''}" data-tab="firewall">Firewall / NAT</button>
          <button class="gui-tab-btn ${this.activeTab === 'vlans' ? 'tab-active' : ''}" data-tab="vlans">VLANs</button>
        </div>

        <!-- GUI Dynamic Body -->
        <div class="gui-content-body" id="gui-tab-content">
          ${this.renderTabContent()}
        </div>
      </div>
    `;
  }

  renderTabContent() {
    if (this.activeTab === "interfaces") {
      return `
        <div class="gui-pane-content">
          <div class="gui-pane-title">Physical Network Ports & Link Status</div>
          <div class="gui-table-wrap">
            <table class="gui-table">
              <thead>
                <tr>
                  <th>Port</th>
                  <th>Status</th>
                  <th>IP Address</th>
                  <th>VLAN</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${this.interfaces.map((iface, idx) => `
                  <tr>
                    <td><strong>${iface.name}</strong><br><small class="mono-text">${iface.mac}</small></td>
                    <td>
                      <span class="port-status-pill ${iface.status === 'UP' ? 'status-up' : 'status-down'}">
                        ${iface.status}
                      </span>
                    </td>
                    <td><code class="mono-text">${iface.ip}</code></td>
                    <td><span class="gui-vlan-tag">${iface.vlan}</span></td>
                    <td>
                      <button class="btn-gui-toggle" data-iface-idx="${idx}">
                        ${iface.status === 'UP' ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (this.activeTab === "dhcp") {
      return `
        <div class="gui-pane-content">
          <div class="gui-pane-title">Active DHCP Leases & IP Pool (192.168.1.100 - 192.168.1.200)</div>
          <div class="gui-table-wrap">
            <table class="gui-table">
              <thead>
                <tr>
                  <th>Client Hostname</th>
                  <th>Assigned IP</th>
                  <th>MAC Address</th>
                  <th>Lease Expiry</th>
                </tr>
              </thead>
              <tbody>
                ${this.dhcpLeases.map(l => `
                  <tr>
                    <td><strong>${l.hostname}</strong></td>
                    <td><code class="mono-text">${l.ip}</code></td>
                    <td><small class="mono-text">${l.mac}</small></td>
                    <td><span class="lease-time-pill">${l.expires}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (this.activeTab === "firewall") {
      return `
        <div class="gui-pane-content">
          <div class="gui-pane-title">Stateful Firewall Filter Rules</div>
          <div class="gui-table-wrap">
            <table class="gui-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Action</th>
                  <th>Protocol</th>
                  <th>Dest Port</th>
                  <th>Traffic Hits</th>
                </tr>
              </thead>
              <tbody>
                ${this.firewallRules.map(r => `
                  <tr>
                    <td>${r.id}</td>
                    <td><span class="fw-action-pill ${r.action === 'ACCEPT' ? 'fw-accept' : 'fw-drop'}">${r.action}</span></td>
                    <td><code class="mono-text">${r.proto}</code></td>
                    <td><code class="mono-text">${r.dstPort}</code></td>
                    <td><span class="mono-text" style="color:var(--accent-cyan); font-weight:bold;">${r.hits}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (this.activeTab === "vlans") {
      return `
        <div class="gui-pane-content">
          <div class="gui-pane-title">802.1Q Virtual LAN Matrix</div>
          <div class="vlan-gui-cards">
            <div class="vlan-gui-card">
              <div class="vlan-card-head">
                <span class="vlan-id-badge" style="background:rgba(16,185,129,0.2); color:var(--accent-emerald);">VLAN 10</span>
                <strong>ENGINEERING</strong>
              </div>
              <p>Subnet: <code>192.168.10.0/24</code> &bull; Members: <code>eth1 (PC1)</code>, <code>eth0 (Trunk)</code></p>
            </div>
            <div class="vlan-gui-card">
              <div class="vlan-card-head">
                <span class="vlan-id-badge" style="background:rgba(168,85,247,0.2); color:var(--accent-purple);">VLAN 20</span>
                <strong>FINANCE</strong>
              </div>
              <p>Subnet: <code>192.168.20.0/24</code> &bull; Members: <code>eth2 (PC2)</code>, <code>eth0 (Trunk)</code></p>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  }

  bindEvents() {
    this.container.querySelectorAll(".gui-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.render();
      });
    });

    this.container.querySelectorAll(".btn-gui-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-iface-idx"), 10);
        this.interfaces[idx].status = this.interfaces[idx].status === "UP" ? "DOWN" : "UP";
        this.render();
      });
    });
  }
}

window.GUINetworkConsole = GUINetworkConsole;
