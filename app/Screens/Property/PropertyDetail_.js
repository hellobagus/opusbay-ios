import React from "react";
import {
  StatusBar,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  Platform,
  SafeAreaView,
  FlatList,
  Modal,
  ActivityIndicator,
  Linking,
  Alert,
// WebView
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
  View,
  FooterTab,
  Badge,
  List,
  ListItem,
  Tab,
  Tabs,
  Fab,
  Form,
  Label,
} from "native-base";

import { Actions } from "react-native-router-flux";
import {urlApi} from '@Config/services';
import GALLERY from "./Gallery";
import AMENITIES from "./Amenities";
import SIMILAR from "./Similar";
import {_storeData,_getData,_navigate} from '@Component/StoreAsync';
import SegmentedControlTab from "react-native-segmented-control-tab";


import { Style, Colors } from "../../Themes/index";
import Styles from "./Style";

import ImageViewer from 'react-native-image-zoom-viewer';
import HTML from 'react-native-render-html';
import Mailer from "react-native-mail";
import { WebView } from 'react-native-webview';


//const {width, height} = Dimensions.get('window')
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  "window"
);

let isMount = false


const API_KEY = "AIzaSyBY0EdmxQjo65OoFYIlQZ8jQ1FS8VOTFC8";
// const API_KEY = "AIzaSyBFhdZb-_5FCA5IhbLhB9-KimWC_QlOKLs";


export default class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        title : '',
        picture_url : '',

        active: false,
        isVisible: false,
        isView : false,
        isUnitView : false,
        isLogin : false,

        hd : new Headers,
        email : '',
        userId : '',
        descs : '',
        refEmail : '',

        amenities  : null,
        feature : null,
        overview : null,
        project : null,
        gallery : null,
        plans : null,

        imagesPreview :[],
        unitPlanPreview : [],
        dataPromo:[],
        dataEmail:[],
        dataWassaf:[],
        tower:[],
        index : 0,
        wa_no: '',
        email_add: '',
        selectedIndex: 0,
      selectedIndices: [0],
      customStyleIndex: 0,
      customStyleIndexs: 0,
      };

      console.log('props',props);

    }
      
async componentDidMount() {
    Actions.refresh({ backTitle: () => this.props.title });

    const data = {
      hd : new Headers({
        'Token' : await _getData('@Token')
      }),
      email : await _getData('@User'),
      userId : await _getData('@UserId'),
      name : await _getData('@Name'),
      handphone : await _getData('@Handphone'),
      isLogin : await _getData('@isLogin'),
      title : this.props.items.project_descs,
      // descs : this.props.items.project_descs,
      descs : "I'm interested about reservation " + this.props.items.project_descs + '\n\n Contact me for the details information.',
      picture_url : this.props.items.picture_url
    }
    console.log('dataIm',data);

    isMount=true

    this.setState(data,()=>{
      this.getDataDetails(this.props.items)
      this.getDataGallery(this.props.items)
      this.getPromo()
      this.getDataUnitPlan(this.props.items)
      this.getTower(this.props.items);
      this.getUserEmail(this.props.items)
    })

}

componentWillUnmount(){
  // this.setState({isMount:false})
  isMount =false
}

getPromo = () => {
  const {entity_cd,project_no} = this.props.items
  fetch(urlApi+'c_newsandpromo/getDatapromo2/IFCAMOBILE/'+entity_cd+'/'+project_no ,{
      method : "GET",
  })
  .then((response) => response.json())
  .then((res)=>{
      if(!res.Error){
        const resData = res.Data

        this.setState({dataPromo:resData})
        console.log('dataPRopmo',resData);
      }
  }).catch((error) => {
      console.log(error);
  });
}

getDataDetails = (item) => {
    {isMount ?
    fetch(urlApi+'c_reservation/getDataDetails/'+item.db_profile+'/'+item.entity_cd+'/'+item.project_no,{
        method:'GET',
        headers : this.state.hd,
    }).then((response) => response.json())
    .then((res)=>{
        if(!res.Error){
            const resData = res.Data
            const data = {
              amenities : resData.amenities,
              feature : resData.feature,
              overview : resData.overview,
              project : resData.project,
            }
            console.log('data',data);
            this.setState(data)
        } else {
            this.setState({isLoaded: !this.state.isLoaded},()=>{
                alert(res.Pesan)
            });
        }
        console.log('getDAtaDetails',res);
    }).catch((error) => {
        console.log(error);
    })
    :null}
}

getTower = (item) => {

  {
      isMount
          ? fetch(
                urlApi +
                    "c_product_info/getTower/" +
                    item.db_profile +
                    "/" +
                    item.entity_cd +
                    "/" +
                    item.project_no,
                {
                    method: "GET",
                    headers: this.state.hd
                }
            )
                .then(response => response.json())
                .then(res => {
                    if (!res.Error) {
                        const resData = res.Data;
                        this.setState({ tower: resData });
                        // _storeData("@getTowers", resData);
                    } else {
                        this.setState(
                            { isLoaded: !this.state.isLoaded },
                            () => {
                                alert(res.Pesan);
                            }
                        );
                    }
                    console.log("getTower", res);
                })
                .catch(error => {
                    console.log(error);
                })
          : null;
  }
};

getDataGallery = (item) => {
  {isMount ?
  fetch(urlApi+'c_reservation/getGallery/'+item.db_profile+'/'+item.entity_cd+'/'+item.project_no,{
      method:'GET',
      headers : this.state.hd,
  }).then((response) => response.json())
  .then((res)=>{
      if(!res.Error){
          console.log(resData)
          const resData = res.Data
          this.setState({gallery : resData.gallery})
          resData.gallery.map((item)=>{
            this.setState(prevState=>({
              imagesPreview : [...prevState.imagesPreview, {url:item.gallery_url}]
            }))
          })
      } else {
          this.setState({isLoaded: !this.state.isLoaded},()=>{
              alert(res.Pesan)
          });
      }
      console.log('getData Galerry',res);
  }).catch((error) => {
      console.log(error);
  })
  :null}
}

getDataUnitPlan = (item) => {
  {isMount ?
  // fetch(urlApi+'c_reservation/getGallery/'+item.entity_cd+'/'+item.project_no,{
    fetch(urlApi+'c_reservation/getGallery/'+item.db_profile+'/'+item.entity_cd+'/'+item.project_no,{
      method:'GET',
      headers : this.state.hd,
  }).then((response) => response.json())
  .then((res)=>{
      if(!res.Error){
          console.log(resData)
          const resData = res.Data
          this.setState({plans : resData.plans})
          resData.plans.map((item)=>{
            this.setState(prevState=>({
              unitPlanPreview : [...prevState.unitPlanPreview, {url:item.plan_url}]
            }))
          })
      } else {
          this.setState({isLoaded: !this.state.isLoaded},()=>{
              alert(res.Pesan)
          });
      }
      console.log('getData Plans',res);
  }).catch((error) => {
      console.log(error);
  })
  :null}
}

getUserEmail(item) {
  // const {entity_cd,project_no} = this.props.items
  fetch(urlApi+'c_product_info/userEmail/'+item.db_profile+'/'+item.entity_cd+'/'+item.project_no ,{
      method : "GET",
  })
  .then((response) => response.json())
  .then((res)=>{
      if(!res.Error){
        const emails = res.Data[0].email_add;
        const wassaf = res.Data[0].wa_no;
        this.setState({dataEmail:emails, dataWassaf:wassaf})
        console.log('get _dataEmail',emails);
        console.log('get _dataWassaf', wassaf);
      }
  }).catch((error) => {
      console.log(error);
  });
}

sendWa(){

  const noHp = this.state.dataWassaf
  const descs = this.state.descs
  const name = this.state.name
  const email = this.state.email
  const userId = this.state.userId
  const handphone = this.state.handphone

  let nohps='';
  if (handphone == null) {
    nohps = "-";
  }else{
    nohps = handphone
  }

  const message = "I'm interested about reservation " + this.props.items.project_descs + '\n\n Name : ' + name + '\n Email : ' + email + '\n Phone Number : ' + nohps + '\n\n Contact me for the details information.';
  Linking.openURL('whatsapp://send?text=' + message + '&phone=+' + noHp);

}

sendEmail(){
  // noHp = '';
  const email_add = this.state.dataEmail
  const descs = this.props.items.project_descs
  const name = this.state.name
  const email = this.state.email
  const userId = this.state.userId
  const handphone = this.state.handphone

  let nohps='';
  if (handphone == null) {
    nohps = "-";
  }else{
    nohps = handphone
  }

  // console.log('handphone', nohps);
  const message = "<!DOCTYPE html> <meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'> <body> <div>  Name : " + name + 
                '<br> Email : ' + email + '<br> Phone Number : ' + nohps + '<br><br> Contact me for the details information. </div> </body> </html>';
  
  // alert(email_add);
  console.log('getdesc', descs)

console.log('email send add', email_add)
  Mailer.mail(
    {
      subject: "I'm interested about reservation " + this.props.items.project_descs,
      recipients: [`${email_add}`],
      ccRecipients: [""],
      bccRecipients: [""],
      body: message,
      isHTML: true
    },
    (error, event) => {
      Alert.alert(
        error,
        event,
        [
          {
            text: "Ok",
            onPress: () => console.log("OK: Email Error Response")
          },
          {
            text: "Cancel",
            onPress: () => console.log("CANCEL: Email Error Response")
          }
        ],
        { cancelable: true }
      );
    }
  );
};

showModal(){
  this.setState({isVisible:true})
}



clickToNavigate = (to,param) =>{
  Actions[to](param);
  this.setState({click:true})
}

showAlert = () => {
  Alert.alert(
      '',
      'Please Login First',
      [
          {text: 'Cancel',onPress: () => console.log('Cancel Pressed'), style: 'cancel',},
          {text: 'OK', onPress: () => Actions.Login()},
      ],
      {cancelable: false},
  );
}
handleSingleIndexSelect = (index: number) => {
  this.setState((prevState) => ({ ...prevState, selectedIndex: index }));
};

handleMultipleIndexSelect = (index: number) => {
  const { selectedIndices } = this.state;

  if (selectedIndices.includes(index)) {
    this.setState((prevState) => ({
      ...prevState,
      selectedIndices: selectedIndices.filter((i) => i !== index),
    }));
  } else {
    this.setState((prevState) => ({
      ...prevState,
      selectedIndices: [...selectedIndices, index],
    }));
  }
};

handleCustomIndexSelect = (index: number) => {
  this.setState((prevState) => ({ ...prevState, customStyleIndex: index }));
};

handleCustomIndexSelects = (index: number) => {
  this.setState((prevState) => ({ ...prevState, customStyleIndexs: index }));
};
 
  render() {
    // let feature = ''
    // if(this.state.feature){
    //   feature = this.state.feature[0].feature_info.replace(/<div class="col-md-6">|<\/div>|<\/b>|<b>|<ul class="list-unstyled">|<\/ul>/gi, '')
    //   feature = feature.replace(/<\/li>/gi,'\n')
    //   feature = feature.replace(/<li>/gi,'• ')
    //   feature = feature.replace(/<br>/gi,' ')
    // }

    const dataPromo = this.state.dataPromo;
    const {
      selectedIndex,
      selectedIndices,
      customStyleIndex,
      customStyleIndexs,
    } = this.state;
    console.log('check __cekDataPromo', dataPromo);


    return (
      <Container style={Style.bgMain}>
        <Header style={Style.navigation}>
          <StatusBar backgroundColor={Colors.brownTuansing} animated barStyle="light-content" />          

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
              {this.state.title.toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight}>
            {/* <Button
              transparent
              style={Style.actionBtnRight}
            >
              <Icon
                active
                name="search"
                style={Style.actionIcon}
                type="FontAwesome"
              />
            </Button> */}
          </View>
        </Header>

        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
          {this.state.picture_url !='' ?
            <ImageBackground
            source={{
              uri: this.state.picture_url
            }}
            imageStyle={"cover"}
            style={Styles.coverImg}
            >
          {/* <Fab
            active={this.state.active}
            direction="down"
            containerStyle={{ marginLeft:8}}
            style={{ backgroundColor: '#DAD299', width:32, height: 32 }}
            position="topRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <Icon name="share" />
            <Button style={{ backgroundColor: '#DAD299',  width:32, height: 32,  marginLeft:4  }}>
              <Icon name="logo-whatsapp" />
            </Button>
            <Button style={{ backgroundColor: '#DAD299',  width:32, height: 32,  marginLeft:4  }}>
              <Icon name="logo-facebook" />
            </Button>
            <Button style={{ backgroundColor: '#DAD299' ,  width:32, height: 32,  marginLeft:4 }}>
              <Icon name="mail" />
            </Button>
          </Fab> */}
          </ImageBackground>
          :<ActivityIndicator/>}

          <View style={Styles.count}>
           <ScrollView horizontal={true}>
            {/* <View style={[Styles.countItem, Styles.countFirst]}>
              <TouchableOpacity onPress={(val) => {
                _navigate('ProductProjectPage',{
                  items: this.props.items,
                  goTo: val,
                  dyn: false,
                  isProduct: true,
                  routes: this.props.routeName,
                  propertycds: this.state.tower[0].property_cd
                })
                
              }}>
                <View style={Styles.countCol}>
                  <Image
                    source={require("@Asset/images/type.png")}
                    style={{ width: 34, height: 34 }}
                    resizeMode='stretch'
                  />
                  <View style={Styles.textMenu}>
                    <Text style={Styles.countText}>Find Unit & Price</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View> */}
            {/* <View style={[Styles.countItem, Styles.countFirst]}> */}
              {/* <TouchableOpacity
              onPress={()=>{
                this.state.isLogin ? Actions.BookingPage({items : this.props.items}) 
                : this.showAlert()
              }}>
                <View style={Styles.countCol}>
                  <Image
                    source={require("@Asset/images/icon/booking.png")}
                    style={{ width: 34, height: 42 }}
                    resizeMode='stretch'
                  />
                  <View style={Styles.textMenu}>
                    <Text style={Styles.countText}>Booking Now</Text>
                  </View>
                </View>
              </TouchableOpacity> */}
            {/* </View> */}
            <View style={[Styles.countItem, Styles.countFirst]}>
              <TouchableOpacity
              onPress={()=>Actions.ProjectDownloadPage({items:this.props.items})}>
                <View style={Styles.countCol}>
                  <Image
                    source={require("@Asset/images/brosur.png")}
                    style={{ width: 34, height: 34 }}
                    resizeMode='stretch'
                  />
                  <View style={Styles.textMenu}>
                    <Text style={Styles.countText}>Brochure</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </View>

          <ImageBackground
            source={require("@Asset/images/shadow.png")}
            imageStyle={"cover"}
            style={Styles.shadow}
          />

          <View style={Styles.overview}>
            <Text style={Styles.overviewTitle}>Overview</Text>
    
              {this.state.overview ? 
               <HTML html={this.state.overview[0].overview_info} imagesMaxWidth={Dimensions.get('window').width} />
              :<ActivityIndicator /> }

          </View>
          
          
          <View>
            <SegmentedControlTab
              values={["Features", "Gallery", "Unit Plan"]}
              selectedIndex={customStyleIndex}
              onTabPress={this.handleCustomIndexSelect}
              borderRadius={0}
              tabsContainerStyle={{ height: 50, backgroundColor: "#F2F2F2" }}
              tabStyle={{
                backgroundColor: "#F2F2F2",
                borderWidth: 0,
                borderColor: "transparent",
              }}
              activeTabStyle={{ backgroundColor: "white", marginTop: 2 }}
              tabTextStyle={{ color: "#444444", fontWeight: "bold" }}
              activeTabTextStyle={{ color: "#888888" }}
            />
            {customStyleIndex === 0 && (
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Feature</Text>
                {this.state.feature ? (
                  // <Text style={Styles.overviewDesc}>
                  //   {feature}
                  // </Text>
                  <HTML
                    html={this.state.feature[0].feature_info}
                    imagesMaxWidth={Dimensions.get("window").width}
                  />
                ) : (
                  <ActivityIndicator />
                )}
              </View>
            )}
            {customStyleIndex === 1 && (
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Photo Gallery</Text>
                {this.state.gallery ? (
                  <FlatList
                    data={this.state.gallery}
                    horizontal
                    style={Styles.slider}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.line_no}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        underlayColor="transparent"
                        onPress={() => {
                          this.setState({ isView: true, index: index });
                        }}
                      >
                        <View>
                          <Image
                            source={{ uri: item.gallery_url }}
                            style={Styles.sliderImg}
                          />
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <ActivityIndicator />
                )}
              </View>
            )}
            {customStyleIndex === 2 && (
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Unit Plan</Text>
                {this.state.plans ? (
                  <FlatList
                    data={this.state.plans}
                    horizontal
                    style={Styles.slider}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.line_no}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        underlayColor="transparent"
                        onPress={() => {
                          this.setState({ isUnitView: true, index: index });
                        }}
                      >
                        <View>
                          <Image
                            source={{ uri: item.plan_url }}
                            style={Styles.sliderImg}
                          />
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <ActivityIndicator />
                )}
              </View>
            )}
          </View>

<Text style={Styles.overviewTitle_surround}>Surrounding Area</Text>
          <View>
            <SegmentedControlTab
              values={["Infrastructure", "School", "Hospital", "Other"]}
              selectedIndex={customStyleIndexs}
              onTabPress={this.handleCustomIndexSelects}
              borderRadius={0}
              tabsContainerStyle={{ height: 50, backgroundColor: "#F2F2F2" }}
              tabStyle={{
                backgroundColor: "#F2F2F2",
                borderWidth: 0,
                borderColor: "transparent",
                
              }}
              activeTabStyle={{ backgroundColor: "white", marginTop: 2 }}
              tabTextStyle={{ color: "#444444", fontWeight: "bold", fontSize: 13, flexWrap: 'wrap' }}
              activeTabTextStyle={{ color: "#888888" }}
            />
            {customStyleIndexs === 0 && (
              <View style={Styles.overview}>
                {/* <Text style={Styles.overviewTitle}>Infrastructure</Text> */}
                {this.state.amenities ? (
                  // <Text style={Styles.overviewDesc}>
                  //   {feature}
                  // </Text>
                  <HTML
                    html={this.state.amenities[0].amenities_info}
                    imagesMaxWidth={Dimensions.get("window").width}
                  />
                ) : (
                  <ActivityIndicator />
                )}
              </View>
            )}
            {customStyleIndexs === 1 && (
              <View style={Styles.overview}>
                {/* <Text style={Styles.overviewTitle}>School</Text> */}
                {this.state.amenities ? (
                  // <Text style={Styles.overviewDesc}>
                  //   {feature}
                  // </Text>
                  <HTML
                    html={this.state.amenities[1].amenities_info}
                    imagesMaxWidth={Dimensions.get("window").width}
                  />
                ) : (
                  <ActivityIndicator />
                )}
              </View>
            )}
            {customStyleIndexs === 2 && (
              <View style={Styles.overview}>
                {/* <Text style={Styles.overviewTitle}>Infrastructure</Text> */}
                {this.state.amenities ? (
                  <HTML
                    html={this.state.amenities[2].amenities_info}
                    imagesMaxWidth={Dimensions.get("window").width}
                  />
                ) : (
                  <ActivityIndicator />
                )}
              </View>
            )}
            {customStyleIndex === 3 && (
              <View style={Styles.overview}>
                {/* <Text style={Styles.overviewTitle}>Infrastructure</Text> */}
                {this.state.amenities ? (
                  // <Text style={Styles.overviewDesc}>
                  //   {feature}
                  // </Text>
                  <HTML
                    html={this.state.amenities[3].amenities_info}
                    imagesMaxWidth={Dimensions.get("window").width}
                  />
                ) : (
                  // <ActivityIndicator />
                      <View style={{ 
                        backgroundColor: 'black',
                        width: null,
                        height: null,
                        flexDirection: "row"
                    }}>
                        <Text style={{
                          color: '#3f3b38',
                          fontFamily: "Montserrat-Regular",
                          fontSize: 15,
                          margin : 15,
                          flexWrap: 'wrap',
                        }}>
                            NO DATA
                        </Text>
                    </View>
                )}
              </View>
            )}
          </View>
               
          {/* <View>
            <Text style={Styles.overviewTitle_youtube}>Video</Text>
              
              {this.state.overview ? 
  
               <HTML html={`<iframe src='${this.state.overview[0].youtube_link}'></iframe>`} imagesMaxWidth={Dimensions.get('window').width} />
              :<ActivityIndicator /> }
              
             
          </View> */}
          <View style={{flex: 1, paddingHorizontal: 10}} >
          <Text style={Styles.overviewTitle_youtube}>Video</Text>
            {/* <Text>{this.state.overview[0].youtube_link}</Text> */}
            {this.state.overview ? 
              // <Text>{this.state.overview[0].youtube_link}</Text>
              <WebView
                style={{height: 300}}
                source={{ uri: this.state.overview[0].youtube_link }}
                // allowsFullscreenVideo={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}   
              />
              :<ActivityIndicator /> }
          </View>
                 
          <View style={Styles.overview_location}>
            <Text style={Styles.overviewTitle_youtube}>Location</Text>
          </View>
            {/* <HTML html = {`<iframe width="600" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/view?zoom=17&center=3.1164,101.5950&key=AIzaSyBY0EdmxQjo65OoFYIlQZ8jQ1FS8VOTFC8"></iframe>`}></HTML> */}
                {this.state.project ? 
  
                //  <HTML html={`<iframe name="gMap" src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.980392567379!2d98.67400131448191!3d3.591970997386129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131c5bb04a5b5:0xc9bead74e038893e!2sThe+Reiz+Condo+Medan!5e0!3m2!1sen!2sid!4v1534232821301&key=${API_KEY}'></iframe>`} imagesMaxWidth={Dimensions.get('window').width} />
               
                 //  <HTML html={`<iframe src='${this.state.project[0].coordinat_project}' width="300" height="300" frameborder="0" style="border:0;"></iframe>`} imagesMaxWidth={Dimensions.get('window').width} />
                //  <HTML html={this.state.project[0].coordinat_project} />
                // <HTML html={`<iframe src="https://goo.gl/maps/idUCFGKtvhrhYGhd6" height="500px" ></iframe>`}></HTML>
                // <HTML html={`<iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBY0EdmxQjo65OoFYIlQZ8jQ1FS8VOTFC8&q=Space+Needle,Seattle+WA"></iframe>`}></HTML>
                // <HTML html = {`<iframe width="600" height="450" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/view?zoom=17&center=3.1164,101.5950&key=AIzaSyBY0EdmxQjo65OoFYIlQZ8jQ1FS8VOTFC8"></iframe>`}></HTML>
                // <HTML html = {`<iframe\s*src="https:\/\/www\.google\.com\/maps\/embed\?[^"]+"*\s*[^>]+>*<\/iframe>`}></HTML>  

                <WebView
                  scalesPageToFit={false}
                  bounces={false}
                  javaScriptEnabled
                  style={{ height: 300, width: null, marginHorizontal: 10, right: 4 }}
                  source={{
                    html: `
                          <!DOCTYPE html>
                          <html>
                            <head></head>
                            <body>
                              <div id="baseDiv"><iframe width="450" height="450" frameborder="0" style="border:0" src='${this.state.project[0].coordinat_project}'></iframe></div>
                            </body>
                          </html>
                    `,
                  }}
                  automaticallyAdjustContentInsets={false}
                 
                />

                

                :<ActivityIndicator />  }

                {this.state.project ? 
                <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>{this.state.project[0].project_descs}</Text>
                <Text style={Styles.overviewTitle}>{this.state.project[0].coordinat_name}</Text>
                <Text style={Styles.overviewTitle}>{this.state.project[0].coordinat_address}</Text>
                </View>

                :<ActivityIndicator /> }
          {/* </View> */}
          
          

          

          {/* <View style={Styles.sectionGrey}>
            <View style={Styles.headerBg}>
              <Text style={Styles.sHeader}>
                {"Promo".toUpperCase()}
              </Text>
              <Right>
                <Button
                  small
                  rounded
                  style={Styles.sBtn}
                  onPress={() => {
                    Actions.Feed({ types: 'promo'})
                  }}
                >
                  <Text style={Styles.sLink}>See All</Text>
                </Button>
              </Right>
            </View>
            {this.state.dataPromo.length > 0 || this.state.dataPromo.attach_type == 'L' ?
              
              <FlatList
                data={this.state.dataPromo}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={Styles.flatList}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={Styles.item}
                    underlayColor="transparent"
                    onPress={() => { Linking.openURL(item.article_link)}}
                  >
                    <View>
                      <View>
                        <Image
                          source={{ uri: item.picture }}
                          style={Styles.itemImg}
                        />
                      </View>
                      <Text style={Styles.itemPrice}>{item.descs}</Text>
                      <Text style={Styles.itemLocation}>{item.subject}</Text>
                      
                    </View>
                  </TouchableOpacity>
                )}
              />  
            :<Text style={[Styles.itemPrice,{alignSelf:'center'}]}>No Promo</Text>}
          </View> */}

          
          <Modal visible={this.state.isView} transparent={true}
          onRequestClose={() => {
            this.setState({ isView: !this.state.isView })
          }}>
            <Header style={Style.navigationModal}>
              <StatusBar
                backgroundColor={Colors.statusBarNavy}
                animated
                barStyle="light-content"
              />
              <View style={Style.actionBarRight}>
                <Button
                  transparent
                  style={Style.actionBtnRight}
                  onPress={() => {
                    this.setState({ isView: !this.state.isView })
                  }}            
                  >
                  <Icon
                    active
                    name="close"
                    style={Style.actionIcon}
                    type="FontAwesome"
                  />
                </Button>
              </View>
            </Header>
            {this.state.imagesPreview ? <ImageViewer enableImageZoom={true} enableSwipeDown={true} onSwipeDown={()=>this.setState({ isView: !this.state.isView })} index={this.state.index} imageUrls={this.state.imagesPreview}/> : null}
          </Modal>

          <Modal visible={this.state.isUnitView} transparent={true}
          onRequestClose={() => {
            this.setState({ isUnitView: !this.state.isUnitView })
          }}>
            <Header style={Style.navigationModal}>
              <StatusBar
                backgroundColor={Colors.statusBarNavy}
                animated
                barStyle="light-content"
              />
              <View style={Style.actionBarRight}>
                <Button
                  transparent
                  style={Style.actionBtnRight}
                  onPress={() => {
                    this.setState({ isUnitView: !this.state.isUnitView })
                  }}            >
                  <Icon
                    active
                    name="close"
                    style={Style.actionIcon}
                    type="FontAwesome"
                  />
                </Button>
              </View>
            </Header>
            {this.state.unitPlanPreview ? <ImageViewer enableImageZoom={true} enableSwipeDown={true} onSwipeDown={()=>this.setState({ isUnitView: !this.state.isUnitView })} index={this.state.index} imageUrls={this.state.unitPlanPreview}/> : null}
          </Modal>

          <Modal
          animationType={'slide'}
          transparent={false}
          visible={this.state.isVisible}
          onRequestClose={() => {
            this.setState({ isVisible: !this.state.isVisible })
          }}>
          <Header style={Style.navigationModal}>
          <StatusBar
            backgroundColor={Colors.statusBarNavy}
            animated
            barStyle="light-content"
          />
           <View style={Style.actionBarLeft}>
               </View>
          <View style={Style.actionBarMiddle}>
            <Text style={Style.actionBarText}>
              {"I'm Interested".toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight}>
            <Button
              transparent
              style={Style.actionBtnRight}
              onPress={() => {
                this.setState({ isVisible: !this.state.isVisible })
              }}            >
              <Icon
                active
                name="close"
                style={Style.actionIcon}
                type="FontAwesome"
              />
            </Button>
          </View>
        </Header>
        <ScrollView>
        <Form style={{marginTop:10}}>
            <Item>
              <Text>{this.state.title}</Text>
            </Item>
            <Item floatingLabel>
              <Label>Your Name</Label>
              <Input value={this.state.name} onChangeText={(val)=>this.setState({name : val})} />
            </Item>
            <Item floatingLabel>
              <Label>Handphone</Label>
              <Input value={this.state.handphone} onChangeText={(val)=>this.setState({handphone : val})} />
            </Item>
            <Item floatingLabel>
              <Label>Description</Label>
              <Input multiline value={this.state.descs} onChangeText={(val)=>this.setState({descs : val})} />
            </Item>
            <Item floatingLabel>
              <Label>Reference Email</Label>
              <Input value={this.state.refEmail} onChangeText={(val)=>this.setState({refEmail : val})} />
            </Item>
            <Body style={{ paddingVertical:32 }} o>
            <Button rounded sucscess full
            style={{ marginTop:16, backgroundColor: Colors.blueUrban }} onPress={()=>this.sendEmail()} >
            <Text>Send Email</Text>
          </Button>
            <Button rounded warning iconRight full
            style={{ marginTop:16, backgroundColor: Colors.loginGreen }} onPress={()=>this.sendWa()}>
            <Text>Send via WhatsApp</Text>
            <Icon name='whatsapp' 
            type="FontAwesome5"/>
          </Button>
          </Body>
          </Form>
          </ScrollView>
        </Modal>
        </Content>
        <Button full style={{ backgroundColor: "#906c48" }}  onPress={() =>{
          this.state.isLogin ? this.showModal()
          : this.showAlert()
          
        }}>
          <Text>I'm Interested</Text>
        </Button>
      </Container>
    );
  }
}