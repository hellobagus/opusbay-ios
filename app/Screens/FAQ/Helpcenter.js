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
  Modal,
  ActivityIndicator,
  Alert,
  Linking
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
  Badge,
  Card,
  Spinner,
} from "native-base";

import { Actions } from "react-native-router-flux";
import ParallaxScroll from "@monterosa/react-native-parallax-scroll";

import { Style, Colors } from "../../Themes";
import styles from "./HelpCenStyle";

import { _storeData, _getData } from "@Component/StoreAsync";
import Mailer from "react-native-mail";
import { urlApi } from "@Config/services";
import moment from "moment";

import numFormat from "@Component/numFormat";
import numPersen from "@Component/numPersen";

let isMount = false;
// create a component
class HelpCenterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hd: null,

      user: "",
      name: "",
      names: "",
      project: [],
      contacts: [],

      isLoaded: false,
    };

    console.log("props cf", props);
  }

  async componentDidMount() {
    isMount = true;
    const data = {
      hd: new Headers({
        Token: await _getData("@Token"),
      }),
      user: await _getData("@User"),
      name: await _getData("@UserId"),
      project: await _getData("@UserProject"),
      names: await _getData("@Name"),
    };

    this.setState(data, () => {
      this.getContact()
      // this.getPayProgress()
    });
  }

  getContact = () => {
    {isMount ?
      // this.state.project.map((val)=>{
          fetch(urlApi+'c_faq/getFaqContact/',{
              method:'GET',
              headers : this.state.hd,
          }).then((response) => response.json())
          .then((res)=>{
              if(!res.Error){
                  const resData = res.Data;
                  this.setState({ contacts: resData });
                  // resData.map((data)=>{
                  //     data.cons = val.db_profile;
                  //     this.setState(prevState=>({
                  //         units : [...prevState.units, data]
                  //     }));
                  // })
                  
                  this.setState({isLoaded: true});
              } 
              console.log('getcontacts',res);
          }).catch((error) => {
              console.log(error);
          })
      // })
  :null}
  }

  sendEmail(){
    // noHp = '';
    const contact = this.state.contacts
    const email_add = contact[0].email

    // console.log('handphone', nohps);
    const message = "<!DOCTYPE html> <meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'> <body> <div>  Hello! I would like to ask a question for you about " +
                  '<br><br></div> </body> </html>';
    
    // alert(email_add);
  
  console.log('email send add', email_add)
    Mailer.mail(
      {
        subject: "Opusbay Help Center ",
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

  sendWa(){

    const contact = this.state.contacts
    const handphone = contact[0].telp
  
    let nohps='';
    if (handphone == null) {
      nohps = "-";
    }else{
      nohps = handphone
    }
  
    const message = "Hello! I would like to ask you about ";
    Linking.openURL('whatsapp://send?text=' + message + '&phone=+' + nohps);
  
  }

  render() {
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
              {"Help Center".toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight}></View>
        </Header>
        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
          <Container style={styles.bgValidate}>
            <View
              style={{
                backgroundColor: "white",
                width: null,
                height: null,
                flexDirection: "row",
              }}
            >
              <Text
                style={[styles.textBlack, styles.textBig, styles.textAlign3]}
              >
                {"Contact Us".toUpperCase()}
              </Text>
            </View>
            <View
              style={{
                marginTop: 15,
                marginBottom: 5,
              }}
            >
              <View style={styles.viewButton}>
                <TouchableOpacity
                  onPress={() => this.sendWa()}
                  style={styles.buttonStyle}
                >
                  <Image
                    style={styles.imgButton}
                    source={require("@Asset/images/contacts_.png")}
                  />
                  <Text style={styles.buttonTitle}>CHAT US</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={()=>this.sendEmail()}
                  style={styles.buttonStyle}
                >
                  <Image
                    style={styles.imgButton}
                    source={require("@Asset/images/emails_.png")}
                  />
                  <Text style={styles.buttonTitle}>EMAIL</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Container>
        </Content>
        <View
          style={{
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 1,
            borderColor: "#f2f2f2",
          }}
        />
        <View
          style={
            {
              // marginTop: 15,
              // marginBottom: 5,
              // backgroundColor: 'white',
              // width: '100%',
              // height: 40
            }
          }
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Montserrat-Regular",
              textAlign: "center",
              padding: 15,
              color: '#A9A9A9'
            }}
          >
            24 hour Customer Service, Monday to Sunday including Public Holidays
          </Text>
        </View>
      </Container>
    );
  }
}

// define your styles
const stylez = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  bgMain: {
    backgroundColor: "white",
  },
});

//make this component available to the app
export default HelpCenterPage;