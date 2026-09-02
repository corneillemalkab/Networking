// Enterprise & University Grade Curriculum: Ground Zero to Deep Technical Mastery
window.CURRICULUM = [
  {
    id: "module-0",
    title: "0. Ground Zero: Physical Signals, Hardware Silicon & Kernel Sockets",
    shortTitle: "0. Signals, Silicon & Sockets",
    icon: "🌱",
    tagline: "The physics of transmission, NIC hardware architecture, DMA ring buffers, and OS socket internals.",
    sections: [
      {
        heading: "1. The Physics of Signal Transmission (Voltage, Photons & RF)",
        content: `
          <p>Every piece of data on a computer is fundamentally stored as binary voltage states inside transistors in RAM. Moving those bits across physical space requires <strong>signaling physics</strong>:</p>
          
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>1. Copper Twisted Pair (1000BASE-T / 10GBASE-T)</h4>
              <p>Encodes bits using <strong>PAM-5 (Pulse Amplitude Modulation 5-level)</strong> electrical voltages (-2V, -1V, 0V, +1V, +2V) clocked at 125 MHz across 4 twisted pairs. Twisting pairs cancels out electromagnetic crosstalk (EMI) via common-mode rejection.</p>
            </div>
            <div class="tech-card">
              <h4>2. Fiber Optics (10GBASE-LR / 100GBASE-LR4)</h4>
              <p>Encodes bits as <strong>coherent laser photon pulses</strong> at infrared wavelengths (1310nm / 1550nm). Total internal reflection inside the glass core allows signals to travel tens of kilometers at 67% the speed of light in a vacuum (\(c \approx 200,000\text{ km/s}\)).</p>
            </div>
          </div>
        `,
        callout: {
          type: "tip",
          title: "The Shannon-Hartley Theorem",
          text: "The maximum theoretical data rate \(C\) of any physical channel is strictly bounded by physics: \\(C = B \\log_2(1 + \\text{SNR})\\), where \(B\) is bandwidth in Hertz and \(\\text{SNR}\) is the Signal-to-Noise Ratio."
        }
      },
      {
        heading: "2. Bandwidth, Throughput, Latency & Jitter Arithmetic",
        content: `
          <p>Understanding these four foundational metrics is essential for diagnosing production bottlenecks:</p>
          <ul>
            <li><strong>Bandwidth (Capacity):</strong> The theoretical maximum bits that can pass through the physical medium per second (e.g. 10 Gbps = \(10 \times 10^9\) bits/sec).</li>
            <li><strong>Throughput (Goodput):</strong> The actual application payload delivered per second after subtracting L2/L3/L4 header overhead and retransmissions.</li>
            <li><strong>Latency (RTT):</strong> Round-Trip Time—the sum of:
              <br>&bull; <em>Propagation Delay:</em> Time for signals to travel down the physical cable (\(\text{distance} / \text{speed of light}\)).
              <br>&bull; <em>Transmission Delay:</em> Time to push all packet bits onto the wire (\(\text{packet size} / \text{bandwidth}\)).
              <br>&bull; <em>Queuing & Processing Delay:</em> Time spent in router/switch buffer queues.
            </li>
            <li><strong>Jitter:</strong> The statistical variance in latency between consecutive packets (critical for real-time VoIP, video conferencing, and high-frequency trading).</li>
          </ul>
        `
      },
      {
        heading: "3. Half-Duplex (CSMA/CD) vs Full-Duplex Switching",
        content: `
          <p>Legacy shared-bus networks and legacy hubs operated in <strong>Half-Duplex</strong> mode:</p>
          <ul>
            <li>Devices could either transmit OR receive, but never both simultaneously on the shared copper wire.</li>
            <li>If two devices transmitted at the same microsecond, their electrical voltages collided on the wire (<strong>Collision Domain</strong>), requiring <strong>CSMA/CD (Carrier Sense Multiple Access with Collision Detection)</strong> to stop and wait a random exponential backoff delay.</li>
          </ul>
          <p>Modern Ethernet switches operate in <strong>Full-Duplex</strong> mode with dedicated TX and RX wire channels for every port, <strong>eliminating collisions completely</strong> and doubling theoretical link capacity.</p>
        `
      },
      {
        heading: "4. Inside the Network Card (NIC): DMA, Ring Buffers & SoftIRQs",
        content: `
          <p>How does a physical signal on the wire become an object in your Python, Java, or C program? Here is the exact hardware-to-kernel path:</p>
          <ol>
            <li><strong>PHY & MAC Chip:</strong> Physical transceiver deserializes electrical voltages/photons into binary bytes, validates the 4-byte CRC32 Frame Check Sequence (FCS), and checks the Destination MAC.</li>
            <li><strong>DMA Engine (Direct Memory Access):</strong> The NIC writes the raw frame directly into host RAM in a circular queue called the <strong><code>rx_ring</code> (Receive Ring Buffer)</strong> without interrupting the CPU.</li>
            <li><strong>Hardware Interrupt (MSI-X) & NAPI SoftIRQ:</strong> The NIC triggers an interrupt; the Linux kernel switches to poll mode (NAPI), wraps the packet into a kernel <code>sk_buff</code> data structure, and processes L2/L3/L4 headers.</li>
            <li><strong>Socket Queue:</strong> The kernel places the payload into the receiving application's socket buffer (<code>SO_RCVBUF</code>).</li>
          </ol>
        `
      },
      {
        heading: "5. Kernel Sockets & The Loopback Interface (127.0.0.1 / ::1)",
        content: `
          <p>A software program interacts with the network stack through a <strong>Socket</strong> (a kernel file descriptor). The standard POSIX socket lifecycle follows:</p>
          <pre class="code-snippet"><code>// Server Socket Lifecycle in C / POSIX:
int sock = socket(AF_INET, SOCK_STREAM, 0);     // 1. Allocate socket descriptor
bind(sock, (struct sockaddr*)&addr, sizeof(addr)); // 2. Bind to local IP:Port
listen(sock, 128);                               // 3. Set backlog queue depth
int client = accept(sock, NULL, NULL);           // 4. Block until TCP handshake completes
recv(client, buffer, sizeof(buffer), 0);         // 5. Read bytes from socket buffer</code></pre>
          <p>The <strong>Loopback Interface (<code>lo</code> / <code>127.0.0.1</code>)</strong> bypasses the physical NIC completely: when a socket sends bytes to <code>127.0.0.1</code>, the OS kernel copies the byte buffer directly from the sender's memory space to the receiver's queue in RAM with zero hardware latency (\(<0.05\text{ ms}\)).</p>
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
          question: "What is the primary function of Direct Memory Access (DMA) on a modern Network Interface Card (NIC)?",
          options: [
            { text: "It allows the NIC hardware to write incoming packet bytes directly into system RAM ring buffers without consuming host CPU cycles.", correct: true, feedback: "✅ Correct! DMA allows the network card to stream packets straight into RAM ring buffers without interrupting the CPU for every individual byte." },
            { text: "It encrypts all Ethernet frames using AES-256 before leaving the motherboard.", correct: false, feedback: "❌ Incorrect. DMA is a memory transfer mechanism, not an encryption cipher." },
            { text: "It converts optical laser photons into radio frequencies.", correct: false, feedback: "❌ Incorrect. That is the function of an optical transceiver/PHY." }
          ]
        }
      }
    ]
  },
  {
    id: "module-1",
    title: "1. The OSI 7-Layer vs TCP/IP Model & Encapsulation In-Depth",
    shortTitle: "1. OSI vs TCP/IP Model",
    icon: "🥞",
    tagline: "Exact bit-level header dissections, PDU taxonomies, MTU/MSS math, and encapsulation mechanics.",
    sections: [
      {
        heading: "1. The Engineering Need for Layered Abstraction",
        content: `
          <p>Without layered abstraction, every web developer would have to write custom drivers for every brand of copper cable or Wi-Fi radio. Layering enforces <strong>strict separation of concerns</strong>: each layer provides a well-defined service to the layer above while hiding implementation details below.</p>
          
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>OSI 7-Layer Model (Conceptual ISO Standard)</h4>
              <p>Theoretical taxonomy created in 1984:</p>
              <ul style="font-size:0.82rem; margin-left:18px;">
                <li><strong>7. Application:</strong> User-facing protocol semantics (HTTP, SSH)</li>
                <li><strong>6. Presentation:</strong> Serialization, ASN.1, encryption, UTF-8</li>
                <li><strong>5. Session:</strong> RPC dialogues, session checkpoints</li>
                <li><strong>4. Transport:</strong> End-to-end byte streams and multiplexing (TCP, UDP)</li>
                <li><strong>3. Network:</strong> Logical addressing and global path routing (IPv4, IPv6)</li>
                <li><strong>2. Data Link:</strong> Node-to-node framing and physical MACs (Ethernet)</li>
                <li><strong>1. Physical:</strong> Modulation, bit timing, voltages, optical lasers</li>
              </ul>
            </div>
            <div class="tech-card">
              <h4>TCP/IP 5-Layer Model (Real-World Internet)</h4>
              <p>The actual architecture running in all production operating systems:</p>
              <ul style="font-size:0.82rem; margin-left:18px;">
                <li><strong>Application Layer (L5):</strong> HTTP/1.1, HTTP/2, HTTP/3, DNS, TLS 1.3</li>
                <li><strong>Transport Layer (L4):</strong> TCP segments, UDP datagrams</li>
                <li><strong>Internet Layer (L3):</strong> IPv4, IPv6, ICMP, IPsec</li>
                <li><strong>Data Link Layer (L2):</strong> Ethernet II (802.3), Wi-Fi (802.11), 802.1Q</li>
                <li><strong>Physical Layer (L1):</strong> Copper Cat6a, Single-mode fiber, SFP+</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        heading: "2. Protocol Data Units (PDUs) & MTU vs MSS Mathematics",
        content: `
          <p>In network engineering, each layer defines a specific <strong>Protocol Data Unit (PDU)</strong>:</p>
          <ul>
            <li><strong>L4 Transport:</strong> <code>Segment</code> (TCP) or <code>Datagram</code> (UDP).</li>
            <li><strong>L3 Network:</strong> <code>Packet</code> (IPv4 / IPv6).</li>
            <li><strong>L2 Data Link:</strong> <code>Frame</code> (Ethernet II).</li>
            <li><strong>L1 Physical:</strong> <code>Bits / Symbols</code>.</li>
          </ul>

          <div class="tech-card" style="margin-top:14px;">
            <h4>MTU vs MSS Mathematical Breakdown</h4>
            <p><strong>Maximum Transmission Unit (MTU):</strong> The largest Layer 3 packet that an Ethernet interface can transmit without fragmentation (Standard Ethernet MTU = <strong>1500 bytes</strong>; Jumbo Frames = <strong>9000 bytes</strong>).</p>
            <p><strong>Maximum Segment Size (MSS):</strong> The maximum application TCP payload per segment:</p>
            <pre class="code-snippet"><code>Standard Ethernet MTU:       1500 bytes
- IPv4 Header (Minimum):      - 20 bytes
- TCP Header (Minimum):       - 20 bytes
-----------------------------------------
Maximum TCP Segment (MSS):   1460 bytes</code></pre>
          </div>
        `
      },
      {
        heading: "3. Complete Bit-by-Bit Header Dissections",
        content: `
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>Ethernet II Frame Structure (Layer 2)</h4>
              <ul style="font-size:0.8rem; margin-left:16px;">
                <li><strong>Preamble & SFD (8 bytes):</strong> <code>101010...11</code> for clock sync</li>
                <li><strong>Destination MAC (6 bytes):</strong> <code>02:42:AC:11:00:02</code></li>
                <li><strong>Source MAC (6 bytes):</strong> <code>02:42:AC:11:00:01</code></li>
                <li><strong>EtherType (2 bytes):</strong> <code>0x0800</code> (IPv4), <code>0x86DD</code> (IPv6), <code>0x0806</code> (ARP)</li>
                <li><strong>Payload (46 to 1500 bytes):</strong> Encapsulated L3 packet</li>
                <li><strong>FCS / CRC32 (4 bytes):</strong> Hardware cyclic redundancy check</li>
              </ul>
            </div>
            <div class="tech-card">
              <h4>IPv4 Packet Header Structure (Layer 3 - 20 Bytes)</h4>
              <ul style="font-size:0.8rem; margin-left:16px;">
                <li><strong>Version (4 bits) & IHL (4 bits):</strong> IPv4 version + Header Length</li>
                <li><strong>DSCP / ECN (8 bits):</strong> Quality of Service / Congestion Notice</li>
                <li><strong>Total Length (16 bits):</strong> Full size of packet in bytes</li>
                <li><strong>Identification, Flags (DF/MF), Fragment Offset (32 bits)</strong></li>
                <li><strong>Time to Live - TTL (8 bits):</strong> Hop limit counter (decremented by 1 at each router)</li>
                <li><strong>Protocol (8 bits):</strong> <code>6</code> (TCP), <code>17</code> (UDP), <code>1</code> (ICMP)</li>
                <li><strong>Header Checksum (16 bits):</strong> Error check for IP header</li>
                <li><strong>Source & Destination IP (64 bits total)</strong></li>
              </ul>
            </div>
          </div>
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
          question: "When a router receives an Ethernet frame, routes the IP packet to the next hop, and transmits it, which headers are modified?",
          options: [
            { text: "The router strips the incoming Layer 2 Ethernet header, decrements the IPv4 TTL by 1, recalculates the IP checksum, and encapsulates the packet in a brand new Layer 2 frame with the next hop's Destination MAC.", correct: true, feedback: "✅ Correct! Routers terminate the Layer 2 frame, modify L3 TTL/Checksum, and build a new L2 frame for the next hop." },
            { text: "The router leaves all Layer 2 and Layer 3 headers completely untouched.", correct: false, feedback: "❌ Incorrect. That describes a transparent L2 switch, not a Layer 3 router." },
            { text: "The router changes the source and destination TCP port numbers.", correct: false, feedback: "❌ Incorrect. Standard routers do not alter L4 TCP port numbers (unless doing NAT/PAT)." }
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
        heading: "1. The 32-Bit Binary Structure of IPv4",
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
        heading: "2. How Binary Subnet Masking Works (Bitwise AND)",
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
        heading: "3. CIDR Prefix Reference Table (/24 to /31)",
        content: `
          <div class="tech-card">
            <h4>Common CIDR Subnet Masks & Host Capacities</h4>
            <table class="specs-table" style="font-family:var(--font-mono); font-size:0.8rem;">
              <tr><th>CIDR</th><th>Subnet Mask</th><th>Total IPs (\(2^H\))</th><th>Usable Hosts (\(2^H - 2\))</th><th>Use Case</th></tr>
              <tr><td><code>/24</code></td><td>255.255.255.0</td><td>256</td><td>254</td><td>Standard office or LAN subnet</td></tr>
              <tr><td><code>/26</code></td><td>255.255.255.192</td><td>64</td><td>62</td><td>Department branch subnet</td></tr>
              <tr><td><code>/27</code></td><td>255.255.255.224</td><td>32</td><td>30</td><td>Server cluster / Kubernetes pool</td></tr>
              <tr><td><code>/28</code></td><td>255.255.255.240</td><td>16</td><td>14</td><td>DMZ public server pool</td></tr>
              <tr><td><code>/29</code></td><td>255.255.255.248</td><td>8</td><td>6</td><td>ISP static IP block for firewalls</td></tr>
              <tr><td><code>/30</code></td><td>255.255.255.252</td><td>4</td><td>2</td><td>Point-to-point router links</td></tr>
              <tr><td><code>/31</code></td><td>255.255.255.254</td><td>2</td><td>2 (RFC 3021)</td><td>Modern point-to-point WAN links</td></tr>
            </table>
          </div>
        `
      },
      {
        heading: "4. Private IP Ranges (RFC 1918) & NAT (Network Address Translation)",
        content: `
          <p>Because IPv4 only has ~4.29 billion total addresses, the IETF reserved three non-routable private ranges:</p>
          <ul>
            <li><code>10.0.0.0/8</code> (10.0.0.0 – 10.255.255.255): 16,777,216 addresses (Cloud VPCs & enterprise data centers).</li>
            <li><code>172.16.0.0/12</code> (172.16.0.0 – 172.31.255.255): 1,048,576 addresses (Docker / Kubernetes internal networks).</li>
            <li><code>192.168.0.0/16</code> (192.168.0.0 – 192.168.255.255): 65,536 addresses (Home & small office LANs).</li>
          </ul>
          <p><strong>NAT Types:</strong></p>
          <ul>
            <li><strong>SNAT (Source NAT / PAT / Masquerade):</strong> Rewrites internal private IPs to the router's public WAN IP and assigns a unique source port for outgoing traffic.</li>
            <li><strong>DNAT (Destination NAT / Port Forwarding):</strong> Translates incoming requests on a specific public WAN port (e.g. <code>203.0.113.1:443</code>) directly to an internal server IP (<code>192.168.1.50:443</code>).</li>
            <li><strong>CGNAT (Carrier-Grade NAT - <code>100.64.0.0/10</code>):</strong> Used by ISPs to share public IPs across thousands of customer households.</li>
          </ul>
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
          question: "If a network engineer assigns an IP of 192.168.1.65/26 to a server, what is the valid usable host range and broadcast address of that subnet?",
          options: [
            { text: "Usable Host Range: 192.168.1.65 to 192.168.1.126 | Broadcast Address: 192.168.1.127 (Network ID is 192.168.1.64).", correct: true, feedback: "✅ Correct! For /26, block size is 64. Subnet 1 is 192.168.1.64/26. Broadcast is .127, and usable range is .65 to .126." },
            { text: "Usable Host Range: 192.168.1.1 to 192.168.1.64 | Broadcast: 192.168.1.65.", correct: false, feedback: "❌ Incorrect. That would be Subnet 0." },
            { text: "Usable Host Range: 192.168.1.0 to 192.168.1.255 | Broadcast: 192.168.1.255.", correct: false, feedback: "❌ Incorrect. That is a /24 subnet, not /26." }
          ]
        }
      }
    ]
  },
  {
    id: "module-3",
    title: "3. VLANs, 802.1Q Trunking & Spanning Tree (STP)",
    shortTitle: "3. VLANs & 802.1Q",
    icon: "🏷️",
    tagline: "Broadcast domain segmentation, 802.1Q 4-byte tagging, Inter-VLAN routing, and STP loop prevention.",
    sections: [
      {
        heading: "1. The Problem: Broadcast Storms on Flat Networks",
        content: `
          <p>When an L2 switch receives an ARP broadcast frame, it floods that frame out of <strong>every single connected port</strong>.</p>
          <p>On a flat enterprise network with hundreds of computers, constant broadcast traffic wastes CPU cycles on every machine and creates major security risks (anyone can listen to unencrypted traffic from other departments).</p>
          <p><strong>VLANs (Virtual Local Area Networks)</strong> solve this by partitioning a single physical switch into multiple isolated logical switches in software!</p>
        `
      },
      {
        heading: "2. The IEEE 802.1Q 4-Byte Tag Dissection",
        content: `
          <p>When an Ethernet frame travels across an 802.1Q Trunk link between switches, the sending switch inserts a <strong>4-byte 802.1Q header</strong> directly between the Source MAC and EtherType fields:</p>
          <div class="tech-card">
            <h4>IEEE 802.1Q Header Breakdown (32 Bits Total)</h4>
            <ul>
              <li><strong>TPID (Tag Protocol Identifier - 16 bits):</strong> Fixed at <code>0x8100</code> to identify this frame as an 802.1Q tagged frame.</li>
              <li><strong>PCP (Priority Code Point - 3 bits):</strong> Layer 2 Quality of Service (QoS / 802.1p) marking voice/video packets with high priority (0–7).</li>
              <li><strong>DEI (Drop Eligible Indicator - 1 bit):</strong> Marks whether this frame can be dropped during heavy switch queue congestion.</li>
              <li><strong>VID (VLAN Identifier - 12 bits):</strong> Specifies the exact VLAN number (from <code>1</code> to <code>4094</code>).</li>
            </ul>
          </div>
        `
      },
      {
        heading: "3. Inter-VLAN Routing: Router-on-a-Stick vs Multilayer Switch SVIs",
        content: `
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>1. Router-on-a-Stick (RoAS)</h4>
              <p>Uses a single physical cable (802.1Q trunk) between a switch and a router. The router interface is divided into logical sub-interfaces:</p>
              <pre class="code-snippet"><code>interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0</code></pre>
            </div>
            <div class="tech-card">
              <h4>2. Layer 3 Multilayer Switch (SVI)</h4>
              <p>Routes traffic internally at full wire speed (ASIC silicon) using <strong>Switched Virtual Interfaces (SVIs)</strong> without sending packets through an external router:</p>
              <pre class="code-snippet"><code>interface Vlan10
 ip address 192.168.10.1 255.255.255.0
interface Vlan20
 ip address 192.168.20.1 255.255.255.0
ip routing</code></pre>
            </div>
          </div>
        `
      },
      {
        heading: "4. Spanning Tree Protocol (STP 802.1D / RSTP 802.1w)",
        content: `
          <p>If you connect switches in a redundant loop for fault tolerance, broadcast frames will circulate indefinitely (<strong>Broadcast Storm</strong>), saturating the links and crashing the switches in seconds.</p>
          <p><strong>Spanning Tree Protocol (STP)</strong> prevents this by:</p>
          <ol>
            <li>Electing a single <strong>Root Bridge</strong> (the switch with the lowest Bridge Priority + MAC address).</li>
            <li>Calculating the shortest path to the Root Bridge for every switch port.</li>
            <li>Placing redundant loop links into a <strong>Blocking / Discarding State</strong>.</li>
            <li>If an active link fails, STP automatically transitions the blocked backup port into <strong>Forwarding State</strong> within seconds!</li>
          </ol>
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
          question: "What happens when an untagged PC on an Access Port assigned to VLAN 20 transmits an Ethernet frame?",
          options: [
            { text: "The PC transmits a standard untagged Ethernet frame; the switch receives it on the Access Port, tags it internally with VID 20, and restricts forwarding only to other VLAN 20 ports or 802.1Q trunk links.", correct: true, feedback: "✅ Exactly! End-user PCs have no awareness of VLANs. The switch assigns and enforces the VLAN tag on the ingress port." },
            { text: "The PC must install a special VLAN driver to insert the 802.1Q tag itself.", correct: false, feedback: "❌ Incorrect. Standard access ports expect untagged frames from end-user devices." },
            { text: "The frame is automatically converted into a Wi-Fi packet.", correct: false, feedback: "❌ Incorrect." }
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
    tagline: "MAC address learning algorithm, ARP cache resolution, Gratuitous ARP, and ARP spoofing defense.",
    sections: [
      {
        heading: "1. The Switch MAC Learning & Forwarding Algorithm",
        content: `
          <p>Unlike old hubs that blindly repeated electrical signals out of all ports, a modern <strong>Layer 2 Switch</strong> is an intelligent packet forwarder with internal CAM memory.</p>
          <p>The switch follows a deterministic algorithm for every arriving Ethernet frame:</p>
          <ol>
            <li><strong>Learn (Source MAC):</strong> Switch inspects the Source MAC and records <code>Source MAC ➔ Ingress Port</code> with an aging timer (default 300 seconds).</li>
            <li><strong>Lookup (Destination MAC):</strong> Switch consults its CAM table for the Destination MAC:
              <br>&bull; <em>If Found (Unicast Hit):</em> Forward frame strictly out the matching port.
              <br>&bull; <em>If Not Found (Unknown Unicast):</em> Flood the frame out all ports on the same VLAN except the ingress port.
              <br>&bull; <em>If Broadcast (<code>FF:FF:FF:FF:FF:FF</code>):</em> Flood out all ports on the same VLAN.
            </li>
          </ol>
        `
      },
      {
        heading: "2. Address Resolution Protocol (ARP) & Gratuitous ARP",
        content: `
          <p>When Computer A wants to send an IP packet to <code>192.168.1.50</code>, it doesn't know what MAC address to put into the Ethernet frame header:</p>
          <ol>
            <li><strong>ARP Request (Broadcast):</strong> Computer A asks: <em>"Who has IP 192.168.1.50? Tell 192.168.1.10."</em> (Sent to broadcast MAC <code>ff:ff:ff:ff:ff:ff</code>).</li>
            <li><strong>ARP Reply (Unicast):</strong> Host 192.168.1.50 responds: <em>"I have 192.168.1.50! My MAC is 02:42:AC:11:00:50."</em></li>
            <li><strong>ARP Cache:</strong> Computer A caches this entry in OS RAM for subsequent packets.</li>
          </ol>
          <p><strong>Gratuitous ARP (GARP):</strong> An unprompted ARP broadcast where a host announces its own IP/MAC mapping. Used for:</p>
          <ul>
            <li>Detecting duplicate IP address conflicts during boot.</li>
            <li>Updating switch MAC tables instantly when a Virtual IP fails over to a backup cluster node (VRRP / Keepalived).</li>
          </ul>
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
    tagline: "Recursive query delegation, EDNS0, TTL caching, DNSSEC chain of trust, and record types.",
    sections: [
      {
        heading: "1. The Internet's Global Hierarchical Namespace",
        content: `
          <p>DNS translates human-readable domain strings (<code>api.github.com</code>) into 32-bit IPv4 or 128-bit IPv6 addresses.</p>
          <p>Common DNS Record Types:</p>
          <ul>
            <li><strong>A Record:</strong> Maps a domain to an IPv4 address (e.g. <code>140.82.121.6</code>).</li>
            <li><strong>AAAA Record:</strong> Maps a domain to a 128-bit IPv6 address (e.g. <code>2606:4700::6810:84e5</code>).</li>
            <li><strong>CNAME (Canonical Name):</strong> Creates an alias pointing one domain name to another domain name.</li>
            <li><strong>MX (Mail Exchange):</strong> Directs emails with a priority integer to the organization's SMTP mail servers.</li>
            <li><strong>TXT:</strong> Stores arbitrary text strings (critical for SPF, DKIM, DMARC email authentication and domain validation).</li>
            <li><strong>PTR (Pointer):</strong> Reverse DNS mapping an IP address back to its canonical hostname.</li>
          </ul>
        `
      },
      {
        heading: "2. Recursive vs Iterative DNS Resolution Walkthrough",
        content: `
          <ol>
            <li><strong>Local Resolver (Stub):</strong> Checks browser cache, OS cache, and <code>/etc/hosts</code>. If missing, sends a <strong>Recursive Query</strong> to the configured Recursive DNS Resolver (e.g. <code>1.1.1.1</code> or <code>8.8.8.8</code>).</li>
            <li><strong>Recursive Resolver:</strong> Performs iterative queries:
              <br>&bull; Asks the <strong>Root Name Server (<code>.</code>)</strong> ➔ Returns the TLD Name Server IP (<code>.com</code>).
              <br>&bull; Asks the <strong>TLD Name Server (<code>.com</code>)</strong> ➔ Returns the Authoritative Name Server IP (<code>ns1.github.com</code>).
              <br>&bull; Asks the <strong>Authoritative Name Server</strong> ➔ Returns the final <code>A</code> record (<code>140.82.121.6</code>) with a Time-to-Live (TTL).
            </li>
            <li><strong>Response & Caching:</strong> Resolver returns the IP to your machine and caches it in RAM for the duration of the TTL.</li>
          </ol>
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
    title: "6. TCP vs UDP Deep Dive (State Machine, Flow & Congestion Control)",
    shortTitle: "6. TCP & UDP Protocols",
    icon: "🤝",
    tagline: "3-way handshake, 11-state machine, sequence arithmetic, sliding window flow control, and BBR congestion.",
    sections: [
      {
        heading: "1. The Technical Mechanics of TCP Reliability",
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
        heading: "2. The Complete 11-State TCP Finite State Machine",
        content: `
          <div class="tech-card">
            <h4>TCP Connection Lifecycle States</h4>
            <ul style="font-size:0.82rem; margin-left:18px;">
              <li><code>LISTEN</code>: Server socket is waiting for incoming connection requests.</li>
              <li><code>SYN_SENT</code>: Client sent SYN packet, waiting for SYN-ACK.</li>
              <li><code>SYN_RECEIVED</code>: Server received SYN, sent SYN-ACK, waiting for client ACK.</li>
              <li><code>ESTABLISHED</code>: Connection open; bidirectional data transfer active.</li>
              <li><code>FIN_WAIT_1</code> / <code>FIN_WAIT_2</code>: Active closer initiated connection termination.</li>
              <li><code>CLOSE_WAIT</code> / <code>LAST_ACK</code>: Passive closer acknowledging teardown.</li>
              <li><code>TIME_WAIT</code>: Active closer waits <strong>\(2 \times \text{MSL}\)</strong> (typically 60 seconds) to ensure delayed packets on the Internet expire before reusing the socket pair.</li>
            </ul>
          </div>
        `
      },
      {
        heading: "3. Flow Control vs Congestion Control (Tahoe, CUBIC & BBR)",
        content: `
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>1. Flow Control (Receiver Protection)</h4>
              <p>Governed by the <strong>Receive Window (rwnd)</strong> in TCP headers. If the receiver application is slow reading bytes from RAM, <code>rwnd</code> shrinks to 0 (Zero Window), forcing the sender to pause.</p>
            </div>
            <div class="tech-card">
              <h4>2. Congestion Control (Network Protection)</h4>
              <p>Governed by the <strong>Congestion Window (cwnd)</strong> in kernel memory. Modern algorithms like <strong>BBR (Bottleneck Bandwidth and RTT)</strong> probe maximum bandwidth and minimum RTT directly without waiting for packet loss.</p>
            </div>
          </div>
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
    title: "7. Application Endpoints & The Web Stack (HTTP, Ports, TLS 1.3)",
    shortTitle: "7. HTTP, Ports & TLS",
    icon: "🌐",
    tagline: "Port multiplexing, plain-text HTTP formatting, and cryptographic TLS encryption.",
    sections: [
      {
        heading: "1. Port Multiplexing & Socket 5-Tuple Binding",
        content: `
          <p>A single computer has only one IP address, but runs dozens of programs. The OS kernel routes incoming packets using the <strong>Socket 5-Tuple</strong>:</p>
          <pre class="code-snippet"><code>{ Source IP, Source Port, Destination IP, Destination Port, Protocol }</code></pre>
          <p>Port Categories:</p>
          <ul>
            <li><strong>Well-Known Ports (0–1023):</strong> Privileged services (HTTP 80, HTTPS 443, SSH 22, DNS 53).</li>
            <li><strong>Registered Ports (1024–49151):</strong> Application services (PostgreSQL 5432, Redis 6379, Node 3000).</li>
            <li><strong>Ephemeral Ports (49152–65535):</strong> Dynamic client source ports assigned by the kernel.</li>
          </ul>
        `
      },
      {
        heading: "2. The Evolution of the Web Protocol Stack",
        content: `
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>HTTP/1.1 (1997) vs HTTP/2 (2015)</h4>
              <p><strong>HTTP/1.1:</strong> Plain-text framing. Suffers from Head-of-Line (HoL) blocking (one request per TCP connection at a time).</p>
              <p><strong>HTTP/2:</strong> Binary framing with multiplexed streams over a single TCP connection.</p>
            </div>
            <div class="tech-card">
              <h4>HTTP/3 & QUIC (2022)</h4>
              <p>Replaces TCP with <strong>QUIC over UDP</strong>. Eliminates transport-layer HoL blocking and enables zero-RTT connection resumption even when switching Wi-Fi to mobile networks.</p>
            </div>
          </div>
        `
      },
      {
        heading: "3. Cryptographic TLS 1.3 Handshake Mechanics",
        content: `
          <p>TLS 1.3 establishes encrypted sessions in a single Round Trip (1-RTT):</p>
          <ol>
            <li><strong>ClientHello:</strong> Client sends supported ciphers + Ephemeral Elliptic Curve Diffie-Hellman (ECDH) Key Share.</li>
            <li><strong>ServerHello:</strong> Server sends its ECDH Key Share + X.509 Certificate + Signature.</li>
            <li><strong>Key Derivation:</strong> Both sides calculate identical symmetric session keys (AES-256-GCM / ChaCha20-Poly1305) without ever transmitting the secret over the wire!</li>
          </ol>
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
    title: "8. Enterprise Diagnostic Lab & Network Troubleshooting",
    shortTitle: "8. Diagnostic Missions",
    icon: "🧪",
    tagline: "Solve hands-on network outages and debug simulated connectivity issues using real tools.",
    sections: [
      {
        heading: "Enterprise Troubleshooting Methodology",
        content: `
          <p>When debugging any production network issue, follow the <strong>Bottom-Up OSI Troubleshooting Model</strong>:</p>
          <ol>
            <li><strong>Layer 1 (Physical):</strong> Check cable link lights, SFP+ optical power (dBm), Wi-Fi signal.</li>
            <li><strong>Layer 2 (Data Link):</strong> Check switch port status, VLAN assignment, ARP table (<code>arp -a</code>), MAC learning.</li>
            <li><strong>Layer 3 (Network):</strong> Check IP configuration (<code>ip a</code>), ping default gateway, check routing table (<code>ip route</code>).</li>
            <li><strong>Layer 4 (Transport):</strong> Check if the listening port is open with <code>nmap</code> or <code>netstat -tlpn</code>.</li>
            <li><strong>Layer 7 (Application):</strong> Test HTTP endpoints with <code>curl -v</code>, verify DNS resolution with <code>nslookup</code>.</li>
          </ol>

          <div class="missions-list" style="margin-top:20px;">
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
