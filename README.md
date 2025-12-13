# 🧠 Parse & Practice

**AI-Powered Practice Test Generator** - Transform your study materials into interactive practice tests instantly!

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://kinshukkush.github.io/PARSE-N-PRACTICE/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/kinshukkush/PARSE-N-PRACTICE)

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan) ![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-orange)

**🌐 Live App**: [https://kinshukkush.github.io/PARSE-N-PRACTICE/](https://kinshukkush.github.io/PARSE-N-PRACTICE/)

---

## ✨ Features

- 🤖 **AI-Powered Analysis** - Automatically detects questions and answers from any text using OpenRouter AI
- ⚡ **Instant Test Generation** - Convert study materials to practice tests in seconds
- 📊 **Smart Progress Tracking** - Track your performance with detailed analytics
- 🎯 **Timed Practice Mode** - Simulate real exam conditions with customizable timers
- 🏆 **Achievement System** - Earn badges and track your learning progress
- 💬 **AI Chat Interface** - Discuss content that doesn't contain questions
- 🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS and shadcn/ui
- 📱 **Mobile Friendly** - Works seamlessly on all devices

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kinshukkush/PARSE-N-PRACTICE.git
cd PARSE-N-PRACTICE
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

---

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview production build
```bash
npm run preview
```

---

## 🌐 Deploy to GitHub Pages

### Option 1: Manual Deployment

1. **Update `vite.config.ts`** with your repository name:
```typescript
export default defineConfig({
  base: '/PARSE-N-PRACTICE/',
  // ... rest of config
})
```

2. **Build and deploy**:
```bash
npm run build
cd dist
git init
git add -A
git commit -m 'Deploy to GitHub Pages'
git push -f git@github.com:kinshukkush/PARSE-N-PRACTICE.git main:gh-pages
```

3. **Enable GitHub Pages** in your repository settings (Settings → Pages → Source: gh-pages branch)

### Option 2: Using GitHub Actions

1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. Push to GitHub - deployment will happen automatically!

---

## 🎯 How to Use

1. **Upload or Paste Content**
   - Drag & drop a `.txt` file, or
   - Paste your study material directly

2. **AI Analysis**
   - Click "Analyze with AI"
   - AI will detect questions and answers automatically
   - Supports multiple formats: Q&A pairs, multiple choice, etc.

3. **Take the Test**
   - Answer questions one by one
   - Get instant feedback
   - Review your score and correct answers

4. **Track Progress**
   - View detailed analytics
   - See your improvement over time
   - Identify weak areas

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI**: OpenRouter (GPT-3.5 Turbo)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## 📁 Project Structure

```
parse-n-practice/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── TestUpload.tsx
│   │   ├── QuestionCard.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and services
│   │   ├── parser.ts     # Question parsing logic
│   │   ├── aiService.ts  # OpenRouter AI integration
│   │   └── utils.ts
│   ├── pages/            # Page components
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html
├── package.json
└── vite.config.ts
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) - Unified AI API
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons

---

## � Links

- **Live Demo**: [https://kinshukkush.github.io/PARSE-N-PRACTICE/](https://kinshukkush.github.io/PARSE-N-PRACTICE/)
- **Repository**: [https://github.com/kinshukkush/PARSE-N-PRACTICE](https://github.com/kinshukkush/PARSE-N-PRACTICE)
- **Issues**: [Report a bug or request a feature](https://github.com/kinshukkush/PARSE-N-PRACTICE/issues)

---

## 📧 Contact

Questions or suggestions? Feel free to [open an issue](https://github.com/kinshukkush/PARSE-N-PRACTICE/issues) or reach out!

**Developer**: [@kinshuk._.saxena](https://github.com/kinshukkush)

---

**Made with ❤️ by kinshuk._.saxena**

*Transform your study materials into practice tests with the power of AI!*
