# Free Hosting Options for Production

## 🏆 Best Free Options (2025)

### 1. Render.com (Recommended ⭐)

**Free Tier:**
- ✅ 750 hours/month free (enough for 1 app running 24/7)
- ✅ Automatic deploys from GitHub
- ✅ Free SSL certificates
- ✅ Good for Node.js apps
- ⚠️ Apps sleep after 15 minutes of inactivity
- ⚠️ Takes ~1 minute to wake up

**Pros:**
- Very easy to set up
- Great for USSD apps (wakes up quickly)
- Free PostgreSQL database included
- Environment variables support

**How to Deploy:**
1. Go to https://render.com
2. Sign up (free)
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variable: `MONGO_URI`

**Best for:** Your church USSD app!

---

### 2. Railway.app

**Free Tier:**
- ✅ $5 credit per month (enough for small apps)
- ✅ Very developer-friendly
- ✅ No sleep time
- ✅ Fast deployments

**Pros:**
- Always running (no sleep)
- Easy GitHub integration
- Great performance

**Cons:**
- Limited free credits (may run out mid-month for high traffic)

**How to Deploy:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Add `MONGO_URI` environment variable
6. Deploy!

**Best for:** Apps that need to be always on

---

### 3. Fly.io

**Free Tier:**
- ✅ 3 shared VMs (256MB RAM each)
- ✅ 160GB outbound data transfer
- ✅ No sleep time
- ⚠️ Requires credit card (won't charge unless you upgrade)

**Pros:**
- Apps stay running
- Global deployment
- Good performance

**Cons:**
- Slightly more complex setup
- Requires credit card

**How to Deploy:**
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. `fly auth signup`
3. `fly launch` (in your project directory)
4. Set secrets: `fly secrets set MONGO_URI=your-uri`
5. Deploy: `fly deploy`

**Best for:** Apps needing global reach

---

### 4. Cyclic.sh

**Status:** ⚠️ Recently acquired by Northflank (free tier status uncertain)

**Previously offered:**
- Unlimited apps
- No sleep time
- Very easy deployment

**Note:** Check current status at https://cyclic.sh

---

### 5. Vercel

**Free Tier:**
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ⚠️ Designed for serverless/frontend apps
- ⚠️ Not ideal for persistent Node.js apps

**Pros:**
- Great for Next.js
- Very fast CDN

**Cons:**
- Functions have 10-second timeout (won't work for USSD)
- Not suitable for your use case

**Best for:** Frontend apps, not your USSD app

---

### ❌ No Longer Free

**Heroku** - Ended free tier in November 2022

---

## 🎯 My Recommendation for Your Church USSD App

### Best Choice: **Render.com** or **Railway.app**

Both are excellent, but here's when to choose each:

**Choose Render if:**
- You want the simplest setup
- Your USSD code isn't dialed frequently (sleep is okay)
- You want zero risk of charges

**Choose Railway if:**
- You need the app always running (no sleep)
- You expect consistent traffic
- You're okay monitoring monthly credit usage

---

## 📋 Quick Deployment Comparison

| Platform | Free? | Sleep? | Setup Difficulty | Best For |
|----------|-------|--------|------------------|----------|
| **Render** | ✅ Yes | After 15 min | ⭐ Easy | USSD apps (recommended) |
| **Railway** | ✅ $5/mo credit | ❌ No | ⭐ Easy | Always-on apps |
| **Fly.io** | ✅ Yes | ❌ No | ⭐⭐ Moderate | Global apps |
| **Cyclic** | ❓ Check site | - | ⭐ Easy | TBD |
| **Vercel** | ✅ Yes | ❌ No | ⭐ Easy | Frontend only |
| **Heroku** | ❌ Paid only | - | ⭐⭐ Moderate | Not free anymore |

---

## 🚀 Step-by-Step: Deploy to Render (Recommended)

### 1. Prepare Your Repo

Make sure your `package.json` has:
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub

### 3. Create Web Service

1. Click "New +" → "Web Service"
2. Connect your GitHub account (if not already)
3. Find and select `mbish-tech/church-ussd-app`
4. Click "Connect"

### 4. Configure Service

- **Name:** `church-ussd-app` (or any name)
- **Region:** Choose closest to Kenya (e.g., Frankfurt or Singapore)
- **Branch:** `claude/work-in-progress-011CUdTauqmA5Akmzapqcd7S` or `main`
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

### 5. Add Environment Variables

Click "Advanced" → "Add Environment Variable":
- **Key:** `MONGO_URI`
- **Value:** `mongodb+srv://grace99mbinya:Esta6042%231@cluster0.kgjph16.mongodb.net/?appName=Cluster0`

### 6. Deploy

1. Click "Create Web Service"
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://church-ussd-app.onrender.com`

### 7. Test Your Deployment

```bash
curl -X POST https://church-ussd-app.onrender.com/ussd \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=%2B1234567890&text="
```

### 8. Configure USSD Provider

Go to your USSD provider (Africa's Talking, Twilio, etc.) and set webhook:
```
https://church-ussd-app.onrender.com/ussd
```

---

## 💡 Tips for Free Tier

### Prevent Sleep on Render:

Use a free uptime monitor to ping your app every 10 minutes:
- **UptimeRobot** (https://uptimerobot.com) - Free
- **Cron-job.org** (https://cron-job.org) - Free
- Ping URL: `https://your-app.onrender.com/ussd`

### Monitor Your App:

- Render Dashboard shows logs
- Set up email alerts for crashes
- Check MongoDB Atlas for data

---

## 🔒 Security Note

Don't commit `.env` file! It's already in `.gitignore`. Always set environment variables in the hosting platform dashboard.

---

## Need Help Deploying?

Let me know which platform you choose and I can:
1. Help configure the deployment
2. Create deployment documentation
3. Set up the webhook with your USSD provider
4. Test the production deployment

---

Would you like me to help you deploy to Render right now?
