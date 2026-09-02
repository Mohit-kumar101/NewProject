/**
 * Tech & engineering calculator pack — 50 tools across 5 categories.
 * Formulas live in src/lib/formulas_tech.ts.
 */

import {
  CLOUD_AI_CATEGORY,
  DIGITAL_SEO_CATEGORY,
  ELECTRONICS_HW_CATEGORY,
  NETWORKING_IT_CATEGORY,
  SOFTWARE_DEV_CATEGORY,
} from "@/lib/categoryPaths";

export type TechInputSpec = [string, string, number, number, number, number];

export type TechPackToolSpec = {
  slug: string;
  title: string;
  category: string;
  seoH1: string;
  seoDescription: string;
  focusKeyword: string;
  formulaType: string;
  description: string;
  formulaSummary: string;
  realWorldExample: string;
  inputs: TechInputSpec[];
};

export const TECH_PACK_SPECS: TechPackToolSpec[] = [
  // ——— Networking & IT Infrastructure (10) ———
  {
    slug: "subnet-calculator",
    title: "Subnet Calculator",
    category: NETWORKING_IT_CATEGORY,
    seoH1: "Subnet Calculator — IP Ranges, Host Count & Subnet Mask",
    seoDescription:
      "Calculate usable hosts, network address, and subnet mask from CIDR prefix length and network size.",
    focusKeyword: "subnet calculator",
    formulaType: "techSubnetCalc",
    description:
      "Map CIDR prefix length to subnet mask, total addresses, and usable host count for IPv4 networks.",
    formulaSummary:
      "Hosts = 2^(32 − prefix) − 2; mask bits = prefix; usable range excludes network and broadcast.",
    realWorldExample: "/24 → 256 addresses, 254 usable hosts, mask 255.255.255.0.",
    inputs: [
      ["cidrPrefix", "CIDR prefix (/n)", 24, 8, 30, 1],
      ["subnetsNeeded", "Subnets needed", 1, 1, 64, 1],
    ],
  },
  {
    slug: "ip-address-cidr-calculator",
    title: "IP Address CIDR Calculator",
    category: NETWORKING_IT_CATEGORY,
    seoH1: "IP to CIDR Calculator — Convert Host Count to Prefix Length",
    seoDescription:
      "Convert required host count into the smallest CIDR block that fits your IP range.",
    focusKeyword: "ip address cidr calculator",
    formulaType: "techIpCidrCalc",
    description: "Find the CIDR prefix that fits a required number of IP addresses.",
    formulaSummary: "Prefix = 32 − ⌈log₂(required addresses)⌉; block size = 2^(32 − prefix).",
    realWorldExample: "Need 500 hosts → /23 block (512 addresses, 510 usable).",
    inputs: [
      ["hostsNeeded", "Hosts needed", 500, 2, 65534, 1],
      ["reserveBroadcast", "Reserve network+broadcast (1=yes, 0=no)", 1, 0, 1, 1],
    ],
  },
  {
    slug: "ipv4-to-ipv6-calculator",
    title: "IPv4 to IPv6 Converter",
    category: NETWORKING_IT_CATEGORY,
    seoH1: "IPv4 to IPv6 Calculator — Mapped & Translated Address Format",
    seoDescription:
      "Generate IPv4-mapped IPv6 notation (::ffff:x.x.x.x) from dotted-decimal octets.",
    focusKeyword: "ipv4 to ipv6 converter",
    formulaType: "techIpv4ToIpv6",
    description: "Convert IPv4 octets into IPv4-mapped IPv6 address notation for dual-stack routing.",
    formulaSummary: "Mapped IPv6 = ::ffff:A.B.C.D where A–D are decimal octets (0–255).",
    realWorldExample: "192.168.1.1 → ::ffff:192.168.1.1.",
    inputs: [
      ["octet1", "Octet 1 (A)", 192, 0, 255, 1],
      ["octet2", "Octet 2 (B)", 168, 0, 255, 1],
      ["octet3", "Octet 3 (C)", 1, 0, 255, 1],
      ["octet4", "Octet 4 (D)", 1, 0, 255, 1],
    ],
  },
  {
    slug: "ping-latency-cost-estimator",
    title: "Ping & Latency Cost Estimator",
    category: NETWORKING_IT_CATEGORY,
    seoH1: "Latency Impact Calculator — Packet Loss & Transfer Time",
    seoDescription:
      "Estimate effective throughput and transfer time when packet loss and RTT latency degrade TCP performance.",
    focusKeyword: "ping latency cost estimator",
    formulaType: "techPingLatencyCost",
    description:
      "Model how RTT and packet loss reduce effective data transfer speed on a connection.",
    formulaSummary:
      "Effective throughput ≈ (MSS / RTT) × √(1 − loss%); transfer time = file size ÷ effective Mbps.",
    realWorldExample: "100 Mbps link, 50 ms RTT, 1% loss on 1 GB → ~72 s effective transfer.",
    inputs: [
      ["linkMbps", "Link speed (Mbps)", 100, 1, 10000, 10],
      ["rttMs", "Round-trip latency (ms)", 50, 1, 500, 5],
      ["packetLossPct", "Packet loss (%)", 1, 0, 10, 0.1],
      ["fileSizeMb", "Transfer size (MB)", 1000, 1, 100000, 100],
    ],
  },
  {
    slug: "dns-propagation-time-estimator",
    title: "DNS Propagation Time Estimator",
    category: NETWORKING_IT_CATEGORY,
    seoH1: "DNS Propagation Time Calculator — TTL & Global Cache Delay",
    seoDescription:
      "Estimate how long DNS record changes take to propagate based on TTL and resolver cache behavior.",
    focusKeyword: "dns propagation time estimator",
    formulaType: "techDnsPropagation",
    description: "Estimate DNS change visibility window from TTL values and resolver refresh cycles.",
    formulaSummary:
      "Max propagation ≈ old TTL + new TTL; typical global visibility within 1–2× max TTL.",
    realWorldExample: "Old TTL 3600 s, new TTL 300 s → up to ~65 min worst-case propagation.",
    inputs: [
      ["oldTtlSec", "Previous TTL (seconds)", 3600, 60, 86400, 60],
      ["newTtlSec", "New TTL (seconds)", 300, 60, 86400, 60],
      ["resolverPct", "Resolvers refreshed (%)", 50, 10, 100, 5],
    ],
  },
  {
    slug: "mac-address-vendor-lookup",
    title: "MAC Address Vendor Lookup",
    category: NETWORKING_IT_CATEGORY,
    seoH1: "MAC Address Vendor Lookup — OUI Manufacturer Identifier",
    seoDescription:
      "Identify likely hardware manufacturer from the first three octets (OUI) of a MAC address.",
    focusKeyword: "mac address vendor lookup",
    formulaType: "techMacVendorLookup",
    description:
      "Map OUI prefix octets to common network hardware vendors for inventory and troubleshooting.",
    formulaSummary: "OUI = first 24 bits (3 octets); matched against IEEE-assigned manufacturer blocks.",
    realWorldExample: "00:1A:2B → common enterprise switch/router vendor range.",
    inputs: [
      ["oui1", "OUI octet 1 (hex as decimal 0–255)", 0, 0, 255, 1],
      ["oui2", "OUI octet 2", 26, 0, 255, 1],
      ["oui3", "OUI octet 3", 43, 0, 255, 1],
    ],
  },
  {
    slug: "raid-calculator",
    title: "RAID Calculator",
    category: NETWORKING_IT_CATEGORY,
    seoH1: "RAID Calculator — Usable Capacity, Fault Tolerance & Speed",
    seoDescription:
      "Calculate usable storage, redundancy, and relative read/write performance for RAID 0, 1, 5, and 10.",
    focusKeyword: "raid calculator",
    formulaType: "techRaidCalc",
    description:
      "Estimate usable capacity and fault tolerance across common RAID levels.",
    formulaSummary:
      "RAID 0: n×cap; RAID 1: cap; RAID 5: (n−1)×cap; RAID 10: (n/2)×cap.",
    realWorldExample: "4 × 4 TB drives, RAID 10 → 8 TB usable, 1 disk failure tolerance.",
    inputs: [
      ["driveCount", "Number of drives", 4, 2, 24, 1],
      ["driveSizeTb", "Drive size (TB each)", 4, 0.5, 20, 0.5],
      ["raidLevel", "RAID level (0, 1, 5, or 10)", 10, 0, 10, 1],
    ],
  },
  {
    slug: "bandwidth-download-time-calculator",
    title: "Bandwidth & Download Time Calculator",
    category: NETWORKING_IT_CATEGORY,
    seoH1: "Download Time Calculator — File Size vs Connection Speed",
    seoDescription:
      "Estimate file download or upload duration from file size and connection bandwidth in Mbps.",
    focusKeyword: "bandwidth download time calculator",
    formulaType: "techBandwidthDownload",
    description: "Convert file size and link speed into estimated transfer time.",
    formulaSummary: "Time (s) = (file MB × 8) ÷ Mbps; accounts for megabit vs megabyte conversion.",
    realWorldExample: "5 GB file at 100 Mbps → ~6.8 minutes.",
    inputs: [
      ["fileSizeMb", "File size (MB)", 5000, 1, 500000, 100],
      ["speedMbps", "Connection speed (Mbps)", 100, 1, 10000, 10],
      ["overheadPct", "Protocol overhead (%)", 10, 0, 30, 1],
    ],
  },
  {
    slug: "data-storage-unit-converter",
    title: "Data Storage Unit Converter",
    category: NETWORKING_IT_CATEGORY,
    seoH1: "Data Storage Unit Converter — TB, GB, GiB, PiB & Bytes",
    seoDescription:
      "Convert between decimal (GB/TB) and binary (GiB/TiB) storage units for capacity planning.",
    focusKeyword: "data storage unit converter",
    formulaType: "techStorageUnitConvert",
    description: "Convert storage values between decimal SI and binary IEC units.",
    formulaSummary:
      "Decimal: ×1000 per step; Binary: ×1024 per step (KiB → MiB → GiB → TiB → PiB).",
    realWorldExample: "1 TB (decimal) = 0.909 TiB (binary); 1 TiB = 1.1 TB.",
    inputs: [
      ["value", "Value to convert", 1, 0.001, 10000, 0.1],
      ["fromUnit", "From unit (0=GB, 1=TB, 2=GiB, 3=TiB)", 1, 0, 3, 1],
      ["toUnit", "To unit (0=GB, 1=TB, 2=GiB, 3=TiB)", 3, 0, 3, 1],
    ],
  },
  {
    slug: "fiber-optic-signal-loss-calculator",
    title: "Fiber Optic Signal Loss Calculator",
    category: NETWORKING_IT_CATEGORY,
    seoH1: "Fiber Optic Loss Calculator — dB Attenuation per Kilometer",
    seoDescription:
      "Estimate total dB loss on a fiber run from cable attenuation, length, splices, and connectors.",
    focusKeyword: "fiber optic signal loss calculator",
    formulaType: "techFiberSignalLoss",
    description: "Calculate end-to-end optical power budget for fiber links.",
    formulaSummary:
      "Total loss = (dB/km × km) + (splices × splice loss) + (connectors × connector loss).",
    realWorldExample: "5 km SM fiber at 0.35 dB/km + 4 splices + 2 connectors → ~2.5 dB total.",
    inputs: [
      ["lengthKm", "Fiber length (km)", 5, 0.1, 100, 0.1],
      ["attenuationDbKm", "Cable loss (dB/km)", 0.35, 0.1, 3, 0.05],
      ["spliceCount", "Splices", 4, 0, 20, 1],
      ["spliceLossDb", "Loss per splice (dB)", 0.1, 0.05, 0.5, 0.05],
      ["connectorCount", "Connectors", 2, 0, 10, 1],
      ["connectorLossDb", "Loss per connector (dB)", 0.5, 0.1, 1, 0.1],
    ],
  },

  // ——— Software Development & Programming (10) ———
  {
    slug: "regex-tester-timer-calculator",
    title: "Regex Tester & Timer",
    category: SOFTWARE_DEV_CATEGORY,
    seoH1: "Regex Performance Estimator — Pattern Complexity & Match Time",
    seoDescription:
      "Estimate regex match time from pattern length, backtracking risk, and input string size.",
    focusKeyword: "regex tester timer",
    formulaType: "techRegexTimer",
    description:
      "Rough-estimate regex execution cost from pattern complexity and input length.",
    formulaSummary:
      "Estimated ops ≈ input length × pattern complexity factor; catastrophic backtracking multiplies cost.",
    realWorldExample: "10K char input, complex pattern (factor 5) → ~50K comparison ops (~5 ms).",
    inputs: [
      ["inputLength", "Input string length (chars)", 10000, 10, 1000000, 100],
      ["patternLength", "Pattern length (chars)", 50, 5, 500, 5],
      ["backtrackRisk", "Backtrack risk (1=low, 5=high)", 3, 1, 5, 1],
    ],
  },
  {
    slug: "epoch-unix-timestamp-converter",
    title: "Epoch / Unix Timestamp Converter",
    category: SOFTWARE_DEV_CATEGORY,
    seoH1: "Unix Timestamp Converter — Epoch Seconds to Date Offset",
    seoDescription:
      "Convert Unix epoch seconds into human-readable date offsets and remaining time until a target.",
    focusKeyword: "unix timestamp converter",
    formulaType: "techEpochTimestamp",
    description: "Translate Unix epoch seconds into days, hours, and minutes from the Unix epoch.",
    formulaSummary: "Days since epoch = seconds ÷ 86400; hours = (seconds mod 86400) ÷ 3600.",
    realWorldExample: "1,700,000,000 seconds → ~19,675 days from Jan 1, 1970 UTC.",
    inputs: [
      ["epochSeconds", "Unix timestamp (seconds)", 1700000000, 0, 2000000000, 1],
      ["timezoneOffsetHrs", "Timezone offset (hours from UTC)", 0, -12, 14, 1],
    ],
  },
  {
    slug: "json-formatter-size-validator",
    title: "JSON Formatter & Size Validator",
    category: SOFTWARE_DEV_CATEGORY,
    seoH1: "JSON Size Calculator — Payload Weight & Minify Savings",
    seoDescription:
      "Estimate JSON payload size in bytes/KB and whitespace savings from minification.",
    focusKeyword: "json formatter size validator",
    formulaType: "techJsonSize",
    description: "Calculate JSON payload weight and minification compression ratio.",
    formulaSummary:
      "Raw bytes ≈ char count; minified ≈ raw × (1 − whitespace%); API limit headroom = limit − size.",
    realWorldExample: "50 KB JSON with 25% whitespace → ~37.5 KB minified, saves ~12.5 KB.",
    inputs: [
      ["payloadKb", "JSON payload size (KB)", 50, 0.1, 10000, 1],
      ["whitespacePct", "Whitespace (%)", 25, 0, 50, 1],
      ["apiLimitKb", "API size limit (KB)", 100, 1, 10000, 10],
    ],
  },
  {
    slug: "base64-encoder-decoder-calculator",
    title: "Base64 Encoder / Decoder Size Calculator",
    category: SOFTWARE_DEV_CATEGORY,
    seoH1: "Base64 Size Calculator — Encoding Overhead & Decoded Bytes",
    seoDescription:
      "Calculate Base64 encoded output size and overhead from raw binary input byte count.",
    focusKeyword: "base64 encoder decoder",
    formulaType: "techBase64Size",
    description: "Estimate Base64 encoded length and overhead from raw byte size.",
    formulaSummary: "Encoded bytes = ⌈raw bytes / 3⌉ × 4; overhead ≈ 33% larger than binary.",
    realWorldExample: "1 MB binary → ~1.37 MB Base64 string.",
    inputs: [
      ["rawBytes", "Raw data size (bytes)", 1048576, 1, 100000000, 1000],
      ["lineBreaks", "Line breaks every 76 chars (1=yes)", 0, 0, 1, 1],
    ],
  },
  {
    slug: "cron-job-schedule-calculator",
    title: "Cron Job Schedule Calculator",
    category: SOFTWARE_DEV_CATEGORY,
    seoH1: "Cron Expression Calculator — Runs per Day & Interval",
    seoDescription:
      "Estimate cron job execution frequency from minute, hour, and day field patterns.",
    focusKeyword: "cron job schedule calculator",
    formulaType: "techCronSchedule",
    description: "Estimate how many times a cron job runs per day, week, or month.",
    formulaSummary:
      "Daily runs = (hours active) × (minutes active per hour); monthly ≈ daily × 30.",
    realWorldExample: "Every 15 minutes, 24/7 → 96 runs/day, ~2,880/month.",
    inputs: [
      ["intervalMinutes", "Run interval (minutes)", 15, 1, 1440, 1],
      ["activeHoursPerDay", "Active hours per day", 24, 1, 24, 1],
      ["activeDaysPerWeek", "Active days per week", 7, 1, 7, 1],
    ],
  },
  {
    slug: "hex-to-rgb-color-converter",
    title: "Hex to RGB / RGBA Color Converter",
    category: SOFTWARE_DEV_CATEGORY,
    seoH1: "Hex to RGB Calculator — CSS Color Space Conversion",
    seoDescription:
      "Convert hex color codes to RGB and RGBA values for frontend CSS and design systems.",
    focusKeyword: "hex to rgb converter",
    formulaType: "techHexRgb",
    description: "Convert 24-bit hex color values to RGB channels and optional alpha.",
    formulaSummary: "R = (hex >> 16) & 255; G = (hex >> 8) & 255; B = hex & 255.",
    realWorldExample: "#FF5733 → rgb(255, 87, 51).",
    inputs: [
      ["hexValue", "Hex color (as decimal, e.g. 16734003 for #FF5733)", 16734003, 0, 16777215, 1],
      ["alphaPct", "Alpha opacity (%)", 100, 0, 100, 1],
    ],
  },
  {
    slug: "bcrypt-sha256-hash-calculator",
    title: "Bcrypt / SHA-256 Hash Cost Calculator",
    category: SOFTWARE_DEV_CATEGORY,
    seoH1: "Password Hash Cost Calculator — Bcrypt Rounds & Compute Time",
    seoDescription:
      "Estimate bcrypt hashing time and SHA-256 throughput from input size and work factor.",
    focusKeyword: "bcrypt hash calculator",
    formulaType: "techHashCost",
    description: "Estimate password hash computation time from bcrypt cost factor.",
    formulaSummary:
      "Bcrypt time ≈ 2^cost × base ms; SHA-256 ≈ linear with input bytes at ~500 MB/s.",
    realWorldExample: "Bcrypt cost 12 → ~250 ms/hash; cost 10 → ~60 ms.",
    inputs: [
      ["bcryptCost", "Bcrypt cost factor (rounds)", 12, 4, 16, 1],
      ["inputBytes", "Input size (bytes)", 32, 8, 10000, 8],
      ["hashAlgorithm", "Algorithm (0=bcrypt, 1=SHA-256)", 0, 0, 1, 1],
    ],
  },
  {
    slug: "binary-to-text-hex-calculator",
    title: "Binary to Text / Hex Calculator",
    category: SOFTWARE_DEV_CATEGORY,
    seoH1: "Binary to Hex Calculator — Byte Count & Encoding Size",
    seoDescription:
      "Convert binary bit length to byte count, hex character count, and ASCII text length.",
    focusKeyword: "binary to hex calculator",
    formulaType: "techBinaryText",
    description: "Convert between binary bit counts and byte/hex/text representations.",
    formulaSummary: "Bytes = bits ÷ 8; hex chars = bytes × 2; ASCII chars = bytes (1 byte each).",
    realWorldExample: "64 bits → 8 bytes → 16 hex characters.",
    inputs: [
      ["bitCount", "Binary length (bits)", 64, 8, 65536, 8],
      ["bitsPerChar", "Bits per character (ASCII=8)", 8, 7, 8, 1],
    ],
  },
  {
    slug: "diff-checker-text-comparison",
    title: "Diff Checker & Text Comparison",
    category: SOFTWARE_DEV_CATEGORY,
    seoH1: "Text Diff Calculator — Line Change Percentage & Similarity",
    seoDescription:
      "Estimate line-by-line text difference percentage between two document versions.",
    focusKeyword: "diff checker text comparison",
    formulaType: "techDiffChecker",
    description: "Calculate change percentage and similarity score between two text versions.",
    formulaSummary:
      "Change % = |lines changed| ÷ max(lines A, lines B) × 100; similarity = 100 − change %.",
    realWorldExample: "500 lines vs 520 lines, 30 changed → ~5.8% change, 94.2% similar.",
    inputs: [
      ["linesA", "Document A lines", 500, 1, 100000, 10],
      ["linesB", "Document B lines", 520, 1, 100000, 10],
      ["linesChanged", "Lines added/removed/changed", 30, 0, 100000, 1],
    ],
  },
  {
    slug: "ascii-code-converter",
    title: "ASCII Code Converter",
    category: SOFTWARE_DEV_CATEGORY,
    seoH1: "ASCII Code Converter — Decimal, Binary & Hex Character Map",
    seoDescription:
      "Convert ASCII character codes between decimal, binary, and hexadecimal representations.",
    focusKeyword: "ascii code converter",
    formulaType: "techAsciiCode",
    description: "Map ASCII character codes to decimal, binary, and hex formats.",
    formulaSummary: "Decimal code → binary = toString(2); hex = toString(16).",
    realWorldExample: "Character 'A' → decimal 65, binary 1000001, hex 41.",
    inputs: [
      ["asciiCode", "ASCII decimal code (0–127)", 65, 0, 127, 1],
    ],
  },

  // ——— Cloud Computing & AI Tech (10) ———
  {
    slug: "aws-pricing-tco-calculator",
    title: "AWS Pricing & TCO Calculator",
    category: CLOUD_AI_CATEGORY,
    seoH1: "AWS TCO Calculator — Monthly Cloud Hosting Cost Estimate",
    seoDescription:
      "Estimate monthly AWS costs from EC2 instances, hours, storage, and data transfer.",
    focusKeyword: "aws pricing tco calculator",
    formulaType: "techAwsTco",
    description: "Ballpark monthly AWS spend from compute, storage, and egress.",
    formulaSummary: "Monthly = (instances × $/hr × 730) + storage GB × $/GB + egress GB × $/GB.",
    realWorldExample: "2 × t3.large ($0.08/hr) + 500 GB S3 + 100 GB egress → ~$140/mo.",
    inputs: [
      ["instanceCount", "EC2 instances", 2, 1, 100, 1],
      ["hourlyRate", "Avg $/instance/hour", 0.08, 0.01, 5, 0.01],
      ["storageGb", "Storage (GB)", 500, 10, 50000, 10],
      ["storageRateGb", "Storage $/GB/mo", 0.023, 0.01, 0.1, 0.001],
      ["egressGb", "Data transfer out (GB/mo)", 100, 0, 10000, 10],
    ],
  },
  {
    slug: "azure-cloud-cost-estimator",
    title: "Azure Cloud Cost Estimator",
    category: CLOUD_AI_CATEGORY,
    seoH1: "Azure Cost Calculator — Monthly VM & Storage Estimate",
    seoDescription:
      "Estimate monthly Azure spend from virtual machines, managed disks, and bandwidth.",
    focusKeyword: "azure cloud cost estimator",
    formulaType: "techAzureCost",
    description: "Ballpark monthly Azure costs for VMs, disks, and outbound data.",
    formulaSummary: "Monthly = VMs × $/hr × 730 + disk GB × rate + bandwidth × egress rate.",
    realWorldExample: "3 B2s VMs + 1 TB disk + 200 GB egress → ~$220/mo.",
    inputs: [
      ["vmCount", "Virtual machines", 3, 1, 100, 1],
      ["vmHourlyRate", "Avg VM $/hour", 0.05, 0.01, 5, 0.01],
      ["diskGb", "Managed disk (GB)", 1000, 10, 50000, 10],
      ["egressGb", "Outbound data (GB/mo)", 200, 0, 10000, 10],
    ],
  },
  {
    slug: "gcp-pricing-calculator",
    title: "Google Cloud (GCP) Pricing Calculator",
    category: CLOUD_AI_CATEGORY,
    seoH1: "GCP Pricing Calculator — Compute Engine & Storage Cost",
    seoDescription:
      "Estimate monthly Google Cloud costs from Compute Engine instances and Cloud Storage.",
    focusKeyword: "gcp pricing calculator",
    formulaType: "techGcpCost",
    description: "Ballpark monthly GCP spend for compute and object storage.",
    formulaSummary: "Monthly = instances × $/hr × 730 + storage GB × $/GB + egress.",
    realWorldExample: "2 e2-medium + 2 TB storage → ~$95/mo before sustained-use discounts.",
    inputs: [
      ["instanceCount", "Compute instances", 2, 1, 100, 1],
      ["hourlyRate", "Avg $/instance/hour", 0.034, 0.01, 5, 0.01],
      ["storageGb", "Cloud Storage (GB)", 2000, 10, 50000, 10],
      ["egressGb", "Egress (GB/mo)", 150, 0, 10000, 10],
    ],
  },
  {
    slug: "ai-token-cost-estimator",
    title: "AI Token Cost Estimator",
    category: CLOUD_AI_CATEGORY,
    seoH1: "AI Token Cost Calculator — OpenAI & Anthropic API Pricing",
    seoDescription:
      "Calculate LLM API costs from input/output token counts and per-1K token rates.",
    focusKeyword: "ai token cost estimator",
    formulaType: "techAiTokenCost",
    description: "Estimate LLM API spend from token volume and per-1K pricing.",
    formulaSummary: "Cost = (input tokens ÷ 1000 × input rate) + (output tokens ÷ 1000 × output rate).",
    realWorldExample: "1M input + 200K output at $3/$15 per 1K → ~$6,000.",
    inputs: [
      ["inputTokens", "Input tokens (thousands)", 1000, 1, 100000, 100],
      ["outputTokens", "Output tokens (thousands)", 200, 1, 100000, 50],
      ["inputRatePer1k", "Input $/1K tokens", 3, 0.01, 50, 0.1],
      ["outputRatePer1k", "Output $/1K tokens", 15, 0.01, 100, 0.5],
    ],
  },
  {
    slug: "vector-database-storage-calculator",
    title: "Vector Database Storage Calculator",
    category: CLOUD_AI_CATEGORY,
    seoH1: "Vector DB RAM Calculator — Embedding Storage Requirements",
    seoDescription:
      "Estimate RAM and disk for vector databases from embedding count, dimensions, and precision.",
    focusKeyword: "vector database storage calculator",
    formulaType: "techVectorDbStorage",
    description: "Estimate memory for storing AI embeddings in a vector database.",
    formulaSummary: "RAM (GB) = vectors × dimensions × bytes-per-float ÷ 1e9 + index overhead (~30%).",
    realWorldExample: "1M vectors × 1536 dims × 4 bytes → ~6.1 GB raw, ~8 GB with index.",
    inputs: [
      ["vectorCount", "Embeddings (thousands)", 1000, 1, 100000, 100],
      ["dimensions", "Dimensions per vector", 1536, 64, 4096, 64],
      ["bytesPerFloat", "Bytes per value (4=float32, 2=float16)", 4, 2, 4, 1],
      ["indexOverheadPct", "Index overhead (%)", 30, 0, 100, 5],
    ],
  },
  {
    slug: "serverless-function-cost-calculator",
    title: "Serverless Function Cost Calculator",
    category: CLOUD_AI_CATEGORY,
    seoH1: "Serverless Cost Calculator — Lambda & Cloud Functions Pricing",
    seoDescription:
      "Calculate AWS Lambda or Google Cloud Functions cost per million invocations.",
    focusKeyword: "serverless function cost calculator",
    formulaType: "techServerlessCost",
    description: "Estimate serverless compute cost from invocations, duration, and memory.",
    formulaSummary:
      "Cost = invocations × request fee + (GB-seconds × duration × memory/1024 × compute rate).",
    realWorldExample: "10M invocations, 200 ms, 512 MB → ~$42/mo on Lambda.",
    inputs: [
      ["invocationsM", "Invocations (millions/mo)", 10, 0.1, 1000, 0.5],
      ["durationMs", "Avg duration (ms)", 200, 10, 30000, 10],
      ["memoryMb", "Memory (MB)", 512, 128, 10240, 128],
      ["requestCostPerM", "Request cost ($/million)", 0.2, 0.1, 1, 0.05],
    ],
  },
  {
    slug: "saas-mrr-arr-ltv-calculator",
    title: "SaaS MRR/ARR & LTV Calculator",
    category: CLOUD_AI_CATEGORY,
    seoH1: "SaaS MRR ARR LTV Calculator — Recurring Revenue Metrics",
    seoDescription:
      "Calculate Monthly Recurring Revenue, ARR, and Customer Lifetime Value from subscribers and churn.",
    focusKeyword: "saas mrr arr ltv calculator",
    formulaType: "techSaasMrrLtv",
    description: "Compute MRR, ARR, and LTV from subscriber count, ARPU, and monthly churn.",
    formulaSummary: "MRR = subscribers × ARPU; ARR = MRR × 12; LTV = ARPU ÷ churn rate.",
    realWorldExample: "500 subs × $49/mo, 3% churn → $24.5K MRR, $294K ARR, $1,633 LTV.",
    inputs: [
      ["subscribers", "Paying subscribers", 500, 1, 100000, 10],
      ["arpu", "Avg revenue per user ($/mo)", 49, 1, 1000, 1],
      ["monthlyChurnPct", "Monthly churn (%)", 3, 0.1, 20, 0.1],
    ],
  },
  {
    slug: "app-development-cost-estimator",
    title: "App Development Cost Estimator",
    category: CLOUD_AI_CATEGORY,
    seoH1: "App Development Cost Calculator — Launch Budget Estimate",
    seoDescription:
      "Estimate mobile or web app development cost from feature count, platform, and hourly rate.",
    focusKeyword: "app development cost estimator",
    formulaType: "techAppDevCost",
    description: "Ballpark app build cost from features, complexity, and developer rates.",
    formulaSummary: "Cost = features × hours/feature × hourly rate × platform multiplier.",
    realWorldExample: "15 features, 40 hrs each, $100/hr, iOS+Android (×1.6) → ~$96,000.",
    inputs: [
      ["featureCount", "Feature count", 15, 1, 100, 1],
      ["hoursPerFeature", "Hours per feature", 40, 8, 200, 4],
      ["hourlyRate", "Developer rate ($/hr)", 100, 25, 300, 5],
      ["platformMultiplier", "Platform multiplier (1=web, 1.6=native both)", 1.6, 1, 2.5, 0.1],
    ],
  },
  {
    slug: "api-rate-limit-calculator",
    title: "API Rate Limit Calculator",
    category: CLOUD_AI_CATEGORY,
    seoH1: "API Rate Limit Calculator — Throttle Threshold & Burst Capacity",
    seoDescription:
      "Calculate API request budgets, burst capacity, and per-user throttle limits.",
    focusKeyword: "api rate limit calculator",
    formulaType: "techApiRateLimit",
    description: "Plan API rate limits from requests per window and user concurrency.",
    formulaSummary:
      "Per-second rate = limit ÷ window seconds; burst tokens = rate × burst multiplier.",
    realWorldExample: "1000 req/min limit, 10× burst → ~16.7 req/s sustained, 167 burst.",
    inputs: [
      ["requestsPerWindow", "Requests allowed per window", 1000, 10, 1000000, 100],
      ["windowSeconds", "Window size (seconds)", 60, 1, 3600, 1],
      ["burstMultiplier", "Burst multiplier", 10, 1, 50, 1],
      ["activeUsers", "Concurrent users", 100, 1, 100000, 10],
    ],
  },
  {
    slug: "cloud-uptime-sla-calculator",
    title: "Cloud Uptime / SLA Downtime Calculator",
    category: CLOUD_AI_CATEGORY,
    seoH1: "SLA Downtime Calculator — 99.9% to 99.999% Allowed Outage",
    seoDescription:
      "Convert SLA uptime percentages into allowed downtime minutes per year, month, and week.",
    focusKeyword: "cloud uptime sla calculator",
    formulaType: "techCloudSlaUptime",
    description: "Translate SLA percentages like 99.9% into allowed outage minutes.",
    formulaSummary: "Downtime = (1 − SLA/100) × period minutes; 99.9% = 8.76 hrs/yr.",
    realWorldExample: "99.95% SLA → ~4.38 hours allowed downtime per year.",
    inputs: [
      ["slaPct", "SLA uptime (%)", 99.9, 90, 99.999, 0.001],
      ["periodDays", "Period (days, 365=year)", 365, 1, 365, 1],
    ],
  },

  // ——— Electronics & Hardware Engineering (10) ———
  {
    slug: "resistor-color-code-calculator",
    title: "Resistor Color Code Calculator",
    category: ELECTRONICS_HW_CATEGORY,
    seoH1: "Resistor Color Code Calculator — Band Value to Ohms",
    seoDescription:
      "Calculate resistance in ohms from 4-band color code digit and multiplier values.",
    focusKeyword: "resistor color code calculator",
    formulaType: "techResistorColor",
    description: "Decode 4-band resistor color codes into resistance in ohms.",
    formulaSummary: "R = (digit1×10 + digit2) × 10^multiplier ohms.",
    realWorldExample: "Brown-Black-Red-Gold → 1, 0, ×100 → 1,000 Ω (1 kΩ).",
    inputs: [
      ["digit1", "Band 1 digit (0–9)", 1, 0, 9, 1],
      ["digit2", "Band 2 digit (0–9)", 0, 0, 9, 1],
      ["multiplierExp", "Multiplier exponent (10^n)", 2, -2, 6, 1],
      ["tolerancePct", "Tolerance (%)", 5, 1, 20, 1],
    ],
  },
  {
    slug: "ohms-law-calculator",
    title: "Ohm's Law Calculator",
    category: ELECTRONICS_HW_CATEGORY,
    seoH1: "Ohm's Law Calculator — Voltage, Current, Resistance & Power",
    seoDescription:
      "Calculate voltage, current, resistance, and power using V = I × R and P = V × I.",
    focusKeyword: "ohms law calculator",
    formulaType: "techOhmsLaw",
    description: "Solve for voltage, current, resistance, and power in DC circuits.",
    formulaSummary: "V = I × R; P = V × I = I²R = V²/R.",
    realWorldExample: "12 V, 2 A → 6 Ω resistance, 24 W power.",
    inputs: [
      ["voltage", "Voltage (V)", 12, 0.1, 1000, 0.1],
      ["current", "Current (A)", 2, 0.001, 100, 0.01],
    ],
  },
  {
    slug: "led-resistance-calculator",
    title: "LED Resistance Calculator",
    category: ELECTRONICS_HW_CATEGORY,
    seoH1: "LED Resistor Calculator — Series Resistance for Safe Current",
    seoDescription:
      "Calculate the series resistor needed to limit LED current and prevent burnout.",
    focusKeyword: "led resistance calculator",
    formulaType: "techLedResistor",
    description: "Find the series resistor value for a given supply voltage and LED forward voltage.",
    formulaSummary: "R = (Vsupply − Vled) ÷ Iled; power dissipated = I² × R.",
    realWorldExample: "5 V supply, 2 V LED, 20 mA → 150 Ω resistor, 60 mW.",
    inputs: [
      ["supplyVoltage", "Supply voltage (V)", 5, 1, 48, 0.5],
      ["ledForwardV", "LED forward voltage (V)", 2, 1, 4, 0.1],
      ["ledCurrentMa", "LED current (mA)", 20, 1, 50, 1],
    ],
  },
  {
    slug: "voltage-divider-calculator",
    title: "Voltage Divider Calculator",
    category: ELECTRONICS_HW_CATEGORY,
    seoH1: "Voltage Divider Calculator — Output Voltage from Two Resistors",
    seoDescription:
      "Calculate output voltage from input voltage and two resistor values in a divider circuit.",
    focusKeyword: "voltage divider calculator",
    formulaType: "techVoltageDivider",
    description: "Compute output voltage in a resistive voltage divider circuit.",
    formulaSummary: "Vout = Vin × R2 ÷ (R1 + R2).",
    realWorldExample: "5 V in, R1=10 kΩ, R2=10 kΩ → 2.5 V out.",
    inputs: [
      ["vin", "Input voltage (V)", 5, 0.1, 1000, 0.1],
      ["r1", "R1 (Ω)", 10000, 1, 10000000, 100],
      ["r2", "R2 (Ω)", 10000, 1, 10000000, 100],
    ],
  },
  {
    slug: "pcb-trace-width-calculator",
    title: "PCB Trace Width Calculator",
    category: ELECTRONICS_HW_CATEGORY,
    seoH1: "PCB Trace Width Calculator — Current Capacity per IPC-2221",
    seoDescription:
      "Estimate minimum PCB trace width for a given current, copper weight, and temperature rise.",
    focusKeyword: "pcb trace width calculator",
    formulaType: "techPcbTraceWidth",
    description: "Estimate PCB trace width needed to carry a given current safely.",
    formulaSummary:
      "Width (mil) ≈ (current / (k × ΔT^0.44))^(1/0.725) where k depends on copper oz.",
    realWorldExample: "2 A, 1 oz copper, 10°C rise → ~30 mil (0.76 mm) trace width.",
    inputs: [
      ["currentA", "Current (A)", 2, 0.1, 50, 0.1],
      ["copperOz", "Copper weight (oz)", 1, 0.5, 3, 0.5],
      ["tempRiseC", "Allowed temp rise (°C)", 10, 5, 50, 1],
    ],
  },
  {
    slug: "battery-life-runtime-estimator",
    title: "Battery Life / Runtime Estimator",
    category: ELECTRONICS_HW_CATEGORY,
    seoH1: "Battery Runtime Calculator — mAh Capacity vs Load Current",
    seoDescription:
      "Estimate device runtime hours from battery milliamp-hours and average load current.",
    focusKeyword: "battery life calculator",
    formulaType: "techBatteryLife",
    description: "Calculate how many hours a battery will run at a given load current.",
    formulaSummary: "Runtime (hrs) = capacity (mAh) ÷ load (mA) × efficiency factor.",
    realWorldExample: "3000 mAh battery, 150 mA load, 85% efficiency → ~17 hours.",
    inputs: [
      ["capacityMah", "Battery capacity (mAh)", 3000, 100, 50000, 100],
      ["loadMa", "Average load (mA)", 150, 1, 5000, 10],
      ["efficiencyPct", "Efficiency (%)", 85, 50, 100, 1],
    ],
  },
  {
    slug: "capacitor-rc-time-constant-calculator",
    title: "Capacitor RC Time Constant Calculator",
    category: ELECTRONICS_HW_CATEGORY,
    seoH1: "RC Time Constant Calculator — Capacitor Charging Time",
    seoDescription:
      "Calculate RC time constant (τ) and 63%, 95%, 99% charge times for timing circuits.",
    focusKeyword: "rc time constant calculator",
    formulaType: "techCapacitorRc",
    description: "Compute RC time constant and capacitor charge times.",
    formulaSummary: "τ = R × C; 63% charge = τ; 95% ≈ 3τ; 99% ≈ 5τ.",
    realWorldExample: "10 kΩ × 100 µF → τ = 1 s; 95% charge in ~3 seconds.",
    inputs: [
      ["resistance", "Resistance (Ω)", 10000, 1, 10000000, 100],
      ["capacitanceUf", "Capacitance (µF)", 100, 0.001, 10000, 1],
    ],
  },
  {
    slug: "wire-gauge-awg-ampacity-calculator",
    title: "Wire Gauge (AWG) Ampacity Calculator",
    category: ELECTRONICS_HW_CATEGORY,
    seoH1: "AWG Wire Ampacity Calculator — Safe Current Capacity",
    seoDescription:
      "Find recommended AWG wire gauge for a given current in chassis and free-air wiring.",
    focusKeyword: "wire gauge awg ampacity calculator",
    formulaType: "techWireGaugeAmp",
    description: "Recommend copper wire gauge for a target current load.",
    formulaSummary: "AWG selected from NEC ampacity table for chassis wiring at 75°C.",
    realWorldExample: "20 A continuous load → 12 AWG copper (25 A rating).",
    inputs: [
      ["currentA", "Current (A)", 20, 1, 200, 1],
      ["wireLengthFt", "Wire length (ft)", 50, 1, 500, 1],
      ["maxVoltageDropPct", "Max voltage drop (%)", 3, 1, 10, 0.5],
    ],
  },
  {
    slug: "decibel-db-to-watt-converter",
    title: "Decibel (dB) to Watt/Volt Converter",
    category: ELECTRONICS_HW_CATEGORY,
    seoH1: "dB to Watt Calculator — Power & Voltage Ratio Conversion",
    seoDescription:
      "Convert decibel values to power ratios, watts, and voltage ratios for RF and audio.",
    focusKeyword: "decibel to watt converter",
    formulaType: "techDbToWatt",
    description: "Convert dB to power and voltage ratios relative to a reference.",
    formulaSummary: "Power ratio = 10^(dB/10); voltage ratio = 10^(dB/20); watts = ref × ratio.",
    realWorldExample: "+10 dB → 10× power; +3 dB → ~2× power.",
    inputs: [
      ["dbValue", "dB value", 10, -60, 60, 0.1],
      ["refPowerMw", "Reference power (mW)", 1, 0.001, 1000, 0.1],
      ["convertType", "Type (0=power dB, 1=voltage dB)", 0, 0, 1, 1],
    ],
  },
  {
    slug: "power-supply-psu-wattage-calculator",
    title: "Power Supply (PSU) Wattage Calculator",
    category: ELECTRONICS_HW_CATEGORY,
    seoH1: "PC PSU Wattage Calculator — Desktop Power Supply Sizing",
    seoDescription:
      "Calculate total desktop PC power draw from CPU TDP, GPU TDP, and component overhead.",
    focusKeyword: "psu wattage calculator",
    formulaType: "techPsuWattage",
    description: "Size a desktop PSU from CPU, GPU, and system component power draw.",
    formulaSummary: "Total W = CPU TDP + GPU TDP + motherboard/RAM/storage (~100 W) × headroom.",
    realWorldExample: "65 W CPU + 200 W GPU + 100 W system → 365 W; recommend 550 W PSU (50% headroom).",
    inputs: [
      ["cpuTdp", "CPU TDP (W)", 65, 15, 350, 5],
      ["gpuTdp", "GPU TDP (W)", 200, 0, 600, 10],
      ["systemOverheadW", "Other components (W)", 100, 50, 300, 10],
      ["headroomPct", "Headroom (%)", 50, 20, 100, 5],
    ],
  },

  // ——— Digital Tech & SEO Marketing (10) ———
  {
    slug: "website-page-speed-load-time-estimator",
    title: "Website Page Speed & Load Time Estimator",
    category: DIGITAL_SEO_CATEGORY,
    seoH1: "Page Speed Churn Calculator — Load Time vs Bounce Rate Impact",
    seoDescription:
      "Estimate visitor bounce rate increase and conversion loss from page load delays.",
    focusKeyword: "page speed load time estimator",
    formulaType: "techPageSpeedChurn",
    description: "Model how page load time affects bounce rate and conversion.",
    formulaSummary:
      "Bounce increase ≈ 7% per extra second over 3 s; conversion loss ≈ bounce increase × 0.5.",
    realWorldExample: "5 s load time → ~14% higher bounce vs 3 s baseline; ~7% conversion loss.",
    inputs: [
      ["loadTimeSec", "Page load time (seconds)", 5, 0.5, 30, 0.5],
      ["baselineSec", "Baseline load time (seconds)", 3, 1, 10, 0.5],
      ["monthlyVisitors", "Monthly visitors (thousands)", 100, 1, 10000, 10],
    ],
  },
  {
    slug: "seo-keyword-search-volume-roi-calculator",
    title: "SEO Keyword Search Volume & ROI Calculator",
    category: DIGITAL_SEO_CATEGORY,
    seoH1: "SEO Keyword ROI Calculator — Organic Traffic Revenue Estimate",
    seoDescription:
      "Estimate organic traffic value from search volume, CTR, conversion rate, and order value.",
    focusKeyword: "seo keyword roi calculator",
    formulaType: "techSeoKeywordRoi",
    description: "Project SEO revenue from keyword volume and conversion funnel metrics.",
    formulaSummary: "Revenue = volume × CTR × conversion rate × avg order value.",
    realWorldExample: "10K searches/mo, 5% CTR, 2% conv, $50 AOV → ~$500/mo organic revenue.",
    inputs: [
      ["monthlySearches", "Monthly search volume", 10000, 10, 1000000, 100],
      ["ctrPct", "Click-through rate (%)", 5, 0.1, 50, 0.5],
      ["conversionPct", "Conversion rate (%)", 2, 0.1, 20, 0.1],
      ["avgOrderValue", "Avg order value ($)", 50, 1, 10000, 5],
    ],
  },
  {
    slug: "cpm-cpc-ad-spend-calculator",
    title: "CPM / CPC Ad Spend Calculator",
    category: DIGITAL_SEO_CATEGORY,
    seoH1: "CPM CPC Calculator — Digital Ad Cost & Impression Budget",
    seoDescription:
      "Calculate ad spend, impressions, and clicks from CPM, CPC, and campaign budget.",
    focusKeyword: "cpm cpc ad spend calculator",
    formulaType: "techCpmCpc",
    description: "Compute impressions, clicks, and cost from CPM/CPC ad metrics.",
    formulaSummary: "Impressions = (budget ÷ CPM) × 1000; clicks = budget ÷ CPC.",
    realWorldExample: "$1,000 budget at $5 CPM → 200K impressions; at $1 CPC → 1,000 clicks.",
    inputs: [
      ["budget", "Ad budget ($)", 1000, 10, 1000000, 50],
      ["cpm", "CPM ($ per 1000 impressions)", 5, 0.5, 100, 0.5],
      ["cpc", "CPC ($ per click)", 1, 0.1, 50, 0.1],
      ["ctrPct", "CTR (%) for CPM→clicks", 1, 0.1, 10, 0.1],
    ],
  },
  {
    slug: "conversion-rate-cro-calculator",
    title: "Conversion Rate (CRO) Calculator",
    category: DIGITAL_SEO_CATEGORY,
    seoH1: "Conversion Rate Calculator — Visitors to Customers Percentage",
    seoDescription:
      "Calculate conversion rate percentage from total visitors and completed conversions.",
    focusKeyword: "conversion rate calculator",
    formulaType: "techConversionRate",
    description: "Compute CRO conversion rate and projected conversions at scale.",
    formulaSummary: "Conversion rate = (conversions ÷ visitors) × 100%.",
    realWorldExample: "10,000 visitors, 250 conversions → 2.5% conversion rate.",
    inputs: [
      ["visitors", "Total visitors", 10000, 10, 10000000, 100],
      ["conversions", "Conversions", 250, 1, 1000000, 10],
      ["avgOrderValue", "Avg order value ($)", 75, 1, 10000, 5],
    ],
  },
  {
    slug: "email-open-rate-deliverability-calculator",
    title: "Email Open Rate & Deliverability Calculator",
    category: DIGITAL_SEO_CATEGORY,
    seoH1: "Email Deliverability Calculator — Open Rate & Effective Reach",
    seoDescription:
      "Calculate effective email reach from send volume, deliverability, and open rates.",
    focusKeyword: "email open rate deliverability calculator",
    formulaType: "techEmailDeliverability",
    description: "Estimate effective email reach accounting for bounces and opens.",
    formulaSummary: "Delivered = sent × (1 − bounce%); opens = delivered × open rate.",
    realWorldExample: "50K sent, 2% bounce, 22% open → 49K delivered, ~10.8K opens.",
    inputs: [
      ["emailsSent", "Emails sent", 50000, 100, 10000000, 1000],
      ["bouncePct", "Bounce rate (%)", 2, 0, 20, 0.5],
      ["openRatePct", "Open rate (%)", 22, 1, 80, 1],
    ],
  },
  {
    slug: "social-media-engagement-rate-calculator",
    title: "Social Media Engagement Rate Tool",
    category: DIGITAL_SEO_CATEGORY,
    seoH1: "Social Media Engagement Rate Calculator — Audience Interaction",
    seoDescription:
      "Calculate engagement rate from likes, comments, shares, and follower count.",
    focusKeyword: "social media engagement rate calculator",
    formulaType: "techSocialEngagement",
    description: "Compute social media engagement rate vs follower count.",
    formulaSummary: "Engagement rate = (likes + comments + shares) ÷ followers × 100%.",
    realWorldExample: "10K followers, 400 likes, 50 comments, 30 shares → 4.8% engagement.",
    inputs: [
      ["followers", "Followers", 10000, 100, 10000000, 100],
      ["likes", "Likes", 400, 0, 1000000, 10],
      ["comments", "Comments", 50, 0, 100000, 5],
      ["shares", "Shares", 30, 0, 100000, 5],
    ],
  },
  {
    slug: "ab-testing-significance-calculator",
    title: "A/B Testing Significance Calculator",
    category: DIGITAL_SEO_CATEGORY,
    seoH1: "A/B Test Significance Calculator — Statistical Confidence",
    seoDescription:
      "Estimate A/B test statistical significance from control and variant conversion rates.",
    focusKeyword: "ab testing significance calculator",
    formulaType: "techAbTestSignificance",
    description: "Estimate whether an A/B test result is statistically significant.",
    formulaSummary:
      "Z-score from pooled proportion; significance at 95% when |Z| > 1.96.",
    realWorldExample: "Control 2.0%, variant 2.5%, 10K visitors each → ~95% confidence, significant.",
    inputs: [
      ["controlConvPct", "Control conversion (%)", 2, 0.1, 50, 0.1],
      ["variantConvPct", "Variant conversion (%)", 2.5, 0.1, 50, 0.1],
      ["samplePerVariant", "Visitors per variant", 10000, 100, 1000000, 100],
    ],
  },
  {
    slug: "video-file-size-bitrate-calculator",
    title: "Video File Size & Bitrate Calculator",
    category: DIGITAL_SEO_CATEGORY,
    seoH1: "Video File Size Calculator — Bitrate & Duration Estimate",
    seoDescription:
      "Calculate video file size from bitrate and duration for streaming bandwidth planning.",
    focusKeyword: "video file size bitrate calculator",
    formulaType: "techVideoFileSize",
    description: "Estimate video file size from bitrate and duration.",
    formulaSummary: "File size (MB) = (bitrate Mbps × duration sec) ÷ 8.",
    realWorldExample: "10 Mbps, 60 min → ~4.5 GB file.",
    inputs: [
      ["bitrateMbps", "Video bitrate (Mbps)", 10, 0.5, 100, 0.5],
      ["durationMin", "Duration (minutes)", 60, 0.1, 600, 1],
      ["audioBitrateKbps", "Audio bitrate (Kbps)", 128, 64, 320, 16],
    ],
  },
  {
    slug: "aspect-ratio-screen-resolution-calculator",
    title: "Aspect Ratio & Screen Resolution Calculator",
    category: DIGITAL_SEO_CATEGORY,
    seoH1: "Aspect Ratio Calculator — Width, Height & Resolution",
    seoDescription:
      "Calculate width, height, and pixel dimensions from aspect ratio and one known dimension.",
    focusKeyword: "aspect ratio calculator",
    formulaType: "techAspectRatio",
    description: "Compute screen dimensions from aspect ratio and width or height.",
    formulaSummary: "Height = width ÷ ratio; pixels = width × height; ratio = width ÷ height.",
    realWorldExample: "1920 px wide, 16:9 → 1080 px tall, 2.07 megapixels.",
    inputs: [
      ["widthPx", "Width (pixels)", 1920, 1, 7680, 1],
      ["ratioW", "Aspect ratio width part", 16, 1, 32, 1],
      ["ratioH", "Aspect ratio height part", 9, 1, 32, 1],
    ],
  },
  {
    slug: "roi-return-on-investment-calculator",
    title: "ROI (Return on Investment) Calculator",
    category: DIGITAL_SEO_CATEGORY,
    seoH1: "ROI Calculator — Return on Tech & Marketing Investment",
    seoDescription:
      "Calculate return on investment percentage from gain and cost for tech purchases and campaigns.",
    focusKeyword: "roi calculator",
    formulaType: "techRoiCalc",
    description: "Compute ROI percentage from investment cost and return gained.",
    formulaSummary: "ROI % = ((gain − cost) ÷ cost) × 100; payback = cost ÷ monthly gain.",
    realWorldExample: "$10K spent, $15K gained → 50% ROI.",
    inputs: [
      ["investmentCost", "Investment cost ($)", 10000, 1, 10000000, 100],
      ["gainValue", "Return / gain ($)", 15000, 0, 10000000, 100],
      ["periodMonths", "Period (months)", 12, 1, 60, 1],
    ],
  },
];
