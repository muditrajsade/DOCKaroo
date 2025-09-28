// @ts-nocheck
import React, { useState, useEffect } from "react";
import { vscode } from "./vscode.js";

function W({ containername, i }) {
  const isRunning = i === 1;
  const [containerStatus, setContainerStatus] = useState('Checking...');

  useEffect(() => {
    // Get initial status
    vscode.postMessage({ command: 'getContainerStatus' });

    // Set up interval to check status every 5 seconds
    const interval = setInterval(() => {
      vscode.postMessage({ command: 'getContainerStatus' });
    }, 5000);

    // Listen for status updates
    const handleMessage = (event) => {
      const msg = event.data;
      if (msg.command === 'containerStatus') {
        setContainerStatus(msg.status);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div style={{
      fontFamily: 'sans-serif',
      backgroundColor: '#1e1e1e',
      color: 'white',
      padding: '16px',
      borderTop: '1px solid #333',
      borderBottom: '1px solid #333'
    }}>
      {/* Top bar with container name and actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        {/* Container name and status */}
        <div>
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {containername}
          </span>
          <div style={{
            fontSize: '12px',
            color: isRunning ? '#4CAF50' : '#f44336',
            marginTop: '2px'
          }}>
            Status: {containerStatus}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isRunning && (
            <button
              title="Run Container"
              style={iconButtonStyle}
              onClick={() => {
                vscode.postMessage({ command: "run_container" });
              }}
            >
              ▶️
            </button>
          )}

          {isRunning && (
            <>
              <button
                title="Stop Container"
                style={iconButtonStyle}
                onClick={() => {
                  vscode.postMessage({ command: "stop_container" });
                }}
              >
                ⏹️
              </button>
              <button
                title="Restart Container"
                style={iconButtonStyle}
                onClick={() => {
                  vscode.postMessage({ command: "restartContainer" });
                }}
              >
                🔄
              </button>
              <button
                title="Install Libraries"
                style={iconButtonStyle}
                onClick={() => {
                  vscode.postMessage({ command: "installLibrary" });
                }}
              >
                📦
              </button>
              <button
                title="View Logs"
                style={iconButtonStyle}
                onClick={() => {
                  vscode.postMessage({ command: "viewLogs" });
                }}
              >
                📄
              </button>
              <button
                title="Open Shell"
                style={iconButtonStyle}
                onClick={() => {
                  vscode.postMessage({ command: "execShell" });
                }}
              >
                🖥️
              </button>
            </>
          )}
          <button
            title="Remove Container"
            style={iconButtonStyle}
            onClick={() => {
              vscode.postMessage({ command: "removeContainer" });
            }}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Separator line */}
      <hr style={{ borderColor: "#444" }} />
    </div>
  );
}

// Button style
const iconButtonStyle = {
  backgroundColor: '#2d2d2d',
  color: 'white',
  border: '1px solid #444',
  borderRadius: '4px',
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default W;
