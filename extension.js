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

      webviewView.webview.onDidReceiveMessage((message) => {
        if (message.command === 'submit') {
          vscode.window.showInformationMessage(`You entered: ${message.text}`);
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
      <meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; padding: 10px; }
        input, button { margin: 5px 0; width: 100%; }
      </style>
    </head>
    <body>
      <h3>Input Form</h3>
      <input type="text" id="input1" placeholder="Enter something..." />
      <button onclick="submit()">Submit</button>

      <script>
        const vscode = acquireVsCodeApi();
        function submit() {
          const value = document.getElementById('input1').value;
          vscode.postMessage({ command: 'submit', text: value });
        }
      </script>
    </body>
    </html>
  `;
}


module.exports = {
	activate,
	deactivate
}
