import * as React from 'react';
import { AsyncStorage } from 'react-native';


export default function useOrderStorage(){
  const [order, setOrder] = React.useState('in')

  React.useEffect(() => {
    async function storeOrder(){
      try{
        let current = await AsyncStorage.getItem('order')
        const orderString = JSON.stringify(order)
        if (current == orderString) return;
        await AsyncStorage.setItem('order',orderString)
      } catch (e){
        console.log('ERROR : saving order',e);
      }
    }
    async function getOrder(){
      try{
        const val = await AsyncStorage.getItem('order')
        setOrder(val!=null ? JSON.parse(val) : null);
      }catch (e){
        console.log('ERROR : retraving order',e);
      }
    }

    if(order == 'in') getOrder();
    if(order && order != 'in') storeOrder();
  }, [order]);


  return [order, setOrder];
}
