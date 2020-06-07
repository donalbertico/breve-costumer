import * as React from 'react';
import {SafeAreaView, ScrollView, View, Picker} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {Text, Button, Icon, Divider, Avatar, ButtonGroup} from 'react-native-elements'
import { Dropdown } from 'react-native-material-dropdown'


import {styles, theme} from "../styles"

import useUserStorage from "../../hooks/useUserStorage"
import useOrderStorage from "../../hooks/useOrderStorage"
import DelivererChoice from "./components/DelivererChoice"

import PointScreen from "./PointScreen.js"
import PaymentScreen from "./PaymentScreen.js"

const Tab = createBottomTabNavigator();

function DelivererChoiceScreen(props){
  return (
    <SafeAreaView style={styles.container}>
      <Text h3>{'Seleccion una'}</Text>
      <ScrollView>
        <DelivererChoice />
      </ScrollView>
    </SafeAreaView>
  )
}



function OrderTypeScreen(props){

  const [orderType,setOrderType] = React.useState(0)
  const orderTypeOpts = ['Express', 'Punto Extra', 'Linea']
  const [wareType,setWareType] = React.useState('dc')
  const [user] = useUserStorage({})

  const orderDef = {
      0 :'Express es a toda madre como llevar una carta de punto A hacia punto B',
      1 :'Express es a toda madre mas un punto, como por ejemplo pasar recoginedo el dinero para el pansito',
      2 :'Express es a toda madre mas un punto y mas los que desee como por ejemplo coger los almuercitos e ir a dejar a 3 casas'
  }

  createOrder = () => {
    let newOrder = {
      type : orderType,
      wareType : wareType,
      user : user.uid,
      deliverer : props.route.params,
      status : 'oc'
    }
    props.navigation.navigate('newOrder',{screen:'points', params : {order : newOrder}})
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <View style={{flex:1}}>
          <Icon name="back" type="antdesign" size={28} color={theme.colors.primary}/>
        </View>
        <View style={{flex : 1}}></View>
        <View style={{flex : 3}}>
          <Text h4>{'nueva orden'}</Text>
          <Text style={styles.secondaryText}>{props.route.params.name}</Text>
        </View>
        <View style={{flex : 1}}>
          <Avatar rounded source={{ uri:  props.route.params.pic}}/>
        </View>
      </View>
      <Divider />
      <View style={styles.screenBody}>
        <View style={{flex : 1}}>
          <Text style={styles.marginedText}>{'Tipo de orden :'}</Text>
          <ButtonGroup
            textStyle = {{fontSize : 16}}
            buttons={orderTypeOpts}
            selectedIndex={orderType}
            onPress={(i) => {setOrderType(i)}}
            />
        </View>
        <View style={{flex:2, alignItems : 'center', justifyContent : 'center', marginHorizontal :20}}>
          <Text style={styles.secondaryText}>{orderDef[orderType]}</Text>
        </View>
        <View style={{flex:4}}>
          <Text style={styles.marginedText}>{'Tipo de encomienda:'}</Text>
          <Picker
            selectedValue={wareType}
            style={{height : Platform.OS=='ios' ? 20 : 0, marginTop : Platform.OS=='ios' ? -50 : 0}}
            itemStyle={{fontSize : 18}}
            onValueChange={(val) => setWareType(val)}>
            <Picker.Item label="documentos" value="dc"/>
            <Picker.Item label="paquete (25cm * 50cm)" value="pk" />
            <Picker.Item label="comida" value="fd" />
          </Picker>
        </View>
        <View style={styles.horizontalFlex,styles.centerJustified,{flex:1}}>
          <Button
            icon={{ name: "arrowright", type: "antdesign",color:theme.colors.secondary}} iconRight
            title="Siguiente" type="clear" onPress={createOrder} />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default function NewOrderScreen(props) {
  let screenOpt = {tabBarVisible : false}
  return (
    <Tab.Navigator>
      <Tab.Screen name='deliverChoice' component={DelivererChoiceScreen} options={screenOpt}/>
      <Tab.Screen name='orderType' component={OrderTypeScreen} options={screenOpt}/>
      <Tab.Screen name='points' component={PointScreen} options={screenOpt}/>
      <Tab.Screen name='payment' component={PaymentScreen} options={screenOpt}/>
    </Tab.Navigator>
  )
}
