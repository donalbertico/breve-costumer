import * as React from 'react';
import {View, KeyboardAvoidingView, Platform, Keyboard, ScrollView, SafeAreaView} from 'react-native'
import firebase from 'firebase'
import SimpleReactValidator from 'simple-react-validator'

import useUserStorage from '../../hooks/useUserStorage'

import {styles} from "../styles"
import { Input, Text , Button} from 'react-native-elements'

const validator = new SimpleReactValidator();

export default function RegisterScreen(props) {

  const [user,setUser] = useUserStorage();

  const [name,setName] = React.useState('')
  const [email,setEmail] = React.useState('')
  const [phone,setPhone] = React.useState('')
  const [password,setPass] = React.useState('')
  const [repeat,setRepeat] = React.useState('')

  const [error,setErr] = React.useState('')
  const [message,setMsg] = React.useState('')

  const [nameVal,valName] = React.useState('')
  const [phoneVal,valPhone] = React.useState('')
  const [emailVal,valMsg] = React.useState('')
  const [passVal,valPass] = React.useState('')
  const [repeatVal,valRep] = React.useState('')

  const [keyboardAvoiding,setkeyboardAvoiding] = React.useState(false)

  state = {
    displayName : '',
    email : '',
    password : '',
    repeat : '',
    phone : '',
    fibaError : {
      message : '',
      code :''
    },
    valErrors : {
      name : '',
      phone : '',
      email : '',
      password : '',
      passwordRepeat : ''
    },
    keyboardAvoiding : false
  }

  return (
     <SafeAreaView style={styles.container}>
       <KeyboardAvoidingView enabled={this.state.keyboardAvoiding} style={styles.keyAvoContainer} behavior="position">
         <ScrollView contentContainerStyle={styles.KeAvContScrollView}>
          <View style={styles.scrollTitle}>
           <Text h4>Bienvenido a Breve Breve</Text>
          </View>
          <View style={styles.centerJustified}>
           <Text style={styles.errorMessage}>{this.state.fibaError.message}</Text>
          </View>
          <View style={styles.centeredBox}>

             <Input placeholder='Nombre completo' value={this.state.displayName} onChangeText={this._nameInputChanged} errorMessage={this.state.valErrors.name} onFocus={this.disableKeyboardAvoiding}/>
             <Input placeholder='Email' value={this.state.email} onChangeText={email => this.setState({email})} errorMessage={this.state.valErrors.email} onBlur={this.checkEmailInput} onFocus={this.disableKeyboardAvoiding}/>
             <Input placeholder='Telefono' keyboardType = 'numeric' value={this.state.phone} onChangeText={this._phoneInputChanged} errorMessage={this.state.valErrors.phone} onFocus={this.enableKeyboardAvoiding}/>
             <Input placeholder='Contraseña' value={this.state.password} onChangeText={this._passwordInputChanged} secureTextEntry={true} errorMessage={this.state.valErrors.password}  onFocus={this.enableKeyboardAvoiding} onEndEditing={(e)=>{this._passwordInputChanged(e.nativeEvent.text)}}/>
             <Input  placeholder='Repetir Contraseña' value={this.state.repeat} onChangeText={this.checkPasswordsMatch} secureTextEntry={true} defaultValue={'popeta'} errorMessage={this.state.valErrors.passwordRepeat}  onFocus={this.enableKeyboardAvoiding}/>

             <Button  style={styles.longMainButton} title='crear cuenta'onPress = {this.handleRegister}/>
             <View style={styles.horizontalFlexReverse}>
               <View style= {{flex : 1}}></View>
               <Text h5 style={styles.nextToButton}> ya tengo una cuenta </Text>
               <Button type="clear" title='log in' onPress = {() => props.navigation.navigate('login')}/>
             </View>
           </View>
          </ScrollView>
         </KeyboardAvoidingView>
     </SafeAreaView>
  )

  _nameInputChanged = (value) => {
    this.setFaiBaMessage('')
    const expression = 'required|alpha_space|max:90';
    const valid = validator.check(value,expression);
    this.setState({displayName : value})
    validator.message('name',value,expression)
    this.setState({valErrors : Object.assign(this.state.valErrors, {name : valid ? '' : 'Ingresa un nombre valido (Nombre Apellido)'})});
    if (!valid) Keyboard.dismiss();
  }

  _phoneInputChanged = (value) => {
    this.setFaiBaMessage('')
    const expression = 'required|phone';
    const valid = this.validator.check(value,expression);
    this.setState({phone : value});
    this.validator.message('phone',value,expression);
    this.setState({valErrors : Object.assign(this.state.valErrors, {phone : valid ? '' : 'Ingresa un numero de telefono valido'})});
  }

  _passwordInputChanged = (value) => {
    this.setFaiBaMessage('')
    const expression = ['required',{min: 8, regex: "^(?=.*[A-Z])(?=.*[0-9])"}];
    const valid = this.validator.check(value,expression);
    this.setState({password : value});
    this.validator.message('password',value,expression);
    this.setState({valErrors : Object.assign(this.state.valErrors, {password : valid ? '' : 'La contraseña debe tener almenso 8 caracteres, 1 numero y una letra mayuscula'})});
  }

  checkEmailInput = () => {
    this.setFaiBaMessage('')
    const expression = 'required|email';
    const valid = this.validator.check(this.state.email,expression);
    this.validator.message('email',this.state.email,expression)
    this.setState({valErrors : Object.assign(this.state.valErrors, {email : valid ? '' : 'Ingresa una direccion de correo valida'})});
  }

  setFaiBaMessage = (message) => {
    this.setState({fibaError : {message : message}})
  }

  checkPasswordsMatch = (value) =>{
    this.setState({valErrors : Object.assign(this.state.valErrors, {passwordRepeat : (value == this.state.password) ? '' : 'Las contraseñas deben coincidir' })})
    this.setState({repeat : value})
  }

  disableKeyboardAvoiding = () => {
    this.setState({keyboardAvoiding : false})
  }

  enableKeyboardAvoiding = () => {
    this.setState({keyboardAvoiding : true})
  }

  handleRegister = () => {
    const message = 'Completa todos los campos';
    if(this.state.displayName == '' || this.state.email == '' || this.state.password == '' || this.state.phone == '' || this.state.repeat == ''  ) return this.setFaiBaMessage(message);
    if (!this.validator.allValid() || this.state.valErrors.passwordRepeat != '') return this.setFaiBaMessage(message);
    console.log('se crea',this.state);
    admin.auth().createUser({
      email: this.state.email,
      phoneNumber: this.state.phone,
      password: this.password,
      displayName: this.displayName
    })
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', userRecord.uid);
        props.navigation.naviate('home');
      })
      .catch(function(error) {
        console.log('Error creating new user:', error);
      });

  }
}
