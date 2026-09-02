// Enterprise & Hardware Catalog: Detailed Engineering Specifications, Internal Silicon Anatomy, Cabling & Port Pinouts
window.NETWORK_DEVICES = [
  {
    id: "endpoint-pc",
    name: "Workstations & Laptops (Endpoints)",
    category: "Endpoints / Hosts",
    icon: "💻",
    osiLayer: "Layer 7 to Layer 1 (Full Stack)",
    tagline: "User-facing computing endpoints that generate and consume application data.",
    role: "Runs client applications (browsers, IDEs, databases). Initiates TCP/UDP socket connections using OS-assigned ephemeral source ports (49152–65535) and handles hardware interrupts for network frame reception.",
    specs: {
      addressing: "1x Private IPv4 (via DHCP or Static) + 1x Link-Local IPv6 (fe80::/10) + 1x Factory Burned-In MAC (OUI + Device ID).",
      interfaces: "Gigabit Ethernet (1000BASE-T / 2.5GBASE-T) with RJ-45 or Wi-Fi 6/6E (802.11ax/be radio 2.4/5/6 GHz).",
      typicalPorts: "Dynamic client ports (e.g. 54218), SSH (22), RDP (3389), mDNS (5353).",
      protocols: "TCP, UDP, IPv4, IPv6, ICMP, DHCP (DORA), DNS, TLS 1.3, HTTP/2, ARP"
    },
    anatomy: `
      <ul>
        <li><strong>NIC Controller Silicon & DMA Engine:</strong> Uses Direct Memory Access (DMA) to copy incoming packets directly from the NIC hardware ring buffer (<code>rx_ring</code>) into operating system kernel RAM without burdening the host CPU.</li>
        <li><strong>Hardware Offload Engines:</strong> Modern NICs perform Checksum Offload (CSO), TCP Segmentation Offload (TSO), and Receive Side Scaling (RSS) across multiple CPU cores directly in hardware silicon.</li>
        <li><strong>Socket Buffers (<code>sk_buff</code>):</strong> Kernel memory queues holding packets between the physical network driver and user-space software processes.</li>
      </ul>
    `
  },
  {
    id: "server",
    name: "Enterprise Rackmount Servers",
    category: "Endpoints / Hosts",
    icon: "🗄️",
    tagline: "High-density 24/7 compute systems hosting critical services and APIs.",
    role: "Binds to well-known privileged listening ports (0–1023) and high-throughput application ports (e.g., 80, 443, 3306, 5432, 6379, 9092) to process thousands of concurrent client connections with high concurrency.",
    specs: {
      addressing: "Static IPv4/IPv6, Virtual IP (VIP) for High Availability clusters (VRRP/CARP).",
      interfaces: "Dual or Quad 10G/25G/100G SFP28/QSFP28 Optical Fiber Transceivers with LACP (802.3ad Bonding).",
      typicalPorts: "Port 80 (HTTP), 443 (HTTPS), 22 (SSH), 53 (DNS), 3306 (MySQL), 5432 (PostgreSQL).",
      protocols: "TCP, UDP, TLS 1.3, HTTP/2, HTTP/3 (QUIC), gRPC, LACP, BGP, SNMP"
    },
    anatomy: `
      <ul>
        <li><strong>NIC Teaming & LACP (802.3ad):</strong> Combines multiple physical 10Gbps interfaces into a single logical channel with aggregate 20Gbps bandwidth and instant link failover.</li>
        <li><strong>Out-of-Band IPMI / iDRAC / ILO:</strong> An isolated onboard motherboard microcontroller with its own dedicated physical Ethernet port that allows BIOS configuration, thermal monitoring, and power cycling even when the main server OS is offline.</li>
        <li><strong>PCIe Gen 4/5 Bus:</strong> Ultra-high bandwidth interconnect transferring up to 64 GB/s between CPU memory and 100Gbps network cards.</li>
      </ul>
    `
  },
  {
    id: "switch-l2",
    name: "Layer 2 Managed Enterprise Switch",
    category: "Intermediary Infrastructure",
    icon: "🔀",
    tagline: "The central wire-speed interconnect of local networks forwarding Ethernet frames.",
    role: "Constructs a collision-free local network. Inspects the 6-byte Destination MAC in Ethernet frames and forwards them strictly out the target physical port using dedicated hardware memory (CAM Table) at wire speed.",
    specs: {
      addressing: "Operates transparently at Layer 2 (has a Management SVI IPv4 address for SSH/SNMP admin).",
      interfaces: "24/48x 10/100/1000 Mbps RJ-45 ports + 4x 10G SFP+ Uplink ports; PoE+ (802.3at up to 30W/port).",
      typicalPorts: "Access Ports (untagged single VLAN) and Trunk Ports (802.1Q tagged multi-VLAN).",
      protocols: "IEEE 802.3 Ethernet, 802.1Q (VLANs), 802.1D/w/s (STP/RSTP/MSTP), 802.1X (RADIUS Auth), LACP, LLDP"
    },
    anatomy: `
      <ul>
        <li><strong>ASIC Switching Fabric:</strong> Non-blocking hardware crossbar matrix capable of switching 128+ Gbps backplane throughput simultaneously across all ports with sub-microsecond latency.</li>
        <li><strong>CAM Table (Content-Addressable Memory):</strong> Specialized high-speed memory that looks up destination MAC addresses in a single clock cycle.</li>
        <li><strong>TCAM (Ternary CAM):</strong> High-performance memory used for matching Access Control Lists (ACLs), QoS DSCP markings, and VLAN filters simultaneously.</li>
      </ul>
    `
  },
  {
    id: "router",
    name: "Layer 3 Enterprise Router & Gateway",
    category: "Intermediary Infrastructure",
    icon: "🌐",
    tagline: "The intelligent boundary router directing packets across global subnets and WANs.",
    role: "Connects disparate subnets. Inspects the 32-bit Destination IP, decrements the Time-to-Live (TTL), re-calculates the IP checksum, performs Longest Prefix Match (LPM) lookups in its Forwarding Information Base (FIB), and rewrites Layer 2 MAC headers.",
    specs: {
      addressing: "Possesses distinct IP addresses and MAC addresses on every physical or sub-interface.",
      interfaces: "WAN Gigabit/10G Optical interfaces, Modular WAN Interface Cards (NIM/WIC), Console Serial/USB.",
      typicalPorts: "BGP (179), OSPF (protocol 89), IPsec IKE (500/4500 UDP), NAT Translation Tables.",
      protocols: "IPv4, IPv6, ICMP, OSPF, BGP, EIGRP, NAT/PAT, IPsec VPN, VRRP, DHCP Relay (ip helper-address)"
    },
    anatomy: `
      <ul>
        <li><strong>Control Plane vs Data (Forwarding) Plane:</strong> The Control Plane (CPU) runs routing protocols (OSPF, BGP) to build the Routing Information Base (RIB). The Data Plane (ASIC) uses hardware CEF (Cisco Express Forwarding) / FIB tables to route packets in silicon without CPU interrupts.</li>
        <li><strong>NAT/PAT Translation Engine:</strong> Rewrites private IP headers (RFC 1918) to public WAN IPs and maintains a dynamic state table mapping <code>Source IP:Port ➔ Public IP:Port</code>.</li>
      </ul>
    `
  },
  {
    id: "firewall",
    name: "Next-Generation Hardware Firewall (NGFW)",
    category: "Security & Edge Defense",
    icon: "🛡️",
    tagline: "Stateful packet inspection and deep layer-7 security gateway.",
    role: "Enforces security policy by maintaining a stateful connection tracking table (`conntrack`), performing Layer 7 application identification, SSL/TLS decryption inspection, and preventing intrusion attempts.",
    specs: {
      addressing: "Routed Mode (with distinct IPs per security zone) or Transparent Bridge Mode.",
      interfaces: "Dedicated WAN, LAN, DMZ, and High-Availability (HA) Heartbeat Sync interfaces.",
      typicalPorts: "Inspects all 65,535 TCP/UDP ports; IPsec/WireGuard VPN endpoints.",
      protocols: "Stateful Inspection, DPI, TLS Inspection, IPsec, IKEv2, NAT64, BGP"
    },
    anatomy: `
      <ul>
        <li><strong>Stateful Connection Table:</strong> Tracks TCP sequence numbers, SYN/ACK handshake state, and UDP pseudo-connections so that unsolicited inbound packets are immediately dropped while valid reply traffic is permitted.</li>
        <li><strong>DMZ (Demilitarized Zone):</strong> An isolated network zone for public-facing servers (web, mail) that isolates internal LAN databases in case the public server is compromised.</li>
      </ul>
    `
  },
  {
    id: "modem",
    name: "Modem / Fiber ONT (Optical Network Terminal)",
    category: "WAN Edge Access",
    icon: "📡",
    tagline: "Physical signal transducer converting ISP carrier waves into digital Ethernet.",
    role: "Bridges carrier telecom signals (laser light on glass fibers, RF radio waves on coaxial copper, or high-frequency tones on DSL) into standard IEEE 802.3 Ethernet frames.",
    specs: {
      addressing: "Layer 1/2 Signal Bridge (ISP assigns Public IP to the connected router via DHCP or PPPoE).",
      interfaces: "WAN: SC/APC Green Angle-Polished Fiber connector (GPON/XGS-PON). LAN: 1x 10G/2.5G RJ-45 Ethernet.",
      typicalPorts: "Bridge mode directly linked to Router WAN port.",
      protocols: "GPON (ITU-T G.984 - 2.4G/1.2G), XGS-PON (10G/10G), DOCSIS 3.1, PPPoE"
    },
    anatomy: `
      <ul>
        <li><strong>Wavelength Division Optical Diplexer:</strong> Receives downstream 1490nm wavelength laser light and transmits upstream at 1310nm simultaneously over a single strand of single-mode glass.</li>
        <li><strong>GEM (GPON Encapsulation Method) Framer:</strong> Converts optical data bursts into standard 1500-byte Ethernet frames for your router.</li>
      </ul>
    `
  },
  {
    id: "wifi-ap",
    name: "Enterprise Wi-Fi Access Point (WAP)",
    category: "Wireless Infrastructure",
    icon: "📶",
    tagline: "High-density radio transceiver bridging 802.11 Wi-Fi frames to 802.3 Ethernet.",
    role: "Converts airborne RF radio waves into wired Ethernet frames. Broadcasts multiple SSIDs mapped to different VLANs (e.g. Corporate VLAN 10 vs Guest VLAN 50) and handles 802.1X enterprise authentication.",
    specs: {
      addressing: "Management IP in Management VLAN; clients assigned IPs in their respective SSID VLANs.",
      interfaces: "2.5G/5G mGig RJ-45 with PoE+ (802.3at); Multi-Radio 4x4 MU-MIMO (2.4GHz, 5GHz, 6GHz).",
      typicalPorts: "CAPWAP tunnels (UDP 5246/5247) to Wireless LAN Controller (WLC).",
      protocols: "IEEE 802.11ax/be (Wi-Fi 6/7), WPA3-Enterprise, 802.1X (EAP-TLS), 802.11r/k/v (Fast Roaming)"
    },
    anatomy: `
      <ul>
        <li><strong>MU-MIMO Beamforming Antennas:</strong> Uses constructive RF phase shifts to focus radio energy directly toward specific client devices rather than radiating blindly in all directions.</li>
        <li><strong>CAPWAP Tunneling:</strong> Encapsulates client wireless frames inside UDP packets and tunnels them back to a central Wireless LAN Controller for centralized firewalling and roaming.</li>
      </ul>
    `
  },
  {
    id: "voip-phone",
    name: "VoIP Telephony Desk Phone",
    category: "Telephony Endpoints",
    icon: "📞",
    tagline: "Digital endpoint converting human acoustic voice into realtime UDP RTP streams.",
    role: "Initiates and receives enterprise voice calls over IP data networks. Uses SIP for call signaling/negotiation (port 5060) and RTP for bidirectional live audio transmission.",
    specs: {
      addressing: "Placed in a dedicated Voice VLAN (tagged via CDP/LLDP-MED) with QoS DSCP EF (Expedited Forwarding).",
      interfaces: "Dual Gigabit RJ-45 (one uplink to switch with PoE, one pass-through PC port).",
      typicalPorts: "Port 5060 (SIP Signaling), Ports 16384–32767 UDP (RTP Audio Media).",
      protocols: "SIP (RFC 3261), RTP (RFC 3550), SDP, G.711 / G.729 / Opus, PoE (802.3af)"
    },
    anatomy: `
      <ul>
        <li><strong>DSP (Digital Signal Processor):</strong> Samples acoustic microphone voltages at 8,000–48,000 Hz, quantizes into binary audio frames, and strips background noise in real time.</li>
        <li><strong>PoE Power Controller:</strong> Negotiates 48V DC power over Ethernet pairs (IEEE 802.3af 15.4W) directly from the switch, needing no AC power brick.</li>
        <li><strong>Internal 3-Port L2 Switch:</strong> Allows a computer and the phone to share a single wall Ethernet cable while placing the phone on Voice VLAN 100 and the PC on Data VLAN 10!</li>
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
    id: "cables-media",
    name: "Network Cables, Transceivers & Pinouts",
    category: "Physical Media (Layer 1)",
    icon: "🔌",
    tagline: "The physical transmission conduits carrying signals between network devices.",
    role: "Transfers electrical voltages or optical photon pulses between network cards, switches, and routers.",
    specs: {
      addressing: "Layer 1 Physical Media (No addresses).",
      interfaces: "RJ-45 8P8C (T568A/T568B), LC/SC Fiber Connectors, SFP+ / QSFP28 Transceivers.",
      typicalPorts: "1Gbps (Cat5e), 10Gbps (Cat6/Cat6a / SFP+), 100Gbps (QSFP28).",
      protocols: "IEEE 802.3 (1000BASE-T, 10GBASE-T, 10GBASE-SR/LR, 100GBASE-LR4)"
    },
    anatomy: `
      <ul>
        <li><strong>Cat6 / Cat6a Twisted Pair (RJ-45):</strong> 4 pairs of 23 AWG copper wire (8 conductors). Precision twisting rates cancel out electromagnetic interference (crosstalk). Pinout standards: <strong>T568B</strong> (Orange/White, Orange, Green/White, Blue, Blue/White, Green, Brown/White, Brown). Max length: 100m.</li>
        <li><strong>Single-Mode Fiber (SMF - Yellow Jacket):</strong> 9µm core diameter. Uses 1310nm/1550nm single-wavelength lasers for high-speed long-haul backbones (up to 40km+).</li>
        <li><strong>Multi-Mode Fiber (MMF - Aqua/OM3/OM4 Jacket):</strong> 50µm core diameter. Uses 850nm VCSEL lasers for data center server-to-switch links (up to 300m).</li>
        <li><strong>SFP+ / QSFP Transceivers:</strong> Hot-swappable optical/copper transceivers with Digital Optical Monitoring (DOM) reporting optical power (dBm), temperature, and laser bias current.</li>
      </ul>
    `
  }
];
