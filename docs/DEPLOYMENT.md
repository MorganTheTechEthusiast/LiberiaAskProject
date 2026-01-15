
# 🚀 Hosting AskLiberia on Vercel (Step-by-Step)

Follow these precise steps to get your Liberian Search Engine live on the web using Vercel and GitHub.

## Step 1: Push Code to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Initialize your local project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AskLiberia Search Engine"
   ```
3. Link your local folder to GitHub and push:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Connect Vercel to GitHub
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** and select **"Project"**.
3. Find your GitHub repository in the list and click **"Import"**.

## Step 3: Configure Build & Environment Variables
Before clicking Deploy, you must set up the project configuration:

1. **Build Settings**:
   - Vercel should automatically detect **Vite**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

2. **Environment Variables**:
   - Scroll down to the **Environment Variables** section.
   - Add the following:
     - **Key**: `API_KEY`
     - **Value**: `[Your Google Gemini API Key from AI Studio]`
     - **Key**: `VITE_GOOGLE_CLIENT_ID`
     - **Value**: `[Your OAuth Client ID from Google Cloud Console]`

## Step 4: Finalize Deployment
1. Click **"Deploy"**.
2. Wait 1-2 minutes for the build to complete.
3. Once finished, click the **"Visit"** button.

## Step 5: Update Google Cloud (Crucial!)
1. Copy your new live Vercel URL (e.g., `https://ask-liberia.vercel.app`).
2. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
3. Edit your OAuth Client ID.
4. Add your Vercel URL to **"Authorized JavaScript origins"**.
5. Save. It may take 5 minutes for Google to update.

---
**Security Warning**: Never share your `.env` file. Always use the Vercel Dashboard for secret management.
