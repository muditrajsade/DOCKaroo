// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

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


      webviewView.webview.html = getHtml(webviewView.webview, context);

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
        else if(message.command === 'start'){



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
