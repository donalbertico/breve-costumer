import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore'
import { AsyncStorage } from 'react-native';

import useUserStorage from './useUserStorage'
import ApiKeys from '../constants/ApiKeys.js'

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [auth, setAuth] = React.useState(false)
  const [uid, setUid] = React.useState(false)
  const [user,setUser] = useUserStorage();


  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function removeItemValue() {
        try {
            await AsyncStorage.removeItem('user');
            return true;
        }
        catch(exception) {
            return false;
        }
    }


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
            const db = firebase.firestore();
            const ref = db.collection('users').doc(authUser.uid);
            ref.get()
              .then((doc) => {
                if (doc.exists) {
                  const data = doc.data();
                  data.uid = uid;
                  setUser(data);
                  setAuth(true)
                  setLoadingComplete(true);
                  SplashScreen.hideAsync();
                }
              })
          } else {
            setAuth(false)
            setLoadingComplete(true);
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
