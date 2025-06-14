// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

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
        enableScripts: true,
      };

      webviewView.webview.html = getHtml(webviewView.webview);

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
  const selectedFolderPath = folderUri[0].fsPath;
  const dockerfilePath = path.join(selectedFolderPath, 'Dockerfile');

  // Send loader
  webviewView.webview.postMessage({ command: 'showLoader' });

  if (fs.existsSync(dockerfilePath)) {
    // Read the Dockerfile
    const dockerfileContent = fs.readFileSync(dockerfilePath, 'utf8');
    const envVarNames = extractAllEnvVarNames(dockerfileContent);



    // You can send this content to webview or parse/modify it here
    if (envVarNames.length > 0) {
    vscode.window.showInformationMessage(`ENV variables: ${envVarNames.join(', ')}`);
    webviewView.webview.postMessage({ command: 'ENV',Envs : envVarNames });

  } else {
    vscode.window.showInformationMessage('No ENV variables found in Dockerfile.');
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
      });
    }
  };
  console.log("pl");

  const disposable = vscode.window.registerWebviewViewProvider('myView', provider);
	context.subscriptions.push(disposable);

	

	
}

// This method is called when your extension is deactivated
function deactivate() {}


function getHtml(webview) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <style>
        body { font-family: sans-serif; padding: 10px; }
        #loader {
          display: none;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-top: 10px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        button { width: 100%; padding: 10px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <button id="dockerizeBtn">DOCKERIZE</button>
      <div id="loader"></div>

      <div id="ENV"></div>



      <script>
        const vscode = acquireVsCodeApi();

        document.getElementById('dockerizeBtn').addEventListener('click', () => {
          vscode.postMessage({ command: 'dockerize' });
        });

        window.addEventListener('message', event => {
          const message = event.data;
          const loader = document.getElementById('loader');

          if (message.command === 'showLoader') {
            loader.style.display = 'inline-block';
          } else if (message.command === 'hideLoader') {
            loader.style.display = 'none';
          }
          else if(message.command ==='ENV'){
            loader.style.display = 'none';
            let rgh = message.Envs;
            for(let jk = 0;jk<rgh.length;jk++){

              let rcv = document.createElement('input');
              
            }


          }
        });
      </script>
    </body>
    </html>
  `;
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
