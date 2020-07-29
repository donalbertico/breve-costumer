import * as React from 'react'
import {View} from 'react-native'
import {Text, Icon, Avatar,Divider,Card} from 'react-native-elements'


import {styles, theme} from "../../styles"
import parametersDictionary from "../../../constants/parametersDictionary"

export default function OrderSumup(props){
  const order = props.order;
  const deliverer = props.deliverer;
  const [orderTypeDic] = parametersDictionary()


  return (
    <View>
      <Card>
        <Text h3>Orden {orderTypeDic[order.type]}</Text>
        <View style={styles.horizontalFlex}>
          <Text>{deliverer.name}</Text>
          <Avatar rounded source={{ uri: deliverer.pic}}/>
        </View>
        <Divider/>
        <Text> {order.points.length}</Text>
      </Card>
    </View>
  )
}
