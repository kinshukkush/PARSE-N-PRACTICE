# 🔑 API Key Setup Guide

This guide helps you set up your OpenRouter API key for Parse & Practice. Follow the steps below based on your use case.

---

## 🎯 Where to Add Your API Key

The Parse & Practice app requires an **OpenRouter API key** to power its AI features. You need to add this key in **different locations** depending on how you're running the app:

1. **For Local Development**: Add the key to a `.env` file
2. **For GitHub Pages Deployment**: Add the key to GitHub Secrets

---

## 📋 Quick Summary

| Use Case | Where to Add API Key | File/Location |
|----------|---------------------|---------------|
| **Local Development** | `.env` file in project root | `VITE_OPENROUTER_API_KEY=your_key_here` |
| **GitHub Pages** | GitHub Repository Secrets | Settings → Secrets → `VITE_OPENROUTER_API_KEY` |

---

## 🚀 Step-by-Step Setup

### Step 1: Get Your OpenRouter API Key

1. **Visit OpenRouter**: Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. **Sign Up/Login**: Create an account or log in if you already have one
3. **Create API Key**: 
   - Click on "Create Key" or "New Key"
   - Give it a name (e.g., "Parse & Practice")
   - Copy the generated API key (it looks like `sk-or-v1-...`)
4. **Important**: Save this key securely - you won't be able to see it again!
5. **Verify the Key** (Optional but Recommended):
   - Test your key immediately after creation to ensure it works
   - You can test it with this command:
     ```bash
     curl https://openrouter.ai/api/v1/auth/key \
       -H "Authorization: Bearer YOUR_API_KEY"
     ```
   - If the key is valid, you'll get a success response
   - If you get "User not found" error, the key may be invalid or your account needs verification

---

### Step 2A: Setup for Local Development

If you want to run the app on your local machine:

1. **Navigate to Project Directory**
   ```bash
   cd PARSE-N-PRACTICE
   ```

2. **Create `.env` File**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Or create it manually:
   ```bash
   # On Linux/Mac
   touch .env
   
   # On Windows (Command Prompt)
   type nul > .env
   
   # On Windows (PowerShell)
   New-Item .env -ItemType File
   ```

3. **Add Your API Key to `.env`**
   
   Open the `.env` file in any text editor and add:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
   ```
   
   **Replace** `sk-or-v1-your-actual-api-key-here` with your actual OpenRouter API key from Step 1.
   
   ⚠️ **Important**: 
   - Remove any spaces around the `=` sign
   - Don't use quotes around the key
   - The `.env` file should be in the root directory (same level as `package.json`)

4. **Verify the File**
   
   Your `.env` file should look exactly like this:
   ```
   # OpenRouter API Configuration
   # Get your API key from: https://openrouter.ai/keys
   VITE_OPENROUTER_API_KEY=sk-or-v1-1234567890abcdefghijklmnopqrstuvwxyz
   ```

5. **Install Dependencies and Run**
   ```bash
   npm install
   npm run dev
   ```

6. **Test the Setup**
   - Open your browser at `http://localhost:5173`
   - Upload or paste some text with questions
   - Click "Analyze with AI"
   - If configured correctly, the AI will analyze your content

**Troubleshooting Local Setup**:
- ❌ If you see "VITE_OPENROUTER_API_KEY is not set" in the browser console:
  - Check that your `.env` file is in the correct location (project root)
  - Verify there are no typos in the variable name
  - Restart the development server (`npm run dev`)
- ❌ If you get API errors:
  - Verify your API key is correct
  - Check your OpenRouter account has credits
  - Review the browser console for detailed error messages

---

### Step 2B: Setup for GitHub Pages Deployment

If you want to deploy the app to GitHub Pages:

1. **Go to Your GitHub Repository**
   - Navigate to: `https://github.com/YOUR_USERNAME/PARSE-N-PRACTICE`

2. **Access Repository Settings**
   - Click on the **Settings** tab (top menu bar)
   - In the left sidebar, scroll down to **Security** section
   - Click on **Secrets and variables** → **Actions**

3. **Add Your API Key as a Secret**
   - Click the **New repository secret** button (green button on the right)
   - In the "Name" field, enter exactly: `VITE_OPENROUTER_API_KEY`
   - In the "Secret" field, paste your OpenRouter API key
   - Click **Add secret**

4. **Verify the Secret**
   - You should see `VITE_OPENROUTER_API_KEY` in the list of secrets
   - The value will be hidden for security

5. **Deploy to GitHub Pages**
   
   **Option A: Automatic Deployment** (Recommended)
   - Simply push to the `main` branch:
     ```bash
     git add .
     git commit -m "Your commit message"
     git push origin main
     ```
   - GitHub Actions will automatically build and deploy
   - Check the **Actions** tab to monitor deployment progress

   **Option B: Manual Deployment**
   - First, ensure you have a `.env` file with your API key (see Step 2A above)
   - Build the project locally:
     ```bash
     npm run build
     ```
   - Deploy using gh-pages:
     ```bash
     npm run deploy
     ```
   - Note: The API key from your local `.env` will be embedded in the build

6. **Enable GitHub Pages** (if not already enabled)
   - Go to Settings → Pages
   - Under "Source", select the `gh-pages` branch
   - Click Save
   - Your site will be live at: `https://YOUR_USERNAME.github.io/PARSE-N-PRACTICE/`

**Troubleshooting GitHub Deployment**:
- ❌ If deployment fails:
  - Check the **Actions** tab for error logs
  - Verify the secret name is exactly `VITE_OPENROUTER_API_KEY` (case-sensitive)
  - Ensure the secret value is a valid OpenRouter API key (starts with `sk-or-v1-`)
  - Make sure there are no extra spaces when pasting the key into GitHub Secrets
- ❌ If the deployed site doesn't work or shows "User not found" error:
  - Open browser console (F12) to see detailed error messages
  - **Most common cause**: The API key in GitHub Secrets is invalid or has extra spaces
  - **Solution**: Delete and recreate the GitHub Secret with a fresh copy of the key
  - Verify your OpenRouter account is active at https://openrouter.ai/keys
  - Check your OpenRouter account has credits/quota available
  - Wait a few minutes for GitHub Pages to update after redeployment
  - Try triggering a new deployment: Go to Actions → Deploy to GitHub Pages → Run workflow

---

## 🔍 How the API Key Works

### In the Code

The API key is used in `src/lib/aiService.ts`:

```typescript
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

// Validate API key on module load
if (!OPENROUTER_API_KEY) {
  console.error('⚠️ VITE_OPENROUTER_API_KEY is not set. Please add it to your .env file.');
}
```

This code reads the API key from the environment variables at build time and validates that it's present.

### During Build

- **Vite** (the build tool) injects environment variables starting with `VITE_` into your code
- During local development, Vite reads from the `.env` file
- During GitHub Actions deployment, Vite reads from environment variables set in the workflow

### At Runtime

- The API key is embedded in the built JavaScript files
- When you make API calls to OpenRouter, the key is sent in the Authorization header
- This enables AI features like question extraction and content analysis

---

## 🔒 Security Best Practices

1. **Never Commit `.env` Files**
   - The `.env` file is listed in `.gitignore`
   - This prevents your API key from being exposed in Git history
   - Always keep API keys private!

2. **Rotate Keys Regularly**
   - Consider rotating your OpenRouter API key periodically
   - If a key is compromised, delete it immediately and create a new one

3. **Use Different Keys**
   - Consider using different API keys for development vs. production
   - This helps track usage and limit potential damage from key exposure

4. **Monitor Usage**
   - Regularly check your OpenRouter dashboard
   - Monitor API usage and costs
   - Set up billing alerts if available

---

## 📊 Verifying Your Setup

### Check 1: Environment Variable Loaded
Open the browser console (F12) and check for:
- ✅ No error message about missing API key
- ❌ "⚠️ VITE_OPENROUTER_API_KEY is not set" means the key wasn't loaded

### Check 2: API Calls Work
1. Upload or paste text content with questions
2. Click "Analyze with AI"
3. Watch the console for:
   - ✅ "🔍 Starting AI analysis..."
   - ✅ "📤 Sending analysis request to OpenRouter AI..."
   - ✅ "✅ Analysis complete"
   - ❌ "❌ OpenRouter API error" means there's an issue with the key or API

### Check 3: Features Work
- ✅ AI can detect if content has questions
- ✅ AI can extract questions from text
- ✅ Chat feature works
- ❌ Any feature fails → check API key and console errors

---

## 🆘 Common Issues and Solutions

### Issue: "API key is not set"
**Solution**: 
- Verify `.env` file exists in project root
- Check the variable name is exactly `VITE_OPENROUTER_API_KEY`
- Restart the dev server after creating `.env`

### Issue: "API request failed: 401" or "User not found"
**Solution**: 
- **Check your API key format**: The key should look like `sk-or-v1-...` (starts with `sk-or-v1-`)
- **Verify the key is active**: Log in to [OpenRouter](https://openrouter.ai/keys) and check if the key exists and is active
- **Check for extra spaces**: When pasting the key, make sure there are no leading/trailing spaces
- **Verify your account**: Make sure your OpenRouter account is active and verified
- **For GitHub Secrets**: 
  - Delete the existing secret and recreate it
  - Copy the key directly from OpenRouter without any extra characters
  - The secret name must be exactly `VITE_OPENROUTER_API_KEY` (case-sensitive)
- **Test the key**: Try using the key in a simple curl command to verify it works:
  ```bash
  curl https://openrouter.ai/api/v1/auth/key \
    -H "Authorization: Bearer YOUR_API_KEY"
  ```
- **Create a new key**: If the issue persists, delete the old key and create a fresh one at [OpenRouter Keys](https://openrouter.ai/keys)

### Issue: "API rate limit exceeded"
**Solution**: 
- Wait a few moments and try again
- Check your OpenRouter usage dashboard
- Consider upgrading your OpenRouter plan

### Issue: Changes to `.env` not reflected
**Solution**: 
- Stop the dev server (Ctrl+C)
- Run `npm run dev` again
- Vite only reads `.env` on startup

### Issue: GitHub Pages deployment works but AI features don't
**Solution**: 
- Verify GitHub Secret is set correctly
- Check secret name is exactly `VITE_OPENROUTER_API_KEY`
- Re-run the deployment workflow
- Check browser console for specific errors

---

## 📞 Getting Help

If you're still having issues:

1. **Check the Console**: Open browser DevTools (F12) → Console tab
2. **Read Error Messages**: Look for messages starting with ❌
3. **Verify API Key**: Test your key at [OpenRouter API Docs](https://openrouter.ai/docs)
4. **Open an Issue**: [Create a GitHub issue](https://github.com/kinshukkush/PARSE-N-PRACTICE/issues) with:
   - Your setup (local or GitHub Pages)
   - Error messages from console
   - Steps you've tried

---

## 📚 Additional Resources

- **OpenRouter Documentation**: [https://openrouter.ai/docs](https://openrouter.ai/docs)
- **OpenRouter API Keys**: [https://openrouter.ai/keys](https://openrouter.ai/keys)
- **Vite Environment Variables**: [https://vitejs.dev/guide/env-and-mode.html](https://vitejs.dev/guide/env-and-mode.html)
- **GitHub Secrets Documentation**: [https://docs.github.com/en/actions/security-guides/encrypted-secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Need more help?** Feel free to [open an issue](https://github.com/kinshukkush/PARSE-N-PRACTICE/issues) or check the [README.md](README.md) for general project information.
