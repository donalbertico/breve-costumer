import * as React from 'react';
import { AsyncStorage } from 'react-native';


export default function useUserStorage(val){
  const [user, setUser] = React.useState(val)

  React.useEffect(() => {
    async function storeUser(){
      try {
        let current = await AsyncStorage.getItem('user')
        const userString = JSON.stringify(user)
        if(current == userString) return;
        await AsyncStorage.setItem('user', userString)
      } catch (e){
        console.log('ERROR :saving user', e);
      }
    }
    async function getUser(){
      try {
        const val = await AsyncStorage.getItem('user')
        if(val != null) setUser(JSON.parse(val));
      } catch (e){
        console.log('ERROR :retraving user', e);
        setUser(null);
      }
    }
    if(Object.keys(user).length == 0){
      getUser();
    } else {
      storeUser();
    }
  }, [user]);

  return [user,setUser];
}
