# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `blackjack-multiplayer`
   - **Description**: `Real-time multiplayer Blackjack game with Firebase backend`
   - **Visibility**: Public (recommended for portfolio)
   - **Initialize**: Don't check any boxes (we already have files)
5. Click "Create repository"

### Option B: Using GitHub CLI (if installed)
```bash
gh repo create blackjack-multiplayer --public --description "Real-time multiplayer Blackjack game with Firebase backend"
```

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Run these commands in your project directory:

```bash
# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/blackjack-multiplayer.git

# Set the main branch
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 3: Verify Repository Setup

1. Go to your repository on GitHub
2. Verify all files are uploaded correctly
3. Check that the README.md displays properly
4. Ensure the project structure is complete

## Step 4: Configure Repository Settings

### 4.1 Add Repository Topics
1. Go to your repository settings
2. Scroll down to "About" section
3. Add topics: `react`, `firebase`, `blackjack`, `multiplayer`, `netlify`, `javascript`

### 4.2 Enable GitHub Pages (Optional)
1. Go to Settings > Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Save

### 4.3 Add Repository Description
Update the repository description to:
```
🃏 Real-time multiplayer Blackjack game built with React, Firebase, and Netlify. Features 6-deck shoe, side bets, multiple hands, and VND chip betting system.
```

## Step 5: Create GitHub Issues for Future Development

### 5.1 Feature Requests
Create issues for potential enhancements:
- [ ] Add sound effects
- [ ] Implement player statistics
- [ ] Add tournament mode
- [ ] Mobile app version
- [ ] Spectator mode

### 5.2 Bug Reports Template
Create a bug report template in `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug report
about: Create a report to help us improve
title: ''
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Desktop (please complete the following information):**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

## Step 6: Set Up Continuous Deployment

### 6.1 Connect to Netlify
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Choose "GitHub" and authorize
4. Select your `blackjack-multiplayer` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Node version**: 18 (or latest)
6. Click "Deploy site"

### 6.2 Configure Environment Variables in Netlify
1. In Netlify dashboard, go to Site settings
2. Go to Environment variables
3. Add your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```
4. Redeploy the site

## Step 7: Create Development Workflow

### 7.1 Create Branch Protection Rules
1. Go to Settings > Branches
2. Add rule for `main` branch
3. Enable "Require pull request reviews"
4. Enable "Require status checks to pass"
5. Enable "Require branches to be up to date"

### 7.2 Create Pull Request Template
Create `.github/pull_request_template.md`:

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested multiplayer functionality
- [ ] Verified Firebase integration

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

## Step 8: Add Repository Badges

Add these badges to your README.md:

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)
[![GitHub last commit](https://img.shields.io/github/last-commit/YOUR_USERNAME/blackjack-multiplayer)](https://github.com/YOUR_USERNAME/blackjack-multiplayer)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/blackjack-multiplayer?style=social)](https://github.com/YOUR_USERNAME/blackjack-multiplayer)
```

## Step 9: Create Contributing Guidelines

Create `CONTRIBUTING.md`:

```markdown
# Contributing to Blackjack Multiplayer

Thank you for your interest in contributing to this project!

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test thoroughly
7. Commit your changes: `git commit -m "Add your feature"`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Create a Pull Request

## Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test multiplayer functionality
- Update documentation as needed

## Reporting Issues

When reporting issues, please include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Screenshots if applicable
```

## Step 10: Final Repository Structure

Your repository should now have:

```
blackjack-multiplayer/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── bug_report.md
│   └── pull_request_template.md
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   ├── firebase/
│   ├── services/
│   ├── utils/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── .gitignore
├── CONTRIBUTING.md
├── README.md
├── SETUP.md
├── GITHUB_SETUP.md
├── deploy.sh
├── env.example
├── netlify.toml
└── package.json
```

## Next Steps

1. **Test the deployment**: Visit your Netlify URL
2. **Share with friends**: Test multiplayer functionality
3. **Monitor performance**: Check Firebase usage
4. **Gather feedback**: Ask users for improvements
5. **Plan features**: Use GitHub Issues for roadmap

## Repository URLs

After setup, you'll have:
- **GitHub Repository**: `https://github.com/YOUR_USERNAME/blackjack-multiplayer`
- **Live Demo**: `https://YOUR_SITE_NAME.netlify.app`
- **Documentation**: Available in README.md and SETUP.md

Your Blackjack multiplayer platform is now ready for the world! 🃏🎉
