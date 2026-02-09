import React, { useState } from 'react';
import OpeningScreen from './components/OpeningScreen'; // Make sure path is correct
import MainPage from './components/MainPage';

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="App">
      {!isUnlocked ? (
        <OpeningScreen onUnlock={() => setIsUnlocked(true)} />
      ) : (
        <MainPage />
      )}
    </div>
  );
}

export default App;