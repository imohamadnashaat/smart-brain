import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';

import Navigation from './components/navigation/navigation.component';
import Logo from './components/logo/logo.component';
import Rank from './components/rank/rank.component';
import ImageLinkForm from './components/image-link-form/image-link-form.component';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
    };
  }

  onInputChange = (event) => {
    console.log(event.target.value);
  };

  onButtonSubmit = () => {
    console.log('Button clicked!');
  };

  render() {
    return (
      <div className="App">
        <ParticlesBg type="fountain" num={1} bg={true} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        {/* 
        <FaceRecognition />  
        */}
      </div>
    );
  }
}

export default App;
