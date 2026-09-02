// Diagnostic Challenge Missions & Automated Validator
window.CHALLENGES = [
  {
    id: 1,
    title: "The Unreachable Web Service",
    difficulty: "Beginner",
    summary: "A coworker reports that the internal app server at <code>192.168.1.50</code> is not answering requests on port 80. Find out why and test which port it is actually listening on!",
    instructions: `
      <ol>
        <li>Check if the host is reachable on the local network using <code>ping 192.168.1.50</code>.</li>
        <li>Notice that ping works (ICMP echoes reply), but <code>curl http://192.168.1.50</code> returns <em>Connection Refused</em> on port 80.</li>
        <li>Inspect or test alternate common ports like <code>8080</code> using <code>curl http://192.168.1.50:8080</code>.</li>
        <li>Run <code>check</code> to verify your diagnosis!</li>
      </ol>
    `,
    hints: [
      "1. Start by running: ping 192.168.1.50 to test basic L3 network connectivity.",
      "2. Connection refused on port 80 means the operating system received the packet, but no program was listening on port 80.",
      "3. Try requesting port 8080: curl http://192.168.1.50:8080"
    ],
    validate: (history) => {
      const ranCurl8080 = history.some(cmd => cmd.toLowerCase().includes("192.168.1.50:8080") || cmd.toLowerCase().includes("curl -i http://192.168.1.50:8080"));
      if (ranCurl8080) {
        return {
          passed: true,
          message: "🎉 Great diagnosis! You verified that the host is alive via ICMP ping, but the web service was bound to Port 8080 instead of standard Port 80. You retrieved the response payload successfully!"
        };
      }
      return {
        passed: false,
        message: "Almost there! Make sure you test the web service on port 8080 using: curl http://192.168.1.50:8080, then type 'check' again."
      };
    }
  },
  {
    id: 2,
    title: "The Stale DNS Record",
    difficulty: "Beginner-Intermediate",
    summary: "Requests to <code>api.cluster.local</code> are failing. Investigate the DNS lookup and compare it to the real server IP.",
    instructions: `
      <ol>
        <li>Perform a DNS lookup on the domain using <code>nslookup api.cluster.local</code> or <code>dig api.cluster.local</code>.</li>
        <li>Notice the IP address returned (<code>192.168.1.99</code>).</li>
        <li>Try to ping <code>192.168.1.99</code> to see if that machine exists.</li>
        <li>Run <code>check</code> when you have identified the issue!</li>
      </ol>
    `,
    hints: [
      "1. Run: nslookup api.cluster.local to see what IP the DNS table points to.",
      "2. Then try to ping that IP: ping 192.168.1.99.",
      "3. Notice that 192.168.1.99 drops all packets—the DNS record is pointing to an old, decommissioned IP address!"
    ],
    validate: (history) => {
      const ranDNS = history.some(cmd => cmd.includes("nslookup api.cluster.local") || cmd.includes("dig api.cluster.local"));
      const ranPing = history.some(cmd => cmd.includes("192.168.1.99"));
      if (ranDNS && ranPing) {
        return {
          passed: true,
          message: "🎉 Excellent investigative work! You traced the problem to a stale DNS record. The DNS server maps 'api.cluster.local' to 192.168.1.99, but that host is completely offline."
        };
      }
      return {
        passed: false,
        message: "Make sure you both inspect the DNS record (nslookup api.cluster.local) AND attempt to ping the returned IP (ping 192.168.1.99)."
      };
    }
  },
  {
    id: 3,
    title: "The High-Latency Bottleneck",
    difficulty: "Intermediate",
    summary: "Backups sent to remote node <code>10.0.8.2</code> take over 450ms per round-trip. Find which router along the route is introducing the delay.",
    instructions: `
      <ol>
        <li>Trace the geographical router hops to the server using <code>traceroute 10.0.8.2</code>.</li>
        <li>Look at the round-trip times (RTT) for Hop 1, Hop 2, Hop 3, and Hop 4.</li>
        <li>Identify which intermediate router IP caused the latency to spike from 3.9ms to 451.2ms.</li>
        <li>Type <code>check 10.0.8.1</code> (or run <code>check</code> after traceroute) to complete the mission!</li>
      </ol>
    `,
    hints: [
      "1. Run: traceroute 10.0.8.2",
      "2. Compare the RTT jump between Hop 2 (core-switch-01.dc) and Hop 3 (congested-vpn-bridge.internal).",
      "3. Hop 3 at IP 10.0.8.1 is the congested bottleneck!"
    ],
    validate: (history, arg) => {
      const ranTrace = history.some(cmd => cmd.includes("traceroute 10.0.8.2"));
      if (ranTrace || (arg && arg.includes("10.0.8.1"))) {
        return {
          passed: true,
          message: "🎉 Spot on! Router hop #3 (10.0.8.1: congested-vpn-bridge.internal) introduced a massive 450ms latency spike due to link saturation. Traceroute pinpointed the exact offending link!"
        };
      }
      return {
        passed: false,
        message: "Run 'traceroute 10.0.8.2' to inspect each router hop along the path."
      };
    }
  }
];
