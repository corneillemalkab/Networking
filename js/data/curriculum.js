// Comprehensive Curriculum Data: From Level 0 Ground Zero to Advanced Fundamentals
window.CURRICULUM = [
  {
    id: "module-0",
    title: "0. Ground Zero: What is a Computer Network?",
    shortTitle: "Level 0: Foundations",
    icon: "🌱",
    tagline: "How computers represent, transmit, and receive digital signals across physical media.",
    sections: [
      {
        heading: "What is a Signal? From Electricity to Binary",
        content: `
          <p>Every digital computer operates using <strong>binary numbers</strong>: <code>0</code> and <code>1</code>. Inside a computer, these are stored as voltage levels in transistors on a silicon microchip.</p>
          <p>A <strong>computer network</strong> is simply a mechanism to transmit those voltage states from one machine to another across a distance:</p>
          
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>1. Copper Cables (Ethernet Cat5e/Cat6)</h4>
              <p>Transmits data as <strong>rapid electrical voltage fluctuations</strong> (+2V and -2V). Highly reliable over short distances (up to 100 meters).</p>
            </div>
            <div class="tech-card">
              <h4>2. Fiber-Optic Cables</h4>
              <p>Transmits data as <strong>flashes of light (photons)</strong> through ultra-pure glass strands. Capable of gigabits/terabits across thousands of miles with near-zero signal degradation.</p>
            </div>
          </div>
        `,
        callout: {
          type: "tip",
          title: "Ground Rule: No Magic",
          text: "There is no magic in networking. A network is just a physical medium carrying electromagnetic pulses, interpreted by a network chip as binary 1s and 0s, and reassembled by your operating system kernel into memory buffers."
        }
      },
      {
        heading: "Key Concepts: Sockets, Localhost & Network Interfaces",
        content: `
          <p>Before exploring multi-computer networks, let's understand how a single computer talks to itself:</p>
          <ul>
            <li><strong>Network Interface Card (NIC):</strong> The physical hardware chip (Ethernet port or Wi-Fi radio) responsible for converting RAM data into wire signals.</li>
            <li><strong>Loopback Interface (<code>lo</code> / <code>127.0.0.1</code> / <code>localhost</code>):</strong> A virtual software interface inside the operating system. When a program sends data to <code>127.0.0.1</code>, the kernel routes the data directly back to local memory without ever touching a physical wire!</li>
            <li><strong>Client Process vs Server Process:</strong> A <em>Client</em> is a program that initiates a network request (e.g., your web browser). A <em>Server</em> is a program that opens a listening socket and waits for incoming requests (e.g., Nginx, Node.js, PostgreSQL).</li>
          </ul>
        `
      },
      {
        heading: "Hands-On Lab: Ping Your Own Computer (Loopback)",
        content: `
          <p>Run a ping to your computer's local loopback virtual interface to verify your local network stack is functioning:</p>
          <div class="code-preview">
            <code>ping 127.0.0.1</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('ping 127.0.0.1')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "ping 127.0.0.1"
      },
      {
        heading: "Knowledge Check: Level 0",
        quiz: {
          question: "What happens when a software process on your computer sends data to IP address 127.0.0.1?",
          options: [
            { text: "The OS kernel intercepts the packet in memory and routes it directly back to the local destination socket without transmitting onto physical wires.", correct: true, feedback: "✅ Correct! 127.0.0.1 is the loopback interface, processed entirely inside kernel RAM." },
            { text: "The packet is broadcasted to your Wi-Fi router and reflected back.", correct: false, feedback: "❌ Incorrect. Loopback packets never touch the physical Wi-Fi or Ethernet card." },
            { text: "The operating system drops the packet as invalid.", correct: false, feedback: "❌ Incorrect. 127.0.0.1 is a fundamental standard defined in RFC 1122." }
          ]
        }
      }
    ]
  },
  {
    id: "module-1",
    title: "1. The OSI 7-Layer vs TCP/IP Model",
    shortTitle: "OSI & TCP/IP Models",
    icon: "🥞",
    tagline: "Why networks use layered abstraction, exact data units, and header encapsulation.",
    sections: [
      {
        heading: "Why Do Layered Models Exist?",
        content: `
          <p>Writing network software would be impossible if every web developer had to write code for copper cable voltage modulation or Wi-Fi radio frequencies. To solve this, networking is split into independent <strong>layers of abstraction</strong>.</p>
          <p>Each layer has only <strong>one job</strong> and provides a clean interface to the layer above it.</p>
          
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>The Theoretical OSI 7-Layer Model</h4>
              <p>Created by the International Organization for Standardization (ISO) as an architectural reference standard:</p>
              <ol style="margin-left: 20px; font-size: 0.85rem;">
                <li>7. Application (User interaction)</li>
                <li>6. Presentation (Data formatting/encryption)</li>
                <li>5. Session (Connection dialogue)</li>
                <li>4. Transport (End-to-end reliability)</li>
                <li>3. Network (Global logical routing)</li>
                <li>2. Data Link (Adjacent link framing)</li>
                <li>1. Physical (Raw bits on wire)</li>
              </ol>
            </div>
            <div class="tech-card">
              <h4>The Real-World TCP/IP 4/5-Layer Model</h4>
              <p>The pragmatic architecture used by the actual Internet and all operating system kernels:</p>
              <ol style="margin-left: 20px; font-size: 0.85rem;">
                <li>Application (L7: HTTP, DNS, SSH)</li>
                <li>Transport (L4: TCP, UDP)</li>
                <li>Internet / Network (L3: IPv4, IPv6, ICMP)</li>
                <li>Data Link (L2: Ethernet, Wi-Fi frames)</li>
                <li>Physical (L1: Signals, fiber, radio)</li>
              </ol>
            </div>
          </div>
        `
      },
      {
        heading: "Protocol Data Units (PDU): The Exact Technical Names",
        content: `
          <p>In software engineering discussions, never call everything a "packet". Each layer gives data a precise technical name:</p>
          <ul>
            <li><strong>L4 Transport Layer:</strong> <code>Segment</code> (for TCP) or <code>Datagram</code> (for UDP)</li>
            <li><strong>L3 Network Layer:</strong> <code>Packet</code> (IPv4 / IPv6)</li>
            <li><strong>L2 Data Link Layer:</strong> <code>Frame</code> (Ethernet / Wi-Fi)</li>
            <li><strong>L1 Physical Layer:</strong> <code>Bits / Symbols</code></li>
          </ul>
        `
      },
      {
        heading: "Interactive Visualizer: The 5-Layer Encapsulation Dissector",
        content: `
          <p>Click through each layer below to inspect the exact byte fields added at each stage of transmission:</p>
        `,
        visualizer: "layerStack"
      },
      {
        heading: "Interactive Visualizer: Packet Slicing & Hop Simulator",
        content: `
          <p>Watch data turn into packets, wrap in headers, and traverse the network hop-by-hop:</p>
        `,
        visualizer: "packetJourney"
      },
      {
        heading: "Knowledge Check: Layer Architecture",
        quiz: {
          question: "When data moves down from the Transport Layer to the Network Layer during transmission, what is this process called?",
          options: [
            { text: "Encapsulation (wrapping the transport segment inside an IP packet header).", correct: true, feedback: "✅ Correct! Encapsulation wraps higher-layer data with new header metadata as it moves down the stack." },
            { text: "Decapsulation.", correct: false, feedback: "❌ Incorrect. Decapsulation occurs on the receiving computer as data moves up the stack." },
            { text: "Compilation.", correct: false, feedback: "❌ Incorrect. Compilation refers to transforming source code into machine code." }
          ]
        }
      }
    ]
  },
  {
    id: "module-2",
    title: "2. IPv4, CIDR & Subnetting In-Depth",
    shortTitle: "IPv4 & Subnetting",
    icon: "🔢",
    tagline: "Binary AND arithmetic, network prefix vs host ID, CIDR notation, and private IP ranges.",
    sections: [
      {
        heading: "The 32-Bit Binary Structure of IPv4",
        content: `
          <p>An IPv4 address is not really four numbers—it is a <strong>32-bit unsigned integer</strong> in memory. We write it in "dotted-decimal" notation (like <code>192.168.1.50</code>) purely for human convenience:</p>
          <pre class="code-snippet"><code>Dotted Decimal: 192 .     168 .     1 .       50
Binary (32-bit): 11000000.10101000.00000001.00110010</code></pre>
          <p>Every IP address contains two pieces of information encoded inside those 32 bits:</p>
          <ol>
            <li><strong>Network Prefix:</strong> Identifies which subnet group the computer belongs to.</li>
            <li><strong>Host Identifier:</strong> Identifies the specific individual machine within that subnet.</li>
          </ol>
        `
      },
      {
        heading: "How Binary Subnet Masking Works (Bitwise AND)",
        content: `
          <p>How does the operating system know if another IP is on the same local switch or requires a gateway router? It performs a bitwise <strong>AND</strong> operation with its Subnet Mask:</p>
          <pre class="code-snippet"><code>IP Address:   192.168.1.50   ➔  11000000.10101000.00000001.00110010
Subnet Mask:  255.255.255.0  ➔  11111111.11111111.11111111.00000000
---------------------------------------------------------------------
Network ID:   192.168.1.0    ➔  11000000.10101000.00000001.00000000 (Bitwise AND)</code></pre>
        `
      },
      {
        heading: "Private IP Ranges (RFC 1918) & NAT",
        content: `
          <p>Because IPv4 only has ~4.29 billion total addresses, the Internet Engineering Task Force (IETF) reserved three ranges for private, internal networks:</p>
          <ul>
            <li><code>10.0.0.0/8</code> (10.0.0.0 to 10.255.255.255) — 16,777,216 addresses (used in large enterprise & cloud data centers).</li>
            <li><code>172.16.0.0/12</code> (172.16.0.0 to 172.31.255.255) — 1,048,576 addresses (often used in container networks like Docker/Kubernetes).</li>
            <li><code>192.168.0.0/16</code> (192.168.0.0 to 192.168.255.255) — 65,536 addresses (standard home & office LANs).</li>
          </ul>
          <p>Private addresses cannot route across the public Internet. Your router uses <strong>NAT (Network Address Translation)</strong> to rewrite private IP packets to its single public IP address when accessing the web.</p>
        `
      },
      {
        heading: "Interactive Visualizer: Subnet & Bit-Level Explorer",
        content: `
          <p>Move the CIDR slider from <code>/8</code> to <code>/30</code> to see how bits split and test subnet reachability:</p>
        `,
        visualizer: "subnetVisualizer"
      },
      {
        heading: "Knowledge Check: Subnetting",
        quiz: {
          question: "On a subnet with prefix 192.168.10.0/24, how many usable machine IP addresses are available?",
          options: [
            { text: "254 usable host addresses (256 total minus Network ID 192.168.10.0 and Broadcast ID 192.168.10.255).", correct: true, feedback: "✅ Correct! 2^(32-24) = 256. Subtracting the network address and broadcast address leaves 254 usable IPs." },
            { text: "256 usable host addresses.", correct: false, feedback: "❌ Incorrect. The first address (.0) is the network ID and the last address (.255) is reserved for broadcast." },
            { text: "128 usable host addresses.", correct: false, feedback: "❌ Incorrect. 128 hosts corresponds to a /25 subnet." }
          ]
        }
      }
    ]
  },
  {
    id: "module-3",
    title: "3. VLANs & 802.1Q Trunking",
    shortTitle: "VLANs & 802.1Q",
    icon: "🏷️",
    tagline: "Broadcast domain isolation, access vs trunk switch ports, and 802.1Q frame tagging.",
    sections: [
      {
        heading: "The Problem: Broadcast Storms on Flat Networks",
        content: `
          <p>When a switch receives a broadcast frame (like an ARP query for an unknown IP), it must flood that frame out of <strong>every single connected port</strong>.</p>
          <p>In a company or data center with 500 computers on one switch, thousands of daily broadcast frames waste CPU cycles on every single machine. Furthermore, any computer on the switch could sniff or intercept unencrypted traffic from any other department.</p>
          <p><strong>VLANs (Virtual Local Area Networks)</strong> solve this by partitioning a single physical switch into multiple isolated logical switches in software!</p>
        `
      },
      {
        heading: "Access Ports vs Trunk Ports (802.1Q Tagging)",
        content: `
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>1. Access Ports (Single VLAN)</h4>
              <p>Connected directly to end-user computers (PCs, servers, printers). The packets traveling on access ports are <strong>standard, untagged Ethernet frames</strong>. The end-user device has no idea VLANs even exist!</p>
            </div>
            <div class="tech-card">
              <h4>2. Trunk Ports (Multiple VLANs)</h4>
              <p>Carries traffic for multiple VLANs across a single cable between switches or routers. The switch inserts a <strong>4-byte IEEE 802.1Q Tag</strong> into the Ethernet header containing the <strong>VLAN ID (VID)</strong>.</p>
            </div>
          </div>
        `
      },
      {
        heading: "Interactive Visualizer: VLAN Isolation & 802.1Q Trunking",
        content: `
          <p>Send broadcast and unicast packets between Engineering (VLAN 10) and Finance (VLAN 20) to see how switches isolate broadcasts and tag trunk links:</p>
        `,
        visualizer: "vlanVisualizer"
      },
      {
        heading: "Knowledge Check: VLANs",
        quiz: {
          question: "When a computer on VLAN 10 transmits a broadcast ARP frame, which other devices receive it?",
          options: [
            { text: "Only other computers configured on VLAN 10.", correct: true, feedback: "✅ Exactly! A VLAN defines a logical broadcast domain. Broadcast frames never leak into other VLANs." },
            { text: "All computers connected to the physical switch regardless of VLAN.", correct: false, feedback: "❌ Incorrect. That would defeat the entire purpose of VLAN broadcast isolation." },
            { text: "Only the default gateway router.", correct: false, feedback: "❌ Incorrect. All hosts on the same VLAN receive the broadcast." }
          ]
        }
      }
    ]
  },
  {
    id: "module-4",
    title: "4. Layer 2 Switching, ARP & MAC Tables",
    shortTitle: "L2 Switching & ARP",
    icon: "🔀",
    tagline: "How switches learn MAC addresses and how the Address Resolution Protocol bridges L3 to L2.",
    sections: [
      {
        heading: "How Switches Learn: The MAC Address Table",
        content: `
          <p>Unlike old network hubs that blindly repeated electrical signals on all ports, a modern <strong>Layer 2 Switch</strong> is an intelligent packet forwarder with internal memory.</p>
          <p>When a frame arrives on Port 1 from Source MAC <code>02:42:AC:11:00:02</code>, the switch records in its memory: <em>"MAC 02:42:AC:11:00:02 lives on Port 1."</em></p>
          <p>The next time any machine sends data to that MAC, the switch forwards the frame <strong>only out Port 1</strong> at full wire speed!</p>
        `
      },
      {
        heading: "ARP: Mapping IP Coordinates to Physical Silicon MACs",
        content: `
          <p>When your computer wants to send an IP packet to <code>192.168.1.50</code>, it doesn't know what MAC address to stamp in the Ethernet header. It uses <strong>ARP (Address Resolution Protocol)</strong>:</p>
          <ol>
            <li><strong>ARP Request (Broadcast):</strong> Computer A asks the network: <em>"Who has IP 192.168.1.50? Tell 192.168.1.10."</em> (Sent to broadcast MAC <code>ff:ff:ff:ff:ff:ff</code>).</li>
            <li><strong>ARP Reply (Unicast):</strong> Host 192.168.1.50 responds: <em>"I have 192.168.1.50! My MAC is 02:42:AC:11:00:50."</em></li>
            <li><strong>ARP Cache:</strong> Computer A saves this mapping in RAM so it doesn't need to ask again.</li>
          </ol>
        `
      },
      {
        heading: "Hands-On Lab: Inspecting Your ARP Table",
        content: `
          <p>View your simulated machine's active ARP cache table:</p>
          <div class="code-preview">
            <code>arp -a</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('arp -a')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "arp -a"
      }
    ]
  },
  {
    id: "module-5",
    title: "5. DNS — The Distributed Hierarchical Database",
    shortTitle: "DNS Lookup System",
    icon: "🔍",
    tagline: "Recursive query delegation, caching, TTLs, and DNS record types.",
    sections: [
      {
        heading: "The Internet's Hierarchical Key-Value Map",
        content: `
          <p>DNS translates human-readable domain strings (<code>api.github.com</code>) into 32-bit IPv4 or 128-bit IPv6 addresses.</p>
          <p>Common DNS Record Types:</p>
          <ul>
            <li><strong>A Record:</strong> Maps a domain to an IPv4 address (e.g. <code>140.82.121.6</code>).</li>
            <li><strong>AAAA Record:</strong> Maps a domain to an IPv6 address.</li>
            <li><strong>CNAME (Canonical Name):</strong> Creates an alias pointing one domain name to another domain name.</li>
            <li><strong>MX (Mail Exchange):</strong> Directs emails to the organization's mail servers.</li>
            <li><strong>TXT:</strong> Stores arbitrary text (used for SPF, DKIM, and domain ownership verification).</li>
          </ul>
        `
      },
      {
        heading: "Interactive Visualizer: Hierarchical DNS Resolver",
        content: `
          <p>Step through the multi-tier resolution chain from Local Cache to Root, TLD, and Authoritative Name Server:</p>
        `,
        visualizer: "dnsVisualizer"
      },
      {
        heading: "Hands-On Lab: Querying DNS Records",
        content: `
          <div class="code-preview">
            <code>nslookup api.github.com</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('nslookup api.github.com')">Run in Terminal ↵</button>
          </div>
          <div class="code-preview">
            <code>dig api.github.com A</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('dig api.github.com A')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "nslookup api.github.com"
      }
    ]
  },
  {
    id: "module-6",
    title: "6. TCP vs UDP Deep Dive (Reliability, Flow Control & Sockets)",
    shortTitle: "TCP & UDP Protocols",
    icon: "🤝",
    tagline: "3-way handshake, sequence numbers, sliding window flow control, and packet drops.",
    sections: [
      {
        heading: "The Technical Mechanics of TCP Reliability",
        content: `
          <p>TCP turns an unreliable, lossy packet network into a reliable, ordered byte stream using three primary mechanisms:</p>
          <ul>
            <li><strong>Sequence Numbers:</strong> Every single byte of application data is numbered. Out-of-order packets are reassembled into the exact original sequence in memory.</li>
            <li><strong>Acknowledgments (ACK) & RTO Timers:</strong> The receiver sends ACKs for received byte ranges. If the sender doesn't receive an ACK before its Retransmission Timeout (RTO) timer expires, it re-transmits the missing segment automatically.</li>
            <li><strong>Flow Control (Window Size):</strong> The receiver tells the sender how many free bytes remain in its RAM buffer via the <code>Window</code> header field, preventing the sender from overwhelming the receiver.</li>
          </ul>
        `
      },
      {
        heading: "Interactive Visualizer: TCP 3-Way Handshake & Packet Drop Simulation",
        content: `
          <p>Step through the 3-Way Handshake or simulate a dropped packet to see automatic retransmission:</p>
        `,
        visualizer: "tcpHandshake"
      },
      {
        heading: "Hands-On Lab: Socket Inspection with Netstat",
        content: `
          <p>Inspect active TCP listening sockets and open ports:</p>
          <div class="code-preview">
            <code>netstat -tlpn</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('netstat -tlpn')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "netstat -tlpn"
      }
    ]
  },
  {
    id: "module-7",
    title: "7. Application Endpoints & The Web Stack (HTTP, Ports, TLS)",
    shortTitle: "HTTP, Ports & TLS",
    icon: "🌐",
    tagline: "Port multiplexing, plain-text HTTP formatting, and cryptographic TLS encryption.",
    sections: [
      {
        heading: "Port Multiplexing & Process Binding",
        content: `
          <p>A single computer has only one IP address, but runs dozens of programs. Port numbers (16-bit integers from 0 to 65535) direct packets to the exact listening socket process.</p>
        `
      },
      {
        heading: "Interactive Visualizer: Multi-Node Topology & Process Inspector",
        content: `
          <p>Click any device to inspect its active open sockets, routing tables, and interfaces:</p>
        `,
        visualizer: "topologyVisualizer"
      },
      {
        heading: "Hands-On Lab: Sending Raw HTTP Requests with Curl",
        content: `
          <div class="code-preview">
            <code>curl -i http://10.0.0.50</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('curl -i http://10.0.0.50')">Run in Terminal ↵</button>
          </div>
          <div class="code-preview">
            <code>curl -v https://10.0.0.50</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('curl -v https://10.0.0.50')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "curl -i http://10.0.0.50"
      }
    ]
  },
  {
    id: "module-8",
    title: "8. Interactive Diagnostic Missions",
    shortTitle: "Diagnostic Missions",
    icon: "🧪",
    tagline: "Solve hands-on network outages and debug simulated connectivity issues using real tools.",
    sections: [
      {
        heading: "Put Your Skills into Practice",
        content: `
          <p>Choose any diagnostic mission below to troubleshoot simulated outages in the terminal:</p>
          <div class="missions-list">
            <div class="mission-card-item" onclick="TerminalApp.startChallenge(1)">
              <div class="mission-badge">Mission 1</div>
              <div class="mission-info">
                <strong>The Unreachable Web Service</strong>
                <p>A web server at <code>192.168.1.50</code> isn't answering requests on port 80. Diagnose if it's an IP misconfiguration, port mismatch, or firewall drop.</p>
              </div>
              <button class="btn-mission">Start Mission ↵</button>
            </div>

            <div class="mission-card-item" onclick="TerminalApp.startChallenge(2)">
              <div class="mission-badge">Mission 2</div>
              <div class="mission-info">
                <strong>The Stale DNS Record</strong>
                <p>Requests to <code>api.cluster.local</code> fail with <code>404 Not Found</code>. Check the DNS mapping vs the actual server IP address.</p>
              </div>
              <button class="btn-mission">Start Mission ↵</button>
            </div>

            <div class="mission-card-item" onclick="TerminalApp.startChallenge(3)">
              <div class="mission-badge">Mission 3</div>
              <div class="mission-info">
                <strong>The High-Latency Bottleneck</strong>
                <p>Packets to the remote backup node <code>10.0.8.2</code> take 450ms. Trace the hops to pinpoint which router is congested.</p>
              </div>
              <button class="btn-mission">Start Mission ↵</button>
            </div>
          </div>
        `
      }
    ]
  }
];
