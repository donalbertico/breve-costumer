import * as React from 'react'
import {View, SafeAreaView, ScrollView,KeyboardAvoidingView} from 'react-native'
import { Text , Button, Icon, Header,Divider, Avatar, Input} from 'react-native-elements'
import * as firebase from 'firebase'

import {styles,theme} from "../styles"

import useOrderStorage from "../../hooks/useOrderStorage"

export default function PointScreen(props) {
  const db = firebase.firestore()

  const [order,setOrder] = useOrderStorage();
  const pointIndex = props.route.params.point ? props.route.params.point : 0
  const [point,setPoint] = React.useState({})
  const [points,setPoints] = React.useState({})
  const orderTypeDic = {
    0 : 'express',
    1 : 'punto a punto',
    2 : 'en linea'
  }
  const currentPoint = {
    0 : 'A', 1 : 'B', 2 : 'C', 3 : 'D', 4 : 'E', 5 : 'F', 6 : 'G'
  }
  const [keyboardAvoiding, setkeyboardAvoiding] = React.useState(false)

  const [address, setAddres] = React.useState()
  const [reference, setReference] = React.useState()
  const [receptor, setReceptor] = React.useState()
  const [phone, setPhone] = React.useState()
  const [detail, setDetail] = React.useState()
  const [saved, setSaved] = React.useState(false)

  React.useEffect(()=>{
    if(!address) return;
    setPoint({
      address : address,
      reference : reference ? reference : '',
      receptor : receptor ? receptor : '',
      phone : phone ? phone : '',
      detail : detail ? detail : ''
    })
  },[address,reference,receptor,phone,detail])

  React.useEffect(()=>{
    if(points == 'in') return;
    setPoint(points[pointIndex])
  },[points])

  React.useEffect(() => {
    if(!saved) return;
    switch (order.type) {
      case 0:
        if(pointIndex == 1) return props.navigation.navigate('newOrder',{screen : 'payment'});
        props.navigation.navigate('newOrder',{screen:'points', params : {point : (pointIndex+1)}})
      break;
      default:

    }
  },[saved])


  nextAction = () =>{
    let points = Object.assign({},points,{[pointIndex] : point})
    setPoints(points)
    props.navigation.navigate('loading')
    db.collection('points').add(point)
      .then(doc => {
        let points = Object.assign({},points,{[pointIndex] : doc.id})
        db.collection('orders').doc(order.id)
          .set({points : points})
          .then(()=>{
            setOrder(Object.assign({},order,{points : points}))
            setSaved(true)
          })
          .catch(err =>{
            console.log('ERROR sAVING',err);
            props.navigation.goBack()
          })
      })
      .catch(err => {
        console.log('ERR saving',err);
        props.navigation.goBack()
      })
  }

  disableKeyboardAvoiding = () => {
    setkeyboardAvoiding(false)
  }

  enableKeyboardAvoiding = () => {
    setkeyboardAvoiding(true)
  }

  if(order == 'in'){
    return (
      <SafeAreaView style={styles.container}>
        <Text>{'espede'}</Text>
      </SafeAreaView>
    )
  }else{
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView enabled={keyboardAvoiding} behavior="position" style={styles.keyAvoContainer}>
          <View style={styles.screenHeader}>
            <View style={{flex:1}}>
              <Icon name="back" type="antdesign" size={28} color={theme.colors.primary}/>
            </View>
            <View style={{flex : 1}}></View>
            <View style={{flex : 4}}>
              <Text h4>Ingrese punto {currentPoint[pointIndex]}</Text>
              <Text style={styles.secondaryText}>{'Orden '}{orderTypeDic[order.type]}</Text>
            </View>
            <View style={{flex : 1}}>
              <Avatar rounded source={{ uri:  order.deliverer.pic}}/>
            </View>
          </View>
          <Divider />
          <View style={styles.screenBody}>
              <ScrollView contentContainerStyle={styles.KeAvContScrollView}>
                 <View style={{flex:8}}>
                  <View>
                    <View style={styles.horizontalFlex}>
                      <Icon name="location" type="evilicon"  color={theme.colors.primary}></Icon>
                        <Text style={styles.secondaryText}> Ubicacion</Text>
                    </View>
                    <Input placeholder='Direccion' value={address} onFocus={disableKeyboardAvoiding} onChangeText={(val) => setAddres(val)}></Input>
                    <Input placeholder='Punto de referencia (opcional)' value={reference} onFocus={disableKeyboardAvoiding} onChangeText={(val) => setReference(val)}></Input>
                  </View>
                  <View>
                    <View style={styles.horizontalFlex}>
                      <Icon name="infocirlceo" size={17} style={{marginHorizontal: 5}} type="antdesign"  color={theme.colors.primary}></Icon>
                      <Text style={styles.secondaryText}>Informacion adicional</Text>
                    </View>
                    <Input placeholder='Persona en el punto (opcional)' value={receptor} onChangeText={(val) => setReceptor(val)}></Input>
                    <Input placeholder='Telefono del responsable (opcional)' value={phone} onChangeText={(val) => setPhone(val)} onFocus={enableKeyboardAvoiding}></Input>
                    <Input placeholder='Detalle  (opcional)' value={detail} onChangeText={(val) => setDetail(val)} multiline={true} numberOfLines={4} onFocus={enableKeyboardAvoiding}></Input>
                  </View>
                </View>
                <View style={styles.horizontalFlex,styles.centerJustified,{flex:1}}>
                  <Button
                    icon={{ name: "arrowright", type: "antdesign",color:theme.colors.secondary}} iconRight
                    title="Siguiente" type="clear" onPress={nextAction} />
                </View>
              </ScrollView>
            </View>
           </KeyboardAvoidingView>
         </SafeAreaView>
    )
  }
}
