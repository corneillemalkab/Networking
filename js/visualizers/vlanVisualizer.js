// Interactive VLAN, 802.1Q Tagging & Broadcast Domain Isolation Visualizer
class VLANVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      sourcePC: "pc1", // pc1 (VLAN 10), pc2 (VLAN 20), pc3 (VLAN 10), pc4 (VLAN 20)
      trafficType: "broadcast", // 'broadcast' (ARP) or 'unicast' (VLAN 10 to VLAN 10 / VLAN 20)
      interVLAN: false,
      step: 0,
      logs: []
    };
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="vis-wrapper vlan-vis">
        <div class="vis-header">
          <div class="vis-title">
            <span class="pulse-dot"></span>
            <strong>VLAN (Virtual LAN) & 802.1Q Trunking Simulator</strong>
          </div>
          <div class="vis-controls">
            <select id="vlan-src-select" class="vis-select">
              <option value="pc1">PC 1 (Engineering - VLAN 10)</option>
              <option value="pc2">PC 2 (Finance - VLAN 20)</option>
              <option value="pc3">PC 3 (Engineering - VLAN 10)</option>
              <option value="pc4">PC 4 (Finance - VLAN 20)</option>
            </select>
            <button id="vlan-btn-bcast" class="btn-vis btn-accent">Send Broadcast (ARP) ⚡</button>
            <button id="vlan-btn-unicast" class="btn-vis btn-primary">Send Data to PC3 ➔</button>
            <button id="vlan-btn-reset" class="btn-vis btn-subtle">Reset ↺</button>
          </div>
        </div>

        <div class="vlan-options-bar">
          <label class="checkbox-label">
            <input type="checkbox" id="vlan-toggle-router" ${this.state.interVLAN ? 'checked' : ''} />
            <span>Enable Inter-VLAN Routing (Router-on-a-Stick via sub-interfaces eth0.10 & eth0.20)</span>
          </label>
        </div>

        <!-- Multi-Switch & VLAN Topology Map -->
        <div class="vlan-topology-stage">
          
          <!-- Switch 1 Domain -->
          <div class="vlan-switch-zone">
            <div class="switch-title">Building A Switch (L2)</div>
            
            <div class="pc-cluster">
              <div class="pc-card vlan-10-card" id="vlan-pc1">
                <div class="pc-icon">💻</div>
                <strong>PC 1</strong>
                <small>192.168.10.11</small>
                <span class="vlan-badge vlan-10-badge">VLAN 10 (Eng)</span>
                <span class="port-label">Access Port 1</span>
              </div>

              <div class="pc-card vlan-20-card" id="vlan-pc2">
                <div class="pc-icon">💼</div>
                <strong>PC 2</strong>
                <small>192.168.20.12</small>
                <span class="vlan-badge vlan-20-badge">VLAN 20 (Fin)</span>
                <span class="port-label">Access Port 2</span>
              </div>
            </div>

            <div class="vlan-switch-body" id="vlan-sw1">
              <div class="sw-name">Switch 1</div>
              <div class="sw-status" id="sw1-status">Monitoring Ports</div>
            </div>
          </div>

          <!-- Trunk Link Between Switches -->
          <div class="trunk-link-zone">
            <div class="trunk-cable" id="vlan-trunk-line">
              <div class="trunk-packet" id="trunk-packet-indicator">
                <span class="tag-8021q">802.1Q Tag: VID <strong id="trunk-vid-display">10</strong></span>
              </div>
            </div>
            <div class="trunk-legend">
              <strong>802.1Q Trunk Link (Port 24)</strong>
              <small>Carries both VLAN 10 & 20 traffic with 4-byte 802.1Q header tag</small>
            </div>
          </div>

          <!-- Switch 2 Domain -->
          <div class="vlan-switch-zone">
            <div class="switch-title">Building B Switch (L2)</div>

            <div class="vlan-switch-body" id="vlan-sw2">
              <div class="sw-name">Switch 2</div>
              <div class="sw-status" id="sw2-status">Monitoring Ports</div>
            </div>

            <div class="pc-cluster">
              <div class="pc-card vlan-10-card" id="vlan-pc3">
                <div class="pc-icon">💻</div>
                <strong>PC 3</strong>
                <small>192.168.10.33</small>
                <span class="vlan-badge vlan-10-badge">VLAN 10 (Eng)</span>
                <span class="port-label">Access Port 1</span>
              </div>

              <div class="pc-card vlan-20-card" id="vlan-pc4">
                <div class="pc-icon">💼</div>
                <strong>PC 4</strong>
                <small>192.168.20.44</small>
                <span class="vlan-badge vlan-20-badge">VLAN 20 (Fin)</span>
                <span class="port-label">Access Port 2</span>
              </div>
            </div>
          </div>

        </div>

        <!-- 802.1Q Frame Format & Technical Log -->
        <div class="vis-stage-grid">
          <div class="vis-panel">
            <div class="panel-heading">
              <span>802.1Q Tag Format Dissector (Inserted on Trunk)</span>
            </div>
            <div class="tag-dissector-box">
              <div class="ethernet-frame-bar">
                <div class="frame-chunk">Dst MAC<br><small>6 Bytes</small></div>
                <div class="frame-chunk">Src MAC<br><small>6 Bytes</small></div>
                <div class="frame-chunk chunk-tag">
                  <strong>802.1Q Tag</strong><br>
                  <small>4 Bytes (0x8100 + VID)</small>
                </div>
                <div class="frame-chunk">EtherType<br><small>2 Bytes (0x0800)</small></div>
                <div class="frame-chunk chunk-data">IP Payload Data</div>
                <div class="frame-chunk">CRC / FCS<br><small>4 Bytes</small></div>
              </div>
              <div class="tag-breakdown">
                <div><strong>TPID (0x8100):</strong> Identifies frame as 802.1Q tagged</div>
                <div><strong>PCP (3 bits):</strong> Priority Code Point (Quality of Service)</div>
                <div><strong>VID (12 bits):</strong> VLAN Identifier (<span id="vid-active-num">10</span>)</div>
              </div>
            </div>
          </div>

          <div class="vis-panel">
            <div class="panel-heading">
              <span>VLAN Forwarding & Security Log</span>
            </div>
            <div class="vlan-log-box" id="vlan-log-box">
              <div class="log-line">Ready. Select a source PC and send traffic to observe broadcast domain isolation.</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind listeners
    const srcSelect = this.container.querySelector("#vlan-src-select");
    srcSelect.addEventListener("change", (e) => {
      this.state.sourcePC = e.target.value;
      this.resetVisual();
    });

    this.container.querySelector("#vlan-btn-bcast").addEventListener("click", () => this.simulateTraffic("broadcast"));
    this.container.querySelector("#vlan-btn-unicast").addEventListener("click", () => this.simulateTraffic("unicast"));
    this.container.querySelector("#vlan-btn-reset").addEventListener("click", () => this.resetVisual());

    this.container.querySelector("#vlan-toggle-router").addEventListener("change", (e) => {
      this.state.interVLAN = e.target.checked;
      this.addLog(`Inter-VLAN Routing ${this.state.interVLAN ? 'ENABLED (Router configured with sub-interfaces eth0.10 & eth0.20)' : 'DISABLED'}`);
    });
  }

  resetVisual() {
    ["pc1", "pc2", "pc3", "pc4"].forEach(id => {
      const el = this.container.querySelector(`#vlan-${id}`);
      if (el) el.classList.remove("pc-broadcasting", "pc-received", "pc-blocked");
    });
    const pkt = this.container.querySelector("#trunk-packet-indicator");
    if (pkt) pkt.classList.remove("packet-in-transit");
  }

  addLog(msg) {
    const box = this.container.querySelector("#vlan-log-box");
    const div = document.createElement("div");
    div.className = "log-line";
    div.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  simulateTraffic(type) {
    this.resetVisual();
    const src = this.state.sourcePC;
    const isEng = (src === "pc1" || src === "pc3");
    const vid = isEng ? 10 : 20;
    const groupName = isEng ? "Engineering (VLAN 10)" : "Finance (VLAN 20)";

    this.container.querySelector("#vid-active-num").textContent = vid;
    this.container.querySelector("#trunk-vid-display").textContent = vid;

    const srcEl = this.container.querySelector(`#vlan-${src}`);
    if (srcEl) srcEl.classList.add("pc-broadcasting");

    if (type === "broadcast") {
      this.addLog(`⚡ <strong>${src.toUpperCase()}</strong> transmits L2 Broadcast Frame (Dst MAC: <code>ff:ff:ff:ff:ff:ff</code>) on Access Port.`);
      this.addLog(`Switch 1 receives untagged frame on Port mapped to <strong>${groupName}</strong>.`);
      this.addLog(`Switch 1 inserts <strong>4-byte 802.1Q Tag (VID: ${vid})</strong> and forwards frame across Trunk Link.`);

      const pkt = this.container.querySelector("#trunk-packet-indicator");
      if (pkt) pkt.classList.add("packet-in-transit");

      setTimeout(() => {
        this.addLog(`Switch 2 receives tagged frame on Trunk, inspects VID = ${vid}, strips 802.1Q tag, and broadcasts ONLY to ports assigned to <strong>${groupName}</strong>.`);

        // Target matching PC
        const targetId = isEng ? "pc3" : "pc4";
        const blockedId = isEng ? "pc4" : "pc3";
        const otherLocalBlocked = isEng ? "pc2" : "pc1";

        const tgtEl = this.container.querySelector(`#vlan-${targetId}`);
        const blkEl = this.container.querySelector(`#vlan-${blockedId}`);
        const locBlk = this.container.querySelector(`#vlan-${otherLocalBlocked}`);

        if (tgtEl) tgtEl.classList.add("pc-received");
        if (blkEl) blkEl.classList.add("pc-blocked");
        if (locBlk) locBlk.classList.add("pc-blocked");

        this.addLog(`🛡️ <strong>Broadcast Isolation Success:</strong> ${targetId.toUpperCase()} received the frame. ${blockedId.toUpperCase()} and other departments received ZERO broadcast noise!`);
      }, 800);

    } else {
      // Unicast
      this.addLog(`➔ <strong>${src.toUpperCase()}</strong> sends Unicast packet to PC3 (192.168.10.33).`);
      if (isEng) {
        this.addLog(`Direct L2 VLAN communication: Both hosts share VLAN 10. Frame delivered across Trunk without L3 routing.`);
        const pkt = this.container.querySelector("#trunk-packet-indicator");
        if (pkt) pkt.classList.add("packet-in-transit");
        setTimeout(() => {
          const tgt = this.container.querySelector("#vlan-pc3");
          if (tgt) tgt.classList.add("pc-received");
          this.addLog(`✅ PC 3 received unicast data packet.`);
        }, 800);
      } else {
        if (this.state.interVLAN) {
          this.addLog(`🌐 Inter-VLAN Routing Active: Packet forwarded to Router sub-interface eth0.20, routed across subnets to eth0.10, and delivered to PC3.`);
        } else {
          this.addLog(`❌ Cross-VLAN Drop: Source is on VLAN 20, destination is on VLAN 10. L2 Switch isolates them completely. Enable Inter-VLAN Routing to route across subnets!`);
        }
      }
    }
  }
}

window.VLANVisualizer = VLANVisualizer;
