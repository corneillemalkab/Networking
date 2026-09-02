// Main Application Coordinator & Hash Router
class App {
  constructor() {
    this.currentModuleIndex = 0;
    this.completedModules = JSON.parse(localStorage.getItem("net_completed_modules") || "[]");
    this.terminalInstance = null;
    this.init();
  }

  init() {
    this.renderNavigation();
    this.handleInitialRoute();
    this.initTerminal();
    this.bindGlobalEvents();
    this.applyTheme();
  }

  handleInitialRoute() {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const foundIdx = window.CURRICULUM.findIndex(m => m.id === hash);
      if (foundIdx !== -1) {
        this.loadModule(foundIdx, false);
        return;
      }
    }
    this.loadModule(0, false);
  }

  renderNavigation() {
    const navContainer = document.getElementById("nav-modules-list");
    if (!navContainer) return;

    navContainer.innerHTML = window.CURRICULUM.map((mod, idx) => {
      const isCompleted = this.completedModules.includes(mod.id);
      return `
        <button class="nav-item ${idx === this.currentModuleIndex ? 'nav-active' : ''}" data-index="${idx}" data-id="${mod.id}">
          <span class="nav-icon">${mod.icon}</span>
          <div class="nav-text">
            <span class="nav-short">${mod.shortTitle}</span>
            <small class="nav-tagline">${mod.title}</small>
          </div>
          ${isCompleted ? '<span class="nav-check">✓</span>' : ''}
        </button>
      `;
    }).join('');

    // Bind click events
    navContainer.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        this.loadModule(idx, true);
      });
    });

    this.updateProgressBadge();
  }

  loadModule(index, updateHash = true) {
    if (index < 0 || index >= window.CURRICULUM.length) return;
    this.currentModuleIndex = index;
    const mod = window.CURRICULUM[index];

    if (updateHash) {
      window.location.hash = mod.id;
    }

    // Update nav active classes
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach((btn, idx) => {
      if (idx === index) btn.classList.add("nav-active");
      else btn.classList.remove("nav-active");
    });

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
          <span>Module ${index + 1} of ${window.CURRICULUM.length}</span>
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
    // Hash change browser back/forward routing
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const foundIdx = window.CURRICULUM.findIndex(m => m.id === hash);
        if (foundIdx !== -1 && foundIdx !== this.currentModuleIndex) {
          this.loadModule(foundIdx, false);
        }
      }
    });

    // Terminal side-by-side toggle
    const toggleBtn = document.getElementById("btn-toggle-terminal");
    const terminalPanel = document.getElementById("terminal-panel");
    if (toggleBtn && terminalPanel) {
      toggleBtn.addEventListener("click", () => {
        terminalPanel.classList.toggle("panel-collapsed");
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
