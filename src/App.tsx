import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from 'firebase/compat';
import 'firebase/auth'
import 'firebase/firestore';
import './styles.scss'

import { useAuthState } from 'react-firebase-hooks/auth';

//import components
import Home from "./components/Home";
import ChatRoom from "./components/ChatRoom";

firebase.initializeApp({
  apiKey: "AIzaSyDH__2pBtDWKzeFxJUrL6fj4HJIPBxBTf0",
  authDomain: "chat-app-dcfac.firebaseapp.com",
  projectId: "chat-app-dcfac",
  storageBucket: "chat-app-dcfac.appspot.com",
  messagingSenderId: "115581911144",
  appId: "1:115581911144:web:e034046adf87c33c2f3bdd",
  measurementId: "G-570X8VCY37"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {

  //user logged
  const [userLogged] = useAuthState(auth);

  const singIn = () => {
    const authProvider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(authProvider);
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={() => <Home func={singIn} logged={userLogged}/>}/>
        <Route path="/chatroom" component={() => <ChatRoom logged={userLogged} auth={auth} db={firestore} />} />
      </Switch>
    </Router>
  );
}




export default App;
