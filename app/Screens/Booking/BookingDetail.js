//import liraries
import React, { Component } from "react";
import {
    StatusBar,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    ScrollView,
    View,
    Alert,
    ActivityIndicator,
    Modal,
} from "react-native";
import {
    Container,
    Header,
    Content,
    Button,
    Icon,
    Text,
    Card,
    Picker,
} from "native-base";

import { Actions } from "react-native-router-flux";
import ParallaxScroll from "@monterosa/react-native-parallax-scroll";

import { Fonts, Style, Colors } from "../../Themes";
import Styles from "./Style";

//1. import komponen untuk upload foto
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config/services";
import numFormat from "@Component/numFormat";
import moment from "moment";
import WebView from "@Component/WebView";

let isMount = false;
// create a component
const popRoot = () => {
    Actions.popTo('unitinfo');
    setTimeout(() => Actions.refresh())
        
}
class BookingDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hd: null,
            isLoaded: true,
            isVisible: false,

            email: "",
            name: "",
            no_hp: "",
            token:"",
            userID: "",
            Group_cd: "",
            agent_cd: "",
            entity: "",
            project: "",
            towers: "",

            fullname: "",
            email_add: "",
            addresses: "",
            mailadd: "",
            hndphone: "",
            bookedby: "",
            amts: "",
            amounts: "",
            citys: "",
            nationality_descs: "",
            remarks: "",
            userID: "",
            entitys: "",
            projects: "",
            business_id: "",
            Group_cd: "",
            towerd: "",
            mediaz: "",
            reasonz: "",
            rowID: "",
            pictUrlKTP: "",
            pictUrlNPWP: "",
            pictUrlBuktiTF: "",
            no_ktp: "",

            tokens: "",
            redirects: "",
            city: "",
            entityz: "",
            book_type: "",
            prodtype: "",
            productcd:"",
            order_id: "",
            goTo: "",

            // array
            lotNo: "",
            sell_price: "",
            refcode: "",
            prodtype: "",
            productcd: "",
            towerd: "",
            phase_cd:"",
            refmemberID:"",
            res_json:"",
            payment_cds: "",
            productype:"",
            cons: "",
            allrefcode: ""
            
        };

        console.log("check props from FORM BOOKING", props);
    }

    async componentDidMount() {
        const prevItems = this.props.prevItems;
        const formdata = this.props.cekform;
        const getgoto = this.props.goTo;
        isMount = true;
        const data = {
            email: await _getData("@User"),
            name: await _getData("@Name"),
            no_hp: await _getData("@Handphone"),
            token: await _getData("@Token"),
            userId: await _getData("@UserId"),
            Group_cd: await _getData("@Group"),
            agent_cd: await _getData("@AgentCd"),

            entity: prevItems.entity_cd,
            project: prevItems.project_no,
            towers: prevItems.towerDescs,

            bookedby: formdata.bookedby,
            fullname: formdata.fullname,
            no_ktp: formdata.no_ktp,
            email_add: formdata.email_add,
            addresses: formdata.addresses,
            mailadd: formdata.mailadd,
            lotNo: formdata.lotNo,
            hndphone: formdata.nohp,
            amounts: formdata.amounts,
            citys: formdata.citys,
            nationality_descs: formdata.nationality_descs,
            remarks: formdata.remarks,
            userID: formdata.userID,
            entitys: formdata.entitys,
            projects: formdata.projects,
            business_id: formdata.business_id,
            Group_cd: formdata.Group_cd,
            towerd: formdata.towerd,
            rowID: formdata.rowID,
            prodtype: formdata.prodtype,
            productcd: formdata.productcd,
            book_type: formdata.book_type,
            sell_price: formdata.sell_price,
            refcode: formdata.refcode,

            pictUrlKTP: formdata.pictUrlKTP,
            pictUrlNPWP: formdata.pictUrlNPWP,
            pictUrlBuktiTF: formdata.pictUrlBuktiTF,
            phase_cd: formdata.phase_cd,
            order_id: formdata.order_id,
            refmemberID: formdata.refmemberID,
            res_json: formdata.res_json,
            goTo: getgoto,
            payment_cds: formdata.payment_cds,
            cons: formdata.cons,
            allrefcode: formdata.allrefcode

        };

        this.setState(data, () => {

            this.getMidtrans();
        });


    }

    // --------------------- START FUNCTION --------------------- //

    getMidtrans() {
        const amountt = this.state.amounts[0].value;
        const cust_email = this.state.email_add;
        const cust_name = this.state.fullname;
        const cust_nohp = this.state.hndphone;
        const book_type = this.state.book_type[0].nup_type;
        const book_type_descs = this.state.book_type[0].descs;
        const orderids = this.state.order_id;
        // const order_id = nup_type.trim()+Math.floor(100000+Math.random()*900000);
        // const order_id = nup_type.trim()+Math.round((new Date()).getTime() / 10000000);
        // const order_id = nup_type.trim()+Math.floor(Math.random() * 1000001);
        



        console.log('chheckkk amountt', amountt);

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
                                name: book_type_descs, 
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

    getRedeemCode = getallreferal => {
        let result = getallreferal;
        console.log('get result', result);
        // let result = res.data;
        const ref_code = result.referralCode;
        const refmemberID = result.memberID;
        const {
          fullname
        } = this.state;
        const ref_name = fullname;
        const today = this.state.current_date; 
        const formt = "DD/MM/YYYY HH:mm:ss";
        const datetm = moment(today).format(formt);
        const order_id = this.state.order_id;
    
        console.log('check orderid on redeemcode', order_id);
        console.log('getRefCode', ref_code);
        console.log('get datetime', datetm);
    
        {
          isMount
            ? fetch(
                "https://staging-cmsapi-tsh.synectics.digital/api/redeem-referral",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "api-key": "ckCmflViJgFGt1VCaNssdBp8NWKpTUhn",
                  },
                  body: JSON.stringify({
                    referralCode: ref_code,
                    refereeName: ref_name,
                    refereeMemberID: refmemberID,
                    TrxRef: order_id,
                    PropertyName:"Opus Bay",
                    PropertyCode:"OB01",
                    datetime: datetm
                  })
                }
              )
                .then((response) => response.json())
                .then((res) => {
                  console.log("getRedCode", res);
                  if (!res.Error) {
                    const resDataValid = res.data;
                    const resDataError = res.error;
                    const resData = res;
                    this.setState({ redcodeValid: resDataValid, redcodeError: resDataError, redcode: resData });
                    if (res.status == 'ok') {
                      console.log("voucher status = ", res.data.voucherStatus);
                    }else{
                      console.log("voucher status = ", res.error.voucherStatus);
                    }
                    console.log('resData', resData);
                    
                  } else {
                    this.setState({ isLoaded: !this.state.isLoaded }, () => {
                      // alert(res.Pesan)
                      alert("Voucher Status : " + res.error.voucherStatus);
                    });
                  }
                })
                .catch((error) => {
                  console.log(error);
                })
            : null;
        }
      }

    checkOut() {

        this.setState({
            isVisible: !this.state.isVisible
        });
        const items = this.props.prevItems;
        const orderids = this.state.order_id;
        const getallreferal = this.state.allrefcode;


        const {
            name,
            fullname,
            no_hp,
            email_add,
            no_ktp,
            citys,
            nationality_descs,
            addresses,
            amounts,
            remarks,
            userID,
            rowID,
            business_id,
            sell_price,
            Group_cd,
            mailadd,
            phase_cd,
            refcode,
            pictUrlKTP,
            pictUrlBuktiTF,
            pictUrlNPWP,
            productcd,
            productype,
            book_type,
            lotNo,
            entitys,
            projects,
            towerd,
            refmemberID,
            res_json,
            payment_cds,
            prodtype,
            cons,
            hndphone
        } = this.state;

        const formData = {
            bookedby: name,
            fullname: fullname,
            nohp: hndphone,
            email_add: email_add,
            no_ktp: no_ktp,
            citys: citys,
            nationality_descs: nationality_descs,
            addresses: addresses,
            prodtype: prodtype,
            productcd: productcd,
            book_type: book_type,
            amounts: amounts,
            remarks: remarks,
            userID: userID,
            mailadd: mailadd,
            entitys: entitys,
            projects: projects,
            rowID: rowID,
            business_id: business_id,
            Group_cd: Group_cd,
            towerd: towerd,
            lotNo: lotNo,
            order_id: orderids,
            refcode: refcode,
            phase_cd: phase_cd,
            sell_price: sell_price,
            refmemberID: refmemberID,
            res_json: res_json,
            payment_cds: payment_cds,
            cons: cons,
            
            pictUrlKTP: pictUrlKTP,
            pictUrlNPWP: pictUrlNPWP,
            pictUrlBuktiTF: pictUrlBuktiTF,
        }

            let fileNameKtp = pictUrlKTP;
            let fileNameNpwp = pictUrlNPWP;
            let fileNameBuktiTf = pictUrlBuktiTF;

            console.log('_getDataSaveBooking', formData);
            this.setState({
                isLoaded: true
            });
                RNFetchBlob.fetch(
                    "POST",
                    urlApi + "c_booking/saveBooking_OP/"+items.db_profile,
                    {
                        "Content-Type": "multipart/form-data"
                    },
                    [
                        {name: "photoktp", filename: fileNameKtp, data: pictUrlKTP},
                        {name: "photonpwp", filename: fileNameNpwp, data: pictUrlNPWP},
                        {name: "photobuktitf", filename: fileNameBuktiTf, data: pictUrlBuktiTF},
                        {name: "data", data: JSON.stringify(formData)}
                    ]
                )
                .then(resp =>{
                    console.log("res_if", resp);
                    const res = JSON.parse(resp.data);
                    console.log("get __formData", res);
                    console.log(res.Pesan);
                    if (!res.Error) {
                        this.setState({ isLogin: true}, () => {
                            

                            if (getallreferal == null || getallreferal == 'undefined' || getallreferal.length == 0 ) {
                                alert(res.Pesan);
                            }else{
                                alert(res.Pesan);
                                this.getRedeemCode(getallreferal.data);
                            }
                            
                            // Actions.pop({
                                // prevItems: this.props.prevItems,
                                // gotoTheItem: this.props.gotoTheItem,
                                // item: this.props.theTems
                            // });
                            // Actions.refresh({onBack:()=>this.goBacktoUnit()})
                        });
                        
                    }else{
                        this.setState({ isLoaded: !this.state.isLoaded }, () => {
                            alert(res.Pesan);
                        });
                    }
                });
            // }else{
            //     alert("Please complete the form!");
            // }
    };


    // --------------------- END FUNCTION --------------------- //

    render() {
        let { name } = this.state;
        const prevItems = this.props.prevItems;
        const formdatas = this.props.cekform;

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
                            onPress={popRoot}
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
                            {"Check Out Booking".toUpperCase()}
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
                            <View style={Styles.overviewCard}>
                                <Card
                                    style={{
                                        height: null,
                                        backgroundColor: "white",
                                        shadowOffset: { width: 1, height: 1 },
                                        shadowColor: "#37BEB7",
                                        shadowOpacity: 0.5,
                                        elevation: 5,
                                        paddingHorizontal: 20,
                                        paddingVertical: 20,
                                        borderRadius: 20,
                                        flex: 1,
                                    }}
                                >
                                    <View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 17,
                                                    textAlign: "left",
                                                    color: "#333",
                                                    // fontWeight: "bold",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                Booking Payment Details
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                paddingTop: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                {prevItems.title}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                {prevItems.product_descs}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                {prevItems.towerDescs} {"\n"}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                Order ID
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                {this.state.order_id}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                Agent Name
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                {formdatas.bookedby}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                Buyer Name
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                {formdatas.fullname}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                Booking Type
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                {formdatas.book_type[0].descs}
                                            </Text>
                                        </View>
                                        
                                                {/* <View
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        // fontWeight: '500',
                                                        textAlign: "left",
                                                        color: "#333",
                                                        fontFamily:
                                                            Fonts.type
                                                                .sfuiDisplaySemibold,
                                                    }}
                                                >
                                                    Units
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        // fontWeight: '500',
                                                        textAlign: "left",
                                                        color: "#333",
                                                        fontFamily:
                                                            Fonts.type
                                                                .sfuiDisplaySemibold,
                                                    }}
                                                >
                                              
                                                </Text>
                                            </View> */}

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginTop: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                Price
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    // fontWeight: '500',
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontFamily:
                                                        Fonts.type
                                                            .sfuiDisplaySemibold,
                                                }}
                                            >
                                                IDR{" "}
                                                <Text
                                                    style={{
                                                        fontSize: 15,
                                                        textAlign: "left",
                                                        color: "#32CD32",
                                                        fontFamily:
                                                            Fonts.type
                                                                .sfuiDisplaySemibold,
                                                    }}
                                                >
                                                    {" "}
                                                    {formdatas.amounts[0].label}{" "}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                                <View style={Styles.overview}>
                                    <Button
                                        rounded
                                        warning
                                        full
                                        style={{
                                            marginTop: 16,
                                            borderRadius: 30,
                                        }}
                                        onPress={() => {
                                            this.checkOut()
                                        }}
                                    >
                                        {!this.state.isLoaded ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <Text
                                                style={Styles.checkoutBtnText}
                                            >
                                                CHECK OUT
                                            </Text>
                                        )}
                                    </Button>
                                </View>
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
        backgroundColor: "#2c3e50",
    },
    buttonUpload: {
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        height: 80,
    },
});

//make this component available to the app
export default BookingDetail;