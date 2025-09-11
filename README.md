# 🚀 DOCKaroo – Live Container Editing, Simplified

**DOCKaroo** is a user-friendly VS Code extension for live Docker container editing. Inspired by Microsoft's *Dev Containers*, it takes a simpler, more streamlined approach that minimizes the amount of configuration and documentation required.

Unlike traditional setups, **DOCKaroo** skips the clutter and lets you mount your project directly via Dockerfile and volume bindings—making it especially easy for quick prototyping, debugging, and testing in containerized environments.

> 🔧 Optimized for **Python**, **Node.js**, and **Go** projects.

---

## ✨ Features

- 🐳 **Live container editing** via Docker volumes
- 🗂️ **Minimal config required** – no `devcontainer.json`, just a `Dockerfile`
- 📁 **Mounts local project folder** inside the container automatically
- ⚡ **Fast & beginner-friendly** setup for working with Docker
- 👨‍💻 Best suited for development and live experimentation with Python, Node.js, and Go
- 📌 Ideal for users who want dev container-like functionality without heavy configs
- 🔍 **Auto-detect project type** from common files (package.json, requirements.txt, etc.)
- 📊 **View container logs** directly in VS Code output
- 🖥️ **Open shell** in running container
- 🗑️ **Remove containers** with confirmation
- 🔄 **Restart containers** quickly
- ⚙️ **Configurable settings** for default ports and auto-detection

### Demo


![DOCKaroo](https://github.com/user-attachments/assets/c7506e6c-514e-49aa-9e84-a7d71e9a732a)


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

This extension contributes the following settings:

- `dockaroo.defaultHostPort`: Default host port for container binding (default: 3000)
- `dockaroo.defaultContainerPort`: Default container port for binding (default: 3000)
- `dockaroo.autoDetectProjectType`: Automatically detect project type from files (default: true)

---

## 🐞 Known Issues

- Some edge cases in volume mounting might behave inconsistently across OSes
- UI layout may require enhancements for large projects
- Container status updates may have slight delays in some scenarios

---

## 📌 Roadmap

✅ **Completed in v0.1.0:**
- Auto-detect project language (Python, Node.js, Go)
- Improve UI and error feedback
- Add support for additional languages (Go)
- Settings UI for easier customization

🔄 **Planned for future releases:**
- Docker Compose support
- Multi-container management
- Environment variable presets
- Custom scripts/hooks during container launch
- Advanced container monitoring

---

## 📝 Release Notes

### 0.1.0
- Added auto-detection for project types (Python, Node.js, Go)
- Added container logs viewer
- Added shell access to running containers
- Added container removal functionality
- Added restart container feature
- Added configurable settings for default ports
- Improved error handling and user feedback
- UI enhancements with more action buttons

### 0.0.1
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

