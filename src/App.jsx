import { useEffect, useMemo, useRef, useState } from "react";

const bomRecords = [
  {
    id: "J4",
    part: "Debug Header",
    category: "Interface",
    current: { model: "SWD-Tag-10", unitPrice: 0.34, vendor: "Samtec" },
    options: {
      cost: { model: "FTSH-105", unitPrice: 0.22, vendor: "Samtec" },
      balanced: { model: "TC2050", unitPrice: 0.58, vendor: "Tag-Connect" },
      premium: { model: "STDC14", unitPrice: 1.2, vendor: "ST" },
    },
    placement: { x: 8, y: 14, w: 11, h: 8 },
    score: 64,
  },
  {
    id: "U1",
    part: "MCU Controller",
    category: "Control",
    current: { model: "STM32F405RG", unitPrice: 6.8, vendor: "ST" },
    options: {
      cost: { model: "GD32F405RG", unitPrice: 4.2, vendor: "GigaDevice" },
      balanced: { model: "STM32H503RB", unitPrice: 7.9, vendor: "ST" },
      premium: { model: "NXP i.MX RT1062", unitPrice: 12.6, vendor: "NXP" },
    },
    placement: { x: 22, y: 18, w: 16, h: 12 },
    score: 79,
  },
  {
    id: "C27",
    part: "RF Matching Capacitor",
    category: "Passive",
    current: { model: "2.2pF C0G 0402", unitPrice: 0.03, vendor: "Murata" },
    options: {
      cost: { model: "2.2pF C0G 0402", unitPrice: 0.02, vendor: "Walsin" },
      balanced: { model: "2.4pF C0G 0402", unitPrice: 0.04, vendor: "Murata" },
      premium: { model: "2.2pF High-Q 0201", unitPrice: 0.09, vendor: "Johanson" },
    },
    placement: { x: 44, y: 16, w: 9, h: 7 },
    score: 58,
  },
  {
    id: "U3",
    part: "Wireless Module",
    category: "Connectivity",
    current: { model: "ESP32-WROOM-32E", unitPrice: 3.4, vendor: "Espressif" },
    options: {
      cost: { model: "BL602", unitPrice: 2.1, vendor: "Bouffalo" },
      balanced: { model: "ESP32-C6-WROOM", unitPrice: 3.9, vendor: "Espressif" },
      premium: { model: "nRF7002", unitPrice: 6.5, vendor: "Nordic" },
    },
    placement: { x: 58, y: 16, w: 14, h: 11 },
    score: 74,
  },
  {
    id: "Y1",
    part: "System Crystal",
    category: "Clock",
    current: { model: "40MHz 10ppm", unitPrice: 0.18, vendor: "Epson" },
    options: {
      cost: { model: "40MHz 20ppm", unitPrice: 0.11, vendor: "TXC" },
      balanced: { model: "40MHz TCXO", unitPrice: 0.46, vendor: "Abracon" },
      premium: { model: "40MHz Low-Jitter TCXO", unitPrice: 0.88, vendor: "SiTime" },
    },
    placement: { x: 76, y: 16, w: 10, h: 7 },
    score: 69,
  },
  {
    id: "U12",
    part: "NOR Flash",
    category: "Memory",
    current: { model: "W25Q128JV", unitPrice: 0.92, vendor: "Winbond" },
    options: {
      cost: { model: "XT25F128B", unitPrice: 0.61, vendor: "XTX" },
      balanced: { model: "W25Q256JV", unitPrice: 1.24, vendor: "Winbond" },
      premium: { model: "MX25L51245G", unitPrice: 2.86, vendor: "Macronix" },
    },
    placement: { x: 18, y: 34, w: 15, h: 10 },
    score: 72,
  },
  {
    id: "R18",
    part: "Current Sense Resistor",
    category: "Passive",
    current: { model: "10mOhm 1206", unitPrice: 0.09, vendor: "Vishay" },
    options: {
      cost: { model: "10mOhm 1206", unitPrice: 0.05, vendor: "Yageo" },
      balanced: { model: "5mOhm 1206", unitPrice: 0.11, vendor: "Bourns" },
      premium: { model: "3mOhm 2512", unitPrice: 0.22, vendor: "Vishay" },
    },
    placement: { x: 40, y: 36, w: 10, h: 7 },
    score: 61,
  },
  {
    id: "U7",
    part: "PMIC",
    category: "Power",
    current: { model: "TPS65219", unitPrice: 2.9, vendor: "TI" },
    options: {
      cost: { model: "AXP2101", unitPrice: 1.8, vendor: "X-Powers" },
      balanced: { model: "MPM3695", unitPrice: 3.6, vendor: "MPS" },
      premium: { model: "LTC3370", unitPrice: 8.7, vendor: "ADI" },
    },
    placement: { x: 18, y: 54, w: 14, h: 10 },
    score: 71,
  },
  {
    id: "C12",
    part: "Input Capacitor Bank",
    category: "Passive",
    current: { model: "10uF X5R 0805", unitPrice: 0.12, vendor: "Murata" },
    options: {
      cost: { model: "10uF X5R 0805", unitPrice: 0.08, vendor: "Yageo" },
      balanced: { model: "22uF X7R 0805", unitPrice: 0.18, vendor: "Murata" },
      premium: { model: "47uF Polymer 1206", unitPrice: 0.49, vendor: "Panasonic" },
    },
    placement: { x: 58, y: 34, w: 12, h: 8 },
    score: 63,
  },
  {
    id: "D5",
    part: "ESD Protection Array",
    category: "Protection",
    current: { model: "USBLC6-2SC6", unitPrice: 0.16, vendor: "ST" },
    options: {
      cost: { model: "PESD5V0S2UT", unitPrice: 0.11, vendor: "Nexperia" },
      balanced: { model: "TPD2EUSB30", unitPrice: 0.19, vendor: "TI" },
      premium: { model: "RClamp0524P", unitPrice: 0.34, vendor: "Semtech" },
    },
    placement: { x: 78, y: 34, w: 10, h: 7 },
    score: 66,
  },
  {
    id: "Q2",
    part: "Power MOSFET",
    category: "Power",
    current: { model: "AO3400A", unitPrice: 0.07, vendor: "Alpha & Omega" },
    options: {
      cost: { model: "CJ2302", unitPrice: 0.04, vendor: "CJ" },
      balanced: { model: "SiA446DJ", unitPrice: 0.11, vendor: "Vishay" },
      premium: { model: "BSC340N08NS3", unitPrice: 0.32, vendor: "Infineon" },
    },
    placement: { x: 76, y: 54, w: 11, h: 8 },
    score: 62,
  },
  {
    id: "L4",
    part: "Power Inductor",
    category: "Power",
    current: { model: "4.7uH 6A", unitPrice: 0.24, vendor: "Coilcraft" },
    options: {
      cost: { model: "4.7uH 4A", unitPrice: 0.16, vendor: "Sunlord" },
      balanced: { model: "6.8uH 6A", unitPrice: 0.27, vendor: "Coilcraft" },
      premium: { model: "4.7uH 10A Molded", unitPrice: 0.54, vendor: "TDK" },
    },
    placement: { x: 38, y: 54, w: 12, h: 9 },
    score: 68,
  },
  {
    id: "U9",
    part: "Audio Codec",
    category: "Audio",
    current: { model: "NAU8822L", unitPrice: 1.94, vendor: "Nuvoton" },
    options: {
      cost: { model: "ES8311", unitPrice: 1.16, vendor: "Everest" },
      balanced: { model: "SGTL5000", unitPrice: 2.34, vendor: "NXP" },
      premium: { model: "ALC5686", unitPrice: 3.82, vendor: "Realtek" },
    },
    placement: { x: 56, y: 54, w: 15, h: 10 },
    score: 73,
  },
  {
    id: "F1",
    part: "Resettable Fuse",
    category: "Protection",
    current: { model: "1.1A MF-R110", unitPrice: 0.14, vendor: "Bourns" },
    options: {
      cost: { model: "0.75A MF-R075", unitPrice: 0.1, vendor: "Bourns" },
      balanced: { model: "1.5A nanoSMD", unitPrice: 0.18, vendor: "Littelfuse" },
      premium: { model: "eFuse TPS25947", unitPrice: 1.42, vendor: "TI" },
    },
    placement: { x: 12, y: 78, w: 10, h: 7 },
    score: 65,
  },
  {
    id: "J1",
    part: "USB-C Port",
    category: "I/O",
    current: { model: "USB4085", unitPrice: 0.68, vendor: "GCT" },
    options: {
      cost: { model: "TYPE-C-31-M-12", unitPrice: 0.41, vendor: "Korean Hroparts" },
      balanced: { model: "DX07S024", unitPrice: 0.73, vendor: "JAE" },
      premium: { model: "124019772112A", unitPrice: 1.18, vendor: "Amphenol" },
    },
    placement: { x: 34, y: 80, w: 16, h: 7 },
    score: 67,
  },
];

const strategies = {
  cost: {
    label: "Cost Saver",
    title: "Lowest Cost",
    tone: "Reduce BOM cost while keeping core functionality online.",
    badge: "Min Cost",
  },
  balanced: {
    label: "Balanced Spec",
    title: "Best Within Budget",
    tone: "Trade cost against performance, sourcing resilience and efficiency.",
    badge: "Budget Fit",
  },
  premium: {
    label: "Flagship Build",
    title: "Performance First",
    tone: "Max performance and premium component stack for the highest spec ceiling.",
    badge: "Top Tier",
  },
};

const phaseTemplate = [
  {
    id: "parse",
    label: "BOM parsing",
    detail: "Recognizing part numbers and extracting package, supply and category tags.",
  },
  {
    id: "search",
    label: "Agent search",
    detail: "Cross-checking alternatives, vendor pricing, lifecycle and stock signals.",
  },
  {
    id: "score",
    label: "Constraint scoring",
    detail: "Ranking candidates by cost, power, availability and target strategy.",
  },
  {
    id: "replace",
    label: "Layout replacement",
    detail: "Projecting selected replacements back to PCB placement and BOM rows.",
  },
];

const schematicParts = [
  { id: "J1", kind: "connector", x: 156, y: 406, caption: "USB-C", labelX: 46, labelY: -14 },
  { id: "F1", kind: "fuse", x: 248, y: 406, caption: "Fuse", labelX: -18, labelY: 34 },
  { id: "D5", kind: "protection", x: 336, y: 406, caption: "ESD", labelX: -18, labelY: 34 },
  { id: "R18", kind: "resistor", x: 418, y: 406, caption: "Sense", labelX: -20, labelY: 34 },
  { id: "Q2", kind: "mosfet", x: 438, y: 170, caption: "Power MOSFET", labelX: 56, labelY: -8 },
  { id: "U1", kind: "chip", x: 548, y: 172, w: 124, h: 132, caption: "MCU", labelX: 72, labelY: -18 },
  { id: "J4", kind: "header", x: 548, y: 60, caption: "SWD", labelX: 40, labelY: -10 },
  { id: "U3", kind: "chipSmall", x: 742, y: 142, w: 100, h: 70, caption: "Wireless", labelX: 60, labelY: -10 },
  { id: "C27", kind: "capacitor", x: 832, y: 142, caption: "RF Match", labelX: -12, labelY: 48 },
  { id: "U12", kind: "chipSmall", x: 742, y: 252, w: 100, h: 70, caption: "NOR Flash", labelX: 58, labelY: -10 },
  { id: "Y1", kind: "crystal", x: 742, y: 372, caption: "Crystal", labelX: 54, labelY: -10 },
  { id: "U9", kind: "chipSmall", x: 548, y: 520, w: 122, h: 70, caption: "Audio", labelX: 72, labelY: -10 },
  { id: "U7", kind: "chip", x: 594, y: 322, w: 104, h: 116, caption: "PMIC", labelX: 68, labelY: -14 },
  { id: "L4", kind: "inductor", x: 742, y: 322, caption: "Inductor", labelX: -6, labelY: 48 },
  { id: "C12", kind: "capacitor", x: 694, y: 428, caption: "Input Cap", labelX: 34, labelY: 14 },
];

const schematicWires = [
  "M 78 406 L 122 406",
  "M 190 406 L 222 406",
  "M 274 406 L 310 406",
  "M 362 406 L 390 406",
  "M 446 406 L 468 406",
  "M 468 406 L 468 228",
  "M 468 240 L 484 240",
  "M 468 322 L 538 322",
  "M 646 322 L 694 322",
  "M 790 322 L 860 322",
  "M 694 322 L 694 396",
  "M 694 460 L 694 520",
  "M 468 240 L 486 240",
  "M 610 172 L 686 172",
  "M 686 172 L 686 142",
  "M 686 172 L 686 252",
  "M 686 252 L 692 252",
  "M 686 172 L 686 372",
  "M 686 372 L 704 372",
  "M 548 106 L 548 94",
  "M 548 238 L 548 480",
  "M 792 142 L 808 142",
  "M 856 142 L 886 142",
];

const schematicTerminals = [
  { id: "usb-in", x: 56, y: 406, label: "IN", direction: "right" },
  { id: "vbus", x: 468, y: 52, label: "VBUS", direction: "down", rotateLabel: true },
  { id: "vout", x: 882, y: 322, label: "3V3", direction: "left" },
  { id: "rf", x: 902, y: 142, label: "RF", direction: "left" },
  { id: "gnd", x: 694, y: 542, label: "GND", direction: "up", rotateLabel: true },
];

const schematicView = {
  width: 920,
  height: 600,
  scale: 1.16,
};

const initialLog = {
  time: "09:41:06",
  label: "System ready",
  detail: "Upload a BOM file to unlock parsing and the BOM visualization.",
};

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function buildRows(strategy) {
  return bomRecords.map((record) => ({
    ...record,
    next: record.options[strategy],
    delta: record.options[strategy].unitPrice - record.current.unitPrice,
  }));
}

function getSummary(rows) {
  const currentTotal = rows.reduce((sum, row) => sum + row.current.unitPrice, 0);
  const optimizedTotal = rows.reduce((sum, row) => sum + row.next.unitPrice, 0);
  const avgScore =
    rows.reduce((sum, row) => sum + (row.score + Math.round(row.next.unitPrice * 3)), 0) /
    rows.length;

  return {
    currentTotal,
    optimizedTotal,
    delta: optimizedTotal - currentTotal,
    avgScore: Math.round(avgScore),
  };
}

function getFileInfo(file) {
  if (!file) {
    return {
      name: "Select PDF / Excel BOM",
      size: "--",
      type: "Awaiting upload",
    };
  }

  return {
    name: file.name,
    size: `${(file.size / 1024 / 1024 || 0.18).toFixed(2)} MB`,
    type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "Excel",
  };
}

function escapeCsv(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function shortenText(value, limit = 18) {
  return value.length > limit ? `${value.slice(0, limit - 3)}...` : value;
}

function clampPanPosition(position, bounds) {
  return {
    x: clamp(position.x, -bounds.x, bounds.x),
    y: clamp(position.y, -bounds.y, bounds.y),
  };
}

function getRowStatus(rowId, activeReplacement, completedSet) {
  if (activeReplacement === rowId) {
    return "active";
  }

  if (completedSet.has(rowId)) {
    return "done";
  }

  return "pending";
}

function renderComponentBody(part) {
  switch (part.kind) {
    case "connector":
      return (
        <>
          <rect x="-32" y="-18" width="64" height="36" rx="8" className="symbol-box" />
          <line x1="-40" y1="-10" x2="-32" y2="-10" className="symbol-line" />
          <line x1="-40" y1="0" x2="-32" y2="0" className="symbol-line" />
          <line x1="-40" y1="10" x2="-32" y2="10" className="symbol-line" />
          <line x1="32" y1="-10" x2="40" y2="-10" className="symbol-line" />
          <line x1="32" y1="0" x2="40" y2="0" className="symbol-line" />
          <line x1="32" y1="10" x2="40" y2="10" className="symbol-line" />
        </>
      );
    case "fuse":
      return (
        <>
          <line x1="-26" y1="0" x2="-10" y2="0" className="symbol-line" />
          <path d="M -10 0 C -4 -10, 4 -10, 10 0 C 16 10, 24 10, 30 0" className="symbol-line" />
        </>
      );
    case "protection":
      return (
        <>
          <line x1="-26" y1="0" x2="-16" y2="0" className="symbol-line" />
          <rect x="-16" y="-16" width="32" height="32" rx="6" className="symbol-box" />
          <line x1="16" y1="0" x2="26" y2="0" className="symbol-line" />
          <line x1="-6" y1="-8" x2="6" y2="8" className="symbol-line" />
          <line x1="-6" y1="8" x2="6" y2="-8" className="symbol-line" />
        </>
      );
    case "resistor":
      return (
        <>
          <line x1="-28" y1="0" x2="-20" y2="0" className="symbol-line" />
          <path
            d="M -20 0 L -14 -10 L -8 10 L -2 -10 L 4 10 L 10 -10 L 16 10 L 22 0"
            className="symbol-line"
          />
        </>
      );
    case "mosfet":
      return (
        <>
          <line x1="10" y1="-52" x2="10" y2="-18" className="symbol-line" />
          <line x1="10" y1="18" x2="10" y2="52" className="symbol-line" />
          <line x1="-30" y1="0" x2="-6" y2="0" className="symbol-line" />
          <line x1="-6" y1="-28" x2="-6" y2="28" className="symbol-line" />
          <line x1="10" y1="-28" x2="10" y2="28" className="symbol-line" />
          <line x1="-6" y1="-28" x2="10" y2="-28" className="symbol-line" />
          <line x1="-6" y1="28" x2="10" y2="28" className="symbol-line" />
          <path d="M -2 20 L 8 14 L 8 26 Z" className="symbol-arrow" />
        </>
      );
    case "chip":
      return (
        <>
          <rect x={-part.w / 2} y={-part.h / 2} width={part.w} height={part.h} rx="12" className="symbol-box" />
          <line x1={-part.w / 2 - 12} y1="-30" x2={-part.w / 2} y2="-30" className="symbol-line" />
          <line x1={-part.w / 2 - 12} y1="0" x2={-part.w / 2} y2="0" className="symbol-line" />
          <line x1={-part.w / 2 - 12} y1="30" x2={-part.w / 2} y2="30" className="symbol-line" />
          <line x1={part.w / 2} y1="-22" x2={part.w / 2 + 12} y2="-22" className="symbol-line" />
          <line x1={part.w / 2} y1="0" x2={part.w / 2 + 12} y2="0" className="symbol-line" />
          <line x1={part.w / 2} y1="22" x2={part.w / 2 + 12} y2="22" className="symbol-line" />
        </>
      );
    case "chipSmall":
      return (
        <>
          <rect x={-part.w / 2} y={-part.h / 2} width={part.w} height={part.h} rx="10" className="symbol-box" />
          <line x1={-part.w / 2 - 10} y1="-16" x2={-part.w / 2} y2="-16" className="symbol-line" />
          <line x1={-part.w / 2 - 10} y1="16" x2={-part.w / 2} y2="16" className="symbol-line" />
          <line x1={part.w / 2} y1="-16" x2={part.w / 2 + 10} y2="-16" className="symbol-line" />
          <line x1={part.w / 2} y1="16" x2={part.w / 2 + 10} y2="16" className="symbol-line" />
        </>
      );
    case "header":
      return (
        <>
          <rect x="-26" y="-16" width="52" height="32" rx="8" className="symbol-box" />
          <circle cx="-12" cy="0" r="3.6" className="symbol-node" />
          <circle cx="0" cy="0" r="3.6" className="symbol-node" />
          <circle cx="12" cy="0" r="3.6" className="symbol-node" />
        </>
      );
    case "inductor":
      return (
        <>
          <line x1="-34" y1="0" x2="-24" y2="0" className="symbol-line" />
          <path
            d="M -24 0 C -18 -14, -6 -14, 0 0 C 6 14, 18 14, 24 0 C 30 -14, 42 -14, 48 0"
            className="symbol-line"
          />
        </>
      );
    case "capacitor":
      return (
        <>
          <line x1="0" y1="-30" x2="0" y2="-10" className="symbol-line" />
          <line x1="-16" y1="-10" x2="16" y2="-10" className="symbol-line" />
          <line x1="-16" y1="10" x2="16" y2="10" className="symbol-line" />
          <line x1="0" y1="10" x2="0" y2="30" className="symbol-line" />
        </>
      );
    case "crystal":
      return (
        <>
          <line x1="-34" y1="0" x2="-16" y2="0" className="symbol-line" />
          <rect x="-16" y="-18" width="32" height="36" rx="6" className="symbol-box" />
          <line x1="16" y1="0" x2="34" y2="0" className="symbol-line" />
          <line x1="-8" y1="-18" x2="-8" y2="18" className="symbol-line faint" />
          <line x1="8" y1="-18" x2="8" y2="18" className="symbol-line faint" />
        </>
      );
    default:
      return null;
  }
}

function SchematicPart({ row, part, status }) {
  const primaryModel = status === "done" ? row.next.model : row.current.model;
  const secondaryModel = status === "active" ? `-> ${shortenText(row.next.model, 16)}` : null;

  return (
    <g className={`schematic-part ${status}`} transform={`translate(${part.x} ${part.y})`}>
      <circle className="part-glow" r="58" />
      {renderComponentBody(part)}
      <text x={part.labelX} y={part.labelY} className="part-ref">
        {row.id}
      </text>
      <text x={part.labelX} y={part.labelY + 16} className="part-caption">
        {part.caption}
      </text>
      <text x={part.labelX} y={part.labelY + 34} className="part-model">
        {shortenText(primaryModel)}
      </text>
      {secondaryModel ? (
        <text x={part.labelX} y={part.labelY + 50} className="part-next-model">
          {secondaryModel}
        </text>
      ) : null}
      <g className="part-pads">
        <rect x="-4" y="-4" width="8" height="8" className="part-pad" />
      </g>
    </g>
  );
}

function SchematicTerminal({ terminal }) {
  const pointsByDirection = {
    right: "-28,-18 8,-18 28,0 8,18 -28,18 -40,0",
    left: "28,-18 -8,-18 -28,0 -8,18 28,18 40,0",
    down: "-18,-28 18,-28 18,8 0,28 -18,8",
    up: "-18,28 18,28 18,-8 0,-28 -18,-8",
  };

  return (
    <g className="schematic-terminal" transform={`translate(${terminal.x} ${terminal.y})`}>
      <polygon points={pointsByDirection[terminal.direction]} className="terminal-shape" />
      <text
        className={`terminal-label ${terminal.rotateLabel ? "rotated" : ""}`}
        x={terminal.direction === "right" ? -58 : terminal.direction === "left" ? 56 : 0}
        y={terminal.direction === "up" ? 48 : terminal.direction === "down" ? -42 : 6}
        textAnchor={
          terminal.direction === "right"
            ? "end"
            : terminal.direction === "left"
              ? "start"
              : "middle"
        }
      >
        {terminal.label}
      </text>
    </g>
  );
}

function App() {
  const [strategy, setStrategy] = useState("balanced");
  const [workflowStage, setWorkflowStage] = useState("idle");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parseProgress, setParseProgress] = useState(0);
  const [activePhase, setActivePhase] = useState(-1);
  const [activeReplacement, setActiveReplacement] = useState(null);
  const [completedReplacements, setCompletedReplacements] = useState([]);
  const [hasExported, setHasExported] = useState(false);
  const [eventLog, setEventLog] = useState([initialLog]);
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [isPanningCanvas, setIsPanningCanvas] = useState(false);

  const timersRef = useRef([]);
  const canvasViewportRef = useRef(null);
  const canvasDragRef = useRef(null);
  const rows = useMemo(() => buildRows(strategy), [strategy]);
  const summary = useMemo(() => getSummary(rows), [rows]);
  const fileInfo = getFileInfo(uploadedFile);

  const isParsing = workflowStage === "parsing";
  const hasParsed =
    workflowStage === "parsed" ||
    workflowStage === "optimizing" ||
    workflowStage === "optimized";
  const isOptimizing = workflowStage === "optimizing";
  const isOptimized = workflowStage === "optimized";
  const showOptimizationViews = isOptimizing || isOptimized;
  const completedSet = useMemo(
    () => new Set(completedReplacements),
    [completedReplacements],
  );
  const lastCompletedId = completedReplacements[completedReplacements.length - 1] ?? null;
  const activeRow = rows.find((row) => row.id === activeReplacement) ?? null;
  const focusRow = activeRow ?? rows.find((row) => row.id === lastCompletedId) ?? rows[0];
  const focusStatus = activeRow ? "active" : lastCompletedId ? "done" : "queued";
  const panBounds = useMemo(
    () => ({
      x: Math.max(0, (viewportSize.width * (schematicView.scale - 1)) / 2),
      y: Math.max(0, (viewportSize.height * (schematicView.scale - 1)) / 2),
    }),
    [viewportSize],
  );
  const hasPanOffset = Math.abs(canvasPan.x) > 1 || Math.abs(canvasPan.y) > 1;

  const workflowSteps = [
    {
      id: "upload",
      number: "01",
      title: "Upload BOM",
      detail: "Load a PDF or spreadsheet to start the pipeline.",
      state:
        workflowStage === "idle" || workflowStage === "parsing" ? "active" : "done",
    },
    {
      id: "review",
      number: "02",
      title: "Reveal BOM",
      detail: "Parsed rows unlock the component list and review table.",
      state: hasParsed && !showOptimizationViews ? "active" : showOptimizationViews ? "done" : "locked",
    },
    {
      id: "optimize",
      number: "03",
      title: "Run Optimization",
      detail: "Launch the strategy engine to generate the simulation and layout swap view.",
      state: isOptimizing ? "active" : isOptimized ? "done" : hasParsed ? "ready" : "locked",
    },
    {
      id: "output",
      number: "04",
      title: "Output BOM",
      detail: "Export the optimized BOM after the simulation completes.",
      state: hasExported ? "done" : isOptimized ? "active" : "locked",
    },
  ];

  useEffect(() => {
    if (!isParsing) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setParseProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(intervalId);
          setWorkflowStage("parsed");
          setEventLog((current) => [
            {
              time: "09:41:09",
              label: "BOM parsed",
              detail: `${bomRecords.length} components are now visualized and ready for strategy selection.`,
            },
            ...current.slice(0, 5),
          ]);
          return 100;
        }

        return Math.min(prev + 12, 100);
      });
    }, 240);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isParsing]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    const element = canvasViewportRef.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      const nextSize = {
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      };

      setViewportSize((current) =>
        current.width === nextSize.width && current.height === nextSize.height
          ? current
          : nextSize,
      );
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [showOptimizationViews]);

  useEffect(() => {
    setCanvasPan((current) => clampPanPosition(current, panBounds));
  }, [panBounds]);

  useEffect(() => {
    if (!showOptimizationViews) {
      setCanvasPan({ x: 0, y: 0 });
      setIsPanningCanvas(false);
      canvasDragRef.current = null;
    }
  }, [showOptimizationViews]);

  function queueTimeout(callback, delay) {
    const id = window.setTimeout(callback, delay);
    timersRef.current.push(id);
    return id;
  }

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function resetOptimizationState() {
    clearTimers();
    setActivePhase(-1);
    setActiveReplacement(null);
    setCompletedReplacements([]);
    setHasExported(false);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    setUploadedFile(file);
    setWorkflowStage("parsing");
    setParseProgress(10);
    resetOptimizationState();
    setEventLog([
      {
        time: "09:41:07",
        label: "Upload received",
        detail: `${file.name} entered the parsing pipeline.`,
      },
      initialLog,
    ]);
  }

  function handleStrategySelect(nextStrategy) {
    if (nextStrategy === strategy) {
      return;
    }

    setStrategy(nextStrategy);

    if (showOptimizationViews) {
      resetOptimizationState();
      setWorkflowStage("parsed");
      setEventLog((current) => [
        {
          time: "09:41:11",
          label: "Strategy updated",
          detail: `Switched to ${strategies[nextStrategy].label}. Run optimization again to refresh the simulation.`,
        },
        ...current.slice(0, 5),
      ]);
    }
  }

  function handleOptimize() {
    if (!hasParsed) {
      return;
    }

    resetOptimizationState();
    setWorkflowStage("optimizing");
    setEventLog((current) => [
      {
        time: "09:41:12",
        label: "Optimization started",
        detail: `Running the ${strategies[strategy].label} strategy across sourcing and layout constraints.`,
      },
      ...current.slice(0, 5),
    ]);

    phaseTemplate.forEach((phase, index) => {
      queueTimeout(() => {
        setActivePhase(index);
        setEventLog((current) => [
          {
            time: `09:41:${13 + index}`,
            label: phase.label,
            detail: phase.detail,
          },
          ...current.slice(0, 5),
        ]);
      }, index * 1400);
    });

    const swapStartDelay = 3800;
    const swapInterval = 520;
    const swapSettleDelay = 260;

    rows.forEach((row, index) => {
      queueTimeout(() => {
        setActivePhase(3);
        setActiveReplacement(row.id);
        setCompletedReplacements((current) => current.filter((item) => item !== row.id));
        setEventLog((current) => [
          {
            time: `09:41:${17 + index}`,
            label: `Swap ${row.id}`,
            detail: `${row.current.model} -> ${row.next.model}`,
          },
          ...current.slice(0, 5),
        ]);
      }, swapStartDelay + index * swapInterval);

      queueTimeout(() => {
        setCompletedReplacements((current) => [...new Set([...current, row.id])]);
      }, swapStartDelay + swapSettleDelay + index * swapInterval);
    });

    queueTimeout(() => {
      setActiveReplacement(null);
      setWorkflowStage("optimized");
      setEventLog((current) => [
        {
          time: "09:41:24",
          label: "Optimization done",
          detail: `Updated ${rows.length} BOM rows. Output BOM is ready for export.`,
        },
        ...current.slice(0, 5),
      ]);
    }, swapStartDelay + swapSettleDelay + rows.length * swapInterval);
  }

  function handleOutputBom() {
    if (!isOptimized) {
      return;
    }

    const headers = [
      "Ref",
      "Component",
      "Category",
      "Original Model",
      "Original Unit Price",
      "Optimized Model",
      "Optimized Vendor",
      "Optimized Unit Price",
      "Delta (estimate)",
      "Strategy",
    ];

    const lines = rows.map((row) => [
      row.id,
      row.part,
      row.category,
      row.current.model,
      row.current.unitPrice.toFixed(2),
      row.next.model,
      row.next.vendor,
      row.next.unitPrice.toFixed(2),
      row.delta.toFixed(2),
      strategies[strategy].label,
    ]);

    const csv = [headers, ...lines]
      .map((line) => line.map(escapeCsv).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `optimized-bom-${strategy}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);

    setHasExported(true);
    setEventLog((current) => [
      {
        time: "09:41:26",
        label: "Output BOM exported",
        detail: `Downloaded optimized-bom-${strategy}.csv with ${rows.length} optimized rows.`,
      },
      ...current.slice(0, 5),
    ]);
  }

  function handleCanvasPointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    canvasDragRef.current = {
      pointerId: event.pointerId,
      originX: canvasPan.x,
      originY: canvasPan.y,
      startX: event.clientX,
      startY: event.clientY,
    };
    setIsPanningCanvas(true);
  }

  function handleCanvasPointerMove(event) {
    const drag = canvasDragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const nextPosition = clampPanPosition(
      {
        x: drag.originX + (event.clientX - drag.startX),
        y: drag.originY + (event.clientY - drag.startY),
      },
      panBounds,
    );

    setCanvasPan((current) =>
      current.x === nextPosition.x && current.y === nextPosition.y
        ? current
        : nextPosition,
    );
  }

  function handleCanvasPointerEnd(event) {
    const drag = canvasDragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    canvasDragRef.current = null;
    setIsPanningCanvas(false);
  }

  function handleResetCanvasView() {
    setCanvasPan({ x: 0, y: 0 });
  }

  return (
    <main className="shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <section className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">BOM Intelligence Console</p>
          <h1>Interactive BOM Optimization Demo</h1>
          <p className="lede">
            This flow is intentionally chained. Uploading a BOM unlocks the parsed
            component list. Starting optimization unlocks the simulation, replacement
            timeline, and final output BOM export.
          </p>
        </div>

        <div className="workflow-rail">
          {workflowSteps.map((step) => (
            <article key={step.id} className={`workflow-step ${step.state}`}>
              <span className="workflow-number">{step.number}</span>
              <div className="workflow-copy">
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="top-grid">
        <div className="panel uploader">
          <div className="panel-head">
            <div>
              <p className="section-kicker">Step 1</p>
              <h2>Upload BOM</h2>
            </div>
            <span className="status-chip">
              {workflowStage === "idle"
                ? "Awaiting Upload"
                : isParsing
                  ? "Parsing"
                  : "Unlocked"}
            </span>
          </div>

          <label className="dropzone">
            <input type="file" accept=".pdf,.xls,.xlsx,.csv" onChange={handleFileChange} />
            <div className="dropzone-grid" />
            <div className="dropzone-copy">
              <strong>{fileInfo.name}</strong>
              <span>
                {fileInfo.type} / {fileInfo.size}
              </span>
            </div>
            <div className="dropzone-actions">
              <span className="upload-cta">{uploadedFile ? "Replace BOM" : "Upload BOM"}</span>
              <span className="dropzone-hint">PDF, XLS, XLSX, CSV</span>
            </div>
            <p>
              {workflowStage === "idle"
                ? "Nothing else is visible yet. Uploading a BOM is the entry point for the rest of the demo."
                : isParsing
                  ? "Parsing is running. The BOM list stays locked until the pipeline reaches 100%."
                  : "BOM parsing finished. The parsed list is now unlocked below."}
            </p>
          </label>

          {workflowStage !== "idle" ? (
            <div className="progress-block">
              <div className="progress-meta">
                <span>Auto parsing pipeline</span>
                <span>{parseProgress}%</span>
              </div>
              <div className="progress-rail">
                <div className="progress-fill" style={{ width: `${parseProgress}%` }} />
              </div>
            </div>
          ) : null}

          <div className="file-facts">
            <div>
              <span className="fact-label">Parser state</span>
              <strong>{workflowStage === "idle" ? "Idle" : isParsing ? "Running" : "Done"}</strong>
            </div>
            <div>
              <span className="fact-label">Rows detected</span>
              <strong>{hasParsed ? bomRecords.length : "--"}</strong>
            </div>
            <div>
              <span className="fact-label">Search agents</span>
              <strong>{hasParsed ? "06" : "--"}</strong>
            </div>
          </div>
        </div>

        {hasParsed ? (
          <div className="panel preview-panel reveal-section">
            <div className="panel-head">
              <div>
                <p className="section-kicker">Step 2</p>
                <h2>Parsed BOM Preview</h2>
              </div>
              <span className="status-chip">Unlocked</span>
            </div>

            <div className="preview-list">
              {rows.map((row) => (
                <article key={row.id} className="preview-card">
                  <span className="preview-ref">{row.id}</span>
                  <div className="preview-meta">
                    <strong>{row.part}</strong>
                    <p>{row.current.model}</p>
                  </div>
                  <span className="preview-price">{formatMoney(row.current.unitPrice)}</span>
                </article>
              ))}
            </div>

            <p className="stage-note">
              The component list is now visible. Choose a strategy and click
              `Start Optimization` to unlock the downstream visuals.
            </p>
          </div>
        ) : (
          <div className="panel locked-panel">
            <span className="locked-badge">02</span>
            <h2>Parsed BOM stays hidden until upload completes</h2>
            <p className="locked-copy">
              Step 2 only unlocks after a BOM file has been uploaded and parsed.
              Until then, no list visualization is shown.
            </p>
          </div>
        )}
      </section>

      {hasParsed ? (
        <section className="bottom-grid reveal-section">
          <div className="panel table-panel">
            <div className="panel-head">
              <div>
                <p className="section-kicker">Step 2</p>
                <h2>Parsed BOM List</h2>
              </div>
              <span className="status-chip">Visible</span>
            </div>

            <div className="bom-table">
              <div className="bom-row bom-head">
                <span>Ref</span>
                <span>Component</span>
                <span>Current</span>
                <span>Suggested</span>
                <span>Delta (estimate)</span>
              </div>

              {rows.map((row) => {
                const isHighlighted = activeReplacement === row.id;
                return (
                  <div key={row.id} className={`bom-row ${isHighlighted ? "highlighted" : ""}`}>
                    <span>{row.id}</span>
                    <span>
                      <strong>{row.part}</strong>
                      <em>{row.category}</em>
                    </span>
                    <span>
                      <strong>{row.current.model}</strong>
                      <em>{formatMoney(row.current.unitPrice)}</em>
                    </span>
                    <span>
                      <strong>{row.next.model}</strong>
                      <em>{row.next.vendor}</em>
                    </span>
                    <span className={row.delta <= 0 ? "delta down" : "delta up"}>
                      {row.delta <= 0 ? "" : "+"}
                      {formatMoney(row.delta)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel strategy-panel">
            <div className="panel-head">
              <div>
                <p className="section-kicker">Step 3</p>
                <h2>Optimization Trigger</h2>
              </div>
              <span className="status-chip">{strategies[strategy].badge}</span>
            </div>

            <div className="strategy-list">
              {Object.entries(strategies).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  className={`strategy-card ${strategy === key ? "selected" : ""}`}
                  onClick={() => handleStrategySelect(key)}
                >
                  <span className="strategy-name">{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.tone}</p>
                </button>
              ))}
            </div>

            <div className="action-row">
              <button
                type="button"
                className="primary-button"
                onClick={handleOptimize}
                disabled={isOptimizing}
              >
                {isOptimizing ? "Optimizing..." : "Start Optimization"}
              </button>
              <p className="action-copy">
                Nothing below this point is rendered until optimization starts.
                Clicking the button unlocks the timeline, swap animation, and board view.
              </p>
            </div>

            <div className="stage-guard">
              <strong>Gated output</strong>
              <p>
                Changing strategy after a completed run hides downstream panels and
                requires a fresh optimization pass.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {showOptimizationViews ? (
        <section className="middle-grid reveal-section">
          <div className="panel timeline-panel">
            <div className="panel-head">
              <div>
                <p className="section-kicker">Step 3</p>
                <h2>Optimization Timeline</h2>
              </div>
              <span className="status-chip">{activeReplacement ?? "Running"}</span>
            </div>

            <div className="timeline">
              {phaseTemplate.map((phase, index) => {
                const state =
                  isOptimizing && activePhase === index
                    ? "active"
                    : activePhase > index || (!isOptimizing && completedReplacements.length > 0)
                      ? "done"
                      : "";

                return (
                  <article key={phase.id} className={`timeline-card ${state}`}>
                    <span className="timeline-index">0{index + 1}</span>
                    <div>
                      <strong>{phase.label}</strong>
                      <p>{phase.detail}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="event-log">
              {eventLog.map((item, index) => (
                <div key={`${index}-${item.time}-${item.label}`} className="event-item">
                  <span>{item.time}</span>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel board-panel">
            <div className="panel-head">
              <div>
                <p className="section-kicker">Step 3</p>
                <h2>Schematic Replacement View</h2>
              </div>
              <span className="status-chip">
                {completedReplacements.length}/{rows.length} swapped
              </span>
            </div>

            <div className="schematic-shell">
              <div className="schematic-toolbar">
                <span className="canvas-hint">
                  {isPanningCanvas ? "Dragging schematic..." : "Drag canvas to inspect the circuit"}
                </span>
                <button
                  type="button"
                  className="canvas-reset"
                  onClick={handleResetCanvasView}
                  disabled={!hasPanOffset}
                >
                  Reset View
                </button>
              </div>

              <div
                ref={canvasViewportRef}
                className={`schematic-canvas ${isPanningCanvas ? "dragging" : ""}`}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerEnd}
                onPointerCancel={handleCanvasPointerEnd}
              >
                <div
                  className="schematic-stage"
                  style={{
                    transform: `translate3d(${canvasPan.x}px, ${canvasPan.y}px, 0) scale(${schematicView.scale})`,
                  }}
                >
                  <svg
                    className="schematic-svg"
                    viewBox={`0 0 ${schematicView.width} ${schematicView.height}`}
                    role="img"
                    aria-label="Circuit-style component replacement view"
                  >
                    <defs>
                      <pattern id="schematic-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1.2" className="grid-dot" />
                      </pattern>
                    </defs>

                    <rect
                      x="0"
                      y="0"
                      width={schematicView.width}
                      height={schematicView.height}
                      fill="url(#schematic-grid)"
                    />

                    {schematicWires.map((path) => (
                      <path key={path} d={path} className="schematic-wire" />
                    ))}

                    <circle cx="468" cy="406" r="10" className="junction-node" />

                    {schematicTerminals.map((terminal) => (
                      <SchematicTerminal key={terminal.id} terminal={terminal} />
                    ))}

                    {schematicParts.map((part) => {
                      const row = rows.find((item) => item.id === part.id);

                      if (!row) {
                        return null;
                      }

                      return (
                        <SchematicPart
                          key={part.id}
                          row={row}
                          part={part}
                          status={getRowStatus(part.id, activeReplacement, completedSet)}
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className={`focus-card ${focusStatus}`}>
                <div>
                  <p className="focus-kicker">
                    {focusStatus === "active"
                      ? "Replacing now"
                      : focusStatus === "done"
                        ? "Latest replacement"
                        : "Queued replacement"}
                  </p>
                  <h3>
                    {focusRow.id} / {focusRow.part}
                  </h3>
                </div>

                <div className="focus-flow">
                  <div>
                    <span>Current</span>
                    <strong>{focusRow.current.model}</strong>
                  </div>
                  <span className="flow-arrow">-&gt;</span>
                  <div>
                    <span>Selected</span>
                    <strong>{focusRow.next.model}</strong>
                  </div>
                </div>

                <div className="focus-metrics">
                  <div>
                    <span>Vendor</span>
                    <strong>{focusRow.next.vendor}</strong>
                  </div>
                  <div>
                    <span>Delta</span>
                    <strong className={focusRow.delta <= 0 ? "delta down" : "delta up"}>
                      {focusRow.delta <= 0 ? "" : "+"}
                      {formatMoney(focusRow.delta)}
                    </strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>
                      {focusStatus === "active"
                        ? "Swapping"
                        : focusStatus === "done"
                          ? "Updated"
                          : "Pending"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="schematic-legend">
                <span>
                  <i className="dot dot-live" /> Current
                </span>
                <span>
                  <i className="dot dot-active" /> Replacing
                </span>
                <span>
                  <i className="dot dot-done" /> Optimized
                </span>
                <span className="legend-copy">
                  The highlighted device switches from the current model to the selected replacement on the schematic.
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {isOptimized ? (
        <section className="top-grid reveal-section">
          <div className="panel insight-panel">
            <div className="panel-head">
              <div>
                <p className="section-kicker">Step 4</p>
                <h2>Output Summary</h2>
              </div>
              <span className="status-chip">Ready to Export</span>
            </div>

            <div className="insight-stack">
              <div className="insight-card">
                <span>Current BOM</span>
                <strong>{formatMoney(summary.currentTotal)}</strong>
              </div>

              <div className="insight-card">
                <span>Optimized BOM</span>
                <strong>{formatMoney(summary.optimizedTotal)}</strong>
                <p>{strategies[strategy].title}</p>
              </div>

              <div className="insight-card compact">
                <span>Total delta (estimate)</span>
                <strong className={summary.delta <= 0 ? "delta down" : "delta up"}>
                  {summary.delta <= 0 ? "" : "+"}
                  {formatMoney(summary.delta)}
                </strong>
              </div>
            </div>
          </div>

          <div className="panel output-panel">
            <div className="panel-head">
              <div>
                <p className="section-kicker">Step 4</p>
                <h2>Output BOM</h2>
              </div>
              <span className="status-chip">{hasExported ? "Exported" : "Ready"}</span>
            </div>

            <div className="output-stack">
              <div className="insight-card">
                <span>File name</span>
                <strong>{`optimized-bom-${strategy}.csv`}</strong>
                <p>
                  Export the optimized BOM with all current-to-target component swaps
                  and pricing deltas.
                </p>
              </div>

              <div className="action-row output-row">
                <button type="button" className="secondary-button" onClick={handleOutputBom}>
                  {hasExported ? "Download Again" : "Output BOM"}
                </button>
                <p className="action-copy">
                  The export is only available after optimization completes. Re-uploading
                  or changing strategy will lock this step again.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default App;
