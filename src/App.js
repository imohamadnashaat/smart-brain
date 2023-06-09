import React, { useState, useEffect, useContext } from 'react';
import ParticlesBg from 'particles-bg';
import jwtDecode from 'jwt-decode';

import Navigation from './components/navigation/navigation.component';
import Register from './components/register/register.component';
import Signin from './components/signin/signin.component';
import Logo from './components/logo/logo.component';
import Rank from './components/rank/rank.component';
import ImageLinkForm from './components/image-link-form/image-link-form.component';
import FaceRecognition from './components/face-recognition/face-recognition.component';
import { APIContext } from './contexts/api.context';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  },
};

const App = () => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(initialState.user);
  const [token, setToken] = useState('');
  const API_URL = useContext(APIContext);

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;
      fetch(`${API_URL}/users/${userId}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((user) => {
          if (user.id) {
            setUser(user);
            setIsSignedIn(true);
            setRoute('home');
          }
        })
        .catch((error) => console.log('error', error));
    }
  }, [token]);

  useEffect(() => {
    if (route === 'home') {
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  }, [route]);

  const calculateFaceLocation = (data) => {
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

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onSubmitImage = () => {
    setImageUrl(input);
    fetch(`${API_URL}/images`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: input,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status.code === 10000) {
          fetch(`${API_URL}/images`, {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user.id }),
          })
            .then((response) => response.json())
            .then((updatedUser) => setUser(updatedUser));
        }
        displayFaceBox(calculateFaceLocation(result));
      })
      .catch((error) => console.log('error', error));
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setToken('');
      setUser(initialState.user);
      setInput(initialState.input);
      setImageUrl(initialState.imageUrl);
      setBox(initialState.box);
      setRoute(initialState.route);
      setIsSignedIn(initialState.isSignedIn);
      localStorage.removeItem('token');
    }
    setRoute(route);
  };

  return (
    <div className="App">
      <ParticlesBg type="fountain" num={1} bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {isSignedIn || route === 'home' ? (
        <div>
          <Logo />
          <Rank user={user} />
          <ImageLinkForm
            onSubmitImage={onSubmitImage}
            onInputChange={onInputChange}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      ) : route === 'signin' ? (
        <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register loadUser={loadUser} onRouteChange={onRouteChange} />
      )}
    </div>
  );
};

export default App;
