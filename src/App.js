import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';

import Navigation from './components/navigation/navigation.component';
import Logo from './components/logo/logo.component';
import Rank from './components/rank/rank.component';
import ImageLinkForm from './components/image-link-form/image-link-form.component';
import FaceRecognition from './components/face-recognition/face-recognition.component';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
    // If that isn't working, then that means you will have to wait until their servers are back up.

    const PAT = '';
    const USER_ID = '';
    const APP_ID = '';
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = this.state.input;

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + PAT,
      },
      body: raw,
    };

    fetch(
      'https://api.clarifai.com/v2/models/' + MODEL_ID + '/outputs',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => this.displayFaceBox(this.calculateFaceLocation(result)))
      .catch((error) => console.log('error', error));
  };

  render() {
    const { imageUrl, box } = this.state;
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
        <FaceRecognition box={box} imageUrl={imageUrl} />
      </div>
    );
  }
}

export default App;
