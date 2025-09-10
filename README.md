# Dynamic Portfolio Dashboard

A portfolio dashboard built with **Next.js, TypeScript, Tailwind CSS, and shadcn/ui** that displays live stock data including **CMP, P/E Ratio**. The base data comes from an Excel sheet, which is converted into a static JSON and enriched with live financial data using the Yahoo Finance API.

---

## 🚀 Setup Instructions

1. Clone the repo

   ```bash
   git clone git@github.com:Aritra212/portfolio-task.git
   cd portfolio-task
   ```

2. Install dependencies

```bash
pnpm install
```

3. Create environment file

   Copy env.example → .env

4. Run development server

```bash
pnpm run dev
```

Open http://localhost:3000 in your browser.

---

## ⚡ Features

- Displays holdings in a table view with stock details.

- Fetches Current Market Price (CMP), P/E Ratio dynamically.

- Calculates Investment, Present Value, Gain/Loss, and Portfolio %.

- Grouping by sectors like Financials, Tech, Consumer, Power, Pipes, and Others.

---

## 🛠️ Challenges Faced

Extracting data from Excel and converting it into clean JSON with sector categories.

Handling missing fields like P/E Ratio and Earnings (not in Excel, fetched via API).

Getting reliable CMP and P/E values from Yahoo Finance API (type issues, inconsistent data).

---

## 📂 Tech Stack

Next.js (App Router)

TypeScript

Tailwind CSS + shadcn/ui

Yahoo-Finance2
