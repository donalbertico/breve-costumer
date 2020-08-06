import * as React from 'react'
import {View, SafeAreaView, ScrollView} from 'react-native'
import { Text , Button, Icon,Divider,Card} from 'react-native-elements'

import {styles,theme} from "../styles"

import OrderInfo from "./components/OrderInfo"

export default function TrackScreen(props){
  const order = props.route.params.order;
  const deliverer = props.route.params.deliverer;
  const [TrackScreen,setTrackScreen] = React.useState(() => () => {return(<View><Text>go</Text></View>)});

  React.useEffect(() => {
    let orderInf = Object.assign({},order,{deliverer:deliverer});
    console.log('CHUCHAA',orderInf);

    switch(order.status){
      case 'cr' :
        setTrackScreen( () => ()=>{ return (
          <View>
            <OrderInfo order={orderInf} points={orderInf.points}></OrderInfo>
          </View>
        )})
      break;
      case 'tk' :
        setTrackScreen( () => ()=>{ return (
          <View>
            <OrderInfo order={Object.assign({},order,{deliverer:deliverer})}></OrderInfo>
          </View>
        )})
      break;
      case 'pr' :
        const currentI = order.current ? order.current : 0;
        const current = order.points[currentI];
        const next = order.points[currentI+1];
        const previusTime = (currentI > 1) ? order.points[currentI-1] : order.takenTime
        setTrackScreen( () => ()=>{ return (
          <View>
            <Card>
              <Text>Dirigiendose</Text>
              { (current) ? (<>
                <Text> De : {order.points[currentI].address}</Text>
                <Text> A las {previusTime}</Text>
              </>) : (<></>)}
              <Text>Hacia {order.points[currentI+1].address}</Text>
            </Card>
          </View>
        )})
      break;
    }
  }, [order])





  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex:6}}>
        <TrackScreen ></TrackScreen>
      </View>
      <View style={{flex : 1}}>

      </View>
    </SafeAreaView>)
}
