import React, { useEffect, useState } from 'react';

function App() {
  const [externalImage, setExternalImage] = useState('');

  useEffect(() => {
    if (window.initialData?.externalImageUri) {
      setExternalImage(window.initialData.externalImageUri);
    }
  }, []);

  return (
    <div>
      <h3>External Image from workspace:</h3>
      {externalImage && <img src={externalImage} alt="External" style={{ maxWidth: 300 }} />}
    </div>
  );
}

export default App;
