import * as React from 'react'
import {View, SafeAreaView, ScrollView} from 'react-native'
import { Text , Button, Icon, Header,Divider} from 'react-native-elements'
import * as firebase from 'firebase'
import 'firebase/firestore'

import {styles,theme} from "../styles"

import useUserStorage from "../../hooks/useUserStorage"
import useOrderStorage from "../../hooks/useOrderStorage"
import usePointStorage from "../../hooks/usePointStorage"
import DelivererChoice from "./components/DelivererChoice"

export default function HomeScreen(props) {
  const db = firebase.firestore()

  const [onProcess,setOnProcess] = React.useState(false)
  const [order,setOrder,loadingOrder] = useOrderStorage({})
  const [points,setPoints] = usePointStorage({})
  const [pointsSize,setPointsSize] = React.useState(0)

  React.useEffect(() => {
    if((!loadingOrder) &&Object.keys(order).length != 0){
      setPointsSize(Object.keys(points).length)
      setOnProcess(true)
    }
  }, [order,loadingOrder])

  _delivererSelected = (deliverer) => {
    props.navigation.navigate('newOrder',{screen : 'orderType', params : deliverer})
  }

  completeOrder = () => {
    switch (order.type) {
      case 0:
        if(pointsSize == 1) return props.navigation.navigate('payment',{screen : 'payment',params : {order : order}});
        props.navigation.navigate('newOrder',{screen : 'payment',params : { order : order, point : pointsSize}});
      break;
      default:
    }
  }

  OrderSumUp = () => {
    return (
      <View>
        <Text h3> Tienes una order creando wey {order.deliverer.name}</Text>
        <Button
            icon={{ name: "arrowright", type: "antdesign",color:theme.colors.secondary}} iconRight
            title="Completar" type="clear" onPress={completeOrder} />
      </View>
      )
  }

  OrderTracking = () => {
    return (
      <Text h3> Tienes una order agarrada{order.deliverer}</Text>
    )
  }

  OrderStatuSwitch = ({status}) => {
    switch (status) {
      case 'oc':
        return (<OrderSumUp></OrderSumUp>)
        break;
      default:
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <View style={{flex : 2}}>
          <Button
            icon={{ name: "plus", type: "antdesign",color:theme.colors.secondary}}
            title="Orden" type="clear" onPress={()=>props.navigation.navigate('newOrder')} />
        </View>
        <View style={{flex:4}}></View>
        <View style={{flex:1}}>
            <Icon name="user-circle" type="font-awesome" size={28} color={theme.colors.primary}/>
        </View>
      </View>
      <Divider />
      <View style={styles.screenBody}>
        <ScrollView>
          {onProcess?(
            <>
              <OrderStatuSwitch status={order.status}></OrderStatuSwitch>
            </>
          ):(
            <>
              <DelivererChoice onDelivererSelected={this._delivererSelected.bind(this)}/>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
