# 🚀 AI Civic Copilot

## 📌 Overview

AI Civic Copilot is an AI-powered government scheme recommendation platform that helps citizens discover government welfare schemes they are eligible for.

Many citizens miss important benefits because they are unaware of available schemes or find government portals difficult to navigate.

This project simplifies the process by analyzing citizen details and recommending suitable schemes based on eligibility criteria.

---

# 🎯 Problem Statement

Millions of citizens are unable to access government welfare benefits because:

- They do not know which schemes they qualify for.
- Eligibility rules are complex and difficult to understand.
- Existing portals require manual searching.
- Rural citizens face language and accessibility barriers.

---

# 💡 Solution

AI Civic Copilot acts as a personal government benefits assistant.

The system:

1. Collects citizen information.
2. Evaluates eligibility criteria.
3. Matches citizens with suitable government schemes.
4. Provides personalized recommendations.

---

# ✨ Key Features

## 1. Citizen Profile Analysis

Users can provide:

- Age
- Gender
- Annual income
- Land ownership status
- Bank account availability


## 2. Government Scheme Eligibility Engine

A rule-based engine analyzes citizen information and checks eligibility against available schemes.

---

## Repository structure

```text
backend/
  data/       Scheme data
  routes/     HTTP endpoints
  services/   Eligibility, OCR, AI, and recommendation logic
  tests/      Automated backend tests
src/
  components/ Active React UI components
  services/   Frontend API and report helpers
  assets/     Referenced frontend assets
public/       Static files served by Vite
```

Deployment configuration and package scripts stay at the repository root so
Vercel and Render can discover them without custom paths.

---

## Deployment

The repository is configured for a Vite frontend on Vercel and an Express API
on Render. The backend runs from the repository root and does not persist
uploaded documents; files are processed in memory and discarded after OCR.

### Render backend

- Root directory: repository root (`.`)
- Build command: `npm install`
- Start command: `node backend/server.js`
- Health check: `/healthz`
- Node.js: `22.13.0` or newer supported release (or Node `20.19.0` LTS)

Set these Render environment variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `FRONTEND_URL` | Yes | Exact Vercel production URL; comma-separate additional allowed origins |
| `GEMINI_API_KEY` | For AI chat | Gemini API key; the API still starts without it |
| `GEMINI_MODEL` | No | Gemini model name; defaults to `gemini-3.5-flash-lite`; legacy `gemini-2.5-flash` values use this default |
| `NODE_ENV` | No | Set to `production` |

`backend/.env.example` contains placeholders for local development. Never put
real keys in tracked files.

### Vercel frontend

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- `.env.production` sets the public `VITE_API_URL` to the Render service origin;
  it contains no secret. If overriding it in Vercel, use the same origin and do
  not append `/api`.

`.env.example` contains the local Vite API URL placeholder.

### Upload and eligibility behavior

The API accepts JPG, JPEG, PNG, and PDF files up to 10 MB. Image documents use
English OCR; searchable PDFs use text extraction for up to 20 pages, and
scanned PDFs use OCR on their first five pages. Documents are validated and processed in memory. OCR
extracts only supported profile fields and never returns document text.

Eligibility results require all applicable rule inputs to be known and matched.
Unknown information is reported separately; a match is not a government
approval guarantee. Missing documents are based on the document slots selected
as provided by the user.

