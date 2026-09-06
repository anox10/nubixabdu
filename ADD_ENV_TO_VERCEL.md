# Add Supabase Environment Variables to Vercel

## Step-by-Step Guide

### Step 1: Go to Your Vercel Project Settings
1. Open: https://vercel.com/anox10/clinora-deploy
2. Click on **"Settings"** tab (at the top)

### Step 2: Navigate to Environment Variables
1. In the left sidebar, click **"Environment Variables"**

### Step 3: Add Your Supabase URL
1. Click **"Add New"** button
2. **Key (Name):** Type exactly: `VITE_SUPABASE_URL`
3. **Value:** Paste your Supabase URL (looks like: `https://xxxxx.supabase.co`)
4. **Environment:** Select **"Production"**, **"Preview"**, and **"Development"** (all three)
5. Click **"Save"**

### Step 4: Add Your Supabase Anon Key
1. Click **"Add New"** button again
2. **Key (Name):** Type exactly: `VITE_SUPABASE_ANON_KEY`
3. **Value:** Paste your Supabase anon/public key (long string starting with `eyJ...`)
4. **Environment:** Select **"Production"**, **"Preview"**, and **"Development"** (all three)
5. Click **"Save"**

### Step 5: Redeploy Your Site
1. Go to **"Deployments"** tab (at the top)
2. Find the latest deployment (the one at the top)
3. Click the **three dots (...)** on the right
4. Click **"Redeploy"**
5. Confirm by clicking **"Redeploy"** again

### Step 6: Wait for Deployment
- Takes about 2-3 minutes
- Watch the deployment status
- When it says "Ready", click **"Visit"**

### Step 7: Test Your Site
1. Open your site
2. The "Failed to fetch" error should be gone
3. You should see the login page working
4. Check the language dropdown: 🌐 English, മലയാളം, हिन्दी, ಕನ್ನಡ

---

## Quick Reference

**Your Vercel Project:** https://vercel.com/anox10/clinora-deploy

**Two Variables to Add:**
- `VITE_SUPABASE_URL` = Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

**Where to Find Your Supabase Credentials:**
1. https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy "Project URL" and "anon public" key

---

## After Adding Variables

✅ Login/Register will work  
✅ Database connections will work  
✅ All 4 languages will be available (English, Malayalam, Hindi, Kannada)  
✅ No more "Failed to fetch" errors

---

**Let me know once you've added the environment variables and redeployed!**
