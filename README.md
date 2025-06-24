# 🚀 DOCKaroo – Live Container Editing, Simplified

**DOCKaroo** is a user-friendly VS Code extension for live Docker container editing. Inspired by Microsoft's *Dev Containers*, it takes a simpler, more streamlined approach that minimizes the amount of configuration and documentation required.

Unlike traditional setups, **DOCKaroo** skips the clutter and lets you mount your project directly via Dockerfile and volume bindings—making it especially easy for quick prototyping, debugging, and testing in containerized environments.

> 🔧 Currently optimized for **Python** and **Node.js** projects.

---

## ✨ Features

- 🐳 **Live container editing** via Docker volumes  
- 🗂️ **Minimal config required** – no `devcontainer.json`, just a `Dockerfile`  
- 📁 **Mounts local project folder** inside the container automatically  
- ⚡ **Fast & beginner-friendly** setup for working with Docker  
- 👨‍💻 Best suited for development and live experimentation with Python or Node.js  
- 📌 Ideal for users who want dev container-like functionality without heavy configs

### Demo

![DOCKaroo Demo](https://res.cloudinary.com/dp71rx6nx/image/upload/v1750739915/DOCKaroo_demo.gif)


---

## 📦 Requirements

- **Docker** must be installed and running on your system  
- Your project should contain a `Dockerfile` at the root  
- Basic structure expected:
project-root/
├── Dockerfile
└── (your code files)


---

## ⚙️ Extension Settings

This extension contributes the following settings (planned):

> _Note: These settings may be added in future versions._

- `dockaroo.autoStart`: Automatically start container when project opens  
- `dockaroo.defaultLanguage`: Set default language for environment boot  
- `dockaroo.mountPath`: Define custom mount path inside container  

---

## 🐞 Known Issues

- Currently limited to Python and Node.js environments  
- Language detection is not automatic yet  
- Some edge cases in volume mounting might behave inconsistently across OSes  
- UI layout may require enhancements for large projects  

---

## 📌 Roadmap

Planned for upcoming releases:

- ✅ Auto-detect project language (Python, Node.js, etc.)  
- ✅ Improve UI and error feedback  
- ✅ Add support for additional languages and frameworks (e.g., Ruby, Go, Java)  
- ✅ Custom scripts/hooks during container launch  
- ✅ Settings UI for easier customization  

---

## 📝 Release Notes

### 1.0.0  
Initial release of DOCKaroo  
- Live editing via Docker volumes  
- Basic UI integration with VS Code  
- Supports Python and Node.js containers  

---

## 📬 Bug Reports & Contact

To report bugs, request features, or share feedback, please email:  
📧 **muditrajsade89@gmail.com**

---

## 📚 Useful Resources

- [Visual Studio Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)  
- [Docker Documentation](https://docs.docker.com/)  
- [Markdown Syntax Guide](https://www.markdownguide.org/basic-syntax/)

---

**Enjoy using DOCKaroo!**  
Making containerized dev environments easier—one Dockerfile at a time.

