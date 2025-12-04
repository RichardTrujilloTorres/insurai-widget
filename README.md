<div align="center">

# 🛡️ InsurAI Analyzer Widget

**Embeddable AI-powered insurance policy analysis for any website**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with Lit](https://img.shields.io/badge/built%20with-Lit-blue.svg)](https://lit.dev/)
[![npm version](https://img.shields.io/badge/npm-1.0.0-green.svg)](https://www.npmjs.com/)

[Live Demo](#) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples)

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
- 🎨 **Themeable** - Light/dark mode built-in
- 📱 **Mobile responsive** - Works on all devices
- 🔒 **Secure** - CORS-ready, no data stored

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
<script type="module" src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/insurai-widget@main/dist/insurai-analyzer.js"></script>
```

**Option 2: NPM**
```bash
npm install insurai-widget
```

### Usage

**Minimal example:**
```html
<insurai-analyzer api-url="https://your-api.com"></insurai-analyzer>
```

**Configured example:**
```html
<insurai-analyzer 
  api-url="https://your-api.com"
  theme="dark"
  default-type="health"
  default-jurisdiction="US"
></insurai-analyzer>
```

**That's it!** 🎉

---

## 📖 Documentation

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | string | *required* | Your InsurAI API endpoint |
| `theme` | `"light"` \| `"dark"` | `"light"` | Color theme |
| `default-type` | string | `"health"` | Default policy type |
| `default-jurisdiction` | string | `"US"` | Default jurisdiction |

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
  //   ...
  // }
});

// Analysis failed
analyzer.addEventListener('analysis-error', (event) => {
  console.error('Error:', event.detail.error);
});
```

### Programmatic API

Control the widget via JavaScript:

```javascript
const analyzer = document.querySelector('insurai-analyzer');

// Set policy text
analyzer.policyText = "Your insurance policy text here...";

// Trigger analysis
await analyzer.analyze();

// Access result
if (analyzer.result) {
  console.log('Coverage:', analyzer.result.coverage);
  console.log('Risk:', analyzer.result.riskLevel);
}
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
      theme="light"
      (analysis-complete)="handleComplete($event)"
    ></insurai-analyzer>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  apiUrl = 'https://your-api.com';
  
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
