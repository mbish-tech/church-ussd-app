# How to Get MongoDB Connection URI

There are two main ways to get a MongoDB URI: using MongoDB Atlas (cloud, free, recommended) or installing MongoDB locally.

## Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

MongoDB Atlas provides a free cloud database that's perfect for development and small projects.

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email or Google account
3. Fill in your information and click "Create your Atlas account"
4. Verify your email address

### Step 2: Create a Free Cluster

1. After logging in, you'll see "Create a cluster" or "Build a database"
2. Choose the **FREE** option (M0 Sandbox - 512MB storage)
3. Select your cloud provider and region:
   - Provider: AWS, Google Cloud, or Azure (any is fine)
   - Region: Choose one closest to you
4. Cluster Name: Leave default or name it "ChurchCluster"
5. Click **"Create Cluster"** (takes 3-5 minutes to deploy)

### Step 3: Create Database User

1. Click **"Database Access"** in the left sidebar (under Security)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Set username (e.g., `churchadmin`)
5. Click **"Autogenerate Secure Password"** or create your own
6. **IMPORTANT: Copy and save this password!** You'll need it for the URI
7. Set privileges to **"Read and write to any database"**
8. Click **"Add User"**

### Step 4: Allow Network Access

1. Click **"Network Access"** in the left sidebar (under Security)
2. Click **"Add IP Address"**
3. For testing, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For production, you should restrict to specific IPs
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Find your cluster and click **"Connect"**
3. Select **"Connect your application"**
4. Driver: **Node.js**
5. Version: Select the latest version
6. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Prepare Your URI

Replace the placeholders in the connection string:
- Replace `<username>` with your database username (e.g., `churchadmin`)
- Replace `<password>` with the password you saved earlier

**Final URI Example:**
```
mongodb+srv://churchadmin:MySecurePass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

⚠️ **Important Notes:**
- Remove the `<` and `>` brackets
- If your password contains special characters (@, :, /, ?, #), you need to URL-encode them:
  - `@` becomes `%40`
  - `:` becomes `%3A`
  - `/` becomes `%2F`
  - `?` becomes `%3F`
  - `#` becomes `%23`

---

## Option 2: Local MongoDB Installation

If you prefer to run MongoDB on your computer:

### For Ubuntu/Debian Linux:

```bash
# Import MongoDB public key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Local MongoDB URI:**
```
mongodb://localhost:27017/churchdb
```

### For macOS:

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Local MongoDB URI:**
```
mongodb://localhost:27017/churchdb
```

### For Windows:

1. Download from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service
5. Start MongoDB service from Services

**Local MongoDB URI:**
```
mongodb://localhost:27017/churchdb
```

---

## Quick Comparison

| Feature | MongoDB Atlas (Cloud) | Local MongoDB |
|---------|----------------------|---------------|
| Cost | Free tier available | Free |
| Setup Time | 5-10 minutes | 10-30 minutes |
| Accessibility | Access from anywhere | Only your computer |
| Backup | Automatic | Manual |
| Best For | Production, testing | Development only |
| Recommended | ✅ Yes | For offline work |

---

## Next Steps After Getting Your URI

1. Create `.env` file in your project:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your URI:
   ```
   MONGO_URI=your-connection-string-here
   PORT=3000
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

4. Run tests:
   ```bash
   ./test-ussd.sh
   ```

---

## Troubleshooting

### "MongoServerError: bad auth"
- Check your username and password are correct
- Check for special characters in password (URL-encode them)

### "ECONNREFUSED"
- For Atlas: Check Network Access allows your IP
- For Local: Make sure MongoDB service is running

### "Server selection timed out"
- Check your internet connection
- Verify the cluster is running in Atlas dashboard
- Check Network Access settings in Atlas

### "Authentication failed"
- Verify database user exists in Database Access
- Check user has "Read and write" permissions
- Confirm password is correct (try resetting it)

---

## Security Best Practices

For production deployments:
1. ✅ Use strong passwords
2. ✅ Restrict Network Access to specific IPs
3. ✅ Use environment variables (never commit `.env` to git)
4. ✅ Enable MongoDB's built-in encryption
5. ✅ Regularly rotate database credentials
6. ✅ Use separate databases for dev/staging/production

---

Need help? Let me know which step you're stuck on!
