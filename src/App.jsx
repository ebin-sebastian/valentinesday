import React, { useState } from 'react';
import OpeningScreen from './components/OpeningScreen'; 
import MainPage from './components/MainPage';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="App">
      {!isUnlocked ? (
        // Pass the state setter directly
        <OpeningScreen onUnlock={() => setIsUnlocked(true)} />
      ) : (
        <MainPage />
      )}
    </div>
  );
}

export default App;