// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { vscode } from './components/vscode.js';
import CircularProgress from '@mui/material/CircularProgress';
import Form from './components/envs.jsx';
function App() {

  let [load,set_load] = useState(0);

  let [s,set_s] = useState([]);

  useEffect(()=>{

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

      // handle other command types
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);

  },[]);

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
