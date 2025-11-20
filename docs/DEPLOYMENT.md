# 🚀 Deployment Guide for AskLiberia

This guide explains how to deploy AskLiberia to production using Vercel, Netlify, or Google Cloud Run.

Since this project uses React and TypeScript, we need a build tool (Vite) to bundle the code for the web.

---

## 🔑 API Key Configuration (Your Question)

To make the app work in production, you must provide your Gemini API key to the hosting provider.

**For Vercel or Netlify (Client-Side Deployment):**

| Setting | Value |
| :--- | :--- |
| **Key (Name)** | `VITE_API_KEY` |
| **Value** | `AIza...` (Your actual API Key from Google AI Studio) |

> **Why `VITE_`?**
> The build tool (Vite) requires environment variables to start with `VITE_` to be exposed to the browser for security reasons.

---

## 🏗️ Phase 1: Prepare the Project

Before deploying to Vercel or Netlify, you need to initialize the project structure.

1.  **Create a generic Vite project** (Run this in your terminal):
    ```bash
    npm create vite@latest ask-liberia -- --template react-ts
    cd ask-liberia
    npm install
    ```

2.  **Install Dependencies**:
    ```bash
    npm install lucide-react react-markdown @google/genai
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

3.  **Move Your Files (CRITICAL STEP)**:
    *   Copy your `components/`, `services/`, and `types.ts` folders into the `src/` folder.
    *   Replace the contents of `src/App.tsx` with your `App.tsx`.
    *   **IMPORTANT**: Copy `index.tsx` to `src/index.tsx`.
    *   **IMPORTANT**: Delete the default `src/main.tsx` file (Vite creates this by default, but we are using `index.tsx` instead).
    *   Replace the `index.html` in the root folder with your `index.html` (ensure it has the `<script type="module" src="/src/index.tsx"></script>` line).

4.  **Update `services/geminiService.ts`**:
    Change the API key line to support the deployment environment:
    ```typescript
    // src/services/geminiService.ts
    
    // Change this:
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // To this:
    const apiKey = import.meta.env.VITE_API_KEY || process.env.API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    ```

---

## ☁️ Option 1: Vercel (Recommended)

Vercel is the easiest platform for this stack.

1.  **Push to GitHub**:
    *   Create a new repository on GitHub.
    *   Push your prepared Vite project to it.

2.  **Deploy**:
    *   Go to [vercel.com](https://vercel.com) and sign up.
    *   Click **"Add New..."** -> **"Project"**.
    *   Select your GitHub repository.

3.  **Configure Environment Variables**:
    *   In the "Configure Project" screen, find **"Environment Variables"**.
    *   **Key**: `VITE_API_KEY`
    *   **Value**: Paste your actual Google AI Studio Key.

4.  **Click Deploy**: Vercel will build the site and give you a live URL.

---

## ⚡ Option 2: Netlify

1.  **Push to GitHub** (same as above).
2.  Go to [netlify.com](https://netlify.com).
3.  Click **"Add new site"** -> **"Import from existing project"**.
4.  Select GitHub and your repository.
5.  **Build Settings**:
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
6.  **Environment Variables**:
    *   Click **"Add environment variables"**.
    *   **Key**: `VITE_API_KEY`
    *   **Value**: Your Gemini API Key.
7.  Click **Deploy**.

---

## 🐳 Option 3: Google Cloud Run

Use this if you want to deploy a Docker container.

1.  **Create a `Dockerfile`** in your project root:
    ```dockerfile
    # Build Stage
    FROM node:18-alpine as build
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    # We accept the key as a build arg to bake it into the static files
    ARG VITE_API_KEY
    ENV VITE_API_KEY=$VITE_API_KEY
    RUN npm run build

    # Production Stage
    FROM nginx:alpine
    COPY --from=build /app/dist /usr/share/nginx/html
    # Config for Single Page App routing
    RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    ```

2.  **Build & Deploy**:
    ```bash
    # 1. Set your Project ID
    gcloud config set project YOUR_PROJECT_ID

    # 2. Submit build to Cloud Build (Replace KEY_VALUE with your actual key)
    gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ask-liberia --build-arg VITE_API_KEY=KEY_VALUE .

    # 3. Deploy to Cloud Run
    gcloud run deploy ask-liberia \
      --image gcr.io/YOUR_PROJECT_ID/ask-liberia \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated
    ```