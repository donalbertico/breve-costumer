import * as React from 'react'
import {View} from 'react-native'
import {Text, Icon, Avatar,Divider,Card,Button} from 'react-native-elements'

import {styles, theme} from "../../styles"
import parametersDictionary from "../../../constants/parametersDictionary"

export default function OrderInfo(props){
  const order = props.order
  const payAt = props.order.payingAt
  const [orderTypeDic,currentPointDic] = parametersDictionary()
  const points = props.points
  const [pointElements,setPointElements] = React.useState([])
  const [emptyPoints, setEmptyPoints] = React.useState(true)


  React.useEffect(() => {
    let pointsIndexes = Object.keys(points);
    if(pointsIndexes == 0) return ;
    let elements = [];
    pointsIndexes.forEach((index) => {
      let paying = (index == payAt) ? true : false;
      elements.push(
        <View key={index} style={styles.pointElement}>
          <View style={{flex:1}}>
            <Text h4>Punto {currentPointDic[index]}</Text>
            {paying ? <View style={styles.horizontalFlex}><Icon name="money-bill-alt" type="font-awesome-5"  color={theme.colors.primary} size={20}></Icon><Text style={styles.secondary,{marginLeft : 3}}>Pago</Text></View> : <></>  }
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
  },[points,payAt])


  Body = () => {
    return(
      <View >
        <View style={styles.horizontalFlex}>
          <Text h2>{order.deliverer.name}</Text>
          <View style={{flex:2}}></View>
          <Avatar rounded source={{ uri: order.deliverer.pic}}/>
        </View>
        <Text >Orden {orderTypeDic[order.type]}</Text>
        <Divider style={{marginTop : 7}}/>
        <View>
          {emptyPoints ? (<Text>No has ingresado ningun punto</Text>) : (<>{pointElements}</>)}
        </View>
        <Divider style={{marginTop : 5, marginBottom : 5}}/>
        <View style={styles.horizontalFlex}>
          <View styles={{flex : 1}}><Text h4>Detalle</Text></View>
          <View style={{flex:3, marginLeft : 10, marginTop : 5}}>
            <Text>{order.detail}</Text>
          </View>
        </View>

      </View>
    )
  }

  const handleCreate = e =>{
    props.onCreate()
  }

  return (
    <View>
          <Card>
            <Body/>
          </Card>
    </View>
  )
}
