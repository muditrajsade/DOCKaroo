const vscode = acquireVsCodeApi();

document.getElementById('dockerizeBtn').addEventListener('click', () => {
  vscode.postMessage({ command: 'dockerize' });
});

window.addEventListener('message', event => {
  const message = event.data;
  const loader = document.getElementById('loader');

  if (message.command === 'showLoader') {
    loader.style.display = 'inline-block';
  } else if (message.command === 'hideLoader') {
    loader.style.display = 'none';
  } else if (message.command === 'ENV') {
    loader.style.display = 'none';
    const envDiv = document.getElementById('ENV');
    envDiv.innerHTML = ''; // Clear existing inputs
    message.Envs.forEach(env => {
      const input = document.createElement('input');
      input.id = env;
      input.placeholder = env;
      input.style.display = 'block';
      input.style.marginTop = '5px';

      
      
      envDiv.appendChild(input);
      


    });

    const input = document.createElement('input');
        input.id="port"
      input.placeholder = 'PORT';
      input.style.display = 'block';
      input.style.marginTop = '5px';

    envDiv.appendChild(input);

    const fv = document.createElement('button');

      fv.addEventListener('click',function(){

        vscode.postMessage({ command: 'start' });





      })

      

    envDiv.appendChild(fv);


  }
});
