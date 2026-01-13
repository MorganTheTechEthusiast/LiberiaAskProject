# 🚀 Deploying AskLiberia to Vercel via GitHub

Follow these steps to deploy the AskLiberia National Knowledge Engine. This setup ensures your Gemini API key remains secure and the application performs optimally.

## 1. Prepare Your Repository
1. Ensure all files are in the root directory of your GitHub repository (no nested `src` folder as per project structure).
2. Verify your `package.json` has the necessary build scripts:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "tsc && vite build",
     "preview": "vite preview"
   }
   ```

## 2. Connect to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** and select **"Project"**.
3. Import your GitHub repository.

## 3. Configure Build Settings
Vercel should auto-detect Vite, but ensure these settings are correct:
- **Framework Preset:** Vite
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## 4. Set Environment Variables (CRITICAL)
Your app requires an API Key to function. **Do not hardcode it.**
1. In the Vercel project setup, find the **Environment Variables** section.
2. Add a new variable:
   - **Key:** `API_KEY`
   - **Value:** `YOUR_GEMINI_API_KEY_HERE`
3. Click **Add**.

## 5. Deploy
1. Click **Deploy**. Vercel will build your TypeScript files and bundle the application.
2. Once finished, Vercel will provide a production URL (e.g., `ask-liberia.vercel.app`).

## 🛠️ Important Notes for this Project
- **API Key Security:** By using Vercel's Environment Variables and the `define` config in `vite.config.ts`, your key is injected at build time. 
- **Geolocation:** If you implement Maps grounding later, remember that Vercel's production URL must be served over HTTPS (which Vercel handles automatically) for browser geolocation to work.
- **Microphone Access:** Ensure you have added the necessary permissions in `metadata.json` so the browser prompts the user correctly on your live URL.
