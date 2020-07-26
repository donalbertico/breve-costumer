import * as React from 'react'
import {View, TouchableOpacity} from 'react-native'
import {ListItem , Text} from 'react-native-elements'
import * as firebase from 'firebase'
import 'firebase/firestore'

export default function DelivererChoice(props) {
  const db = firebase.firestore();

  const [deliverers, setDeliverers] = React.useState([])
  const [isDeliverers, setIsDeliverers] = React.useState(false)

  React.useEffect(()=>{
      db.collection('deliverers').get()
        .then((snapshot) => {
          let deliverersArray = []
          snapshot.forEach((doc) => {
            let data = doc.data()
            deliverersArray.push({
              id : doc.id,
              name : data.name,
              pic : data.pic ? data.pic : 'https://scontent-lht6-1.xx.fbcdn.net/v/t1.0-9/46495856_2001423299948896_8825750965387788288_n.png?_nc_cat=100&_nc_sid=09cbfe&_nc_ohc=-DmOaF7S1ZYAX9g9_ME&_nc_ht=scontent-lht6-1.xx&oh=69788685da86f9d8063374e5daddc6f3&oe=5EEE7A68'
            })
          });
          if(deliverersArray.length > 0){
            console.log('cuantas cuentas cuentas?');
            setDeliverers(deliverersArray);
            setIsDeliverers(true)
          }
        })
  },[]);

  const handleSelection = (i) => e =>{
    props.onDelivererSelected(deliverers[i])
  }

  if(!isDeliverers){
    return (
      <View>
        <Text>{'No se han encontrado mensajerias en tu ciudad'}</Text>
      </View>
    )
  }else{
    return (
      <View>
        {
          deliverers.map((item,i) => (
            <TouchableOpacity key={i}>
              <ListItem
                key={item.id}
                title= {
                  <View>
                    <Text h3>{item.name}</Text>
                  </View>
                }
                leftAvatar={{ source : {uri: item.pic}}}
                 bottomDivider
                 onPress = {handleSelection(i)}
                />
            </TouchableOpacity>
          ))
        }
      </View>
    )
  }
}
