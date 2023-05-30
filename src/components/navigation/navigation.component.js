import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
  const renderAuthenticatedLinks = () => {
    return (
      <p
        className="f3 link dim black underline pa3 pointer"
        onClick={() => onRouteChange('signout')}
      >
        Sign Out
      </p>
    );
  };

  const renderUnauthenticatedLinks = () => {
    return (
      <>
        <p
          className="f3 link dim black underline pa3 pointer"
          onClick={() => onRouteChange('signin')}
        >
          Sign In
        </p>
        <p
          className="f3 link dim black underline pa3 pointer"
          onClick={() => onRouteChange('register')}
        >
          Register
        </p>
      </>
    );
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {isSignedIn ? renderAuthenticatedLinks() : renderUnauthenticatedLinks()}
    </nav>
  );
};

export default Navigation;
