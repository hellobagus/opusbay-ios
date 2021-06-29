import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, Alert, Modal } from "react-native";
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
import RNFetchBlob from "rn-fetch-blob";
import WebView from "@Component/WebViewUnit";

class OutstandingPayment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            units  : [],
            isVisible: false,
            
            rowID: '',
            pictUrlBuktiTF: '',
            isLoaded : false,
            Names: '',
            user_email : '',
            user_name : '',
            amounts : '',
            doc_no : '',
            Typez : '',
            hps : '',
            
        };

        console.log('get _props', props);
        console.log('get due date', this.props.rowid);
    }

    async componentDidMount() {
        isMount = true;
        const _getrowID = this.props.rowid;
        const MyUnits = this.props.myunits;
        const TheUnit = this.props.unit;
        const data = {
            hd: new Headers({
                Token: await _getData("@Token")
            }),
            email: await _getData("@User"),
            name: await _getData("@UserId"),
            Names: await _getData("@Name"),
            rowID: _getrowID,

            user_email : TheUnit.email_addr,
            user_name : TheUnit.agent_name,
            amounts : MyUnits.fbal_amt,
            doc_no : MyUnits.doc_no,
            Typez : TheUnit.LotTypeDesc,
            hps : TheUnit.agent_handphone

        };

        this.setState(data, () => {
            this.getMidtrans();
        });
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

        const items = this.props.unit;

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

        console.log('_getDataUpload', items.cons);

            RNFetchBlob.fetch(
                "POST",
                urlApi + "c_saveunit/save/"+items.cons,
                {
                    "Content-Type": "multipart/form-data"
                },
                [
                    {name: "photobuktitf", filename: fileNameBuktiTf, data: filebuktitf},
                    {name: "data", data: JSON.stringify(formData)}
                ]
            )
                .then(resp =>{
                    const res = JSON.parse(resp.data);
                    // const res = JSON.stringify(resp.data);
                    console.log("res", resp);

                    if (!res.Error) {
                        this.setState({ isLogin: true}, () => {
                            alert(res.Pesan);
                            Actions.pop()
                        });
                    }else{
                        this.setState({ isLoaded: !this.state.isLoaded }, () => {
                            alert(res.Pesan);
                        });
                    }
                });

    };



    getMidtrans() {
        const MyUnits = this.props.myunits;
        const TheUnit = this.props.unit;

        const doc_no = MyUnits.doc_no;
        const trx_amt = MyUnits.fbal_amt;
        const LotTypeDesc = TheUnit.LotTypeDesc;
        const Name = TheUnit.agent_name;
        const Email = TheUnit.email_addr;
        const Handphone = TheUnit.agent_handphone
        const OrderId = "AI" + + Math.floor(Math.random() * 100000001);


        {
            isMount
                ? fetch("https://ifca.opus-bay.com/c_midtrans_booking/index", {
                      method: "POST",
                      // method:'POST',
                      body: JSON.stringify({
                          transaction_details: {
                              order_id:
                                  OrderId,
                              gross_amount: trx_amt,
                          },
                          item_details: [
                              {  
                                name: LotTypeDesc, 
                                brand: "OPUS BAY",
                                quantity: 1,
                                price: trx_amt,
                              },
                        ],
                        enabled_payments: [         
                            "credit_card",         
                            "mandiri_clickpay",         
                            "cimb_clicks",         
                            "bca_klikbca",         
                            "bca_klikpay",         
                            "bri_epay",         
                            "echannel",         
                            "permata_va",         
                            "bca_va",         
                            "bni_va",         
                            "other_va",      
                            "danamon_online"     
                        ],
                        credit_card : {
                            "secure": true,
                            "channel": "migs",
                            "bank": "bca",
                            "installment": {
                                "required": false,
                                "terms": {
                                  "bni": [3, 6, 12],
                                  "mandiri": [3, 6, 12],
                                  "cimb": [3],
                                  "bca": [3, 6, 12],
                                  "offline": [6, 12]
                                },
                            }
                        },
                        customer_details: { 
                                first_name: Name, 
                                last_name: "", 
                                email: Email, 
                                phone: Handphone,
                      },
                      custom_field1: "OTS",
                      custom_field2: doc_no
                    }),
                  })
                      .then((response) => response.json())
                      .then((res) => {
                          if (!res.Error) {
                              const token = res.token;
                              const redirecturl = res.redirectUrl
                              this.setState({ tokens: token, redirects : redirecturl });
                            //   alert('abc')
                          } else {
                              this.setState(
                                  { isLoaded: !this.state.isLoaded },() => {
                                      alert(res.Pesan)
                                  }
                              );
                          }
                          console.log("getMidtrans", res);
                      })
                      .catch((error) => {
                          console.log(error);
                        //   alert("Your Order ID has been paid and utilized, please use another Order ID!")
                      })
                : null;
        }
    }

    onPayment(){
        this.setState({ isLoaded: !this.state.isLoaded});
        this.setState({
            isVisible: !this.state.isVisible
        });

        const {
            user_name,
            amounts,
            Typez,
            user_email,
            doc_no,
            hps

        } = this.state;


        const formData = {
            fullname: user_name,
            nohp: hps,
            email_add: user_email,
            nuptypes: Typez,
            amounts: amounts,
            orderid: doc_no
        }

    }


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
            due_date,
            descs,
            status_paid
        } = this.props.myunits;

        // const ordrrd = "AI" + + Math.floor(Math.random() * 100000001);
        console.log('check', descs);

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
                                <Text style={{
                                    color: '#3f3b38',
                                    fontFamily: "Montserrat-Regular",
                                    fontSize: 15,
                                }}>Description : {descs}</Text>
                            </View>
                        </ListItem>
                        <ListItem itemDivider />
                    </List>
                    {/* <View style={Styles.containImageTop}>
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
                            </View> */}

                            {
                                status_paid == 'N' || status_paid == 'O' ?
                                <View style={Styles.overview}>
                                <Button rounded warning full
                                        style={{ marginTop: 16, borderRadius: 10, width: "90%", marginLeft: 20}}
                                        onPress={()=>this.onPayment()}
                                        >
                                        <Text style={{
                                            color: '#3f3b38',
                                            fontFamily: "Montserrat-Regular",
                                            fontSize: 15,
                                        }}>ONLINE PAYMENT</Text>
                                </Button>
                            </View>
                            :
                            <View style={Styles.overview}>
                            <Button rounded warning full
                                    style={{ marginTop: 16, borderRadius: 10, width: "90%", marginLeft: 20}}
                                    disabled={true}
                                    >
                                    <Text style={{
                                        color: '#3f3b38',
                                        fontFamily: "Montserrat-Regular",
                                        fontSize: 15,
                                    }}>ONLINE PAYMENT</Text>
                            </Button>
                         </View>
                            
                            }
                            
                    {/* {!this.state.isLoaded ? <Spinner color="#31C998" /> :null } */}
                </Content>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isVisible}
                    onRequestClose={() => {
                        this.setState({ isVisible: !this.state.isVisible });
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <WebView item={this.state} />
                    </View>
                </Modal>

            </Container>
        );
    }
}
export default OutstandingPayment;