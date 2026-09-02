// Interactive Subnet Mask & IPv4 Bit Boundary Visualizer
class SubnetVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      ipStr: "192.168.1.50",
      cidr: 24,
      testIpStr: "192.168.1.99"
    };
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.updateMath();
  }

  render() {
    this.container.innerHTML = `
      <div class="vis-wrapper subnet-vis">
        <div class="vis-header">
          <div class="vis-title">
            <span class="pulse-dot"></span>
            <strong>IPv4 32-Bit Subnet Mask & Network Boundary Explorer</strong>
          </div>
        </div>

        <div class="subnet-controls-bar">
          <div class="control-group">
            <label>IPv4 Address:</label>
            <input type="text" id="sub-ip-input" class="vis-input" value="${this.state.ipStr}" maxlength="15" />
          </div>

          <div class="control-group slider-group">
            <label>Prefix / CIDR: <strong id="sub-cidr-label">/${this.state.cidr}</strong></label>
            <input type="range" id="sub-cidr-slider" min="8" max="30" value="${this.state.cidr}" class="range-slider" />
          </div>

          <div class="control-group">
            <label>Presets:</label>
            <div class="preset-buttons">
              <button class="btn-subtle" onclick="document.getElementById('sub-cidr-slider').value=24; document.getElementById('sub-cidr-slider').dispatchEvent(new Event('input'))">/24 (Class C)</button>
              <button class="btn-subtle" onclick="document.getElementById('sub-cidr-slider').value=16; document.getElementById('sub-cidr-slider').dispatchEvent(new Event('input'))">/16 (Class B)</button>
              <button class="btn-subtle" onclick="document.getElementById('sub-cidr-slider').value=28; document.getElementById('sub-cidr-slider').dispatchEvent(new Event('input'))">/28 (Small Subnet)</button>
            </div>
          </div>
        </div>

        <!-- 32-Bit Binary Layout Display -->
        <div class="bit-layout-card">
          <div class="bit-legend">
            <span class="legend-item"><span class="legend-box bit-net"></span> Network Prefix Bits (Must match for direct communication)</span>
            <span class="legend-item"><span class="legend-box bit-host"></span> Host ID Bits (Unique per machine inside this subnet)</span>
          </div>

          <div class="octets-grid" id="sub-octets-grid">
            <!-- 4 octets rendered dynamically -->
          </div>
        </div>

        <!-- Calculated Metrics Table -->
        <div class="subnet-results-grid">
          <div class="result-card">
            <span class="res-title">Subnet Mask (Decimal)</span>
            <code class="res-val" id="res-mask-dec">255.255.255.0</code>
          </div>
          <div class="result-card">
            <span class="res-title">Network Address (First ID)</span>
            <code class="res-val" id="res-net-addr">192.168.1.0</code>
          </div>
          <div class="result-card">
            <span class="res-title">Broadcast Address (All 1s)</span>
            <code class="res-val" id="res-bcast-addr">192.168.1.255</code>
          </div>
          <div class="result-card">
            <span class="res-title">Usable Host Range</span>
            <code class="res-val" id="res-host-range">192.168.1.1 - 192.168.1.254</code>
          </div>
          <div class="result-card">
            <span class="res-title">Total Usable Machine IPs</span>
            <code class="res-val" id="res-usable-count">254 hosts (2^(32-24) - 2)</code>
          </div>
        </div>

        <!-- Subnet Neighborhood Reachability Tester -->
        <div class="subnet-tester-box">
          <div class="tester-header">
            <strong>Subnet Route Tester: Can Computer A talk directly to Computer B?</strong>
          </div>
          <div class="tester-inputs">
            <span>Computer A: <code id="test-comp-a">192.168.1.50</code></span>
            <span>➔ Target Computer B:</span>
            <input type="text" id="test-target-ip" class="vis-input" value="${this.state.testIpStr}" />
            <button id="btn-test-route" class="btn-vis btn-primary">Check Route ➔</button>
          </div>
          <div id="test-route-result" class="route-result-badge">
            <!-- Dynamic routing feedback -->
          </div>
        </div>
      </div>
    `;

    // Event handlers
    const ipInput = this.container.querySelector("#sub-ip-input");
    const slider = this.container.querySelector("#sub-cidr-slider");
    const targetInput = this.container.querySelector("#test-target-ip");
    const checkBtn = this.container.querySelector("#btn-test-route");

    ipInput.addEventListener("input", (e) => {
      this.state.ipStr = e.target.value.trim();
      this.updateMath();
    });

    slider.addEventListener("input", (e) => {
      this.state.cidr = parseInt(e.target.value, 10);
      this.container.querySelector("#sub-cidr-label").textContent = `/${this.state.cidr}`;
      this.updateMath();
    });

    checkBtn.addEventListener("click", () => {
      this.state.testIpStr = targetInput.value.trim();
      this.testReachability();
    });
  }

  parseIP(ipStr) {
    const parts = ipStr.split('.').map(p => parseInt(p, 10));
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      return null;
    }
    return parts;
  }

  ipToNumber(octets) {
    return ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + (octets[3] >>> 0);
  }

  numberToIP(num) {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  }

  updateMath() {
    const octets = this.parseIP(this.state.ipStr);
    if (!octets) return;

    const cidr = this.state.cidr;
    const ipNum = this.ipToNumber(octets);

    // Calculate mask
    const maskNum = cidr === 0 ? 0 : ((0xFFFFFFFF << (32 - cidr)) >>> 0);
    const maskOctets = [
      (maskNum >>> 24) & 255,
      (maskNum >>> 16) & 255,
      (maskNum >>> 8) & 255,
      maskNum & 255
    ];

    // Network & Broadcast
    const netNum = (ipNum & maskNum) >>> 0;
    const wildcardNum = (~maskNum) >>> 0;
    const bcastNum = (netNum | wildcardNum) >>> 0;

    const hostBits = 32 - cidr;
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = hostBits >= 2 ? totalHosts - 2 : (hostBits === 1 ? 2 : 1);

    const firstUsable = (hostBits >= 2) ? this.numberToIP(netNum + 1) : this.numberToIP(netNum);
    const lastUsable = (hostBits >= 2) ? this.numberToIP(bcastNum - 1) : this.numberToIP(bcastNum);

    // Update Result elements
    this.container.querySelector("#res-mask-dec").textContent = maskOctets.join('.');
    this.container.querySelector("#res-net-addr").textContent = this.numberToIP(netNum);
    this.container.querySelector("#res-bcast-addr").textContent = this.numberToIP(bcastNum);
    this.container.querySelector("#res-host-range").textContent = `${firstUsable} - ${lastUsable}`;
    this.container.querySelector("#res-usable-count").textContent = `${usableHosts.toLocaleString()} hosts (2^${hostBits} - 2)`;
    this.container.querySelector("#test-comp-a").textContent = this.state.ipStr;

    // Render bit octets grid
    const octetsContainer = this.container.querySelector("#sub-octets-grid");
    octetsContainer.innerHTML = octets.map((oct, oIdx) => {
      const octBin = oct.toString(2).padStart(8, '0');
      const startBit = oIdx * 8;
      
      const bitsHtml = Array.from(octBin).map((bitChar, bIdx) => {
        const globalBitIndex = startBit + bIdx;
        const isNetBit = globalBitIndex < cidr;
        return `
          <div class="bit-cell ${isNetBit ? 'bit-net-cell' : 'bit-host-cell'}">
            <span class="bit-num">${bitChar}</span>
            <span class="bit-idx">${globalBitIndex + 1}</span>
          </div>
        `;
      }).join('');

      return `
        <div class="octet-box">
          <div class="octet-header">
            <span class="oct-title">Octet #${oIdx + 1}</span>
            <strong class="oct-dec">${oct}</strong>
          </div>
          <div class="octet-bits-row">
            ${bitsHtml}
          </div>
        </div>
      `;
    }).join('');

    this.testReachability();
  }

  testReachability() {
    const octetsA = this.parseIP(this.state.ipStr);
    const octetsB = this.parseIP(this.state.testIpStr);
    const resEl = this.container.querySelector("#test-route-result");
    if (!resEl) return;

    if (!octetsA || !octetsB) {
      resEl.className = "route-result-badge badge-warn";
      resEl.innerHTML = "⚠️ Please enter valid IPv4 addresses in both fields (e.g. 192.168.1.50).";
      return;
    }

    const cidr = this.state.cidr;
    const maskNum = cidr === 0 ? 0 : ((0xFFFFFFFF << (32 - cidr)) >>> 0);
    const netA = (this.ipToNumber(octetsA) & maskNum) >>> 0;
    const netB = (this.ipToNumber(octetsB) & maskNum) >>> 0;

    if (netA === netB) {
      resEl.className = "route-result-badge badge-success";
      resEl.innerHTML = `
        <strong>✅ Same Subnet (Direct L2 Link)</strong><br>
        Both machines share network prefix <code>${this.numberToIP(netA)}/${cidr}</code>.
        Packets travel directly over the local switch via ARP/MAC addresses without going through a default gateway router!
      `;
    } else {
      resEl.className = "route-result-badge badge-router";
      resEl.innerHTML = `
        <strong>🌐 Different Subnets (Requires L3 Gateway Router)</strong><br>
        Computer A is in <code>${this.numberToIP(netA)}/${cidr}</code>, while Target is in <code>${this.numberToIP(netB)}/${cidr}</code>.
        Computer A cannot deliver this frame directly; it must address the packet to its <strong>Default Gateway Router</strong> to be routed across subnets!
      `;
    }
  }
}

window.SubnetVisualizer = SubnetVisualizer;
