import * as React from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore'
import {View,SafeAreaView,ScrollView} from 'react-native';
import { Button, Header,Divider, Avatar} from 'react-native-elements'
import OrderInfo from "../home/components/OrderInfo"

import useOrderStorage from "../../hooks/useOrderStorage"
import useUserStorage from "../../hooks/useUserStorage"

import {styles, theme} from "../styles"


export default function SumupScreen(props){
  const db = firebase.firestore();
  const [order,setOrder] = useOrderStorage(props.route.params.order);
  const points = props.route.params.points;

  const [user,setUser] = useUserStorage({})

  goBack = () => {
    props.navigation.navigate('newOrder',{screen : 'payment' ,params : {order: order, points : points}})
  }

  createOrder = ()=>{
    let newOrder = Object.assign({},order);
    newOrder.status = 'cr';
    newOrder.deliverer = order.deliverer.id;
    setOrder(newOrder);

    props.navigation.navigate('loading');
    let userRef = db.collection('users').doc(user.uid);
    let orderRef = db.collection('orders');
    let currentDate = new Date();
    userRef.get()
      .then((doc) => {
        if(doc.exists){
          let userData = doc.data()
          let todayOrders = userData.todayOrders ? userData.todayOrders : [];
          let reference = Math.floor(1000 + Math.random() * 9000);
          if(userData.lastOrder){
            userData.lastOrder = new Date(userData.lastOrder.seconds*1000);
            console.log(userData.lastOrder);
            console.log(currentDate);
            if(userData.lastOrder.getMonth() == currentDate.getMonth() && userData.lastOrder.getDate() == currentDate.getDate()){
                while(todayOrders.includes(reference)){
                  reference = Math.floor(1000 + Math.random() * 9000);
                }
            }else{
              todayOrders = []
            }
          }

          todayOrders.push(reference)
          console.log(todayOrders, currentDate);
          newOrder.reference = reference;

          userRef.update({todayOrders : todayOrders, lastOrder : currentDate}).then(
            orderRef.add(newOrder)
              .then((doc) => {
                var batch = db.batch();
                let pointsIndexes = Object.keys(points);
                pointsIndexes.forEach((point) => {
                  const ref = orderRef.doc(doc.id).collection('points').doc();
                  batch.set(ref,points[point]);
                });
                batch.commit()
                  .then(props.navigation.navigate('home',{order : newOrder}))
                  .catch((e) => {console.log(e,'Error saving batch')})
              })
              .catch((e) => console.log(e,'ERROR saving order'))
          )
          .catch((e) => console.log(e,'ERROR saving user'))
        }
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <View style={styles.screenHeader}>
          <View style={{flex:4, marginLeft : 10}}>
            <Button title="Editar" type="outline"  onPress={goBack} />
          </View>
          <View style={{flex : 3}}>

          </View>
          <View style={{flex : 4}}>
            <Button
              icon={{ name: "arrowright", type: "antdesign",color:theme.colors.secondary}} iconRight
              title="Confirmar" type="clear" onPress={createOrder} />
          </View>
        </View>
      </View>
      <Divider />
      <View style={styles.screenBody}>
        <ScrollView>
          <OrderInfo order={props.route.params.order} points={points}></OrderInfo>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
