import '../styles/globals.css'
import {useAuthState} from "react-firebase-hooks/auth"
import {auth, db} from "../firebase"
import Login from './login'
import Loading from '../components/Loading'
import {useEffect} from "react"
import firebase from 'firebase/compat/app';

function MyApp({ Component, pageProps }) {

  // if user is present then it will get stored in user  
  // to help with loading screen there is inbuilt second argument called loading 
  // for loading screen 
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if(user){
      // uid and photoURL of user are given by google portfolio

      // we will use firestore db timestamp then convert it to our time
      // rather than using our time beacuse people can be in different time zones 
      // because db timestamp is consistent for all 

      // merge: true will update the info in set if present 
      // and set will create the info if not present 

      db.collection("users").doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      )
    }
  }, [user])

  // for loading screen
  if(loading) return <Loading/>

  // if no user is present then redirect to loginPage
  if(!user) return <Login/>

  return <Component {...pageProps} />
}

export default MyApp
