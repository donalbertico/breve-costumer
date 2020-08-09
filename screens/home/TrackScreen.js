import * as React from 'react'
import {View, SafeAreaView, ScrollView} from 'react-native'
import { Text , Button, Icon,Divider,Card,Avatar,Header} from 'react-native-elements'

import {styles,theme} from "../styles"
import parametersDictionary from "../../constants/parametersDictionary"



export default function TrackScreen(props){
  const order = props.route.params.order;
  const deliverer = props.route.params.deliverer;
  const rider = props.route.params.rider;
  const [orderTypeDic] = parametersDictionary();
  const [TrackScreen,setTrackScreen] = React.useState(() => () => {return(<View><Text>go</Text></View>)});

  DelivererInfo = () => {
    if(order.status == 'pr'){
      return (
        <Card>
          <View style={styles.horizontalFlex}>
            <Icon name="bike" type="material-community" ></Icon>
            <Text h2>{rider.name}</Text>
          </View>
          <View style={styles.horizontalFlex}>
            <Avatar rounded source={{ uri: deliverer.pic}}/>
            <Text h4>{deliverer.name}</Text>
          </View>
          <Text>{deliverer.address}</Text>
          <View style={styles.horizontalFlex}>
            <Icon name="phone" type="entypo"  color={theme.colors.primary} size={18}></Icon>
            <View style={styles.centerJustified}>
              <Text>{deliverer.phone}</Text>
            </View>
          </View>
        </Card>
      )
    }
    return (
      <Card>
        <View style={styles.horizontalFlex}>
          <Text h2>{deliverer.name}</Text>
          <View style={{flex:2}}></View>
          <Avatar rounded source={{ uri: deliverer.pic}}/>
        </View>
        <Text>{deliverer.address}</Text>
        <View style={styles.horizontalFlex}>
          <Icon name="phone" type="entypo"  color={theme.colors.primary} size={18}></Icon>
          <View style={styles.centerJustified}>
            <Text>{deliverer.phone}</Text>
          </View>
        </View>
      </Card>
    )
  }

  OrderInfo = () => {
    return (
      <Card>
        <View style={styles.horizontalFlex}>
          <View style={{flex:4}}>
            <Text h3>#{order.reference}</Text>
          </View>
          <Text>$4.30</Text>
        </View>
        <Text>Orden {orderTypeDic[order.type]}</Text>
        <Text>{order.points.length} puntos</Text>
      </Card>
    )
  }


  React.useEffect(() => {
    let orderInf = Object.assign({},order,{deliverer:deliverer});
    switch(order.status){
      case 'cr' :
        setTrackScreen( () => ()=>{ return (
          <View>
            <View style={{margin : 5}}><Text>tu orden esta siendo revisada por</Text></View>
            <DelivererInfo></DelivererInfo>
            <OrderInfo></OrderInfo>
          </View>
        )})
      break;
      case 'tk' :
        setTrackScreen( () => ()=>{ return (
          <View>
            <View style={{margin : 5}}><Text>tu orden fue aceptada y esta siendo asignada a un rider</Text></View>
            <DelivererInfo></DelivererInfo>
            <OrderInfo></OrderInfo>
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
            <View style={{margin : 5}}><Text>tu orden esta en transito</Text></View>
            <DelivererInfo></DelivererInfo>
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
      <View style={{flex:7}}>
        <ScrollView>
          <TrackScreen ></TrackScreen>
        </ScrollView>
      </View>
      <View style={{flex : 1}}>
        <Divider/>
          <View style={styles.screenHeader}>
            <Button
                    icon={{ name: "options-vertical", type: "simple-line-icon",color:theme.colors.secondary}}
                    title="Mis ordenes" type="clear" onPress={()=>{}} />
                  <View style={{flex:3}}></View>
            <View style={{flex:1}}>
                <Icon name="user-circle" type="font-awesome" size={28} color={theme.colors.primary} onPress={logout}/>
            </View>
          </View>
      </View>
    </SafeAreaView>)
}
