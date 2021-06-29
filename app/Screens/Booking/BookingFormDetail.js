//import liraries
import React, { Component } from 'react';
import {
    StatusBar,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    ScrollView,
    View,
    Alert,
    Modal,
    ActivityIndicator
} from "react-native";
import {
    Container,
    Header,
    Content,
    Button,
    Icon,
    Text,
    Card,
    Picker
} from "native-base";

import { Actions } from "react-native-router-flux";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

import { Fonts, Style, Colors } from "../../Themes";
import Styles from "./myBookingStyle";

//1. import komponen untuk upload foto
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob"
;
import { _storeData, _getData } from '@Component/StoreAsync';
import { urlApi } from '@Config/services';
import numFormat from "@Component/numFormat";
import moment from 'moment';
import WebView from "@Component/WebView";

let isMount = false
// create a component
class BookingFormDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hd: null,
            isLoaded: true,
            isVisible: false,
            
            //state form yanng kepake
            db_profile: [],
            entity_cd: [],
            project_no: [],

            fullname: '',
            nohp: '',
            email_add: '',
            no_ktp: '',
            citys: '',
            nationality_descs: '',
            addresses: '',
            producttp: '',
            nuptp: '',
            amt: '',
            remarks: '',
            orderids: '',
            sttus: '',
            unit_no:'',

          
            pictUrlKTP: '',
            pictUrlNPWP: '',
            pictUrlBuktiTF: '',
            transactionid:''
            
        }

        console.log('props cf', props);
    }


// coba yang ini bang
    async componentDidMount() {
        const userproj = await _getData("@UserProject")
        const items = this.props.nupss;
        isMount = true;
        const data = {

            db_profile: userproj.db_profile,
            entity_cd: userproj.entity_cd,
            project_no: userproj.project_no,
            

            reserve_by: items.reserve_by,
            fullname: items.Name,
            nohp: items.Phone,
            email_add: items.email_addr,
            no_ktp: items.ic_no,
            citys: items.kota,
            nationality_descs: items.nationalitys,
            addresses: items.address1,
            producttp: items.product_types,
            nuptp: items.nup_desc,
            amt: items.amounts,
            pictUrlKTP: items.link_ktp,
            pictUrlNPWP: items.link_npwp,
            pictUrlBuktiTF: items.link_bukti_transfer,
            remarks: items.remark,
            orderids: items.orderid,
            transactionid: items.transactionid,
            sttus: items.sttus,
            unit_no: items.lot_no

        }
        console.log('coba liat data', data);
            this.setState(data, () => { 
                this.getMidtrans();
            });
        console.log('get Props', this.props);

    }

    getMidtrans() {
        const amountt = this.state.amt;
        const cust_email = this.state.email_add;
        const cust_name = this.state.fullname;
        const cust_nohp = this.state.nohp;
        const nup_type_descs = this.state.nuptp;
        const orderids = this.state.orderids;

        {
            isMount
                ? fetch("https://ifca.opus-bay.com/c_midtrans/index", {
                      method: "POST",
                      // method:'POST',
                      body: JSON.stringify({
                          transaction_details: {
                              order_id:
                                  orderids,
                              gross_amount: amountt,
                          },
                          item_details: [
                              {  
                                name: nup_type_descs, 
                                brand: "OPUS BAY",
                                quantity: 1,
                                price: amountt,
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
                                first_name: cust_name, 
                                last_name: "", 
                                email: cust_email, 
                                phone: cust_nohp,
                            },
                            custom_field1: "BKG"
                    }),
                  })
                      .then((response) => response.json())
                      .then((res) => {
                          if (!res.Error) {
                              const token = res.token;
                              const redirecturl = res.redirectUrl
                              this.setState({ tokens: token, redirects : redirecturl });
                          } else {
                              this.setState(
                                  { isLoaded: !this.state.isLoaded },
                                  () => {
                                      // alert(res.Pesan)
                                  }
                              );
                          }
                          console.log("getMidtrans", res);
                      })
                      .catch((error) => {
                          console.log(error);
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
            fullname,
            amt,
            nuptp,
            email_add,
            orderid,
            nohp

        } = this.state;


        const formData = {
            fullname: fullname,
            nohp: nohp,
            email_add: email_add,
            nuptypes: nuptp,
            amounts: amt,
            orderid: orderid
        }

    }


    render() {
        // let { name } = this.state
        // const prevItems = this.props.prevItems;
        const items = this.props.nupss;
        // const bsnnnn = this.state.getLoadData;
        // const bsns = bsnnnn[0].business_id;
        // console.log('check BSNS', bsnnnn);
        const {goBack} = this.props.navigation;

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
                            {"Booking Detail".toUpperCase()}
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
                                <Card style={{
                                    height: null,
                                    backgroundColor: 'white',
                                    shadowOffset: { width: 1, height: 1 },
                                    shadowColor: "#37BEB7",
                                    shadowOpacity: 0.5,
                                    elevation: 5,
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    flex: 1
                                }}>

                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 17,
                                                textAlign: 'left',
                                                color: '#333',
                                                fontWeight: "bold"
                                            }}>
                                                Booking Details
                                    </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, }}>
                                            <Text style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                color: '#333'
                                            }}>
                                                {items.ProjectName}
                                        </Text>
                                        </View>
                                        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                color: '#333'
                                            }}>
                                                {items.Property} | Lantai {items.level_no} | {items.LotNo}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                color: '#333'
                                            }}>
                                                {items.payment_desc} | IDR. {items.amount}
                                            </Text>
                                        </View> */}
                                    </View>
                                </Card>
                            </View>
{/* 
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Reserved By</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    value={this.state.reserve_by} 
                                    editable={false} 
                                />
                            </View> */}
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Full Name</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({fullname : val})}
                                    value={this.state.fullname}
                                    editable={false}  />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Mobile Number</Text>
                                <TextInput 
                                    keyboardType={"number-pad"}
                                    style={Styles.textInput}
                                    onChangeText={val => this.setState({nohp : val})} 
                                    value={this.state.nohp}
                                    editable={false}  />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Email Address</Text>
                                <TextInput 
                                    keyboardType="email-address"
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({email_add : val})} 
                                    value={this.state.email_add}
                                    editable={false}  />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Identity No.</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({no_ktp : val})} 
                                    value={this.state.no_ktp}
                                    editable={false}  />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>City</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({citys : val})} 
                                    value={this.state.citys}
                                    editable={false}  /> 
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Nationality</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({nationality_descs : val})} 
                                    value={this.state.nationality_descs}
                                    editable={false}  /> 
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Your Address</Text>
                                <TextInput
                                    style={Styles.textInput}
                                    multiline={true}
                                    numberOfLines={5}
                                    onChangeText={val => this.setState({addresses : val})} 
                                    value={this.state.addresses}
                                    editable={false} 
                                />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Product Type</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({producttp : val})} 
                                    value={this.state.producttp}
                                    editable={false}  /> 
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Booking Type</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({nuptp : val})} 
                                    value={this.state.nuptp}
                                    editable={false}  /> 
                                
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Amount</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({amt : val})} 
                                    value={numFormat(this.state.amt)}
                                    editable={false}  /> 
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Your Units</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({unit_no : val})} 
                                    value={this.state.unit_no}
                                    editable={false}  /> 
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Your Remarks</Text>
                                <TextInput
                                    style={Styles.textInput}
                                    multiline={true}
                                    numberOfLines={5}
                                    onChangeText={val => this.setState({remarks : val})} 
                                    value={this.state.remarks}
                                    editable={false}
                                />
                                 {this.state.errorremarks ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                 ! Remarks Required
                                    </Text>
                                )
                                :null
                            }
                            </View>
                            <View style={Styles.containImageTop}>
                                <Text 
                                style={[
                                    Style.textBlack, 
                                    {paddingTop: 5}
                                ]}
                                
                                >
                                    Upload Identify Card/Passport
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10
                                    }}
                                    // onPress={() => this.showAlert("pictUrlKTP")}
                                    // pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlKTP == null || this.state.pictUrlKTP =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={{uri: (this.state.pictUrlKTP)}} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.containImageTop}>
                                <Text 
                                style={[
                                    Style.textBlack, 
                                    {paddingTop: 5}
                                ]}
                                
                                >
                                    Upload NPWP
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10,
                                    }}
                                    // onPress={() => this.showAlert("pictUrlNPWP")}
                                    // pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlNPWP == null || this.state.pictUrlNPWP =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={{uri: (this.state.pictUrlNPWP)}} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.containImageTop}>
                                <Text 
                                style={[
                                    Style.textBlack, 
                                    {paddingTop: 5}
                                ]}
                                
                                >
                                    Upload Proof of Payment
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10
                                    }}
                                    // onPress={() => this.showAlert("pictUrlBuktiTF")}
                                    // pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlBuktiTF == null || this.state.pictUrlBuktiTF =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={{uri: (this.state.pictUrlBuktiTF)}} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.overview}>
                                {
                                    this.state.sttus == 'T' ?
                                    <Button rounded warning
                                    style={{ marginTop: 16, borderRadius: 20, width: '100%' }}
                                    onPress={() => {this.onPayment()}}>
                                        
                                    {
                                        !this.state.isLoaded ? (
                                            <ActivityIndicator color="#fff" />
                                        ):(
                                            <Text style={Styles.signInBtnText}>PAYMENT</Text>
                                        )
                                    }
                                   
                                </Button>
                                :
                                <Button rounded warning
                                    style={{ marginTop: 16, borderRadius: 20, width: '100%' }}
                                    disabled={true}>
                                        
                                    {
                                        !this.state.isLoaded ? (
                                            <ActivityIndicator color="#fff" />
                                        ):(
                                            <Text style={Styles.signInBtnText}>PAYMENT</Text>
                                        )
                                    }
                                   
                                </Button>

                                }
                                
                            </View>
                        </ScrollView>
                    </View>

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
export default BookingFormDetail;