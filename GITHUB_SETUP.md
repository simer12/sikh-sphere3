# Steps to Push SikhSphere to GitHub

## 1. Install Git
Download and install Git from: https://git-scm.com/download/win

## 2. Configure Git (Run these in PowerShell)
```powershell
git config --global user.name "simer12"
git config --global user.email "harsimerramgharia@gmail.com"
```

## 3. Initialize Repository
```powershell
cd "c:\Users\pc\OneDrive\Desktop\New folder (11)\New folder (11)"
git init
git add .
git commit -m "Initial commit: SikhSphere app with 104 calendar events, Nitnem, Hukamnama, Gurdwara Finder"
```

## 4. Create GitHub Repository
1. Go to https://github.com/simer12
2. Click "New repository"
3. Name: `sikh-sphere`
4. Description: "Complete Sikh religious app with Nanakshahi Calendar, Nitnem, Hukamnama, and Gurdwara Finder"
5. Keep it Public
6. DO NOT initialize with README (we already have one)
7. Click "Create repository"

## 5. Push to GitHub
```powershell
git remote add origin https://github.com/simer12/sikh-sphere.git
git branch -M main
git push -u origin main
```

## 6. If Asked for Authentication
- Use Personal Access Token instead of password
- Create token at: https://github.com/settings/tokens
- Select: repo (full control)
- Copy token and use as password when pushing

## Done! 
Your repo will be live at: https://github.com/simer12/sikh-sphere
