import React, { useState, useContext } from 'react';
import axios from 'axios';

import { APIContext } from '../../contexts/api.context';

const Register = ({ onRouteChange, loadUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const API_URL = useContext(APIContext);

  const validateForm = () => {
    let isValid = true;

    if (name.length < 4) {
      setNameError('Name should be 4 characters at least.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError('Invalid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 8) {
      setPasswordError('Password should be at least 8 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitRegister = async () => {
    const isValid = validateForm();

    if (isValid) {
      try {
        const response = await axios.post(`${API_URL}/auth/register`, {
          email,
          password,
          name,
        });

        if (response.status === 201) {
          const user = response.data;
          if (user.id) {
            localStorage.setItem('token', user.token);
            loadUser(user);
            onRouteChange('home');
          }
        }
      } catch (error) {
        if (error.response.status === 400 || error.response.status === 401) {
          setRegisterError(error.response.data.message);
        } else {
          setRegisterError(error.message);
        }
      }
    }
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Register</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="name">
                Name
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                name="name"
                id="name"
                onChange={onNameChange}
                required
              />
              {nameError && <p className="error-message">{nameError}</p>}
            </div>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">
                Email
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
                onChange={onEmailChange}
                required
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
                onChange={onPasswordChange}
                required
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
            </div>
          </fieldset>
          {/* Display the server error message */}
          {registerError && (
            <p className="error-message">{registerError}</p>
          )}{' '}
          <div className="">
            <input
              onClick={onSubmitRegister}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Register"
            />
          </div>
        </div>
      </main>
    </article>
  );
};

export default Register;
