import * as React from 'react'
import {View , TouchableOpacity} from 'react-native'
import firebase from 'firebase'

import {styles} from "../styles"
import { Input, Text , Button} from 'react-native-elements'


export default function LoginScreen(props) {

  const [email,setEmail] = React.useState('')
  const [password,setPass] = React.useState('')
  const [error,setErr] = React.useState('')
  const [message,setMsg] = React.useState('')

  handleLogin = () => {
    firebase
        .auth()
        .signInWithEmailAndPassword(email,password)
        .catch((err) => {
          setMsg(err.message)
          setErr(err.code)
        });
  }

  return (
    <View style={styles.container}>
      <View style={styles.blankTitle}>
        <Text h4>Bienvenido a Breve Breve</Text>
      </View>
      <View style={styles.centerJustified}>
        <Text style={styles.errorMessage}>{message}</Text>
      </View>
      <View style={styles.centeredBox}>
        <Input placeholder='Email' value={email} onChangeText={email => setEmail(email)}/>
        <Input  placeholder='Password' value={password} onChangeText={password => setPass(password)} secureTextEntry={true}/>
        <Button  style={styles.longMainButton} title='Ingresar'onPress = {this.handleLogin}/>
        <View style={styles.horizontalFlexReverse}>
          <View style= {{flex : 1}}></View>
          <Text h5 style={styles.nextToButton}> si no tienes una cuenta </Text>
          <Button type="clear" title='registrate aqui' onPress = {() => props.navigation.navigate('register')}/>
        </View>
      </View>
    </View>
  )
}
