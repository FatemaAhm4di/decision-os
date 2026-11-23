# ⚡ Decision OS

### Make better decisions. Think clearly. Choose confidently.

<p align="center">
  <strong>A smarter way to approach life's difficult choices.</strong>
  <br />
  Organize alternatives, evaluate priorities, and make informed decisions with a structured scoring system.
</p>

<p align="center">
  <a href="https://decision-os-2qas.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20App-09637E?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</p>

---

## ✨ Overview

Big decisions deserve more than random guesses, scattered notes, and endless overthinking.

**Decision OS** is a decision-making platform designed to turn complex choices into a clear, structured process.

Compare alternatives, define what matters most, assign weighted scores, and understand which option best aligns with your priorities.

Whether you're choosing between career opportunities, planning a move, or evaluating personal goals, Decision OS helps bring clarity to the process.

## 🚀 Key Features

| Feature | Description |
|---|---|
| 📝 Decision Management | Create, edit, duplicate, and delete decisions |
| ⚖️ Weighted Analysis | Evaluate alternatives using weighted criteria |
| 📊 Score Matrix | Compare options through a structured scoring matrix |
| 📋 Decision Templates | Start with reusable decision templates |
| 📈 Dashboard | Track statistics and recently created decisions |
| 🔎 Search & Sorting | Find and organize decisions efficiently |
| 📤 CSV Export | Export decision data for further analysis |
| 🗒️ Decision Notes | Keep important thoughts and details in one place |
| 📱 Responsive UI | A consistent experience across screen sizes |

## 🧠 How It Works

<p align="center">
  <strong>From uncertainty to a structured decision.</strong>
</p>

1. **Create a Decision** – Describe the choice you're facing.
2. **Add Alternatives** – List the options you want to evaluate.
3. **Define Criteria** – Identify the factors that influence your decision.
4. **Set Priorities** – Assign weights to reflect the importance of each criterion.
5. **Evaluate Options** – Score each alternative against your criteria.
6. **Analyze Results** – Compare weighted scores and make a more informed choice.

## 🛠️ Tech Stack

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/Neon-00E599?style=flat-square&logo=neon&logoColor=black" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

| Technology | Role |
|---|---|
| Next.js | Full-stack React framework |
| React | Component-based UI |
| TypeScript | Static typing |
| Tailwind CSS | Utility-first styling |
| PostgreSQL | Relational database |
| Prisma ORM | Database access and migrations |
| Neon | Serverless PostgreSQL hosting |
| Lucide React | Interface icons |
| Vercel | Deployment |

## 💻 Getting Started

### Prerequisites

- Node.js
- npm
- A PostgreSQL database

### 1. Clone the Repository

```bash
git clone https://github.com/FatemaAhm4di/decision-os.git
cd decision-os
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_postgresql_connection_string"
```

Replace the placeholder with your PostgreSQL connection string.

### 4. Set Up the Database

```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the application.

## 📁 Project Structure

```text
decision-os/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── lib/
│   └── types/
├── prisma.config.ts
└── package.json
```

## 🔮 What's Next?

Decision OS is currently focused on structured decision management and weighted analysis.

Planned improvements include:

- 🔐 User authentication and account management
- 👤 Personalized user workspaces
- 🛡️ User-specific data access and isolation
- 📊 Advanced analytics and decision insights

## 🌐 Live Demo

<p align="center">
  <a href="https://decision-os-2qas.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_Explore_Decision_OS-09637E?style=for-the-badge" alt="Explore Decision OS" />
  </a>
</p>

**Live Application:** [decision-os-2qas.vercel.app](https://decision-os-2qas.vercel.app/)

## 👩‍💻 Author

**Fatema Ahmadi**  
Frontend Developer

- GitHub: [@FatemaAhm4di](https://github.com/FatemaAhm4di)

---

<p align="center">
  <strong>Less overthinking. More structured decisions.</strong>
  <br />
  Built with ❤️ and a lot of thoughtful engineering.
</p>
