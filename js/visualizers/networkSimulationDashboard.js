// AI Network Health & Live Traffic Risk Simulation Dashboard (Dribbble AI Telemetry Style)
class NetworkSimulationDashboard {
  constructor(mountId) {
    this.container = document.getElementById(mountId);
    this.trafficRate = 450; // packets per second
    this.healthScore = 98.4;
    this.latency = 12.4; // ms
    this.packetLoss = 0.02; // %
    this.jitter = 1.1; // ms
    this.activeAnomaly = "normal"; // 'normal', 'syn_flood', 'fiber_cut', 'vlan_leak', 'dns_spoof'
    this.historyPoints = [12, 14, 11, 15, 12, 13, 12, 16, 12, 11, 13, 12, 14, 12, 13, 12];
    this.chartTimer = null;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
    this.startLiveTelemetryStream();
  }

  render() {
    this.container.innerHTML = `
      <div class="dribbble-sim-wrapper">
        
        <!-- Top Telemetry KPI Cards Bar -->
        <div class="sim-kpi-grid">
          
          <!-- 1. Radial Health Gauge Card -->
          <div class="sim-kpi-card health-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Network Health Index</span>
              <span class="kpi-badge badge-nominal" id="kpi-health-status">● Optimal</span>
            </div>
            <div class="gauge-display-wrap">
              <svg class="radial-gauge-svg" viewBox="0 0 120 120">
                <circle class="gauge-track" cx="60" cy="60" r="50" />
                <circle class="gauge-fill" id="radial-health-fill" cx="60" cy="60" r="50" stroke-dasharray="314" stroke-dashoffset="15" />
              </svg>
              <div class="gauge-center-text">
                <strong id="kpi-health-val">98.4</strong><small>%</small>
                <span>AI Confidence 99%</span>
              </div>
            </div>
            <div class="kpi-sub-stats">
              <div><span class="sub-label">MTBF</span> <strong>99.99%</strong></div>
              <div><span class="sub-label">Threats</span> <strong id="kpi-threat-count" style="color:var(--accent-emerald);">0 Active</strong></div>
            </div>
          </div>

          <!-- 2. Latency & Jitter Waveform Card -->
          <div class="sim-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Latency & RTT Waveform</span>
              <span class="kpi-badge badge-live">LIVE 10Hz</span>
            </div>
            <div class="kpi-metric-main">
              <span class="metric-big" id="kpi-latency-val">12.4</span><span class="metric-unit">ms</span>
              <span class="metric-trend trend-positive" id="kpi-jitter-val">± 1.1ms Jitter</span>
            </div>
            <!-- Live Canvas Waveform -->
            <div class="waveform-chart-container">
              <svg class="waveform-svg" id="latency-waveform-svg" preserveAspectRatio="none" viewBox="0 0 300 60">
                <defs>
                  <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
                  </linearGradient>
                </defs>
                <path id="waveform-area-path" d="" fill="url(#waveGradient)" />
                <path id="waveform-line-path" d="" fill="none" stroke="#38bdf8" stroke-width="2" />
              </svg>
            </div>
          </div>

          <!-- 3. Throughput & Bandwidth Utilization Card -->
          <div class="sim-kpi-card">
            <div class="kpi-header">
              <span class="kpi-title">Core Link Throughput</span>
              <span class="kpi-badge">10G Trunk</span>
            </div>
            <div class="kpi-metric-main">
              <span class="metric-big" id="kpi-throughput-val">4.52</span><span class="metric-unit">Gbps</span>
              <span class="metric-trend" id="kpi-pps-val">452,000 pps</span>
            </div>
            <div class="sim-progress-track">
              <div class="sim-progress-bar" id="throughput-progress-bar" style="width: 45.2%;"></div>
            </div>
            <div class="kpi-sub-stats" style="margin-top:10px;">
              <div><span class="sub-label">Packet Loss</span> <strong id="kpi-loss-val" style="color:var(--accent-emerald);">0.02%</strong></div>
              <div><span class="sub-label">Queue Depth</span> <strong id="kpi-queue-val">3% (Optimal)</strong></div>
            </div>
          </div>

        </div>

        <!-- Simulation Fault-Injection & AI Diagnostic Center -->
        <div class="sim-control-cockpit">
          
          <!-- Left: Fault Injection Simulator -->
          <div class="cockpit-left-panel">
            <div class="cockpit-title-row">
              <span class="cockpit-tag">Simulation Control Engine</span>
              <h4>⚡ Inject Network Anomalies & Fault Scenarios</h4>
            </div>

            <div class="scenario-buttons-grid">
              <button class="btn-scenario scenario-active" data-scenario="normal">
                <span class="scen-icon">✅</span>
                <div class="scen-text">
                  <strong>Nominal Baseline</strong>
                  <small>Healthy full-duplex 10G traffic flow</small>
                </div>
              </button>

              <button class="btn-scenario" data-scenario="syn_flood">
                <span class="scen-icon">🚨</span>
                <div class="scen-text">
                  <strong>TCP SYN Flood (L4 DDoS)</strong>
                  <small>Exhausts kernel socket backlog queues</small>
                </div>
              </button>

              <button class="btn-scenario" data-scenario="fiber_cut">
                <span class="scen-icon">✂️</span>
                <div class="scen-text">
                  <strong>Fiber Link Cut (L1 Failure)</strong>
                  <small>Triggers STP re-convergence & route flap</small>
                </div>
              </button>

              <button class="btn-scenario" data-scenario="vlan_leak">
                <span class="scen-icon">🏷️</span>
                <div class="scen-text">
                  <strong>802.1Q Double-Tag Leak</strong>
                  <small>Simulates VLAN hopping exploit</small>
                </div>
              </button>
            </div>

            <!-- Traffic Rate Slider -->
            <div class="sim-slider-box">
              <div class="slider-header">
                <span>Simulated Traffic Ingress Rate:</span>
                <strong id="slider-rate-label">450 packets/sec</strong>
              </div>
              <input type="range" class="sim-range-input" id="sim-traffic-slider" min="50" max="3000" step="50" value="450" />
            </div>
          </div>

          <!-- Right: AI Diagnostic Prediction Stream -->
          <div class="cockpit-right-panel">
            <div class="cockpit-title-row">
              <span class="cockpit-tag">AI Predictive Telemetry</span>
              <h4>🤖 Real-Time Kernel Root-Cause Analysis</h4>
            </div>

            <div class="ai-prediction-card" id="ai-prediction-box">
              <div class="ai-status-indicator" id="ai-status-indicator">
                <span class="ai-pulse-sphere"></span>
                <strong id="ai-prediction-headline">All Systems Nominal &bull; Zero Bottlenecks Detected</strong>
              </div>
              <p id="ai-prediction-explanation" class="ai-desc">
                ASIC forward tables operating at 0.8µs wire speed. Full-duplex link utilization is at 45.2% with zero collisions and 0.02% natural packet loss.
              </p>
              <div class="ai-remediation-box" id="ai-remediation-box">
                <strong>Recommended Engineering Action:</strong>
                <span id="ai-remediation-action">Maintain continuous monitoring; QoS policies are correctly prioritizing VoIP and database traffic.</span>
              </div>
            </div>

            <!-- Live Terminal Snapshot Hook -->
            <div class="sim-terminal-cta">
              <span>Inspect active socket states in Linux terminal:</span>
              <button class="btn-sim-exec" id="btn-sim-run-netstat">Run <code>netstat -tlpn</code> ↵</button>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  bindEvents() {
    // Scenario buttons
    this.container.querySelectorAll(".btn-scenario").forEach(btn => {
      btn.addEventListener("click", () => {
        const scenario = btn.getAttribute("data-scenario");
        this.setScenario(scenario);
      });
    });

    // Traffic slider
    const slider = this.container.querySelector("#sim-traffic-slider");
    if (slider) {
      slider.addEventListener("input", (e) => {
        this.trafficRate = parseInt(e.target.value, 10);
        this.container.querySelector("#slider-rate-label").textContent = `${this.trafficRate} packets/sec`;
        this.updateKPIs();
      });
    }

    // Run netstat button
    this.container.querySelector("#btn-sim-run-netstat")?.addEventListener("click", () => {
      if (window.app && window.app.terminalInstance) {
        window.app.terminalInstance.runSampleCommand("netstat -tlpn");
      }
    });
  }

  setScenario(scenario) {
    this.activeAnomaly = scenario;

    this.container.querySelectorAll(".btn-scenario").forEach(btn => {
      if (btn.getAttribute("data-scenario") === scenario) {
        btn.classList.add("scenario-active");
      } else {
        btn.classList.remove("scenario-active");
      }
    });

    const aiHeadline = this.container.querySelector("#ai-prediction-headline");
    const aiExplanation = this.container.querySelector("#ai-prediction-explanation");
    const aiAction = this.container.querySelector("#ai-remediation-action");
    const healthBadge = this.container.querySelector("#kpi-health-status");
    const threatCount = this.container.querySelector("#kpi-threat-count");
    const aiBox = this.container.querySelector("#ai-prediction-box");

    if (scenario === "normal") {
      this.healthScore = 98.4;
      this.latency = 12.4;
      this.packetLoss = 0.02;
      this.jitter = 1.1;

      healthBadge.className = "kpi-badge badge-nominal";
      healthBadge.textContent = "● Optimal";
      threatCount.textContent = "0 Active";
      threatCount.style.color = "var(--accent-emerald)";
      aiBox.className = "ai-prediction-card";

      aiHeadline.textContent = "All Systems Nominal • Zero Bottlenecks Detected";
      aiExplanation.textContent = "ASIC forwarding tables operating at 0.8µs wire speed. Full-duplex link utilization is healthy with zero CRC errors.";
      aiAction.textContent = "Maintain continuous monitoring; QoS policies are correctly prioritizing VoIP and database traffic.";

    } else if (scenario === "syn_flood") {
      this.healthScore = 34.2;
      this.latency = 184.6;
      this.packetLoss = 42.8;
      this.jitter = 68.4;

      healthBadge.className = "kpi-badge badge-danger";
      healthBadge.textContent = "CRITICAL RISK";
      threatCount.textContent = "L4 SYN Flood (High)";
      threatCount.style.color = "var(--accent-rose)";
      aiBox.className = "ai-prediction-card ai-card-danger";

      aiHeadline.textContent = "🚨 CRITICAL: TCP SYN Flood Detected on Port 80/443";
      aiExplanation.textContent = "Inbound TCP half-open connections exceeded socket backlog (10,000+ un-ACKed SYNs). Kernel memory allocated for socket structures is 88% full.";
      aiAction.textContent = "Enable Linux SYN Cookies (sysctl -w net.ipv4.tcp_syncookies=1) and enforce rate-limiting via iptables / NGFW firewall rules.";

    } else if (scenario === "fiber_cut") {
      this.healthScore = 58.1;
      this.latency = 86.2;
      this.packetLoss = 18.5;
      this.jitter = 32.1;

      healthBadge.className = "kpi-badge badge-warn";
      healthBadge.textContent = "DEGRADED (STP FAILOVER)";
      threatCount.textContent = "1 Link Down (L1)";
      threatCount.style.color = "var(--accent-amber)";
      aiBox.className = "ai-prediction-card ai-card-warn";

      aiHeadline.textContent = "⚠️ WARNING: Primary Optical Link Down (Port SFP-10G-1)";
      aiExplanation.textContent = "Rx optical power dropped to -40 dBm (Laser loss). Spanning Tree Protocol (RSTP) unblocked backup port Fa0/24 in 1.8 seconds.";
      aiAction.textContent = "Dispatch field technician to inspect physical SC/LC fiber patch; traffic is safely rerouted over backup 1G link.";

    } else if (scenario === "vlan_leak") {
      this.healthScore = 64.7;
      this.latency = 14.8;
      this.packetLoss = 0.5;
      this.jitter = 2.4;

      healthBadge.className = "kpi-badge badge-warn";
      healthBadge.textContent = "SECURITY EXPLOIT";
      threatCount.textContent = "VLAN Tag Anomaly";
      threatCount.style.color = "var(--accent-amber)";
      aiBox.className = "ai-prediction-card ai-card-warn";

      aiHeadline.textContent = "🛡️ SECURITY ALERT: Double 802.1Q Tagged Frames Detected";
      aiExplanation.textContent = "Frames received on Access Port 1 contain an outer Native VLAN tag (VID 1) and inner VID 20 tag attempting to bypass switch isolation.";
      aiAction.textContent = "Change the Native VLAN to an unused ID (e.g. VLAN 999) and enable explicit 802.1Q tag stripping on all access ports.";
    }

    this.updateKPIs();
  }

  updateKPIs() {
    // Health score gauge
    const healthValEl = this.container.querySelector("#kpi-health-val");
    const healthFill = this.container.querySelector("#radial-health-fill");
    if (healthValEl && healthFill) {
      healthValEl.textContent = this.healthScore.toFixed(1);
      const circumference = 2 * Math.PI * 50; // ~314.15
      const offset = circumference - (this.healthScore / 100) * circumference;
      healthFill.style.strokeDashoffset = offset;

      if (this.healthScore > 80) healthFill.style.stroke = "var(--accent-emerald)";
      else if (this.healthScore > 50) healthFill.style.stroke = "var(--accent-amber)";
      else healthFill.style.stroke = "var(--accent-rose)";
    }

    // Latency & Jitter
    const latVal = this.container.querySelector("#kpi-latency-val");
    const jitVal = this.container.querySelector("#kpi-jitter-val");
    if (latVal && jitVal) {
      latVal.textContent = this.latency.toFixed(1);
      jitVal.textContent = `± ${this.jitter.toFixed(1)}ms Jitter`;
    }

    // Throughput
    const tpGbps = ((this.trafficRate * 1500 * 8) / 1000000).toFixed(2);
    const tpEl = this.container.querySelector("#kpi-throughput-val");
    const ppsEl = this.container.querySelector("#kpi-pps-val");
    const tpBar = this.container.querySelector("#throughput-progress-bar");
    if (tpEl && ppsEl && tpBar) {
      tpEl.textContent = tpGbps;
      ppsEl.textContent = `${(this.trafficRate * 1000).toLocaleString()} pps`;
      const pct = Math.min((this.trafficRate / 3000) * 100, 100);
      tpBar.style.width = `${pct}%`;
    }

    // Loss
    const lossEl = this.container.querySelector("#kpi-loss-val");
    if (lossEl) {
      lossEl.textContent = `${this.packetLoss.toFixed(2)}%`;
      lossEl.style.color = this.packetLoss > 5 ? "var(--accent-rose)" : (this.packetLoss > 0.1 ? "var(--accent-amber)" : "var(--accent-emerald)");
    }
  }

  startLiveTelemetryStream() {
    this.chartTimer = setInterval(() => {
      // Add slight jitter
      const currentLat = this.latency + (Math.random() * 2 - 1) * this.jitter;
      this.historyPoints.push(Math.max(currentLat, 2));
      if (this.historyPoints.length > 24) this.historyPoints.shift();

      this.drawWaveform();
    }, 250);
  }

  drawWaveform() {
    const linePath = this.container.querySelector("#waveform-line-path");
    const areaPath = this.container.querySelector("#waveform-area-path");
    if (!linePath || !areaPath) return;

    const width = 300;
    const height = 60;
    const pts = this.historyPoints;
    const maxVal = Math.max(...pts, 40);
    const minVal = Math.min(...pts, 0);

    const stepX = width / (pts.length - 1);
    let dLine = "";
    let dArea = "";

    pts.forEach((val, idx) => {
      const x = (idx * stepX).toFixed(1);
      const normalized = (val - minVal) / (maxVal - minVal || 1);
      const y = (height - normalized * (height - 10) - 5).toFixed(1);

      if (idx === 0) {
        dLine += `M ${x} ${y}`;
        dArea += `M ${x} ${height} L ${x} ${y}`;
      } else {
        dLine += ` L ${x} ${y}`;
        dArea += ` L ${x} ${y}`;
      }
    });

    dArea += ` L ${width} ${height} Z`;

    linePath.setAttribute("d", dLine);
    areaPath.setAttribute("d", dArea);

    if (this.healthScore > 80) linePath.setAttribute("stroke", "#38bdf8");
    else if (this.healthScore > 50) linePath.setAttribute("stroke", "#f59e0b");
    else linePath.setAttribute("stroke", "#f43f5e");
  }
}

window.NetworkSimulationDashboard = NetworkSimulationDashboard;
