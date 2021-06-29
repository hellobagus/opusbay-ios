import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, Alert } from "react-native";
import {
    Container,
    Content,
    Header,
    Button,
    Icon,
    List,
    ListItem,
    Left,
    Right,
    Body,
    Thumbnail,
    Spinner,
    Row
} from "native-base";
import { Style, Colors } from "../../Themes";
import Styles from "./Style";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import numFormat from "@Component/numFormat";
import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob"

class UnitPaymentSchedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            units  : [],
            
            rowID: '',
            pictUrlBuktiTF: '',
            isLoaded : false,
            Names: ''
        };

    }

    async componentDidMount() {
        isMount = true;
        const _getrowID = this.props.myunits.rowID;
        const data = {
            hd: new Headers({
                Token: await _getData("@Token")
            }),
            email: await _getData("@User"),
            name: await _getData("@UserId"),
            Names: await _getData("@Name"),
            rowID: _getrowID
        };

        this.setState(data, () => {
            // this.getUnitDetail();
        });

        console.log('getrowid', data.rowID);
    }

    fromCamera(key){
        ImagePicker.openCamera({
            cropping: true,
            width: 600,
            height: 600
        })
            .then(image => {
                console.log("Receive Image", image);
                this.setState({ [key]: {uri: image.path}});
            })
                .catch(e => console.log("tag", e));
    }

    fromGallery(key){
        ImagePicker.openPicker({
            multiple: false,
            width: 600,
            height: 600
        })
            .then(image => {
                console.log('Received Image', image);
                this.setState({ [key]: {uri: image.path} });
            })
                .catch(e => console.log("tag", e));
    }

    showAlert = (key) => {
        Alert.alert(
            "Select a Photo",
            "Choose the place where you want to get a photo",
            [
                {text: "Gallery", onPress:()=>this.fromGallery(key)},
                {text: "Camera", onPress:()=>this.fromCamera(key)},
                {
                    text: "Cancel",
                    onPress:()=> console.log("User Cancel"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    };

    submit = () => {
        this.setState({ isLoaded: !this.state.isLoaded});


        let filebuktitf = RNFetchBlob.wrap(
            this.state.pictUrlBuktiTF.uri.replace("file://", "")
        );

        const {
            rowID,
            Names
        } = this.state;

        const formData = {
            Names: Names,
            rowID: rowID,
            pictUrlBuktiTF: filebuktitf,
        }


        const _byrowID = rowID.replace(/\s+/g, '_');

        let fileNameBuktiTf = "BuktiTF_Payment_"+_byrowID+".png";

        console.log('_getDataUpload', _byrowID);

            RNFetchBlob.fetch(
                "POST",
                urlApi + "c_saveunit/save/IFCAPB",
                {
                    "Content-Type": "multipart/form-data"
                },
                [
                    {name: "photobuktitf", filename: fileNameBuktiTf, data: filebuktitf},
                    {name: "data", data: JSON.stringify(formData)}
                ]
            )
                .then((resp) =>{
                    console.log("res_if", resp);
                    const res = JSON.parse(resp.data);
                    // console.log("res", resp);

                    if (!res.Error) {
                        this.setState({ isLogin: true}, () => {
                            alert(res.Pesan);
                            Actions.popTo('MyUnitPage');
                            setTimeout(() => Actions.refresh())
                        });
                    }else{
                        this.setState({ isLoaded: !this.state.isLoaded }, () => {
                            alert(res.Pesan);
                        });
                    }
                });

    };

    render() {
        const {
            ProjectName,
            Property,
            Level,
            LotNo,
            sell_price
        } = this.props.unit;

        const {
            trx_amt,
            due_date
        } = this.props.myunits;

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
                            {"Payment Schedule Detail".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight} />
                </Header>
                <Content>
                    <List>
                        <ListItem itemHeader>
                            <View>
                                <Text style={{
                                    color: '#3f3b38',
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 17
                                }}>Payment Schedule Detail</Text>
                                <Text style={{
                                    color: '#3f3b38',
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 15,
                                    marginTop: 5
                                }}>{ProjectName}</Text>
                                <Text style={[Style.textBlack,Style.textSmall]}>
                                    {Property} | {Level} | <Text style={Style.textRed}>{LotNo}</Text>
                                </Text>
                                <Text style={{
                                    color: '#3f3b38',
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 15,
                                }}>
                                    {`Transaction Amount : \t`} 
                                    <Thumbnail style={{width:10,height:10}} source={require('@Asset/icon/rupiah.png')} />
                                    <Text style={[Style.textGreen,Style.textMedium]}> {numFormat(trx_amt)}</Text>
                                </Text>
                                <Text style={{
                                    color: '#3f3b38',
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 15,
                                }}>Due Date : {moment(due_date).format('DD MMM YYYY')}</Text>
                            </View>
                        </ListItem>
                        <ListItem itemDivider />
                    </List>
                    <View style={Styles.containImageTop}>
                                <Text 
                                style={[
                                    Style.textBlack, 
                                    {paddingTop: 10}
                                ]}
                                
                                >
                                    Upload Bukti Transfer
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10
                                    }}
                                    onPress={() => this.showAlert("pictUrlBuktiTF")}
                                    pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlBuktiTF == null || this.state.pictUrlBuktiTF =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={this.state.pictUrlBuktiTF} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.overview}>
                                <Button rounded warning full
                                        style={{ marginTop: 16, borderRadius: 10, width: "90%", marginLeft: 20}}
                                        onPress={()=>this.submit()}>
                                        <Text style={{
                                            color: '#3f3b38',
                                            fontFamily: "Montserrat-Regular",
                                            fontSize: 15,
                                        }}>UPLOAD BUKTI TRANSFER</Text>
                                </Button>
                            </View>
                    {/* {!this.state.isLoaded ? <Spinner color="#31C998" /> :null } */}
                </Content>
            </Container>
        );
    }
}
export default UnitPaymentSchedule;