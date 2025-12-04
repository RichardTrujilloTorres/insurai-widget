<div align="center">

# 🛡️ InsurAI Analyzer Widget

**Embeddable AI-powered insurance policy analysis for any website**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with Lit](https://img.shields.io/badge/built%20with-Lit-blue.svg)](https://lit.dev/)
[![npm version](https://img.shields.io/badge/npm-1.0.0-green.svg)](https://www.npmjs.com/)

[Live Demo](https://richardtrujillotorres.github.io/insurai-widget/) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples)

</div>

---

## ✨ What Is This?

A production-ready **web component** that lets you embed AI-powered insurance policy analysis into any website with just 2 lines of code.

**Perfect for:**
- 🏢 Insurance comparison platforms
- ⚖️ Legal tech applications
- 💼 Insurance agencies
- 🎓 Educational tools
- 🔧 Internal tools

---

## 🎯 Features

### Core Capabilities
- ⚡ **< 2 second analysis** - Fast AI-powered parsing
- 📋 **Comprehensive extraction** - Coverage, deductibles, exclusions, risks
- 🔐 **Password protection** - Secure API access with rate limiting
- 💡 **Demo mode** - Unlimited simulated responses for testing
- 🎨 **Themeable** - Light/dark mode built-in
- 📱 **Mobile responsive** - Works on all devices
- 🔒 **Secure** - CORS-ready, password-validated backend

### Developer Experience
- 🚀 **Zero config** - Drop in and it works
- 📦 **Tiny bundle** - < 50KB gzipped
- 🎯 **Framework agnostic** - Works with React, Vue, Angular, vanilla JS
- 🔧 **Customizable** - Full control over styling and behavior
- 📚 **Well documented** - JSDoc types, examples, guides

---

## 🚀 Quick Start

### Installation

**Option 1: CDN (Recommended)**
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/RichardTrujilloTorres/insurai-widget@main/dist/insurai-analyzer.js"></script>
```

**Option 2: NPM**
```bash
npm install insurai-widget
```

### Usage

**Minimal example (demo mode):**
```html
<insurai-analyzer api-url="https://your-api.com"></insurai-analyzer>
```

**With password (real API access):**
```html
<insurai-analyzer 
  api-url="https://your-api.com"
  demo-password="your-password-here"
  theme="dark"
  default-type="health"
  default-jurisdiction="US"
></insurai-analyzer>
```

**That's it!** 🎉

> **Note:** The `demo-password` attribute is required for real API access. Without it, the widget operates in demo mode with simulated responses.

---

## 📖 Documentation

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | string | *required* | Your InsurAI API endpoint |
| `demo-password` | string | `null` | Password for real API access (required by backend) |
| `theme` | `"light"` \| `"dark"` | `"light"` | Color theme |
| `default-type` | string | `"health"` | Default policy type |
| `default-jurisdiction` | string | `"US"` | Default jurisdiction |

### Demo Mode vs Real API Mode

The widget operates in two modes:

**Demo Mode (default, no password):**
- ⚡ Instant responses using simulated data
- 🆓 Unlimited calls, no rate limits
- 💡 Perfect for testing and demonstrations
- ⚠️ Note: Backend requires password - real API calls will fail

**Real API Mode (with password):**
- 🔐 Authenticated access to live OpenAI analysis
- 📊 Real policy analysis results
- 🔒 Rate limited to 5 calls per day per user
- ✅ Password validated by backend

```html
<!-- Demo mode (simulated responses) -->
<insurai-analyzer api-url="https://your-api.com"></insurai-analyzer>

<!-- Real API mode (live analysis, password required) -->
<insurai-analyzer 
  api-url="https://your-api.com"
  demo-password="your-password-here"
></insurai-analyzer>
```

**Password Validation:**
- Backend validates all real API requests
- Invalid password → Error with contact information
- Missing password in real mode → Error message
- Demo mode works without password (simulated data only)

### Events

Listen for analysis results:

```javascript
const analyzer = document.querySelector('insurai-analyzer');

// Analysis completed successfully
analyzer.addEventListener('analysis-complete', (event) => {
  console.log('Result:', event.detail);
  // {
  //   coverage: {...},
  //   deductibles: [...],
  //   exclusions: [...],
  //   riskLevel: "medium",
  //   isDemo: false  // true if demo mode
  //   ...
  // }
});

// Analysis failed
analyzer.addEventListener('analysis-error', (event) => {
  console.error('Error:', event.detail.error);
  // May include backend validation errors:
  // - "🔐 Password Required" (no password provided to backend)
  // - "❌ Invalid Password" (wrong password)
  // - Includes contact information for access
});
```

### Error Handling

The widget handles backend password validation errors gracefully:

**Invalid Password Response:**
```
❌ Invalid Password

The password you provided is incorrect. Contact me for access.

📧 Contact: richard.trujillo.torres@gmail.com
💼 LinkedIn: https://www.linkedin.com/in/richard-trujillo-1572b0b7/
```

**Password Required Response:**
```
🔐 Password Required

This API requires a demo password. Contact me to get access.

📧 Contact: richard.trujillo.torres@gmail.com
💼 LinkedIn: https://www.linkedin.com/in/richard-trujillo-1572b0b7/
```

These errors are displayed directly in the widget UI with clear instructions and contact information.

### Programmatic API

Control the widget via JavaScript:

```javascript
const analyzer = document.querySelector('insurai-analyzer');

// Set policy text
analyzer.policyText = "Your insurance policy text here...";

// Set password programmatically
analyzer.demoPassword = "your-password";

// Trigger analysis
await analyzer.analyze();

// Access result
if (analyzer.result) {
  console.log('Coverage:', analyzer.result.coverage);
  console.log('Risk:', analyzer.result.riskLevel);
}

// Check remaining calls (real API mode)
console.log('Calls remaining:', analyzer.demoCallsRemaining);
```

---

## 🎨 Customization

### Theming

Built-in light and dark themes:

```html
<!-- Light theme (default) -->
<insurai-analyzer theme="light"></insurai-analyzer>

<!-- Dark theme -->
<insurai-analyzer theme="dark"></insurai-analyzer>
```

### Custom Styling

Override CSS variables for complete control:

```css
insurai-analyzer {
  --accent-color: #your-color;
  --bg-primary: #your-bg;
  --text-primary: #your-text;
  /* See full variable list in docs */
}
```

---

## 💻 Framework Integration

### React

```jsx
import 'insurai-widget';

function App() {
  const handleComplete = (event) => {
    console.log('Analysis:', event.detail);
  };

  return (
    <insurai-analyzer
      api-url="https://your-api.com"
      demo-password="your-password"
      theme="light"
      onAnalysis-complete={handleComplete}
    />
  );
}
```

### Vue 3

```vue
<template>
  <insurai-analyzer
    api-url="https://your-api.com"
    demo-password="your-password"
    theme="light"
    @analysis-complete="handleComplete"
  />
</template>

<script setup>
import 'insurai-widget';

const handleComplete = (event) => {
  console.log('Analysis:', event.detail);
};
</script>
```

### Angular

```typescript
// app.component.ts
import 'insurai-widget';

@Component({
  selector: 'app-root',
  template: `
    <insurai-analyzer
      [attr.api-url]="apiUrl"
      [attr.demo-password]="demoPassword"
      theme="light"
      (analysis-complete)="handleComplete($event)"
    ></insurai-analyzer>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  apiUrl = 'https://your-api.com';
  demoPassword = 'your-password';
  
  handleComplete(event: any) {
    console.log('Analysis:', event.detail);
  }
}
```

---

## 🏗️ Development

### Setup

```bash
# Clone repository
git clone https://github.com/RichardTrujilloTorres/insurai-widget.git
cd insurai-widget

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:5173` to see the demo page.

### Build

```bash
# Build for production
npm run build

# Output: dist/insurai-analyzer.js
```

### Project Structure

```
insurai-widget/
├── src/
│   └── insurai-analyzer.js    # Main web component
├── dist/                       # Built files (generated)
├── index.html                  # Demo/docs page
├── package.json
├── vite.config.js
└── README.md
```

---

## 🌐 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

*Uses native Web Components (Custom Elements v1)*

---

## 🔗 Related Projects

This widget powers:
- **[InsurAI API](https://github.com/RichardTrujilloTorres/insurai-policy-analyzer)** - The backend API (Symfony + OpenAI)
- **[Lambda Template](https://github.com/RichardTrujilloTorres/lambda-symfony-template)** - Serverless infrastructure

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

Built with:
- [Lit](https://lit.dev/) - Fast, lightweight web components
- [Vite](https://vitejs.dev/) - Lightning-fast build tool
- [InsurAI API](https://github.com/RichardTrujilloTorres/insurai-policy-analyzer) - AI-powered analysis backend

---

<div align="center">

**⭐ If you find this useful, give it a star!**

Built with ❤️ by [Richard Trujillo Torres](https://github.com/RichardTrujilloTorres)

[Report Bug](https://github.com/RichardTrujilloTorres/insurai-widget/issues) • [Request Feature](https://github.com/RichardTrujilloTorres/insurai-widget/issues)

</div>
