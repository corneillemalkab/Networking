// Main Application Coordinator, Live Clock, Home View & Sizable Layout Engine
class App {
  constructor() {
    this.currentView = "home"; // 'home' or 'module'
    this.currentModuleIndex = 0;
    this.selectedDeviceId = "endpoint-pc";
    this.completedModules = JSON.parse(localStorage.getItem("net_completed_modules") || "[]");
    this.terminalInstance = null;
    this.init();
  }

  init() {
    this.startLiveClock();
    this.renderNavigation();
    this.initTerminal();
    this.initSizableLayout();
    this.bindGlobalEvents();
    this.applyTheme();
    this.handleInitialRoute();
  }

  startLiveClock() {
    const clockEl = document.getElementById("header-live-clock");
    const update = () => {
      const now = new Date();
      const localStr = now.toLocaleTimeString();
      const utcStr = now.toISOString().substring(11, 19) + " UTC";
      if (clockEl) {
        clockEl.innerHTML = `<span class="clock-icon">⏱️</span> <span class="clock-local">${localStr}</span> <span class="clock-utc">(${utcStr})</span>`;
      }
    };
    update();
    setInterval(update, 1000);
  }

  handleInitialRoute() {
    const hash = window.location.hash.replace("#", "");
    if (hash === "home" || !hash) {
      this.showHomeView(false);
    } else if (hash.startsWith("module-")) {
      const foundIdx = window.CURRICULUM.findIndex(m => m.id === hash);
      if (foundIdx !== -1) {
        this.loadModule(foundIdx, false);
      } else {
        this.showHomeView(false);
      }
    } else {
      this.showHomeView(false);
    }
  }

  showHomeView(updateHash = true) {
    this.currentView = "home";
    if (updateHash) window.location.hash = "home";

    // Update nav active buttons
    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("nav-active"));
    const homeNavBtn = document.getElementById("nav-item-home");
    if (homeNavBtn) homeNavBtn.classList.add("nav-active");

    const contentArea = document.getElementById("module-content-area");
    if (!contentArea) return;

    const device = window.NETWORK_DEVICES.find(d => d.id === this.selectedDeviceId) || window.NETWORK_DEVICES[0];

    contentArea.innerHTML = `
      <!-- Hero Welcome Banner -->
      <div class="home-hero-card">
        <div class="hero-left">
          <span class="hero-badge">⚡ Networking Academy — Level 0 to 1</span>
          <h2>Computer Networking from Ground Zero to Engineering Mastery</h2>
          <p class="hero-desc">
            Understand every wire, chip, and protocol powering the modern Internet. Start with concrete physical hardware and devices before diving into binary packets, subnetting, VLANs, and TCP handshakes.
          </p>
          <div class="hero-actions">
            <button class="btn-hero-primary" onclick="App.loadModule(0, true)">
              Start Learning Journey (Module 0) ➔
            </button>
            <button class="btn-hero-secondary" onclick="document.getElementById('hardware-catalog-section').scrollIntoView({behavior: 'smooth'})">
              Explore Network Hardware & Media 🗄️
            </button>
          </div>
        </div>
        <div class="hero-stats-badge">
          <div class="stat-box"><strong>9</strong><span>Interactive Modules</span></div>
          <div class="stat-box"><strong>7</strong><span>Visual Simulators</span></div>
          <div class="stat-box"><strong>100%</strong><span>Zero Buzzwords</span></div>
        </div>
      </div>

      <!-- Interactive Network Blueprint Architecture Diagram -->
      <section class="home-section">
        <div class="section-title-row">
          <div>
            <h3>🏢 Modern Enterprise & Home Network Blueprint</h3>
            <p style="color:var(--text-muted); font-size:0.88rem;">Click any physical hardware component in the architectural blueprint or catalog below to inspect its specifications:</p>
          </div>
        </div>

        <div class="network-blueprint-card">
          <div class="blueprint-flow">
            
            <div class="bp-stage">
              <span class="bp-stage-label">WAN / Internet Edge</span>
              <div class="bp-node ${this.selectedDeviceId === 'modem' ? 'bp-active' : ''}" onclick="App.selectDevice('modem')">
                <span class="bp-icon">📡</span>
                <strong>Fiber ONT / Modem</strong>
                <small>Optical ➔ Ethernet</small>
              </div>
            </div>

            <div class="bp-arrow">➔</div>

            <div class="bp-stage">
              <span class="bp-stage-label">L3 Boundary</span>
              <div class="bp-node ${this.selectedDeviceId === 'router' ? 'bp-active' : ''}" onclick="App.selectDevice('router')">
                <span class="bp-icon">🌐</span>
                <strong>Gateway Router</strong>
                <small>NAT & Routing Table</small>
              </div>
            </div>

            <div class="bp-arrow">➔</div>

            <div class="bp-stage">
              <span class="bp-stage-label">L2 Core Distribution</span>
              <div class="bp-node ${this.selectedDeviceId === 'switch-l2' ? 'bp-active' : ''}" onclick="App.selectDevice('switch-l2')">
                <span class="bp-icon">🔀</span>
                <strong>PoE Switch (802.1Q)</strong>
                <small>MAC Forwarding & VLANs</small>
              </div>
            </div>

            <div class="bp-arrow">➔</div>

            <div class="bp-stage">
              <span class="bp-stage-label">Connected Endpoints</span>
              <div class="bp-endpoints-stack">
                <div class="bp-mini-node ${this.selectedDeviceId === 'endpoint-pc' ? 'bp-active' : ''}" onclick="App.selectDevice('endpoint-pc')">💻 Workstation</div>
                <div class="bp-mini-node ${this.selectedDeviceId === 'server' ? 'bp-active' : ''}" onclick="App.selectDevice('server')">🗄️ Rack Server</div>
                <div class="bp-mini-node ${this.selectedDeviceId === 'voip-phone' ? 'bp-active' : ''}" onclick="App.selectDevice('voip-phone')">📞 VoIP Phone (PoE)</div>
                <div class="bp-mini-node ${this.selectedDeviceId === 'ip-camera' ? 'bp-active' : ''}" onclick="App.selectDevice('ip-camera')">📹 CCTV Camera (PoE)</div>
                <div class="bp-mini-node ${this.selectedDeviceId === 'printer' ? 'bp-active' : ''}" onclick="App.selectDevice('printer')">🖨️ Network Printer</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Hardware & Media Catalog Dissector -->
      <section class="home-section" id="hardware-catalog-section">
        <div class="section-title-row">
          <div>
            <h3>📦 Physical Hardware & Cabling Media Catalog</h3>
            <p style="color:var(--text-muted); font-size:0.88rem;">Select a device to view its internal anatomy, OSI layer, typical port numbers, and networking roles:</p>
          </div>
        </div>

        <div class="devices-catalog-grid">
          ${window.NETWORK_DEVICES.map(d => `
            <div class="device-thumb-card ${d.id === this.selectedDeviceId ? 'dev-card-active' : ''}" onclick="App.selectDevice('${d.id}')">
              <div class="thumb-icon">${d.icon}</div>
              <strong>${d.name}</strong>
              <small class="thumb-cat">${d.category}</small>
              <span class="thumb-layer">${d.osiLayer.split(' ')[0]} ${d.osiLayer.split(' ')[1] || ''}</span>
            </div>
          `).join('')}
        </div>

        <!-- Selected Device Detail Viewer -->
        <div class="device-detail-card" id="selected-device-detail-box">
          <div class="detail-header">
            <div class="detail-title-group">
              <span class="detail-icon">${device.icon}</span>
              <div>
                <h4>${device.name}</h4>
                <span class="detail-category">${device.category} &bull; <strong style="color:var(--accent-primary)">${device.osiLayer}</strong></span>
              </div>
            </div>
            <button class="btn-vis btn-subtle" onclick="TerminalApp.runSampleCommand('ping 192.168.1.1')">
              Test Connection in Terminal ↵
            </button>
          </div>

          <p class="detail-tagline">${device.tagline}</p>

          <div class="detail-grid">
            <div class="detail-pane">
              <strong>Core Engineering Role:</strong>
              <p>${device.role}</p>

              <strong style="margin-top:14px; display:block;">Physical & Kernel Anatomy:</strong>
              <div class="anatomy-list">${device.anatomy}</div>
            </div>

            <div class="detail-pane">
              <strong>Technical Specifications:</strong>
              <table class="specs-table">
                <tr><td><strong>Addressing:</strong></td><td>${device.specs.addressing}</td></tr>
                <tr><td><strong>Physical Interfaces:</strong></td><td>${device.specs.interfaces}</td></tr>
                <tr><td><strong>Typical Ports:</strong></td><td><code>${device.specs.typicalPorts}</code></td></tr>
                <tr><td><strong>Protocols Used:</strong></td><td><code>${device.specs.protocols}</code></td></tr>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Learning Journey Path Roadmap -->
      <section class="home-section">
        <div class="section-title-row">
          <div>
            <h3>🗺️ Learning Journey Roadmap</h3>
            <p style="color:var(--text-muted); font-size:0.88rem;">The progressive path from physical hardware to advanced web protocols and diagnostic labs:</p>
          </div>
        </div>

        <div class="journey-roadmap-grid">
          ${window.CURRICULUM.map((mod, idx) => {
            const isCompleted = this.completedModules.includes(mod.id);
            return `
              <div class="roadmap-card" onclick="App.loadModule(${idx}, true)">
                <div class="road-num">Step ${idx}</div>
                <div class="road-icon">${mod.icon}</div>
                <strong>${mod.title}</strong>
                <p>${mod.tagline}</p>
                <div class="road-footer">
                  <span class="road-action">Start Lesson ➔</span>
                  ${isCompleted ? '<span class="road-done">✓ Completed</span>' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;

    document.querySelector(".main-content").scrollTop = 0;
  }

  selectDevice(deviceId) {
    this.selectedDeviceId = deviceId;
    this.showHomeView(false);
    const detailBox = document.getElementById("selected-device-detail-box");
    if (detailBox) detailBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  renderNavigation() {
    const navContainer = document.getElementById("nav-modules-list");
    if (!navContainer) return;

    let html = `
      <button class="nav-item ${this.currentView === 'home' ? 'nav-active' : ''}" id="nav-item-home" onclick="App.showHomeView(true)">
        <span class="nav-icon">🏠</span>
        <div class="nav-text">
          <span class="nav-short">Home & Hardware Catalog</span>
          <small class="nav-tagline">Devices, Cables & Blueprint</small>
        </div>
      </button>
      <div class="sidebar-divider"></div>
    `;

    html += window.CURRICULUM.map((mod, idx) => {
      const isCompleted = this.completedModules.includes(mod.id);
      return `
        <button class="nav-item ${this.currentView === 'module' && idx === this.currentModuleIndex ? 'nav-active' : ''}" data-index="${idx}" data-id="${mod.id}" onclick="App.loadModule(${idx}, true)">
          <span class="nav-icon">${mod.icon}</span>
          <div class="nav-text">
            <span class="nav-short">${mod.shortTitle}</span>
            <small class="nav-tagline">${mod.title}</small>
          </div>
          ${isCompleted ? '<span class="nav-check">✓</span>' : ''}
        </button>
      `;
    }).join('');

    navContainer.innerHTML = html;
    this.updateProgressBadge();
  }

  loadModule(index, updateHash = true) {
    if (index < 0 || index >= window.CURRICULUM.length) return;
    this.currentView = "module";
    this.currentModuleIndex = index;
    const mod = window.CURRICULUM[index];

    if (updateHash) {
      window.location.hash = mod.id;
    }

    this.renderNavigation();

    // Render Module Content
    const contentArea = document.getElementById("module-content-area");
    if (!contentArea) return;

    let sectionsHtml = mod.sections.map((sec, sIdx) => {
      let extraHtml = "";

      if (sec.callout) {
        extraHtml += `
          <div class="callout-box callout-${sec.callout.type}">
            <div class="callout-header">
              <span class="callout-icon">${sec.callout.type === 'tip' ? '💡' : '📌'}</span>
              <strong>${sec.callout.title}</strong>
            </div>
            <p>${sec.callout.text}</p>
          </div>
        `;
      }

      if (sec.visualizer) {
        extraHtml += `<div id="vis-mount-${sec.visualizer}" class="vis-mount-container"></div>`;
      }

      if (sec.quiz) {
        extraHtml += `
          <div class="quiz-card" id="quiz-${mod.id}-${sIdx}">
            <div class="quiz-badge">🧠 Knowledge Check</div>
            <div class="quiz-question">${sec.quiz.question}</div>
            <div class="quiz-options">
              ${sec.quiz.options.map((opt, optIdx) => `
                <button class="quiz-opt-btn" data-mod="${mod.id}" data-sec="${sIdx}" data-opt="${optIdx}">
                  ${opt.text}
                </button>
              `).join('')}
            </div>
            <div class="quiz-feedback" id="feedback-${mod.id}-${sIdx}"></div>
          </div>
        `;
      }

      return `
        <section class="lesson-section">
          <h3>${sec.heading}</h3>
          ${sec.content ? `<div class="section-body">${sec.content}</div>` : ''}
          ${extraHtml}
        </section>
      `;
    }).join('');

    // Footer navigation with Mark Complete / Next
    const isLast = index === window.CURRICULUM.length - 1;
    const isCompleted = this.completedModules.includes(mod.id);

    const footerHtml = `
      <div class="module-footer">
        <button class="btn-footer btn-subtle" id="btn-prev-mod" ${index === 0 ? 'disabled' : ''}>
          🡄 Previous Module
        </button>
        <div class="footer-center">
          <button class="btn-footer ${isCompleted ? 'btn-completed' : 'btn-accent'}" id="btn-complete-mod">
            ${isCompleted ? '✓ Completed' : 'Mark as Learned ✓'}
          </button>
        </div>
        <button class="btn-footer btn-primary" id="btn-next-mod" ${isLast ? 'disabled' : ''}>
          ${isLast ? 'Finished Curriculum 🎉' : 'Next Module 🡆'}
        </button>
      </div>
    `;

    contentArea.innerHTML = `
      <div class="module-header-hero">
        <div class="hero-badge">
          <span class="hero-icon">${mod.icon}</span>
          <span>Module ${index} of ${window.CURRICULUM.length - 1}</span>
        </div>
        <h2>${mod.title}</h2>
        <p class="hero-tagline">${mod.tagline}</p>
      </div>

      <div class="module-sections-wrap">
        ${sectionsHtml}
      </div>

      ${footerHtml}
    `;

    // Bind footer navigation
    const prevBtn = document.getElementById("btn-prev-mod");
    const nextBtn = document.getElementById("btn-next-mod");
    const completeBtn = document.getElementById("btn-complete-mod");

    if (prevBtn) prevBtn.addEventListener("click", () => this.loadModule(this.currentModuleIndex - 1, true));
    if (nextBtn) nextBtn.addEventListener("click", () => this.loadModule(this.currentModuleIndex + 1, true));
    if (completeBtn) {
      completeBtn.addEventListener("click", () => {
        this.toggleModuleCompleted(mod.id);
      });
    }

    // Bind Quiz Option Click Handlers
    contentArea.querySelectorAll(".quiz-opt-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const modId = btn.dataset.mod;
        const secIdx = parseInt(btn.dataset.sec, 10);
        const optIdx = parseInt(btn.dataset.opt, 10);
        this.handleQuizAnswer(modId, secIdx, optIdx);
      });
    });

    // Mount visualizers
    this.mountVisualizers(mod);

    // Scroll to top of content
    const scrollContainer = document.querySelector(".main-content");
    if (scrollContainer) scrollContainer.scrollTop = 0;
  }

  handleQuizAnswer(modId, secIdx, optIdx) {
    const mod = window.CURRICULUM.find(m => m.id === modId);
    if (!mod) return;
    const sec = mod.sections[secIdx];
    if (!sec || !sec.quiz) return;

    const opt = sec.quiz.options[optIdx];
    const quizCard = document.getElementById(`quiz-${modId}-${secIdx}`);
    const feedbackEl = document.getElementById(`feedback-${modId}-${secIdx}`);

    if (!quizCard || !feedbackEl) return;

    // Reset option classes
    quizCard.querySelectorAll(".quiz-opt-btn").forEach((b, idx) => {
      b.classList.remove("opt-correct", "opt-incorrect");
      if (idx === optIdx) {
        b.classList.add(opt.correct ? "opt-correct" : "opt-incorrect");
      }
    });

    feedbackEl.className = `quiz-feedback ${opt.correct ? 'feedback-correct' : 'feedback-incorrect'}`;
    feedbackEl.innerHTML = opt.feedback;
  }

  mountVisualizers(mod) {
    mod.sections.forEach(sec => {
      if (sec.visualizer === "packetJourney" && window.PacketJourneyVisualizer) {
        new PacketJourneyVisualizer("vis-mount-packetJourney");
      } else if (sec.visualizer === "subnetVisualizer" && window.SubnetVisualizer) {
        new SubnetVisualizer("vis-mount-subnetVisualizer");
      } else if (sec.visualizer === "dnsVisualizer" && window.DNSVisualizer) {
        new DNSVisualizer("vis-mount-dnsVisualizer");
      } else if (sec.visualizer === "tcpHandshake" && window.TCPHandshakeVisualizer) {
        new TCPHandshakeVisualizer("vis-mount-tcpHandshake");
      } else if (sec.visualizer === "layerStack" && window.LayerStackVisualizer) {
        new LayerStackVisualizer("vis-mount-layerStack");
      } else if (sec.visualizer === "topologyVisualizer" && window.TopologyVisualizer) {
        new TopologyVisualizer("vis-mount-topologyVisualizer");
      } else if (sec.visualizer === "vlanVisualizer" && window.VLANVisualizer) {
        new VLANVisualizer("vis-mount-vlanVisualizer");
      }
    });
  }

  initTerminal() {
    const termMount = document.getElementById("terminal-mount");
    if (termMount && window.TerminalApp) {
      this.terminalInstance = new window.TerminalApp("terminal-mount");
      window.TerminalApp = this.terminalInstance;
    }
  }

  initSizableLayout() {
    const sidebar = document.getElementById("app-sidebar");
    const terminal = document.getElementById("terminal-panel");
    const resizerLeft = document.getElementById("resizer-left");
    const resizerRight = document.getElementById("resizer-right");

    // Load saved widths
    const savedSidebarWidth = localStorage.getItem("net_sidebar_width");
    const savedTerminalWidth = localStorage.getItem("net_terminal_width");

    if (savedSidebarWidth && sidebar) sidebar.style.width = `${savedSidebarWidth}px`;
    if (savedTerminalWidth && terminal) terminal.style.width = `${savedTerminalWidth}px`;

    // Left Resizer Drag (Sidebar)
    if (resizerLeft && sidebar) {
      let isDraggingLeft = false;

      resizerLeft.addEventListener("mousedown", () => {
        isDraggingLeft = true;
        document.body.classList.add("resizing-horizontal");
        resizerLeft.classList.add("resizer-active");
      });

      window.addEventListener("mousemove", (e) => {
        if (!isDraggingLeft) return;
        const newWidth = Math.min(Math.max(e.clientX, 180), 450);
        sidebar.style.width = `${newWidth}px`;
        localStorage.setItem("net_sidebar_width", newWidth);
      });

      window.addEventListener("mouseup", () => {
        if (isDraggingLeft) {
          isDraggingLeft = false;
          document.body.classList.remove("resizing-horizontal");
          resizerLeft.classList.remove("resizer-active");
        }
      });
    }

    // Right Resizer Drag (Terminal Panel)
    if (resizerRight && terminal) {
      let isDraggingRight = false;

      resizerRight.addEventListener("mousedown", () => {
        isDraggingRight = true;
        document.body.classList.add("resizing-horizontal");
        resizerRight.classList.add("resizer-active");
      });

      window.addEventListener("mousemove", (e) => {
        if (!isDraggingRight) return;
        const windowWidth = window.innerWidth;
        const newWidth = Math.min(Math.max(windowWidth - e.clientX, 280), 800);
        terminal.style.width = `${newWidth}px`;
        localStorage.setItem("net_terminal_width", newWidth);
      });

      window.addEventListener("mouseup", () => {
        if (isDraggingRight) {
          isDraggingRight = false;
          document.body.classList.remove("resizing-horizontal");
          resizerRight.classList.remove("resizer-active");
        }
      });
    }
  }

  toggleModuleCompleted(modId) {
    if (this.completedModules.includes(modId)) {
      this.completedModules = this.completedModules.filter(id => id !== modId);
    } else {
      this.completedModules.push(modId);
    }
    localStorage.setItem("net_completed_modules", JSON.stringify(this.completedModules));
    this.renderNavigation();
    this.loadModule(this.currentModuleIndex, false);
  }

  markChallengeComplete(challengeId) {
    if (!this.completedModules.includes(`challenge-${challengeId}`)) {
      this.completedModules.push(`challenge-${challengeId}`);
      localStorage.setItem("net_completed_modules", JSON.stringify(this.completedModules));
      this.updateProgressBadge();
    }
  }

  updateProgressBadge() {
    const total = window.CURRICULUM.length;
    const done = this.completedModules.filter(id => id.startsWith("module-")).length;
    const pct = Math.round((done / total) * 100);

    const progressEl = document.getElementById("curriculum-progress-pct");
    const barEl = document.getElementById("curriculum-progress-bar");
    if (progressEl) progressEl.textContent = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;
  }

  bindGlobalEvents() {
    // Hash change routing
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "home" || !hash) {
        if (this.currentView !== "home") this.showHomeView(false);
      } else if (hash.startsWith("module-")) {
        const foundIdx = window.CURRICULUM.findIndex(m => m.id === hash);
        if (foundIdx !== -1 && (foundIdx !== this.currentModuleIndex || this.currentView !== "module")) {
          this.loadModule(foundIdx, false);
        }
      }
    });

    // Terminal side-by-side toggle
    const toggleBtn = document.getElementById("btn-toggle-terminal");
    const terminalPanel = document.getElementById("terminal-panel");
    const resizerRight = document.getElementById("resizer-right");

    if (toggleBtn && terminalPanel) {
      toggleBtn.addEventListener("click", () => {
        terminalPanel.classList.toggle("panel-collapsed");
        if (resizerRight) resizerRight.classList.toggle("resizer-hidden");
        toggleBtn.textContent = terminalPanel.classList.contains("panel-collapsed") ? "Open Terminal 💻" : "Hide Terminal ➔";
      });
    }

    // Theme toggle
    const themeBtn = document.getElementById("btn-toggle-theme");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const cur = document.body.getAttribute("data-theme") || "dark";
        const next = cur === "dark" ? "light" : "dark";
        document.body.setAttribute("data-theme", next);
        localStorage.setItem("net_theme", next);
        themeBtn.textContent = next === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
      });
    }
  }

  applyTheme() {
    const saved = localStorage.getItem("net_theme") || "dark";
    document.body.setAttribute("data-theme", saved);
    const themeBtn = document.getElementById("btn-toggle-theme");
    if (themeBtn) {
      themeBtn.textContent = saved === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
  }
}

// Global initialization on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.App = new App();
});
