import draftSample from "../samples/draft-input.json" with { type: "json" };
import reviewSample from "../samples/review-input.json" with { type: "json" };

export function homePage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NDA Workbench</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap" rel="stylesheet" />
    <style>
      :root {
        color-scheme: light;
        font-family: "IBM Plex Sans", "Aptos", "Helvetica Neue", sans-serif;
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
        min-height: 76px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 14px 24px;
        background: var(--panel);
        border-bottom: 1px solid var(--border);
      }
      .brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
      .mark {
        width: 34px; height: 34px; border-radius: 7px;
        display: grid; place-items: center;
        background: #172033; color: white; font-weight: 800;
      }
      h1 { margin: 0; font-size: 23px; letter-spacing: 0; line-height: 1.15; text-wrap: balance; }
      .subtitle { margin-top: 3px; color: var(--muted); font-size: 14px; }
      .status { display: flex; align-items: center; gap: 8px; color: var(--green); font-weight: 650; font-size: 13px; white-space: nowrap; }
      .dot { width: 9px; height: 9px; border-radius: 999px; background: var(--green); }
      .header-actions { display: flex; align-items: center; gap: 10px; }

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
      .settings-bar {
        margin: 14px 18px 0;
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 8px;
        overflow: hidden;
      }
      .settings-summary {
        width: 100%;
        border: 0;
        background: var(--panel-2);
        color: var(--text);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        min-height: 46px;
        padding: 12px 16px;
        font-weight: 800;
        text-align: left;
      }
      .settings-summary span:last-child { color: var(--muted); font-size: 12px; font-weight: 750; }
      .settings-body {
        display: grid;
        grid-template-columns: 120px 170px minmax(220px, 1fr) minmax(220px, 1fr) 170px;
        gap: 12px;
        padding: 14px 16px 16px;
        align-items: end;
      }
      .switch-field { flex-direction: row; align-items: center; gap: 9px; margin-bottom: 0; }
      .switch-field input { width: auto; }
      .settings-note { grid-column: 1 / -1; margin: -4px 0 0; }
      .api-key-wrap { position: relative; }
      .api-key-wrap input { padding-right: 82px; }
      .mini-btn {
        position: absolute;
        right: 5px;
        top: 5px;
        min-height: 34px;
        border: 1px solid #cfd7df;
        border-radius: 6px;
        background: #fff;
        padding: 5px 10px;
        font-size: 12px;
        font-weight: 800;
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
        min-height: 44px;
        padding: 10px 12px;
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
        min-height: 44px;
        padding: 10px 11px;
        outline: none;
      }
      textarea { resize: vertical; min-height: 92px; line-height: 1.45; }
      input:focus, select:focus, textarea:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(36, 88, 211, 0.12); }
      .hint { margin-top: -5px; color: var(--muted); font-size: 12px; line-height: 1.35; }
      .actions {
        display: flex;
        gap: 8px;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0 0;
        margin-top: 4px;
      }
      .action-group { display: flex; gap: 8px; flex-wrap: wrap; }
      .btn {
        border: 1px solid transparent;
        border-radius: 7px;
        min-height: 44px;
        padding: 10px 14px;
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
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: left;
        color: var(--muted);
        padding: 28px;
      }
      .empty-card {
        max-width: 420px;
        border: 1px dashed #cbd5df;
        background: #fbfcfd;
        border-radius: 8px;
        padding: 22px;
      }
      .empty-card h2 { color: var(--text); font-size: 18px; margin-bottom: 6px; }
      .empty-card p { margin: 0; line-height: 1.45; }
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
      .memo {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        line-height: 1.58;
        color: #26313d;
        font-size: 15px;
      }
      .document-page {
        max-width: 820px;
        margin: 0 auto;
        background: #fff;
        border: 1px solid #d8dee6;
        box-shadow: 0 8px 28px rgba(16, 24, 40, 0.08);
        padding: 46px 54px;
        color: #111827;
        line-height: 1.68;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        font-family: "Source Serif 4", Georgia, "Times New Roman", serif;
        font-size: 15px;
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
      .template-library {
        border: 1px solid var(--border);
        background: var(--panel-2);
        border-radius: 8px;
        padding: 12px;
        display: grid;
        gap: 10px;
      }
      .template-library-row {
        display: grid;
        grid-template-columns: minmax(180px, 1fr) auto auto auto;
        gap: 8px;
        align-items: center;
      }
      .ai-banner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        border: 1px solid #c6ddff;
        background: #f1f7ff;
        color: #173f9d;
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 12px;
        font-weight: 750;
      }
      .ai-banner.off {
        border-color: var(--border);
        background: var(--panel-2);
        color: var(--muted);
      }
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
        .header-actions { width: 100%; justify-content: space-between; }
        .settings-body { grid-template-columns: 1fr; }
        main { grid-template-columns: 1fr; padding: 12px; }
        form, .output { height: auto; max-height: none; }
        .summary-row { grid-template-columns: 1fr 1fr; }
        .form-grid { grid-template-columns: 1fr; }
        .template-library-row { grid-template-columns: 1fr; }
        .template-library-row .btn { width: 100%; justify-content: center; }
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
        <div class="header-actions">
          <button class="btn secondary" id="toggleSettings" type="button">AI Settings</button>
          <div class="status"><span class="dot"></span><span id="healthText">Checking connection</span></div>
        </div>
      </header>

      <section class="settings-bar hidden" id="settingsPanel">
        <button class="settings-summary" id="settingsSummary" type="button">
          <span>AI Settings</span>
          <span id="aiSettingsStatus">Rule-based mode</span>
        </button>
        <div class="settings-body" id="settingsBody">
          <label class="field switch-field" for="aiEnabled">
            <input id="aiEnabled" type="checkbox" />
            <span>Use AI</span>
          </label>
          <div class="field">
            <label for="aiProvider">Provider</label>
            <select id="aiProvider">
              <option value="none">None</option>
              <option value="openai">OpenAI / ChatGPT</option>
              <option value="anthropic">Claude</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>
          <div class="field">
            <label for="aiModel">Model</label>
            <select id="aiModel"></select>
          </div>
          <div class="field">
            <label for="aiCustomModel">Custom Model</label>
            <input id="aiCustomModel" placeholder="Optional model name" />
          </div>
          <div class="field">
            <label for="aiApiKey">API Key</label>
            <div class="api-key-wrap">
              <input id="aiApiKey" type="password" autocomplete="off" placeholder="Paste key" />
              <button class="mini-btn" id="toggleApiKey" type="button">Show</button>
            </div>
          </div>
          <div class="settings-note small">
            The key is saved only in this browser. The server uses it for the selected request and does not write it to this repo.
            <button class="btn secondary" id="saveAiSettings" type="button" style="margin-left: 8px;">Save Settings</button>
            <button class="btn secondary" id="clearAiSettings" type="button">Clear Key</button>
          </div>
        </div>
      </section>

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
                <div class="hint">Include the information being shared and any concerns, e.g. product roadmap, pricing, customer metadata, personal data, security details.</div>
              </div>
              <div class="field full">
                <label for="referenceTemplateFile">Firm Template Library</label>
                <div class="template-library">
                  <input id="referenceTemplateFile" type="file" accept=".txt,.md,.text" multiple />
                  <div class="template-library-row">
                    <select id="savedTemplateSelect"></select>
                    <button class="btn secondary" id="savePastedTemplate" type="button">Save Pasted Template</button>
                    <button class="btn secondary" id="deleteSelectedTemplate" type="button">Delete</button>
                    <button class="btn secondary" id="clearTemplateLibrary" type="button">Clear All</button>
                  </div>
                  <div class="small" id="templateLibraryStatus">No saved templates yet.</div>
                </div>
                <div class="hint">Uploaded templates are saved in this browser. For each new NDA, the app can auto-select the closest saved template.</div>
              </div>
              <div class="field full">
                <label for="referenceTemplateText">Paste One-Off Template or Notes</label>
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
                <label for="reviewBackground">Background / Deal Context</label>
                <textarea id="reviewBackground"></textarea>
                <div class="hint">Include what information is being exchanged and any review concerns.</div>
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
              <div class="empty-card">
                <h2>No output yet</h2>
                <p>Prepare a new NDA or check an existing one. The finished draft, review questions, risk points, and lawyer checklist will appear here.</p>
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
      const state = { active: "draft", lastText: "", lastFilename: "nda-output.txt", templateLibrary: [] };
      const aiStorageKey = "nda-workbench-ai-settings";
      const templateLibraryStorageKey = "nda-workbench-template-library";
      const modelOptions = {
        none: [""],
        openai: ["gpt-5.5", "gpt-5.4"],
        anthropic: ["claude-sonnet-4-7", "claude-opus-4-8"],
        gemini: ["gemini-3.1-pro-preview", "gemini-3.5-flash"]
      };

      const $ = (id) => document.getElementById(id);
      const mergeContext = (...values) => values.map((value) => String(value || "").trim()).filter(Boolean).join("\\n\\n");
      const normalizeText = (value) => String(value || "").toLowerCase();
      const templateId = () => (globalThis.crypto && globalThis.crypto.randomUUID ? globalThis.crypto.randomUUID() : "template-" + Date.now() + "-" + Math.random().toString(16).slice(2));
      const deriveConfidentialInfoTypes = (background, fallback) => {
        const text = (background || "").toLowerCase();
        const matches = [
          [/roadmap|product plan/, "product roadmap"],
          [/technical|architecture|security detail|source code|api|documentation|document/, "technical product documents"],
          [/pricing|commercial|financial/, "pricing"],
          [/customer metadata|customer data|user data|personal data|dpdp|privacy/, "customer metadata"],
          [/sales|pipeline|customer requirement/, "customer requirements"],
          [/strategy|business plan/, "business strategy"]
        ].filter(([pattern]) => pattern.test(text)).map(([, label]) => label);
        const unique = [...new Set(matches)];
        return unique.length > 0 ? unique : fallback;
      };
      const deriveSpecialConcerns = (background) => {
        const text = String(background || "").trim();
        if (!text) return [];
        const concerns = [];
        if (/personal data|customer metadata|customer data|user data|dpdp|privacy/i.test(text)) concerns.push("review privacy and personal data handling");
        if (/security|technical security|source code|architecture|credential|api key/i.test(text)) concerns.push("review technical security disclosure limits");
        if (/non-compete|restrictive|exclusiv/i.test(text)) concerns.push("avoid broad restrictive covenants");
        return concerns.length > 0 ? concerns : [text];
      };
      const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
      const buttonBusy = (button, busy, label) => {
        button.disabled = busy;
        button.textContent = busy ? "Working..." : label;
      };

      function saveTemplateLibrary() {
        localStorage.setItem(templateLibraryStorageKey, JSON.stringify(state.templateLibrary));
      }

      function loadTemplateLibrary() {
        try {
          const saved = JSON.parse(localStorage.getItem(templateLibraryStorageKey) || "[]");
          state.templateLibrary = Array.isArray(saved) ? saved.filter((template) => template && template.id && template.text) : [];
        } catch {
          state.templateLibrary = [];
        }
        renderTemplateLibrary();
      }

      function matterSearchText() {
        return [
          $("templateId").selectedOptions[0]?.textContent || "",
          $("clientRole").value,
          $("governingLaw").value,
          $("riskPosture").value,
          $("purpose").value,
          $("transactionContext").value
        ].join(" ");
      }

      function scoreTemplate(template, matterText) {
        const haystack = normalizeText(template.name + " " + template.text);
        const source = normalizeText(matterText);
        const keywords = [
          "mutual", "unilateral", "saas", "startup", "india", "recipient", "discloser",
          "product", "roadmap", "pricing", "customer", "metadata", "personal", "data",
          "security", "technical", "api", "software", "commercial", "partnership", "vendor"
        ];
        const sourceTokens = new Set(source.split(/[^a-z0-9]+/).filter((token) => token.length > 2));
        let score = 0;
        for (const token of sourceTokens) if (haystack.includes(token)) score += 1;
        for (const keyword of keywords) if (source.includes(keyword) && haystack.includes(keyword)) score += 3;
        if (source.includes("mutual") && haystack.includes("mutual")) score += 6;
        if (source.includes("india") && haystack.includes("india")) score += 4;
        return score;
      }

      function bestSavedTemplate() {
        if (state.templateLibrary.length === 0) return undefined;
        const matterText = matterSearchText();
        return [...state.templateLibrary]
          .map((template) => ({ template, score: scoreTemplate(template, matterText) }))
          .sort((a, b) => b.score - a.score || b.template.savedAt.localeCompare(a.template.savedAt))[0]?.template;
      }

      function selectedSavedTemplate() {
        const selectedId = $("savedTemplateSelect").value;
        if (selectedId === "auto") return bestSavedTemplate();
        return state.templateLibrary.find((template) => template.id === selectedId);
      }

      function updateTemplateStatus() {
        const count = state.templateLibrary.length;
        const best = bestSavedTemplate();
        $("templateLibraryStatus").textContent = count === 0
          ? "No saved templates yet."
          : "Saved templates: " + count + (best ? ". Auto pick: " + best.name + "." : ".");
      }

      function renderTemplateLibrary() {
        const currentValue = $("savedTemplateSelect").value || "auto";
        $("savedTemplateSelect").innerHTML =
          '<option value="auto">Auto-select best match</option>' +
          state.templateLibrary.map((template) => '<option value="' + escapeHtml(template.id) + '">' + escapeHtml(template.name) + '</option>').join("");
        $("savedTemplateSelect").value = state.templateLibrary.some((template) => template.id === currentValue) ? currentValue : "auto";
        $("deleteSelectedTemplate").disabled = state.templateLibrary.length === 0 || $("savedTemplateSelect").value === "auto";
        $("clearTemplateLibrary").disabled = state.templateLibrary.length === 0;
        updateTemplateStatus();
      }

      function upsertTemplates(templates) {
        for (const template of templates) {
          const existingIndex = state.templateLibrary.findIndex((saved) => saved.name === template.name);
          if (existingIndex >= 0) state.templateLibrary[existingIndex] = template;
          else state.templateLibrary.push(template);
        }
        saveTemplateLibrary();
        renderTemplateLibrary();
        toast(templates.length === 1 ? "Template saved" : templates.length + " templates saved");
      }

      function referenceTemplateForDraft() {
        const saved = selectedSavedTemplate();
        const pasted = $("referenceTemplateText").value.trim();
        if (!saved) return pasted;
        const savedBlock = "Selected saved firm template: " + saved.name + "\\n\\n" + saved.text;
        if (!pasted || pasted === saved.text.trim()) return savedBlock;
        return mergeContext(savedBlock, "Additional pasted reference or notes:\\n\\n" + pasted);
      }

      function selectedAiModel() {
        return $("aiCustomModel").value.trim() || $("aiModel").value;
      }

      function aiSettingsPayload() {
        return {
          enabled: $("aiEnabled").checked,
          provider: $("aiEnabled").checked ? $("aiProvider").value : "none",
          model: selectedAiModel(),
          apiKey: $("aiApiKey").value.trim()
        };
      }

      function updateModelOptions(selectedModel = "") {
        const provider = $("aiProvider").value;
        const models = modelOptions[provider] || [""];
        $("aiModel").innerHTML = models.map((model) => '<option value="' + escapeHtml(model) + '">' + escapeHtml(model || "No model") + '</option>').join("");
        if (selectedModel && models.includes(selectedModel)) {
          $("aiModel").value = selectedModel;
          $("aiCustomModel").value = "";
        } else if (selectedModel) {
          $("aiCustomModel").value = selectedModel;
        }
      }

      function updateAiStatus() {
        const settings = aiSettingsPayload();
        const isReady = settings.enabled && settings.provider !== "none" && settings.apiKey;
        $("aiSettingsStatus").textContent = isReady
          ? "AI on: " + $("aiProvider").selectedOptions[0].text + " / " + (settings.model || "default model")
          : "Rule-based mode";
      }

      function loadAiSettings() {
        const saved = JSON.parse(localStorage.getItem(aiStorageKey) || "{}");
        $("aiEnabled").checked = Boolean(saved.enabled);
        $("aiProvider").value = saved.provider || "none";
        updateModelOptions(saved.model || "");
        $("aiApiKey").value = saved.apiKey || "";
        updateAiStatus();
      }

      function saveAiSettings() {
        const settings = aiSettingsPayload();
        localStorage.setItem(aiStorageKey, JSON.stringify(settings));
        updateAiStatus();
        toast(settings.enabled && settings.provider !== "none" ? "AI settings saved" : "Rule-based mode saved");
      }

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
        $("transactionContext").value = mergeContext(
          sample.clientContext.transactionContext || "",
          (sample.clientContext.confidentialInfoTypes || []).length ? "Information being shared: " + sample.clientContext.confidentialInfoTypes.join(", ") + "." : "",
          (sample.clientContext.specialConcerns || []).length ? "Concerns: " + sample.clientContext.specialConcerns.join("; ") + "." : ""
        );
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
        $("reviewBackground").value = mergeContext(
          sample.clientContext.transactionContext || "",
          (sample.clientContext.confidentialInfoTypes || []).length ? "Information being shared: " + sample.clientContext.confidentialInfoTypes.join(", ") + "." : "",
          (sample.clientContext.specialConcerns || []).length ? "Concerns: " + sample.clientContext.specialConcerns.join("; ") + "." : ""
        );
        $("agreementText").value = sample.agreementText || "";
      }

      function draftPayload() {
        const background = $("transactionContext").value;
        const referenceTemplateText = referenceTemplateForDraft();
        return {
          templateId: $("templateId").value,
          clientContext: {
            client: { legalName: $("clientName").value, address: $("clientAddress").value },
            counterparty: { legalName: $("counterpartyName").value, address: $("counterpartyAddress").value },
            clientRole: $("clientRole").value,
            jurisdiction: $("governingLaw").value || "India",
            governingLaw: $("governingLaw").value || "India",
            purpose: $("purpose").value,
            transactionContext: background,
            confidentialInfoTypes: deriveConfidentialInfoTypes(background, ["confidential business information"]),
            termMonths: Number($("termMonths").value || 24),
            confidentialitySurvivalMonths: Number($("survivalMonths").value || 36),
            riskPosture: $("riskPosture").value,
            specialConcerns: deriveSpecialConcerns(background)
          },
          requestedClauseIds: ["data-security", "return-or-destruction"],
          referenceTemplateText,
          aiSettings: aiSettingsPayload()
        };
      }

      function reviewPayload() {
        const background = $("reviewBackground").value;
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
            transactionContext: background,
            confidentialInfoTypes: deriveConfidentialInfoTypes(background, ["confidential business information"]),
            termMonths: 24,
            confidentialitySurvivalMonths: 36,
            riskPosture: $("reviewRiskPosture").value,
            specialConcerns: deriveSpecialConcerns(background)
          },
          aiSettings: aiSettingsPayload()
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
        const aiBanner = data.aiDraftUsed
          ? '<div class="ai-banner"><span>AI polished this draft with ' + escapeHtml(data.aiProvider) + ' / ' + escapeHtml(data.aiModel) + '</span><span>Lawyer approval required</span></div>'
          : '<div class="ai-banner off"><span>Rule-based draft. Add an API key in AI Settings to polish with a selected model.</span><span>Lawyer approval required</span></div>';
        $("output").innerHTML =
          aiBanner +
          '<div class="summary-row">' +
            '<div class="metric"><div class="value">' + data.clauseSources.length + '</div><div class="label">Clauses used</div></div>' +
            '<div class="metric"><div class="value">' + data.missingContextQuestions.length + '</div><div class="label">Open questions</div></div>' +
            '<div class="metric"><div class="value">' + data.riskNotes.length + '</div><div class="label">Risk notes</div></div>' +
            '<div class="metric"><div class="value">Yes</div><div class="label">Lawyer review</div></div>' +
          '</div>' +
          '<div class="result-section"><div class="result-title">Prepared NDA <span class="small">' + escapeHtml(data.audit.generatedAt) + '</span></div><div class="result-body"><div class="document-page">' + escapeHtml(data.draftMarkdown) + '</div></div></div>' +
          '<div class="result-section"><div class="result-title">How the Lawyer Should Use This</div><div class="result-body">' + renderProcess() + '</div></div>' +
          (data.aiNotes ? '<div class="result-section"><div class="result-title">AI Notes</div><div class="result-body">' + renderList(data.aiNotes) + '</div></div>' : '') +
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
        const aiBanner = data.aiReviewUsed
          ? '<div class="ai-banner"><span>AI review memo created with ' + escapeHtml(data.aiProvider) + ' / ' + escapeHtml(data.aiModel) + '</span><span>Lawyer approval required</span></div>'
          : '<div class="ai-banner off"><span>Rule-based review. Add an API key in AI Settings to generate an AI review memo.</span><span>Lawyer approval required</span></div>';
        $("output").innerHTML =
          aiBanner +
          '<div class="summary-row">' +
            '<div class="metric"><div class="value">' + data.issues.length + '</div><div class="label">Total issues</div></div>' +
            '<div class="metric"><div class="value">' + high + '</div><div class="label">High severity</div></div>' +
            '<div class="metric"><div class="value">' + medium + '</div><div class="label">Medium severity</div></div>' +
            '<div class="metric"><div class="value">' + low + '</div><div class="label">Low severity</div></div>' +
          '</div>' +
          '<div class="result-section"><div class="result-title">Review Summary</div><div class="result-body">' + escapeHtml(data.summary) + '</div></div>' +
          (data.aiReviewMemo ? '<div class="result-section"><div class="result-title">AI Review Memo</div><div class="result-body"><div class="memo">' + escapeHtml(data.aiReviewMemo) + '</div></div></div>' : '') +
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
      $("toggleSettings").addEventListener("click", () => $("settingsPanel").classList.toggle("hidden"));
      $("settingsSummary").addEventListener("click", () => $("settingsBody").classList.toggle("hidden"));
      $("aiEnabled").addEventListener("change", updateAiStatus);
      $("aiProvider").addEventListener("change", () => {
        updateModelOptions();
        updateAiStatus();
      });
      $("aiModel").addEventListener("change", updateAiStatus);
      $("aiCustomModel").addEventListener("input", updateAiStatus);
      $("aiApiKey").addEventListener("input", updateAiStatus);
      $("saveAiSettings").addEventListener("click", saveAiSettings);
      $("clearAiSettings").addEventListener("click", () => {
        $("aiApiKey").value = "";
        saveAiSettings();
      });
      $("toggleApiKey").addEventListener("click", () => {
        const showing = $("aiApiKey").type === "text";
        $("aiApiKey").type = showing ? "password" : "text";
        $("toggleApiKey").textContent = showing ? "Show" : "Hide";
      });
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
        const files = [...(event.target.files || [])];
        if (files.length === 0) return;
        const templates = [];
        for (const file of files) {
          const text = await file.text();
          if (!text.trim()) continue;
          templates.push({ id: templateId(), name: file.name, text: text.trim(), savedAt: new Date().toISOString() });
        }
        if (templates.length === 0) return;
        upsertTemplates(templates);
        $("savedTemplateSelect").value = templates[templates.length - 1].id;
        $("referenceTemplateText").value = templates[templates.length - 1].text;
        renderTemplateLibrary();
        event.target.value = "";
      });
      $("savePastedTemplate").addEventListener("click", () => {
        const text = $("referenceTemplateText").value.trim();
        if (!text) {
          toast("Paste a template first");
          return;
        }
        const name = prompt("Template name", "Firm NDA Template " + (state.templateLibrary.length + 1));
        if (!name) return;
        const template = { id: templateId(), name: name.trim(), text, savedAt: new Date().toISOString() };
        upsertTemplates([template]);
        $("savedTemplateSelect").value = template.id;
        renderTemplateLibrary();
      });
      $("savedTemplateSelect").addEventListener("change", () => {
        const selected = selectedSavedTemplate();
        $("deleteSelectedTemplate").disabled = $("savedTemplateSelect").value === "auto" || !selected;
        if (selected && $("savedTemplateSelect").value !== "auto") $("referenceTemplateText").value = selected.text;
        updateTemplateStatus();
      });
      $("deleteSelectedTemplate").addEventListener("click", () => {
        const selectedId = $("savedTemplateSelect").value;
        if (selectedId === "auto") return;
        state.templateLibrary = state.templateLibrary.filter((template) => template.id !== selectedId);
        saveTemplateLibrary();
        renderTemplateLibrary();
        toast("Template deleted");
      });
      $("clearTemplateLibrary").addEventListener("click", () => {
        if (!confirm("Delete all saved templates from this browser?")) return;
        state.templateLibrary = [];
        saveTemplateLibrary();
        renderTemplateLibrary();
        toast("Template library cleared");
      });
      ["templateId", "clientRole", "governingLaw", "riskPosture", "purpose", "transactionContext"].forEach((id) => {
        $(id).addEventListener("input", updateTemplateStatus);
        $(id).addEventListener("change", updateTemplateStatus);
      });

      loadAiSettings();
      loadTemplateLibrary();
      fillDraft(draftSample);
      fillReview(reviewSample);
      updateTemplateStatus();
      checkHealth();
    </script>
  </body>
</html>`;
}
