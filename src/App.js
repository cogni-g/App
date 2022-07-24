import './App.css';
import Clock from './tests/Clock';
import Si from './tests/Si';
import HomePage from './layouts/Home';
import Records from './layouts/Records';
import Admin from './layouts/Admin';
import React, { useState, useEffect } from 'react';
import logo2 from './assets/images/logo2.png'
import logo1 from './assets/images/logo.png'
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Tooltip from '@mui/material/Tooltip';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { createSvgIcon } from '@mui/material/utils';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { I18n} from 'aws-amplify';
import { Authenticator, View, Image, translations  } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { Auth } from 'aws-amplify';

Auth.configure({

      // Amazon Cognito Identity Pool ID
      identityPoolId: 'eu-west-1:d9e7bfc8-67e4-4322-a79c-3e46bff8e0cb',
      
      // Amazon Cognito Region
      region: 'eu-west-1',

      // Amazon Cognito User Pool ID
      userPoolId: 'eu-west-1_iGN5mcrEQ',

      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: 't68q4ft7msnb4i05vrd3cu6fh',
      
      // Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false,

      oauth: {},
});


I18n.putVocabularies(translations);
I18n.setLanguage('heb');
I18n.putVocabularies({
  heb: {
    // sign-in
    'Sign In': 'התחבר',
    'Sign in': 'התחבר',
    'Signing in': '..מתחבר',
    'Sign in to your account': 'Welcome Back!',
    Username: 'הכנס שם משתמש', // Username label
    Password: 'הכנס סיסמא', // Password label
    'Forgot your password?': 'שכחתי את הסיסמא שלי',

    // sign-up
    'Create Account': 'משתמש חדש', // Tab header
    'Create a new account': 'משתמש חדש', // Header text
    'Confirm Password': 'הזן שנית את הסיסמא', // Confirm Password label
    Email: 'הזן את האימייל',
    'Phone Number': 'הזן מספר טלפון',
    'Name': 'שם מלא',

    // reset password
    'Reset your password': 'שחזור סיסמא',
    'Enter your email': 'הזן את המייל',
    'Send code': 'איפוס סיסמא',
    'Back to Sign In': 'חזרה להתחברות',

    // valid
    'We Emailed You': 'שלחנו לך מייל',
    'Your code is on the way. To log in, enter the code we emailed to': 'הקוד שלך בדרך למייל, אנא בדוק במייל: ',
    'It may take a minute to arrive.': 'יתכן ויקח כמה דק לקוד להגיע.',
    'Enter your code': 'הכנס את הקוד',
    'Confirm': 'אישור',
    'Confirming': '..שולח מחדש',
    'Resend Code': 'שלח מחדש את הקוד'
  }
});



function App() {
  const [page, setPage] = useState(0);  
  const [admin, setAdmin] = useState(false);  
  const drawerWidth = 240;
  const HomeIcon = createSvgIcon(
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />,
    'Home',
  );

  useEffect(() => {
    isAdmin()
  });

  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    overflowX: "hidden"
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(9)} + 1px)`
    }
  });

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open"
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme)
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme)
    })
  }));

  const components = {
    Header() {
      return (
        <View textAlign="center" padding="20px">
          <Image
            alt="Amplify logo"
            src={logo1}
          />
        </View>
      );
    },
  }
  
  async function isAdmin() {
    var user =  await Auth.currentAuthenticatedUser().then((user)=>{
      var usreGroup = user.signInUserSession.accessToken.payload["cognito:groups"]
      if (usreGroup === undefined){
        return false
      }
      return usreGroup.includes('Admin')? true : false
    });
    setAdmin(user)
  }
  
  return (
    <Authenticator components={components} signUpAttributes={['name']}>
    {({ signOut, user }) => (

      <Router>
      <div className="App">
        <header>
          <div>
          <Drawer variant="permanent" anchor="right" className="navRightBox">
            <List className="navRight">
              <Tooltip title="דף הבית" arrow  placement="left">
                <Link className="links" to="/">
                  <ListItem button key="Home" onClick={(page)=>{setPage(1)}}>
                    <ListItemIcon >
                        <HomeIcon color={page===1?"primary":"inherit"}/>
                    </ListItemIcon>
                  </ListItem>
                </Link>
              </Tooltip>

              <Tooltip title="היסטורית איבחונים" arrow  placement="left">
                <Link className="links" to="/records">
                  <ListItem button key="Records">
                    <ListItemIcon>
                      <PlagiarismIcon  color={page===2?"primary":"inherit"} onClick={(page)=>{setPage(2)}}/>
                    </ListItemIcon>
                  </ListItem>
                </Link>
              </Tooltip>

              <Tooltip title="התנתק" arrow  placement="left">
                <Link className="links" to="/">
                  <ListItem button key="Logout">
                    <ListItemIcon>
                      <LogoutIcon onClick={signOut}/>
                    </ListItemIcon>
                  </ListItem>
                </Link>
              </Tooltip>
              {admin?    
                <Tooltip title="הגדרות" arrow  placement="left">
                  <Link className="links" to="/admin">
                    <ListItem button key="Admin">
                      <ListItemIcon>
                        <SettingsIcon  color={page===2?"primary":"inherit"} onClick={(page)=>{setPage(3)}}/>
                      </ListItemIcon>
                    </ListItem>
                  </Link>
                </Tooltip>
                :"" 
              }
            </List>
          </Drawer>
            
            <div className="nav">
               <img src={logo2} alt="logo"/>
            </div>
          





            <div className='mainComponenet'>  
              <Routes>
                <Route path="/"  element={<HomePage user={user}/>} />
              </Routes>
              <Routes>
                <Route path="/records"  element={<Records user={user}/>} />
              </Routes>
              <Routes>
                <Route path="/tests/clock"  element={<Clock user={user}/>} />
              </Routes>
              <Routes>
                <Route path="/tests/si"  element={<Si user={user}/>} />
              </Routes>
              {admin?
              <Routes>
                <Route path="/admin"  element={<Admin/>} />
              </Routes>
              :""}
            </div>

            

          </div>
        </header>
      </div>
      </Router>
    )}
    </Authenticator>
  );
}

export default App;
