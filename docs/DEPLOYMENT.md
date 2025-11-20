
# 🚀 Deployment Guide for AskLiberia

This guide explains how to deploy AskLiberia to production using **Vercel** (Recommended).

---

## 🔑 Phase 1: Environment Configuration

To make the app work in production, you must provide your Gemini API key to Vercel.

**On Vercel Dashboard:**
1.  Go to your project Settings.
2.  Click on **Environment Variables**.
3.  Add the following:

| Key | Value |
| :--- | :--- |
| `VITE_API_KEY` | `AIza...` (Your actual API Key from Google AI Studio) |

> **Important:** The key name must be exactly `VITE_API_KEY` for the app to read it safely in the browser.

---

## ☁️ Phase 2: Deploying to Vercel

1.  **Push to GitHub**:
    *   Ensure your code is in a GitHub repository.
    *   You do **not** need to move files into a `src/` folder. The app is configured to work with the files in the root directory.

2.  **Import Project in Vercel**:
    *   Go to [vercel.com](https://vercel.com).
    *   Click **"Add New..."** -> **"Project"**.
    *   Select your GitHub repository.

3.  **Build Settings (Auto-detected)**:
    *   Vercel should automatically detect "Vite".
    *   Build Command: `npm run build` (or `vite build`)
    *   Output Directory: `dist`

4.  **Deploy**:
    *   Click **Deploy**.
    *   Wait for the build to finish. If you see a "White Screen", check the console for errors, but the `vite.config.ts` included in this project should fix standard path issues.

---

## 🛠️ Troubleshooting

*   **"Build failed - Failed to resolve /src/index.tsx"**:
    *   This means `index.html` is pointing to a file that doesn't exist.
    *   **Fix:** Ensure `index.html` has `<script type="module" src="/index.tsx"></script>` (pointing to root) and NOT `/src/index.tsx`.

*   **"API Key Missing"**:
    *   Check that you added `VITE_API_KEY` in Vercel Environment Variables.
    *   Ensure you did not wrap the key in quotes.
