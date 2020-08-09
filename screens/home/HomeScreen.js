import * as React from 'react'
import {View, SafeAreaView, ScrollView,TouchableOpacity} from 'react-native'
import { Text , Button, Icon, Header,Divider} from 'react-native-elements'
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as firebase from 'firebase'
import 'firebase/firestore'

import {styles,theme} from "../styles"

import useUserStorage from "../../hooks/useUserStorage"
import useOrderStorage from "../../hooks/useOrderStorage"
import useProcessOrdersStorage from "../../hooks/useProcessOrdersStorage"
import usePointStorage from "../../hooks/usePointStorage"
import DelivererChoice from "./components/DelivererChoice"
import OrderSumup from "./components/OrderSumup"
import OrderInfo from "./components/OrderInfo"
import TrackScreen from "./TrackScreen"

const Drawer = createDrawerNavigator();

function HomeScreen(props) {
  const db = firebase.firestore()

  const [onProcess,setOnProcess] = React.useState(false)
  const updatedOrder = props.route.params ? (props.route.params.order? props.route.params.order : false ):false;
  const [order,setOrder,loadingOrder] = useOrderStorage({})
  const [loading,setLoading] = React.useState(true)
  const [gettingOrders,setGettingOrders] = React.useState(true)
  const [points,setPoints,loadingPoints] = usePointStorage({})
  const [pointsIndex,setPointsIndex] = React.useState(0)
  const [processOrders, setProcessOrders] = React.useState({})
  const [processOrdersPoints, setProcessOrdersPoints] = React.useState({})
  const [subscribed,setSubscribed] = React.useState(false)
  const [user,setUser] = useUserStorage({})
  const [ordersElements, setOrdersElements] = React.useState([]);
  const [ordersDeliverers, setOrdersDeliverers] = React.useState({});
  const [ordersRiders, setOrdersRiders] = React.useState({});
  const [trackingOrder,setTracking] = React.useState(props.route.params ? (props.route.params.tracking? props.route.params.tracking : {} ):{});

  React.useEffect(() => {
    if((!loadingOrder) && (!loadingPoints) && (!gettingOrders)){
      setLoading(false)
    }else return;
    if(Object.keys(order).length != 0){
      setPointsIndex((Object.keys(points).length)-1)
      setOnProcess(true)
    }
  }, [order,loadingOrder,loadingPoints,gettingOrders])

  React.useEffect(() => {
    if(updatedOrder){
      setOnProcess(true)
      if(order.status != updatedOrder.status){
        setOrder(updatedOrder)
      }
      setSubscribed(false);
    }
    if(!subscribed && user.uid){
      setOnProcess(true);

      let ordersRef = db.collection('orders').where('user','==',user.uid).where('status','in',['cr','tk','as','pr']);
      ordersRef.onSnapshot((snapshot) => {
        let orders = {};
        let delivererIds = [];
        let riderIds = [];
        console.log('orders');
        snapshot.forEach((doc) => {
          let data = doc.data();
          let points = [];
          data.id = doc.id;
          doc.ref.collection('points').get()
              .then((pointsSnap) => {
                pointsSnap.forEach((pt) => {points.push(pt.data())});
                data.points = points;
                orders[data.reference] = data;
                setProcessOrders(orders)
              })
          if(data.deliverer)delivererIds.push(data.deliverer);
          if(data.status == 'pr')riderIds.push(data.rider);
        });
        delivererIds = [... new Set(delivererIds)];

        if(delivererIds.length > 0){
          let deliverers = {};
          db.collection('deliverers').where(firebase.firestore.FieldPath.documentId(),'in',delivererIds).get()
            .then((deliverersSnap) => {
              deliverersSnap.forEach((deliverer) => {
                deliverers[deliverer.id] = deliverer.data();
              });
              setOrdersDeliverers(deliverers);
            })
        }
        if(riderIds.length > 0){
          let riders = {};
          db.collection('users').where(firebase.firestore.FieldPath.documentId(),'in',riderIds).get()
            .then((ridersSnap) => {
              console.log('RIDERS');
              ridersSnap.forEach((rider) => {
                riders[rider.id] = rider.data();
                console.log(rider.data());
              });
              setOrdersRiders(riders);
            })
        }
        setSubscribed(true);
      });

    }
  },[updatedOrder,user])

  React.useEffect(() => {
    if(!subscribed) return;
    let ordersKeys = Object.keys(processOrders);
    let deliverersKeys = Object.keys(ordersDeliverers);
    if(ordersKeys.length > 0){
        setGettingOrders(true);
        let elements = [];
        ordersKeys.forEach((order) => {
          let orderInfo = processOrders[order];
          let deliverer = orderInfo.deliverer ? ordersDeliverers[orderInfo.deliverer]: {};
          elements.push(
            <TouchableOpacity key={order} onPress={selectOrder(order)}>
              <OrderSumup order={orderInfo} deliverer={deliverer}></OrderSumup>
            </TouchableOpacity>
          );
        });
        setOrdersElements(elements);
        setGettingOrders(false)

        if(trackingOrder.reference && ordersDeliverers[trackingOrder.deliverer]){
          setTracking(processOrders[trackingOrder.reference]);
          props.navigation.navigate('home',{screen: 'track', params : {order: processOrders[trackingOrder.reference], deliverer : ordersDeliverers[trackingOrder.deliverer] }})
        }
    }
    if(deliverersKeys.length == 0 && ordersKeys.length == 0){
      setGettingOrders(false);
      setOnProcess(false);
    }
  },[processOrders, ordersDeliverers])


  selectOrder = (ref) => e => {
    let rider = processOrders[ref].rider ? ordersRiders[processOrders[ref].rider] : {};

    setTracking(processOrders[ref]);
    props.navigation.navigate('home',{screen: 'track',params : {order: processOrders[ref], deliverer : ordersDeliverers[processOrders[ref].deliverer], rider : rider}})
  }

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

  logout = () => {
      firebase.auth().signOut();
      setTimeout(() => {
         props.navigation.navigate('login')
      }, 1000)
  }

  OrderInprocess = () => {
    return (
      <View>
        <Text>Aun no has terminado tu orden</Text>
        <OrderInfo order={order} points={points}></OrderInfo>
        <Button
            icon={{ name: "arrowright", type: "antdesign",color:theme.colors.secondary}} iconRight
            title="Completar" type="clear" onPress={completeOrder} />
      </View>
      )
  }

  OrderStatuSwitch = () => {
    if(ordersElements.length > 0){
      return (
        <View>
            <Text>las siguientes ordenes estan en proceso con una mensajeria</Text>
            {ordersElements}
        </View>
      )
    }else{
      return (<Text>Espede de process</Text>)
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
            <Icon name="user-circle" type="font-awesome" size={28} color={theme.colors.primary} onPress={logout}/>
        </View>
      </View>
      <Divider />
      <View style={styles.screenBody}>
        <ScrollView>
          {onProcess?( <>
              {order.status == 'oc' ? (<OrderInprocess></OrderInprocess>): (<></>)}
              <OrderStatuSwitch></OrderStatuSwitch></>
        ):( loading ? (<Text>Espede</Text>) :(
              <DelivererChoice onDelivererSelected={this._delivererSelected.bind(this)}/>
           ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default function HomeDrawer(props){
  return (
    <Drawer.Navigator initialRouteName="main">
      <Drawer.Screen name="main" component={HomeScreen} />
      <Drawer.Screen name="track" component={TrackScreen} />
    </Drawer.Navigator>
  )
}
