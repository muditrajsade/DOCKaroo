// @ts-nocheck
import React from "react";
import { vscode } from "./vscode.js";

function W({ containername, i }) {
  const isRunning = i === 1;

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
        {/* Container name */}
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          {containername}
        </span>

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
                title="Install Libraries"
                style={iconButtonStyle}
                onClick={() => {
                  vscode.postMessage({ command: "installLibrary" });
                }}
              >
                📦
              </button>
            </>
          )}
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
