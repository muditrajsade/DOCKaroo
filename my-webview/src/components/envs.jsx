// @ts-nocheck
import React from "react";

import { useState,useEffect } from "react";
import { vscode } from './vscode.js';

import './envs.css';

function Form({envs}){

    let lst = [];

    let [r,set_r] = useState(0);

    for(let ab = 0;ab<envs.length;ab++){
        lst.push("");


    }

    return (
  <div className="form-container">

       <h1>ENTER ENVIRONMENT VARIABLES</h1>
    {[...envs].map((index, value) => {
      return (
        <div className="input-wrapper" key={value}>
          <input
            className="styled-input"
            placeholder={index}
            accessKey={value}
            onChange={(e) => {
              let ib = lst;
              ib[value] = e.target.value;
              console.log(e.target.value);
            }}
          />
        </div>
      );
    })}

    <button
      className="styled-button"
      onClick={() => {
        vscode.postMessage({
          command: "Build Image",
          vals: [...lst],
        });
      }}
    >
      BUILD
    </button>
  </div>
);

    

}


export default Form;