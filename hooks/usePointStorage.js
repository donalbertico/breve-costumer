import * as React from 'react';
import { AsyncStorage } from 'react-native';


export default function usePointStorage(){
  const [points, setPoints] = React.useState('in')

  React.useEffect(() => {
    async function storeOrder(){
      try{
        let current = await AsyncStorage.getItem('points')
        const pointsString = JSON.stringify(points)
        if (current == pointString) return;
        await AsyncStorage.setItem('points',pointString)
      } catch (e){
        console.log('ERROR : saving points',e);
      }
    }
    async function getOrder(){
      try{
        const val = await AsyncStorage.getItem('points')
        setPoints(val!=null ? JSON.parse(val) : null);
      }catch (e){
        console.log('ERROR : retraving points',e);
      }
    }

    if(points == 'in') getOrder();
    if(points && points != 'in') storeOrder();
  }, [points]);


  return [points, setPoints];
}
