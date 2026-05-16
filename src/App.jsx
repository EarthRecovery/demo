import { useEffect, useMemo, useRef, useState } from "react";

const bomRecords = [
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
    placement: { x: 28, y: 24, w: 22, h: 16 },
    score: 79,
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
    placement: { x: 58, y: 18, w: 18, h: 14 },
    score: 74,
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
    placement: { x: 34, y: 58, w: 20, h: 13 },
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
    placement: { x: 62, y: 54, w: 14, h: 10 },
    score: 63,
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
    placement: { x: 10, y: 78, w: 18, h: 8 },
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

  const timersRef = useRef([]);
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
      }, 4200 + index * 950);

      queueTimeout(() => {
        setCompletedReplacements((current) => [...new Set([...current, row.id])]);
      }, 4700 + index * 950);
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
    }, 4700 + rows.length * 950);
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
      "Delta",
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
                <span>Delta</span>
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
                <h2>Component Replacement View</h2>
              </div>
              <span className="status-chip">
                {completedReplacements.length}/{rows.length} swapped
              </span>
            </div>

            <div className="board">
              <div className="board-grid" />
              <div className="board-trace board-trace-a" />
              <div className="board-trace board-trace-b" />

              {rows.map((row) => {
                const isActive = activeReplacement === row.id;
                const isDone = completedReplacements.includes(row.id);

                return (
                  <div
                    key={row.id}
                    className={`component ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}
                    style={{
                      left: `${row.placement.x}%`,
                      top: `${row.placement.y}%`,
                      width: `${row.placement.w}%`,
                      height: `${row.placement.h}%`,
                    }}
                  >
                    <span className="component-id">{row.id}</span>
                    <span className="component-model">
                      {isDone ? row.next.model : row.current.model}
                    </span>
                  </div>
                );
              })}

              <div className="board-legend">
                <span>
                  <i className="dot dot-live" /> Current
                </span>
                <span>
                  <i className="dot dot-active" /> Replacing
                </span>
                <span>
                  <i className="dot dot-done" /> Optimized
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
                <span>Total delta</span>
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
