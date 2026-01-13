
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
     - **Value**: `[Your Google Gemini API Key]`
   - *Note: This key is required for the Search Engine and TTS features to function.*

## Step 4: Finalize Deployment
1. Click **"Deploy"**.
2. Wait 1-2 minutes for the build to complete.
3. Once finished, click the **"Visit"** button or the provided URL (e.g., `https://ask-liberia.vercel.app`).

## Step 5: Updating the App
To update your live site in the future:
1. Make changes to your code locally.
2. Run `git add .`, `git commit -m "Update"`, and `git push`.
3. Vercel will automatically detect the push and redeploy your site within seconds.

---
**Security Warning**: Never share your `.env` file or hardcode your `API_KEY` directly into `services/geminiService.ts`. Always use the Vercel Dashboard for secret management.
