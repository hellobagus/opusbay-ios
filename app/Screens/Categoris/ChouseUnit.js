//import liraries
import React, { Component } from "react";
import {
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  Platform,
  SafeAreaView,
  View,
  FlatList,
  Modal
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  Title,
  Left,
  Right,
  Body,
  Input,
  Item,
  Footer,
  FooterTab,
  Badge
} from "native-base";

import { Actions } from "react-native-router-flux";
import ParallaxScroll from "@monterosa/react-native-parallax-scroll";

import { Style, Colors, Fonts } from "../../Themes";
import Styles from "./Style";
import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';
import moment from "moment";
let isMount = false
// create a component
class ChouseUnit extends Component {
  constructor(props){
    super(props)

    this.state={
      hd : null,

      unit : [],
      gallery : [],
      userGroup : "",
      current_date: new Date()
    }

    console.log('props CU',props);

  }

  async componentDidMount(){
    isMount = true

    const data = {
      hd : new Headers({
        'Token' : await _getData('@Token')
      }),
      userGroup : await _getData('@Group')
    }

    this.setState(data,()=>{
      this.getUnit()
      // this.getGallery()
      // this.getPrice()
    })

    console.log('get __unitItems from chooseFloor', this.props.unitItems);
    console.log('get __items from chooseFloor', this.props.items);
    console.log('get __prevItems from chooseFloor', this.props.lottypes);
    
  }

  getUnit = () =>{
    const item = this.props.prevItems
    const items = this.props.items
    const unit = this.props.unitItems
    

    {isMount ?
        fetch(urlApi+'c_product_info/getUnit/'+item.db_profile+'/'+item.entity_cd+'/'+item.project_no+'/'+item.tower+'/'+unit.level_no,{
            method:'GET',
            headers : this.state.hd,
        }).then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                const resData = res.Data
                this.setState({unit : resData})
            } else {
                this.setState({isLoaded: !this.state.isLoaded},()=>{
                    alert(res.Pesan)
                });
            }
            console.log('getUnit',res);
        }).catch((error) => {
            console.log(error);
        })
    :null}
  }

  getGallery = () =>{
    const item = this.props.prevItems
    const items = this.props.items
    // const unit = this.props.unitItems
    // console.log('test ITEMS', items);
    // console.log('tes ITEM', item);

    {isMount ?
        fetch(urlApi+'c_product_info/getGallery/'+item.db_profile+'/'+item.entity_cd+'/'+item.project_no+'/'+items.lot_type,{
            method:'GET',
            headers : this.state.hd,
        }).then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                const resData = res.Data
                this.setState({gallery : resData})
            } else {
                this.setState({isLoaded: !this.state.isLoaded},()=>{
                    alert(res.Pesan)
                });
            }
            console.log('getBlok',res);
        }).catch((error) => {
            console.log(error);
        })
    :null}
  }
  

    getPrice = () => {
    const item = this.props.items;
    const items = this.props.prevItems;

    // console.log('punya getprice', item);
    {
        isMount
           ? fetch(
                  urlApi +
                      "c_booking/getPrice/" +
                      items.db_profile +
                      "/" +
                      items.entity_cd +
                      "/" +
                      items.project_no +
                      "/" +
                      item.lot_no,
                  {
                      method: "POST",
                      headers: this.state.hd
                  }
              )
                  .then(response => response.json())
                  .then(res => {
                      if (!res.Error) {
                          const resData = res.Data[0];
                          this.setState({ price: resData });
                          // _storeData("@getprice",resData);
                      }
                      console.log("getPrice", res);
                  })
                  .catch(error => {
                      console.log(error);
                  })
            : null;
    }
};


clickUnitInfo(item) {
  if(item.status == 'A'){
    Actions.unitinfo({
      items : item,
      prevItems : this.props.prevItems,
      unitItems : this.props.unitItems,
      theItems: this.props.items,
      theItemz: this.props.lottypes,
      goToItems: this.props.goToItems,
      routes: this.props.routes,
      getUnit: this.state.unit
    });
    
  } else {
    alert('This Unit is Not Available')
  }
  // this.setState({ click: true }); 
}
  
  clickUnitEnquiry() {
    Actions.unitenquiry();
    this.setState({ click: true });
  }
  render() {

    const item = this.props.prevItems
    const items = this.props.items
    const unit = this.props.unitItems
    // const getGroup = this.state.userGroup;

    // console.log('get group', getGroup);

    

    return (
      <Container style={Style.bgMain}>
        <Header style={Style.navigation}>
          <StatusBar
            backgroundColor={Colors.brownTuansing}
            animated
            barStyle="light-content"
          />

          <View style={Style.actionBarLeft}>
            <Button
              transparent
              style={Style.actionBarBtn}
              onPress={Actions.pop}
            >
              <Icon
                active
                name="arrow-left"
                style={Style.textWhite}
                type="MaterialCommunityIcons"
              />
            </Button>
          </View>
          <View style={Style.actionBarMiddle}>
            <Text style={Style.actionBarText}>
              {"Choose Unit".toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight}>
            {/* <Button
              transparent
              style={Style.actionBarBtnRight}
              onPress={Actions.categoris}
            >
              <Icon
                active
                name="action-undo"
                style={Style.actionIcon}
                type="SimpleLineIcons"
              />
            </Button> */}
          </View>
        </Header>
        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={true} scrollEventThrottle={0}
            pagingEnabled alwaysBounceHorizontal style={{height:500}}>
              {this.state.gallery.length !== 0 ?
                this.state.gallery.map((item,key)=>
                  <Image
                    key={key}
                    source={{uri : item.gallery_url}}
                    style={{
                      width: Dimensions.get('window').width,
                      height: 400,
                      resizeMode: "cover",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 0
                    }}
                  />
                )  
              :null}
            </ScrollView> */}


          <View>
            <View style={Styles.headerUnit}>
              <Text style={Styles.sHeader}>
                {item.title.toUpperCase()}
              </Text>
            </View>
            <View style={{flexDirection:'row',marginHorizontal:20}}>
              <Text
                style={{
                  fontWeight: "300",
                  fontSize: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap : 'wrap',
                  flex :1,
                  fontFamily: Fonts.type.sfuiDisplaySemibold,
                }}
              >
                {item.towerDescs} | {unit.descs} 
              </Text>
            </View>
            <View style={Styles.city}>

            {this.state.unit.map((item,key)=>
              this.state.userGroup == 'DEBTOR' || this.state.userGroup == 'Guest' ?
              <TouchableOpacity key={key} style={[Styles.btnCity2,{
                backgroundColor : 
                item.status == 'B' || item.status == 'S' ? 
                  '#fff' 
                  :
                  item.status == 'A' ?
                  '#fff'
                  :
                  '#fff'
                }]
                } 
                onPress={() => { this.clickUnitInfo(item) }} >
                <View style={Styles.btnCityLocation}>
                  <Icon
                    active
                    name="floor-plan"
                    style={[Style.actionIconquiry,{color : '#000'}]}
                    type="MaterialCommunityIcons"
                  />
                  <Text style={[Styles.btnCityText,{color : '#000'}]}>{item.lot_no} </Text>
                  <Text style={[Styles.btnCityText,{color : '#000'}]}>{item.descs} </Text>
                </View>
              </TouchableOpacity>
              :
              <TouchableOpacity key={key} style={[Styles.btnCity,{
                backgroundColor : 
                item.status == 'B' || item.status == 'S' ? 
                  '#a30000' 
                  :
                  item.status == 'A' ?
                  '#1faa00'
                  :
                  '#FFDE4A'
                }]
                } 
                onPress={() => { this.clickUnitInfo(item) }} >
                <View style={Styles.btnCityLocation}>
                  <Icon
                    active
                    name="floor-plan"
                    style={[Style.actionIconquiry,{color : '#fff'}]}
                    type="MaterialCommunityIcons"
                  />
                  <Text style={[Styles.btnCityText,{color : '#fff'}]}>{item.lot_no} </Text>
                  <Text style={[Styles.btnCityText,{color : '#fff'}]}>{item.descs} </Text>
                </View>
              </TouchableOpacity>
            )}

            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50"
  }
});

//make this component available to the app
export default ChouseUnit;