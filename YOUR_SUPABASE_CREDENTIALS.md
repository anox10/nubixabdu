# Your Supabase Credentials for Vercel

## Environment Variables to Add

### Variable 1:
**Key:** `VITE_SUPABASE_URL`
**Value:** `https://ipohghkajkyjzokbcbki.supabase.co`

### Variable 2:
**Key:** `VITE_SUPABASE_ANON_KEY`
**Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwb2hnaGthamt5anpva2JjYmtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxOTE0NzIsImV4cCI6MjEwMzc2NzQ3Mn0.AdsdZ4_q7jlXd6kh85zH9p7Y9pbQSf05gFHsP6dpL7g`

---

## How to Add to Vercel

### Step 1: Go to Environment Variables Page
**Direct Link:** https://vercel.com/anox10/clinora-deploy/settings/environment-variables

### Step 2: Add First Variable
1. Click **"Add New"** button
2. **Key:** Copy and paste: `VITE_SUPABASE_URL`
3. **Value:** Copy and paste: `https://ipohghkajkyjzokbcbki.supabase.co`
4. **Environments:** ✅ Check all 3 boxes (Production, Preview, Development)
5. Click **"Save"**

### Step 3: Add Second Variable
1. Click **"Add New"** button again
2. **Key:** Copy and paste: `VITE_SUPABASE_ANON_KEY`
3. **Value:** Copy and paste the long token starting with `eyJhbG...`
4. **Environments:** ✅ Check all 3 boxes (Production, Preview, Development)
5. Click **"Save"**

### Step 4: Redeploy
1. Go to: https://vercel.com/anox10/clinora-deploy
2. Click **"Deployments"** tab at the top
3. Find the **first deployment** in the list (most recent)
4. Click the **three dots (...)** on the right side
5. Click **"Redeploy"**
6. Confirm by clicking **"Redeploy"** in the popup

### Step 5: Wait & Test
- Wait 2-3 minutes for deployment to complete
- When it says "Ready", click **"Visit"** 
- Test login/register - should work now!
- Check language dropdown: 🌐 English, മലയാളം, हिन्दी, ಕನ್ನಡ

---

## ✅ After This Is Done

✅ No more "Failed to fetch" errors  
✅ Login and Register will work  
✅ Database connections active  
✅ All 4 languages available  

---

**Ready to add these? Follow the steps above and let me know when the redeploy is complete!**
