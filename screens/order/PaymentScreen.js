import * as React from 'react';
import * as firebase from 'firebase'
import 'firebase/firestore'
import {SafeAreaView, ScrollView, View, Picker,Platform} from 'react-native'
import {Text, Button, Icon, Divider, Avatar, ButtonGroup, Input} from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'


import useOrderStorage from "../../hooks/useOrderStorage"
import useUserStorage from "../../hooks/useUserStorage"
import usePointStorage from "../../hooks/usePointStorage"

import {styles, theme} from "../styles"

export default function PaymentScreen(props){
  const db = firebase.firestore()
  const currentPoint = { 0 : 'A', 1 : 'B', 2 : 'C', 3 : 'D', 4 : 'E', 5 : 'F', 6 : 'G'}
  const orderTypeDic = {
    0 : 'express',
    1 : 'punto a punto',
    2 : 'en linea'
  }

  const [order,setOrder] = useOrderStorage(props.route.params.order)
  const [points] = usePointStorage(props.route.params.points)
  const [avaliblePoints,setAvaliblePoints] = React.useState([])

  const [payingAt,setPayingAt] = React.useState(order.payingAt ? order.payingAt : '0');
  const [detail,setDetail] = React.useState(order.detail)


  React.useEffect(()=>{
    let pointsIndexes = Object.keys(points);
    if(pointsIndexes.length == 0) return;
    let elements = [];
    pointsIndexes.forEach((index) => {
      elements.push(<Picker.Item key={index} label={`Punto ${currentPoint[index]}`} value={`${index}`}/>)
    });
    setAvaliblePoints(elements)
  },[points])


  createOrder = ()=>{
    let newOrder = Object.assign({},order);
    newOrder.detail = detail;
    newOrder.payingAt = payingAt;
    newOrder.status = 'cr';
    newOrder.deliverer = order.deliverer.id

    props.navigation.navigate('loading')
    let orderRef = db.collection('orders')
    orderRef.add(newOrder)
      .then((doc) => {
        var batch = db.batch();
        let pointsIndexes = Object.keys(points);
        pointsIndexes.forEach((point) => {
          const ref = orderRef.doc(doc.id).collection('points').doc();
          batch.set(ref,points[point]);
        });
        console.log(order);
        batch.commit()
          .then(props.navigation.navigate('home',{order : Object.assign({},order,{detail : detail, payingAt:payingAt,status : 'cr'})}))
          .catch((e) => {console.log(e,'Error saving batch')})
      })
      .catch((e) => console.log(e,'ERROR saving order'))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <View style={{flex:1}}>
          <Icon name="back" type="antdesign" size={28} color={theme.colors.primary}/>
        </View>
        <View style={{flex : 1}}></View>
        <View style={{flex : 4}}>
          <Text h4>Detalles de la Orden</Text>
          <Text style={styles.secondaryText}>{'Orden '}{orderTypeDic[order.type]}</Text>
        </View>
        <View style={{flex : 1}}>
          <Avatar rounded source={{ uri:  (order.deliverer.pic ? order.deliverer.pic : 'https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/46495856_2001423299948896_8825750965387788288_n.png?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=-DmOaF7S1ZYAX9g9_ME&_nc_ht=scontent-lht6-1.xx&oh=69788685da86f9d8063374e5daddc6f3&oe=5EEE7A68')}}/>
        </View>
      </View>
      <Divider/>
      <View style={styles.screenBody}>
        <ScrollView contentContainerStyle={styles.KeAvContScrollView}>
          <View style={{flex :3}}>
            <Text style={styles.marginedText}>El costo de la orden se cancela en:</Text>
            <Picker
              selectedValue={payingAt}
              style={{height : Platform.OS =='ios' ? 20 : 0, marginTop : Platform.OS =='ios' ?-50 : 0}}
              itemStyle={{fontSize : 18}}
              onValueChange={(val) => setPayingAt(val)}>
              {avaliblePoints}
            </Picker>
          </View>
          <View style={{flex : 5}}>
              <Text style={styles.marginedText}>El costo de la orden se cancela en:</Text>
              <Input placeholder='Detalle  (opcional)' value={detail} onChangeText={(val) => setDetail(val)} multiline={true} numberOfLines={4}></Input>
          </View>
          <View style={styles.horizontalFlex,styles.centerJustified,{flex:1}}>
            <Button
              icon={{ name: "arrowright", type: "antdesign",color:theme.colors.secondary}} iconRight
              title="Siguiente" type="clear" onPress={createOrder} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
