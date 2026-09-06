# Step-by-Step Vercel Deployment Instructions

## Follow These Steps in Your Terminal

### Step 1: Login to Vercel

Open your terminal and run:

```bash
vercel login
```

**What will happen:**
- A browser window will open
- Login with GitHub, GitLab, Bitbucket, or Email
- After login, return to your terminal

---

### Step 2: Navigate to Your Project

```bash
cd C:\Users\SYED\my-project\nubixabdu\frontend
```

---

### Step 3: Deploy to Vercel

```bash
vercel deploy --prod
```

**Answer the prompts:**

1. **Set up and deploy "...frontend"?** → Press `Y` (Yes)

2. **Which scope do you want to deploy to?** → Select your account

3. **Link to existing project?** → Press `N` (No) for first time

4. **What's your project's name?** → Type: `clinora` or press Enter for default

5. **In which directory is your code located?** → Press Enter (it will use `.`)

6. **Want to override the settings?** → Press `N` (No)

Vercel will then:
- Upload your files
- Build the project
- Deploy to production

---

### Step 4: Get Your URL

After deployment completes (1-2 minutes), you'll see:

```
✅ Production: https://clinora-xxxxx.vercel.app [copied to clipboard]
```

**That's your website URL!** Copy it and test the language dropdown.

---

## Alternative: Vercel Web Dashboard (No CLI Needed)

If you prefer not to use the command line:

1. **Go to:** https://vercel.com/new
2. **Login** with your account
3. **Click:** "Import Git Repository"
4. **Connect GitHub** if not already connected
5. **Select repository:** `anox10/nubixabdu`
6. **Configure settings:**
   ```
   Root Directory: frontend
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```
7. **Click "Deploy"**

Wait 2 minutes and you'll get your URL!

---

## What to Test After Deployment

Once you have the URL:

1. Open the website
2. Look for the **🌐 globe icon** in the top-right navbar
3. Click it and switch between:
   - 🇬🇧 English
   - 🇮🇳 മലയാളം (Malayalam)
   - 🇮🇳 हिन्दी (Hindi)
4. Verify all text changes instantly!

---

## Troubleshooting

**"vercel: command not found"**
```bash
npm install -g vercel
```

**"Error: No Space"**
- This means git hasn't been pushed yet
- Just continue with the deployment, it will work

**Build fails?**
- Check if you have `frontend/.env` file with Supabase credentials
- Make sure environment variables are set in Vercel dashboard

---

## Need Help?

Share any error messages you see and I'll help you fix them!

Once deployed, share the URL so we can verify the multi-language feature works correctly.
