import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [userID, setUserID] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [savedID, setSavedAppID] = useState('');
  const [allPagesToThisAccount, setAllPagesToThisAccount] = useState([]);
  const [pageId, setPageId] = useState('');
  const [pageAccessToken, setPageAccessToken] = useState('');
  const [pageLikes, setPageLikes] = useState('');
  const [getPagesImpression, setPageImpression] = useState([]);
  const [sinceDate, setSinceDate] = useState('');
  const [untilDate, setUntilDate] = useState('');
  const [pgImpression, setPgImpression] = useState(false);
  const [Loading, setLoading] = useState("");

  const [pageAccessCredentials, setPageAccessCredentials] = useState({ userId: '', pageToken: '' });

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

      window.FB.getLoginStatus(function(response) {
        if(response.status === 'connected') {
          setIsLogin(true);
          setUserID(response.authResponse.userID);
          setUserToken(response.authResponse.accessToken);

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
        pageAccessCredentials.userId = response.authResponse.userID;
        pageAccessCredentials.pageToken = response.authResponse.accessToken;

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

  const getAllPages = () => {
    try {
      if (window.FB) {
        window.FB.api(
          `/${userID}/accounts`,
          'GET',
          { access_token: userToken },
          function(response) {
            setAllPagesToThisAccount(response.data);
          }
        );
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const handlePageSelect = (e) => {
    const selectedPageId = e.target.value;
    const selectedPage = allPagesToThisAccount.find(page => page.id === selectedPageId);
    if (selectedPage) {
      setPageId(selectedPage.id);
      setPageAccessToken(selectedPage.access_token);
    }
  }

  const getSelectedPageLikes = () => {
    try {
      if (window.FB) {
        window.FB.api(
          `/${pageId}?fields=fan_count`,
          'GET',
          { access_token: pageAccessToken },
          function(response) {
            setPageLikes(response.fan_count);
          }
        );
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleIfSinceAndUntilIsMoreThan90Days = (since, until) => {
    const sinceDate = new Date(since);
    const untilDate = new Date(until);
    const diffTime = Math.abs(untilDate - sinceDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 90) {
      return true;
    }
    return false;
  }

  const handleSinceChange = (e) => {
    setSinceDate(e.target.value);
    if (handleIfSinceAndUntilIsMoreThan90Days(e.target.value, untilDate)) {
      alert('Since and Until date should not be more than 90 days');
      setSinceDate('');
    }
  }

  const handleUntilChange = (e) => {
    setUntilDate(e.target.value);
    if (handleIfSinceAndUntilIsMoreThan90Days(sinceDate, e.target.value)) {
      alert('Since and Until date should not be more than 90 days');
      setUntilDate('');
    }
  }

  const getPageImpression = (since, until) => {
    setLoading('Loading...');
    try {
      if (window.FB) {
        window.FB.api(
          `/${pageId}/insights/page_impressions`,
          'GET',
          { 
            access_token: pageAccessToken,
            since: since,
            until: until
          },
          function(response) {
            console.log(response);
            setPageImpression(response.data);
            setPgImpression(true);
            setLoading('');
          }
        );
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const styleBodergreen = {
    border: '1px solid green',
    padding: '10px',
    margin: '10px'
  }

  return (
    <div className="App">
      <div className="image"></div>
      <div className="Content">
        <div className="clas">
          <div className="cache-controls">
            <p className='SavedAppID'>Saved App ID: {localStorage.getItem('AppID')} <button className='ClearAppID' onClick={ClearAppID}> Clear </button></p>
          </div>

          <div className="save-data">
          <input type="text" name="" placeholder='Add Your Business App - App ID' id="AppID" />
          <button onClick={saveAppID}>Save</button>
          </div>

          <div>
          
          {isLogin ? 
          
          <button className='logWithFb' onClick={logout}>
            <i class="fab fa-facebook-f"></i>
            Logout</button>
          :
          <button className='logWithFb' onClick={loginWithFacebook}> 
            <i class="fab fa-facebook-f"></i>
          Login with Facebook </button>
          }
          <br />
          <span style={{color: "white"}}>{userName} - 
           {userEmail.slice(0, 10) + '...' + userEmail.slice(-10)}</span>
          </div>
          
          
        </div>

        {
          userToken && (
            <div className="PageList">
            <div className="cta">
              <p>Get Page Data</p>
              <button onClick={getAllPages}>Fetch All Pages Related to this Account</button>
            </div>
  
              <div className="pageListData">
                <p>All the pages Related to this account</p>
                <select id="pageId" onChange={handlePageSelect} 
                  style={allPagesToThisAccount.length >= 1 ? {border: '1px solid green'} : {border: '1px solid red'}}
                >
                  <option value="">Select Page</option>
                  {allPagesToThisAccount.map((page, index) => (
                    <option key={index} value={page.id}>{page.name}</option>
                  ))}
                </select>
              </div>
          </div>
          )
        }
        
       
        {
          pageAccessToken && (
            <>
              <p className='selectedpageaccstoken'>Selected Page Id: <span className="yellow">{pageId}</span> & Access Token:  <span className="yellow">{pageAccessToken.slice(0, 10) + '...' + pageAccessToken.slice(-10)}</span></p>
              <button className='lkbtn' onClick={getSelectedPageLikes}>Get Selected Page Likes</button>
            </>
          
        )
        }

        {
          pageLikes && (
          <div className="SelectedPageLikes">
            <p>Selected Page Likes: <span>{pageLikes}</span></p>
          </div>
          )
        }

        {
          pageLikes && (
            <div className="selectedPageImpression">
          <div className="ctaimpression">
            <h2>Get Selected Page Impression</h2>
            <p>Since: <input type="date" placeholder='Since' value={sinceDate} onChange={handleSinceChange} /></p>
            <p>Until: <input type="date" placeholder='Until' value={untilDate} onChange={handleUntilChange} /></p>
            <button className='ib' onClick={() => getPageImpression(sinceDate, untilDate)}>Get Page Impression</button>
            <br />

            <div style={{color: "white", fontWeight: 600}}>
              <span style={{color: "white"}}>Red: 0 | </span>
              <span style={{color: "white"}}>Orange: 1 - 100 |</span>
              <span style={{color: "white"}}>Yellow: 101 - 200 |</span>
              <span style={{color: "white"}}>Green: 201 - 300 |</span>
              <span style={{color: "white"}}>Blue: 301+ </span>
            </div>
           
            
          </div>

          <div className="impression">
            <h2>Page Impression</h2>
            {Loading ? (
              <p>{Loading}</p>
            ) : (
              getPagesImpression.map((impression, index) => (
                <div key={index}>
                  <p className='ttl'>Title: {impression.title}</p>
                  <p className='dis'>Description: {impression.description}</p>
                  <p>
                    Value:
                    <span className="value">
                      {impression.values.map((value, index) => (
                        <span 
                        className="val"
                        style={{
                          backgroundColor: 
                            value.value === 0 ? 'red' :
                            value.value >= 1 && value.value <= 100 ? 'orange' :
                            value.value >= 101 && value.value <= 200 ? '#ffc107' :
                            value.value >= 201 && value.value <= 300 ? 'green' :
                            'blue' 
                        }}
                        key={index}
                      >
                        {value.value}
                      </span>
                      ))}
                    </span>
                  </p>
                  <p className='period'>Period: {impression.period}</p>
                  <p className='id'>ID: 
                      <a href='https://developers.facebook.com/docs/graph-api/reference/v19.0/insights' target='_blank' rel='noreferrer'> 
                      {impression.id} </a>
                  </p>
                  <p className='name'>Name: {impression.name}</p>
                  <p className='valCount'>Value Count: {impression.values.length}</p>
                  <hr />
                </div>
              ))
            )}

            
          </div>
        </div>
          )
        }
      
      </div>
    </div>
  );
}

export default App;
