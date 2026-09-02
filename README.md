# ⚡ Networking Academy — Level 1

An interactive, visual, and zero-buzzword educational platform designed for new engineers to learn networking from first technical principles.

---

## 🚀 How to Publish for Free to GitHub Pages

Follow these simple steps to host your site live on GitHub in less than 2 minutes:

### Step 1: Create a New GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g. `networking-level-1` or `<your-username>.github.io`).
3. Set the repository to **Public** and click **Create repository**.

### Step 2: Push Your Code
Open your terminal/PowerShell in this folder (`c:\Users\User\OneDrive\Documents\E-Platform\Netowrking level 1`) and run:

```bash
# 1. Initialize Git (if not already done)
git init

# 2. Add all files
git add .

# 3. Create your first commit
git commit -m "Initial commit: Networking Academy Level 1 with interactive visualizers & terminal"

# 4. Set branch to main
git branch -M main

# 5. Link to your GitHub repo (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# 6. Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** ➔ **Pages** (in the left sidebar).
3. Under **Build and deployment > Source**, select **GitHub Actions** (recommended, since this repo includes an automated `.github/workflows/deploy.yml` workflow) or select **Deploy from a branch** (`main` / `/root`).
4. Your website will be live in ~30 seconds at:
   `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`

---

## 💻 Local Testing

You can also run or test the site locally:
- **Directly**: Double-click `index.html` to open it in your browser.
- **Local Server**:
  ```bash
  python -m http.server 8000
  ```
  Then visit `http://localhost:8000`.
