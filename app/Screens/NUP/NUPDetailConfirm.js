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
class NUPconfirmPage extends Component {
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
            nuptypes: "",
            productype: "",
            productcd:"",
            order_id: "",
            goTo: "",

            // array
            lotnoz: []
            
        };

        console.log("check props from ADD NUP", props);
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

            fullname: formdata.fullname,
            no_ktp: formdata.no_ktp,
            email_add: formdata.email_add,
            addresses: formdata.addresses,
            mailadd: formdata.mailadd,
            lotnoz: formdata.lotnoz,
            hndphone: formdata.nohp,
            bookedby: formdata.bookedby,
            amts: formdata.amts,
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
            mediaz: formdata.mediaz,
            reasonz: formdata.reasonz,
            rowID: formdata.rowID,
            productype: formdata.productype,
            productcd: formdata.productcd,
            nuptypes: formdata.nuptypes,
            pictUrlKTP: formdata.pictUrlKTP,
            pictUrlNPWP: formdata.pictUrlNPWP,
            pictUrlBuktiTF: formdata.pictUrlBuktiTF,
            order_id: formdata.nuptypes.nup_type.trim()+Math.floor(Math.random() * 1000001),
            goTo: getgoto

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
        const nup_type = this.state.nuptypes.nup_type;
        const nup_type_descs = this.state.nuptypes.descs;
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
                                name: nup_type_descs, 
                                brand: "OPUS BAY",
                                quantity: 1,
                                price: amountt,
                              },
                        ],
                        credit_card : {
                            "secure": true,
                            // "save_card": true,
                        },
                        enabled_payments: [         
                            "credit_card",         
                            "mandiri_clickpay",         
                            "cimb_clicks",         
                            "bca_klikbca",         
                            "bca_klikpay",         
                            "bri_epay",         
                            "echannel",        
                            "bca_va",         
                            "bni_va",         
                            "other_va",      
                            "danamon_online"     
                        ],
                      
                        customer_details: { 
                                first_name: cust_name, 
                                last_name: "", 
                                email: cust_email, 
                                phone: cust_nohp,
                      },
                      
                      custom_field1: "NUP"
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

    checkOut() {

        this.setState({
            isVisible: !this.state.isVisible
        });
        const items = this.props.prevItems;
        const orderids = this.state.order_id;


        const {
            name,
            fullname,
            hndphone,
            email_add,
            no_ktp,
            citys,
            nationality_descs,
            addresses,
            amounts,
            remarks,
            userID,
            entitys,
            projects,
            nuptypes,
            rowID,
            business_id,
            towerd,
            Group_cd,
            mailadd,
            reasonz,
            mediaz,
            lotnoz,
            pictUrlKTP,
            pictUrlBuktiTF,
            pictUrlNPWP,
            amts,
            productcd,
            productype
            
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
            productype: productype,
            productcd: productcd,
            nuptypes: nuptypes,
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
            mediaz: mediaz,
            reasonz: reasonz,
            lotnoz: lotnoz,
            order_id: orderids,
            // nup_type_descs: nup_type_descs,

            pictUrlKTP: pictUrlKTP,
            pictUrlNPWP: pictUrlNPWP,
            pictUrlBuktiTF: pictUrlBuktiTF,
        }

            let fileNameKtp = pictUrlKTP;
            let fileNameNpwp = pictUrlNPWP;
            let fileNameBuktiTf = pictUrlBuktiTF;

            console.log('_getDataSaveNUP', formData);
            // if (isValid) {
                // console.log('ttes');
                RNFetchBlob.fetch(
                    "POST",
                    urlApi + "c_nups/saveNUP/"+items.db_profile,
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
                        // const res = JSON.stringify(resp.data);
                        // const res = JSON.parse(JSON.stringify(resp.data));
                        console.log("get __formData", res);
                        console.log(res.Pesan);
                        if (!res.Error) {
                            this.setState({ isLogin: true}, () => {
                                alert(res.Pesan);
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
                            {"Check Out NUP".toUpperCase()}
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
                                                NUP Payment Details
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
                                                NUP Type
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
                                                {formdatas.nuptypes.descs}
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
export default NUPconfirmPage;
