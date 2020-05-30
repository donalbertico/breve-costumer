import * as React from 'react';
import {View, KeyboardAvoidingView, Platform, Keyboard, ScrollView, SafeAreaView} from 'react-native'
import * as firebase from 'firebase'
import 'firebase/firestore'
import SimpleReactValidator from 'simple-react-validator'

import useUserStorage from '../../hooks/useUserStorage'

import {styles} from "../styles"
import { Input, Text , Button} from 'react-native-elements'

const validator = new SimpleReactValidator();

export default function RegisterScreen(props) {

  const db = firebase.firestore();

  const [user,setUser] = useUserStorage();

  const [name,setName] = React.useState('')
  const [email,setEmail] = React.useState('')
  const [phone,setPhone] = React.useState('')
  const [password,setPass] = React.useState('')
  const [repeat,setRepeat] = React.useState('')

  const [error,setErr] = React.useState('')
  const [message,setMsg] = React.useState('')

  const [nameVal,valNameMsg] = React.useState('')
  const [phoneVal,valPhoneMsg] = React.useState('')
  const [emailVal,valEmailMsg] = React.useState('')
  const [passVal,valPassMsg] = React.useState('')
  const [repeatVal,valRepMsg] = React.useState('')

  const [keyboardAvoiding,setkeyboardAvoiding] = React.useState(false)

  _nameInputChanged = (value) => {
    setMsg('')
    const expression = 'required|alpha_space|max:90';
    const valid = validator.check(value,expression);
    setName(value)
    validator.message('name',value,expression)
    valNameMsg(valid ? '' : 'Ingresa un nombre valido (Nombre Apellido)');
    if (!valid) Keyboard.dismiss();
  }

  checkEmailInput = () => {
    setMsg('')
    const expression = 'required|email';
    const valid = validator.check(email,expression);
    validator.message('email',email,expression)
    valEmailMsg(valid ? '' : 'Ingresa una direccion de correo valida');
  }

  _phoneInputChanged = (value) => {
    setMsg('')
    const expression = 'required|phone';
    const valid = validator.check(value,expression);
    setPhone(value)
    validator.message('phone',value,expression);
    valPhoneMsg(valid ? '' : 'Ingresa un numero de telefono valido');
  }

  _passwordInputChanged = (value) => {
    setMsg('')
    const expression = ['required',{regex: "^(?=.*[A-Z])(?=.*[0-9])"}, {min : 8}];
    const valid = validator.check(value,expression);
    setPass(value)
    validator.message('password',value,expression);
    valPassMsg(valid ? '' : 'La contraseña debe tener almenso 8 caracteres, 1 numero y una letra mayuscula');
  }

  checkPasswordsMatch = (value) =>{
    valRepMsg((value == password) ? '' : 'Las contraseñas deben coincidir')
    setRepeat(value)
  }

  handleRegister = () => {
    if(name == '' || email == '' || password == '' || phone == '' || repeat == '' || !validator.allValid() || passVal != '') return setMsg('Completa todos los campos');
    props.navigation.navigate('loading')
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(credentials => {
          const user = {
            name : name,
            phone : phone,
            uid : credentials.user.uid
          }
          props.onUserChanged(user);
          db.collection('users').doc(credentials.user.uid).set({
            name : name,
            phone : phone
          })
          .then(()=>{
            props.navigation.navigate('home')
          })
        })
        .catch((error) => {
          console.log(error);
          props.navigation.goBack();
          setMsg('El correo que haz ingresado ya esta siendo usado')
        });
  }

  disableKeyboardAvoiding = () => {
    setkeyboardAvoiding(false)
  }

  enableKeyboardAvoiding = () => {
    setkeyboardAvoiding(true)
  }

  return (
     <SafeAreaView style={styles.container}>
       <KeyboardAvoidingView enabled={keyboardAvoiding} style={styles.keyAvoContainer} behavior="position">
         <ScrollView contentContainerStyle={styles.KeAvContScrollView}>
          <View style={styles.scrollTitle}>
           <Text h4>Bienvenido a Breve Breve</Text>
          </View>
          <View style={styles.centerJustified}>
           <Text style={styles.errorMessage}>{message}</Text>
          </View>
          <View style={styles.centeredBox}>

             <Input placeholder='Nombre completo' value={name} onChangeText={_nameInputChanged} errorMessage={nameVal} onFocus={disableKeyboardAvoiding}/>
             <Input placeholder='Email' value={email} onChangeText={email => setEmail(email)} errorMessage={emailVal} onBlur={checkEmailInput} onFocus={disableKeyboardAvoiding}/>
             <Input placeholder='Telefono' keyboardType='numeric' value={phone} onChangeText={_phoneInputChanged} errorMessage={phoneVal} onFocus={enableKeyboardAvoiding}/>
             <Input placeholder='Contraseña' value={password} onChangeText={_passwordInputChanged} secureTextEntry={true} errorMessage={passVal}  onFocus={enableKeyboardAvoiding} onEndEditing={(e)=>{_passwordInputChanged(e.nativeEvent.text)}}/>
             <Input  placeholder='Repetir Contraseña' value={repeat} onChangeText={checkPasswordsMatch} secureTextEntry={true} errorMessage={repeatVal}  onFocus={enableKeyboardAvoiding}/>

             <Button  style={styles.longMainButton} title='crear cuenta' onPress = {handleRegister}/>
             <View style={styles.horizontalFlex}>
               <View style= {{flex : 1}}></View>
               <Text h5 style={styles.nextToButton}> ya tengo una cuenta </Text>
               <Button type="clear" title='log in' onPress = {() => props.navigation.navigate('login')}/>
             </View>

           </View>
          </ScrollView>
         </KeyboardAvoidingView>
     </SafeAreaView>
  )
}
