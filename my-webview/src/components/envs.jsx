// @ts-nocheck
import React from "react";

import { useState,useEffect } from "react";
import { vscode } from './vscode.js';

function Form({envs}){

    let lst = [];

    let [r,set_r] = useState(0);

    for(let ab = 0;ab<envs.length;ab++){
        lst.push("");


    }

    
    



    

    return (
        <div>

            {
                [...envs].map((index,value)=>{

                    return (
                        <div>

                            <input placeholder={index} accessKey={value} onChange={(e)=>{
                                let ib = lst;
                                console.log(e.target.value);
                                ib[value] = e.target.value;
                            }} />
                        </div>
                    );

                })
            }

            <button onClick={()=>{
            
                     vscode.postMessage({
                  command: 'Build Image',
                  vals: [...lst]
                });

               

                
                            
             }}
             
             >CLICK</button>



        </div>
    );
}


export default Form;