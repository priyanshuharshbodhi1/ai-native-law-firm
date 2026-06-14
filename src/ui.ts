import draftSample from "../samples/draft-input.json" with { type: "json" };
import reviewSample from "../samples/review-input.json" with { type: "json" };

export function homePage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NDA Workbench</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        --bg: #f6f7f9;
        --panel: #ffffff;
        --panel-2: #fbfcfd;
        --border: #dce2e8;
        --text: #161a1f;
        --muted: #5d6875;
        --soft: #eef2f5;
        --blue: #2458d3;
        --blue-dark: #173f9d;
        --green: #0f7b5f;
        --red: #b42318;
        --amber: #a15c07;
        --ink: #101418;
      }

      * { box-sizing: border-box; }
      body { margin: 0; background: var(--bg); color: var(--text); }
      button, input, textarea, select { font: inherit; }
      button { cursor: pointer; }
      .app { min-height: 100vh; display: grid; grid-template-rows: auto 1fr; }
      header {
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 0 24px;
        background: var(--panel);
        border-bottom: 1px solid var(--border);
      }
      .brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
      .mark {
        width: 34px; height: 34px; border-radius: 7px;
        display: grid; place-items: center;
        background: #172033; color: white; font-weight: 800;
      }
      h1 { margin: 0; font-size: 18px; letter-spacing: 0; line-height: 1.15; }
      .subtitle { margin-top: 2px; color: var(--muted); font-size: 13px; }
      .status { display: flex; align-items: center; gap: 8px; color: var(--green); font-weight: 650; font-size: 13px; white-space: nowrap; }
      .dot { width: 9px; height: 9px; border-radius: 999px; background: var(--green); }

      main {
        display: grid;
        grid-template-columns: minmax(420px, 520px) minmax(0, 1fr);
        gap: 18px;
        padding: 18px;
        min-height: 0;
      }
      .panel {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 8px;
        min-height: 0;
        overflow: hidden;
      }
      .panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--border);
        background: var(--panel-2);
      }
      h2 { margin: 0; font-size: 15px; letter-spacing: 0; }
      .tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 8px; background: var(--soft); border-radius: 8px; }
      .tab {
        border: 0;
        border-radius: 6px;
        padding: 9px 10px;
        color: var(--muted);
        background: transparent;
        font-weight: 700;
      }
      .tab.active { background: var(--panel); color: var(--text); box-shadow: 0 1px 2px rgba(16, 24, 40, 0.08); }

      form { padding: 16px; overflow: auto; height: calc(100vh - 146px); }
      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
      .field.full { grid-column: 1 / -1; }
      label { font-size: 12px; color: #344054; font-weight: 750; }
      input, select, textarea {
        width: 100%;
        border: 1px solid #cfd7df;
        border-radius: 7px;
        background: white;
        color: var(--text);
        padding: 9px 10px;
        outline: none;
      }
      textarea { resize: vertical; min-height: 92px; line-height: 1.45; }
      input:focus, select:focus, textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(36, 88, 211, 0.12); }
      .hint { margin-top: -5px; color: var(--muted); font-size: 12px; line-height: 1.35; }
      .actions {
        position: sticky;
        bottom: 0;
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0 0;
        margin-top: 4px;
        background: linear-gradient(to top, var(--panel) 84%, rgba(255,255,255,0));
      }
      .action-group { display: flex; gap: 8px; flex-wrap: wrap; }
      .btn {
        border: 1px solid transparent;
        border-radius: 7px;
        min-height: 38px;
        padding: 9px 12px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 750;
        white-space: nowrap;
      }
      .btn.primary { background: var(--blue); color: white; }
      .btn.primary:hover { background: var(--blue-dark); }
      .btn.secondary { background: white; border-color: #cfd7df; color: #252b33; }
      .btn.danger { background: #fff4f2; color: var(--red); border-color: #ffd0c9; }
      .btn:disabled { opacity: 0.58; cursor: not-allowed; }

      .output { height: calc(100vh - 146px); overflow: auto; padding: 16px; }
      .empty {
        height: 100%;
        display: grid;
        place-items: center;
        text-align: center;
        color: var(--muted);
        padding: 28px;
      }
      .summary-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 14px; }
      .metric {
        background: var(--panel-2);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 12px;
      }
      .metric .value { font-size: 22px; font-weight: 850; color: var(--ink); }
      .metric .label { color: var(--muted); font-size: 12px; margin-top: 2px; }
      .result-section { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 12px; background: white; }
      .result-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        background: var(--panel-2);
        border-bottom: 1px solid var(--border);
        padding: 11px 12px;
        font-weight: 800;
      }
      .result-body { padding: 12px; }
      .markdown {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        line-height: 1.55;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
        font-size: 13px;
      }
      .document-page {
        max-width: 820px;
        margin: 0 auto;
        background: #fff;
        border: 1px solid #d8dee6;
        box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
        padding: 42px 48px;
        color: #111827;
        line-height: 1.62;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 14px;
      }
      .process-grid { display: grid; gap: 8px; }
      .process-step { display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; }
      .step-num { width: 24px; height: 24px; border-radius: 999px; display: grid; place-items: center; background: var(--soft); color: #344054; font-size: 12px; font-weight: 850; }
      .issue { border-top: 1px solid var(--border); padding: 12px; }
      .issue:first-child { border-top: 0; }
      .issue-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
      .issue-title { font-weight: 800; }
      .pill { border-radius: 999px; padding: 3px 8px; font-size: 12px; font-weight: 800; }
      .pill.high { color: var(--red); background: #fff1ef; }
      .pill.medium { color: var(--amber); background: #fff6e8; }
      .pill.low { color: var(--green); background: #eaf8f3; }
      ul.clean { margin: 0; padding-left: 20px; color: #2d3640; line-height: 1.5; }
      .small { color: var(--muted); font-size: 12px; }
      .toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .hidden { display: none; }
      .toast {
        position: fixed;
        right: 18px;
        bottom: 18px;
        background: #172033;
        color: white;
        padding: 10px 12px;
        border-radius: 7px;
        box-shadow: 0 10px 30px rgba(16, 24, 40, 0.2);
        opacity: 0;
        transform: translateY(8px);
        transition: opacity 150ms ease, transform 150ms ease;
        pointer-events: none;
      }
      .toast.show { opacity: 1; transform: translateY(0); }
      @media (max-width: 900px) {
        header { height: auto; align-items: flex-start; padding: 14px 16px; flex-direction: column; }
        main { grid-template-columns: 1fr; padding: 12px; }
        form, .output { height: auto; max-height: none; }
        .summary-row { grid-template-columns: 1fr 1fr; }
        .form-grid { grid-template-columns: 1fr; }
      }
      @media print {
        body { background: white; }
        header, .panel:first-of-type, .panel-head, .summary-row, .result-section:not(:first-of-type), .toast { display: none !important; }
        main { display: block; padding: 0; }
        .panel { border: 0; }
        .output { height: auto; overflow: visible; padding: 0; }
        .document-page { box-shadow: none; border: 0; max-width: none; padding: 0; }
      }
    </style>
  </head>
  <body>
    <div class="app">
      <header>
        <div class="brand">
          <div class="mark">N</div>
          <div>
            <h1>NDA Workbench</h1>
            <div class="subtitle">Prepare and review NDAs with a lawyer approval checklist.</div>
          </div>
        </div>
        <div class="status"><span class="dot"></span><span id="healthText">Checking connection</span></div>
      </header>

      <main>
        <section class="panel">
          <div class="panel-head">
            <h2>Matter Details</h2>
            <div class="tabs" role="tablist" aria-label="Workflow">
              <button class="tab active" id="draftTab" type="button">Prepare NDA</button>
              <button class="tab" id="reviewTab" type="button">Check Existing NDA</button>
            </div>
          </div>

          <form id="draftForm">
            <div class="form-grid">
              <div class="field">
                <label for="templateId">Template</label>
                <select id="templateId">
                  <option value="mutual-saas-india">Mutual SaaS NDA - India</option>
                  <option value="startup-unilateral-india">Startup Unilateral NDA - India</option>
                  <option value="short-form-india">Short-Form NDA - India</option>
                </select>
              </div>
              <div class="field">
                <label for="clientRole">Client Position</label>
                <select id="clientRole">
                  <option value="mutual">Mutual</option>
                  <option value="discloser">Discloser</option>
                  <option value="recipient">Recipient</option>
                </select>
              </div>
              <div class="field">
                <label for="clientName">Client Legal Name</label>
                <input id="clientName" required />
              </div>
              <div class="field">
                <label for="counterpartyName">Counterparty Legal Name</label>
                <input id="counterpartyName" required />
              </div>
              <div class="field">
                <label for="clientAddress">Client Address</label>
                <input id="clientAddress" />
              </div>
              <div class="field">
                <label for="counterpartyAddress">Counterparty Address</label>
                <input id="counterpartyAddress" />
              </div>
              <div class="field">
                <label for="governingLaw">Governing Law</label>
                <input id="governingLaw" />
              </div>
              <div class="field">
                <label for="riskPosture">Review Style</label>
                <select id="riskPosture">
                  <option value="balanced">Balanced</option>
                  <option value="protective">More Protective</option>
                  <option value="friendly">More Flexible</option>
                </select>
              </div>
              <div class="field">
                <label for="termMonths">NDA Term</label>
                <input id="termMonths" type="number" min="1" />
              </div>
              <div class="field">
                <label for="survivalMonths">Confidentiality Period</label>
                <input id="survivalMonths" type="number" min="1" />
              </div>
              <div class="field full">
                <label for="purpose">Purpose</label>
                <textarea id="purpose" required></textarea>
                <div class="hint">Write one clear sentence: why the parties are sharing confidential information.</div>
              </div>
              <div class="field full">
                <label for="transactionContext">Background / Deal Context</label>
                <textarea id="transactionContext"></textarea>
              </div>
              <div class="field full">
                <label for="confidentialInfoTypes">Confidential Information Types</label>
                <input id="confidentialInfoTypes" />
                <div class="hint">Separate with commas, e.g. pricing, product documents, customer data.</div>
              </div>
              <div class="field full">
                <label for="specialConcerns">Special Concerns</label>
                <input id="specialConcerns" />
              </div>
              <div class="field full">
                <label for="referenceTemplateFile">Previous NDA / Firm Template</label>
                <input id="referenceTemplateFile" type="file" accept=".txt,.md,.text" />
                <div class="hint">Optional. Upload a text file or paste below. The system will use it as a reference for clause choices and lawyer review points.</div>
              </div>
              <div class="field full">
                <label for="referenceTemplateText">Paste Previous NDA or Template</label>
                <textarea id="referenceTemplateText" style="min-height: 150px;"></textarea>
              </div>
            </div>
            <div class="actions">
              <div class="action-group">
                <button class="btn primary" type="submit">Prepare NDA</button>
                <button class="btn secondary" id="loadDraftSample" type="button">Use Example</button>
              </div>
              <button class="btn secondary" id="clearDraft" type="button">Clear</button>
            </div>
          </form>

          <form id="reviewForm" class="hidden">
            <div class="form-grid">
              <div class="field">
                <label for="reviewClientRole">Client Position</label>
                <select id="reviewClientRole">
                  <option value="recipient">Recipient</option>
                  <option value="discloser">Discloser</option>
                  <option value="mutual">Mutual</option>
                </select>
              </div>
              <div class="field">
                <label for="reviewGoal">Review Goal</label>
                <select id="reviewGoal">
                  <option value="negotiate-balanced">Negotiate Balanced</option>
                  <option value="sign-fast">Sign Fast</option>
                  <option value="maximize-protection">Maximize Protection</option>
                </select>
              </div>
              <div class="field">
                <label for="reviewClientName">Client Legal Name</label>
                <input id="reviewClientName" required />
              </div>
              <div class="field">
                <label for="reviewCounterpartyName">Counterparty Legal Name</label>
                <input id="reviewCounterpartyName" required />
              </div>
              <div class="field">
                <label for="reviewLaw">Governing Law</label>
                <input id="reviewLaw" />
              </div>
              <div class="field">
                <label for="reviewRiskPosture">Review Style</label>
                <select id="reviewRiskPosture">
                  <option value="balanced">Balanced</option>
                  <option value="friendly">More Flexible</option>
                  <option value="protective">More Protective</option>
                </select>
              </div>
              <div class="field full">
                <label for="reviewPurpose">Purpose</label>
                <textarea id="reviewPurpose" required></textarea>
              </div>
              <div class="field full">
                <label for="reviewInfoTypes">Confidential Information Types</label>
                <input id="reviewInfoTypes" />
              </div>
              <div class="field full">
                <label for="agreementText">Paste Agreement Text</label>
                <textarea id="agreementText" style="min-height: 250px;" required></textarea>
              </div>
            </div>
            <div class="actions">
              <div class="action-group">
                <button class="btn primary" type="submit">Check Existing NDA</button>
                <button class="btn secondary" id="loadReviewSample" type="button">Use Example</button>
              </div>
              <button class="btn secondary" id="clearReview" type="button">Clear</button>
            </div>
          </form>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Review Output</h2>
            <div class="toolbar">
              <button class="btn secondary" id="copyOutput" type="button" disabled>Copy Output</button>
              <button class="btn secondary" id="downloadOutput" type="button" disabled>Download Output</button>
              <button class="btn secondary" id="printOutput" type="button" disabled>Print / Save PDF</button>
            </div>
          </div>
          <div class="output" id="output">
            <div class="empty">
              <div>
                <h2>No output yet</h2>
                <p>Fill the form on the left, then prepare a new NDA or check an existing one. Results will appear here in plain English.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <div class="toast" id="toast">Copied</div>

    <script>
      const draftSample = ${JSON.stringify(draftSample)};
      const reviewSample = ${JSON.stringify(reviewSample)};
      const state = { active: "draft", lastText: "", lastFilename: "nda-output.txt" };

      const $ = (id) => document.getElementById(id);
      const splitList = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);
      const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
      const buttonBusy = (button, busy, label) => {
        button.disabled = busy;
        button.textContent = busy ? "Working..." : label;
      };

      async function checkHealth() {
        try {
          const res = await fetch("/health");
          const data = await res.json();
          $("healthText").textContent = data.ok ? "Ready" : "Needs attention";
        } catch {
          $("healthText").textContent = "Not connected";
        }
      }

      function setTab(tab) {
        state.active = tab;
        $("draftTab").classList.toggle("active", tab === "draft");
        $("reviewTab").classList.toggle("active", tab === "review");
        $("draftForm").classList.toggle("hidden", tab !== "draft");
        $("reviewForm").classList.toggle("hidden", tab !== "review");
      }

      function fillDraft(sample) {
        $("templateId").value = sample.templateId;
        $("clientRole").value = sample.clientContext.clientRole;
        $("clientName").value = sample.clientContext.client.legalName || "";
        $("counterpartyName").value = sample.clientContext.counterparty.legalName || "";
        $("clientAddress").value = sample.clientContext.client.address || "";
        $("counterpartyAddress").value = sample.clientContext.counterparty.address || "";
        $("governingLaw").value = sample.clientContext.governingLaw || "India";
        $("riskPosture").value = sample.clientContext.riskPosture || "balanced";
        $("termMonths").value = sample.clientContext.termMonths || 24;
        $("survivalMonths").value = sample.clientContext.confidentialitySurvivalMonths || 36;
        $("purpose").value = sample.clientContext.purpose || "";
        $("transactionContext").value = sample.clientContext.transactionContext || "";
        $("confidentialInfoTypes").value = (sample.clientContext.confidentialInfoTypes || []).join(", ");
        $("specialConcerns").value = (sample.clientContext.specialConcerns || []).join(", ");
        $("referenceTemplateText").value = sample.referenceTemplateText || "";
      }

      function fillReview(sample) {
        $("reviewClientRole").value = sample.clientContext.clientRole;
        $("reviewGoal").value = sample.reviewGoal;
        $("reviewClientName").value = sample.clientContext.client.legalName || "";
        $("reviewCounterpartyName").value = sample.clientContext.counterparty.legalName || "";
        $("reviewLaw").value = sample.clientContext.governingLaw || "India";
        $("reviewRiskPosture").value = sample.clientContext.riskPosture || "balanced";
        $("reviewPurpose").value = sample.clientContext.purpose || "";
        $("reviewInfoTypes").value = (sample.clientContext.confidentialInfoTypes || []).join(", ");
        $("agreementText").value = sample.agreementText || "";
      }

      function draftPayload() {
        return {
          templateId: $("templateId").value,
          clientContext: {
            client: { legalName: $("clientName").value, address: $("clientAddress").value },
            counterparty: { legalName: $("counterpartyName").value, address: $("counterpartyAddress").value },
            clientRole: $("clientRole").value,
            jurisdiction: $("governingLaw").value || "India",
            governingLaw: $("governingLaw").value || "India",
            purpose: $("purpose").value,
            transactionContext: $("transactionContext").value,
            confidentialInfoTypes: splitList($("confidentialInfoTypes").value),
            termMonths: Number($("termMonths").value || 24),
            confidentialitySurvivalMonths: Number($("survivalMonths").value || 36),
            riskPosture: $("riskPosture").value,
            specialConcerns: splitList($("specialConcerns").value)
          },
          requestedClauseIds: ["data-security", "return-or-destruction"],
          referenceTemplateText: $("referenceTemplateText").value
        };
      }

      function reviewPayload() {
        return {
          agreementText: $("agreementText").value,
          reviewGoal: $("reviewGoal").value,
          clientContext: {
            client: { legalName: $("reviewClientName").value },
            counterparty: { legalName: $("reviewCounterpartyName").value },
            clientRole: $("reviewClientRole").value,
            jurisdiction: $("reviewLaw").value || "India",
            governingLaw: $("reviewLaw").value || "India",
            purpose: $("reviewPurpose").value,
            confidentialInfoTypes: splitList($("reviewInfoTypes").value),
            termMonths: 24,
            confidentialitySurvivalMonths: 36,
            riskPosture: $("reviewRiskPosture").value,
            specialConcerns: []
          }
        };
      }

      function renderList(items) {
        if (!items || items.length === 0) return '<p class="small">None.</p>';
        return '<ul class="clean">' + items.map((item) => '<li>' + escapeHtml(typeof item === "string" ? item : item.question || item.title || JSON.stringify(item)) + '</li>').join("") + '</ul>';
      }

      function enableExport(text, filename) {
        state.lastText = text;
        state.lastFilename = filename;
        $("copyOutput").disabled = false;
        $("downloadOutput").disabled = false;
        $("printOutput").disabled = false;
      }

      const lawyerProcess = [
        "Collect client facts: parties, purpose, business context, confidential information, term, governing law, and signing authority.",
        "Add the firm's previous NDA/template if available so the draft follows the lawyer's usual positions.",
        "Prepare the first draft and read the questions to ask the client before sending anything outside the firm.",
        "Review risk points, compare against the supplied firm template, and edit clauses that need jurisdiction or client-specific judgment.",
        "Confirm stamp/execution requirements, final party details, and signing authority.",
        "Send the lawyer-approved NDA to the client/counterparty, not the raw generated draft."
      ];

      function renderProcess() {
        return '<div class="process-grid">' + lawyerProcess.map((step, index) =>
          '<div class="process-step"><div class="step-num">' + (index + 1) + '</div><div>' + escapeHtml(step) + '</div></div>'
        ).join("") + '</div>';
      }

      function renderDraft(data) {
        const text = data.draftMarkdown;
        enableExport(text, "nda-draft.txt");
        $("output").innerHTML =
          '<div class="summary-row">' +
            '<div class="metric"><div class="value">' + data.clauseSources.length + '</div><div class="label">Clauses used</div></div>' +
            '<div class="metric"><div class="value">' + data.missingContextQuestions.length + '</div><div class="label">Open questions</div></div>' +
            '<div class="metric"><div class="value">' + data.riskNotes.length + '</div><div class="label">Risk notes</div></div>' +
            '<div class="metric"><div class="value">Yes</div><div class="label">Lawyer review</div></div>' +
          '</div>' +
          '<div class="result-section"><div class="result-title">Prepared NDA <span class="small">' + escapeHtml(data.audit.generatedAt) + '</span></div><div class="result-body"><div class="document-page">' + escapeHtml(data.draftMarkdown) + '</div></div></div>' +
          '<div class="result-section"><div class="result-title">How the Lawyer Should Use This</div><div class="result-body">' + renderProcess() + '</div></div>' +
          '<div class="result-section"><div class="result-title">Questions to Ask Client</div><div class="result-body">' + renderList(data.missingContextQuestions) + '</div></div>' +
          '<div class="result-section"><div class="result-title">Risk Points</div><div class="result-body">' + renderList(data.riskNotes) + '</div></div>' +
          '<div class="result-section"><div class="result-title">Lawyer Checklist</div><div class="result-body">' + renderList(data.lawyerChecklist) + '</div></div>';
      }

      function renderReview(data) {
        const high = data.issues.filter((issue) => issue.severity === "high").length;
        const medium = data.issues.filter((issue) => issue.severity === "medium").length;
        const low = data.issues.filter((issue) => issue.severity === "low").length;
        const text = data.summary + "\\n\\n" + data.issues.map((issue) => '[' + issue.severity.toUpperCase() + '] ' + issue.clauseTitle + ': ' + issue.issue + "\\nSuggested: " + issue.suggestedRedline).join("\\n\\n");
        enableExport(text, "agreement-review.txt");
        $("output").innerHTML =
          '<div class="summary-row">' +
            '<div class="metric"><div class="value">' + data.issues.length + '</div><div class="label">Total issues</div></div>' +
            '<div class="metric"><div class="value">' + high + '</div><div class="label">High severity</div></div>' +
            '<div class="metric"><div class="value">' + medium + '</div><div class="label">Medium severity</div></div>' +
            '<div class="metric"><div class="value">' + low + '</div><div class="label">Low severity</div></div>' +
          '</div>' +
          '<div class="result-section"><div class="result-title">Review Summary</div><div class="result-body">' + escapeHtml(data.summary) + '</div></div>' +
          '<div class="result-section"><div class="result-title">Issues and Suggested Changes</div>' +
            data.issues.map((issue) =>
              '<div class="issue"><div class="issue-head"><div class="issue-title">' + escapeHtml(issue.clauseTitle) + '</div><span class="pill ' + issue.severity + '">' + issue.severity + '</span></div>' +
              '<p><strong>Issue:</strong> ' + escapeHtml(issue.issue) + '</p>' +
              '<p><strong>Why it matters:</strong> ' + escapeHtml(issue.whyItMatters) + '</p>' +
              '<p><strong>Suggested redline:</strong> ' + escapeHtml(issue.suggestedRedline) + '</p></div>'
            ).join("") +
          '</div>' +
          '<div class="result-section"><div class="result-title">Negotiation Points</div><div class="result-body">' + renderList(data.negotiationPoints) + '</div></div>' +
          '<div class="result-section"><div class="result-title">Lawyer Checklist</div><div class="result-body">' + renderList(data.lawyerChecklist) + '</div></div>';
      }

      async function submitDraft(event) {
        event.preventDefault();
        const button = event.submitter;
        buttonBusy(button, true, "Prepare NDA");
        try {
          const res = await fetch("/draft", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(draftPayload()) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Draft failed");
          renderDraft(data);
        } catch (error) {
          $("output").innerHTML = '<div class="result-section"><div class="result-title">Error</div><div class="result-body">' + escapeHtml(error.message) + '</div></div>';
        } finally {
          buttonBusy(button, false, "Prepare NDA");
        }
      }

      async function submitReview(event) {
        event.preventDefault();
        const button = event.submitter;
        buttonBusy(button, true, "Check Existing NDA");
        try {
          const res = await fetch("/review", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(reviewPayload()) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Review failed");
          renderReview(data);
        } catch (error) {
          $("output").innerHTML = '<div class="result-section"><div class="result-title">Error</div><div class="result-body">' + escapeHtml(error.message) + '</div></div>';
        } finally {
          buttonBusy(button, false, "Check Existing NDA");
        }
      }

      function toast(text) {
        $("toast").textContent = text;
        $("toast").classList.add("show");
        setTimeout(() => $("toast").classList.remove("show"), 1400);
      }

      $("draftTab").addEventListener("click", () => setTab("draft"));
      $("reviewTab").addEventListener("click", () => setTab("review"));
      $("draftForm").addEventListener("submit", submitDraft);
      $("reviewForm").addEventListener("submit", submitReview);
      $("loadDraftSample").addEventListener("click", () => fillDraft(draftSample));
      $("loadReviewSample").addEventListener("click", () => fillReview(reviewSample));
      $("clearDraft").addEventListener("click", () => $("draftForm").reset());
      $("clearReview").addEventListener("click", () => $("reviewForm").reset());
      $("copyOutput").addEventListener("click", async () => {
        await navigator.clipboard.writeText(state.lastText);
        toast("Copied output");
      });
      $("downloadOutput").addEventListener("click", () => {
        const blob = new Blob([state.lastText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = state.lastFilename;
        a.click();
        URL.revokeObjectURL(url);
      });
      $("printOutput").addEventListener("click", () => window.print());
      $("referenceTemplateFile").addEventListener("change", async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        $("referenceTemplateText").value = await file.text();
      });

      fillDraft(draftSample);
      fillReview(reviewSample);
      checkHealth();
    </script>
  </body>
</html>`;
}
