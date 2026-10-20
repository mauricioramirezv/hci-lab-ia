# Publicar HCI Lab + IA en GitHub

## Opción A: repositorio creado previamente en GitHub

```powershell
cd "D:\Proyectos de Desarrollo\hci-lab-ia"
git init
git add .
git commit -m "feat: crear HCI Lab + IA"
git branch -M main
git remote add origin https://github.com/mauricioramirezv/hci-lab-ia.git
git push -u origin main
```

En **Settings → Pages**, seleccione **GitHub Actions**. El workflow incluido realizará la publicación.

## Opción B: GitHub CLI

```powershell
cd "D:\Proyectos de Desarrollo\hci-lab-ia"
git init
git add .
git commit -m "feat: crear HCI Lab + IA"
git branch -M main
gh auth login
gh repo create hci-lab-ia --public --source=. --remote=origin --push
```

## Actualizaciones

```powershell
git status
git add .
git commit -m "feat: incorporar nuevos contenidos del curso"
git push
```
