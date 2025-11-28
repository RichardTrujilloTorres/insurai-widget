import { LitElement, html, css } from 'lit';

/**
 * InsurAI Analyzer Web Component
 * Embeddable widget for analyzing insurance policies with AI
 *
 * @element insurai-analyzer
 *
 * @attr {string} api-url - The API endpoint URL (default: production)
 * @attr {string} theme - Theme: 'light' or 'dark' (default: 'light')
 * @attr {string} default-type - Default policy type
 * @attr {string} default-jurisdiction - Default jurisdiction
 *
 * @fires analysis-complete - Fired when analysis completes successfully
 * @fires analysis-error - Fired when analysis fails
 *
 * @example
 * <insurai-analyzer
 *   api-url="https://your-api.com"
 *   theme="light"
 *   default-type="health"
 * ></insurai-analyzer>
 */
export class InsurAIAnalyzer extends LitElement {
    static properties = {
        // Public attributes
        apiUrl: { type: String, attribute: 'api-url' },
        theme: { type: String },
        defaultType: { type: String, attribute: 'default-type' },
        defaultJurisdiction: { type: String, attribute: 'default-jurisdiction' },

        // Internal state
        policyText: { state: true },
        policyType: { state: true },
        jurisdiction: { state: true },
        loading: { state: true },
        result: { state: true },
        error: { state: true }
    };

    static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
    }

    /* Light theme (default) */
    :host {
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --bg-input: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --border-color: #e2e8f0;
      --accent-color: #4f46e5;
      --accent-hover: #4338ca;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --error-color: #ef4444;
      --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }

    /* Dark theme */
    :host([theme="dark"]) {
      --bg-primary: #1e293b;
      --bg-secondary: #0f172a;
      --bg-input: #334155;
      --text-primary: #f1f5f9;
      --text-secondary: #cbd5e1;
      --border-color: #475569;
      --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.3);
    }

    .container {
      background: var(--bg-primary);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: var(--shadow);
    }

    .header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .header h2 {
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
      font-size: 1.75rem;
      font-weight: 700;
    }

    .header p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .input-section {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.875rem;
    }

    textarea {
      width: 100%;
      min-height: 200px;
      padding: 0.875rem;
      background: var(--bg-input);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
      resize: vertical;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    textarea:focus {
      outline: none;
      border-color: var(--accent-color);
    }

    textarea::placeholder {
      color: var(--text-secondary);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    select {
      width: 100%;
      padding: 0.75rem;
      background: var(--bg-input);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    select:focus {
      outline: none;
      border-color: var(--accent-color);
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      align-items: center;
    }

    button {
      flex: 1;
      padding: 0.875rem 2rem;
      background: var(--accent-color);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    button:hover:not(:disabled) {
      background: var(--accent-hover);
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .sample-link {
      color: var(--accent-color);
      font-size: 0.875rem;
      text-decoration: none;
      cursor: pointer;
      white-space: nowrap;
    }

    .sample-link:hover {
      text-decoration: underline;
    }

    /* Loading spinner */
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Results section */
    .result {
      margin-top: 2rem;
      padding: 1.5rem;
      background: var(--bg-secondary);
      border-radius: 8px;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .result-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .result-header h3 {
      margin: 0;
      color: var(--text-primary);
      font-size: 1.25rem;
      flex: 1;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      background: var(--success-color);
      color: white;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .result-grid {
      display: grid;
      gap: 1.5rem;
    }

    .result-card {
      padding: 1rem;
      background: var(--bg-primary);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .result-card h4 {
      margin: 0 0 0.75rem 0;
      color: var(--text-primary);
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .result-value {
      color: var(--text-primary);
      font-size: 1.125rem;
      font-weight: 500;
    }

    .risk-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
    }

    .risk-low {
      background: #d1fae5;
      color: #065f46;
    }

    .risk-medium {
      background: #fef3c7;
      color: #92400e;
    }

    .risk-high {
      background: #fee2e2;
      color: #991b1b;
    }

    .flag-list, .action-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .flag-list li, .action-list li {
      padding: 0.5rem 0;
      color: var(--text-primary);
      display: flex;
      align-items: start;
      gap: 0.5rem;
    }

    .flag-list li::before {
      content: '🚩';
    }

    .action-list li::before {
      content: '✅';
    }

    /* Error state */
    .error {
      margin-top: 1rem;
      padding: 1rem;
      background: #fee2e2;
      color: #991b1b;
      border-radius: 8px;
      border-left: 4px solid var(--error-color);
    }

    .error-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .container {
        padding: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }

      button {
        width: 100%;
      }
    }
  `;

    constructor() {
        super();
        // Default values
        this.apiUrl = 'http://127.0.0.1:8000'; // TODO: Replace with actual API
        this.theme = 'light';
        this.defaultType = 'health';
        this.defaultJurisdiction = 'US';

        // Initialize state
        this.policyText = '';
        this.policyType = this.defaultType;
        this.jurisdiction = this.defaultJurisdiction;
        this.loading = false;
        this.result = null;
        this.error = null;
    }

    connectedCallback() {
        super.connectedCallback();
        // Apply theme attribute
        if (this.theme) {
            this.setAttribute('theme', this.theme);
        }
    }

    async analyze() {
        // Validate input
        if (!this.policyText.trim()) {
            this.error = 'Please enter policy text to analyze';
            return;
        }

        this.loading = true;
        this.error = null;
        this.result = null;

        try {
            const response = await fetch(`${this.apiUrl}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    policyText: this.policyText,
                    policyType: this.policyType,
                    jurisdiction: this.jurisdiction,
                    language: 'en'
                })
            });

            if (!response.ok) {
                throw new Error(`Analysis failed: ${response.statusText}`);
            }

            this.result = await response.json();

            // Dispatch success event
            this.dispatchEvent(new CustomEvent('analysis-complete', {
                detail: this.result,
                bubbles: true,
                composed: true
            }));

        } catch (err) {
            this.error = err.message || 'Failed to analyze policy. Please try again.';

            // Dispatch error event
            this.dispatchEvent(new CustomEvent('analysis-error', {
                detail: { error: this.error },
                bubbles: true,
                composed: true
            }));
        } finally {
            this.loading = false;
        }
    }

    loadSample() {
        this.policyText = `Comprehensive Health Insurance Policy

Coverage Details:
- Medical expenses up to $100,000 annually
- Prescription drug coverage included
- Dental and vision excluded
- Emergency room visits covered
- Preventive care covered at 100%

Deductible:
- Annual deductible: $1,000
- Per-incident deductible: $50

Exclusions:
- Pre-existing conditions (first 6 months)
- Cosmetic procedures
- Experimental treatments

Terms:
- 30-day waiting period for non-emergency care
- Network providers required for full coverage
- Out-of-network coverage at 60%`;
    }

    render() {
        return html`
      <div class="container">
        <div class="header">
          <h2>🛡️ InsurAI Policy Analyzer</h2>
          <p>Analyze insurance policies with AI in seconds</p>
        </div>

        <div class="input-section">
          <label for="policy-text">Policy Text</label>
          <textarea
            id="policy-text"
            placeholder="Paste your insurance policy text here..."
            .value=${this.policyText}
            @input=${(e) => this.policyText = e.target.value}
          ></textarea>
        </div>

        <div class="form-row">
          <div class="input-section">
            <label for="policy-type">Policy Type</label>
            <select
              id="policy-type"
              .value=${this.policyType}
              @change=${(e) => this.policyType = e.target.value}
            >
              <option value="health">Health Insurance</option>
              <option value="auto">Auto Insurance</option>
              <option value="life">Life Insurance</option>
              <option value="home">Home Insurance</option>
              <option value="travel">Travel Insurance</option>
            </select>
          </div>

          <div class="input-section">
            <label for="jurisdiction">Jurisdiction</label>
            <select
              id="jurisdiction"
              .value=${this.jurisdiction}
              @change=${(e) => this.jurisdiction = e.target.value}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="EU">European Union</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>

        <div class="actions">
          <button
            @click=${this.analyze}
            ?disabled=${this.loading || !this.policyText.trim()}
          >
            ${this.loading
            ? html`<span class="spinner"></span> Analyzing...`
            : html`🔍 Analyze Policy`
        }
          </button>
          
          <a class="sample-link" @click=${this.loadSample}>
            Load sample policy
          </a>
        </div>

        ${this.error ? html`
          <div class="error">
            <div class="error-title">⚠️ Error</div>
            <div>${this.error}</div>
          </div>
        ` : ''}

        ${this.result ? this.renderResult() : ''}
      </div>
    `;
    }

    renderResult() {
        const riskClass = `risk-${this.result.riskLevel?.toLowerCase() || 'medium'}`;

        return html`
      <div class="result">
        <div class="result-header">
          <h3>Analysis Complete</h3>
          <span class="badge">✓ Success</span>
        </div>

        <div class="result-grid">
          ${this.result.coverage ? html`
            <div class="result-card">
              <h4>📋 Coverage</h4>
              <div class="result-value">
                ${this.result.coverage.coverageType || 'N/A'}
              </div>
              ${this.result.coverage.coverageAmount ? html`
                <div style="margin-top: 0.5rem; color: var(--text-secondary);">
                  Amount: ${this.result.coverage.coverageAmount}
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${this.result.riskLevel ? html`
            <div class="result-card">
              <h4>📊 Risk Level</h4>
              <div class="risk-indicator ${riskClass}">
                ${this.result.riskLevel === 'low' ? '🟢' :
            this.result.riskLevel === 'medium' ? '🟡' : '🔴'}
                ${this.result.riskLevel.toUpperCase()}
              </div>
            </div>
          ` : ''}

          ${this.result.deductibles && this.result.deductibles.length > 0 ? html`
            <div class="result-card">
              <h4>💵 Deductibles</h4>
              ${this.result.deductibles.map(d => html`
                <div style="margin: 0.5rem 0; color: var(--text-primary);">
                  ${typeof d === 'string' ? d : `${d.type}: ${d.amount}`}
                </div>
              `)}
            </div>
          ` : ''}

          ${this.result.exclusions && this.result.exclusions.length > 0 ? html`
            <div class="result-card">
              <h4>⚠️ Exclusions</h4>
              <ul class="action-list">
                ${this.result.exclusions.map(e => html`<li>${e}</li>`)}
              </ul>
            </div>
          ` : ''}

          ${this.result.flags ? html`
            <div class="result-card">
              <h4>🚩 Flags</h4>
              <ul class="flag-list">
                ${this.result.flags.needsLegalReview ? html`
                  <li>Needs legal review</li>
                ` : ''}
                ${this.result.flags.inconsistentClausesDetected ? html`
                  <li>Inconsistent clauses detected</li>
                ` : ''}
                ${!this.result.flags.needsLegalReview && !this.result.flags.inconsistentClausesDetected ? html`
                  <li style="color: var(--success-color);">No issues detected</li>
                ` : ''}
              </ul>
            </div>
          ` : ''}

          ${this.result.requiredActions && this.result.requiredActions.length > 0 ? html`
            <div class="result-card">
              <h4>✅ Recommended Actions</h4>
              <ul class="action-list">
                ${this.result.requiredActions.map(action => html`<li>${action}</li>`)}
              </ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    }
}

// Register the custom element
customElements.define('insurai-analyzer', InsurAIAnalyzer);
