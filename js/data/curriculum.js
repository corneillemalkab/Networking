// Comprehensive Engineering Curriculum: Level 0 Ground Zero to Advanced Fundamentals
window.CURRICULUM = [
  {
    id: "module-0",
    title: "0. Ground Zero: Signals, Hardware & Sockets",
    shortTitle: "0. Signals & Hardware",
    icon: "🌱",
    tagline: "How physical signals become binary bytes, and how kernel sockets connect software programs.",
    sections: [
      {
        heading: "From Physical Physics to Binary Memory",
        content: `
          <p>Every digital computer stores information as binary bits (<code>0</code> and <code>1</code>) in RAM transistors. A computer network is simply the physical technology used to move those exact bits between two separate computers:</p>
          
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>1. Copper Twisted Pair (Ethernet Cat6)</h4>
              <p>Encodes bits as <strong>rapid voltage transitions</strong> (+2V / -2V) across 8 twisted copper wires. Subject to electrical resistance and interference (attenuation), limiting runs to 100 meters.</p>
            </div>
            <div class="tech-card">
              <h4>2. Fiber-Optic Cables</h4>
              <p>Encodes bits as <strong>laser light flashes (photons)</strong> through glass cores. Capable of 100+ Gigabits per second across thousands of kilometers with zero electromagnetic interference.</p>
            </div>
          </div>
        `,
        callout: {
          type: "tip",
          title: "Technical Building Block",
          text: "At the physical wire level, concepts like 'web pages', 'JSON', or 'images' do not exist—only physical symbol transitions (baud rate) timed by a hardware crystal clock."
        }
      },
      {
        heading: "Bandwidth, Throughput, Latency & Jitter",
        content: `
          <p>Four foundational metrics define every network connection:</p>
          <ul>
            <li><strong>Bandwidth:</strong> The maximum theoretical capacity of the physical link (e.g., 1 Gigabit per second = 1,000,000,000 bits/sec).</li>
            <li><strong>Throughput:</strong> The actual rate of successfully delivered application data payload after subtracting header overhead and retransmissions.</li>
            <li><strong>Latency (RTT):</strong> Round-Trip Time—the time in milliseconds for a packet to travel from sender to destination and back.</li>
            <li><strong>Jitter:</strong> The variance in packet arrival delay (critical for real-time video, audio, and VoIP).</li>
          </ul>
        `
      },
      {
        heading: "Half-Duplex vs Full-Duplex & Collision Domains",
        content: `
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>Half-Duplex (Legacy Hubs & Wi-Fi)</h4>
              <p>Devices can transmit OR receive, but <strong>never both at the same time</strong>. If two devices transmit simultaneously, their electrical signals collide on the shared wire (Collision Domain), requiring CSMA/CD backoff algorithms.</p>
            </div>
            <div class="tech-card">
              <h4>Full-Duplex (Modern Switches)</h4>
              <p>Uses separate dedicated wire pairs for transmitting (TX) and receiving (RX). Devices send and receive simultaneously at full speed with <strong>zero collisions</strong>.</p>
            </div>
          </div>
        `
      },
      {
        heading: "Kernel Sockets & The Loopback Interface (127.0.0.1)",
        content: `
          <p>How does a program in software talk to the network? Through an operating system <strong>Socket</strong>—a file-descriptor-like handle representing an open communication channel.</p>
          <p>The <strong>Loopback Interface (<code>lo</code> / <code>127.0.0.1</code>)</strong> is a virtual software interface. When a program sends packets to <code>127.0.0.1</code>, the OS kernel redirects the byte buffers directly in RAM memory without ever sending electrical signals to the physical network card.</p>
        `
      },
      {
        heading: "Hands-On Lab: Test Your Local Loopback Stack",
        content: `
          <p>Verify that your simulated kernel network stack is active:</p>
          <div class="code-preview">
            <code>ping 127.0.0.1</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('ping 127.0.0.1')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "ping 127.0.0.1"
      },
      {
        heading: "Knowledge Check: Ground Zero",
        quiz: {
          question: "Why do modern full-duplex Ethernet switches eliminate packet collisions completely?",
          options: [
            { text: "Because they use separate dedicated physical wire pairs/channels for transmitting (TX) and receiving (RX) for each connected device.", correct: true, feedback: "✅ Correct! Full-duplex provides dedicated TX and RX paths, so outbound and inbound data never collide on the wire." },
            { text: "Because switches compress all data into a single byte.", correct: false, feedback: "❌ Incorrect. Switches buffer and forward frames based on MAC addresses, not single-byte compression." },
            { text: "Because collision domains can only exist over satellite links.", correct: false, feedback: "❌ Incorrect. Collision domains existed on legacy shared-bus coaxial cables and hubs." }
          ]
        }
      }
    ]
  },
  {
    id: "module-1",
    title: "1. The OSI 7-Layer vs TCP/IP Model & Encapsulation",
    shortTitle: "1. OSI vs TCP/IP Model",
    icon: "🥞",
    tagline: "Why layered abstraction exists, Protocol Data Units (PDUs), and packet encapsulation mechanics.",
    sections: [
      {
        heading: "The Purpose of Layered Architecture",
        content: `
          <p>Writing network applications would be unmanageable if every software engineer had to write low-level code for copper voltages or fiber timing. Network engineering uses <strong>layered abstraction</strong>: each layer provides a standardized service to the layer above it and hides the messy hardware details below.</p>
          
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>OSI 7-Layer Model (Conceptual Standard)</h4>
              <p>Designed by ISO in 1984 as a complete theoretical taxonomy:</p>
              <ul style="font-size:0.82rem; margin-left:18px;">
                <li><strong>7. Application:</strong> User-facing protocols (HTTP, SSH)</li>
                <li><strong>6. Presentation:</strong> Data serialization, encryption, ASCII/UTF-8</li>
                <li><strong>5. Session:</strong> Manages dialogues and tokens between apps</li>
                <li><strong>4. Transport:</strong> End-to-end byte streams and ports (TCP, UDP)</li>
                <li><strong>3. Network:</strong> Global logical routing (IPv4, IPv6)</li>
                <li><strong>2. Data Link:</strong> Adjacent hop framing and MACs (Ethernet)</li>
                <li><strong>1. Physical:</strong> Voltages, optical pulses, radio RF</li>
              </ul>
            </div>
            <div class="tech-card">
              <h4>TCP/IP 4/5-Layer Model (Real-World Internet)</h4>
              <p>The actual practical model implemented in Linux, Windows, macOS, and routers:</p>
              <ul style="font-size:0.82rem; margin-left:18px;">
                <li><strong>Application Layer:</strong> (Combines OSI L5, L6, L7) — HTTP, DNS, TLS</li>
                <li><strong>Transport Layer (L4):</strong> TCP, UDP, QUIC</li>
                <li><strong>Internet Layer (L3):</strong> IPv4, IPv6, ICMP, ARP</li>
                <li><strong>Data Link Layer (L2):</strong> Ethernet II, Wi-Fi 802.11</li>
                <li><strong>Physical Layer (L1):</strong> Cat6 copper, Single-mode fiber</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        heading: "Protocol Data Units (PDUs) — The Exact Technical Terminology",
        content: `
          <p>In professional systems engineering, calling every piece of data a 'packet' is ambiguous. Each layer defines its own <strong>Protocol Data Unit (PDU)</strong>:</p>
          <ul>
            <li><strong>L4 Transport Layer:</strong> <code>Segment</code> (for TCP) or <code>Datagram</code> (for UDP)</li>
            <li><strong>L3 Network Layer:</strong> <code>Packet</code> (IPv4 / IPv6)</li>
            <li><strong>L2 Data Link Layer:</strong> <code>Frame</code> (Ethernet II, Wi-Fi)</li>
            <li><strong>L1 Physical Layer:</strong> <code>Bits / Symbols</code></li>
          </ul>
        `
      },
      {
        heading: "Interactive Visualizer: 5-Layer Stack Header Dissector",
        content: `
          <p>Click each layer below to dissect the exact byte fields added at each step of transmission:</p>
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
        heading: "Knowledge Check: Encapsulation",
        quiz: {
          question: "When a web server transmits an HTML response, what is the exact order of encapsulation headers added before the bits hit the copper wire?",
          options: [
            { text: "Application Payload ➔ TCP Header (L4) ➔ IP Header (L3) ➔ Ethernet Frame Header & FCS Trailer (L2) ➔ Physical Bits (L1)", correct: true, feedback: "✅ Correct! Encapsulation wraps headers from the top (L7) down to the bottom (L2/L1) before transmission." },
            { text: "Ethernet Header ➔ IP Header ➔ TCP Header ➔ Application Payload", correct: false, feedback: "❌ Incorrect. That is the physical layout on the wire, but encapsulation adds headers from L7 downwards." },
            { text: "IP Header ➔ TCP Header ➔ Ethernet Header ➔ Payload", correct: false, feedback: "❌ Incorrect. The transport header is attached directly to the application payload first." }
          ]
        }
      }
    ]
  },
  {
    id: "module-2",
    title: "2. IPv4, CIDR, Subnetting & NAT In-Depth",
    shortTitle: "2. IPv4, Subnetting & NAT",
    icon: "🔢",
    tagline: "Binary AND arithmetic, network prefix vs host ID, CIDR notation, private RFC 1918 ranges, and NAT.",
    sections: [
      {
        heading: "The 32-Bit Binary Structure of IPv4",
        content: `
          <p>An IPv4 address is an unsigned <strong>32-bit integer</strong> (from <code>0.0.0.0</code> up to <code>255.255.255.255</code>). We write it in 4 octets purely for human readability:</p>
          <pre class="code-snippet"><code>Dotted Decimal: 192 .     168 .     1 .       50
Binary (32-bit): 11000000.10101000.00000001.00110010</code></pre>
          <p>Every IP address contains two distinct parts:</p>
          <ol>
            <li><strong>Network Prefix:</strong> Identifies which subnet group this machine belongs to.</li>
            <li><strong>Host ID:</strong> Identifies the specific individual machine on that local subnet.</li>
          </ol>
        `
      },
      {
        heading: "How Binary Subnet Masking Works (Bitwise AND)",
        content: `
          <p>When Computer A wants to send a packet to another IP address, its operating system kernel checks if the target is on the <strong>same local switch</strong> or requires sending to a <strong>Default Gateway Router</strong>. It calculates this using a bitwise <strong>AND</strong>:</p>
          <pre class="code-snippet"><code>IP Address:   192.168.1.50   ➔  11000000.10101000.00000001.00110010
Subnet Mask:  255.255.255.0  ➔  11111111.11111111.11111111.00000000 (/24)
---------------------------------------------------------------------
Network ID:   192.168.1.0    ➔  11000000.10101000.00000001.00000000 (Bitwise AND)</code></pre>
          <p><strong>The Rule of Usable Hosts:</strong> For any subnet with \(H\) host bits, the total number of usable host machine addresses is \(2^H - 2\):</p>
          <ul>
            <li>The <strong>First Address</strong> (all host bits 0) is the <strong>Network Address</strong> (e.g. <code>192.168.1.0</code>).</li>
            <li>The <strong>Last Address</strong> (all host bits 1) is the <strong>Broadcast Address</strong> (e.g. <code>192.168.1.255</code>).</li>
          </ul>
        `
      },
      {
        heading: "Private IP Ranges (RFC 1918) & NAT (Network Address Translation)",
        content: `
          <p>Because IPv4 only has ~4.29 billion total addresses, the IETF reserved three non-routable private ranges:</p>
          <ul>
            <li><code>10.0.0.0/8</code> (10.0.0.0 – 10.255.255.255): 16,777,216 addresses (Cloud VPCs & enterprise data centers).</li>
            <li><code>172.16.0.0/12</code> (172.16.0.0 – 172.31.255.255): 1,048,576 addresses (Docker / Kubernetes internal networks).</li>
            <li><code>192.168.0.0/16</code> (192.168.0.0 – 192.168.255.255): 65,536 addresses (Home & small office LANs).</li>
          </ul>
          <p><strong>NAT (Network Address Translation):</strong> Since private IPs cannot cross the public Internet, your home or cloud gateway router rewrites the internal private IP address and port to its own public IP address in outbound packet headers, keeping an internal translation table (NAT Table) in RAM.</p>
        `
      },
      {
        heading: "Interactive Visualizer: Subnet & Bit-Level Explorer",
        content: `
          <p>Drag the CIDR slider from <code>/8</code> to <code>/30</code> to see how bits split and test subnet reachability:</p>
        `,
        visualizer: "subnetVisualizer"
      },
      {
        heading: "Hands-On Lab: Inspecting IP Addresses & Routing Table",
        content: `
          <div class="code-preview">
            <code>ip a</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('ip a')">Run in Terminal ↵</button>
          </div>
          <div class="code-preview">
            <code>ip route</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('ip route')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "ip a"
      },
      {
        heading: "Knowledge Check: Subnetting",
        quiz: {
          question: "If a company has a /28 subnet, how many usable host IP addresses can be assigned to servers?",
          options: [
            { text: "14 usable host addresses (2^(32-28) = 16 total minus Network ID and Broadcast ID).", correct: true, feedback: "✅ Correct! 32 - 28 = 4 host bits. 2^4 = 16 total. Subtracting 2 gives 14 usable IP addresses." },
            { text: "16 usable host addresses.", correct: false, feedback: "❌ Incorrect. The network ID and broadcast address cannot be assigned to hosts." },
            { text: "28 usable host addresses.", correct: false, feedback: "❌ Incorrect. 28 is the prefix length (network bits), not the host count." }
          ]
        }
      }
    ]
  },
  {
    id: "module-3",
    title: "3. VLANs & 802.1Q Trunking",
    shortTitle: "3. VLANs & 802.1Q",
    icon: "🏷️",
    tagline: "Broadcast domain isolation, access vs trunk switch ports, and 802.1Q frame tagging.",
    sections: [
      {
        heading: "The Problem: Broadcast Storms on Flat Networks",
        content: `
          <p>When an L2 switch receives an ARP broadcast frame, it floods that frame out of <strong>every single connected port</strong>.</p>
          <p>On a large corporate network with hundreds of computers, constant broadcast traffic wastes CPU cycles on every machine and creates major security risks (anyone can listen to unencrypted traffic from other departments).</p>
          <p><strong>VLANs (Virtual Local Area Networks)</strong> solve this by partitioning a single physical switch into multiple isolated logical switches in software!</p>
        `
      },
      {
        heading: "Access Ports vs Trunk Ports & 802.1Q Tagging",
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
    shortTitle: "4. L2 Switching & ARP",
    icon: "🔀",
    tagline: "How switches learn MAC addresses, ARP requests/replies, and Spanning Tree basics.",
    sections: [
      {
        heading: "How Switches Forward Frames: The MAC Table",
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
    shortTitle: "5. DNS Lookup System",
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
    shortTitle: "6. TCP & UDP Protocols",
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
    shortTitle: "7. HTTP, Ports & TLS",
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
    shortTitle: "8. Diagnostic Missions",
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
