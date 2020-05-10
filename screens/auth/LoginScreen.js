import React from 'react'
import {View , TouchableOpacity} from 'react-native'
import { Input, Text , Button} from 'react-native-elements'
import {styles} from "../styles"

export default class LoginScreen extends React.Component {
  state = {
    email : 'lolo',
    password : '',
    error : {
      message : 'no mesmox'
    }
  }
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.blankTitle}>
          <Text h4>Bienvenido a Breve Breve</Text>
        </View>
        <View style={styles.centerJustified}>
          <Text style={styles.errorMessage}>{this.state.error.message}</Text>
        </View>
        <View style={styles.centeredBox}>
          <Input placeholder='Email' value={this.state.email} onChangeText={value => this.setState({email})}/>
          <Input  placeholder='Password' value={this.state.password} onChangeText={value => this.setState({password})} secureTextEntry={true}/>
          <Button  style={styles.longMainButton} title='Ingresar'/>
          <View style={styles.horizontalFlexReverse}>
            <View style= {{flex : 1}}></View>
            <Text h5 style={styles.nextToButton}> si no tienes una cuenta </Text>
            <Button type="clear" title='registrate aqui'/>
          </View>
        </View>
      </View>
    )
  }
}
