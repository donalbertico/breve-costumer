import * as React from 'react'
import {View} from 'react-native'
import {Text, Icon, Avatar,Divider,Card} from 'react-native-elements'


import {styles, theme} from "../../styles"
import parametersDictionary from "../../../constants/parametersDictionary"

export default function OrderSumup(props){
  const order = props.order;
  const deliverer = props.deliverer ;
  const [assigned,setAssigned] = React.useState(false);
  const [orderTypeDic] = parametersDictionary();
  const [inTransit] = React.useState((order.status=='pr'? true : false))

  React.useEffect(()=>{
    if(deliverer) setAssigned(true);
  },[deliverer]);

  StatusElement = ({status}) => {
    switch (status) {
      case 'cr':
        return (<View style={styles.horizontalFlex}><Text style={{margin : 2,color : theme.colors.orange}}>En revision</Text><Icon name="format-list-checks" type="material-community" color={theme.colors.orange} size={18}></Icon></View>);
      break;
      case 'tk':
        return (<View style={styles.horizontalFlex}><Text style={{margin : 2,color : theme.colors.lightGreen}}>Asignando rider</Text><Icon name="bike" type="material-community" color={theme.colors.lightGreen} size={18}></Icon></View>);
      break;
      case 'pr':
        return (<Text>En transito</Text>);
      break;
    }
  }

  return (
    <View>
      <Card>
        <View style={styles.horizontalFlex}>
          {assigned ? (<>
            <View style={styles.horizontalFlex,{flex:3}}>
              <Text h3>#{order.reference}</Text>
            </View>
            <View style={{flex:3}}>
              <View style={styles.horizontalFlex}>
                <View style={{flex:4}}>
                  <StatusElement status={order.status}></StatusElement>
                  <Text >{deliverer.name}</Text>
                </View>
                <View style={{flex:1}}>
                  <Avatar rounded source={{ uri: deliverer.pic}}/>
                </View>
              </View>
            </View>
          </>) : (<>
            <View style={{flex:5}}>
              <Text h4>*Sin mensajeria</Text>
            </View>
            <View style={styles.horizontalFlex,{flex:2}}><Text style={{margin : 2}}>En revision</Text><Icon name="error-outline" type="material" color={theme.colors.error} size={18}></Icon></View></>
          )}
        </View>

        <View>
          <Text>Orden {orderTypeDic[order.type]}</Text>
          <Text>{order.points.length} puntos</Text>
        </View>
        { inTransit ? (<>
          <Divider/>
          </>) : (<></>)}
      </Card>
    </View>
  )
}
