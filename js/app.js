// Networking Academy Pro — Main E-Learning Application & State Controller
class NetworkingApp {
  constructor() {
    this.currentView = "home"; // 'home' or 'module'
    this.currentModuleIndex = 0;
    this.selectedDeviceId = "endpoint-pc";
    this.completedModules = JSON.parse(localStorage.getItem("net_completed_modules") || "[]");
    this.userXP = parseInt(localStorage.getItem("net_user_xp") || "120", 10);
    this.terminalInstance = null;
    
    this.init();
  }

  init() {
    this.startLiveClock();
    this.initTerminal();
    this.initSizableLayout();
    this.bindGlobalEvents();
    this.applyTheme();
    this.renderNavigation();
    this.handleInitialRoute();
    this.updateUserStats();
  }

  startLiveClock() {
    const clockEl = document.getElementById("header-live-clock");
    const update = () => {
      const now = new Date();
      const localStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const utcStr = now.toISOString().substring(11, 19) + " UTC";
      if (clockEl) {
        clockEl.innerHTML = `
          <span class="clock-live-pulse"></span>
          <span class="clock-local">${localStr}</span>
          <span class="clock-utc">(${utcStr})</span>
        `;
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
    if (updateHash) {
      window.location.hash = "home";
    }

    this.renderNavigation();

    const contentArea = document.getElementById("module-content-area");
    if (!contentArea) return;

    const device = window.NETWORK_DEVICES.find(d => d.id === this.selectedDeviceId) || window.NETWORK_DEVICES[0];

    contentArea.innerHTML = `
      <!-- Dribbble E-Learning Hero Dashboard -->
      <div class="dribbble-hero-banner">
        <div class="hero-content">
          <div class="hero-chip-badge">
            <span class="chip-star">✨</span> Foundational Networking Series
          </div>
          <h2 class="hero-title">Master Computer Networking from Ground Zero</h2>
          <p class="hero-subtitle">
            Explore physical hardware, silicon architecture, packet dissections, subnetting math, and VLAN trunking with live interactive visualizers and an embedded Linux terminal.
          </p>
          <div class="hero-action-group">
            <button class="btn-dribbble-primary" id="btn-start-course">
              <span>Start Course (Module 0)</span>
              <span class="btn-arrow">➔</span>
            </button>
            <button class="btn-dribbble-secondary" id="btn-browse-hardware">
              <span>Explore Hardware Catalog</span>
            </button>
          </div>
        </div>

        <div class="hero-stats-panel">
          <div class="stat-pill-card">
            <div class="stat-num">9</div>
            <div class="stat-label">Modules</div>
          </div>
          <div class="stat-pill-card">
            <div class="stat-num">7</div>
            <div class="stat-label">Simulators</div>
          </div>
          <div class="stat-pill-card">
            <div class="stat-num" id="hero-xp-display">${this.userXP}</div>
            <div class="stat-label">XP Earned</div>
          </div>
        </div>
      </div>

      <!-- Interactive Network Blueprint Section -->
      <section class="dribbble-section" id="section-blueprint">
        <div class="section-header-modern">
          <div>
            <span class="section-tag">Interactive Blueprint</span>
            <h3>Enterprise Network Architecture</h3>
            <p>Click any physical network node below to inspect its Layer, hardware anatomy, ports, and protocols:</p>
          </div>
        </div>

        <div class="modern-blueprint-container">
          <div class="blueprint-stream-flow">
            
            <div class="stream-node-box ${this.selectedDeviceId === 'modem' ? 'node-selected' : ''}" data-device-id="modem">
              <span class="node-layer-badge">Layer 1/2</span>
              <div class="node-icon-bubble">📡</div>
              <strong>Fiber ONT / Modem</strong>
              <small>Optical ➔ Ethernet</small>
            </div>

            <div class="stream-connector-line">
              <span class="packet-spark"></span>
            </div>

            <div class="stream-node-box ${this.selectedDeviceId === 'router' ? 'node-selected' : ''}" data-device-id="router">
              <span class="node-layer-badge">Layer 3</span>
              <div class="node-icon-bubble">🌐</div>
              <strong>Gateway Router</strong>
              <small>NAT & Routing Table</small>
            </div>

            <div class="stream-connector-line">
              <span class="packet-spark"></span>
            </div>

            <div class="stream-node-box ${this.selectedDeviceId === 'switch-l2' ? 'node-selected' : ''}" data-device-id="switch-l2">
              <span class="node-layer-badge">Layer 2</span>
              <div class="node-icon-bubble">🔀</div>
              <strong>Managed Switch</strong>
              <small>802.1Q VLANs & MAC</small>
            </div>

            <div class="stream-connector-line">
              <span class="packet-spark"></span>
            </div>

            <div class="stream-cluster-stack">
              <div class="cluster-mini-card ${this.selectedDeviceId === 'endpoint-pc' ? 'cluster-active' : ''}" data-device-id="endpoint-pc">
                <span>💻 Workstations</span>
              </div>
              <div class="cluster-mini-card ${this.selectedDeviceId === 'server' ? 'cluster-active' : ''}" data-device-id="server">
                <span>🗄️ Rack Servers</span>
              </div>
              <div class="cluster-mini-card ${this.selectedDeviceId === 'voip-phone' ? 'cluster-active' : ''}" data-device-id="voip-phone">
                <span>📞 VoIP Phones</span>
              </div>
              <div class="cluster-mini-card ${this.selectedDeviceId === 'ip-camera' ? 'cluster-active' : ''}" data-device-id="ip-camera">
                <span>📹 IP Cameras</span>
              </div>
              <div class="cluster-mini-card ${this.selectedDeviceId === 'printer' ? 'cluster-active' : ''}" data-device-id="printer">
                <span>🖨️ Laser Printers</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- Hardware Catalog Section -->
      <section class="dribbble-section" id="section-hardware">
        <div class="section-header-modern">
          <div>
            <span class="section-tag">Hardware Catalog</span>
            <h3>Physical Devices & Cabling Media</h3>
            <p>Select any device to dissect its internal silicon architecture, kernel path, and typical port specs:</p>
          </div>
        </div>

        <div class="hardware-cards-carousel">
          ${window.NETWORK_DEVICES.map(d => `
            <div class="device-card-dribbble ${d.id === this.selectedDeviceId ? 'card-selected' : ''}" data-device-id="${d.id}">
              <div class="dribbble-card-top">
                <span class="device-layer-pill">${d.osiLayer.split(' ')[0]}</span>
                <span class="device-cat-pill">${d.category.split(' ')[0]}</span>
              </div>
              <div class="card-icon-big">${d.icon}</div>
              <strong class="card-device-name">${d.name}</strong>
              <p class="card-device-desc">${d.tagline}</p>
              <div class="card-action-bar">
                <span>Inspect Device ➔</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Selected Device Anatomy Inspector -->
        <div class="device-inspector-dribbble" id="device-inspector-anchor">
          <div class="inspector-header">
            <div class="inspector-title-row">
              <span class="inspector-big-icon">${device.icon}</span>
              <div>
                <h4>${device.name}</h4>
                <div class="inspector-badges">
                  <span class="badge-accent">${device.category}</span>
                  <span class="badge-layer">${device.osiLayer}</span>
                </div>
              </div>
            </div>
            <button class="btn-dribbble-secondary btn-term-ping" data-cmd="ping 192.168.1.1">
              <span>Ping in Terminal ↵</span>
            </button>
          </div>

          <p class="inspector-tagline">${device.tagline}</p>

          <div class="inspector-body-grid">
            <div class="inspector-left-col">
              <h5>Core Engineering Role</h5>
              <p>${device.role}</p>

              <h5 style="margin-top:16px;">Physical Silicon & Kernel Anatomy</h5>
              <div class="anatomy-rich-list">${device.anatomy}</div>
            </div>

            <div class="inspector-right-col">
              <h5>Technical Specifications</h5>
              <div class="specs-grid-dribbble">
                <div class="spec-row">
                  <span class="spec-label">Addressing:</span>
                  <span class="spec-value">${device.specs.addressing}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Interfaces:</span>
                  <span class="spec-value">${device.specs.interfaces}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Typical Ports:</span>
                  <span class="spec-value"><code>${device.specs.typicalPorts}</code></span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Protocols:</span>
                  <span class="spec-value"><code>${device.specs.protocols}</code></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Learning Roadmap Overview -->
      <section class="dribbble-section">
        <div class="section-header-modern">
          <div>
            <span class="section-tag">Learning Journey</span>
            <h3>Course Curriculum Roadmap</h3>
            <p>Step-by-step engineering lessons with zero buzzwords:</p>
          </div>
        </div>

        <div class="course-modules-grid">
          ${window.CURRICULUM.map((mod, idx) => {
            const isCompleted = this.completedModules.includes(mod.id);
            return `
              <div class="module-roadmap-card ${isCompleted ? 'module-done' : ''}" data-mod-idx="${idx}">
                <div class="module-card-top">
                  <span class="module-step-badge">Module ${idx}</span>
                  ${isCompleted ? '<span class="status-pill-completed">✓ Completed</span>' : '<span class="status-pill-ready">Ready</span>'}
                </div>
                <div class="module-icon-wrap">${mod.icon}</div>
                <strong class="module-title-text">${mod.title}</strong>
                <p class="module-desc-text">${mod.tagline}</p>
                <div class="module-card-footer">
                  <span class="start-text">${isCompleted ? 'Review Module ➔' : 'Start Module ➔'}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;

    // Bind Home Page Events
    document.getElementById("btn-start-course")?.addEventListener("click", () => this.loadModule(0, true));
    document.getElementById("btn-browse-hardware")?.addEventListener("click", () => {
      document.getElementById("section-hardware")?.scrollIntoView({ behavior: "smooth" });
    });

    // Device click events on blueprint and catalog
    contentArea.querySelectorAll("[data-device-id]").forEach(el => {
      el.addEventListener("click", () => {
        const devId = el.getAttribute("data-device-id");
        this.selectDevice(devId);
      });
    });

    // Module roadmap card clicks
    contentArea.querySelectorAll("[data-mod-idx]").forEach(card => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.getAttribute("data-mod-idx"), 10);
        this.loadModule(idx, true);
      });
    });

    // Terminal ping button
    contentArea.querySelectorAll(".btn-term-ping").forEach(btn => {
      btn.addEventListener("click", () => {
        const cmd = btn.getAttribute("data-cmd");
        if (this.terminalInstance) this.terminalInstance.runSampleCommand(cmd);
      });
    });

    document.querySelector(".main-content").scrollTop = 0;
  }

  selectDevice(deviceId) {
    this.selectedDeviceId = deviceId;
    this.showHomeView(false);
    const detailBox = document.getElementById("device-inspector-anchor");
    if (detailBox) detailBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  renderNavigation() {
    const navContainer = document.getElementById("nav-modules-list");
    if (!navContainer) return;

    let html = `
      <button class="nav-item ${this.currentView === 'home' ? 'nav-active' : ''}" id="nav-item-home">
        <span class="nav-icon">🏠</span>
        <div class="nav-text">
          <span class="nav-short">Home & Hardware</span>
          <small class="nav-tagline">Devices, Cables & Blueprint</small>
        </div>
      </button>
      <div class="sidebar-divider"></div>
      <div class="sidebar-subheading">Core Modules (0–8)</div>
    `;

    html += window.CURRICULUM.map((mod, idx) => {
      const isCompleted = this.completedModules.includes(mod.id);
      const isActive = this.currentView === 'module' && idx === this.currentModuleIndex;
      return `
        <button class="nav-item ${isActive ? 'nav-active' : ''}" data-index="${idx}" data-id="${mod.id}">
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

    // Direct event listener binding
    document.getElementById("nav-item-home")?.addEventListener("click", () => this.showHomeView(true));
    navContainer.querySelectorAll(".nav-item[data-index]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        this.loadModule(idx, true);
      });
    });

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
          <div class="quiz-card-dribbble" id="quiz-${mod.id}-${sIdx}">
            <div class="quiz-badge-modern">🧠 Knowledge Check &bull; +50 XP</div>
            <div class="quiz-question-modern">${sec.quiz.question}</div>
            <div class="quiz-options-group">
              ${sec.quiz.options.map((opt, optIdx) => `
                <button class="quiz-option-card" data-mod="${mod.id}" data-sec="${sIdx}" data-opt="${optIdx}">
                  <span class="opt-bullet">${String.fromCharCode(65 + optIdx)}</span>
                  <span class="opt-text">${opt.text}</span>
                </button>
              `).join('')}
            </div>
            <div class="quiz-feedback-modern" id="feedback-${mod.id}-${sIdx}"></div>
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

    // Footer navigation
    const isLast = index === window.CURRICULUM.length - 1;
    const isCompleted = this.completedModules.includes(mod.id);

    const footerHtml = `
      <div class="module-footer-modern">
        <button class="btn-dribbble-secondary" id="btn-prev-mod" ${index === 0 ? 'disabled' : ''}>
          🡄 Previous Module
        </button>
        <div class="footer-center-group">
          <button class="btn-complete-status ${isCompleted ? 'is-completed' : ''}" id="btn-complete-mod">
            ${isCompleted ? '✓ Completed (+100 XP)' : 'Mark as Learned ✓ (+100 XP)'}
          </button>
        </div>
        <button class="btn-dribbble-primary" id="btn-next-mod">
          <span>${isLast ? 'Complete Course 🎉' : 'Next Module 🡆'}</span>
        </button>
      </div>
    `;

    contentArea.innerHTML = `
      <!-- Breadcrumb Bar -->
      <div class="breadcrumb-bar">
        <span class="crumb-link" id="crumb-home">🏠 Home</span>
        <span class="crumb-sep">/</span>
        <span class="crumb-current">Module ${index}: ${mod.shortTitle}</span>
      </div>

      <!-- Dribbble Style Module Header Hero -->
      <div class="module-hero-banner">
        <div class="mod-badge-row">
          <span class="mod-badge-pill">${mod.icon} Module ${index} of ${window.CURRICULUM.length - 1}</span>
          <span class="mod-time-pill">⏱️ ~12 min read</span>
          <span class="mod-xp-pill">⚡ 150 XP</span>
        </div>
        <h2>${mod.title}</h2>
        <p class="mod-hero-tagline">${mod.tagline}</p>
      </div>

      <div class="module-sections-wrap">
        ${sectionsHtml}
      </div>

      ${footerHtml}
    `;

    // Bind event listeners
    document.getElementById("crumb-home")?.addEventListener("click", () => this.showHomeView(true));
    document.getElementById("btn-prev-mod")?.addEventListener("click", () => this.loadModule(this.currentModuleIndex - 1, true));
    document.getElementById("btn-next-mod")?.addEventListener("click", () => {
      if (isLast) {
        this.showHomeView(true);
      } else {
        this.loadModule(this.currentModuleIndex + 1, true);
      }
    });

    document.getElementById("btn-complete-mod")?.addEventListener("click", () => {
      this.toggleModuleCompleted(mod.id);
    });

    // Bind Quiz Option Click Handlers
    contentArea.querySelectorAll(".quiz-option-card").forEach(btn => {
      btn.addEventListener("click", () => {
        const modId = btn.getAttribute("data-mod");
        const secIdx = parseInt(btn.getAttribute("data-sec"), 10);
        const optIdx = parseInt(btn.getAttribute("data-opt"), 10);
        this.handleQuizAnswer(modId, secIdx, optIdx);
      });
    });

    // Mount visualizers
    this.mountVisualizers(mod);

    // Scroll to top
    document.querySelector(".main-content").scrollTop = 0;
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

    quizCard.querySelectorAll(".quiz-option-card").forEach((b, idx) => {
      b.classList.remove("opt-correct", "opt-incorrect");
      if (idx === optIdx) {
        b.classList.add(opt.correct ? "opt-correct" : "opt-incorrect");
      }
    });

    feedbackEl.className = `quiz-feedback-modern ${opt.correct ? 'feedback-correct' : 'feedback-incorrect'}`;
    feedbackEl.innerHTML = opt.feedback;

    if (opt.correct) {
      this.addXP(50);
    }
  }

  addXP(amount) {
    this.userXP += amount;
    localStorage.setItem("net_user_xp", this.userXP);
    this.updateUserStats();
  }

  updateUserStats() {
    const xpBadge = document.getElementById("header-user-xp");
    if (xpBadge) xpBadge.textContent = `${this.userXP} XP`;
    const heroXP = document.getElementById("hero-xp-display");
    if (heroXP) heroXP.textContent = this.userXP;
  }

  toggleModuleCompleted(modId) {
    if (this.completedModules.includes(modId)) {
      this.completedModules = this.completedModules.filter(id => id !== modId);
    } else {
      this.completedModules.push(modId);
      this.addXP(100);
    }
    localStorage.setItem("net_completed_modules", JSON.stringify(this.completedModules));
    this.renderNavigation();
    this.loadModule(this.currentModuleIndex, false);
  }

  markChallengeComplete(challengeId) {
    if (!this.completedModules.includes(`challenge-${challengeId}`)) {
      this.completedModules.push(`challenge-${challengeId}`);
      localStorage.setItem("net_completed_modules", JSON.stringify(this.completedModules));
      this.addXP(150);
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
    }
  }

  initSizableLayout() {
    const sidebar = document.getElementById("app-sidebar");
    const terminal = document.getElementById("terminal-panel");
    const resizerLeft = document.getElementById("resizer-left");
    const resizerRight = document.getElementById("resizer-right");

    const savedSidebarWidth = localStorage.getItem("net_sidebar_width");
    const savedTerminalWidth = localStorage.getItem("net_terminal_width");

    if (savedSidebarWidth && sidebar) sidebar.style.width = `${savedSidebarWidth}px`;
    if (savedTerminalWidth && terminal) terminal.style.width = `${savedTerminalWidth}px`;

    // Left Resizer Drag
    if (resizerLeft && sidebar) {
      let isDraggingLeft = false;
      resizerLeft.addEventListener("mousedown", () => {
        isDraggingLeft = true;
        document.body.classList.add("resizing-horizontal");
        resizerLeft.classList.add("resizer-active");
      });

      window.addEventListener("mousemove", (e) => {
        if (!isDraggingLeft) return;
        const newWidth = Math.min(Math.max(e.clientX, 200), 480);
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

    // Right Resizer Drag
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
        const newWidth = Math.min(Math.max(windowWidth - e.clientX, 280), 820);
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

  bindGlobalEvents() {
    // Hash routing
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

    // Terminal side toggle
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

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  window.app = new NetworkingApp();
});
