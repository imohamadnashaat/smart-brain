import React, { useState } from 'react';

const API_URL = 'https://smart-brain-api-yzoo.onrender.com';

const Signin = ({ onRouteChange, loadUser }) => {
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');

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

  const onSubmitSignIn = () => {
    const isValid = validateForm();

    if (isValid) {
      fetch(`${API_URL}/signin`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      })
        .then((response) => {
          if (response.ok || response.status === 400) {
            return response.json();
          } else {
            throw new Error(
              'Unable to connect to the server. Please try again later.'
            );
          }
        })
        .then((user) => {
          if (user.id) {
            loadUser(user);
            onRouteChange('home');
          } else {
            setLoginError('Invalid email or password.');
          }
        })
        .catch((error) => {
          setLoginError(error.message);
        });
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
