import * as React from 'react';
import { AsyncStorage } from 'react-native';


export default function usePointStorage(val){
  const [points, setPoints] = React.useState(val)

  React.useEffect(() => {
    async function storePoints(){
      try{
        let current = await AsyncStorage.getItem('points')
        const pointsString = JSON.stringify(points)
        if (current == pointsString) return;
        await AsyncStorage.setItem('points',pointsString)
      } catch (e){
        console.log('ERROR : saving points',e);
      }
    }
    async function getPoints(){
      try{
        const val = await AsyncStorage.getItem('points')
        if (val != null) setPoints(JSON.parse(val));
      }catch (e){
        console.log('ERROR : retraving points',e);
      }
    }
    if(Object.keys(points).length == 0){
      getPoints();
    } else {
      storePoints();
    }
  }, [points]);


  return [points, setPoints];
}
