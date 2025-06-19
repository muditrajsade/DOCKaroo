import React from "react";

import { useState,useEffect } from "react";
import { vscode } from "./vscode.js";

function W({containername,i}){

    if(i == 1){
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







        </div>
    );
}


export default W;
