/**
 * Tech & engineering calculators — networking, dev, cloud, hardware, SEO.
 */

import type { CalcResult } from "./types";

type Inputs = Record<string, number>;

const number = (n: number, digits = 1): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: Math.min(digits, 2),
  }).format(n);
};

const currency = (n: number, digits = 2): string => {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
};

function result(
  primaryLabel: string,
  primaryValue: string,
  secondary: { label: string; value: string }[],
  insight?: string
): CalcResult {
  return {
    primary: { label: primaryLabel, value: primaryValue, highlight: true },
    secondary,
    insight,
  };
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function cidrMask(prefix: number): string {
  const p = clamp(Math.round(prefix), 0, 32);
  const mask = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
  return [
    (mask >>> 24) & 255,
    (mask >>> 16) & 255,
    (mask >>> 8) & 255,
    mask & 255,
  ].join(".");
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return `${number(bytes / 1e12, 2)} TB`;
  if (bytes >= 1e9) return `${number(bytes / 1e9, 2)} GB`;
  if (bytes >= 1e6) return `${number(bytes / 1e6, 2)} MB`;
  if (bytes >= 1e3) return `${number(bytes / 1e3, 1)} KB`;
  return `${number(bytes, 0)} B`;
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${number(sec, 1)} sec`;
  if (sec < 3600) return `${number(sec / 60, 1)} min`;
  return `${number(sec / 3600, 2)} hrs`;
}

function ouiVendor(o1: number, o2: number, o3: number): string {
  const key = (o1 << 16) | (o2 << 8) | o3;
  if (key === 0x001a2b || (o1 === 0 && o2 <= 30)) return "Cisco Systems";
  if (o1 === 0x00 && o2 === 0x50 && o3 === 0x56) return "VMware";
  if (o1 === 0x00 && o2 === 0x0c && o3 === 0x29) return "VMware";
  if (o1 === 0x00 && o2 === 0x1b && o3 === 0x21) return "Intel";
  if (o1 === 0x00 && o2 === 0x1e && o3 === 0x67) return "Apple";
  if (o1 === 0x3c && o2 === 0x5a && o3 === 0xb4) return "Google";
  if (o1 === 0xb8 && o2 === 0x27 && o3 === 0xeb) return "Raspberry Pi";
  if (o1 === 0xdc && o2 === 0xa6 && o3 === 0x32) return "Apple";
  if (o1 === 0xf0 && o2 === 0x9f && o3 === 0xc2) return "Apple";
  if (o1 >= 0xfc && o2 >= 0xf8) return "Locally administered";
  return "Unknown vendor (check IEEE OUI registry)";
}

function suggestAwg(amps: number): string {
  const table: [number, string][] = [
    [10, "18 AWG"],
    [15, "16 AWG"],
    [20, "14 AWG"],
    [30, "12 AWG"],
    [40, "10 AWG"],
    [55, "8 AWG"],
    [70, "6 AWG"],
    [95, "4 AWG"],
    [125, "2 AWG"],
  ];
  for (const [limit, gauge] of table) {
    if (amps <= limit) return gauge;
  }
  return "1/0 AWG or larger";
}

function pcbTraceWidthMil(current: number, copperOz: number, tempRise: number): number {
  const k = copperOz >= 2 ? 0.048 : copperOz >= 1.5 ? 0.054 : copperOz >= 1 ? 0.048 : 0.024;
  const dt = Math.max(5, tempRise);
  return (current / (k * Math.pow(dt, 0.44))) ** (1 / 0.725);
}

function storageToBytes(value: number, unit: number): number {
  const gb = value * 1e9;
  const tb = value * 1e12;
  const gib = value * 1024 ** 3;
  const tib = value * 1024 ** 4;
  switch (Math.round(unit)) {
    case 0:
      return gb;
    case 1:
      return tb;
    case 2:
      return gib;
    case 3:
      return tib;
    default:
      return gb;
  }
}

function storageFromBytes(bytes: number, unit: number): number {
  switch (Math.round(unit)) {
    case 0:
      return bytes / 1e9;
    case 1:
      return bytes / 1e12;
    case 2:
      return bytes / 1024 ** 3;
    case 3:
      return bytes / 1024 ** 4;
    default:
      return bytes / 1e9;
  }
}

function storageUnitLabel(unit: number): string {
  switch (Math.round(unit)) {
    case 0:
      return "GB";
    case 1:
      return "TB";
    case 2:
      return "GiB";
    case 3:
      return "TiB";
    default:
      return "GB";
  }
}

export const TECH_FORMULA_TYPES = [
  "techSubnetCalc",
  "techIpCidrCalc",
  "techIpv4ToIpv6",
  "techPingLatencyCost",
  "techDnsPropagation",
  "techMacVendorLookup",
  "techRaidCalc",
  "techBandwidthDownload",
  "techStorageUnitConvert",
  "techFiberSignalLoss",
  "techRegexTimer",
  "techEpochTimestamp",
  "techJsonSize",
  "techBase64Size",
  "techCronSchedule",
  "techHexRgb",
  "techHashCost",
  "techBinaryText",
  "techDiffChecker",
  "techAsciiCode",
  "techAwsTco",
  "techAzureCost",
  "techGcpCost",
  "techAiTokenCost",
  "techVectorDbStorage",
  "techServerlessCost",
  "techSaasMrrLtv",
  "techAppDevCost",
  "techApiRateLimit",
  "techCloudSlaUptime",
  "techResistorColor",
  "techOhmsLaw",
  "techLedResistor",
  "techVoltageDivider",
  "techPcbTraceWidth",
  "techBatteryLife",
  "techCapacitorRc",
  "techWireGaugeAmp",
  "techDbToWatt",
  "techPsuWattage",
  "techPageSpeedChurn",
  "techSeoKeywordRoi",
  "techCpmCpc",
  "techConversionRate",
  "techEmailDeliverability",
  "techSocialEngagement",
  "techAbTestSignificance",
  "techVideoFileSize",
  "techAspectRatio",
  "techRoiCalc",
] as const;

export type TechFormulaType = (typeof TECH_FORMULA_TYPES)[number];

const TECH_SET = new Set<string>(TECH_FORMULA_TYPES);

export function isTechFormulaType(formulaType: string): boolean {
  return TECH_SET.has(formulaType);
}

export function runTechCalculation(
  formulaType: string,
  inputs: Inputs
): CalcResult | null {
  if (!isTechFormulaType(formulaType)) return null;

  switch (formulaType) {
    case "techSubnetCalc": {
      const prefix = clamp(Math.round(inputs.cidrPrefix), 8, 30);
      const subnetsNeeded = Math.max(1, Math.round(inputs.subnetsNeeded));
      const totalAddrs = 2 ** (32 - prefix);
      const usable = Math.max(0, totalAddrs - 2);
      const bitsForSubnets = Math.ceil(Math.log2(subnetsNeeded));
      const newPrefix = Math.min(30, prefix + bitsForSubnets);
      return result("Usable hosts", number(usable, 0), [
        { label: "Subnet mask", value: cidrMask(prefix) },
        { label: "Total addresses", value: number(totalAddrs, 0) },
        { label: "CIDR", value: `/${prefix}` },
        {
          label: "Subnets (if split)",
          value: `/${newPrefix} (${2 ** bitsForSubnets} subnets)`,
        },
      ]);
    }

    case "techIpCidrCalc": {
      const hosts = Math.max(2, Math.round(inputs.hostsNeeded));
      const reserve = inputs.reserveBroadcast >= 0.5;
      const needed = reserve ? hosts + 2 : hosts;
      const prefix = 32 - Math.ceil(Math.log2(needed));
      const blockSize = 2 ** (32 - prefix);
      const usable = reserve ? blockSize - 2 : blockSize;
      return result("CIDR prefix", `/${prefix}`, [
        { label: "Block size", value: number(blockSize, 0) },
        { label: "Usable hosts", value: number(usable, 0) },
        { label: "Subnet mask", value: cidrMask(prefix) },
      ]);
    }

    case "techIpv4ToIpv6": {
      const o1 = clamp(Math.round(inputs.octet1), 0, 255);
      const o2 = clamp(Math.round(inputs.octet2), 0, 255);
      const o3 = clamp(Math.round(inputs.octet3), 0, 255);
      const o4 = clamp(Math.round(inputs.octet4), 0, 255);
      const mapped = `::ffff:${o1}.${o2}.${o3}.${o4}`;
      const hex = [
        ((o1 << 8) | o2).toString(16).padStart(4, "0"),
        ((o3 << 8) | o4).toString(16).padStart(4, "0"),
      ].join(":");
      return result("IPv4-mapped IPv6", mapped, [
        { label: "IPv4 address", value: `${o1}.${o2}.${o3}.${o4}` },
        { label: "Compressed hex", value: `::ffff:${hex}` },
        { label: "Format", value: "RFC 4291 mapped" },
      ]);
    }

    case "techPingLatencyCost": {
      const linkMbps = Math.max(1, inputs.linkMbps);
      const rttMs = Math.max(1, inputs.rttMs);
      const lossPct = clamp(inputs.packetLossPct, 0, 10);
      const fileMb = Math.max(1, inputs.fileSizeMb);
      const lossFactor = Math.sqrt(Math.max(0, 1 - lossPct / 100));
      const effectiveMbps = linkMbps * lossFactor * Math.min(1, 100 / rttMs);
      const transferSec = (fileMb * 8) / Math.max(0.1, effectiveMbps);
      return result("Transfer time", formatDuration(transferSec), [
        { label: "Effective throughput", value: `${number(effectiveMbps, 1)} Mbps` },
        { label: "RTT", value: `${number(rttMs, 0)} ms` },
        { label: "Packet loss", value: `${number(lossPct, 1)}%` },
        { label: "File size", value: `${number(fileMb, 0)} MB` },
      ]);
    }

    case "techDnsPropagation": {
      const oldTtl = Math.max(60, inputs.oldTtlSec);
      const newTtl = Math.max(60, inputs.newTtlSec);
      const refreshed = clamp(inputs.resolverPct, 10, 100);
      const maxSec = oldTtl + newTtl;
      const typicalSec = maxSec * (refreshed / 100) * 0.7;
      return result("Max propagation", formatDuration(maxSec), [
        { label: "Typical visibility", value: formatDuration(typicalSec) },
        { label: "Old TTL", value: formatDuration(oldTtl) },
        { label: "New TTL", value: formatDuration(newTtl) },
        { label: "Resolvers refreshed", value: `${number(refreshed, 0)}%` },
      ]);
    }

    case "techMacVendorLookup": {
      const o1 = clamp(Math.round(inputs.oui1), 0, 255);
      const o2 = clamp(Math.round(inputs.oui2), 0, 255);
      const o3 = clamp(Math.round(inputs.oui3), 0, 255);
      const vendor = ouiVendor(o1, o2, o3);
      const mac = [o1, o2, o3]
        .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
        .join(":");
      return result("Likely vendor", vendor, [
        { label: "OUI prefix", value: `${mac}:XX:XX:XX` },
        {
          label: "OUI decimal",
          value: number((o1 << 16) | (o2 << 8) | o3, 0),
        },
        { label: "Note", value: "Verify at ieee.org/regauth/oui" },
      ]);
    }

    case "techRaidCalc": {
      const n = Math.max(2, Math.round(inputs.driveCount));
      const capTb = Math.max(0.5, inputs.driveSizeTb);
      const level = Math.round(inputs.raidLevel);
      let usable = 0;
      let faultTol = 0;
      let readMult = 1;
      let writeMult = 1;
      if (level === 0) {
        usable = n * capTb;
        faultTol = 0;
        readMult = n;
        writeMult = n;
      } else if (level === 1) {
        usable = capTb;
        faultTol = n - 1;
        readMult = n;
        writeMult = 1;
      } else if (level === 5) {
        usable = (n - 1) * capTb;
        faultTol = 1;
        readMult = n - 1;
        writeMult = 1;
      } else if (level === 10) {
        usable = (n / 2) * capTb;
        faultTol = Math.floor(n / 2);
        readMult = n / 2;
        writeMult = n / 4;
      } else {
        usable = capTb;
        faultTol = 0;
      }
      return result("Usable capacity", `${number(usable, 1)} TB`, [
        { label: "RAID level", value: `RAID ${level}` },
        { label: "Drive fault tolerance", value: `${faultTol} drive(s)` },
        { label: "Read speed factor", value: `~${number(readMult, 1)}×` },
        { label: "Write speed factor", value: `~${number(writeMult, 1)}×` },
      ]);
    }

    case "techBandwidthDownload": {
      const fileMb = Math.max(1, inputs.fileSizeMb);
      const speedMbps = Math.max(1, inputs.speedMbps);
      const overhead = clamp(inputs.overheadPct, 0, 30);
      const effectiveMbps = speedMbps * (1 - overhead / 100);
      const sec = (fileMb * 8) / effectiveMbps;
      return result("Download time", formatDuration(sec), [
        { label: "Effective speed", value: `${number(effectiveMbps, 1)} Mbps` },
        { label: "File size", value: `${number(fileMb, 0)} MB` },
        { label: "Overhead", value: `${number(overhead, 0)}%` },
      ]);
    }

    case "techStorageUnitConvert": {
      const value = Math.max(0.001, inputs.value);
      const from = Math.round(inputs.fromUnit);
      const to = Math.round(inputs.toUnit);
      const bytes = storageToBytes(value, from);
      const converted = storageFromBytes(bytes, to);
      return result("Converted value", `${number(converted, 4)} ${storageUnitLabel(to)}`, [
        { label: "Input", value: `${number(value, 4)} ${storageUnitLabel(from)}` },
        { label: "Bytes", value: formatBytes(bytes) },
        {
          label: "Binary vs decimal",
          value:
            from <= 1 && to >= 2
              ? "Decimal → Binary (÷1.074)"
              : from >= 2 && to <= 1
                ? "Binary → Decimal (×1.074)"
                : "Same system",
        },
      ]);
    }

    case "techFiberSignalLoss": {
      const km = Math.max(0.1, inputs.lengthKm);
      const atten = Math.max(0.1, inputs.attenuationDbKm);
      const splices = Math.max(0, Math.round(inputs.spliceCount));
      const spliceLoss = Math.max(0.05, inputs.spliceLossDb);
      const connectors = Math.max(0, Math.round(inputs.connectorCount));
      const connLoss = Math.max(0.1, inputs.connectorLossDb);
      const cableLoss = atten * km;
      const total = cableLoss + splices * spliceLoss + connectors * connLoss;
      return result("Total loss", `${number(total, 2)} dB`, [
        { label: "Cable loss", value: `${number(cableLoss, 2)} dB` },
        { label: "Splice loss", value: `${number(splices * spliceLoss, 2)} dB` },
        { label: "Connector loss", value: `${number(connectors * connLoss, 2)} dB` },
        { label: "Length", value: `${number(km, 1)} km` },
      ]);
    }

    case "techRegexTimer": {
      const inputLen = Math.max(10, Math.round(inputs.inputLength));
      const patLen = Math.max(5, Math.round(inputs.patternLength));
      const risk = clamp(Math.round(inputs.backtrackRisk), 1, 5);
      const ops = inputLen * patLen * risk * (risk >= 4 ? 10 : 1);
      const estMs = ops / 10000;
      return result("Estimated match time", `${number(estMs, 2)} ms`, [
        { label: "Comparison ops", value: number(ops, 0) },
        { label: "Input length", value: number(inputLen, 0) },
        { label: "Pattern length", value: number(patLen, 0) },
        {
          label: "Backtrack risk",
          value: risk >= 4 ? "High — simplify pattern" : risk >= 3 ? "Moderate" : "Low",
        },
      ]);
    }

    case "techEpochTimestamp": {
      const sec = Math.max(0, Math.round(inputs.epochSeconds));
      const tz = clamp(inputs.timezoneOffsetHrs, -12, 14);
      const days = sec / 86400;
      const hours = (sec % 86400) / 3600;
      const date = new Date((sec + tz * 3600) * 1000);
      const iso = date.toISOString().replace("T", " ").slice(0, 19);
      return result("Days since epoch", number(days, 2), [
        { label: "UTC datetime", value: iso },
        { label: "Hours into day", value: number(hours, 1) },
        { label: "Timezone offset", value: `UTC${tz >= 0 ? "+" : ""}${tz}` },
      ]);
    }

    case "techJsonSize": {
      const kb = Math.max(0.1, inputs.payloadKb);
      const ws = clamp(inputs.whitespacePct, 0, 50);
      const minKb = kb * (1 - ws / 100);
      const saved = kb - minKb;
      const limit = Math.max(1, inputs.apiLimitKb);
      const headroom = limit - kb;
      return result("Minified size", `${number(minKb, 1)} KB`, [
        { label: "Raw size", value: `${number(kb, 1)} KB` },
        { label: "Whitespace saved", value: `${number(saved, 1)} KB` },
        {
          label: "API limit headroom",
          value: headroom >= 0 ? `${number(headroom, 1)} KB` : "Over limit!",
        },
      ]);
    }

    case "techBase64Size": {
      const raw = Math.max(1, Math.round(inputs.rawBytes));
      const lineBreaks = inputs.lineBreaks >= 0.5;
      const encoded = Math.ceil(raw / 3) * 4;
      const overhead = ((encoded - raw) / raw) * 100;
      const withBreaks = lineBreaks ? encoded + Math.floor(encoded / 76) * 2 : encoded;
      return result("Encoded size", formatBytes(withBreaks), [
        { label: "Raw size", value: formatBytes(raw) },
        { label: "Overhead", value: `${number(overhead, 1)}%` },
        { label: "Encoded chars", value: number(withBreaks, 0) },
      ]);
    }

    case "techCronSchedule": {
      const interval = Math.max(1, Math.round(inputs.intervalMinutes));
      const hours = clamp(Math.round(inputs.activeHoursPerDay), 1, 24);
      const days = clamp(Math.round(inputs.activeDaysPerWeek), 1, 7);
      const runsPerDay = Math.floor((hours * 60) / interval);
      const runsPerWeek = runsPerDay * days;
      const runsPerMonth = runsPerWeek * 4.33;
      return result("Runs per day", number(runsPerDay, 0), [
        { label: "Runs per week", value: number(runsPerWeek, 0) },
        { label: "Runs per month", value: number(runsPerMonth, 0) },
        { label: "Interval", value: `Every ${interval} min` },
      ]);
    }

    case "techHexRgb": {
      const hex = clamp(Math.round(inputs.hexValue), 0, 16777215);
      const alpha = clamp(inputs.alphaPct, 0, 100) / 100;
      const r = (hex >> 16) & 255;
      const g = (hex >> 8) & 255;
      const b = hex & 255;
      const hexStr = `#${hex.toString(16).padStart(6, "0").toUpperCase()}`;
      const css =
        alpha < 1
          ? `rgba(${r}, ${g}, ${b}, ${number(alpha, 2)})`
          : `rgb(${r}, ${g}, ${b})`;
      return result("CSS color", css, [
        { label: "Hex", value: hexStr },
        { label: "R", value: String(r) },
        { label: "G", value: String(g) },
        { label: "B", value: String(b) },
      ]);
    }

    case "techHashCost": {
      const cost = clamp(Math.round(inputs.bcryptCost), 4, 16);
      const bytes = Math.max(8, Math.round(inputs.inputBytes));
      const algo = Math.round(inputs.hashAlgorithm);
      if (algo === 1) {
        const throughputMbps = 500;
        const ms = (bytes / (throughputMbps * 1e6 / 8)) * 1000;
        return result("SHA-256 time", `${number(ms, 3)} ms`, [
          { label: "Input size", value: formatBytes(bytes) },
          { label: "Throughput", value: `~${throughputMbps} MB/s` },
        ]);
      }
      const baseMs = 0.25;
      const ms = baseMs * 2 ** cost;
      const hashesPerSec = 1000 / ms;
      return result("Bcrypt hash time", `${number(ms, 0)} ms`, [
        { label: "Cost factor", value: String(cost) },
        { label: "Hashes per second", value: number(hashesPerSec, 1) },
        { label: "Input size", value: formatBytes(bytes) },
      ]);
    }

    case "techBinaryText": {
      const bits = Math.max(8, Math.round(inputs.bitCount));
      const bpc = clamp(Math.round(inputs.bitsPerChar), 7, 8);
      const bytes = bits / 8;
      const hexChars = bytes * 2;
      const chars = Math.floor(bits / bpc);
      return result("Byte count", number(bytes, 0), [
        { label: "Hex characters", value: number(hexChars, 0) },
        { label: "ASCII characters", value: number(chars, 0) },
        { label: "Bits", value: number(bits, 0) },
      ]);
    }

    case "techDiffChecker": {
      const a = Math.max(1, Math.round(inputs.linesA));
      const b = Math.max(1, Math.round(inputs.linesB));
      const changed = Math.max(0, Math.round(inputs.linesChanged));
      const maxLines = Math.max(a, b);
      const changePct = (changed / maxLines) * 100;
      const similarity = 100 - changePct;
      return result("Change rate", `${number(changePct, 1)}%`, [
        { label: "Similarity", value: `${number(similarity, 1)}%` },
        { label: "Lines changed", value: number(changed, 0) },
        { label: "Document A", value: `${number(a, 0)} lines` },
        { label: "Document B", value: `${number(b, 0)} lines` },
      ]);
    }

    case "techAsciiCode": {
      const code = clamp(Math.round(inputs.asciiCode), 0, 127);
      const char = code >= 32 && code <= 126 ? String.fromCharCode(code) : "(non-printable)";
      const binary = code.toString(2).padStart(8, "0");
      const hex = code.toString(16).toUpperCase().padStart(2, "0");
      return result("Character", char, [
        { label: "Decimal", value: String(code) },
        { label: "Binary", value: binary },
        { label: "Hex", value: `0x${hex}` },
      ]);
    }

    case "techAwsTco": {
      const instances = Math.max(1, Math.round(inputs.instanceCount));
      const hourly = Math.max(0.01, inputs.hourlyRate);
      const storage = Math.max(0, inputs.storageGb);
      const storageRate = Math.max(0.01, inputs.storageRateGb);
      const egress = Math.max(0, inputs.egressGb);
      const compute = instances * hourly * 730;
      const storageCost = storage * storageRate;
      const egressCost = egress * 0.09;
      const total = compute + storageCost + egressCost;
      return result("Monthly AWS cost", currency(total), [
        { label: "Compute", value: currency(compute) },
        { label: "Storage", value: currency(storageCost) },
        { label: "Egress", value: currency(egressCost) },
      ]);
    }

    case "techAzureCost": {
      const vms = Math.max(1, Math.round(inputs.vmCount));
      const hourly = Math.max(0.01, inputs.vmHourlyRate);
      const disk = Math.max(0, inputs.diskGb);
      const egress = Math.max(0, inputs.egressGb);
      const compute = vms * hourly * 730;
      const diskCost = disk * 0.05;
      const egressCost = egress * 0.087;
      const total = compute + diskCost + egressCost;
      return result("Monthly Azure cost", currency(total), [
        { label: "VM compute", value: currency(compute) },
        { label: "Managed disks", value: currency(diskCost) },
        { label: "Egress", value: currency(egressCost) },
      ]);
    }

    case "techGcpCost": {
      const instances = Math.max(1, Math.round(inputs.instanceCount));
      const hourly = Math.max(0.01, inputs.hourlyRate);
      const storage = Math.max(0, inputs.storageGb);
      const egress = Math.max(0, inputs.egressGb);
      const compute = instances * hourly * 730;
      const storageCost = storage * 0.02;
      const egressCost = egress * 0.12;
      const total = compute + storageCost + egressCost;
      return result("Monthly GCP cost", currency(total), [
        { label: "Compute Engine", value: currency(compute) },
        { label: "Cloud Storage", value: currency(storageCost) },
        { label: "Egress", value: currency(egressCost) },
      ]);
    }

    case "techAiTokenCost": {
      const inputK = Math.max(1, inputs.inputTokens);
      const outputK = Math.max(1, inputs.outputTokens);
      const inputRate = Math.max(0.01, inputs.inputRatePer1k);
      const outputRate = Math.max(0.01, inputs.outputRatePer1k);
      const inputCost = inputK * inputRate;
      const outputCost = outputK * outputRate;
      const total = inputCost + outputCost;
      return result("Total API cost", currency(total), [
        { label: "Input cost", value: currency(inputCost) },
        { label: "Output cost", value: currency(outputCost) },
        { label: "Input tokens", value: `${number(inputK, 0)}K` },
        { label: "Output tokens", value: `${number(outputK, 0)}K` },
      ]);
    }

    case "techVectorDbStorage": {
      const count = Math.max(1, inputs.vectorCount) * 1000;
      const dims = Math.max(64, Math.round(inputs.dimensions));
      const bpf = clamp(Math.round(inputs.bytesPerFloat), 2, 4);
      const overhead = clamp(inputs.indexOverheadPct, 0, 100);
      const rawGb = (count * dims * bpf) / 1e9;
      const totalGb = rawGb * (1 + overhead / 100);
      return result("RAM required", `${number(totalGb, 2)} GB`, [
        { label: "Raw vector data", value: `${number(rawGb, 2)} GB` },
        { label: "Vectors", value: number(count, 0) },
        { label: "Dimensions", value: number(dims, 0) },
        { label: "Index overhead", value: `${number(overhead, 0)}%` },
      ]);
    }

    case "techServerlessCost": {
      const invM = Math.max(0.1, inputs.invocationsM);
      const durMs = Math.max(10, inputs.durationMs);
      const memMb = Math.max(128, inputs.memoryMb);
      const reqCost = Math.max(0.1, inputs.requestCostPerM);
      const invocations = invM * 1e6;
      const requestTotal = invM * reqCost;
      const gbSec = (invocations * durMs / 1000) * (memMb / 1024);
      const computeTotal = gbSec * 0.0000166667;
      const total = requestTotal + computeTotal;
      return result("Monthly serverless cost", currency(total), [
        { label: "Request charges", value: currency(requestTotal) },
        { label: "Compute (GB-s)", value: currency(computeTotal) },
        { label: "GB-seconds", value: number(gbSec, 0) },
      ]);
    }

    case "techSaasMrrLtv": {
      const subs = Math.max(1, Math.round(inputs.subscribers));
      const arpu = Math.max(1, inputs.arpu);
      const churn = clamp(inputs.monthlyChurnPct, 0.1, 20);
      const mrr = subs * arpu;
      const arr = mrr * 12;
      const ltv = arpu / (churn / 100);
      return result("MRR", currency(mrr), [
        { label: "ARR", value: currency(arr) },
        { label: "LTV per customer", value: currency(ltv) },
        { label: "Subscribers", value: number(subs, 0) },
        { label: "Monthly churn", value: `${number(churn, 1)}%` },
      ]);
    }

    case "techAppDevCost": {
      const features = Math.max(1, Math.round(inputs.featureCount));
      const hrs = Math.max(8, inputs.hoursPerFeature);
      const rate = Math.max(25, inputs.hourlyRate);
      const mult = clamp(inputs.platformMultiplier, 1, 2.5);
      const total = features * hrs * rate * mult;
      return result("Estimated dev cost", currency(total), [
        { label: "Features", value: number(features, 0) },
        { label: "Total hours", value: number(features * hrs, 0) },
        { label: "Platform multiplier", value: `${number(mult, 1)}×` },
        { label: "Hourly rate", value: currency(rate) },
      ]);
    }

    case "techApiRateLimit": {
      const limit = Math.max(10, Math.round(inputs.requestsPerWindow));
      const window = Math.max(1, Math.round(inputs.windowSeconds));
      const burst = Math.max(1, Math.round(inputs.burstMultiplier));
      const users = Math.max(1, Math.round(inputs.activeUsers));
      const perSec = limit / window;
      const burstCap = perSec * burst;
      const perUser = limit / users;
      return result("Sustained rate", `${number(perSec, 1)} req/s`, [
        { label: "Burst capacity", value: `${number(burstCap, 0)} req/s` },
        { label: "Per user (window)", value: number(perUser, 1) },
        { label: "Window", value: `${window} sec` },
      ]);
    }

    case "techCloudSlaUptime": {
      const sla = clamp(inputs.slaPct, 90, 99.999);
      const days = Math.max(1, Math.round(inputs.periodDays));
      const totalMin = days * 24 * 60;
      const downtimeMin = totalMin * (1 - sla / 100);
      const uptimeMin = totalMin - downtimeMin;
      return result("Allowed downtime", formatDuration(downtimeMin * 60), [
        { label: "SLA", value: `${number(sla, 3)}%` },
        { label: "Uptime", value: formatDuration(uptimeMin * 60) },
        { label: "Period", value: `${days} days` },
      ]);
    }

    case "techResistorColor": {
      const d1 = clamp(Math.round(inputs.digit1), 0, 9);
      const d2 = clamp(Math.round(inputs.digit2), 0, 9);
      const exp = clamp(Math.round(inputs.multiplierExp), -2, 6);
      const tol = clamp(inputs.tolerancePct, 1, 20);
      const ohms = (d1 * 10 + d2) * 10 ** exp;
      const label =
        ohms >= 1e6
          ? `${number(ohms / 1e6, 2)} MΩ`
          : ohms >= 1e3
            ? `${number(ohms / 1e3, 2)} kΩ`
            : `${number(ohms, 0)} Ω`;
      return result("Resistance", label, [
        { label: "Ohms", value: number(ohms, 0) },
        { label: "Tolerance", value: `±${number(tol, 0)}%` },
        { label: "Bands", value: `${d1}-${d2} ×10^${exp}` },
      ]);
    }

    case "techOhmsLaw": {
      const v = Math.max(0.1, inputs.voltage);
      const i = Math.max(0.001, inputs.current);
      const r = v / i;
      const p = v * i;
      return result("Resistance", `${number(r, 2)} Ω`, [
        { label: "Power", value: `${number(p, 2)} W` },
        { label: "Voltage", value: `${number(v, 2)} V` },
        { label: "Current", value: `${number(i, 3)} A` },
      ]);
    }

    case "techLedResistor": {
      const vs = Math.max(1, inputs.supplyVoltage);
      const vf = clamp(inputs.ledForwardV, 1, 4);
      const ma = Math.max(1, inputs.ledCurrentMa);
      const i = ma / 1000;
      const r = (vs - vf) / i;
      const p = i * i * r;
      const stdR = [150, 180, 220, 270, 330, 470, 560, 680, 1000].find((x) => x >= r) ?? Math.ceil(r);
      return result("Resistor value", `${stdR} Ω`, [
        { label: "Calculated", value: `${number(r, 0)} Ω` },
        { label: "Power dissipation", value: `${number(p * 1000, 1)} mW` },
        { label: "LED current", value: `${number(ma, 0)} mA` },
      ]);
    }

    case "techVoltageDivider": {
      const vin = Math.max(0.1, inputs.vin);
      const r1 = Math.max(1, inputs.r1);
      const r2 = Math.max(1, inputs.r2);
      const vout = vin * (r2 / (r1 + r2));
      const ratio = r2 / (r1 + r2);
      return result("Output voltage", `${number(vout, 3)} V`, [
        { label: "Divider ratio", value: number(ratio, 4) },
        { label: "Input", value: `${number(vin, 2)} V` },
        { label: "R1 / R2", value: `${number(r1, 0)} / ${number(r2, 0)} Ω` },
      ]);
    }

    case "techPcbTraceWidth": {
      const current = Math.max(0.1, inputs.currentA);
      const oz = Math.max(0.5, inputs.copperOz);
      const rise = Math.max(5, inputs.tempRiseC);
      const widthMil = pcbTraceWidthMil(current, oz, rise);
      const widthMm = widthMil * 0.0254;
      return result("Min trace width", `${number(widthMil, 1)} mil`, [
        { label: "Millimeters", value: `${number(widthMm, 2)} mm` },
        { label: "Current", value: `${number(current, 1)} A` },
        { label: "Copper", value: `${number(oz, 1)} oz` },
        { label: "Temp rise", value: `${number(rise, 0)} °C` },
      ]);
    }

    case "techBatteryLife": {
      const cap = Math.max(100, inputs.capacityMah);
      const load = Math.max(1, inputs.loadMa);
      const eff = clamp(inputs.efficiencyPct, 50, 100);
      const hrs = (cap / load) * (eff / 100);
      return result("Runtime", `${number(hrs, 1)} hours`, [
        { label: "Capacity", value: `${number(cap, 0)} mAh` },
        { label: "Load", value: `${number(load, 0)} mA` },
        { label: "Efficiency", value: `${number(eff, 0)}%` },
      ]);
    }

    case "techCapacitorRc": {
      const r = Math.max(1, inputs.resistance);
      const cUf = Math.max(0.001, inputs.capacitanceUf);
      const c = cUf * 1e-6;
      const tau = r * c;
      return result("Time constant τ", `${number(tau, 3)} sec`, [
        { label: "63% charge", value: formatDuration(tau) },
        { label: "95% charge", value: formatDuration(tau * 3) },
        { label: "99% charge", value: formatDuration(tau * 5) },
      ]);
    }

    case "techWireGaugeAmp": {
      const amps = Math.max(1, inputs.currentA);
      const len = Math.max(1, inputs.wireLengthFt);
      const dropPct = clamp(inputs.maxVoltageDropPct, 1, 10);
      const gauge = suggestAwg(amps);
      const awgNum = parseInt(gauge, 10) || 12;
      const resistancePerFt = awgNum <= 10 ? 0.001 : awgNum <= 14 ? 0.0025 : 0.004;
      const dropV = amps * resistancePerFt * len * 2;
      return result("Recommended gauge", gauge, [
        { label: "Current", value: `${number(amps, 0)} A` },
        { label: "Est. voltage drop", value: `${number(dropV, 2)} V` },
        { label: "Wire length", value: `${number(len, 0)} ft (round trip)` },
        { label: "Max drop target", value: `${number(dropPct, 1)}%` },
      ]);
    }

    case "techDbToWatt": {
      const db = inputs.dbValue;
      const refMw = Math.max(0.001, inputs.refPowerMw);
      const isVoltage = Math.round(inputs.convertType) === 1;
      const ratio = isVoltage ? 10 ** (db / 20) : 10 ** (db / 10);
      const powerMw = isVoltage ? refMw * ratio * ratio : refMw * ratio;
      return result(isVoltage ? "Voltage ratio" : "Power ratio", `${number(ratio, 3)}×`, [
        { label: "Output power", value: `${number(powerMw, 3)} mW` },
        { label: "dB value", value: `${number(db, 1)} dB` },
        { label: "Reference", value: `${number(refMw, 3)} mW` },
      ]);
    }

    case "techPsuWattage": {
      const cpu = Math.max(15, inputs.cpuTdp);
      const gpu = Math.max(0, inputs.gpuTdp);
      const sys = Math.max(50, inputs.systemOverheadW);
      const headroom = clamp(inputs.headroomPct, 20, 100);
      const draw = cpu + gpu + sys;
      const recommended = draw * (1 + headroom / 100);
      const rounded = Math.ceil(recommended / 50) * 50;
      return result("Recommended PSU", `${rounded} W`, [
        { label: "Estimated draw", value: `${number(draw, 0)} W` },
        { label: "Headroom", value: `${number(headroom, 0)}%` },
        { label: "CPU TDP", value: `${number(cpu, 0)} W` },
        { label: "GPU TDP", value: `${number(gpu, 0)} W` },
      ]);
    }

    case "techPageSpeedChurn": {
      const load = Math.max(0.5, inputs.loadTimeSec);
      const baseline = Math.max(1, inputs.baselineSec);
      const visitors = Math.max(1, inputs.monthlyVisitors) * 1000;
      const extraSec = Math.max(0, load - baseline);
      const bounceIncrease = extraSec * 7;
      const convLoss = bounceIncrease * 0.5;
      const lostVisitors = visitors * (bounceIncrease / 100);
      return result("Bounce increase", `+${number(bounceIncrease, 1)}%`, [
        { label: "Conversion loss (est.)", value: `~${number(convLoss, 1)}%` },
        { label: "Extra load time", value: `${number(extraSec, 1)} sec` },
        { label: "Lost visitors/mo", value: number(lostVisitors, 0) },
      ]);
    }

    case "techSeoKeywordRoi": {
      const vol = Math.max(10, inputs.monthlySearches);
      const ctr = clamp(inputs.ctrPct, 0.1, 50);
      const conv = clamp(inputs.conversionPct, 0.1, 20);
      const aov = Math.max(1, inputs.avgOrderValue);
      const clicks = vol * (ctr / 100);
      const conversions = clicks * (conv / 100);
      const revenue = conversions * aov;
      return result("Monthly organic revenue", currency(revenue), [
        { label: "Clicks", value: number(clicks, 0) },
        { label: "Conversions", value: number(conversions, 1) },
        { label: "Search volume", value: number(vol, 0) },
      ]);
    }

    case "techCpmCpc": {
      const budget = Math.max(10, inputs.budget);
      const cpm = Math.max(0.5, inputs.cpm);
      const cpc = Math.max(0.1, inputs.cpc);
      const ctr = clamp(inputs.ctrPct, 0.1, 10);
      const impressions = (budget / cpm) * 1000;
      const clicksFromCpc = budget / cpc;
      const clicksFromCpm = impressions * (ctr / 100);
      return result("Impressions (CPM)", number(impressions, 0), [
        { label: "Clicks (CPC budget)", value: number(clicksFromCpc, 0) },
        { label: "Clicks (CPM × CTR)", value: number(clicksFromCpm, 0) },
        { label: "Budget", value: currency(budget) },
      ]);
    }

    case "techConversionRate": {
      const visitors = Math.max(10, Math.round(inputs.visitors));
      const conv = Math.max(1, Math.round(inputs.conversions));
      const aov = Math.max(1, inputs.avgOrderValue);
      const rate = (conv / visitors) * 100;
      const revenue = conv * aov;
      return result("Conversion rate", `${number(rate, 2)}%`, [
        { label: "Revenue", value: currency(revenue) },
        { label: "Conversions", value: number(conv, 0) },
        { label: "Visitors", value: number(visitors, 0) },
      ]);
    }

    case "techEmailDeliverability": {
      const sent = Math.max(100, Math.round(inputs.emailsSent));
      const bounce = clamp(inputs.bouncePct, 0, 20);
      const open = clamp(inputs.openRatePct, 1, 80);
      const delivered = sent * (1 - bounce / 100);
      const opens = delivered * (open / 100);
      return result("Opens", number(opens, 0), [
        { label: "Delivered", value: number(delivered, 0) },
        { label: "Bounce rate", value: `${number(bounce, 1)}%` },
        { label: "Open rate", value: `${number(open, 1)}%` },
      ]);
    }

    case "techSocialEngagement": {
      const followers = Math.max(100, Math.round(inputs.followers));
      const likes = Math.max(0, Math.round(inputs.likes));
      const comments = Math.max(0, Math.round(inputs.comments));
      const shares = Math.max(0, Math.round(inputs.shares));
      const engagements = likes + comments + shares;
      const rate = (engagements / followers) * 100;
      return result("Engagement rate", `${number(rate, 2)}%`, [
        { label: "Total engagements", value: number(engagements, 0) },
        { label: "Followers", value: number(followers, 0) },
        { label: "Likes / Comments / Shares", value: `${likes} / ${comments} / ${shares}` },
      ]);
    }

    case "techAbTestSignificance": {
      const p1 = clamp(inputs.controlConvPct, 0.1, 50) / 100;
      const p2 = clamp(inputs.variantConvPct, 0.1, 50) / 100;
      const n = Math.max(100, Math.round(inputs.samplePerVariant));
      const pooled = (p1 + p2) / 2;
      const se = Math.sqrt((2 * pooled * (1 - pooled)) / n);
      const z = se > 0 ? Math.abs(p2 - p1) / se : 0;
      const confidence = Math.min(99.9, (1 - 2 * (1 - normalCdf(z))) * 100);
      const significant = z > 1.96;
      const lift = ((p2 - p1) / p1) * 100;
      return result("Confidence", `${number(confidence, 1)}%`, [
        { label: "Significant at 95%?", value: significant ? "Yes" : "No" },
        { label: "Lift", value: `${number(lift, 1)}%` },
        { label: "Z-score", value: number(z, 2) },
      ]);
    }

    case "techVideoFileSize": {
      const videoMbps = Math.max(0.5, inputs.bitrateMbps);
      const min = Math.max(0.1, inputs.durationMin);
      const audioKbps = Math.max(64, inputs.audioBitrateKbps);
      const sec = min * 60;
      const videoMb = (videoMbps * sec) / 8;
      const audioMb = (audioKbps * sec) / 8 / 1000;
      const totalMb = videoMb + audioMb;
      return result("File size", formatBytes(totalMb * 1e6), [
        { label: "Video portion", value: formatBytes(videoMb * 1e6) },
        { label: "Audio portion", value: formatBytes(audioMb * 1e6) },
        { label: "Duration", value: `${number(min, 1)} min` },
      ]);
    }

    case "techAspectRatio": {
      const w = Math.max(1, Math.round(inputs.widthPx));
      const rw = Math.max(1, Math.round(inputs.ratioW));
      const rh = Math.max(1, Math.round(inputs.ratioH));
      const h = Math.round((w * rh) / rw);
      const mp = (w * h) / 1e6;
      return result("Height", `${h} px`, [
        { label: "Resolution", value: `${w} × ${h}` },
        { label: "Aspect ratio", value: `${rw}:${rh}` },
        { label: "Megapixels", value: `${number(mp, 2)} MP` },
      ]);
    }

    case "techRoiCalc": {
      const cost = Math.max(1, inputs.investmentCost);
      const gain = Math.max(0, inputs.gainValue);
      const months = Math.max(1, Math.round(inputs.periodMonths));
      const roi = ((gain - cost) / cost) * 100;
      const monthlyGain = (gain - cost) / months;
      const payback = monthlyGain > 0 ? cost / monthlyGain : 0;
      return result("ROI", `${number(roi, 1)}%`, [
        { label: "Net gain", value: currency(gain - cost) },
        { label: "Investment", value: currency(cost) },
        {
          label: "Payback period",
          value: payback > 0 ? `${number(payback, 1)} months` : "—",
        },
      ]);
    }

    default:
      return null;
  }
}

/** Approximate standard normal CDF for z-score confidence. */
function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
