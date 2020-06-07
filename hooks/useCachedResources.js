import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore'
import { AsyncStorage } from 'react-native';

import useUserStorage from './useUserStorage'
import useOrderStorage from './useOrderStorage'
import ApiKeys from '../constants/ApiKeys.js'

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [auth, setAuth] = React.useState(false)
  const [user,setUser] = useUserStorage({});
  const [authUid,setAuthUid] = React.useState(false)


  React.useEffect(()=>{
    if(user.uid){
      if(authUid && user.uid&& (authUid!= user.uid)){
        const db = firebase.firestore();
        const ref = db.collection('users').doc(authUid);
        ref.get()
          .then((doc) => {
            if (doc.exists) {
              const data = doc.data();
              data.uid = authUid;
              setUser(data);
            }
          })
      }
    }
  },[user,authUid])
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function removeItemValue() {
        try {
            await AsyncStorage.removeItem('order');
            return true;
        }
        catch(exception) {
            return false;
        }
    }
    removeItemValue();

    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/SpaceMono-Regular.ttf'),
        });
        // init firebase
        firebase.initializeApp(ApiKeys.firebase);
        firebase.auth().onAuthStateChanged((authUser) => {
          if (authUser) {
            setAuthUid(authUser.uid)
            setAuth(true)
            setLoadingComplete(true);
            SplashScreen.hideAsync();
          } else {
            setAuth(false)
            setLoadingComplete(true);
            removeItemValue()
            SplashScreen.hideAsync();
          }
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {

      }
    }
    loadResourcesAndDataAsync();

  }, []);

  return [isLoadingComplete,auth,setAuth];
}
