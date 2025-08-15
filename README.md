# 💰 CoinKeeper — Next.js + TailwindCSS + shadcn/ui

**CoinKeeper** is a modern, responsive **Expense Tracker** built with **Next.js (App Router)**, **TailwindCSS**, and **shadcn/ui**.  
Track your spending, view insights with charts, and enjoy a clean dark/light mode UI — all in your browser with `localStorage` persistence.

---

## ✨ Features

- **📊 Track Expenses** — Add transactions with amount, category, and date.
- **🗂 Organized Table** — View all transactions in a clean, sortable table.
- **📈 Visual Insights** — See spending trends via pie or bar chart.
- **🌓 Dark Mode** — Toggle between light and dark themes with one click.
- **📱 Fully Responsive** — Works seamlessly on mobile, tablet, and desktop.
- **💾 Offline Persistence** — Data saved in `localStorage` (no backend needed).
- **🎨 Modern UI** — Powered by shadcn/ui components for a sleek look.

---

## 🛠 Tech Stack

- **[Next.js](https://nextjs.org/)** (App Router)
- **[TailwindCSS](https://tailwindcss.com/)**
- **[shadcn/ui](https://ui.shadcn.com/)**
- **[next-themes](https://github.com/pacocoursey/next-themes)** (dark mode)
- **[Recharts](https://recharts.org/en-US/)** (data visualization)

---

## 📂 Project Structure

- .git/
- app/
- ├── favicon.ico
- ├── globals.css
-  ├── layout.tsx
-  └── page.tsx
-  components/
-  └── ui/
-  ├── button.tsx
-  ├── card.tsx
-  ├── input.tsx
-  ├── select.tsx
-  ├── switch.tsx
-  ├── table.tsx
-  ├── mode-toggle.tsx
-  └── theme-provider.tsx
-  lib/
-  └── utils.ts
