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
        else if(message.command === 'dockerize'){
          const userInput = await vscode.window.showInputBox({
          placeHolder: 'Enter your Docker command or parameters',
          prompt: 'Dockerize what?',
        });

           if (userInput) {
      // Tell webview to show loader
      webviewView.webview.postMessage({ command: 'showLoader' });

      // Simulate async processing (replace with your real code)
      
    }
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
        });
      </script>
    </body>
    </html>
  `;
}



module.exports = {
	activate,
	deactivate
}
