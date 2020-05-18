import * as React from 'react';
import { AsyncStorage } from 'react-native';


export default function useUserStorage(){
  const [user, setUser] = React.useState('in')

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
        setUser(val!=null ? JSON.parse(val) : null);
      } catch (e){
        console.log('ERROR :retraving user', e);
        setUser(null);
      }
    }
    if(user == 'in') getUser();
    if(user && user!= 'in') storeUser();

  }, [user]);


  return [user, setUser];
}
