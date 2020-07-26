import * as React from 'react'
import {View, SafeAreaView, ScrollView,KeyboardAvoidingView} from 'react-native'
import { Text , Button, Icon, Header,Divider, Avatar, Input} from 'react-native-elements'
import * as firebase from 'firebase'
import SimpleReactValidator from 'simple-react-validator'

import {styles,theme} from "../styles"

import useOrderStorage from "../../hooks/useOrderStorage"
import usePointStorage from "../../hooks/usePointStorage"

const validator = new SimpleReactValidator();


export default function PointScreen(props) {
  const db = firebase.firestore()
  const orderTypeDic = {
    0 : 'express',
    1 : 'punto a punto',
    2 : 'en linea'
  }
  const currentPoint = { 0 : 'A', 1 : 'B', 2 : 'C', 3 : 'D', 4 : 'E', 5 : 'F', 6 : 'G'}

  const [order,setOrder] = useOrderStorage(props.route.params.order)
  const pointIndex = props.route.params.point ? props.route.params.point : 0;
  const refresh = props.route.params.refresh ? false : true;
  const [point,setPoint] = React.useState({})
  const [points,setPoints] = usePointStorage(props.route.params.points)
  const [lineOrder,setLineOrder] = React.useState(false)

  const [keyboardAvoiding, setkeyboardAvoiding] = React.useState(false)
  const [address, setAddress] = React.useState()
  const [addressVal, setAddressMessage] = React.useState('')
  const [reference, setReference] = React.useState()
  const [receptor, setReceptor] = React.useState()
  const [phone, setPhone] = React.useState()
  const [phoneVal, setPhoneMessage] = React.useState()
  const [detail, setDetail] = React.useState()

  React.useEffect(() => {
    if(props.route.params.order.type == 2){
      if(pointIndex >= 3) return setLineOrder(true);
      setLineOrder(false)
    }
  },[lineOrder,pointIndex])

  React.useEffect(() => {
    if(!point) return;
    setAddress(point.address)
    setReference(point.reference)
    setReceptor(point.receptor)
    setPhone(point.phone)
    setDetail(point.detail)
  },[point])

  React.useEffect(() => {
    console.log('tipo?', order.type);
  },[order])

  React.useEffect(()=>{
    let previous = props.route.params.points
    if(Object.keys(previous).length == 0) return setEmptyFields();
    setPoints(previous)
    if(points[pointIndex]) {
      setPoint(points[pointIndex])
    }else{
      setEmptyFields()
    }
  },[points,pointIndex,refresh])

  setEmptyFields = () => {
    setAddress('')
    setReference('')
    setReceptor('')
    setPhone('')
    setDetail('')
  }

  nextAction = (pay)=> e => {
    let point = {address : address};

    if(!validateAddress(address)) return;

    if(reference && reference != '') point['reference'] = reference;
    if(receptor && receptor != '') point['receptor'] = receptor;
    if(phone && phone != '') point['phone'] = phone;
    if(detail && detail != '') point['detail'] = detail;

    let newPoints = Object.assign({},points,{[pointIndex] : point})

    switch (order.type) {
      case 0:
        if(pointIndex == 1) return navigateTo('payment', pointIndex,newPoints);
        navigateTo('points', pointIndex+1,newPoints)
      break;
      case 1:
        if(pointIndex == 2) return navigateTo('payment', pointIndex,newPoints);
        navigateTo('points', pointIndex+1,newPoints)
      break;
      default:
        if(pay) return navigateTo('payment', pointIndex,newPoints);
        navigateTo('points', pointIndex+1,newPoints)
    }
  }

  navigateTo = (screen,index,newPoints) =>{
    if(screen == 'payment'){
      setPoints(newPoints)
    }
    props.navigation.navigate('newOrder',{screen:screen, params : {point : index, order : order,points : newPoints}})
  }

  goBack = () => {
    if(pointIndex == 0) return props.navigation.navigate('newOrder',{screen : 'orderType', params : order.deliverer,order :order, points : {}});
    navigateTo('points',(pointIndex-1),points)
  }

  disableKeyboardAvoiding = () => {
    setkeyboardAvoiding(false)
  }

  enableKeyboardAvoiding = () => {
    setkeyboardAvoiding(true)
  }

  _addressInputChanged = (value) => {
    setAddressMessage('')
    setAddress(value)
    validateAddress(address);
  }

  _phoneInputChanged = (value) => {
    setPhoneMessage('')
    const expression = 'required|phone';
    const valid = validator.check(value, expression);
    setPhone(value)
    validator.message('phone',value,expression)
    setPhoneMessage(valid ? '' : 'Debes ser un numero de telefono valido');
  }


  validateAddress = (value) => {
    if(!value) {
      const expression = 'required|alpha_space|max:90';
      const valid = validator.check(value, expression);
      setAddressMessage(valid ? '' : 'Debes ingresar este campo');
      validator.message('address',value,expression);
      return false;
    }
    return true;
  }
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView enabled={keyboardAvoiding} behavior="position" style={styles.keyAvoContainer}>
        <View style={styles.screenHeader}>
          <View style={{flex:1}}>
            <Icon name="back" type="antdesign" size={28} color={theme.colors.primary} onPress={goBack}/>
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
                  <Input placeholder='Direccion' value={address} onFocus={disableKeyboardAvoiding} onChangeText={_addressInputChanged} errorMessage={addressVal}></Input>
                  <Input placeholder='Punto de referencia (opcional)' value={reference} onFocus={disableKeyboardAvoiding} onChangeText={(val) => setReference(val)}></Input>
                </View>
                <View>
                  <View style={styles.horizontalFlex}>
                    <Icon name="infocirlceo" size={17} style={{marginHorizontal: 5}} type="antdesign"  color={theme.colors.primary}></Icon>
                    <Text style={styles.secondaryText}>Informacion adicional</Text>
                  </View>
                  <Input placeholder='Persona en el punto (opcional)' value={receptor} onChangeText={(val) => setReceptor(val)}></Input>
                  <Input placeholder='Telefono del responsable (opcional)' value={phone} onChangeText={_phoneInputChanged} errorMessage={phoneVal} onFocus={enableKeyboardAvoiding}></Input>
                  <Input placeholder='Detalle  (opcional)' value={detail} onChangeText={(val) => setDetail(val)} multiline={true} numberOfLines={4} onFocus={enableKeyboardAvoiding}></Input>
                </View>
              </View>
              <View style={styles.horizontalFlex,styles.centerJustified,{flex:1}}>
                {lineOrder? (
                    <View style={styles.horizontalFlex}>
                      <View style={{flex:3}}>
                        <Button
                          icon={{ name: "plus", type: "antdesign",color:theme.colors.secondary}}
                          title="Otro punto" type="clear" onPress={nextAction()} />
                      </View>
                      <View style={{flex:2}}></View>
                      <View style={{flex:3}}>
                        <Button
                          icon={{ name: "arrowright", type: "antdesign",color:theme.colors.secondary}} iconRight
                          title="Finalizar" type="clear" onPress={nextAction(true)} />
                      </View>
                    </View>) : (
                    <View style={{flex:3}}>
                      <Button
                        icon={{ name: "arrowright", type: "antdesign",color:theme.colors.secondary}} iconRight
                        title="Siguiente" type="clear" onPress={nextAction()} />
                    </View>
                  )}
              </View>
            </ScrollView>
          </View>
         </KeyboardAvoidingView>
       </SafeAreaView>
  )
}
