// Catalog of Physical Network Devices, Endpoints & Cabling Media
window.NETWORK_DEVICES = [
  {
    id: "endpoint-pc",
    name: "Workstations & Laptops",
    category: "Endpoints / Hosts",
    icon: "💻",
    osiLayer: "Layer 7 to Layer 1 (Full Stack)",
    tagline: "User-facing personal computing devices that initiate or receive application data.",
    role: "Runs client applications (web browsers, IDEs, email clients, games). Initiates TCP/UDP socket connections using ephemeral ports (49152-65535).",
    specs: {
      addressing: "Assigned 1x Private IPv4 via DHCP (or Static) + Unique Factory MAC address on NIC.",
      interfaces: "RJ-45 Ethernet (1Gbps/2.5Gbps) or Wi-Fi 6 (802.11ax radio).",
      typicalPorts: "Dynamic client ports (e.g. 54321), SSH (22) for remote management.",
      protocols: "TCP, UDP, IP, ICMP, DHCP, DNS, HTTP, TLS"
    },
    anatomy: `
      <ul>
        <li><strong>Network Interface Card (NIC):</strong> The physical hardware chip that converts RAM memory buffers into copper voltages or Wi-Fi radio frequencies.</li>
        <li><strong>Operating System Kernel Network Stack:</strong> Manages socket buffers, TCP sequence counters, ARP cache, and routing tables.</li>
      </ul>
    `
  },
  {
    id: "server",
    name: "Enterprise Rack Servers",
    category: "Endpoints / Hosts",
    icon: "🗄️",
    tagline: "High-uptime computing nodes running server software daemons 24/7.",
    role: "Binds to well-known listening ports (e.g., 80 for HTTP, 443 for HTTPS, 3306 for MySQL, 5432 for Postgres) and answers thousands of concurrent client requests.",
    specs: {
      addressing: "Usually assigned fixed Static IP addresses or DNS service names.",
      interfaces: "Dual or Quad 10Gbps/25Gbps SFP+ Fiber or 10GBASE-T Copper with Link Aggregation (LACP).",
      typicalPorts: "Port 80 (HTTP), 443 (HTTPS), 22 (SSH), 53 (DNS), 3306 (SQL).",
      protocols: "TCP, UDP, TLS 1.3, HTTP/2, gRPC, BGP"
    },
    anatomy: `
      <ul>
        <li><strong>Redundant NICs (Bonding / LACP):</strong> Multiple network ports teamed together for failover and increased aggregate bandwidth.</li>
        <li><strong>Out-of-Band Management (iDRAC / ILO):</strong> A dedicated secondary processor with its own Ethernet port allowing engineers to remotely reboot the server even if the main OS crashes.</li>
      </ul>
    `
  },
  {
    id: "switch-l2",
    name: "Layer 2 Network Switch",
    category: "Intermediary Infrastructure",
    icon: "🔀",
    tagline: "The central interconnect of a Local Area Network (LAN) forwarding frames via MAC addresses.",
    role: "Connects multiple endpoints together on the same local subnet. Uses specialized hardware memory (CAM Table) to forward Ethernet frames directly to destination ports with zero collisions.",
    specs: {
      addressing: "Transparent at Layer 2 (no IP required for data forwarding, though has a Management IP).",
      interfaces: "24 or 48 RJ-45 Gigabit access ports + 2 to 4 SFP+ (10G) Uplink ports.",
      typicalPorts: "Access Ports (single VLAN) and Trunk Ports (802.1Q tagged).",
      protocols: "Ethernet II, IEEE 802.1Q (VLANs), 802.1D (STP), LLDP, LACP"
    },
    anatomy: `
      <ul>
        <li><strong>ASIC Switching Chip:</strong> Hardware silicon that inspects the 6-byte Destination MAC of incoming frames in nanoseconds and forwards them directly to the target port.</li>
        <li><strong>MAC Address Table (CAM Table):</strong> Dynamic memory mapping <code>MAC Address ➔ Switch Physical Port</code>.</li>
      </ul>
    `
  },
  {
    id: "router",
    name: "Layer 3 Router & Gateway",
    category: "Intermediary Infrastructure",
    icon: "🌐",
    tagline: "The boundary device that routes packets between separate networks and the Internet.",
    role: "Inspects Destination IP addresses in packet headers, decrements TTL, consults its internal Routing Table, and forwards packets across physical subnets and WAN links.",
    specs: {
      addressing: "Has multiple IP addresses (one IP for each connected subnet interface/gateway).",
      interfaces: "WAN fiber/copper uplinks, LAN Gigabit ports, SFP+ transceivers.",
      typicalPorts: "BGP (179), OSPF, NAT translation tables, Firewall rule filters.",
      protocols: "IPv4, IPv6, ICMP, NAT/PAT, BGP, OSPF, DHCP Server, IPSec"
    },
    anatomy: `
      <ul>
        <li><strong>Routing Table:</strong> Map of <code>Destination Subnet ➔ Next Hop IP ➔ Outbound Interface</code>.</li>
        <li><strong>NAT Engine:</strong> Translates private RFC 1918 IPs (e.g. 192.168.1.50) into a single public routable IP for Internet access.</li>
      </ul>
    `
  },
  {
    id: "modem",
    name: "Modem / Fiber ONT (Optical Terminal)",
    category: "WAN Edge Access",
    icon: "📡",
    tagline: "Modulator/Demodulator that converts ISP transmission signals into standard Ethernet.",
    role: "Converts optical fiber laser pulses (GPON/EPON), coaxial cable radio signals (DOCSIS), or telephone copper signals (DSL) into digital standard Ethernet frames for your router.",
    specs: {
      addressing: "Bridges WAN carrier signals; assigned Public IP via ISP DHCP/PPPoE.",
      interfaces: "WAN: SC/APC Fiber Optical port or Coax F-type. LAN: 1x 10G/2.5G RJ-45 Ethernet.",
      typicalPorts: "Bridge mode to router WAN port.",
      protocols: "GPON (ITU-T G.984), DOCSIS 3.1, PPPoE"
    },
    anatomy: `
      <ul>
        <li><strong>Optical Diplexer / Photodiode:</strong> Converts incoming 1490nm wavelength laser light into binary electrical pulses, and transmits at 1310nm.</li>
        <li><strong>Bridge Chip:</strong> Converts optical frames into standard IEEE 802.3 Ethernet frames.</li>
      </ul>
    `
  },
  {
    id: "printer",
    name: "Network Laser Printer",
    category: "Network Peripherals",
    icon: "🖨️",
    tagline: "Shared office printing endpoint listening for raw print jobs over the network.",
    role: "Receives PostScript and PDF document streams over local TCP sockets from workstations across the office.",
    specs: {
      addressing: "Best practice: Assigned a permanent Static IP or DHCP Reservation.",
      interfaces: "100Mbps/1Gbps RJ-45 Ethernet port or Wi-Fi.",
      typicalPorts: "Port 9100 (RAW / JetDirect), Port 631 (IPP - Internet Printing Protocol), Port 515 (LPD).",
      protocols: "TCP, IP, IPP, SNMP (for toner monitoring), mDNS / Bonjour"
    },
    anatomy: `
      <ul>
        <li><strong>Print Server NIC:</strong> Embedded network controller with dedicated RAM to buffer print queues.</li>
        <li><strong>SNMP Agent:</strong> Reports paper jams, page counts, and toner percentage to network monitoring tools.</li>
      </ul>
    `
  },
  {
    id: "voip-phone",
    name: "VoIP Desk Phone (Voice over IP)",
    category: "Telephony Endpoints",
    icon: "📞",
    tagline: "Digital telephony device converting human voice into realtime UDP audio packets.",
    role: "Establishes telephone calls across data networks using SIP signaling for call setup and RTP streams for live audio transmission.",
    specs: {
      addressing: "Usually isolated on a dedicated <strong>Voice VLAN</strong> with QoS priority (802.1p CoS).",
      interfaces: "Dual RJ-45 ports with integrated internal pass-through 3-port switch + PoE.",
      typicalPorts: "Port 5060 (SIP Signaling), Ports 10000-20000 UDP (RTP Voice Media).",
      protocols: "SIP (Session Initiation Protocol), RTP (Real-time Transport Protocol), RTCP, G.711 / Opus codecs"
    },
    anatomy: `
      <ul>
        <li><strong>DSP (Digital Signal Processor):</strong> Samples microphone analog voice at 8,000 to 48,000 times/sec, compresses it into G.711/Opus binary audio frames.</li>
        <li><strong>PoE (Power over Ethernet):</strong> Receives 48V DC power directly through the network cable (IEEE 802.3af), requiring no wall power plug!</li>
      </ul>
    `
  },
  {
    id: "ip-camera",
    name: "IP Surveillance Camera (CCTV)",
    category: "IoT & Security Endpoints",
    icon: "📹",
    tagline: "High-definition video streaming endpoint transmitting continuous video streams.",
    role: "Captures optical video, encodes into H.264/H.265 compression, and streams to a Network Video Recorder (NVR) or cloud storage.",
    specs: {
      addressing: "Placed in an isolated Security/CCTV VLAN; Static or DHCP reserved IP.",
      interfaces: "100Mbps RJ-45 with PoE (802.3af/at).",
      typicalPorts: "Port 554 (RTSP Video Streaming), Port 80/443 (Web Admin), Port 8000 (ONVIF).",
      protocols: "RTSP (Real-Time Streaming Protocol), RTP, ONVIF, HTTPS, NTP"
    },
    anatomy: `
      <ul>
        <li><strong>Hardware Video Encoder:</strong> Encodes raw camera CMOS sensor frames into H.265 bitstreams in real time.</li>
        <li><strong>RTSP Server:</strong> Streams video over UDP/TCP sockets to NVR recording appliances.</li>
      </ul>
    `
  },
  {
    id: "cables-media",
    name: "Network Cables & Transceivers",
    category: "Physical Media (Layer 1)",
    icon: "🔌",
    tagline: "The physical transmission conduits carrying signals between network devices.",
    role: "Transfers electrical voltages or optical photon pulses between network cards, switches, and routers.",
    specs: {
      addressing: "Layer 1 Physical Media (No addresses).",
      interfaces: "RJ-45 8P8C (Copper), LC / SC (Fiber), SFP+ / QSFP28 Transceivers.",
      typicalPorts: "1Gbps (Cat5e), 10Gbps (Cat6a / SFP+), 100Gbps (QSFP28).",
      protocols: "IEEE 802.3 (1000BASE-T, 10GBASE-SR, 100GBASE-LR4)"
    },
    anatomy: `
      <ul>
        <li><strong>Cat6 / Cat6a Copper Cable:</strong> 4 twisted pairs of copper wire (8 conductors). Twisting cancels out electromagnetic crosstalk (EMI). Maximum distance: 100 meters (328 ft).</li>
        <li><strong>Single-Mode Fiber (SMF - Yellow Jacket):</strong> 9-micron glass core using narrow lasers for long-haul distances (up to 40+ km).</li>
        <li><strong>Multi-Mode Fiber (MMF - Aqua/Orange Jacket):</strong> 50-micron glass core using LEDs for short-distance data center links (up to 300 meters).</li>
      </ul>
    `
  }
];
