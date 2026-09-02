// Expanded Curriculum Data: 6 Rich Modules with technical foundations, visualizers, interactive quizzes, and labs
window.CURRICULUM = [
  {
    id: "module-1",
    title: "1. Moving Bytes Across a Wire",
    shortTitle: "Moving Bytes",
    icon: "⚡",
    tagline: "How two computer programs transfer memory across electrical or optical links.",
    sections: [
      {
        heading: "The Core Problem: Two Separate Memories",
        content: `
          <p>Imagine you have two computers: <strong>Computer A</strong> and <strong>Computer B</strong>. Computer A has a piece of data stored in its RAM memory—for example, the text <code>"Hello"</code>, which in binary bytes is <code>01001000 01100101 01101100 01101100 01101111</code>.</p>
          <p>The goal of computer networking is simple: <strong>copy those exact bytes from Computer A's memory into Computer B's memory</strong> across a physical medium (copper cable voltages, optical fiber light pulses, or Wi-Fi radio frequencies).</p>
        `,
        callout: {
          type: "tip",
          title: "Simple Technical Fact",
          text: "At the lowest physical layer, there are no files or web pages—only rapid voltage changes or light pulses representing 1s and 0s traveling through a physical medium at roughly 200,000 km per second."
        }
      },
      {
        heading: "Why We Slice Data into Small Packets",
        content: `
          <p>If Computer A wants to send a 5-megabyte file, it does <em>not</em> send one gigantic, uninterrupted 5-million-byte signal. If even a tiny 1-millisecond electrical glitch occurred near the end, the entire 5 megabytes would be corrupted and have to restart from the beginning.</p>
          <p>Instead, the operating system's network driver slices the data into small chunks called <strong>Packets</strong> (typically up to 1,500 bytes each, known as the MTU). If packet #14 gets corrupted, only packet #14 needs to be re-sent!</p>
          <p>Every packet is given a small metadata prefix called a <strong>Header</strong>. Think of a header as a fixed set of extra bytes attached at the beginning of your data that tells the network card:</p>
          <ul>
            <li><strong>Source Address:</strong> Which machine sent this packet?</li>
            <li><strong>Destination Address:</strong> Which machine should receive it?</li>
            <li><strong>Payload Size:</strong> How many bytes of actual data follow this header?</li>
          </ul>
        `
      },
      {
        heading: "Interactive Visualizer: The Packet Pipeline",
        content: `
          <p>Use the visualizer below to watch your raw data text turn into binary chunks, attach headers, and travel through an intermediary network switch to Computer B.</p>
        `,
        visualizer: "packetJourney"
      },
      {
        heading: "The 5-Layer Stack Explorer",
        content: `
          <p>Explore how each layer in the operating system kernel and network hardware adds its own specialized header metadata:</p>
        `,
        visualizer: "layerStack"
      },
      {
        heading: "Hands-On Lab: Your First Terminal Commands",
        content: `
          <p>In real networks, engineers check if another machine is reachable and measure how many milliseconds it takes for a packet to round-trip using <code>ping</code>.</p>
          <p>Try running this command in the terminal below:</p>
          <div class="code-preview">
            <code>ping 192.168.1.10</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('ping 192.168.1.10')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "ping 192.168.1.10"
      },
      {
        heading: "Quick Knowledge Check",
        quiz: {
          question: "Why do computer networks slice data into small 1,500-byte packets instead of sending one huge continuous stream?",
          options: [
            { text: "Because small packets prevent a single bit error or voltage glitch from forcing the entire file to restart from scratch.", correct: true, feedback: "✅ Correct! If a 1,500-byte packet drops, only that single packet is retransmitted rather than the entire 50MB file." },
            { text: "Because computers can only store 1,500 bytes in RAM at any given time.", correct: false, feedback: "❌ Incorrect. Modern computers have gigabytes of RAM. Slicing exists for wire error recovery and fair link sharing." },
            { text: "Because binary numbers cannot exceed 1,500 in decimal notation.", correct: false, feedback: "❌ Incorrect. Binary numbers can represent arbitrarily large values." }
          ]
        }
      }
    ]
  },
  {
    id: "module-2",
    title: "2. Network Addresses & Hardware IDs",
    shortTitle: "IP & MAC Addresses",
    icon: "🏷️",
    tagline: "Why every computer has two addresses: a fixed hardware chip ID (MAC) and a logical routing number (IP).",
    sections: [
      {
        heading: "Two Identifiers: Local Hardware vs Global Routing",
        content: `
          <p>Every network interface card (NIC)—whether an Ethernet port or a Wi-Fi chip—has two different addresses:</p>
          
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>1. MAC Address (Hardware Chip ID)</h4>
              <p>Burned into the silicon chip at the factory. Format: 6 pairs of hexadecimal numbers like <code>00:1A:2B:3C:4D:5E</code>.</p>
              <p><strong>Purpose:</strong> Used only on the immediate local wire or switch to get a packet to the next adjacent machine.</p>
            </div>
            <div class="tech-card">
              <h4>2. IP Address (Logical Routing Coordinate)</h4>
              <p>Assigned by your operating system or network configuration. Format (IPv4): 4 decimal numbers like <code>192.168.1.25</code>.</p>
              <p><strong>Purpose:</strong> Hierarchical routing coordinate that tells routers across thousands of miles which network path to forward data toward.</p>
            </div>
          </div>
        `,
        callout: {
          type: "note",
          title: "Technical Distinction",
          text: "MAC addresses never cross past your local router gateway. As a packet hops from router to router across the world, its destination MAC changes at every hop, but the destination IP address stays fixed from source to end!"
        }
      },
      {
        heading: "Subnet Masks: Splitting the Network from the Machine",
        content: `
          <p>An IPv4 address is 32 bits long (4 bytes). It is divided into two sections:</p>
          <ol>
            <li><strong>Network Prefix:</strong> Identifies which local network group this computer belongs to.</li>
            <li><strong>Host ID:</strong> Identifies the specific computer inside that network group.</li>
          </ol>
          <p>The <strong>Subnet Mask</strong> (e.g., <code>255.255.255.0</code> or <code>/24</code>) tells the operating system where the boundary line is. All machines sharing the exact same Network Prefix can communicate directly without needing a router!</p>
        `,
        visualizer: "subnetVisualizer"
      },
      {
        heading: "Hands-On Lab: Inspecting Your Network Interfaces",
        content: `
          <p>Let's inspect our simulated system's network configuration and check the local Address Resolution Protocol (ARP) table that maps IP addresses to hardware MAC addresses.</p>
          <div class="code-preview">
            <code>ip a</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('ip a')">Run in Terminal ↵</button>
          </div>
          <div class="code-preview">
            <code>arp -a</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('arp -a')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "ip a"
      },
      {
        heading: "Quick Knowledge Check",
        quiz: {
          question: "When a packet travels from your computer through 4 different intermediate routers to reach a web server, which address changes at each hop?",
          options: [
            { text: "The Destination MAC address (changes at each link hop to the next router's hardware interface).", correct: true, feedback: "✅ Exactly! The Destination IP remains the web server's IP throughout the journey, but the L2 MAC address is updated at each hop to reach the next adjacent router." },
            { text: "The Destination IP address.", correct: false, feedback: "❌ Incorrect. If the destination IP changed at each hop, the packet would forget its final destination!" },
            { text: "Both the MAC and IP addresses stay completely unchanged across all hops.", correct: false, feedback: "❌ Incorrect. The L2 MAC address must change at each link hop so the current router can pass the frame to the next machine on the wire." }
          ]
        }
      }
    ]
  },
  {
    id: "module-3",
    title: "3. DNS — The Distributed Lookup Table",
    shortTitle: "DNS Lookup Table",
    icon: "🔍",
    tagline: "How computers map human-readable domain strings to numeric 32-bit IP addresses.",
    sections: [
      {
        heading: "Humans Use Strings, Routers Use Binary Numbers",
        content: `
          <p>When you type <code>https://api.github.com</code> in a program or browser, the network card cannot route packets using string letters. It needs a 32-bit (IPv4) or 128-bit (IPv6) numeric destination.</p>
          <p><strong>DNS (Domain Name System)</strong> is essentially a massive, hierarchical key-value database that stores records mapping names to IP addresses:</p>
          <pre class="code-snippet"><code>// Conceptual DNS Key-Value Storage
{
  "api.github.com": {
    "type": "A",
    "value": "140.82.121.6",
    "ttl": 300 // cached for 300 seconds
  }
}</code></pre>
        `
      },
      {
        heading: "The Recursive Resolution Chain",
        content: `
          <p>When your computer doesn't have an address in its local memory cache, it queries a series of specialized servers in a hierarchical chain:</p>
          <ul>
            <li><strong>1. Local Resolver (e.g. 1.1.1.1 or 8.8.8.8):</strong> Checks local memory cache. If not found, it queries outward.</li>
            <li><strong>2. Root Server (<code>.</code>):</strong> Directs the query to the Top-Level Domain server for <code>.com</code>.</li>
            <li><strong>3. TLD Server (<code>.com</code>):</strong> Directs the query to the Authoritative Name Server for <code>github.com</code>.</li>
            <li><strong>4. Authoritative Server:</strong> Holds the official zone file and returns the exact IP address <code>140.82.121.6</code>.</li>
          </ul>
        `,
        visualizer: "dnsVisualizer"
      },
      {
        heading: "Hands-On Lab: Querying DNS Records",
        content: `
          <p>Use <code>nslookup</code> and <code>dig</code> to query DNS servers and inspect the raw IP mappings:</p>
          <div class="code-preview">
            <code>nslookup dev.local</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('nslookup dev.local')">Run in Terminal ↵</button>
          </div>
          <div class="code-preview">
            <code>dig api.github.com A</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('dig api.github.com A')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "nslookup dev.local"
      },
      {
        heading: "Quick Knowledge Check",
        quiz: {
          question: "What is the purpose of the TTL (Time-To-Live) field in a DNS response?",
          options: [
            { text: "It specifies how many seconds the client or recursive resolver is allowed to cache the IP address in memory before asking again.", correct: true, feedback: "✅ Spot on! If TTL is 300, the client remembers the IP for 5 minutes without having to make repeated network queries." },
            { text: "It specifies how many milliseconds the packet has before it self-destructs.", correct: false, feedback: "❌ Incorrect. That refers to the IP header TTL (hop limit), not DNS record TTL." },
            { text: "It defines the maximum bandwidth allowed for that website.", correct: false, feedback: "❌ Incorrect. TTL has no relation to bandwidth." }
          ]
        }
      }
    ]
  },
  {
    id: "module-4",
    title: "4. Reliable Streams vs Fast Datagrams (TCP & UDP)",
    shortTitle: "TCP & UDP Protocols",
    icon: "🤝",
    tagline: "Handling packet loss, reordering, and connection state across unreliable wires.",
    sections: [
      {
        heading: "The Unreliable Wire Problem",
        content: `
          <p>Physical networks are inherently lossy: buffer queues overflow on busy routers, electrical interference introduces bit-errors, and packets may arrive out of order because they took different geographical fiber paths.</p>
          <p>To solve this, the Transport Layer gives software engineers two distinct protocols:</p>
          
          <div class="tech-comparison-grid">
            <div class="tech-card">
              <h4>TCP (Transmission Control Protocol)</h4>
              <ul>
                <li><strong>Connection-oriented:</strong> Performs a 3-way handshake to synchronize sequence counters before sending data.</li>
                <li><strong>Guaranteed delivery:</strong> Receiver sends Acknowledgments (<code>ACK</code>). Missing packets are re-transmitted automatically.</li>
                <li><strong>In-order assembly:</strong> Packets arriving out of order are reassembled into the exact original byte stream.</li>
              </ul>
            </div>
            <div class="tech-card">
              <h4>UDP (User Datagram Protocol)</h4>
              <ul>
                <li><strong>Connectionless:</strong> No handshake, no state machine.</li>
                <li><strong>No retransmission:</strong> Sends packets immediately with zero acknowledgment overhead.</li>
                <li><strong>Ideal for real-time:</strong> Used for video streaming, voice audio, DNS queries, and real-time multiplayer gaming where low latency beats guaranteed delivery.</li>
              </ul>
            </div>
          </div>
        `
      },
      {
        heading: "The TCP 3-Way Handshake",
        content: `
          <p>Before any application bytes are transmitted over TCP, the client and server agree on initial sequence numbers using a 3-step exchange:</p>
          <ol>
            <li><strong>SYN (Synchronize):</strong> Client sends: <em>"I want to open a connection. My starting sequence counter is 1000."</em></li>
            <li><strong>SYN-ACK (Synchronize + Acknowledge):</strong> Server replies: <em>"Received your 1000. My starting counter is 5000, and I ACK 1001."</em></li>
            <li><strong>ACK (Acknowledge):</strong> Client replies: <em>"Received your 5000. I ACK 5001. Connection is now ESTABLISHED."</em></li>
          </ol>
        `,
        visualizer: "tcpHandshake"
      },
      {
        heading: "Hands-On Lab: Inspecting Active Connections",
        content: `
          <p>Engineers use <code>netstat</code> or <code>ss</code> to list open listening ports and active TCP socket connections with their current state (e.g. <code>LISTEN</code>, <code>ESTABLISHED</code>, <code>TIME_WAIT</code>):</p>
          <div class="code-preview">
            <code>netstat -tlpn</code>
            <button class="btn-copy" onclick="TerminalApp.runSampleCommand('netstat -tlpn')">Run in Terminal ↵</button>
          </div>
        `,
        terminalPrompt: "netstat -tlpn"
      },
      {
        heading: "Quick Knowledge Check",
        quiz: {
          question: "If Computer A sends TCP sequence numbers 1000 through 1499 (500 bytes of data), what ACK number will Computer B send back to acknowledge full receipt?",
          options: [
            { text: "ACK 1500 (meaning: 'I have received all bytes up to 1499, send me byte 1500 next').", correct: true, feedback: "✅ Correct! In TCP, the ACK number always represents the next expected byte sequence number." },
            { text: "ACK 1000", correct: false, feedback: "❌ Incorrect. ACK 1000 would mean Computer B received zero new bytes." },
            { text: "ACK 500", correct: false, feedback: "❌ Incorrect. ACK is a cumulative sequence number counter, not just the length." }
          ]
        }
      }
    ]
  },
  {
    id: "module-5",
    title: "5. Application Endpoints & The Web (Ports, HTTP, TLS)",
    shortTitle: "Ports, HTTP & TLS",
    icon: "🌐",
    tagline: "Multiplexing applications with port numbers, plain-text HTTP formatting, and cryptographic TLS encryption.",
    sections: [
      {
        heading: "Port Numbers: Directing Packets to the Right Program",
        content: `
          <p>A single computer has only one IP address, but it might run 20 different programs simultaneously (a database, an SSH server, a web server, a music streaming app).</p>
          <p><strong>Port Numbers (0 to 65535)</strong> are 16-bit integers in the TCP/UDP header that route incoming packets to the exact process listening on that specific socket:</p>
          <ul>
            <li><code>Port 80:</code> Standard unencrypted HTTP Web Traffic</li>
            <li><code>Port 443:</code> Encrypted HTTPS Web Traffic (TLS)</li>
            <li><code>Port 22:</code> Secure Shell (SSH) Remote Access</li>
            <li><code>Port 53:</code> DNS Lookup Queries</li>
            <li><code>Port 3306:</code> MySQL Database Engine</li>
          </ul>
        `
      },
      {
        heading: "HTTP: A Simple Text-Based Request/Response Protocol",
        content: `
          <p>Once a TCP connection is established on Port 80, the client transmits plain text over the socket:</p>
          <pre class="code-snippet"><code>GET /index.html HTTP/1.1
Host: mysite.internal
User-Agent: curl/8.4.0
Accept: */*</code></pre>
          <p>And the web server parses the string and sends back a response code with headers and payload body:</p>
          <pre class="code-snippet"><code>HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 48

&lt;html&gt;&lt;body&gt;&lt;h1&gt;System Online&lt;/h1&gt;&lt;/body&gt;&lt;/html&gt;</code></pre>
        `
      },
      {
        heading: "Interactive Topology: Exploring Process Ports Across Nodes",
        content: `
          <p>Click through the nodes below to inspect which software processes are bound to which listening ports in the operating system kernel:</p>
        `,
        visualizer: "topologyVisualizer"
      },
      {
        heading: "Hands-On Lab: Sending Raw HTTP Requests with Curl",
        content: `
          <p>Use <code>curl</code> with the <code>-i</code> (include headers) or <code>-v</code> (verbose) flags to observe the raw HTTP exchange in real time:</p>
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
      },
      {
        heading: "Quick Knowledge Check",
        quiz: {
          question: "When a web browser connects to https://example.com, what allows the server's operating system to send the incoming packets to the Nginx web server rather than the SSH daemon?",
          options: [
            { text: "The Destination Port number (443 for HTTPS) in the TCP header.", correct: true, feedback: "✅ Exactly! The OS kernel maintains a table of open sockets and uses the destination port to deliver packets to the correct listening process." },
            { text: "The Destination MAC address.", correct: false, feedback: "❌ Incorrect. The MAC address only identifies the network card hardware, not the individual software process." },
            { text: "The file extension of the requested URL.", correct: false, feedback: "❌ Incorrect. The transport layer does not inspect file extensions." }
          ]
        }
      }
    ]
  },
  {
    id: "module-6",
    title: "6. Interactive Terminal Lab & Diagnostic Missions",
    shortTitle: "Diagnostic Missions",
    icon: "🧪",
    tagline: "Solve hands-on network outages and debug simulated connectivity issues using real tools.",
    sections: [
      {
        heading: "Put Your Skills into Practice",
        content: `
          <p>In software engineering, you will often need to debug why an API request timed out, why a microservice is unreachable, or where a packet dropped along the route.</p>
          <p>This lab gives you a live sandbox with simulated network hosts, routers, DNS tables, and servers. You can run any command freely or take on guided diagnostic missions!</p>
          
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
