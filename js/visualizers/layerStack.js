// Expanded Layer Stack & Encapsulation Inspector Visualizer
class LayerStackVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = {
      selectedLayer: 4, // 5: Application, 4: Transport, 3: Network, 2: Data Link, 1: Physical
      payload: "GET /api/status HTTP/1.1"
    };
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    const layers = [
      {
        num: 5,
        name: "Application Layer (L7 / L5)",
        unit: "Message / Data",
        color: "#a855f7",
        header: "None (Raw payload)",
        fields: [
          { name: "Method", val: "GET" },
          { name: "Path", val: "/api/status" },
          { name: "Protocol", val: "HTTP/1.1" },
          { name: "Headers", val: "Host: internal.net, User-Agent: curl/8.4" }
        ],
        desc: "The actual data created by software applications (web browsers, game clients, database drivers). It has no concept of IP routing or network wires—only the application's own text or binary protocol format."
      },
      {
        num: 4,
        name: "Transport Layer (L4 - TCP/UDP)",
        unit: "Segment (TCP) / Datagram (UDP)",
        color: "#38bdf8",
        header: "TCP Header (20 Bytes)",
        fields: [
          { name: "Source Port", val: "54218 (Ephemeral OS port)" },
          { name: "Destination Port", val: "80 (Standard HTTP)" },
          { name: "Sequence Number", val: "1001" },
          { name: "Acknowledgment Number", val: "5001" },
          { name: "Flags", val: "ACK, PSH" },
          { name: "Window Size", val: "65535 bytes" }
        ],
        desc: "Multiplexes data to the correct process using port numbers and manages reliability (sequence counters, acknowledgments, flow control window)."
      },
      {
        num: 3,
        name: "Network Layer (L3 - IPv4/IPv6)",
        unit: "Packet",
        color: "#10b981",
        header: "IPv4 Header (20 Bytes)",
        fields: [
          { name: "Source IP", val: "192.168.1.10" },
          { name: "Destination IP", val: "10.0.0.50" },
          { name: "TTL (Time-To-Live)", val: "64 hops" },
          { name: "Protocol Field", val: "0x06 (TCP)" },
          { name: "Header Checksum", val: "0x3B9F" }
        ],
        desc: "Provides global logical addressing so routers can inspect the destination IP and forward the packet across multiple distinct physical networks."
      },
      {
        num: 2,
        name: "Data Link Layer (L2 - Ethernet/Wi-Fi)",
        unit: "Frame",
        color: "#f59e0b",
        header: "Ethernet II Header (14 Bytes) + FCS Trailer (4 Bytes)",
        fields: [
          { name: "Source MAC", val: "02:42:AC:11:00:02" },
          { name: "Destination MAC (Next Hop)", val: "02:42:AC:11:00:01 (Default Gateway)" },
          { name: "EtherType", val: "0x0800 (IPv4)" },
          { name: "FCS / CRC32 Trailer", val: "0x9E44B2A1 (Error detection)" }
        ],
        desc: "Transfers frames directly across a single physical link between two adjacent network cards. Re-framed at every router hop!"
      },
      {
        num: 1,
        name: "Physical Layer (L1 - Wire / Radio)",
        unit: "Bits / Pulses",
        color: "#ef4444",
        header: "Preamble & Start Frame Delimiter (8 Bytes)",
        fields: [
          { name: "Medium", val: "1000BASE-T Copper Twisted Pair (Cat6)" },
          { name: "Encoding", val: "PAM-5 Voltage Modulation (+2V, +1V, 0V, -1V, -2V)" },
          { name: "Bit Timing Clock", val: "125 MHz Symbol Rate" }
        ],
        desc: "Converts binary 1s and 0s into physical voltage transitions, fiber-optic photons, or radio wave fluctuations."
      }
    ];

    const cur = layers.find(l => l.num === this.state.selectedLayer) || layers[1];

    this.container.innerHTML = `
      <div class="vis-wrapper layer-stack-vis">
        <div class="vis-header">
          <div class="vis-title">
            <span class="pulse-dot"></span>
            <strong>Interactive 5-Layer Stack & Encapsulation Inspector</strong>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Click any layer below to inspect its header fields</span>
        </div>

        <div class="stack-explorer-layout">
          <!-- Left: Clickable Layer Tower -->
          <div class="layer-tower">
            ${layers.map(l => `
              <div class="tower-layer ${l.num === this.state.selectedLayer ? 'tower-layer-active' : ''}" data-layer="${l.num}" style="--layer-color: ${l.color}">
                <div class="tower-num">Layer ${l.num}</div>
                <div class="tower-name">${l.name}</div>
                <div class="tower-unit">${l.unit}</div>
              </div>
            `).join('')}
          </div>

          <!-- Right: Selected Layer Header Dissector -->
          <div class="layer-dissector-card">
            <div class="dissector-header" style="border-left: 4px solid ${cur.color};">
              <h4>${cur.name}</h4>
              <span class="badge-unit">Data Unit: <strong>${cur.unit}</strong></span>
            </div>
            
            <p class="dissector-desc">${cur.desc}</p>
            
            <div class="header-fields-table-wrap">
              <strong>Header Fields & Values for Current Transmission:</strong>
              <table class="header-fields-table">
                <thead>
                  <tr>
                    <th>Field Name</th>
                    <th>Current Value</th>
                  </tr>
                </thead>
                <tbody>
                  ${cur.fields.map(f => `
                    <tr>
                      <td><strong>${f.name}</strong></td>
                      <td><code>${f.val}</code></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="wire-encapsulation-diagram">
              <span class="diag-title">Wire Frame Layout at this point:</span>
              <div class="envelope-chain">
                <span class="envelope env-eth ${cur.num <= 2 ? 'env-highlight' : 'env-dim'}">L2: Ethernet [MACs]</span>
                <span class="envelope env-ip ${cur.num <= 3 ? 'env-highlight' : 'env-dim'}">L3: IPv4 [IPs]</span>
                <span class="envelope env-tcp ${cur.num <= 4 ? 'env-highlight' : 'env-dim'}">L4: TCP [Ports]</span>
                <span class="envelope env-data env-highlight">L5: Payload ("${this.state.payload}")</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind layer click listeners
    this.container.querySelectorAll(".tower-layer").forEach(btn => {
      btn.addEventListener("click", () => {
        this.state.selectedLayer = parseInt(btn.dataset.layer, 10);
        this.render();
      });
    });
  }
}

window.LayerStackVisualizer = LayerStackVisualizer;
