import React, { useState, useContext } from 'react';
import axios from 'axios';

import { APIContext } from '../../contexts/api.context';

const Signin = ({ onRouteChange, loadUser }) => {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const API_URL = useContext(APIContext);

  const validateForm = () => {
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(signInEmail)) {
      setEmailError('Invalid email address.');
      return false;
    }

    setEmailError('');
    return true;
  };

  const onEmailChange = (event) => {
    setSignInEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    setSignInPassword(event.target.value);
  };

  const onSubmitSignIn = async () => {
    const isValid = validateForm();

    if (isValid) {
      try {
        const response = await axios.post(`${API_URL}/auth/signin`, {
          email: signInEmail,
          password: signInPassword,
        });

        if (response.status === 200) {
          const user = response.data;
          if (user.id) {
            localStorage.setItem('token', user.token);
            loadUser(user);
            onRouteChange('home');
          }
        }
      } catch (error) {
        if (error.response.status === 400 || error.response.status === 401) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError(error.message);
        }
      }
    }
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
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
              />
            </div>
          </fieldset>
          {/* Display the login error message */}
          {loginError && <p className="error-message">{loginError}</p>}{' '}
          <div className="">
            <input
              onClick={onSubmitSignIn}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Sign in"
            />
          </div>
          <div className="lh-copy mt3">
            <p
              onClick={() => onRouteChange('register')}
              className="f6 link dim black db pointer"
            >
              Register
            </p>
          </div>
        </div>
      </main>
    </article>
  );
};

export default Signin;
