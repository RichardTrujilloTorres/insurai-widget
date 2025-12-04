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
 * @attr {string} demo-password - Password for real API access (recruiter access)
 *
 * @fires analysis-complete - Fired when analysis completes successfully
 * @fires analysis-error - Fired when analysis fails
 *
 * @example
 * <!-- Demo mode (fake responses, unlimited) -->
 * <insurai-analyzer api-url="https://your-api.com"></insurai-analyzer>
 *
 * <!-- Real API mode (with password, 5 calls/day) -->
 * <insurai-analyzer
 *   api-url="https://your-api.com"
 *   demo-password="recruiter2024"
 * ></insurai-analyzer>
 */
export class InsurAIAnalyzer extends LitElement {
    static properties = {
        // Public attributes
        apiUrl: { type: String, attribute: 'api-url' },
        theme: { type: String },
        defaultType: { type: String, attribute: 'default-type' },
        defaultJurisdiction: { type: String, attribute: 'default-jurisdiction' },
        demoPassword: { type: String, attribute: 'demo-password' },

        // Internal state
        policyText: { state: true },
        policyType: { state: true },
        jurisdiction: { state: true },
        loading: { state: true },
        result: { state: true },
        error: { state: true },
        demoMode: { state: true },
        demoCallsRemaining: { state: true }
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

    .mode-indicator {
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      text-align: center;
    }

    .mode-indicator.demo {
      background: #dbeafe;
      border: 1px solid #3b82f6;
      color: #1e40af;
    }

    .mode-indicator.real {
      background: #fef3c7;
      border: 1px solid #f59e0b;
      color: #92400e;
    }

    .mode-indicator small {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      opacity: 0.8;
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
      white-space: pre-line;
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
        this.apiUrl = 'http://127.0.0.1:8000';
        this.theme = 'light';
        this.defaultType = 'health';
        this.defaultJurisdiction = 'US';
        this.demoPassword = null;

        // Initialize state
        this.policyText = '';
        this.policyType = this.defaultType;
        this.jurisdiction = this.defaultJurisdiction;
        this.loading = false;
        this.result = null;
        this.error = null;

        // Demo mode setup
        this.demoMode = !this.demoPassword; // Default to demo if no password
        this.demoCallsRemaining = this.getRemainingDemoCalls();
    }

    connectedCallback() {
        super.connectedCallback();
        // Apply theme attribute
        if (this.theme) {
            this.setAttribute('theme', this.theme);
        }

        // Check if password was provided
        if (this.demoPassword) {
            this.demoMode = false;
        }
    }

    getRemainingDemoCalls() {
        const today = new Date().toISOString().split('T')[0];
        const storedDate = localStorage.getItem('insurai_demo_date');
        const storedCount = parseInt(localStorage.getItem('insurai_demo_calls') || '0');

        // Reset if new day
        if (storedDate !== today) {
            localStorage.setItem('insurai_demo_date', today);
            localStorage.setItem('insurai_demo_calls', '0');
            return 5;
        }

        return Math.max(0, 5 - storedCount);
    }

    incrementDemoCallCount() {
        const count = parseInt(localStorage.getItem('insurai_demo_calls') || '0');
        localStorage.setItem('insurai_demo_calls', (count + 1).toString());
        this.demoCallsRemaining = this.getRemainingDemoCalls();
    }

    getFakeResponse() {
        // Simulate API delay for realism
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    coverage: {
                        coverageType: this.policyType === 'health' ? 'comprehensive' : 'standard',
                        coverageAmount: this.policyType === 'health' ? '$100,000' : '$50,000',
                        coverageBreakdown: {
                            medical: this.policyType === 'health',
                            dental: false,
                            vision: false,
                            pharmacy: this.policyType === 'health',
                        }
                    },
                    deductibles: [
                        { type: 'annual', amount: '$1,000' },
                        { type: 'per-incident', amount: '$50' }
                    ],
                    exclusions: [
                        'Pre-existing conditions (first 6 months)',
                        'Cosmetic procedures',
                        'Experimental treatments'
                    ],
                    riskLevel: 'medium',
                    requiredActions: [
                        'Review exclusions carefully',
                        'Verify network providers',
                        'Understand deductible terms'
                    ],
                    flags: {
                        needsLegalReview: false,
                        inconsistentClausesDetected: false
                    }
                });
            }, 1500); // 1.5 second delay to feel real
        });
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
            // DEMO MODE - Use fake responses
            if (this.demoMode) {
                this.result = await this.getFakeResponse();

                // Dispatch success event
                this.dispatchEvent(new CustomEvent('analysis-complete', {
                    detail: { ...this.result, isDemo: true },
                    bubbles: true,
                    composed: true
                }));

                return;
            }

            // REAL API MODE - Check rate limit
            if (this.demoCallsRemaining <= 0) {
                this.error = `⏱️ Daily demo limit reached (5 calls/day).

Want unlimited access? Contact me:
📧 richard@example.com
💼 LinkedIn: linkedin.com/in/richardtrujillo`;
                return;
            }

            // Make real API call
            const response = await fetch(`${this.apiUrl}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Demo-Password': this.demoPassword || '',
                },
                body: JSON.stringify({
                    policyText: this.policyText,
                    policyType: this.policyType,
                    jurisdiction: this.jurisdiction,
                    language: 'en'
                })
            });

            if (!response.ok) {
                // Try to parse error response from backend
                let errorMessage = `Analysis failed: ${response.statusText}`;

                try {
                    const errorData = await response.json();

                    // Handle 401 password validation errors
                    if (response.status === 401 && errorData.error) {
                        if (errorData.error === 'Demo password required') {
                            errorMessage = `🔐 Password Required\n\n${errorData.message || 'This API requires a demo password.'}`;
                        } else if (errorData.error === 'Invalid demo password') {
                            errorMessage = `❌ Invalid Password\n\n${errorData.message || 'The password you provided is incorrect.'}`;
                        }

                        // Add contact info if available
                        if (errorData.contact) {
                            errorMessage += '\n\n📧 Contact: ' + (errorData.contact.email || '');
                            if (errorData.contact.linkedin) {
                                errorMessage += '\n💼 LinkedIn: ' + errorData.contact.linkedin;
                            }
                        }
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (parseError) {
                    // If we can't parse the error, use the default message
                }

                throw new Error(errorMessage);
            }

            this.result = await response.json();

            // Increment call count
            this.incrementDemoCallCount();

            // Dispatch success event
            this.dispatchEvent(new CustomEvent('analysis-complete', {
                detail: { ...this.result, isDemo: false },
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

        ${!this.demoMode ? html`
          <div class="mode-indicator real">
            🔑 <strong>Real API Mode</strong> • ${this.demoCallsRemaining} calls remaining today
            <small>Using live OpenAI analysis (password validated)</small>
          </div>
        ` : html`
          <div class="mode-indicator demo">
            💡 <strong>Demo Mode</strong> - Using simulated responses (instant, unlimited)
            <small>⚠️ Backend requires password - Real API calls will fail without valid password</small>
          </div>
        `}

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
              <option value="UK">United Kingdom</option>
              <option value="EU">European Union</option>
              <option value="IT">Italy</option>
              <option value="GLOBAL">Global</option>
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
