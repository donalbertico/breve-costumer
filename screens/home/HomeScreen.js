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
import OrderSumup from "./components/OrderSumup"
import OrderInfo from "./components/OrderInfo"

export default function HomeScreen(props) {
  const db = firebase.firestore()

  const [onProcess,setOnProcess] = React.useState(false)
  const updatedOrder = props.route.params ? (props.route.params.order? props.route.params.order : false ):false;
  const [order,setOrder,loadingOrder] = useOrderStorage({})
  const [loading,setLoading] = React.useState(true)
  const [points,setPoints,loadingPoints] = usePointStorage({})
  const [pointsIndex,setPointsIndex] = React.useState(0)

  React.useEffect(() => {
    if((!loadingOrder) && (!loadingPoints)){
      setLoading(false)
    }else return;
    if(Object.keys(order).length != 0){
      setPointsIndex((Object.keys(points).length)-1)
      setOnProcess(true)
    }
  }, [order,loadingOrder,loadingPoints])

  React.useEffect(() => {
    if(updatedOrder){
      setOnProcess(true)
      if(order.status != updatedOrder.status){
        setOrder(updatedOrder)
      }
    }
  },[updatedOrder])

  _delivererSelected = (deliverer) => {
    props.navigation.navigate('newOrder',{screen : 'orderType', params : deliverer, points : {}})
  }

  completeOrder = () => {
    switch (order.type) {
      case 0:
        if(pointsIndex == 1) return navigateTo('payment', pointsIndex,points);
        navigateTo('points', pointsIndex+1,points)
      break;
      case 1:
        if(pointsIndex == 2) return navigateTo('payment', pointsIndex,points);
        navigateTo('points', pointsIndex+1,points)
      break;
      default:
        navigateTo('points', pointsIndex,points)
    }
  }

  navigateTo = (screen,index,newPoints) =>{
    props.navigation.navigate('newOrder',{screen:screen, params : {point : index, order : order,points : newPoints}})
  }

  OrderInprocess = () => {
    return (
      <View>
        <Text>Aun no has terminado tu orden</Text>
        <OrderInfo order={order}></OrderInfo>
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
        return (<OrderInprocess></OrderInprocess>)
        break;
      case 'cr':
        return (
          <View>
            <Text>la order esta siendo revisada por la mensajeria, te notificaremos tan pronto sea aceptada</Text>
            <OrderSumup order={order}></OrderSumup>
          </View>
        )
      default:
    }
  }

  TopButtonSwitch = ({status}) => {
    switch (status) {
      case 'oc':
        return (
          <View style={{flex : 5}}>
            <Button
              icon={{ name: "arrowright", type: "antdesign",color:theme.colors.secondary}}
              title="Completar Orden" type="clear" onPress={completeOrder} />
          </View>
        )
        break;
      case 'cr':
        return (
          <View style={{flex : 4}}>
            <Button
              icon={{ name: "phone", type: "antdesign",color:theme.colors.secondary}}
              title={order.deliverer.name} type="clear"  />
          </View>
        )
      default:
        return (
          <View style={{flex : 2}}>
            <Button
                    icon={{ name: "plus", type: "antdesign",color:theme.colors.secondary}}
                    title="Orden" type="clear" onPress={()=>props.navigation.navigate('newOrder')} />
          </View>)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <TopButtonSwitch status={order.status}/>
        <View style={{flex:4}}></View>
        <View style={{flex:1}}>
            <Icon name="user-circle" type="font-awesome" size={28} color={theme.colors.primary}/>
        </View>
      </View>
      <Divider />
      <View style={styles.screenBody}>
        <ScrollView>
          {onProcess?(
              <OrderStatuSwitch status={order.status}></OrderStatuSwitch>
        ):( loading ? (<Text>Espede</Text>) :
          (
              <DelivererChoice onDelivererSelected={this._delivererSelected.bind(this)}/>
           ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
