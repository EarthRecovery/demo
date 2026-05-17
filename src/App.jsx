import { useEffect, useState } from "react";

const sidebarSections = [
  {
    id: "dashboard",
    index: "01",
    label: "Dashboard",
    title: "BOM Project Dashboard",
    description: "Project cards, key metrics, and the current stage.",
  },
  {
    id: "upload",
    index: "02",
    label: "Upload",
    title: "BOM Upload",
    description:
      "Upload Excel, PDF, and multimodal support files and extract key information automatically.",
  },
  {
    id: "clean",
    index: "03",
    label: "Clean BOM",
    title: "Clean BOM",
    description: "Review each component line by line with AI annotations.",
  },
  {
    id: "risk",
    index: "04",
    label: "Risk",
    title: "Risk Review",
    description: "Aggregate supply, lifecycle, cost, and data quality risks.",
  },
  {
    id: "substitute",
    index: "05",
    label: "Substitute",
    title: "Substitute Recommendation",
    description: "Review substitutes and tradeoffs for high-risk parts.",
  },
  {
    id: "costed",
    index: "06",
    label: "Costed BOM",
    title: "Costed BOM",
    description: "Calculate line items, shipping, tax, and landed cost.",
  },
  {
    id: "ready",
    index: "07",
    label: "Ready",
    title: "Production Ready BOM",
    description: "Score the BOM and export the final version.",
  },
  {
    id: "preferences",
    index: "08",
    label: "Preferences",
    title: "Preferences",
    description: "Choose demo or product mode and optimization goals per project.",
  },
  {
    id: "memory",
    index: "09",
    label: "Memory",
    title: "Company Memory",
    description: "Reuse historical projects, approved substitutes, and delay history.",
  },
];

const workflowLabels = [
  { id: "upload", title: "Upload" },
  { id: "clean", title: "Clean BOM" },
  { id: "risk", title: "Risk Review" },
  { id: "substitute", title: "Substitute" },
  { id: "costed", title: "Costed BOM" },
  { id: "ready", title: "Ready" },
];

const projectCards = [
  {
    id: "nova",
    name: "Nova Sensor Hub",
    bomStatus: "Needs sourcing review",
    step: "Risk Review",
    metrics: ["48 line items", "12 alerts", "82% ready"],
    note: "Main demo project for BOM optimization walkthrough.",
  },
  {
    id: "beacon",
    name: "Factory Beacon Mini",
    bomStatus: "Awaiting AVL sync",
    step: "Clean BOM",
    metrics: ["32 line items", "4 alternates", "65% ready"],
    note: "Low-cost design for rapid pilot deployment.",
  },
  {
    id: "meter",
    name: "Edge Power Monitor",
    bomStatus: "Released to sourcing",
    step: "Exported",
    metrics: ["71 line items", "0 critical", "96% ready"],
    note: "Previous product build used for company memory examples.",
  },
];

const baseParts = [
  {
    id: "U1",
    name: "Main MCU",
    mpn: "STM32H743VIT6",
    manufacturer: "STMicroelectronics",
    description: "Main application processor",
    packageType: "LQFP-100",
    spec: "400MHz / 2MB Flash / 1MB RAM",
    qty: 1,
    unitPrice: 12.8,
    leadTime: "18 wks",
    availability: "Allocated",
    aiStatus: "risk",
    aiSummary: "Single-source MCU with long lead time and no qualified fallback.",
    riskReason: "18-week lead time and dependency on one supplier family.",
    riskBuckets: ["Supply", "Lifecycle"],
    benchmarkPrice: 10.9,
    dataQuality: "Datasheet linked, second-source qualification missing.",
    alternatives: [
      {
        id: "u1-st",
        mpn: "STM32H735VGT6",
        manufacturer: "STMicroelectronics",
        description: "Pin-compatible MCU with slightly smaller package margin",
        compatibility: "92%",
        price: 11.9,
        leadTime: "14 wks",
        availability: "Medium",
        tradeoff:
          "Firmware change is small, but supplier concentration stays high because the vendor remains ST.",
      },
      {
        id: "u1-gd",
        mpn: "GD32H757VIT6",
        manufacturer: "GigaDevice",
        description: "Performance-matched MCU with broader channel stock",
        compatibility: "76%",
        price: 8.6,
        leadTime: "8 wks",
        availability: "High",
        tradeoff:
          "Largest supply relief and best cost reduction, but BSP, timing, and EMC need a fresh validation pass.",
      },
    ],
  },
  {
    id: "U7",
    name: "PMIC",
    mpn: "TPS65219",
    manufacturer: "Texas Instruments",
    description: "Power management IC for rails and sequencing",
    packageType: "VQFN-48",
    spec: "3 buck / 4 LDO / power path",
    qty: 1,
    unitPrice: 3.48,
    leadTime: "16 wks",
    availability: "Low",
    aiStatus: "risk",
    aiSummary: "Lead time remains elevated and current quote is above benchmark.",
    riskReason: "Low inventory plus 22% cost premium vs internal benchmark.",
    riskBuckets: ["Supply", "Cost"],
    benchmarkPrice: 2.84,
    dataQuality: "Pricing quote is recent, AVL status needs sign-off.",
    alternatives: [
      {
        id: "u7-mps",
        mpn: "MPM3695-25",
        manufacturer: "MPS",
        description: "Compact PMIC with similar rail coverage",
        compatibility: "88%",
        price: 3.12,
        leadTime: "10 wks",
        availability: "Medium",
        tradeoff:
          "Improves cost and supply modestly, but analog tuning and power-up sequencing should be re-checked.",
      },
      {
        id: "u7-adi",
        mpn: "LTC3370",
        manufacturer: "Analog Devices",
        description: "Higher-end PMIC with excellent field reliability",
        compatibility: "81%",
        price: 5.24,
        leadTime: "7 wks",
        availability: "High",
        tradeoff:
          "Best availability and strong reliability, but the landed cost rises and layout changes are likely.",
      },
    ],
  },
  {
    id: "U12",
    name: "NOR Flash",
    mpn: "W25Q256JV",
    manufacturer: "Winbond",
    description: "External flash for logging and OTA images",
    packageType: "WSON-8",
    spec: "256Mbit / 133MHz",
    qty: 1,
    unitPrice: 1.92,
    leadTime: "20 wks",
    availability: "Low",
    aiStatus: "bad",
    aiSummary: "Current flash is above benchmark and carries allocation risk.",
    riskReason: "Single-source quote, low stock, and 20-week lead time.",
    riskBuckets: ["Supply", "Cost", "Data Quality"],
    benchmarkPrice: 1.34,
    dataQuality: "Supplier quote lacks package suffix normalization.",
    alternatives: [
      {
        id: "u12-mx",
        mpn: "MX25L25645G",
        manufacturer: "Macronix",
        description: "Drop-in flash with stable supply and JEDEC compatibility",
        compatibility: "94%",
        price: 1.44,
        leadTime: "9 wks",
        availability: "High",
        tradeoff:
          "Best balance for this board: small firmware delta, much healthier stock, and better unit economics.",
      },
      {
        id: "u12-gd",
        mpn: "GD25B256EYIGR",
        manufacturer: "GigaDevice",
        description: "Aggressive-cost SPI NOR alternative",
        compatibility: "84%",
        price: 1.09,
        leadTime: "8 wks",
        availability: "High",
        tradeoff:
          "Lowest cost option, but QE bit behavior and erase timing need regression testing for OTA flows.",
      },
    ],
  },
  {
    id: "J1",
    name: "USB-C Connector",
    mpn: "DX07S024JJ1R1500",
    manufacturer: "JAE",
    description: "USB-C receptacle for data and power",
    packageType: "SMT",
    spec: "24-pin / mid-mount",
    qty: 1,
    unitPrice: 0.88,
    leadTime: "7 wks",
    availability: "Medium",
    aiStatus: "alternative",
    aiSummary: "Current connector is valid, but a lower-cost equivalent exists.",
    riskReason: "No critical risk. Opportunity is cost and AVL expansion.",
    riskBuckets: ["Cost", "Data Quality"],
    benchmarkPrice: 0.71,
    dataQuality: "Approved vendor list has only one normalized supplier PN.",
    alternatives: [
      {
        id: "j1-gct",
        mpn: "USB4085-GF-A",
        manufacturer: "GCT",
        description: "Field-proven USB-C connector in prior builds",
        compatibility: "97%",
        price: 0.73,
        leadTime: "6 wks",
        availability: "High",
        tradeoff:
          "Very safe change with small savings, but shell footprint tolerance should still be reviewed with ME.",
      },
    ],
  },
  {
    id: "U3",
    name: "Wi-Fi / BLE Module",
    mpn: "ESP32-S3-WROOM-1",
    manufacturer: "Espressif",
    description: "Wireless connectivity module",
    packageType: "Module",
    spec: "Wi-Fi 4 / BLE 5 / 16MB Flash",
    qty: 1,
    unitPrice: 3.92,
    leadTime: "6 wks",
    availability: "High",
    aiStatus: "good",
    aiSummary: "Healthy stock, good price stability, and no immediate action required.",
    riskReason: "No active risk flags.",
    riskBuckets: [],
    benchmarkPrice: 3.88,
    dataQuality: "AVL and lifecycle data are complete.",
    alternatives: [
      {
        id: "u3-c6",
        mpn: "ESP32-C6-WROOM-1",
        manufacturer: "Espressif",
        description: "Wi-Fi 6 capable follow-up option",
        compatibility: "73%",
        price: 4.26,
        leadTime: "9 wks",
        availability: "Medium",
        tradeoff:
          "Adds future-proof connectivity, but firmware and RF validation scope expands for little current benefit.",
      },
    ],
  },
  {
    id: "Y1",
    name: "40MHz TCXO",
    mpn: "ASVTX-14-40.000MHZ",
    manufacturer: "Abracon",
    description: "Reference clock for RF path",
    packageType: "3225",
    spec: "40MHz / 0.5ppm",
    qty: 1,
    unitPrice: 0.64,
    leadTime: "5 wks",
    availability: "High",
    aiStatus: "good",
    aiSummary: "Clock source is stable and already aligned with RF margin targets.",
    riskReason: "No active risk flags.",
    riskBuckets: [],
    benchmarkPrice: 0.62,
    dataQuality: "Electrical spec and supplier quote are complete.",
    alternatives: [
      {
        id: "y1-cost",
        mpn: "TXC 7A-40.000MAAE-T",
        manufacturer: "TXC",
        description: "Lower-cost crystal alternative",
        compatibility: "69%",
        price: 0.24,
        leadTime: "4 wks",
        availability: "High",
        tradeoff:
          "Saves cost, but downgrades jitter performance and may impact wireless sensitivity margins.",
      },
    ],
  },
  {
    id: "L2",
    name: "Power Inductor",
    mpn: "XAL5030-472MEC",
    manufacturer: "Coilcraft",
    description: "Buck converter inductor",
    packageType: "5030",
    spec: "4.7uH / 6.2A",
    qty: 1,
    unitPrice: 0.42,
    leadTime: "10 wks",
    availability: "Medium",
    aiStatus: "alternative",
    aiSummary: "Safe part, but there is room to save cost without hurting margin.",
    riskReason: "Opportunity is cost optimization only.",
    riskBuckets: ["Cost"],
    benchmarkPrice: 0.29,
    dataQuality: "AVL includes one alternate but no approved second source yet.",
    alternatives: [
      {
        id: "l2-sunlord",
        mpn: "SWPA5030S4R7NT",
        manufacturer: "Sunlord",
        description: "Lower-cost inductor used in a previous pilot build",
        compatibility: "90%",
        price: 0.28,
        leadTime: "7 wks",
        availability: "High",
        tradeoff:
          "Good cost reduction with acceptable electrical fit, but transient thermal margin should be rechecked.",
      },
    ],
  },
  {
    id: "D4",
    name: "ESD Protection Array",
    mpn: "TPD2EUSB30",
    manufacturer: "Texas Instruments",
    description: "USB ESD suppressor",
    packageType: "X2SON",
    spec: "2-channel / USB 3.0",
    qty: 1,
    unitPrice: 0.19,
    leadTime: "5 wks",
    availability: "High",
    aiStatus: "good",
    aiSummary: "Protection part is healthy and already approved.",
    riskReason: "No active risk flags.",
    riskBuckets: [],
    benchmarkPrice: 0.18,
    dataQuality: "Lifecycle and sourcing metadata are complete.",
    alternatives: [
      {
        id: "d4-nxp",
        mpn: "PESD5V0S2UT",
        manufacturer: "Nexperia",
        description: "Lower-cost 2-channel ESD option",
        compatibility: "93%",
        price: 0.12,
        leadTime: "6 wks",
        availability: "High",
        tradeoff:
          "Easy cost-down candidate, but clamp curve should be confirmed against the USB surge profile.",
      },
    ],
  },
];

const memoryRecords = [
  {
    id: "smart-sensor-v1",
    name: "Smart Sensor V1",
    similarity: "12 similar parts",
    substitutes: "4 substitutes approved",
    issue: "2 parts caused production delays",
    insight:
      "This design shares the same MCU, PMIC, flash, and USB-C families. The previous team already approved a GCT USB-C connector and a Macronix flash fallback.",
  },
  {
    id: "beacon-r2",
    name: "Factory Beacon R2",
    similarity: "7 power-tree matches",
    substitutes: "PMIC tuning notes available",
    issue: "No sourcing delays",
    insight:
      "Beacon R2 used the same inductor and a near-identical power architecture. Thermal re-check data can be reused if you switch the inductor vendor.",
  },
  {
    id: "monitor-mini",
    name: "Monitor Mini EVT",
    similarity: "5 RF path matches",
    substitutes: "1 RF crystal rejected",
    issue: "Clock downgrade hurt RF margin",
    insight:
      "A cheaper crystal was tested before and failed the RF sensitivity guard band. Keep the Abracon TCXO unless cost pressure is severe.",
  },
];

const quickPrompts = [
  "Which part has the highest risk?",
  "How much can this BOM save now?",
  "Why is this substitute recommended?",
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatMoney(value) {
  return currencyFormatter.format(value);
}

function formatSignedMoney(value) {
  if (value === 0) {
    return formatMoney(0);
  }

  return `${value > 0 ? "+" : "-"}${formatMoney(Math.abs(value))}`;
}

function getStatusMeta(status) {
  switch (status) {
    case "good":
      return { label: "Good", tone: "good" };
    case "alternative":
      return { label: "Optimizable", tone: "alt" };
    case "risk":
      return { label: "At Risk", tone: "risk" };
    case "bad":
      return { label: "Not Recommended", tone: "bad" };
    default:
      return { label: "Unknown", tone: "neutral" };
  }
}

function getAvailabilityTone(value) {
  if (value === "Allocated" || value === "Low") {
    return "bad";
  }

  if (value === "Medium") {
    return "warn";
  }

  return "good";
}

function getPartView(part, decisions) {
  const decision = decisions[part.id] ?? null;
  const acceptedOption =
    decision?.state === "accepted"
      ? part.alternatives.find((option) => option.id === decision.optionId) ?? null
      : null;
  const effectivePrice = acceptedOption?.price ?? part.unitPrice;
  const effectiveLeadTime = acceptedOption?.leadTime ?? part.leadTime;
  const effectiveAvailability = acceptedOption?.availability ?? part.availability;
  const effectiveMpn = acceptedOption?.mpn ?? part.mpn;
  const effectiveManufacturer = acceptedOption?.manufacturer ?? part.manufacturer;

  return {
    ...part,
    decision,
    acceptedOption,
    effectivePrice,
    effectiveLeadTime,
    effectiveAvailability,
    effectiveMpn,
    effectiveManufacturer,
    lineCost: effectivePrice * part.qty,
    baselineLineCost: part.unitPrice * part.qty,
  };
}

function buildCsv(parts) {
  const header = [
    "Ref",
    "Component",
    "MPN",
    "Manufacturer",
    "Qty",
    "Unit Price",
    "Lead Time",
    "Availability",
    "Decision",
  ];
  const rows = parts.map((part) => [
    part.id,
    part.name,
    part.effectiveMpn,
    part.effectiveManufacturer,
    part.qty,
    part.effectivePrice.toFixed(2),
    part.effectiveLeadTime,
    part.effectiveAvailability,
    part.decision?.state === "accepted"
      ? `Accepted ${part.acceptedOption?.mpn ?? ""}`
      : part.decision?.state === "rejected"
        ? "Rejected for now"
        : "Current BOM",
  ]);

  return [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

function downloadCsv(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="section-header">
      <div>
        <p className="section-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="section-description">{description}</p>
      </div>
      {actions ? <div className="section-actions">{actions}</div> : null}
    </header>
  );
}

function LockState({ title, description, actionLabel, onAction }) {
  return (
    <section className="panel lock-state">
      <span className="lock-badge">Locked</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel ? (
        <button type="button" className="primary-button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [currentProjectId, setCurrentProjectId] = useState(projectCards[0].id);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [parseState, setParseState] = useState("idle");
  const [parseProgress, setParseProgress] = useState(0);
  const [cleanGenerated, setCleanGenerated] = useState(false);
  const [riskReviewed, setRiskReviewed] = useState(false);
  const [costLocked, setCostLocked] = useState(false);
  const [exported, setExported] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState("U1");
  const [decisions, setDecisions] = useState({});
  const [preferences, setPreferences] = useState({
    buildMode: "demo",
    objective: "balanced",
  });
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text:
        "The AI Insight Panel is ready. After you upload a BOM, I will summarize risks, substitutes, and cost changes in real time.",
    },
  ]);

  useEffect(() => {
    if (parseState !== "parsing") {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setParseProgress((current) => Math.min(current + 8, 100));
    }, 180);

    return () => window.clearInterval(timer);
  }, [parseState]);

  useEffect(() => {
    if (parseState === "parsing" && parseProgress >= 100) {
      setParseState("done");
      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Parsing complete: 8 key parts extracted, and the Clean BOM is ready to generate.",
        },
      ]);
    }
  }, [parseProgress, parseState]);

  const parsedParts = baseParts.map((part) => getPartView(part, decisions));
  const selectedPart = parsedParts.find((part) => part.id === selectedPartId) ?? parsedParts[0];
  const riskyParts = parsedParts.filter(
    (part) => part.aiStatus === "risk" || part.aiStatus === "bad",
  );
  const decisionsMade = Object.keys(decisions).length;
  const acceptedCount = Object.values(decisions).filter(
    (decision) => decision.state === "accepted",
  ).length;
  const rejectedCount = Object.values(decisions).filter(
    (decision) => decision.state === "rejected",
  ).length;
  const unresolvedRiskCount = riskyParts.filter(
    (part) => decisions[part.id]?.state !== "accepted",
  ).length;

  const statusCounts = parsedParts.reduce(
    (counts, part) => {
      counts[part.aiStatus] += 1;
      return counts;
    },
    { good: 0, alternative: 0, risk: 0, bad: 0 },
  );

  const baselineMaterial = parsedParts.reduce(
    (total, part) => total + part.baselineLineCost,
    0,
  );
  const currentMaterial = parsedParts.reduce((total, part) => total + part.lineCost, 0);
  const shippingRate = preferences.buildMode === "product" ? 0.055 : 0.08;
  const baselineShipping = baselineMaterial * shippingRate;
  const currentShipping = currentMaterial * shippingRate;
  const taxRate = 0.09;
  const baselineTax = (baselineMaterial + baselineShipping) * taxRate;
  const currentTax = (currentMaterial + currentShipping) * taxRate;
  const baselineLanded = baselineMaterial + baselineShipping + baselineTax;
  const currentLanded = currentMaterial + currentShipping + currentTax;
  const landedDelta = currentLanded - baselineLanded;

  let workflowStage = "upload";
  if (parseState === "done") {
    workflowStage = "clean";
  }
  if (cleanGenerated) {
    workflowStage = "risk";
  }
  if (riskReviewed) {
    workflowStage = "substitute";
  }
  if (decisionsMade > 0) {
    workflowStage = "costed";
  }
  if (costLocked || exported) {
    workflowStage = "ready";
  }

  const workflowUnits =
    (parseState === "done" ? 1 : parseState === "parsing" ? parseProgress / 100 : 0) +
    Number(cleanGenerated) +
    Number(riskReviewed) +
    Number(decisionsMade > 0) +
    Number(costLocked) +
    Number(exported);
  const workflowProgress = Math.round((workflowUnits / workflowLabels.length) * 100);

  const currentProject = projectCards.find((project) => project.id === currentProjectId) ?? projectCards[0];
  const currentProjectStatus = exported
    ? "Exported for sourcing"
    : unresolvedRiskCount > 0
      ? "Needs engineering review"
      : "Ready for handoff";
  const currentProjectStep = exported
    ? "Production Ready BOM"
    : costLocked
      ? "Costed BOM"
      : decisionsMade > 0
        ? "Substitute Recommendation"
        : riskReviewed
          ? "Risk Review"
          : cleanGenerated
            ? "Clean BOM"
            : parseState === "done"
              ? "BOM Upload"
              : "Waiting for BOM";

  const projectList = projectCards.map((project) =>
    project.id === currentProjectId
      ? {
          ...project,
          bomStatus: currentProjectStatus,
          step: currentProjectStep,
          metrics: [
            `${parsedParts.length} line items`,
            `${unresolvedRiskCount} open risks`,
            `${workflowProgress}% workflow`,
          ],
        }
      : project,
  );

  const sectionAvailability = {
    dashboard: true,
    upload: true,
    clean: parseState === "done",
    risk: cleanGenerated,
    substitute: cleanGenerated,
    costed: cleanGenerated,
    ready: cleanGenerated,
    preferences: true,
    memory: true,
  };

  const topCostDrivers = [...parsedParts]
    .sort((left, right) => right.lineCost - left.lineCost)
    .slice(0, 3);

  const riskCards = [
    {
      label: "Supply Risk",
      value: parsedParts.filter((part) => part.riskBuckets.includes("Supply")).length,
      detail: "Long lead-time / low inventory / single-source",
    },
    {
      label: "Lifecycle Risk",
      value: parsedParts.filter((part) => part.riskBuckets.includes("Lifecycle")).length,
      detail: "EOL / NRND / new-design warnings",
    },
    {
      label: "Cost Risk",
      value: parsedParts.filter((part) => part.riskBuckets.includes("Cost")).length,
      detail: "Above benchmark / cost saving opportunity",
    },
    {
      label: "Data Quality Risk",
      value: parsedParts.filter((part) => part.riskBuckets.includes("Data Quality")).length,
      detail: "Incomplete supplier mapping or metadata gaps",
    },
  ];

  const readinessScore = Math.max(
    36,
    Math.min(
      98,
      56 +
        (parseState === "done" ? 8 : 0) +
        (cleanGenerated ? 10 : 0) +
        (riskReviewed ? 10 : 0) +
        (acceptedCount > 0 ? 8 : 0) +
        (costLocked ? 8 : 0) +
        (preferences.buildMode === "product" ? 4 : 0) -
        unresolvedRiskCount * 4 -
        rejectedCount * 2,
    ),
  );

  const readinessChecklist = [
    { label: "BOM parsed and normalized", done: parseState === "done" },
    { label: "Clean BOM generated", done: cleanGenerated },
    { label: "Risk review completed", done: riskReviewed },
    { label: "Substitute decisions recorded", done: decisionsMade > 0 },
    { label: "Landed cost locked", done: costLocked },
    { label: "Export package ready", done: exported },
  ];

  const openGaps = [];
  if (!cleanGenerated) {
    openGaps.push("The Clean BOM has not been generated yet.");
  }
  if (!riskReviewed) {
    openGaps.push("Risk Review is not complete, so supply and lifecycle risks are not yet closed.");
  }
  if (unresolvedRiskCount > 0) {
    openGaps.push(`${unresolvedRiskCount} high-risk parts are still unresolved or not accepted.`);
  }
  if (!costLocked) {
    openGaps.push(
      "The Costed BOM is not locked yet, so shipping and tax cannot be used as the handoff baseline.",
    );
  }
  if (openGaps.length === 0) {
    openGaps.push("There are no blocking issues. The BOM is ready for sourcing export.");
  }

  const summaryBullets = (() => {
    if (activeSection === "dashboard") {
      return [
        `${currentProject.name} is currently in the ${currentProjectStep} stage, and the overall workflow is ${workflowProgress}% complete.`,
        `${statusCounts.risk + statusCounts.bad} parts need focused review, and ${acceptedCount} substitutes have been accepted.`,
        `The current project preference is ${preferences.buildMode === "demo" ? "Demo" : "Product"} mode, with a ${
          preferences.objective === "lowest-cost"
            ? "lowest cost"
            : preferences.objective === "best-performance"
              ? "best performance"
              : "balanced objective"
        } objective.`,
      ];
    }

    if (activeSection === "upload") {
      if (parseState === "idle") {
        return [
          "After you upload Excel, PDF, or other supporting files, the system automatically extracts fields such as part, price, manufacturer, and package.",
          "The Clean BOM and the downstream risk, substitute, and cost modules unlock only after parsing completes.",
        ];
      }

      if (parseState === "parsing") {
        return [
          `Parsing ${uploadedFileName}. Current progress: ${parseProgress}%.`,
          "The system is normalizing MPN, manufacturer, price, and availability fields to generate a component-level Clean BOM.",
        ];
      }

      return [
        `${parsedParts.length} key parts have been identified, with extracted fields for price, manufacturer, package, lead time, and availability.`,
        "Recommended next step: generate the Clean BOM so AI can evaluate component quality and substitute opportunities line by line.",
      ];
    }

    if (activeSection === "clean") {
      const statusMeta = getStatusMeta(selectedPart.aiStatus);
      return [
        `Currently selected: ${selectedPart.id} ${selectedPart.name}. AI status: ${statusMeta.label}.`,
        `${statusCounts.good} parts are healthy, ${statusCounts.alternative} parts are optimizable, and ${
          statusCounts.risk + statusCounts.bad
        } parts need immediate attention.`,
        selectedPart.aiSummary,
      ];
    }

    if (activeSection === "risk") {
      return [
        `There are ${unresolvedRiskCount} unresolved high-risk parts, and the top priority is ${riskyParts[0]?.id ?? selectedPart.id}.`,
        "Risk Review covers four issue groups: Supply, Lifecycle, Cost, and Data Quality.",
        `The current top cost driver is ${topCostDrivers[0]?.name ?? "N/A"}, with a line cost of ${formatMoney(
          topCostDrivers[0]?.lineCost ?? 0,
        )}.`,
      ];
    }

    if (activeSection === "substitute") {
      return [
        `Risk reason for ${selectedPart.id}: ${selectedPart.riskReason}`,
        selectedPart.acceptedOption
          ? `The substitute ${selectedPart.acceptedOption.mpn} has already been accepted.`
          : "No substitute has been confirmed yet for this high-risk part.",
        selectedPart.alternatives[0]?.tradeoff ?? "No tradeoff note is available yet.",
      ];
    }

    if (activeSection === "costed") {
      return [
        `Current landed cost is ${formatMoney(currentLanded)} versus the baseline ${formatSignedMoney(
          landedDelta,
        )}.`,
        `Shipping is estimated at ${Math.round(shippingRate * 100)}% and tax is modeled at ${Math.round(taxRate * 100)}%.`,
        `The three most expensive parts are ${topCostDrivers.map((part) => part.id).join(" / ")}.`,
      ];
    }

    if (activeSection === "ready") {
      return [
        `Production readiness score is ${readinessScore}/100.`,
        openGaps[0],
        exported
          ? "The final BOM has been exported and can be used for sourcing handoff."
          : "Before exporting, confirm that risk actions are closed and the landed cost is locked.",
      ];
    }

    if (activeSection === "preferences") {
      return [
        `Current mode: ${preferences.buildMode === "demo" ? "Demo" : "Product"}.`,
        `Optimization objective: ${
          preferences.objective === "lowest-cost"
            ? "lowest cost"
            : preferences.objective === "best-performance"
              ? "best performance"
              : "balanced cost and performance"
        }.`,
        "Preferences affect risk prioritization, substitute recommendations, and cost tolerance.",
      ];
    }

    return [
      memoryRecords[0].insight,
      memoryRecords[1].insight,
      "Company memory brings previously approved substitutes and past production-delay lessons back into the current project.",
    ];
  })();

  function resetWorkflowAfterUpload(fileName) {
    setUploadedFileName(fileName);
    setParseState("parsing");
    setParseProgress(0);
    setCleanGenerated(false);
    setRiskReviewed(false);
    setCostLocked(false);
    setExported(false);
    setSelectedPartId(riskyParts[0]?.id ?? "U1");
    setDecisions({});
    setActiveSection("upload");
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    resetWorkflowAfterUpload(file.name);
    setChatMessages((current) => [
      ...current,
      {
        role: "assistant",
        text: `Received ${file.name}. Starting automatic analysis of the BOM and supporting documents.`,
      },
    ]);
  }

  function handleGenerateCleanBom() {
    setCleanGenerated(true);
    setActiveSection("clean");
    setChatMessages((current) => [
      ...current,
      {
        role: "assistant",
        text:
          "The Clean BOM has been generated. You can now review each component line by line and move into Risk Review.",
      },
    ]);
  }

  function handleMarkRiskReviewed() {
    setRiskReviewed(true);
    setActiveSection("substitute");
    setChatMessages((current) => [
      ...current,
      {
        role: "assistant",
        text: "Risk Review is complete. Start substitute decisions with the NOR Flash and MCU.",
      },
    ]);
  }

  function handleAcceptAlternative(optionId) {
    setDecisions((current) => ({
      ...current,
      [selectedPart.id]: {
        state: "accepted",
        optionId,
      },
    }));
    setCostLocked(false);
    setExported(false);
    setChatMessages((current) => [
      ...current,
      {
        role: "assistant",
        text: `The substitute for ${selectedPart.id} has been accepted. Costed BOM will be recalculated using the new unit price and lead time.`,
      },
    ]);
  }

  function handleRejectCurrentPart() {
    setDecisions((current) => ({
      ...current,
      [selectedPart.id]: {
        state: "rejected",
        optionId: null,
      },
    }));
    setCostLocked(false);
    setExported(false);
    setChatMessages((current) => [
      ...current,
      {
        role: "assistant",
        text: `Recorded ${selectedPart.id} as no substitute for now. This risk will remain in the Ready-stage gap list.`,
      },
    ]);
  }

  function handleLockCostedBom() {
    setCostLocked(true);
    setActiveSection("ready");
    setChatMessages((current) => [
      ...current,
      {
        role: "assistant",
        text: `The Costed BOM is locked. Current landed cost is ${formatMoney(currentLanded)}.`,
      },
    ]);
  }

  function handleExportBom() {
    const csv = buildCsv(parsedParts);
    downloadCsv(`production-ready-bom-${currentProjectId}.csv`, csv);
    setExported(true);
    setChatMessages((current) => [
      ...current,
      {
        role: "assistant",
        text: "The Production Ready BOM has been exported. The demo workflow is now complete.",
      },
    ]);
  }

  function generateAssistantReply(message) {
    const normalized = message.trim().toLowerCase();

    if (!normalized) {
      return "Tell me whether you want to review risk, substitutes, or cost.";
    }

    if (normalized.includes("risk")) {
      const topRisk = riskyParts[0] ?? selectedPart;
      return `The highest-priority risk is ${topRisk.id} ${topRisk.name}. Reason: ${topRisk.riskReason}`;
    }

    if (
      normalized.includes("cost") ||
      normalized.includes("price") ||
      normalized.includes("save")
    ) {
      return `The current landed cost is ${formatMoney(currentLanded)}, versus the baseline ${formatSignedMoney(
        landedDelta,
      )}. The biggest cost driver is ${topCostDrivers[0]?.id ?? "N/A"}.`;
    }

    if (
      normalized.includes("substitute") ||
      normalized.includes("alternative") ||
      normalized.includes("tradeoff")
    ) {
      const primaryOption = selectedPart.alternatives[0];
      return primaryOption
        ? `For ${selectedPart.id}, the leading substitute is ${primaryOption.mpn}. Tradeoff: ${primaryOption.tradeoff}`
        : `${selectedPart.id} currently has no substitute candidates.`;
    }

    if (
      normalized.includes("memory") ||
      normalized.includes("history") ||
      normalized.includes("previous")
    ) {
      return memoryRecords[0].insight;
    }

    return `I am tracking ${currentProject.name} in the ${currentProjectStep} stage. If you want to keep moving, the next recommended screen is ${workflowStage === "upload" ? "Upload" : workflowStage === "clean" ? "Clean BOM" : workflowStage === "risk" ? "Risk Review" : workflowStage === "substitute" ? "Substitute Recommendation" : workflowStage === "costed" ? "Costed BOM" : "Production Ready BOM"}.`;
  }

  function handleChatSubmit(event) {
    event.preventDefault();

    const message = chatInput.trim();

    if (!message) {
      return;
    }

    const reply = generateAssistantReply(message);
    setChatMessages((current) => [
      ...current,
      { role: "user", text: message },
      { role: "assistant", text: reply },
    ]);
    setChatInput("");
  }

  function handleQuickPrompt(prompt) {
    const reply = generateAssistantReply(prompt);
    setChatMessages((current) => [
      ...current,
      { role: "user", text: prompt },
      { role: "assistant", text: reply },
    ]);
  }

  let sectionContent = null;

  if (activeSection === "dashboard") {
    sectionContent = (
      <div className="view-stack">
        <section className="panel hero-panel">
          <SectionHeader
            eyebrow="Project Control"
            title={currentProject.name}
            description="Chain BOM upload, cleanup, risk review, substitute recommendation, costing, and ready-to-export output into a single demo workflow."
            actions={
              <>
                <span className="badge-pill strong">{currentProjectStatus}</span>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setActiveSection(parseState === "done" ? "clean" : "upload")}
                >
                  {parseState === "done" ? "Continue BOM Workflow" : "Start BOM Upload"}
                </button>
              </>
            }
          />

          <div className="metric-grid large">
            <article className="metric-card highlight">
              <span>Workflow</span>
              <strong>{workflowProgress}%</strong>
              <p>Overall progress from Upload to Export.</p>
            </article>
            <article className="metric-card">
              <span>High-risk parts</span>
              <strong>{statusCounts.risk + statusCounts.bad}</strong>
              <p>Number of parts that should be prioritized in Risk Review and Substitute.</p>
            </article>
            <article className="metric-card">
              <span>Projected landed cost</span>
              <strong>{formatMoney(currentLanded)}</strong>
              <p>Estimated total cost including shipping and tax.</p>
            </article>
            <article className="metric-card">
              <span>Production score</span>
              <strong>{readinessScore}/100</strong>
              <p>Readiness score based on the current risk and decision state.</p>
            </article>
          </div>
        </section>

        <div className="content-grid two-column">
          <section className="panel">
            <SectionHeader
              eyebrow="Project List"
              title="BOM Project Dashboard"
              description="Show project names, BOM status, key metrics, and the current processing stage in a card layout."
            />
            <div className="project-list">
              {projectList.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className={`project-card ${project.id === currentProjectId ? "active" : ""}`}
                  onClick={() => setCurrentProjectId(project.id)}
                >
                  <div className="project-card-top">
                    <div>
                      <strong>{project.name}</strong>
                      <p>{project.note}</p>
                    </div>
                    <span className="badge-pill">{project.bomStatus}</span>
                  </div>
                  <div className="chip-row">
                    {project.metrics.map((metric) => (
                      <span key={metric} className="chip">
                        {metric}
                      </span>
                    ))}
                  </div>
                  <div className="project-card-footer">
                    <span>Current step</span>
                    <strong>{project.step}</strong>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <SectionHeader
              eyebrow="Execution"
              title="Next Recommended Actions"
              description="Turn the README workflow into clickable entry points."
            />
            <div className="action-timeline">
              {workflowLabels.map((step, index) => {
                const isDone =
                  (step.id === "upload" && parseState === "done") ||
                  (step.id === "clean" && cleanGenerated) ||
                  (step.id === "risk" && riskReviewed) ||
                  (step.id === "substitute" && decisionsMade > 0) ||
                  (step.id === "costed" && costLocked) ||
                  (step.id === "ready" && exported);
                const isActive = workflowStage === step.id;

                return (
                  <div
                    key={step.id}
                    className={`timeline-step ${isDone ? "done" : ""} ${
                      isActive ? "active" : ""
                    }`}
                  >
                    <span>{`0${index + 1}`}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>
                        {step.id === "upload"
                          ? "Import the BOM and supporting files."
                          : step.id === "clean"
                            ? "Clean component fields and add AI review."
                            : step.id === "risk"
                              ? "Identify Supply / Lifecycle / Cost / Data issues."
                              : step.id === "substitute"
                                ? "Confirm substitutes for high-risk parts."
                                : step.id === "costed"
                                  ? "Calculate landed cost."
                                  : "Export the Production Ready BOM."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (activeSection === "upload") {
    sectionContent = (
      <div className="view-stack">
        <div className="content-grid two-column">
          <section className="panel">
            <SectionHeader
              eyebrow="Step 01"
              title="BOM Upload"
              description="Upload BOMs, AVLs, supplier quotes, PDF datasheets, and similar files for automatic analysis and field extraction."
            />

            <label className="upload-dropzone">
              <input type="file" accept=".xlsx,.xls,.csv,.pdf,.png,.jpg" onChange={handleFileChange} />
              <span className="dropzone-kicker">Drop files or click to upload</span>
              <strong>{uploadedFileName || "customer-bom.xlsx / supplier quote.pdf"}</strong>
              <p>
                Supports Excel, CSV, PDF, and screenshot-based supporting materials.
                Uploading starts the analysis flow automatically.
              </p>
            </label>

            <div className="progress-box">
              <div className="progress-meta">
                <span>Auto parsing pipeline</span>
                <strong>
                  {parseState === "idle" ? "Idle" : parseState === "parsing" ? `${parseProgress}%` : "Done"}
                </strong>
              </div>
              <div className="progress-rail">
                <div
                  className="progress-fill"
                  style={{
                    width:
                      parseState === "idle"
                        ? "6%"
                        : parseState === "done"
                          ? "100%"
                          : `${parseProgress}%`,
                  }}
                />
              </div>
            </div>

            <div className="metric-grid">
              <article className="metric-card compact">
                <span>Rows detected</span>
                <strong>{parseState === "done" ? parsedParts.length : "--"}</strong>
              </article>
              <article className="metric-card compact">
                <span>Attached docs</span>
                <strong>{uploadedFileName ? "03" : "--"}</strong>
              </article>
              <article className="metric-card compact">
                <span>Parser state</span>
                <strong>
                  {parseState === "idle" ? "Idle" : parseState === "parsing" ? "Running" : "Ready"}
                </strong>
              </article>
            </div>
          </section>

          <section className="panel">
            <SectionHeader
              eyebrow="Extraction"
              title="Recognized Fields"
              description="Automatically normalize component fields after upload to prepare the Clean BOM input."
              actions={
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleGenerateCleanBom}
                  disabled={parseState !== "done"}
                >
                  Generate Clean BOM
                </button>
              }
            />

            <div className="chip-row">
              <span className="chip strong">Part Number</span>
              <span className="chip strong">Manufacturer</span>
              <span className="chip strong">Description</span>
              <span className="chip strong">Package</span>
              <span className="chip strong">Price</span>
              <span className="chip strong">Lead Time</span>
              <span className="chip strong">Availability</span>
            </div>

            <div className="data-list">
              {[
                `${uploadedFileName || "customer-bom.xlsx"} -> line-item table`,
                "supplier-quote.pdf -> price and MOQ extraction",
                "layout-note.png -> package / orientation hints",
              ].map((item) => (
                <div key={item} className="data-row">
                  <span className="data-dot" />
                  <p>{item}</p>
                </div>
              ))}
            </div>

            <div className="callout">
              <strong>The Clean BOM button unlocks only after parsing is complete.</strong>
              <p>
                This area simulates the automatic analysis stage so that Clean BOM, Risk
                Review, and Substitute Recommendation all start from one normalized data
                model.
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (activeSection === "clean") {
    sectionContent = sectionAvailability.clean ? (
      <div className="view-stack">
        <div className="content-grid detail-layout">
          <section className="panel">
            <SectionHeader
              eyebrow="Step 02"
              title="Clean BOM"
              description="Show each component row in a list view, with AI labels such as Good, Optimizable, At Risk, and Not Recommended."
            />

            <div className="table-shell clean-table">
              <div className="table-row head">
                <span>Ref</span>
                <span>Component</span>
                <span>Manufacturer</span>
                <span>Qty</span>
                <span>Unit Cost</span>
                <span>Lead Time</span>
                <span>AI Review</span>
              </div>
              {parsedParts.map((part) => {
                const statusMeta = getStatusMeta(part.aiStatus);

                return (
                  <button
                    key={part.id}
                    type="button"
                    className={`table-row interactive ${part.id === selectedPart.id ? "active" : ""}`}
                    onClick={() => setSelectedPartId(part.id)}
                  >
                    <span>{part.id}</span>
                    <span>
                      <strong>{part.name}</strong>
                      <em>{part.mpn}</em>
                    </span>
                    <span>{part.manufacturer}</span>
                    <span>{part.qty}</span>
                    <span>{formatMoney(part.unitPrice)}</span>
                    <span>{part.leadTime}</span>
                    <span>
                      <i className={`status-pill ${statusMeta.tone}`}>{statusMeta.label}</i>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="panel sticky-panel">
            <SectionHeader
              eyebrow="Selected Part"
              title={`${selectedPart.id} ${selectedPart.name}`}
              description="Open an AI review to see the detailed reasoning for the part and the recommended next action."
            />

            <div className="spec-grid">
              <div>
                <span>MPN</span>
                <strong>{selectedPart.mpn}</strong>
              </div>
              <div>
                <span>Manufacturer</span>
                <strong>{selectedPart.manufacturer}</strong>
              </div>
              <div>
                <span>Package</span>
                <strong>{selectedPart.packageType}</strong>
              </div>
              <div>
                <span>Spec</span>
                <strong>{selectedPart.spec}</strong>
              </div>
              <div>
                <span>Price</span>
                <strong>{formatMoney(selectedPart.unitPrice)}</strong>
              </div>
              <div>
                <span>Lead Time</span>
                <strong>{selectedPart.leadTime}</strong>
              </div>
            </div>

            <div className="review-card">
              <div className="review-top">
                <i className={`status-pill ${getStatusMeta(selectedPart.aiStatus).tone}`}>
                  {getStatusMeta(selectedPart.aiStatus).label}
                </i>
                <span className={`availability-chip ${getAvailabilityTone(selectedPart.availability)}`}>
                  {selectedPart.availability}
                </span>
              </div>
              <p>{selectedPart.aiSummary}</p>
              <small>{selectedPart.dataQuality}</small>
            </div>

            <div className="button-stack">
              <button type="button" className="primary-button" onClick={() => setActiveSection("risk")}>
                Open Risk Review
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSelectedPartId(selectedPart.id);
                  setActiveSection("substitute");
                }}
              >
                View Substitute
              </button>
            </div>
          </aside>
        </div>
      </div>
    ) : (
      <LockState
        title="Clean BOM is still locked"
        description="Upload and finish BOM parsing first. Only then can the system generate a Clean BOM with AI annotations."
        actionLabel="Go to Upload"
        onAction={() => setActiveSection("upload")}
      />
    );
  }

  if (activeSection === "risk") {
    sectionContent = sectionAvailability.risk ? (
      <div className="view-stack">
        <section className="panel">
          <SectionHeader
            eyebrow="Step 03"
            title="Risk Review"
            description="After Clean BOM, review Supply, Lifecycle, Cost, and Data Quality risks in one place."
            actions={
              <button type="button" className="primary-button" onClick={handleMarkRiskReviewed}>
                Complete Risk Review
              </button>
            }
          />

          <div className="metric-grid">
            {riskCards.map((card) => (
              <article key={card.label} className="metric-card">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="content-grid two-column">
          <section className="panel">
            <SectionHeader
              eyebrow="Risk Queue"
              title="Flagged Components"
              description="Click a high-risk part to inspect the detailed reason and next action."
            />
            <div className="queue-list">
              {riskyParts.map((part) => (
                <button
                  key={part.id}
                  type="button"
                  className={`queue-card ${part.id === selectedPart.id ? "active" : ""}`}
                  onClick={() => setSelectedPartId(part.id)}
                >
                  <div className="queue-card-top">
                    <strong>
                      {part.id} {part.name}
                    </strong>
                    <i className={`status-pill ${getStatusMeta(part.aiStatus).tone}`}>
                      {getStatusMeta(part.aiStatus).label}
                    </i>
                  </div>
                  <p>{part.riskReason}</p>
                  <div className="chip-row">
                    {part.riskBuckets.map((bucket) => (
                      <span key={bucket} className="chip">
                        {bucket}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <aside className="panel sticky-panel">
            <SectionHeader
              eyebrow="Risk Detail"
              title={`${selectedPart.id} ${selectedPart.name}`}
              description="This matches the high-risk part drill-down described in the README."
            />
            <div className="review-card critical">
              <p>{selectedPart.riskReason}</p>
              <small>{selectedPart.aiSummary}</small>
            </div>
            <div className="spec-grid">
              <div>
                <span>Price vs benchmark</span>
                <strong>{formatSignedMoney(selectedPart.unitPrice - selectedPart.benchmarkPrice)}</strong>
              </div>
              <div>
                <span>Availability</span>
                <strong>{selectedPart.availability}</strong>
              </div>
              <div>
                <span>Lead Time</span>
                <strong>{selectedPart.leadTime}</strong>
              </div>
              <div>
                <span>Data Quality</span>
                <strong>{selectedPart.dataQuality}</strong>
              </div>
            </div>
            <div className="button-stack">
              <button
                type="button"
                className="primary-button"
                onClick={() => setActiveSection("substitute")}
              >
                Review Substitute
              </button>
              <button type="button" className="secondary-button" onClick={() => setActiveSection("costed")}>
                Open Costed BOM
              </button>
            </div>
          </aside>
        </div>
      </div>
    ) : (
      <LockState
        title="Risk Review cannot start yet"
        description="Generate the Clean BOM first, then move into risk review."
        actionLabel="Open Clean BOM"
        onAction={() => setActiveSection("clean")}
      />
    );
  }

  if (activeSection === "substitute") {
    sectionContent = sectionAvailability.substitute ? (
      <div className="view-stack">
        <section className="panel">
          <SectionHeader
            eyebrow="Step 04"
            title="Substitute Recommendation"
            description="After a user opens a high-risk part, show the original part details, recommended substitutes, and the AI tradeoff explanation."
          />
          <div className="part-switcher">
            {riskyParts.map((part) => (
              <button
                key={part.id}
                type="button"
                className={`switch-chip ${part.id === selectedPart.id ? "active" : ""}`}
                onClick={() => setSelectedPartId(part.id)}
              >
                {part.id} {part.name}
              </button>
            ))}
          </div>
        </section>

        <div className="content-grid two-column">
          <section className="panel">
            <SectionHeader
              eyebrow="Original Part"
              title={`${selectedPart.id} ${selectedPart.name}`}
              description="The Original Part area includes MPN, manufacturer, description, package, spec, price, lead time, availability, and the risk reason."
            />

            <div className="spec-grid">
              <div>
                <span>MPN</span>
                <strong>{selectedPart.mpn}</strong>
              </div>
              <div>
                <span>Manufacturer</span>
                <strong>{selectedPart.manufacturer}</strong>
              </div>
              <div>
                <span>Description</span>
                <strong>{selectedPart.description}</strong>
              </div>
              <div>
                <span>Package</span>
                <strong>{selectedPart.packageType}</strong>
              </div>
              <div>
                <span>Spec</span>
                <strong>{selectedPart.spec}</strong>
              </div>
              <div>
                <span>Price</span>
                <strong>{formatMoney(selectedPart.unitPrice)}</strong>
              </div>
              <div>
                <span>Lead Time</span>
                <strong>{selectedPart.leadTime}</strong>
              </div>
              <div>
                <span>Availability</span>
                <strong>{selectedPart.availability}</strong>
              </div>
            </div>

            <div className="decision-banner">
              <span>Decision</span>
              <strong>
                {selectedPart.decision?.state === "accepted"
                  ? `Accepted ${selectedPart.acceptedOption?.mpn ?? ""}`
                  : selectedPart.decision?.state === "rejected"
                    ? "Rejected for now"
                    : "Pending"}
              </strong>
              <p>{selectedPart.riskReason}</p>
            </div>

            <button type="button" className="secondary-button danger-button" onClick={handleRejectCurrentPart}>
              Reject for now
            </button>
          </section>

          <section className="panel">
            <SectionHeader
              eyebrow="Recommended Alternatives"
              title="AI Tradeoff Explanation"
              description="AI does more than list substitutes. It explains the tradeoff across compatibility, cost, lead time, and availability."
            />

            <div className="option-list">
              {selectedPart.alternatives.map((option, index) => (
                <article key={option.id} className="option-card">
                  <div className="option-top">
                    <div>
                      <strong>{option.mpn}</strong>
                      <p>{option.manufacturer}</p>
                    </div>
                    <span className={`option-tag ${index === 0 ? "primary" : ""}`}>
                      {index === 0 ? "Recommended" : "Alternate"}
                    </span>
                  </div>

                  <div className="spec-grid compact-grid">
                    <div>
                      <span>Compatibility</span>
                      <strong>{option.compatibility}</strong>
                    </div>
                    <div>
                      <span>Cost Impact</span>
                      <strong className={option.price <= selectedPart.unitPrice ? "delta-down" : "delta-up"}>
                        {formatSignedMoney(option.price - selectedPart.unitPrice)}
                      </strong>
                    </div>
                    <div>
                      <span>Lead Time</span>
                      <strong>{option.leadTime}</strong>
                    </div>
                    <div>
                      <span>Availability</span>
                      <strong>{option.availability}</strong>
                    </div>
                  </div>

                  <p className="tradeoff-copy">{option.tradeoff}</p>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => handleAcceptAlternative(option.id)}
                  >
                    Accept Substitute
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    ) : (
      <LockState
        title="The substitute screen is still locked"
        description="Finish the Clean BOM first, ideally complete Risk Review as well, and then process substitute recommendations for high-risk parts."
        actionLabel="Open Risk Review"
        onAction={() => setActiveSection("risk")}
      />
    );
  }

  if (activeSection === "costed") {
    sectionContent = sectionAvailability.costed ? (
      <div className="view-stack">
        <section className="panel">
          <SectionHeader
            eyebrow="Step 05"
            title="Costed BOM"
            description="Show the cost of each part and the overall landed cost, including shipping and tax."
            actions={
              <button type="button" className="primary-button" onClick={handleLockCostedBom}>
                Lock Costed BOM
              </button>
            }
          />

          <div className="metric-grid">
            <article className="metric-card">
              <span>Material subtotal</span>
              <strong>{formatMoney(currentMaterial)}</strong>
              <p>Line-item subtotal for the current BOM.</p>
            </article>
            <article className="metric-card">
              <span>Shipping</span>
              <strong>{formatMoney(currentShipping)}</strong>
              <p>{Math.round(shippingRate * 100)}% logistics estimate。</p>
            </article>
            <article className="metric-card">
              <span>Tax</span>
              <strong>{formatMoney(currentTax)}</strong>
              <p>{Math.round(taxRate * 100)}% blended duty and tax。</p>
            </article>
            <article className="metric-card highlight">
              <span>Landed delta</span>
              <strong className={landedDelta <= 0 ? "delta-down" : "delta-up"}>
                {formatSignedMoney(landedDelta)}
              </strong>
              <p>Total cost delta versus the baseline BOM.</p>
            </article>
          </div>
        </section>

        <div className="content-grid cost-layout">
          <section className="panel">
            <SectionHeader
              eyebrow="Line Items"
              title="Detailed Cost Table"
              description="Each row represents one component. Accepted substitutes automatically switch to the new pricing and supply data."
            />
            <div className="table-shell cost-table">
              <div className="table-row head">
                <span>Ref</span>
                <span>Effective Part</span>
                <span>Qty</span>
                <span>Unit Price</span>
                <span>Line Total</span>
                <span>Source</span>
              </div>
              {parsedParts.map((part) => (
                <div key={part.id} className={`table-row ${part.acceptedOption ? "changed" : ""}`}>
                  <span>{part.id}</span>
                  <span>
                    <strong>{part.effectiveMpn}</strong>
                    <em>{part.effectiveManufacturer}</em>
                  </span>
                  <span>{part.qty}</span>
                  <span>{formatMoney(part.effectivePrice)}</span>
                  <span>{formatMoney(part.lineCost)}</span>
                  <span>{part.acceptedOption ? "Accepted substitute" : "Current BOM"}</span>
                </div>
              ))}
            </div>
          </section>

          <aside className="panel sticky-panel">
            <SectionHeader
              eyebrow="Cost Focus"
              title="Top 3 Cost Drivers"
              description="Entry point for the README topics around top cost drivers, benchmark pricing, and cost-saving opportunities."
            />
            <div className="rank-list">
              {topCostDrivers.map((part, index) => (
                <div key={part.id} className="rank-item">
                  <span>{`#${index + 1}`}</span>
                  <div>
                    <strong>
                      {part.id} {part.name}
                    </strong>
                    <p>{formatMoney(part.lineCost)} landed material impact</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="callout">
              <strong>Current landed total: {formatMoney(currentLanded)}</strong>
              <p>
                Baseline BOM landed total is {formatMoney(baselineLanded)}, and the current
                delta is{" "}
                <span className={landedDelta <= 0 ? "delta-down" : "delta-up"}>
                  {formatSignedMoney(landedDelta)}
                </span>
                .
              </p>
            </div>
          </aside>
        </div>
      </div>
    ) : (
      <LockState
        title="Costed BOM is not available yet"
        description="Generate the Clean BOM first, then complete at least one round of risk and substitute analysis before using the cost page."
        actionLabel="Open Substitute"
        onAction={() => setActiveSection("substitute")}
      />
    );
  }

  if (activeSection === "ready") {
    sectionContent = sectionAvailability.ready ? (
      <div className="view-stack">
        <div className="content-grid two-column">
          <section className="panel">
            <SectionHeader
              eyebrow="Step 06"
              title="Production Ready BOM"
              description="Score the full BOM, show what is still missing, and let the user export once satisfied."
            />

            <div className="score-panel">
              <div className="score-ring">
                <span>{readinessScore}</span>
                <small>/100</small>
              </div>
              <div className="score-copy">
                <strong>{unresolvedRiskCount > 0 ? "Still needs review" : "Ready for export"}</strong>
                <p>
                  The score combines parsing completeness, risk handling, substitute
                  decisions, cost lock status, and any unresolved issues.
                </p>
              </div>
            </div>

            <div className="check-list">
              {readinessChecklist.map((item) => (
                <div key={item.label} className={`check-item ${item.done ? "done" : ""}`}>
                  <span>{item.done ? "Done" : "Open"}</span>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <SectionHeader
              eyebrow="Open Gaps"
              title="What is still missing?"
              description="If any high-risk parts remain unresolved or the cost is not locked, this panel calls that out explicitly."
            />

            <div className="gap-list">
              {openGaps.map((gap) => (
                <div key={gap} className="gap-item">
                  <span />
                  <p>{gap}</p>
                </div>
              ))}
            </div>

            <div className="button-stack">
              <button
                type="button"
                className="primary-button"
                onClick={handleExportBom}
                disabled={!costLocked}
              >
                Export BOM
              </button>
              <button type="button" className="secondary-button" onClick={() => setActiveSection("costed")}>
                Back to Costed BOM
              </button>
            </div>
          </section>
        </div>
      </div>
    ) : (
      <LockState
        title="Production Ready BOM is not ready yet"
        description="Finish Upload and Clean BOM first, then move through the risk, substitute, and cost stages."
        actionLabel="Go to Dashboard"
        onAction={() => setActiveSection("dashboard")}
      />
    );
  }

  if (activeSection === "preferences") {
    sectionContent = (
      <div className="view-stack">
        <div className="content-grid two-column">
          <section className="panel">
            <SectionHeader
              eyebrow="Project Setting"
              title="Preferences"
              description="Choose whether each project is a demo or a product workflow, and whether the target is best performance or lowest cost."
            />

            <div className="setting-group">
              <h3>Build Mode</h3>
              <div className="choice-grid">
                {[
                  {
                    id: "demo",
                    title: "Demo",
                    detail: "Emphasize workflow storytelling, AI explanation, and staged handoff.",
                  },
                  {
                    id: "product",
                    title: "Product",
                    detail: "Emphasize purchasability, risk closure, and production handoff.",
                  },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`choice-card ${
                      preferences.buildMode === option.id ? "selected" : ""
                    }`}
                    onClick={() =>
                      setPreferences((current) => ({
                        ...current,
                        buildMode: option.id,
                      }))
                    }
                  >
                    <strong>{option.title}</strong>
                    <p>{option.detail}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <h3>Optimization Objective</h3>
              <div className="choice-grid">
                {[
                  {
                    id: "lowest-cost",
                    title: "Lowest Cost",
                    detail: "Drive unit price and landed cost as low as possible.",
                  },
                  {
                    id: "balanced",
                    title: "Balanced",
                    detail: "Balance cost, supply health, and engineering change scope.",
                  },
                  {
                    id: "best-performance",
                    title: "Best Performance",
                    detail: "Prioritize specification and supply flexibility, even at a higher cost.",
                  },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`choice-card ${
                      preferences.objective === option.id ? "selected" : ""
                    }`}
                    onClick={() =>
                      setPreferences((current) => ({
                        ...current,
                        objective: option.id,
                      }))
                    }
                  >
                    <strong>{option.title}</strong>
                    <p>{option.detail}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="panel">
            <SectionHeader
              eyebrow="Active Policy"
              title="What AI will optimize for"
              description="Preferences influence risk framing, substitute recommendations, and cost tolerance."
            />
            <div className="policy-card">
              <strong>
                {preferences.buildMode === "demo" ? "Demo story mode" : "Production handoff mode"}
              </strong>
              <p>
                {preferences.buildMode === "demo"
                  ? "It puts more emphasis on stage-by-stage reasoning, risk narration, and presentation rhythm."
                  : "It puts more emphasis on closure, purchasability, historical reuse, and final export."}
              </p>
            </div>
            <div className="policy-card">
              <strong>
                {preferences.objective === "lowest-cost"
                  ? "Cost-first policy"
                  : preferences.objective === "best-performance"
                    ? "Performance-first policy"
                    : "Balanced policy"}
              </strong>
              <p>
                {preferences.objective === "lowest-cost"
                  ? "Prioritize lower BOM and landed cost, while allowing a moderate amount of engineering validation."
                  : preferences.objective === "best-performance"
                    ? "Prioritize high compatibility, short lead time, and supply flexibility, even if the unit price rises."
                    : "Aim for a middle ground between cost reduction and minimal engineering disruption."}
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (activeSection === "memory") {
    sectionContent = (
      <div className="view-stack">
        <section className="panel">
          <SectionHeader
            eyebrow="Company Memory"
            title="Historical BOM Intelligence"
            description="When a user uploads a new BOM, the system brings forward similar projects, approved substitutes, and issues that previously caused delays."
          />
          <blockquote className="memory-quote">
            This design uses 12 parts similar to your previous Smart Sensor V1 BOM. 4
            substitutes were previously approved by your engineering team. 2 parts caused
            production delays last time.
          </blockquote>
        </section>

        <div className="content-grid two-column">
          <section className="panel">
            <SectionHeader
              eyebrow="Matched Projects"
              title="Reusable Knowledge"
              description="Historical project cards can become contextual memory for a new BOM."
            />
            <div className="memory-list">
              {memoryRecords.map((record) => (
                <article key={record.id} className="memory-card">
                  <strong>{record.name}</strong>
                  <div className="chip-row">
                    <span className="chip">{record.similarity}</span>
                    <span className="chip">{record.substitutes}</span>
                    <span className="chip">{record.issue}</span>
                  </div>
                  <p>{record.insight}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <SectionHeader
              eyebrow="Memory Actions"
              title="What should be reused now?"
              description="Turn historical experience directly into suggested actions for the current project."
            />
            <div className="rank-list">
              <div className="rank-item">
                <span>01</span>
                <div>
                  <strong>Promote Macronix flash fallback</strong>
                  <p>
                    Smart Sensor V1 already approved this path, so it can move directly
                    into Substitute Review.
                  </p>
                </div>
              </div>
              <div className="rank-item">
                <span>02</span>
                <div>
                  <strong>Keep Abracon TCXO unless forced</strong>
                  <p>A lower-cost clock caused RF margin issues in the past.</p>
                </div>
              </div>
              <div className="rank-item">
                <span>03</span>
                <div>
                  <strong>Reuse Beacon R2 power tuning notes</strong>
                  <p>
                    If the inductor vendor changes, the existing thermal simulation and
                    ripple test results can be reused.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand-mark">B</div>
          <div>
            <p className="sidebar-eyebrow">BOM Intelligence</p>
            <h1>Optimization Workbench</h1>
          </div>
        </div>

        <div className="sidebar-current">
          <span>Current project</span>
          <strong>{currentProject.name}</strong>
          <p>{currentProjectStatus}</p>
        </div>

        <nav className="sidebar-nav" aria-label="Section navigation">
          {sidebarSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`nav-button ${activeSection === section.id ? "active" : ""}`}
              onClick={() => setActiveSection(section.id)}
              disabled={!sectionAvailability[section.id]}
            >
              <span className="nav-index">{section.index}</span>
              <span className="nav-copy">
                <strong>{section.label}</strong>
                <small>{section.title}</small>
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="workspace">
        <header className="workspace-head panel">
          <div>
            <p className="section-eyebrow">Main Workspace</p>
            <h2>{sidebarSections.find((section) => section.id === activeSection)?.title}</h2>
            <p className="section-description">
              {sidebarSections.find((section) => section.id === activeSection)?.description}
            </p>
          </div>
          <div className="head-badges">
            <span className="badge-pill">{currentProjectStep}</span>
            <span className="badge-pill strong">{workflowProgress}% complete</span>
          </div>
        </header>

        <section className="panel progress-panel">
          <div className="progress-meta header">
            <span>Workflow Progress</span>
            <strong>{workflowProgress}%</strong>
          </div>
          <div className="progress-rail wide">
            <div className="progress-fill" style={{ width: `${workflowProgress}%` }} />
          </div>
          <div className="workflow-row">
            {workflowLabels.map((step) => {
              const isDone =
                (step.id === "upload" && parseState === "done") ||
                (step.id === "clean" && cleanGenerated) ||
                (step.id === "risk" && riskReviewed) ||
                (step.id === "substitute" && decisionsMade > 0) ||
                (step.id === "costed" && costLocked) ||
                (step.id === "ready" && exported);
              const isActive = workflowStage === step.id;

              return (
                <div
                  key={step.id}
                  className={`workflow-pill ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
                >
                  <span>{step.title}</span>
                </div>
              );
            })}
          </div>
        </section>

        {sectionContent}
      </section>

      <aside className="insight-panel">
        <section className="panel sticky-panel">
          <SectionHeader
            eyebrow="Right Rail"
            title="AI Insight Panel"
            description="Show the AI summary in real time, with an interactive chat rail."
          />

          <div className="insight-kpis">
            <article className="metric-card compact">
              <span>Readiness</span>
              <strong>{readinessScore}</strong>
            </article>
            <article className="metric-card compact">
              <span>Open Risks</span>
              <strong>{unresolvedRiskCount}</strong>
            </article>
            <article className="metric-card compact">
              <span>Cost Delta</span>
              <strong className={landedDelta <= 0 ? "delta-down" : "delta-up"}>
                {formatSignedMoney(landedDelta)}
              </strong>
            </article>
          </div>

          <div className="summary-card">
            <h3>Live Summary</h3>
            <ul className="summary-list">
              {summaryBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="prompt-row">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" className="prompt-chip" onClick={() => handleQuickPrompt(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="chat-log">
            {chatMessages.map((message, index) => (
              <div key={`${message.role}-${index}-${message.text}`} className={`chat-bubble ${message.role}`}>
                <span>{message.role === "assistant" ? "AI" : "You"}</span>
                <p>{message.text}</p>
              </div>
            ))}
          </div>

          <form className="chat-form" onSubmit={handleChatSubmit}>
            <input
              type="text"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask AI: which part has the highest risk?"
            />
            <button type="submit" className="primary-button">
              Send
            </button>
          </form>
        </section>
      </aside>
    </main>
  );
}

export default App;
