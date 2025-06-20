// @ts-nocheck
import React from "react";

import { useState,useEffect } from "react";
import { vscode } from "./vscode.js";

function W({containername,i}){

    if(i == 0){
        return (
            <div>

                <p>{containername}</p>

                <button>RUN</button>

                <button>STOP</button>


            </div>
        );
    }
    return (
        <div>

            <p>{containername}</p>

            <p>RUNNING</p>

            <button>STOP</button>

            <button onClick={()=>{
                vscode.postMessage({
                      command: 'installLibrary'
                    });
            }}>INSTALL LIBRARIES</button>







        </div>
    );
}


export default W;
