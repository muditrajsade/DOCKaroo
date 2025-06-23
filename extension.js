// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');
const { spawn } = require('child_process');
const fs = require('fs');          // ✅ Add this
const path = require('path'); 
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    
	

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	const provider = {
    resolveWebviewView : async function (webviewView) {
		console.log('resolveWebviewView called');
     webviewView.webview.options = {
  enableScripts: true
};

//context.workspaceState.update(key, value);

  webviewView.webview.html = getHtml(webviewView.webview, context);


   let containerName = '';
  let envVarNames = [];
  let selectedFolderPath = '';
  let i = 1;
  let ui_status = -1;
  let projectType = '';
  //console.log(ui_status);

  



      


    

      webviewView.webview.onDidReceiveMessage(async (message) => {
        if (message.command === 'submit') {
          vscode.window.showInformationMessage(`You entered: ${message.text}`);
        }
        
          else if (message.command === 'dockerize') {
            webviewView.webview.postMessage({ command: 'showLoader' });
  const folderUri = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: 'Select folder to dockerize'
  });

  if (!folderUri || folderUri.length === 0) {
    vscode.window.showWarningMessage('No folder selected.');
    return;
  }

  

  // Send loader command to webview
  // Import fs & path if not already done
  const fs = require('fs');
  const path = require('path');
  selectedFolderPath = folderUri[0].fsPath;
  const dockerfilePath = path.join(selectedFolderPath, 'Dockerfile');

  // Send loader
  webviewView.webview.postMessage({ command: 'showLoader' });

  if (fs.existsSync(dockerfilePath)) {
    // Read the Dockerfile
    const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
    envVarNames = extractAllEnvVarNames(dockerfileContent);



    // You can send this content to webview or parse/modify it here
    if (envVarNames.length > 0) {
    vscode.window.showInformationMessage(`ENV variables: ${envVarNames.join(', ')}`);

    ui_status=1;
    
    webviewView.webview.postMessage({ command: 'env',Envs : envVarNames });

  } else {
    vscode.window.showInformationMessage('No ENV variables found in Dockerfile.');
    ui_status = 1;
    
    
    webviewView.webview.postMessage({ command: 'hideLoader' });
  }
  } else {
    vscode.window.showWarningMessage('No Dockerfile found in selected folder.');
    webviewView.webview.postMessage({ command: 'hideLoader' });
    
    // Optional: Create one
    // fs.writeFileSync(dockerfilePath, 'FROM node:18\n# Add your instructions');
    // vscode.window.showInformationMessage('Dockerfile created.');
  }

  // Done
  


        }
        else if (message.command === 'Build Image') {

          webviewView.webview.postMessage({ command: 'showLoader' });

          let env_var_names = envVarNames;
let Envs = message.vals;

const folderPath = selectedFolderPath;
if (!folderPath) {
  vscode.window.showErrorMessage('Folder path is missing.');
  return;
}

const imageName = path.basename(folderPath); // Use folder name as image name





// Prompt for container port


console.log(folderPath);

vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Building Docker image: ${imageName}`,
    cancellable: false
  }, async (progress) => {
    return new Promise((resolve, reject) => {
      exec(`docker build -t ${imageName} .`, { cwd: selectedFolderPath }, async (error, stdout, stderr) => {
        if (error) {
          vscode.window.showErrorMessage(`Docker build failed: ${stderr}`);
          reject();
          return;
        }

        vscode.window.showInformationMessage(`Docker image '${imageName}' built successfully!`);

        // Prompt project type
        projectType = await vscode.window.showQuickPick(['Node.js', 'Python'], {
          placeHolder: 'Select project type'
        });

        if (!projectType) {
          vscode.window.showWarningMessage('No project type selected. Running container without volume mounts.');
          runContainerBasic();
          resolve();
          return;
        }

        // Prompt container folder path to mount
        const containerFolderPath = await vscode.window.showInputBox({
          prompt: 'Enter the folder path inside the container to mount to (e.g., /app)',
          ignoreFocusOut: true
        });

        if (!containerFolderPath) {
          vscode.window.showErrorMessage('Container path is required.');
          reject();
          return;
        }

        // Prompt host port
        const hostPort = await vscode.window.showInputBox({
          prompt: 'Enter the host port to bind (e.g., 3000)',
          validateInput: val => isNaN(val) ? 'Must be a number' : null,
          ignoreFocusOut: true
        });

        if (!hostPort) {
          vscode.window.showErrorMessage('Host port is required.');
          reject();
          return;
        }

        // Prompt container port
        const containerPort = await vscode.window.showInputBox({
          prompt: 'Enter the container port to bind (e.g., 5000)',
          validateInput: val => isNaN(val) ? 'Must be a number' : null,
          ignoreFocusOut: true
        });

        if (!containerPort) {
          vscode.window.showErrorMessage('Container port is required.');
          reject();
          return;
        }

        // Function to run container without extra volume for node_modules
        function runContainerBasic() {
          containerName = `${imageName}-container`;
          exec(`docker rm -f ${containerName}`, () => {
            const envString = env_var_names.map((key, i) => `-e ${key}=${Envs[i]}`).join(' ');
            const runCommand = `docker run -d --name ${containerName} ` +
              `-v "${folderPath}":"${containerFolderPath}" ` +
              `-p ${hostPort}:${containerPort} ` +
              `${envString} ${imageName}`;

            exec(runCommand, (runErr, runOut, runErrOut) => {
              if (runErr) {
                vscode.window.showErrorMessage(`Docker run failed: ${runErrOut || runErr.message}`);
                reject();
              } else {
                vscode.window.showInformationMessage(`Docker container '${containerName}' started successfully.`);
                ui_status = 2;
                i = 1;
                webviewView.webview.postMessage({ command: 'display', cont_name: containerName, v: i });
                resolve();
              }
            });
          });
        }

        if (projectType === 'Node.js') {
          // Prompt volume name for node_modules
          const volumeName = await vscode.window.showInputBox({
            prompt: 'Enter a Docker volume name for node_modules',
            ignoreFocusOut: true,
            placeHolder: 'my_node_modules_volume',
            validateInput: val => val.trim() === '' ? 'Volume name cannot be empty' : null
          });

          if (!volumeName) {
            vscode.window.showWarningMessage('No volume name provided. Running container without node_modules volume.');
            runContainerBasic();
            resolve();
            return;
          }

          // Create docker volume
          exec(`docker volume create ${volumeName}`, (volErr, volStdout, volStderr) => {
            if (volErr) {
              vscode.window.showErrorMessage(`Failed to create volume: ${volStderr || volErr.message}`);
              reject();
              return;
            }

            containerName = `${imageName}-container`;
            exec(`docker rm -f ${containerName}`, () => {
              const envString = env_var_names.map((key, i) => `-e ${key}=${Envs[i]}`).join(' ');
              // Run container with two mounts: local folder and volume for node_modules
              const runCommand = `docker run -d --name ${containerName} ` +
                `-v "${folderPath}":"${containerFolderPath}" ` +
                `-v ${volumeName}:"${path.posix.join(containerFolderPath, 'node_modules')}" ` +
                `-p ${hostPort}:${containerPort} ` +
                `${envString} ${imageName}`;

              exec(runCommand, (runErr, runOut, runErrOut) => {
                if (runErr) {
                  vscode.window.showErrorMessage(`Docker run failed: ${runErrOut || runErr.message}`);
                  reject();
                } else {
                  vscode.window.showInformationMessage(`Docker container '${containerName}' started with node_modules volume '${volumeName}'.`);
                  ui_status = 2;
                  i = 1;
                  webviewView.webview.postMessage({ command: 'display', cont_name: containerName, v: i });
                  resolve();
                }
              });
            });
          });
        } else {
          // For Python or others, just run container normally
          runContainerBasic();
        }
      });
    });
  });







  }

  else if(message.command === 'status'){

        webviewView.webview.postMessage({
        command: 'restoreState',
        containerName,
        envVarNames,
        selectedFolderPath,
        i,
        ui_status
      });
  }

  else if (message.command === 'installLibrary') {
  if (!containerName) {
    console.log(containerName);
    vscode.window.showErrorMessage('Container not running or container name missing.');
    return;
  }

  const installCommand = await vscode.window.showInputBox({
    prompt: 'Enter the full install command (e.g., npm install axios)',
    ignoreFocusOut: true,
    placeHolder: 'npm install axios',
    validateInput: (value) => {
      return value.trim() === '' ? 'Command cannot be empty' : null;
    }
  });

  if (!installCommand) {
    vscode.window.showWarningMessage('No install command entered.');
    return;
  }

  vscode.window.withProgress({
  location: vscode.ProgressLocation.Notification,
  title: `Running install command in container: ${installCommand}`,
  cancellable: false
}, async (progress) => {
  return new Promise((resolve, reject) => {
    exec(`docker exec ${containerName} sh -c "${installCommand}"`, (error, stdout, stderr) => {
      if (error) {
        vscode.window.showErrorMessage(`Command failed: ${stderr || error.message}`);
        webviewView.webview.postMessage({
          command: 'installResult',
          success: false,
          output: stderr || error.message
        });
        reject();
        return;
      }

      // Success message for both Node.js and Python
      vscode.window.showInformationMessage('Library installed successfully!');

      if (projectType === 'Python') {
        // Run pip freeze inside the container
        exec(`docker exec ${containerName} sh -c "pip freeze > requirements.txt"`, (freezeErr, freezeOut, freezeErrOut) => {
          if (freezeErr) {
            vscode.window.showWarningMessage('Installed, but failed to update requirements.txt');
            console.error(freezeErrOut || freezeErr.message);
          } else {
            vscode.window.showInformationMessage('requirements.txt updated.');
          }

          webviewView.webview.postMessage({
            command: 'installResult',
            success: true,
            output: stdout
          });

          resolve();
        });
      } else {
        // Node.js or other case
        webviewView.webview.postMessage({
          command: 'installResult',
          success: true,
          output: stdout
        });

        resolve();
      }
    });
  });
});

}

else if (message.command === 'stop_container') {
  if (!containerName) {
    vscode.window.showErrorMessage('No running container to stop.');
    return;
  }

  webviewView.webview.postMessage({ command: 'showLoader' });

  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Stopping Docker container: ${containerName}`,
    cancellable: false
  }, async (progress) => {
    return new Promise((resolve, reject) => {
      exec(`docker stop ${containerName}`, (error, stdout, stderr) => {
        if (error) {
          vscode.window.showErrorMessage(`Failed to stop container: ${stderr || error.message}`);
          webviewView.webview.postMessage({
            command: 'containerStopResult',
            success: false,
            output: stderr || error.message
          });
          reject();
        } else {
          vscode.window.showInformationMessage(`Container '${containerName}' stopped successfully.`);
          ui_status=2;
          i=0;

          

         
          webviewView.webview.postMessage({
            command: 'containerStopResult',
            cont_name : containerName ,
            v:i 
            
          });
          resolve();
        }
      });
    });
  });
}

else if (message.command === 'run_container') {
  if (!containerName) {
    vscode.window.showErrorMessage('No container name found to start.');
    return;
  }
  webviewView.webview.postMessage({ command: 'showLoader' });


  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: `Starting existing container: ${containerName}`,
    cancellable: false
  }, async (progress) => {
    return new Promise((resolve, reject) => {
      exec(`docker start ${containerName}`, (error, stdout, stderr) => {
        if (error) {
          vscode.window.showErrorMessage(`Failed to start container: ${stderr || error.message}`);
          webviewView.webview.postMessage({
            command: 'containerRunResult',
            success: false,
            output: stderr || error.message
          });
          reject();
        } else {
          vscode.window.showInformationMessage(`Container '${containerName}' started.`);
          ui_status = 2;
          i = 1;

          webviewView.webview.postMessage({
            command: 'display',
            cont_name: containerName,
            v: i
          });
          resolve();
        }
      });
    });
  });
}



      });
  
    }
  };
  console.log("pl");

  const disposable = vscode.window.registerWebviewViewProvider('myView', provider);
	context.subscriptions.push(disposable);

	

	
}

// This method is called when your extension is deactivated
function deactivate() {}

function getHtml(webview, context) {
  const reactDist = vscode.Uri.joinPath(context.extensionUri, 'my-webview', 'dist');
  const indexHtmlPath = vscode.Uri.joinPath(reactDist, 'index.html');
  let html = fs.readFileSync(indexHtmlPath.fsPath, 'utf8');

  // Get URI for image outside my-webview
 

  // Also fix all other asset paths inside dist like CSS/JS/images to webview URIs
  html = html.replace(/(src|href)="(.+?)"/g, (_, attr, src) => {
    if (src.startsWith('http') || src.startsWith('data:')) {
      return `${attr}="${src}"`; // Ignore external URLs or data URLs
    }
    const assetUri = vscode.Uri.joinPath(reactDist, src);
    const assetWebviewUri = webview.asWebviewUri(assetUri);
    return `${attr}="${assetWebviewUri}"`;
  });

  return html;
}

function extractAllEnvVarNames(dockerfileContent) {
  const envVarNames = [];

  // Step 1: Join multi-line ENV statements into single lines
  const joinedContent = dockerfileContent.replace(/\\\s*\n/g, ' ');

  // Step 2: Match all lines that start with ENV
  const envRegex = /^ENV\s+(.+)$/gm;
  let match;
  while ((match = envRegex.exec(joinedContent)) !== null) {
    const envLine = match[1].trim();

    // Step 3: Extract key=value pairs
    const pairs = envLine.match(/\S+=\S+/g); // non-whitespace=non-whitespace

    if (pairs) {
      pairs.forEach(pair => {
        const [key] = pair.split('=');
        if (key) {
          envVarNames.push(key.trim());
        }
      });
    }
  }

  return envVarNames;
}




module.exports = {
	activate,
	deactivate
}
