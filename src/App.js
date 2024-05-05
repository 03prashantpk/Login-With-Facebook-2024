import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [userID, setUserID] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [savedID, setSavedAppID] = useState('');

  useEffect(() => {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  useEffect(() => {
    window.fbAsyncInit = function() {
      setSavedAppID(localStorage.getItem('AppID'));
      const savedID = localStorage.getItem('AppID') || '947310100426616';
      window.FB.init({
        appId: savedID || '965956698588022',
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
        
      window.FB.AppEvents.logPageView();

      // // confirm user if they want to login
      // const ifwantToLogin = window.confirm("Do you want to login with Facebook?" + "\n" + "App ID: " + AppID + "If not, please enter your App ID in the input field below");
      
      // if(ifwantToLogin) {
      //   loginWithFacebook();
      // }

      window.FB.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          setIsLogin(true);
          setUserID(response.authResponse.userID);
          setUserToken(response.authResponse.accessToken);

          // Fetch user information
          window.FB.api('/me?fields=name,email', function(response) {
            setUserName(response.name);
            setUserEmail(response.email);
          });
        }
      });
    };
  }, []);

  const loginWithFacebook = () => {
    window.FB.login(function(response) {
      if(response.status === 'connected') {
        setIsLogin(true);
        setUserID(response.authResponse.userID);
        setUserToken(response.authResponse.accessToken);

        // Fetch user information
        window.FB.api('/me?fields=name,email', function(response) {
            setUserName(response.name);
            setUserEmail(response.email);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    },
    {
      config_id: '790630596351702'
    }
  );
  }

  const logout = () => {
    window.FB.logout(function(response) {
      if(response.status === 'unknown') {
        console.log('User is now logged out');
      }
      setIsLogin(false);
      setUserID('');
      setUserToken('');
      setUserName('');
      setUserEmail('');
    });
  }

  const saveAppID = () => {
    const AppID = document.getElementById('AppID').value;
    localStorage.setItem('AppID', AppID);
    setSavedAppID(AppID);
    window.location.reload();
  }

  const ClearAppID = () => {
    localStorage.removeItem('AppID');
    setSavedAppID('');
    window.location.reload();
  }

  const CurrentUrl = window.location.href;

  return (
    <div className="App">
      <div className="image"></div>
      <div className="Content">
        <h1>Facebook Login</h1>
        <h4>Fixed: Working Fine Now</h4>
        <div className="clas">
          <p>I'm using, <span>App type: Consumer - App ID - default</span><br /> Try Using, <span>App type: Business - App ID</span></p>
        
          <p>Add your App ID and Add <span>{CurrentUrl}</span>in: <br />Allowed Domains for the JavaScript SDK at  <a href="https://developers.facebook.com/apps/">developers.facebook.com/apps</a> </p>
      
            <hr />

          <p className='SavedAppID'>Saved App ID: {localStorage.getItem('AppID')} <button className='ClearAppID' onClick={ClearAppID}> Clear</button></p>

          <p> <span>{localStorage.getItem('AppID') ? "Clear to login with Consumer App ID" : ""}</span></p>
          
          <input type="text" name="" placeholder='Add Your Business App - App ID' id="AppID" />
          <button onClick={saveAppID}>Save</button>
          
        </div>
        <br />
        {isLogin ? 
          <button onClick={logout}>Logout</button>
          :
          <button onClick={loginWithFacebook}>Login with Facebook  {localStorage.getItem('AppID') ? "Using Business App ID" : "Using Consumer App ID"} </button>
        }
        <div className="user-card">
          <h1>{userID ? "Your Data" : ""}</h1>
          <div className="card" style={{display: userID ? "flex" : "none"}}>
            <div className="card-item">
              <h3>UserID:</h3>
              <p>{userID.slice(0,6)} {userToken ? "*****" : ""}</p>
            </div>
            <div className="card-item">
              <h3>Token:</h3>
              <p>{userToken.slice(0,10)} {userToken ? "*****" : ""}</p>
            </div>
            <div className="card-item">
              <h3>Email:</h3>
              <p>{userEmail ? "******" : ""}{userEmail.slice(-10)}</p>
            </div>
            <div className="card-item">
              <h3>Name:</h3>
              <p>{userName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
