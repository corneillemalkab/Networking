// Interactive TCP 3-Way Handshake & Reliable Retransmission Simulator
class TCPHandshakeVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      mode: "tcp", // 'tcp' or 'udp'
      step: 0,
      clientSeq: 1000,
      serverSeq: 5000,
      clientState: "CLOSED",
      serverState: "LISTEN",
      simulateDrop: false,
      logs: []
    };
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.reset();
  }

  render() {
    this.container.innerHTML = `
      <div class="vis-wrapper tcp-vis">
        <div class="vis-header">
          <div class="vis-title">
            <span class="pulse-dot"></span>
            <strong>TCP 3-Way Handshake & State Machine Simulator</strong>
          </div>
          <div class="vis-controls">
            <button id="tcp-mode-tcp" class="btn-vis btn-accent">TCP Mode (Reliable)</button>
            <button id="tcp-mode-udp" class="btn-vis btn-subtle">UDP Mode (Fast/Unreliable)</button>
            <button id="tcp-btn-step" class="btn-vis btn-primary">Step Exchange ⏭</button>
            <button id="tcp-btn-reset" class="btn-vis btn-subtle">Reset ↺</button>
          </div>
        </div>

        <div class="tcp-options-bar">
          <label class="checkbox-label">
            <input type="checkbox" id="tcp-simulate-drop" />
            <span>Simulate Packet Drop & Automatic Retransmission</span>
          </label>
        </div>

        <!-- Two Endpoints Diagram -->
        <div class="handshake-diagram">
          <div class="endpoint-column" id="ep-client">
            <div class="endpoint-card">
              <div class="ep-icon">💻</div>
              <strong>Client Host</strong>
              <code>192.168.1.10:49152</code>
              <div class="state-badge" id="client-state-badge">CLOSED</div>
            </div>
            <div class="ladder-line"></div>
          </div>

          <div class="exchange-stage" id="tcp-exchange-stage">
            <!-- Dynamic interactive packet arrows appear here -->
          </div>

          <div class="endpoint-column" id="ep-server">
            <div class="endpoint-card">
              <div class="ep-icon">🗄️</div>
              <strong>Web Server</strong>
              <code>10.0.0.50:80</code>
              <div class="state-badge" id="server-state-badge">LISTEN</div>
            </div>
            <div class="ladder-line"></div>
          </div>
        </div>

        <!-- Technical Log & Packet State Details -->
        <div class="tcp-details-grid">
          <div class="vis-panel">
            <div class="panel-heading">
              <span>Sequence Counter & Header Details</span>
            </div>
            <div class="tcp-math-box" id="tcp-math-box">
              <!-- Dynamically populated math explanation -->
            </div>
          </div>

          <div class="vis-panel">
            <div class="panel-heading">
              <span>Connection State Log</span>
            </div>
            <div class="tcp-log-console" id="tcp-log-console">
              <!-- Event logs -->
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind listeners
    this.container.querySelector("#tcp-mode-tcp").addEventListener("click", () => {
      this.state.mode = "tcp";
      this.container.querySelector("#tcp-mode-tcp").className = "btn-vis btn-accent";
      this.container.querySelector("#tcp-mode-udp").className = "btn-vis btn-subtle";
      this.reset();
    });

    this.container.querySelector("#tcp-mode-udp").addEventListener("click", () => {
      this.state.mode = "udp";
      this.container.querySelector("#tcp-mode-udp").className = "btn-vis btn-accent";
      this.container.querySelector("#tcp-mode-tcp").className = "btn-vis btn-subtle";
      this.reset();
    });

    this.container.querySelector("#tcp-simulate-drop").addEventListener("change", (e) => {
      this.state.simulateDrop = e.target.checked;
    });

    this.container.querySelector("#tcp-btn-step").addEventListener("click", () => this.stepForward());
    this.container.querySelector("#tcp-btn-reset").addEventListener("click", () => this.reset());
  }

  reset() {
    this.state.step = 0;
    this.state.clientSeq = 1000;
    this.state.serverSeq = 5000;
    this.state.clientState = this.state.mode === "tcp" ? "CLOSED" : "STATELESS";
    this.state.serverState = this.state.mode === "tcp" ? "LISTEN" : "STATELESS";
    this.state.logs = [
      `[${new Date().toLocaleTimeString()}] Simulator initialized in ${this.state.mode.toUpperCase()} mode.`
    ];
    if (this.state.mode === "tcp") {
      this.state.logs.push(`[${new Date().toLocaleTimeString()}] Server listening on port 80 (TCP state: LISTEN).`);
    }
    this.renderExchange();
  }

  stepForward() {
    if (this.state.mode === "udp") {
      this.stepUDP();
      return;
    }
    this.stepTCP();
  }

  stepUDP() {
    if (this.state.step === 0) {
      this.state.step = 1;
      this.state.logs.push(`[${new Date().toLocaleTimeString()}] Client sends UDP datagram (Length: 32 bytes) ➔ Server. No handshake performed.`);
    } else if (this.state.step === 1) {
      this.state.step = 2;
      this.state.logs.push(`[${new Date().toLocaleTimeString()}] Server processes datagram directly. No ACK returned.`);
    } else {
      this.state.logs.push(`[${new Date().toLocaleTimeString()}] UDP transmission complete. (Zero connection overhead)`);
    }
    this.renderExchange();
  }

  stepTCP() {
    const isDrop = this.state.simulateDrop && this.state.step === 1;

    switch (this.state.step) {
      case 0:
        // SYN
        this.state.step = 1;
        this.state.clientState = "SYN_SENT";
        this.state.logs.push(`[${new Date().toLocaleTimeString()}] Client sends SYN (Seq=${this.state.clientSeq}, Flags=[SYN]). Client state: SYN_SENT`);
        break;

      case 1:
        if (isDrop) {
          this.state.step = 1.5; // drop state
          this.state.logs.push(`[${new Date().toLocaleTimeString()}] ⚠️ PACKET DROPPED on wire! SYN-ACK was lost due to network congestion.`);
          this.state.logs.push(`[${new Date().toLocaleTimeString()}] Client TCP Retransmission Timer (RTO) triggers...`);
        } else {
          // SYN-ACK
          this.state.step = 2;
          this.state.serverState = "SYN_RECEIVED";
          this.state.logs.push(`[${new Date().toLocaleTimeString()}] Server replies with SYN-ACK (Seq=${this.state.serverSeq}, Ack=${this.state.clientSeq + 1}, Flags=[SYN, ACK]). Server state: SYN_RECEIVED`);
        }
        break;

      case 1.5:
        // Retransmission
        this.state.step = 2;
        this.state.logs.push(`[${new Date().toLocaleTimeString()}] 🔁 Client automatically re-transmits SYN. Server answers with SYN-ACK!`);
        this.state.serverState = "SYN_RECEIVED";
        break;

      case 2:
        // ACK
        this.state.step = 3;
        this.state.clientState = "ESTABLISHED";
        this.state.serverState = "ESTABLISHED";
        this.state.logs.push(`[${new Date().toLocaleTimeString()}] Client sends final ACK (Seq=${this.state.clientSeq + 1}, Ack=${this.state.serverSeq + 1}, Flags=[ACK]). Both endpoints: ESTABLISHED!`);
        break;

      case 3:
        // Data exchange
        this.state.step = 4;
        this.state.logs.push(`[${new Date().toLocaleTimeString()}] Client sends HTTP GET payload (128 bytes). Server ACKs payload (Ack=${this.state.clientSeq + 129}).`);
        break;

      default:
        this.state.logs.push(`[${new Date().toLocaleTimeString()}] Connection established and ready for application byte streams.`);
    }

    this.renderExchange();
  }

  renderExchange() {
    // Update State badges
    this.container.querySelector("#client-state-badge").textContent = this.state.clientState;
    this.container.querySelector("#server-state-badge").textContent = this.state.serverState;

    const stage = this.container.querySelector("#tcp-exchange-stage");
    let arrowsHtml = "";
    let mathHtml = "";

    if (this.state.mode === "udp") {
      arrowsHtml = `
        <div class="packet-arrow arrow-right ${this.state.step >= 1 ? 'arrow-visible' : ''}">
          <span class="arrow-tag">UDP Datagram (Len: 32B) ➔</span>
          <div class="arrow-line"></div>
        </div>
      `;
      mathHtml = `
        <div class="math-content">
          <h4>UDP (User Datagram Protocol) Header</h4>
          <p>UDP headers have only 4 fields (8 bytes total):</p>
          <ul>
            <li><strong>Source Port:</strong> 49152</li>
            <li><strong>Destination Port:</strong> 80</li>
            <li><strong>Length:</strong> 32 bytes</li>
            <li><strong>Checksum:</strong> 0x4A1F</li>
          </ul>
          <p class="text-subtle">No sequence numbers, no ACK fields, no connection handshake.</p>
        </div>
      `;
    } else {
      arrowsHtml = `
        <div class="packet-arrow arrow-right ${this.state.step >= 1 ? 'arrow-visible' : ''}">
          <span class="arrow-tag">1. [SYN] Seq=${this.state.clientSeq} ➔</span>
          <div class="arrow-line"></div>
        </div>

        <div class="packet-arrow arrow-left ${this.state.step === 1.5 ? 'arrow-dropped' : (this.state.step >= 2 ? 'arrow-visible' : '')}">
          <span class="arrow-tag">${this.state.step === 1.5 ? '❌ [SYN-ACK] DROPPED' : `2. [SYN, ACK] Seq=${this.state.serverSeq}, Ack=${this.state.clientSeq + 1} 🡄`}</span>
          <div class="arrow-line"></div>
        </div>

        <div class="packet-arrow arrow-right ${this.state.step >= 3 ? 'arrow-visible' : ''}">
          <span class="arrow-tag">3. [ACK] Seq=${this.state.clientSeq + 1}, Ack=${this.state.serverSeq + 1} ➔</span>
          <div class="arrow-line"></div>
        </div>

        <div class="packet-arrow arrow-right ${this.state.step >= 4 ? 'arrow-visible' : ''}">
          <span class="arrow-tag">4. [DATA] "GET /" (128B) ➔</span>
          <div class="arrow-line data-arrow"></div>
        </div>
      `;

      mathHtml = `
        <div class="math-content">
          <h4>TCP Sequence & ACK Counter Math</h4>
          <table class="tcp-math-table">
            <tr><td><strong>Client Initial Seq (ISN):</strong></td><td><code>${this.state.clientSeq}</code></td></tr>
            <tr><td><strong>Server Initial Seq (ISN):</strong></td><td><code>${this.state.serverSeq}</code></td></tr>
            <tr><td><strong>Expected Client Next Byte:</strong></td><td><code>${this.state.clientSeq + 1}</code></td></tr>
            <tr><td><strong>Expected Server Next Byte:</strong></td><td><code>${this.state.serverSeq + 1}</code></td></tr>
          </table>
          <p class="math-explanation">
            <strong>The ACK Rule:</strong> When a peer receives byte sequence <em>N</em>, it acknowledges with <em>N + 1</em> to mean: <em>"I have safely received everything up to N, send me byte N+1 next."</em>
          </p>
        </div>
      `;
    }

    stage.innerHTML = arrowsHtml;
    this.container.querySelector("#tcp-math-box").innerHTML = mathHtml;

    // Render logs
    const logConsole = this.container.querySelector("#tcp-log-console");
    logConsole.innerHTML = this.state.logs.map(l => `<div class="log-line">${l}</div>`).join('');
    logConsole.scrollTop = logConsole.scrollHeight;
  }
}

window.TCPHandshakeVisualizer = TCPHandshakeVisualizer;
