// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { vscode } from './components/vscode.js';
import CircularProgress from '@mui/material/CircularProgress';
import Form from './components/envs.jsx';
import W from './components/workspace.jsx';

function App() {
  let [load, set_load] = useState(0);
  let [s, set_s] = useState([]);
  let [container_name, set_container_name] = useState('');
  let [i, set_i] = useState(0);

  useEffect(() => {
    vscode.postMessage({ command: 'status' });

    const handleMessage = (event) => {
      const msg = event.data;

      if (msg.command === 'showLoader') set_load(1);
      if (msg.command === 'hideLoader') set_load(0);
      if (msg.command === 'env') {
        set_load(2);
        set_s([...msg.Envs]);
      }
      if (msg.command === 'display') {
        set_load(3);
        set_container_name(msg.cont_name);
        set_i(msg.v);
      }
      if (msg.command === 'restoreState') {
        if (msg.ui_status === 1) {
          set_load(2);
          set_s([...msg.envVarNames]);
        } else if (msg.ui_status === 2) {
          set_load(3);
          set_container_name(msg.containerName);
          set_i(msg.i);
        }
      }
      if (msg.command === 'containerStopResult') {
        set_load(3);
        set_container_name(msg.cont_name);
        set_i(msg.v);
      }
      if (msg.command === 'reset') {
        set_load(0);
        set_container_name('');
        set_i(0);
        set_s([]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (load === 3) return <W containername={container_name} i={i} />;
  if (load === 2) return <Form envs={[...s]} />;
  if (load === 1) return <CircularProgress />;

  return (
    <div>
      <button
        style={{
          backgroundColor: '#1b7dbf', // Matched button color
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
        onClick={() => {
          vscode.postMessage({ command: 'dockerize' });
        }}
      >
        Dockerize
      </button>
    </div>
  );
}

export default App;
