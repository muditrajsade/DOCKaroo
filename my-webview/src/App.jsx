// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { vscode } from './components/vscode.js';
import CircularProgress from '@mui/material/CircularProgress';
function App() {

  let [load,set_load] = useState(0);

  useEffect(()=>{

    const handleMessage = (event) => {
      const msg = event.data;

      if (msg.command === 'showLoader') {
        set_load(1);
      }

      if (msg.command === 'hideLoader') {
        set_load(0);
      }

      // handle other command types
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);

  },[]);

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
