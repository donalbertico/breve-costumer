import * as React from 'react';
import { AsyncStorage } from 'react-native';


export default function useOrderStorage(val){
  const [order, setOrder] = React.useState(val)
  const [loadingOrder,setLoading] = React.useState(true)

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
        if(val != null) setOrder(JSON.parse(val));
        setLoading(false)
      }catch (e){
        console.log('ERROR : retraving order',e);
      }
    }
    if(Object.keys(order).length == 0){
      getOrder();
    } else {
      storeOrder();
    }
  }, [order]);


  return [order, setOrder, loadingOrder];
}
