// Interactive Packet Journey & Encapsulation Visualizer
class PacketJourneyVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      message: "Hello Server!",
      mtu: 4, // chars per packet for easy visual inspection
      step: 0,
      isPlaying: false,
      speed: 1000,
      packets: [],
      activePacketIndex: 0,
      currentHop: "client", // 'client', 'switch', 'router', 'server'
    };
    this.timer = null;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.preparePackets();
  }

  preparePackets() {
    const text = this.state.message || "Hi";
    const chunks = [];
    for (let i = 0; i < text.length; i += this.state.mtu) {
      chunks.push(text.slice(i, i + this.state.mtu));
    }

    this.state.packets = chunks.map((chunk, idx) => {
      const bytes = Array.from(chunk).map(c => c.charCodeAt(0).toString(2).padStart(8, '0'));
      return {
        id: idx + 1,
        total: chunks.length,
        text: chunk,
        bytes: bytes,
        hex: Array.from(chunk).map(c => '0x' + c.charCodeAt(0).toString(16).toUpperCase()).join(' '),
        headers: {
          l4: { proto: "TCP", srcPort: "54321", dstPort: "80", seq: (idx * 4) + 1000 },
          l3: { proto: "IPv4", srcIP: "192.168.1.10", dstIP: "10.0.0.50", ttl: 64 },
          l2: { proto: "Ethernet II", srcMAC: "02:42:AC:11:00:02", dstMAC: "02:42:AC:11:00:01" }
        },
        progress: 0, // 0: Client RAM, 1: L4 TCP Seg, 2: L3 IP Pkt, 3: L2 Eth Frame, 4: Switch, 5: Router, 6: Server RAM
        status: "queued"
      };
    });
    this.state.activePacketIndex = 0;
    this.updateDisplay();
  }

  render() {
    this.container.innerHTML = `
      <div class="vis-wrapper packet-vis">
        <div class="vis-header">
          <div class="vis-title">
            <span class="pulse-dot"></span>
            <strong>Packet Slicing & Network Hop Simulator</strong>
          </div>
          <div class="vis-controls">
            <input type="text" id="pj-msg-input" class="vis-input" value="${this.state.message}" maxlength="24" placeholder="Enter message text..." />
            <button id="pj-btn-load" class="btn-vis btn-secondary">Load Data</button>
            <button id="pj-btn-step" class="btn-vis btn-primary">Step Next ⏭</button>
            <button id="pj-btn-play" class="btn-vis btn-accent">Auto Play ▶</button>
            <button id="pj-btn-reset" class="btn-vis btn-subtle">Reset ↺</button>
          </div>
        </div>

        <div class="vis-network-map">
          <div class="net-node node-client active-node" id="node-client">
            <div class="node-icon">💻</div>
            <div class="node-name">Client Workstation</div>
            <div class="node-ip">192.168.1.10</div>
            <div class="node-mac">MAC: 02:42:AC:11:00:02</div>
          </div>

          <div class="net-wire wire-1">
            <div class="packet-tracer" id="tracer-1"></div>
            <span class="wire-label">Local Link (Cat6 Cable)</span>
          </div>

          <div class="net-node node-switch" id="node-switch">
            <div class="node-icon">🔀</div>
            <div class="node-name">Local L2 Switch</div>
            <div class="node-badge">Inspects MAC Table</div>
          </div>

          <div class="net-wire wire-2">
            <div class="packet-tracer" id="tracer-2"></div>
            <span class="wire-label">Internal Gateway Link</span>
          </div>

          <div class="net-node node-router" id="node-router">
            <div class="node-icon">🌐</div>
            <div class="node-name">L3 Router / Gateway</div>
            <div class="node-ip">192.168.1.1 ➔ 10.0.0.1</div>
            <div class="node-badge">Inspects IP Table</div>
          </div>

          <div class="net-wire wire-3">
            <div class="packet-tracer" id="tracer-3"></div>
            <span class="wire-label">Wide Area Network Link</span>
          </div>

          <div class="net-node node-server" id="node-server">
            <div class="node-icon">🗄️</div>
            <div class="node-name">Application Server</div>
            <div class="node-ip">10.0.0.50 (Port 80)</div>
            <div class="node-mac">MAC: 02:42:AC:11:00:99</div>
          </div>
        </div>

        <div class="vis-stage-grid">
          <!-- Left: Packet Encapsulation Inspector -->
          <div class="vis-panel">
            <div class="panel-heading">
              <span>Encapsulation / Header Inspector (Packet <span id="pj-cur-pkt-num">1</span> of <span id="pj-tot-pkt-num">3</span>)</span>
            </div>
            <div class="encapsulation-stack" id="pj-stack">
              <!-- Dynamically populated -->
            </div>
          </div>

          <!-- Right: Binary & Wire Inspector -->
          <div class="vis-panel">
            <div class="panel-heading">
              <span>Memory & Wire Buffer State</span>
            </div>
            <div class="wire-state-box" id="pj-wire-state">
              <!-- Dynamically populated -->
            </div>
            <div class="explanation-box" id="pj-explanation">
              <!-- Dynamic step-by-step technical explanation -->
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind event listeners
    this.container.querySelector("#pj-btn-load").addEventListener("click", () => {
      const val = this.container.querySelector("#pj-msg-input").value;
      this.state.message = val || "Hello";
      this.reset();
    });

    this.container.querySelector("#pj-btn-step").addEventListener("click", () => this.stepForward());
    this.container.querySelector("#pj-btn-play").addEventListener("click", () => this.togglePlay());
    this.container.querySelector("#pj-btn-reset").addEventListener("click", () => this.reset());
  }

  togglePlay() {
    const playBtn = this.container.querySelector("#pj-btn-play");
    if (this.state.isPlaying) {
      clearInterval(this.timer);
      this.state.isPlaying = false;
      playBtn.textContent = "Auto Play ▶";
      playBtn.classList.remove("btn-active");
    } else {
      this.state.isPlaying = true;
      playBtn.textContent = "Pause ⏸";
      playBtn.classList.add("btn-active");
      this.timer = setInterval(() => {
        const finished = this.stepForward();
        if (finished) {
          this.togglePlay();
        }
      }, this.state.speed);
    }
  }

  stepForward() {
    const pkt = this.state.packets[this.state.activePacketIndex];
    if (!pkt) return true;

    pkt.progress += 1;

    // Explanations per progress step:
    if (pkt.progress > 6) {
      if (this.state.activePacketIndex < this.state.packets.length - 1) {
        this.state.activePacketIndex += 1;
        this.state.packets[this.state.activePacketIndex].progress = 1;
      } else {
        // All packets delivered!
        this.updateDisplay();
        return true;
      }
    }

    this.updateDisplay();
    return false;
  }

  reset() {
    if (this.state.isPlaying) this.togglePlay();
    this.preparePackets();
  }

  updateDisplay() {
    const pkt = this.state.packets[this.state.activePacketIndex];
    if (!pkt) return;

    this.container.querySelector("#pj-cur-pkt-num").textContent = pkt.id;
    this.container.querySelector("#pj-tot-pkt-num").textContent = pkt.total;

    // Highlight active nodes
    const nodes = ["client", "switch", "router", "server"];
    nodes.forEach(n => {
      const el = this.container.querySelector(`#node-${n}`);
      if (el) el.classList.remove("active-node", "pulse-node");
    });

    let activeNodeId = "client";
    let explanationText = "";
    let tracerIdx = null;

    switch (pkt.progress) {
      case 0:
      case 1:
        activeNodeId = "client";
        explanationText = `<strong>Step 1: Application Data & Transport Layer (L4)</strong><br>
        Application memory holds <code>"${pkt.text}"</code>. Sliced as Packet #${pkt.id} of ${pkt.total}.
        The operating system adds a <strong>TCP Header</strong> specifying <strong>Source Port ${pkt.headers.l4.srcPort}</strong> and <strong>Destination Port ${pkt.headers.l4.dstPort}</strong> (Sequence: ${pkt.headers.l4.seq}).`;
        break;
      case 2:
        activeNodeId = "client";
        explanationText = `<strong>Step 2: Network Layer Encapsulation (L3)</strong><br>
        The OS attaches the <strong>IPv4 Header</strong>. It stamps <strong>Source IP ${pkt.headers.l3.srcIP}</strong> and <strong>Destination IP ${pkt.headers.l3.dstIP}</strong>, with initial TTL (Time-To-Live) = 64.`;
        break;
      case 3:
        activeNodeId = "client";
        explanationText = `<strong>Step 3: Data Link Frame Framing (L2)</strong><br>
        The Network Interface Card wraps the packet in an <strong>Ethernet Frame</strong>. Destination MAC is set to the local switch / gateway: <code>${pkt.headers.l2.dstMAC}</code>. The frame is converted to electrical/optical signals on the wire.`;
        tracerIdx = 1;
        break;
      case 4:
        activeNodeId = "switch";
        explanationText = `<strong>Step 4: L2 Switch Processing</strong><br>
        The switch reads the <strong>Destination MAC</strong>. It checks its internal MAC forwarding table in hardware memory and forwards the frame out port #2 toward the gateway router without modifying IP headers.`;
        tracerIdx = 2;
        break;
      case 5:
        activeNodeId = "router";
        explanationText = `<strong>Step 5: L3 Router Hop & Routing Table Lookup</strong><br>
        The router strips the incoming Ethernet frame, inspects the <strong>Destination IP (${pkt.headers.l3.dstIP})</strong>, decrements TTL to 63, updates the next-hop MAC address, and emits the frame toward the server's subnet.`;
        tracerIdx = 3;
        break;
      case 6:
        activeNodeId = "server";
        explanationText = `<strong>Step 6: Server Decapsulation & Process Delivery</strong><br>
        The server NIC receives the frame, verifies the checksum, strips the L2 & L3 headers, and passes <code>"${pkt.text}"</code> to the socket listening on Port ${pkt.headers.l4.dstPort}. Byte buffer delivered into server RAM!`;
        break;
    }

    const nodeEl = this.container.querySelector(`#node-${activeNodeId}`);
    if (nodeEl) nodeEl.classList.add("active-node", "pulse-node");

    // Animate tracers
    [1, 2, 3].forEach(i => {
      const tr = this.container.querySelector(`#tracer-${i}`);
      if (tr) {
        tr.style.opacity = (tracerIdx === i) ? "1" : "0";
        if (tracerIdx === i) tr.classList.add("moving-tracer");
        else tr.classList.remove("moving-tracer");
      }
    });

    // Render stack layers
    const stackEl = this.container.querySelector("#pj-stack");
    stackEl.innerHTML = `
      <div class="stack-layer layer-l2 ${pkt.progress >= 3 ? 'active-layer' : 'pending-layer'}">
        <div class="layer-tag">L2: Data Link (Ethernet Frame)</div>
        <div class="layer-details">
          <span>Src MAC: <code>${pkt.headers.l2.srcMAC}</code></span>
          <span>Dst MAC: <code>${pkt.headers.l2.dstMAC}</code></span>
        </div>
      </div>
      <div class="stack-layer layer-l3 ${pkt.progress >= 2 ? 'active-layer' : 'pending-layer'}">
        <div class="layer-tag">L3: Network (IPv4 Packet)</div>
        <div class="layer-details">
          <span>Src IP: <code>${pkt.headers.l3.srcIP}</code></span>
          <span>Dst IP: <code>${pkt.headers.l3.dstIP}</code></span>
          <span>TTL: <code>${pkt.progress >= 5 ? 63 : 64}</code></span>
        </div>
      </div>
      <div class="stack-layer layer-l4 ${pkt.progress >= 1 ? 'active-layer' : 'pending-layer'}">
        <div class="layer-tag">L4: Transport (TCP Segment)</div>
        <div class="layer-details">
          <span>Src Port: <code>${pkt.headers.l4.srcPort}</code></span>
          <span>Dst Port: <code>${pkt.headers.l4.dstPort}</code></span>
          <span>Seq: <code>${pkt.headers.l4.seq}</code></span>
        </div>
      </div>
      <div class="stack-layer layer-payload active-layer">
        <div class="layer-tag">L7 Payload (Application Bytes)</div>
        <div class="layer-details">
          <span>Text: <strong>"${pkt.text}"</strong></span>
          <span>Hex: <code>${pkt.hex}</code></span>
        </div>
      </div>
    `;

    // Render wire state
    const wireEl = this.container.querySelector("#pj-wire-state");
    wireEl.innerHTML = `
      <div class="binary-stream">
        <span class="stream-label">Raw Binary Stream:</span>
        <div class="bytes-row">
          ${pkt.bytes.map((b, i) => `<span class="byte-chip" title="Char: ${pkt.text[i]}">${b}</span>`).join('')}
        </div>
      </div>
      <div class="delivered-packets">
        <span class="stream-label">Packets Progress:</span>
        <div class="packet-pills">
          ${this.state.packets.map((p, idx) => {
            let cls = "pill-queued";
            if (idx < this.state.activePacketIndex || (idx === this.state.activePacketIndex && p.progress >= 6)) cls = "pill-done";
            else if (idx === this.state.activePacketIndex) cls = "pill-active";
            return `<span class="pkt-pill ${cls}">#${p.id} [${p.text}]</span>`;
          }).join('')}
        </div>
      </div>
    `;

    // Explanation
    this.container.querySelector("#pj-explanation").innerHTML = explanationText;
  }
}

window.PacketJourneyVisualizer = PacketJourneyVisualizer;
