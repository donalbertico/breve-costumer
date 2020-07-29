import * as React from 'react';
import { AsyncStorage } from 'react-native';

export default function useProcessOrdersStorage(val){
  const [orders, setOrders] = React.useState(val)

  React.useEffect(() => {
    async function storePoints(){
      try{
        let current = await AsyncStorage.getItem('orders')
        const ordersString = JSON.stringify(orders)
        if (current == ordersString) return;
        await AsyncStorage.setItem('orders',ordersString)
      } catch (e){
        console.log('ERROR : saving orders',e);
      }
    }
    async function getPoints(){
      try{
        const val = await AsyncStorage.getItem('orders')
        if (val != null) setOrders(JSON.parse(val));
      }catch (e){
        console.log('ERROR : retraving orders',e);
      }
    }
    if(Object.keys(orders).length == 0){
      getPoints();
    } else {
      storePoints();
    }
  }, [orders]);


  return [orders, setOrders];
}
