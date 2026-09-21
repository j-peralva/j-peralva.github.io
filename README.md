# Personal Hub & Backend Portfolio

A high-performance, accessible, and minimalist personal hub built by **Jefferson Peralva Machiqueira**. Engineered with a 7-1 modular CSS architecture, Vite, ESM JavaScript, and a serverless AWS Lambda backend for secure contact form handling.

---

## 🚀 Tech Stack

* **Frontend:** HTML5, CSS3 (7-1 Sass/CSS Architecture pattern), ESM JavaScript, Vite.
* **Backend / Serverless:** AWS Lambda (Python 3.12+), AWS Lambda Function URL, Gmail SMTP API.
* **Security & Anti-Bot:** Cloudflare Turnstile CAPTCHA (Server-side validation, lazy-loaded for 100/100 Lighthouse performance scores).
* **UI & UX:** Custom non-blocking Toast Notifications & real-time character counter.
* **Tooling & Deployment:** GitHub Pages, GitHub Actions, GitHub CLI.

---

## 📋 Prerequisites

Ensure you have the following installed locally:

* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [npm](https://www.npmjs.com/) (v9.0.0 or higher)
* [Git](https://git-scm.com/)

---

## 🛠️ Getting Started & Local Development

### 1. Clone the Repository
```bash
git clone [https://github.com/j-peralva/hub-pessoal.git](https://github.com/j-peralva/hub-pessoal.git)
cd hub-pessoal
```

### 2. Install Dependencies
```bash
npm install
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
hub-pessoal/
├── index.html                  # Main application HTML entry point
├── package.json                # Project dependencies and npm scripts
├── serverless/                 # Isolated backend microservices
│   └── contact-mailer/
│       ├── lambda_function.py  # Python AWS Lambda function handler
│       ├── .env.example        # Environment variable template
│       └── README.md           # AWS Lambda deployment instructions
├── src/
│   ├── css/                    # 7-1 Architecture pattern CSS
│   │   ├── base/               # Global reset, typography, variables
│   │   ├── components/         # Modals, elements, overlays
│   │   ├── layout/             # Main grid and container rules
│   │   └── main.css            # Central CSS entry point
│   ├── js/
│   │   ├── modules/            # Isolated JS modules (contact, github, modal, spotlight)
│   │   └── utils/              # Helper utilities
│   └── main.js                 # Vite JS entry point
└── README.md                   # Root documentation
```

---

## 🛡️ Security & Performance Highlights

* **Lazy-Loaded CAPTCHA & Server Verification:** Third-party Cloudflare Turnstile scripts are dynamically injected only when needed, maintaining a perfect **100/100 Lighthouse score**. Submissions require server-side token validation against Cloudflare's API before email execution.
* **Resilient UX & Event Delegation:** Form handling uses event delegation to handle dynamic DOM modal rendering seamlessly. Includes real-time character counters (3,000 max length) and custom animated toast notifications instead of disruptive browser alerts.
* **Payload Constraints & CORS Protection:** Strict client-side and server-side length limits (Name: 100, Email: 120, Subject: 150, Message: 3000) protect against payload spam. CORS is managed directly via AWS Lambda Function URL configuration to avoid duplicate origin header conflicts.
* **Zero-Dependency Lambda:** The contact form backend relies purely on standard Python libraries (`smtplib`, `ssl`, `urllib`), keeping execution light, fast, and free of third-party package vulnerabilities.

---

## 📄 License

Distributed under the MIT License (2026). See `LICENSE` for more information.
