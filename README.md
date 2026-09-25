# Personal Hub & Backend Portfolio

A high-performance, accessible, and minimalist personal hub built by **Jefferson Peralva Machiqueira**. Engineered with a 7-1 modular Sass/CSS architecture, Vite, ESM JavaScript, and a serverless AWS Lambda + API Gateway backend for secure contact form handling.

---

## 🚀 Tech Stack

* **Frontend:** HTML5, CSS3 (7-1 Sass/CSS Architecture pattern), ESM JavaScript, Vite.
* **Backend / Serverless:** AWS Lambda (Python 3.12+), AWS API Gateway (`/contact`), Gmail SMTP API.
* **Security & Anti-Bot:** Cloudflare Turnstile CAPTCHA (Server-side token validation, dynamic client injection, lazy-loaded for 100/100 Lighthouse performance scores).
* **UI & UX:** Custom non-blocking Toast Notifications & real-time character counter.
* **Tooling & Deployment:** GitHub Pages, GitHub Actions (Node.js 22 LTS), GitHub CLI (`gh`).

---

## 📋 Prerequisites

Ensure you have the following installed locally:

* [Node.js](https://nodejs.org/) (v20.0.0 or v22.0.0+ LTS recommended)
* [npm](https://www.npmjs.com/) (v10.0.0 or higher)
* [Git](https://git-scm.com/)
* [GitHub CLI (`gh`)](https://cli.github.com/) *(Optional, for PR & CI/CD workflows)*

---

## 🔑 Environment Variables

The project uses Vite environment variables with the `VITE_` prefix.

### Local Development (`.env`)
Create a `.env` file in the root directory:

```env
VITE_API_URL=https://<your-api-id>.execute-api.<region>[.amazonaws.com/contact](https://.amazonaws.com/contact)
VITE_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_public_site_key
```

### GitHub Actions (CI/CD)
Configure **Repository Variables** in GitHub (**Settings > Secrets and variables > Actions > Variables**):
* `VITE_API_URL`
* `VITE_TURNSTILE_SITE_KEY`

---

## 🛠️ Getting Started & Local Development

### 1. Clone the Repository
```bash
git clone [https://github.com/j-peralva/j-peralva.github.io.git](https://github.com/j-peralva/j-peralva.github.io.git)
cd j-peralva.github.io
```

### 2. Install Dependencies
```bash
npm ci
```

### 3. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173/` to view the live site.

### 4. Build for Production
```bash
npm run build
```
The compiled, minified production assets will be generated in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```text
j-peralva.github.io/
├── index.html                  # Main application HTML entry point
├── package.json                # Project dependencies and npm scripts
├── vite.config.js              # Vite bundler configuration (base: './')
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD (Node 22 LTS, Build & Deploy)
├── serverless/                 # Isolated backend microservices
│   └── contact-mailer/
│       ├── lambda_function.py  # Python AWS Lambda function handler
│       ├── .env.example        # Environment variable template
│       └── README.md           # AWS Lambda deployment instructions
├── public/                     # Static assets, favicons, robots.txt, sitemap.xml
├── src/
│   ├── scss/                   # 7-1 Architecture pattern CSS/Sass
│   │   ├── base/               # Global reset, typography, variables
│   │   ├── components/         # Modals, cards, overlays
│   │   ├── layout/             # Grid and layout containers
│   │   └── main.scss           # Central SCSS importer
│   ├── js/
│   │   ├── modules/            # Isolated JS modules (contact, github, modal, spotlight, tech-filter)
│   │   └── utils/              # Helper DOM utilities
│   └── main.js                 # Vite JS entry point
└── README.md                   # Root documentation
```

---

## 🛡️ Security, CI/CD & Performance Highlights

* **Decoupled Architecture & Environment Variables:** Sensitive API URLs and Turnstile public keys are fully injected via environment variables at build time using Vite and GitHub Repository Variables.
* **Lazy-Loaded CAPTCHA & Server Verification:** Third-party Cloudflare Turnstile scripts are dynamically injected into the DOM only when the contact modal opens, preserving a 100/100 Lighthouse performance score. Submissions require server-side token validation against Cloudflare's API.
* **AWS API Gateway Integration:** Traffic passes through AWS API Gateway featuring CORS restrictions, payload limits, and rate limiting before reaching the Lambda worker.
* **Automated CI/CD Workflow:** Multi-stage GitHub Actions pipeline enforcing Node.js 22 LTS, PR validation, main branch protection, and automated GitHub Pages deployment.

---

## 📄 License

Distributed under the MIT License (2026). See `LICENSE` for more information.