import * as React from 'react'
import {View} from 'react-native'
import {Text, Icon, Avatar,Divider,Card} from 'react-native-elements'

import {styles, theme} from "../../styles"
import parametersDictionary from "../../../constants/parametersDictionary"
import usePointStorage from "../../../hooks/usePointStorage"



export default function OrderInfo(props){
  const order = props.order
  const [orderTypeDic,currentPointDic] = parametersDictionary()
  const [points] = usePointStorage({})
  const [pointElements,setPointElements] = React.useState([])
  const [emptyPoints, setEmptyPoints] = React.useState(true)

  React.useEffect(() => {
    let pointsIndexes = Object.keys(points);
    if(pointsIndexes == 0) return ;
    let elements = [];
    pointsIndexes.forEach((index) => {
      elements.push(
        <View key={index} style={styles.pointElement}>
          <View style={{flex:1}}>
            <Text h4>Punto {currentPointDic[index]}</Text>
          </View>
          <View style={{flex:3, marginLeft : 3}}>
            <View style={styles.horizontalFlex}><Icon name="location" type="evilicon"  color={theme.colors.primary}></Icon><Text>{points[index].address}</Text></View>
            <Text style={styles.secondaryText}>{points[index].reference}</Text>
              <View style={styles.horizontalFlex}><Icon name="user" type="evilicon"  color={theme.colors.primary}></Icon>
              <View>
                <Text>{points[index].receptor}</Text>
                <Text>{points[index].phone}</Text>
              </View>
            </View>
            <Text style={styles.secondaryText}>{points[index].detail}</Text>
          </View>
        </View>
      )
    });
    setPointElements(elements)
    setEmptyPoints(false)
  },[points])

  return (
    <View>
      <Card>
        <View style={styles.horizontalFlex}>
          <Text h3>{order.deliverer.name}</Text>
          <View style={{flex:2}}></View>
          <Avatar rounded source={{ uri: order.deliverer.pic}}/>
        </View>
        <Text >Orden {orderTypeDic[order.type]}</Text>
        <Divider/>
        <View>
          {emptyPoints ? (<Text>No has ingresado ningun punto</Text>) : (<>{pointElements}</>)}
        </View>
      </Card>
    </View>
  )
}
