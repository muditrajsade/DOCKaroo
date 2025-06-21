// @ts-nocheck
import React from "react";

import { useState,useEffect } from "react";
import { vscode } from "./vscode.js";

import './workspace.css';

function W({ containername, i }) {
  if (i == 0) {
    return (
      <div className="container-wrapper">
        <p className="blue-text">{containername}</p>

        <button
          className="blue-button"
          onClick={() => {
            vscode.postMessage({
              command: "run_container",
            });
          }}
        >
          RUN
        </button>
      </div>
    );
  }

  return (
    <div className="container-wrapper">
      <p className="blue-text">{containername}</p>
      <p className="blue-text">RUNNING</p>

      <button
        className="blue-button"
        onClick={() => {
          vscode.postMessage({
            command: "stop_container",
          });
        }}
      >
        STOP
      </button>

      <button
        className="blue-button"
        onClick={() => {
          vscode.postMessage({
            command: "installLibrary",
          });
        }}
      >
        INSTALL LIBRARIES
      </button>
    </div>
  );
}


export default W;
