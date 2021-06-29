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
    NativeModules,
    PermissionsAndroid,
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
    Textarea,
    Picker
} from "native-base";
import RNFetchBlob from 'rn-fetch-blob'
import { Actions } from "react-native-router-flux";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

import { Style, Colors } from "../../Themes";
import Styles from "./Style";

import { _storeData, _getData } from '@Component/StoreAsync';
import { urlApi } from '@Config/services';
import moment from 'moment'
import pdf from 'react-native-pdf';
const DocumentInteractionController = NativeModules.RNDocumentInteractionController;

let isMount = false
// create a component
class ManagementReport extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hd: null,

            files: [],
            user: "",
            name: "",
            project: [],
            selected: ""
        }

        console.log('props cf', props);
    }

    async componentDidMount(){
        isMount = true
        const data = {
            hd : new Headers({
            'Token' : await _getData('@Token')
            }),
            user : await _getData('@User'),
            name : await _getData('@UserId'),
            project : await _getData('@UserProject')
        }

        this.setState(data,()=>{
            // this.getFile(),
            // this.requestStorage()
        })
    }

    // requestStorage = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //             {
    //             title: 'IFCA S + want to acces your storage',
    //             message:
    //                 'Please be careful with agreement permissions ',
    //             buttonNeutral: 'Ask Me Later',
    //             buttonNegative: 'Cancel',
    //             buttonPositive: 'OK',
    //             },
    //         );
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             console.log('You can use the camera');
    //         } else {
    //             console.log('Camera permission denied');
    //         }
    //     } catch (err) {
    //       console.warn(err);
    //     }
    // }


    goToDash = (type) => {
        const item = this.props.items

        // const token = base64.encode(item.db_profile+'-$-'+item.entity_cd+'-$-'+item.project_no+'-$-'+this.state.token)
        // const data = urlApi+"dash_"+type+"/index/"+token
        // const data = "http://139.255.61.85/WaskitaDash/";
        // console.log('data',data);
        // Actions.Dashboard({url:data})
        Linking.openURL("http://139.255.61.85/WaskitaDash/");
    }

    onValueChange(value) {
        this.setState({
            selected: value
        })
    }
    render() {

        return (
            <Container style={Style.bgMain}>
                <Header style={Style.navigation}>
                    <StatusBar
                        backgroundColor={Colors.statusBarBlue}
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
                            {"Reports".toUpperCase()}
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
                            {/* <View style={Styles.overview}>
                                <Text style={Styles.projectTitle}>{item.title}</Text>
                            </View> */}
{/* 
                            <View style={Styles.overview}>
                                <Image
                                    style={[Styles.picWidth,{ height: 190, borderRadius: 10, marginTop: 5 }]}
                                    source={{uri : item.picture_path}}
                                />
                            </View> */}

                            {/* {this.state.files.map((val,key)=> */}
                                {/* <View key={key} style={Styles.overviewButton}> */}
                                <View style={Styles.overviewButton}>
                                    <Button rounded warning full
                                        style={{ marginTop: 16, borderRadius: 10, height: 75 }}
                                        onPress={()=>this.goToDash()}>
                                        <Text style={Styles.textButton}>Go To Management Dashboard</Text>
                                    </Button>
                                </View>
                            {/* )} */}

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
export default ManagementReport;