// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { vscode } from './components/vscode.js';
import CircularProgress from '@mui/material/CircularProgress';
import Form from './components/envs.jsx';
import W from './components/workspace.jsx';
function App() {

  let [load,set_load] = useState(0);

  let [s,set_s] = useState([]);

  let [container_name ,set_container_name] = useState('');

  let [i,set_i] = useState(0);

  useEffect(()=>{


      vscode.postMessage({
      command: 'status'
    });


    const handleMessage = (event) => {
      const msg = event.data;

      if (msg.command === 'showLoader') {
        set_load(1);
      }

      if (msg.command === 'hideLoader') {
        set_load(0);
      }

      if(msg.command === 'env'){
        set_load(2);

        set_s([...msg.Envs]);

      }

      if(msg.command === 'display'){
        set_load(3);
        set_container_name(msg.cont_name);
        set_i(msg.i);
      }

      if(msg.command === 'restoreState' ){
        if(msg.ui_status === 1){

          set_load(2);

          set_s([...msg.envVarNames]);



        }

        if(msg.ui_status === 2){

          set_load(3);
          set_container_name(msg.containerName);
          set_i(msg.i);

        }


      }


      if(msg.command == 'containerStopResult'){
        set_load(3);
        set_container_name(msg.cont_name);
        set_i(msg.i);
      }

      // handle other command types
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);

  },[]);


  if(load == 3){
    return (
      <div>

        <W containername={container_name} i={i}/>

      

      </div>
    );
  }

  if(load == 2){
    return (
      <div>
        <Form envs={[...s]}/>
        
      </div>
    );
  }

  if(load == 1){
    return (
      <div>
        <CircularProgress/>
      </div>
    );
  }
  

  return (
    <div>
     
      <button onClick={()=>{

         vscode.postMessage({
      command: 'dockerize'
    });

      }}>Dockerize</button>
    </div>
  );
}

export default App;
