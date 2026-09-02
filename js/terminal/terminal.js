// Interactive In-Browser Networking Terminal Emulator
class TerminalApp {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.network = new MockNetworkSimulator();
    this.history = [];
    this.historyIndex = -1;
    this.executedCommands = [];
    this.activeMission = null;

    this.availableCommands = [
      "ping", "traceroute", "curl", "nslookup", "dig",
      "ip", "ifconfig", "arp", "netstat", "ss", "vlan",
      "nmap", "tcpdump", "dhcp", "dhclient",
      "challenge", "hint", "check", "clear", "help", "cat"
    ];

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
    this.printWelcome();
  }

  render() {
    this.container.innerHTML = `
      <div class="terminal-window">
        <div class="terminal-titlebar">
          <div class="terminal-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <div class="terminal-title">
            <span>bash — engineer@workstation: ~ (Interactive Network Lab)</span>
          </div>
          <div class="terminal-actions">
            <button id="term-btn-clear" class="btn-term-icon" title="Clear screen (Ctrl+L)">Clear</button>
          </div>
        </div>

        <div class="terminal-body" id="term-output-area">
          <!-- Terminal logs render here -->
        </div>

        <div class="terminal-input-row">
          <span class="term-prompt">engineer@workstation:~$</span>
          <input type="text" id="term-cli-input" class="term-input" autocomplete="off" spellcheck="false" autofocus />
        </div>
      </div>
    `;

    this.outputEl = this.container.querySelector("#term-output-area");
    this.inputEl = this.container.querySelector("#term-cli-input");
  }

  bindEvents() {
    this.inputEl.addEventListener("keydown", (e) => this.handleKeyDown(e));

    this.container.querySelector(".terminal-window").addEventListener("click", () => {
      this.inputEl.focus();
    });

    this.container.querySelector("#term-btn-clear").addEventListener("click", () => {
      this.clear();
    });
  }

  handleKeyDown(e) {
    if (e.key === "Enter") {
      const raw = this.inputEl.value.trim();
      this.inputEl.value = "";
      if (raw) {
        this.history.push(raw);
        this.historyIndex = this.history.length;
        this.executedCommands.push(raw);
        this.execute(raw);
      } else {
        this.writePromptLine("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex -= 1;
        this.inputEl.value = this.history[this.historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex += 1;
        this.inputEl.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.inputEl.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      this.handleAutoComplete();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      this.clear();
    }
  }

  handleAutoComplete() {
    const cur = this.inputEl.value.trim();
    if (!cur) return;
    const matches = this.availableCommands.filter(c => c.startsWith(cur));
    if (matches.length === 1) {
      this.inputEl.value = matches[0] + " ";
    } else if (matches.length > 1) {
      this.writePromptLine(cur);
      this.writeOutput(`<div class="term-info">${matches.join('   ')}</div>`);
    }
  }

  writePromptLine(cmd) {
    const div = document.createElement("div");
    div.className = "term-history-line";
    div.innerHTML = `<span class="term-prompt">engineer@workstation:~$</span> <span class="term-user-cmd">${this.escapeHTML(cmd)}</span>`;
    this.outputEl.appendChild(div);
    this.scrollToBottom();
  }

  writeOutput(html) {
    const div = document.createElement("div");
    div.className = "term-response";
    div.innerHTML = html;
    this.outputEl.appendChild(div);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  clear() {
    this.outputEl.innerHTML = "";
  }

  escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  printWelcome() {
    this.writeOutput(`
      <div class="term-welcome">
        <pre class="term-banner">
  _   _      _                      _     _               
 | \\ | | ___| |___      _____  _ __| | __(_)_ __   __ _   
 |  \\| |/ _ \\ __\\ \\ /\\ / / _ \\| '__| |/ /| | '_ \\ / _\` |  
 | |\\  |  __/ |_ \\ V  V / (_) | |  |   < | | | | | (_| |  
 |_| \\_|\\___|\\__| \\_/\\_/ \\___/|_|  |_|\\_\\|_|_| |_|\\__, |  
                                                   |___/   
  Level 0 to 1: Interactive Network Engineering Sandbox
        </pre>
        <p>Type <code class="term-highlight">help</code> to list tools, or <code class="term-highlight">challenge 1</code> to start a mission.</p>
        <p class="term-dim">Sample commands: <code>ping 127.0.0.1</code> | <code>ip a</code> | <code>vlan</code> | <code>nmap 192.168.1.50</code> | <code>curl http://10.0.0.50</code></p>
      </div>
    `);
  }

  execute(rawCmd) {
    this.writePromptLine(rawCmd);
    const parts = rawCmd.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case "help":
        this.cmdHelp();
        break;
      case "clear":
        this.clear();
        break;
      case "ping":
        this.cmdPing(args);
        break;
      case "traceroute":
      case "tracepath":
        this.cmdTraceroute(args);
        break;
      case "nslookup":
      case "dig":
        this.cmdDNS(cmd, args);
        break;
      case "curl":
        this.cmdCurl(args);
        break;
      case "ip":
        this.cmdIP(args);
        break;
      case "ifconfig":
        this.cmdIfconfig();
        break;
      case "arp":
        this.cmdArp(args);
        break;
      case "netstat":
      case "ss":
        this.cmdNetstat(args);
        break;
      case "vlan":
        this.cmdVlan(args);
        break;
      case "nmap":
        this.cmdNmap(args);
        break;
      case "tcpdump":
        this.cmdTcpdump(args);
        break;
      case "dhcp":
      case "dhclient":
        this.cmdDHCP(args);
        break;
      case "challenge":
      case "mission":
        this.cmdChallenge(args);
        break;
      case "hint":
        this.cmdHint();
        break;
      case "check":
        this.cmdCheck(args);
        break;
      case "cat":
        this.cmdCat(args);
        break;
      default:
        this.writeOutput(`<span class="term-error">bash: ${this.escapeHTML(cmd)}: command not found. Type 'help' for available tools.</span>`);
    }
  }

  cmdHelp() {
    this.writeOutput(`
      <div class="term-help-grid">
        <div><strong>Diagnostic Tools:</strong></div>
        <div><code>ping &lt;host&gt;</code> — Send ICMP echo requests to measure latency & loss</div>
        <div><code>traceroute &lt;host&gt;</code> — Trace intermediate router hops</div>
        <div><code>curl [-i|-v] &lt;url&gt;</code> — Send HTTP/HTTPS requests & inspect headers</div>
        <div><code>nslookup &lt;domain&gt;</code> / <code>dig</code> — Query DNS records</div>
        <div><code>nmap &lt;ip&gt;</code> — Port scanner to inspect open listening services</div>
        <div><code>tcpdump</code> — Sniff real-time packet headers on interface</div>

        <div style="margin-top:8px;"><strong>Configuration & L2/L3 Inspection:</strong></div>
        <div><code>ip a</code> / <code>ifconfig</code> — Display IP, MAC & subnet masks</div>
        <div><code>ip route</code> — Display kernel routing table</div>
        <div><code>arp -a</code> — View Address Resolution Protocol table</div>
        <div><code>vlan</code> — Display active VLAN database and port mappings</div>
        <div><code>netstat -tlpn</code> / <code>ss</code> — View active listening TCP sockets</div>
        <div><code>dhclient</code> — Simulate DHCP DORA IP lease acquisition</div>

        <div style="margin-top:8px;"><strong>Missions:</strong></div>
        <div><code>challenge [1-3]</code> — Start a guided diagnostic mission</div>
        <div><code>hint</code> / <code>check</code> — Hints and validator</div>
      </div>
    `);
  }

  cmdPing(args) {
    if (args.length === 0) {
      this.writeOutput(`<span class="term-error">Usage: ping &lt;destination_ip_or_domain&gt;</span>`);
      return;
    }

    const target = args[0];
    const ip = this.network.resolveDNS(target);

    if (!ip) {
      this.writeOutput(`<span class="term-error">ping: ${this.escapeHTML(target)}: Name or service not known</span>`);
      return;
    }

    const node = this.network.nodes[ip];
    let output = `PING ${target} (${ip}) 56(84) bytes of data.<br>`;
    if (node) {
      const rttNum = parseFloat(node.rtt);
      for (let seq = 1; seq <= 4; seq++) {
        const jitter = (Math.random() * 0.4 - 0.2).toFixed(2);
        const seqRtt = (rttNum + parseFloat(jitter)).toFixed(2);
        output += `64 bytes from ${ip}: icmp_seq=${seq} ttl=64 time=${seqRtt} ms<br>`;
      }
      output += `<br>--- ${target} ping statistics ---<br>`;
      output += `4 packets transmitted, 4 received, 0% packet loss, time 3004ms<br>`;
      output += `rtt min/avg/max = ${(rttNum - 0.2).toFixed(2)}/${rttNum.toFixed(2)}/${(rttNum + 0.3).toFixed(2)} ms`;
    } else {
      for (let seq = 1; seq <= 4; seq++) {
        output += `From ${this.network.client.gateway} icmp_seq=${seq} Destination Host Unreachable<br>`;
      }
      output += `<br>--- ${target} ping statistics ---<br>`;
      output += `4 packets transmitted, 0 received, +4 errors, 100% packet loss, time 3020ms`;
    }

    this.writeOutput(output);
  }

  cmdTraceroute(args) {
    if (args.length === 0) {
      this.writeOutput(`<span class="term-error">Usage: traceroute &lt;destination_ip_or_domain&gt;</span>`);
      return;
    }

    const target = args[0];
    const ip = this.network.resolveDNS(target);

    if (!ip) {
      this.writeOutput(`<span class="term-error">traceroute: unknown host ${this.escapeHTML(target)}</span>`);
      return;
    }

    const hops = this.network.routes[ip] || [
      { hop: 1, ip: "192.168.1.1", name: "gateway.local", rtt: "0.8 ms" },
      { hop: 2, ip: ip, name: target, rtt: "12.4 ms" }
    ];

    let output = `traceroute to ${target} (${ip}), 30 hops max, 60 byte packets<br>`;
    hops.forEach(h => {
      output += ` ${h.hop}  ${h.name} (${h.ip})  ${h.rtt}  ${h.rtt}  ${h.rtt}<br>`;
    });

    this.writeOutput(output);
  }

  cmdDNS(tool, args) {
    if (args.length === 0) {
      this.writeOutput(`<span class="term-error">Usage: ${tool} &lt;domain_name&gt;</span>`);
      return;
    }

    const domain = args[0];
    const rec = this.network.dnsDatabase[domain.toLowerCase()];

    if (tool === "nslookup") {
      let out = `Server:\t\t${this.network.client.dns}<br>Address:\t${this.network.client.dns}#53<br><br>`;
      if (rec) {
        out += `Non-authoritative answer:<br>Name:\t${domain}<br>Address: ${rec.a}`;
      } else {
        out += `** server can't find ${domain}: NXDOMAIN`;
      }
      this.writeOutput(out);
    } else {
      let out = `; &lt;&lt;&gt;&gt; DiG 9.18.18 &lt;&lt;&gt;&gt; ${domain}<br>`;
      out += `;; Got answer:<br>`;
      out += `;; -&gt;&gt;HEADER&lt;&lt;- opcode: QUERY, status: ${rec ? 'NOERROR' : 'NXDOMAIN'}, id: 34190<br>`;
      out += `;; flags: qr rd ra; QUERY: 1, ANSWER: ${rec ? 1 : 0}, AUTHORITY: 0, ADDITIONAL: 1<br><br>`;
      out += `;; QUESTION SECTION:<br>;${domain}.\t\t\tIN\tA<br><br>`;
      if (rec) {
        out += `;; ANSWER SECTION:<br>${domain}.\t\t${rec.ttl}\tIN\tA\t${rec.a}<br><br>`;
      }
      out += `;; Query time: 14 msec<br>;; SERVER: ${this.network.client.dns}#53(${this.network.client.dns}) (UDP)<br>;; WHEN: ${new Date().toUTCString()}`;
      this.writeOutput(out);
    }
  }

  cmdCurl(args) {
    if (args.length === 0) {
      this.writeOutput(`<span class="term-error">curl: try 'curl --help' for more information</span>`);
      return;
    }

    let isVerbose = false;
    let isHeaderOnly = false;
    let targetUrl = "";

    args.forEach(a => {
      if (a === "-v" || a === "--verbose") isVerbose = true;
      else if (a === "-i" || a === "-I" || a === "--head") isHeaderOnly = true;
      else targetUrl = a;
    });

    if (!targetUrl) {
      this.writeOutput(`<span class="term-error">curl: no URL specified</span>`);
      return;
    }

    let url = targetUrl;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    try {
      const parsed = new URL(url);
      const host = parsed.hostname;
      const port = parsed.port ? parseInt(parsed.port, 10) : (parsed.protocol === "https:" ? 443 : 80);
      const ip = this.network.resolveDNS(host);

      if (!ip) {
        this.writeOutput(`<span class="term-error">curl: (6) Could not resolve host: ${this.escapeHTML(host)}</span>`);
        return;
      }

      const node = this.network.nodes[ip];
      if (!node) {
        this.writeOutput(`<span class="term-error">curl: (7) Failed to connect to ${ip} port ${port}: Connection timed out</span>`);
        return;
      }

      const service = node.ports[port];
      if (!service) {
        this.writeOutput(`<span class="term-error">curl: (7) Failed to connect to ${ip} port ${port}: Connection refused</span>`);
        return;
      }

      let out = "";
      if (isVerbose) {
        out += `*   Trying ${ip}:${port}...<br>`;
        out += `* Connected to ${host} (${ip}) port ${port}<br>`;
        if (parsed.protocol === "https:") {
          out += `* TLS 1.3 connection established using TLS_AES_256_GCM_SHA384<br>`;
          out += `* Server certificate: ${service.tlsCert || 'CN=' + host}<br>`;
        }
        out += `&gt; GET ${parsed.pathname || '/'} HTTP/1.1<br>`;
        out += `&gt; Host: ${host}<br>`;
        out += `&gt; User-Agent: curl/8.4.0<br>`;
        out += `&gt; Accept: */*<br>&gt; <br>`;
        out += `&lt; ${service.response.replace(/\r\n/g, '<br>&lt; ')}<br>`;
      } else if (isHeaderOnly) {
        out += service.response.replace(/\r\n/g, '<br>');
      } else {
        const parts = service.response.split("\r\n\r\n");
        out += (parts[1] || service.response).replace(/\r\n/g, '<br>');
      }

      this.writeOutput(out);

    } catch (e) {
      this.writeOutput(`<span class="term-error">curl: (3) URL using bad/illegal format or missing URL</span>`);
    }
  }

  cmdIP(args) {
    if (args.length === 0 || args[0] === "a" || args[0] === "addr" || args[0] === "address") {
      const c = this.network.client;
      let out = `1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN<br>`;
      out += `    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00<br>`;
      out += `    inet 127.0.0.1/8 scope host lo<br>`;
      out += `2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc fq_codel state UP<br>`;
      out += `    link/ether ${c.mac} brd ff:ff:ff:ff:ff:ff<br>`;
      out += `    inet <strong class="term-highlight">${c.ip}/${c.cidr}</strong> brd 192.168.1.255 scope global eth0 (VLAN ${c.vlan})<br>`;
      out += `    valid_lft forever preferred_lft forever`;
      this.writeOutput(out);
    } else if (args[0] === "route" || args[0] === "r") {
      let out = `default via ${this.network.client.gateway} dev eth0 proto dhcp src ${this.network.client.ip} metric 100<br>`;
      out += `192.168.1.0/24 dev eth0 proto kernel scope link src ${this.network.client.ip} metric 100`;
      this.writeOutput(out);
    } else {
      this.writeOutput(`Usage: ip [a | addr | route]`);
    }
  }

  cmdIfconfig() {
    const c = this.network.client;
    let out = `eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500<br>`;
    out += `        inet ${c.ip}  netmask ${c.netmask}  broadcast 192.168.1.255<br>`;
    out += `        ether ${c.mac}  txqueuelen 1000  (Ethernet)<br>`;
    out += `        RX packets 2410  bytes 1850124 (1.8 MB)<br>`;
    out += `        TX packets 1582  bytes 142890 (142.8 KB)<br><br>`;
    out += `lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536<br>`;
    out += `        inet 127.0.0.1  netmask 255.0.0.0<br>`;
    out += `        loop  txqueuelen 1000  (Local Loopback)`;
    this.writeOutput(out);
  }

  cmdArp(args) {
    let out = `Address                  HWtype  HWaddress           Flags Mask            Iface<br>`;
    this.network.arpTable.forEach(row => {
      out += `${row.ip.padEnd(24)} ether   ${row.mac}   C                     ${row.iface}<br>`;
    });
    this.writeOutput(out);
  }

  cmdNetstat(args) {
    let out = `Active Internet connections (only servers)<br>`;
    out += `Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name<br>`;
    this.network.client.listeningPorts.forEach(p => {
      out += `${p.proto.padEnd(5)} 0      0      0.0.0.0:${p.localPort.toString().padEnd(14)} 0.0.0.0:*               ${p.state.padEnd(11)} 1248/${p.process}<br>`;
    });
    this.writeOutput(out);
  }

  cmdVlan(args) {
    let out = `VLAN Name                             Status    Ports<br>`;
    out += `---- -------------------------------- --------- -------------------------------<br>`;
    this.network.vlans.forEach(v => {
      out += `${v.id.toString().padEnd(4)} ${v.name.padEnd(32)} active    ${v.ports}<br>`;
    });
    this.writeOutput(out);
  }

  cmdNmap(args) {
    if (args.length === 0) {
      this.writeOutput(`Usage: nmap &lt;target_ip&gt;`);
      return;
    }
    const target = args[0];
    const ip = this.network.resolveDNS(target);
    const node = this.network.nodes[ip];

    let out = `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toUTCString()}<br>`;
    out += `Nmap scan report for ${target} (${ip})<br>`;
    if (node) {
      out += `Host is up (${node.rtt} latency).<br>`;
      out += `PORT     STATE SERVICE<br>`;
      Object.keys(node.ports).forEach(port => {
        out += `${port.padEnd(8)}/tcp open  ${node.ports[port].service}<br>`;
      });
    } else {
      out += `Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn<br>`;
      out += `Nmap done: 1 IP address (0 hosts up) scanned in 2.04 seconds`;
    }
    this.writeOutput(out);
  }

  cmdTcpdump(args) {
    let out = `tcpdump: verbose output suppressed, use -v[v]... for full protocol decode<br>`;
    out += `listening on eth0, link-type EN10MB (Ethernet), snapshot length 262144 bytes<br>`;
    out += `13:30:01.104218 IP 192.168.1.10.54218 &gt; 1.1.1.1.53: 34190+ A? api.github.com. (32)<br>`;
    out += `13:30:01.118492 IP 1.1.1.1.53 &gt; 192.168.1.10.54218: 34190 1/0/0 A 140.82.121.6 (48)<br>`;
    out += `13:30:01.120512 IP 192.168.1.10.49152 &gt; 10.0.0.50.80: Flags [S], seq 1000, win 65535<br>`;
    out += `13:30:01.145012 IP 10.0.0.50.80 &gt; 192.168.1.10.49152: Flags [S.], seq 5000, ack 1001<br>`;
    out += `4 packets captured, 4 packets received by filter, 0 packets dropped by kernel`;
    this.writeOutput(out);
  }

  cmdDHCP(args) {
    let out = `DHCPDISCOVER on eth0 to 255.255.255.255 port 67 interval 3<br>`;
    out += `DHCPOFFER of 192.168.1.10 from 192.168.1.1 (Gateway Router)<br>`;
    out += `DHCPREQUEST for 192.168.1.10 on eth0 to 255.255.255.255 port 67<br>`;
    out += `DHCPACK of 192.168.1.10 from 192.168.1.1<br>`;
    out += `bound to 192.168.1.10 -- renewal in 43200 seconds. (DHCP Lease active)`;
    this.writeOutput(out);
  }

  cmdCat(args) {
    if (args.length === 0) {
      this.writeOutput(`<span class="term-error">cat: missing file operand</span>`);
      return;
    }
    if (args[0] === "/etc/resolv.conf") {
      this.writeOutput(`# Generated by NetworkManager<br>nameserver ${this.network.client.dns}<br>search local`);
    } else if (args[0] === "/etc/hosts") {
      this.writeOutput(`127.0.0.1   localhost<br>127.0.1.1   engineer-workstation<br>192.168.1.10 dev.local`);
    } else {
      this.writeOutput(`<span class="term-error">cat: ${this.escapeHTML(args[0])}: No such file or directory</span>`);
    }
  }

  cmdChallenge(args) {
    if (args.length === 0) {
      this.writeOutput(`
        <div class="term-info">
          <strong>Available Diagnostic Challenges:</strong><br>
          • <code>challenge 1</code>: The Unreachable Web Service<br>
          • <code>challenge 2</code>: The Stale DNS Record<br>
          • <code>challenge 3</code>: The High-Latency Bottleneck<br><br>
          Type <code>challenge 1</code> to start!
        </div>
      `);
      return;
    }

    const num = parseInt(args[0], 10);
    const challenge = window.CHALLENGES.find(c => c.id === num);
    if (!challenge) {
      this.writeOutput(`<span class="term-error">Challenge #${args[0]} not found. Choose 1, 2, or 3.</span>`);
      return;
    }

    this.activeMission = challenge;
    this.writeOutput(`
      <div class="term-mission-box">
        <div class="mission-header">🎯 Active Mission: ${challenge.title} (${challenge.difficulty})</div>
        <p>${challenge.summary}</p>
        <div class="mission-steps">${challenge.instructions}</div>
        <p class="term-dim">Tip: Type <code>hint</code> if you get stuck, and <code>check</code> when ready.</p>
      </div>
    `);
  }

  cmdHint() {
    if (!this.activeMission) {
      this.writeOutput(`<span class="term-info">No active mission. Start one with: <code>challenge 1</code></span>`);
      return;
    }
    this.writeOutput(`
      <div class="term-hint-box">
        <strong>💡 Hints for ${this.activeMission.title}:</strong>
        <ul>${this.activeMission.hints.map(h => `<li>${h}</li>`).join('')}</ul>
      </div>
    `);
  }

  cmdCheck(args) {
    if (!this.activeMission) {
      this.writeOutput(`<span class="term-info">No active mission to check. Start one with: <code>challenge 1</code></span>`);
      return;
    }

    const result = this.activeMission.validate(this.executedCommands, args ? args.join(' ') : "");
    if (result.passed) {
      this.writeOutput(`<div class="term-success-box">${result.message}</div>`);
      if (window.App) window.App.markChallengeComplete(this.activeMission.id);
    } else {
      this.writeOutput(`<div class="term-warn-box">${result.message}</div>`);
    }
  }

  runSampleCommand(cmdText) {
    this.inputEl.value = cmdText;
    this.execute(cmdText);
    this.inputEl.focus();
  }

  startChallenge(num) {
    this.execute(`challenge ${num}`);
    this.inputEl.focus();
  }
}

window.TerminalApp = TerminalApp;
