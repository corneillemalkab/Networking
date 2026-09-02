// Interactive DNS Resolution Chain & Lookup Table Visualizer
class DNSVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      domain: "api.github.com",
      step: 0,
      isPlaying: false,
      cacheEnabled: false,
      records: {
        "api.github.com": { ip: "140.82.121.6", tld: "com", auth: "ns1.github.com", ttl: 300 },
        "docs.python.org": { ip: "151.101.0.223", tld: "org", auth: "ns1.pypa.io", ttl: 600 },
        "db.internal.net": { ip: "10.0.4.15", tld: "net", auth: "ns-corp.internal", ttl: 60 }
      }
    };
    this.timer = null;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.updateStep(0);
  }

  render() {
    this.container.innerHTML = `
      <div class="vis-wrapper dns-vis">
        <div class="vis-header">
          <div class="vis-title">
            <span class="pulse-dot"></span>
            <strong>Hierarchical DNS Resolution Chain Simulator</strong>
          </div>
          <div class="vis-controls">
            <select id="dns-domain-select" class="vis-select">
              <option value="api.github.com">api.github.com</option>
              <option value="docs.python.org">docs.python.org</option>
              <option value="db.internal.net">db.internal.net</option>
            </select>
            <button id="dns-btn-step" class="btn-vis btn-primary">Step Query ⏭</button>
            <button id="dns-btn-auto" class="btn-vis btn-accent">Resolve All ▶</button>
            <button id="dns-btn-reset" class="btn-vis btn-subtle">Reset ↺</button>
          </div>
        </div>

        <div class="dns-tree-layout">
          <!-- Tier 1: Client & Local Cache -->
          <div class="dns-tier tier-client">
            <div class="dns-server-card" id="dns-node-client">
              <div class="dns-icon">💻</div>
              <strong>Client Host</strong>
              <small>Local OS Cache (RAM)</small>
              <div class="dns-status-pill" id="pill-client">Ready</div>
            </div>
            
            <div class="dns-arrow" id="arrow-1">➔</div>

            <div class="dns-server-card" id="dns-node-resolver">
              <div class="dns-icon">📡</div>
              <strong>Recursive Resolver</strong>
              <small>IP: 1.1.1.1 (ISP / Cloud)</small>
              <div class="dns-status-pill" id="pill-resolver">Idle</div>
            </div>
          </div>

          <!-- Tier 2: Root, TLD, Auth Servers -->
          <div class="dns-tier tier-hierarchy">
            <div class="dns-server-card" id="dns-node-root">
              <div class="dns-icon">🌐</div>
              <strong>Root Server ( . )</strong>
              <small>Directs to TLD Nameservers</small>
              <div class="dns-status-pill" id="pill-root">Idle</div>
            </div>

            <div class="dns-server-card" id="dns-node-tld">
              <div class="dns-icon">🏛️</div>
              <strong>TLD Server (<span id="dns-cur-tld">.com</span>)</strong>
              <small>Top-Level Domain Registry</small>
              <div class="dns-status-pill" id="pill-tld">Idle</div>
            </div>

            <div class="dns-server-card" id="dns-node-auth">
              <div class="dns-icon">🎯</div>
              <strong>Authoritative Server</strong>
              <small id="dns-cur-auth">ns1.github.com</small>
              <div class="dns-status-pill" id="pill-auth">Idle</div>
            </div>
          </div>
        </div>

        <!-- Query Log & Key-Value Inspector -->
        <div class="dns-details-grid">
          <div class="vis-panel">
            <div class="panel-heading">
              <span>Resolution Step & Wire Query</span>
            </div>
            <div class="dns-log-box" id="dns-step-explanation">
              <!-- Populated dynamically -->
            </div>
          </div>

          <div class="vis-panel">
            <div class="panel-heading">
              <span>Final DNS Answer Record (A-Record)</span>
            </div>
            <div class="dns-record-box" id="dns-final-record">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind listeners
    const select = this.container.querySelector("#dns-domain-select");
    select.addEventListener("change", (e) => {
      this.state.domain = e.target.value;
      this.reset();
    });

    this.container.querySelector("#dns-btn-step").addEventListener("click", () => this.stepForward());
    this.container.querySelector("#dns-btn-auto").addEventListener("click", () => this.autoResolve());
    this.container.querySelector("#dns-btn-reset").addEventListener("click", () => this.reset());
  }

  reset() {
    if (this.timer) clearInterval(this.timer);
    this.state.step = 0;
    this.state.isPlaying = false;
    this.updateStep(0);
  }

  autoResolve() {
    this.reset();
    this.state.isPlaying = true;
    this.timer = setInterval(() => {
      if (this.state.step >= 4) {
        clearInterval(this.timer);
        this.state.isPlaying = false;
      } else {
        this.stepForward();
      }
    }, 1200);
  }

  stepForward() {
    if (this.state.step < 4) {
      this.state.step += 1;
      this.updateStep(this.state.step);
    }
  }

  updateStep(step) {
    const domain = this.state.domain;
    const rec = this.state.records[domain] || { ip: "1.2.3.4", tld: "com", auth: "ns.example.com", ttl: 300 };

    this.container.querySelector("#dns-cur-tld").textContent = `.${rec.tld}`;
    this.container.querySelector("#dns-cur-auth").textContent = rec.auth;

    // Reset cards & pills
    const allCards = ["client", "resolver", "root", "tld", "auth"];
    allCards.forEach(c => {
      const card = this.container.querySelector(`#dns-node-${c}`);
      const pill = this.container.querySelector(`#pill-${c}`);
      if (card) card.classList.remove("active-dns-card", "success-dns-card");
      if (pill) {
        pill.textContent = "Idle";
        pill.className = "dns-status-pill";
      }
    });

    let expText = "";
    let recordText = `<div class="record-pending">Awaiting query completion...</div>`;

    switch (step) {
      case 0:
        this.container.querySelector("#dns-node-client").classList.add("active-dns-card");
        this.container.querySelector("#pill-client").textContent = "Query Started";
        this.container.querySelector("#pill-client").className = "dns-status-pill pill-active";
        expText = `
          <strong>Step 0: Client Program Initiates DNS Query</strong><br>
          An application (like a web browser or curl) asks the operating system kernel: <em>"What is the 32-bit IPv4 address for <code>${domain}</code>?"</em><br>
          The OS checks local memory cache. Cache miss! Query is forwarded to Recursive Resolver <code>1.1.1.1:53</code> via UDP.
        `;
        break;

      case 1:
        this.container.querySelector("#dns-node-resolver").classList.add("active-dns-card");
        this.container.querySelector("#dns-node-root").classList.add("active-dns-card");
        this.container.querySelector("#pill-resolver").textContent = "Querying Root";
        this.container.querySelector("#pill-resolver").className = "dns-status-pill pill-active";
        this.container.querySelector("#pill-root").textContent = "Referral: .${rec.tld}";
        this.container.querySelector("#pill-root").className = "dns-status-pill pill-info";
        expText = `
          <strong>Step 1: Resolver Queries the Root Name Server ( . )</strong><br>
          Resolver asks Root Server: <em>"Who knows where to find <code>${domain}</code>?"</em><br>
          Root Server doesn't have the final IP, but it manages the root zone. It replies with a referral: <em>"I don't know the exact host, but here is the IP for the <strong>.${rec.tld} TLD Server</strong>."</em>
        `;
        break;

      case 2:
        this.container.querySelector("#dns-node-resolver").classList.add("active-dns-card");
        this.container.querySelector("#dns-node-tld").classList.add("active-dns-card");
        this.container.querySelector("#pill-tld").textContent = "Referral: Auth NS";
        this.container.querySelector("#pill-tld").className = "dns-status-pill pill-info";
        expText = `
          <strong>Step 2: Resolver Queries the Top-Level Domain (TLD) Server</strong><br>
          Resolver queries the <strong>.${rec.tld}</strong> TLD registry: <em>"Where is <code>${domain}</code>?"</em><br>
          The TLD Server replies with the Authoritative Name Server for this domain: <code>${rec.auth}</code>.
        `;
        break;

      case 3:
        this.container.querySelector("#dns-node-resolver").classList.add("active-dns-card");
        this.container.querySelector("#dns-node-auth").classList.add("active-dns-card");
        this.container.querySelector("#pill-auth").textContent = "A-Record Found!";
        this.container.querySelector("#pill-auth").className = "dns-status-pill pill-success";
        expText = `
          <strong>Step 3: Authoritative Name Server Returns the Final A-Record</strong><br>
          Resolver asks <code>${rec.auth}</code>: <em>"What is the IP for <code>${domain}</code>?"</em><br>
          The authoritative server owns the zone file and returns the exact <strong>A Record: <code>${rec.ip}</code> (TTL: ${rec.ttl}s)</strong>!
        `;
        break;

      case 4:
        this.container.querySelector("#dns-node-client").classList.add("success-dns-card");
        this.container.querySelector("#dns-node-resolver").classList.add("success-dns-card");
        this.container.querySelector("#pill-client").textContent = "Cached & Ready";
        this.container.querySelector("#pill-client").className = "dns-status-pill pill-success";
        this.container.querySelector("#pill-resolver").textContent = "Cached (TTL ${rec.ttl}s)";
        this.container.querySelector("#pill-resolver").className = "dns-status-pill pill-success";
        expText = `
          <strong>Step 4: Resolved & Cached into RAM</strong><br>
          Resolver delivers <code>${rec.ip}</code> back to the client. The client's OS caches the result for ${rec.ttl} seconds and can now immediately open a TCP connection to <code>${rec.ip}</code>!
        `;
        recordText = `
          <div class="record-success-box">
            <div class="record-row"><span>Record Name:</span> <strong>${domain}</strong></div>
            <div class="record-row"><span>Record Type:</span> <span class="badge-type">A (IPv4)</span></div>
            <div class="record-row"><span>Mapped IP:</span> <strong class="badge-ip">${rec.ip}</strong></div>
            <div class="record-row"><span>Time to Live (TTL):</span> <code>${rec.ttl} seconds</code></div>
            <div class="record-row"><span>Status:</span> <span class="badge-online">NOERROR (0x0000)</span></div>
          </div>
        `;
        break;
    }

    this.container.querySelector("#dns-step-explanation").innerHTML = expText;
    this.container.querySelector("#dns-final-record").innerHTML = recordText;
  }
}

window.DNSVisualizer = DNSVisualizer;
