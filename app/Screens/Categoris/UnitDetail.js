//import liraries
import React, { Component } from 'react';
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
  import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

import { Fonts, Style, Colors } from "../../Themes/";
import Styles from "./Style";

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';
import HTML from 'react-native-render-html';
let isMount = false
// create a component
class UnitDetail extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      hd : null,
      gallery : []
    }


  }

  async componentDidMount(){
    console.log('props UD',this.props);

    isMount = true

    const data = {
      hd : new Headers({
        'Token' : await _getData('@Token')
      }),
    }

    this.setState(data,()=>{
      this.getGallery()
    })
    console.log('get __GoTo from unitDetail', this.props.lottypes);
  }

  getGallery = () =>{
    const item = this.props.items
    const items = this.props.prevItems
    {isMount ?
        fetch(urlApi+'c_product_info/getGallery/'+items.db_profile+'/'+items.entity_cd+'/'+items.project_no+'/'+item.lot_type,{
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

  clickChouseFloor() {
      Actions.chousefloor({
        item : this.props.items, 
        prevItems:this.props.prevItems, 
        gotoTheItem: this.props.goToItems, 
        lottypes: this.props.lottypes,
        routes: this.props.routes
      });
      this.setState({ click : true})
  }
    render() {
      const items = this.props.prevItems
      const item = this.props.items
      // let specifications = ''

      // if(item.spec_info){
      //   specifications = item.spec_info.replace(/(\r\n|\n|\r)/gm," ")
      //   specifications = specifications.replace(/<div>|<strong>|<\/strong>|<\/div>|<ul>|<\/ul>/gi, '')
      //   specifications = specifications.replace(/<\/li>/gi,'')
      //   specifications = specifications.replace(/<li>/gi,'\n??? ')
      //   specifications = specifications.replace(/<br>/gi,' ')
      //   console.log('feature',specifications)
      // }

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
                {"Unit Type Detail".toUpperCase()}
              </Text>
            </View>
            <View style={Style.actionBarRight}/>
          </Header>
        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
            {/* <Image
              source={{uri : this.props.items.picture_url}}
              style={{  
                width: Dimensions.get('window').width,
                height: 400,
                resizeMode: "cover",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 0
              }}
            />  */}
            <ScrollView horizontal showsHorizontalScrollIndicator={true} scrollEventThrottle={0}
            pagingEnabled alwaysBounceHorizontal style={{height:500}}>
              {this.state.gallery.length !== 0 ?
                this.state.gallery.map((item,key)=>
                  <Image
                    key={key}
                    source={{uri : item.gallery_url}}
                    style={{
                      width: Dimensions.get('window').width,
                      height: 500,
                      resizeMode: "cover",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 0
                    }}
                  />
                )  
              :null}
            </ScrollView>
          
            <Text
              style={{
                fontWeight: "300",
                fontSize: 19,
                paddingTop: 16,
                marginLeft: 16,
                justifyContent: "center",
                alignItems: "center",
                fontFamily:Fonts.type.sfuiDisplayBold
              }}
            >
              {items.project_descs}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              paddingTop: 5,
              marginLeft: 16,
              fontFamily:Fonts.type.sfuiDisplayBold
            }}>
              {items.towerDescs} | {item.descs} | {item.remarks}
            </Text>

            <View style={{ 
              paddingTop: 16,
              marginLeft: 16,
              marginRight: 10
              }} >  
                <HTML html={item.spec_info} imagesMaxWidth={Dimensions.get('window').width} />
            </View>
            
    </Content>
    <Button full style={{ backgroundColor: "#906c48" }}
    onPress={() => {
        this.clickChouseFloor();
      }}>
          <Text>Find Unit</Text>
        </Button>
    </Container>
   );
}
}  


//make this component available to the app
export default UnitDetail;
