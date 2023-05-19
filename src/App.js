import React from 'react';

import Navigation from './components/navigation/navigation.component';
import Logo from './components/logo/logo.component';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Logo />
      {/* 
      <ImageLinkForm />
      <FaceRecognition />  
      */}
    </div>
  );
}

export default App;
