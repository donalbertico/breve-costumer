import * as React from 'react';
import { AsyncStorage } from 'react-native';


export default function useUserStorage(){
  const [user, setUser] = React.useState(() => {
    async function getUser(){
      try {
        const user = await AsyncStorage.getItem('user')
        console.log(user, 'ELO');
        return user != null ? JSON.parse(user) : null;
      } catch (e){
        console.log('ERROR :retraving user', e);
        return null;
      }
    }
    return getUser();
  })

  React.useEffect(() => {
    async function storeUser(){
      try {
        const userString = JSON.stringify(user)
        console.log('saving user', user);
        await AsyncStorage.setItem('user', userString)
      } catch (e){
        console.log('ERROR :saving user', e);
      }
    }
    storeUser();
  }, [user, setUser]);

  return [user, setUser];
}
