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
    Modal,
    Linking,
    Alert
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
    Textarea,
    Picker
} from "native-base";

import { Actions } from "react-native-router-flux";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import {WebView} from 'react-native-webview';
import base64 from 'react-native-base64'
import { Style, Colors } from "../../Themes";
import Styles from "./Style";

import { _storeData, _getData } from '@Component/StoreAsync';
import { urlApi } from '@Config/services';
import moment from 'moment'
import { ThemeConsumer } from 'react-native-elements';
import Mailer from "react-native-mail";

let isMount = false
// create a component
class Helpdesks extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hd: null,

            customers: [],
            user: "",
            name: "",
            project: [],
            selected: "",
            token : "",
            dataEmail: [],
            dataWassaf: []

        }

        console.log('props cf', props);
    }

    async componentDidMount(){
        isMount = true
        const data = {
          hd : new Headers({
            'Token' : await _getData('@Token')
          }),
          token : await _getData('@Token'),
          descs : "I'm interested about reservation " + this.props.items.project_descs + '\n\n Contact me for the details information.'
        }

        this.setState(data, () => {
            this.getUserEmail();
        })

      }


    getUserEmail() {
        const {entity_cd,project_no, db_profile} = this.props.items
        fetch(urlApi+'c_product_info/userEmail/'+db_profile+'/'+entity_cd+'/'+project_no ,{
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
        Linking.openURL('https://wa.me/+62'+noHp+'?text='+descs)
        console.log('hp wa', noHp);
      
      }
      
      sendEmail(){
        // noHp = '';
        const email_add = this.state.dataEmail
        const descs = this.props.items.project_descs
        
        // alert(email_add);
        console.log('getdesc', descs)
      
      console.log('email send add', email_add)
        Mailer.mail(
          {
            subject: "I'm interested about reservation " + descs,
            recipients: [`${email_add}`],
            ccRecipients: [""],
            bccRecipients: [""],
            body: "",
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

    onValueChange(value) {
        this.setState({
            selected: value
        })
    }
    render() {
        const item = this.props.items
        let { bookedby, name, email, hp } = this.state
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
                            {"HelpDesk".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight}></View>
                </Header>
                <Content
                    style={Style.layoutInner}
                    contentContainerStyle={Style.layoutContent}
                >
                    <View>
                        <ScrollView>
                            <View style={Styles.overview}>
                                <Text style={Styles.projectTitle}>{item.title}</Text>
                            </View>

                            <View style={Styles.overview}>
                                <Image
                                    style={[Styles.picWidth,{ height: 190, borderRadius: 10, marginTop: 5 }]}
                                    source={{uri : item.picture_path}}
                                />
                            </View>

                            <View style={Styles.viewButton}>
                                <TouchableOpacity
                                    onPress={()=>this.sendEmail()}
                                    style={Styles.buttonStyle}>
                                    <Image style={Styles.imgButton} source={require('@Asset/images/email_2.png')} />
                                    <Text style={Styles.buttonTitle}>Send Email</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={()=>this.sendWa()}
                                    style={Styles.buttonStyle}>
                                    <Image style={Styles.imgButton} source={require('@Asset/images/call-center.png')} />
                                    <Text style={Styles.buttonTitle}>Call Us</Text>
                                </TouchableOpacity>

                                {/* <TouchableOpacity
                                    onPress={()=>this.goToDash("finance")}
                                    style={Styles.buttonStyle}>
                                    <Image style={Styles.imgButton} source={require('@Asset/images/bars.png')} />
                                    <Text style={Styles.buttonTitle}>Dashboard Finance</Text>
                                </TouchableOpacity> */}
                            </View>

                        </ScrollView>
                    </View>
                </Content>
            </Container >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    buttonUpload: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        height: 80,
    },

});

//make this component available to the app
export default Helpdesks;
