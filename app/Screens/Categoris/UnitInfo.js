//import liraries
import React, { Component } from "react";
import {
  StatusBar,
  StyleSheet,
  Image,
  ScrollView,
  View,
  Modal,
  Dimensions,
  Linking,
  Alert,
  FlatList,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  Body,
  Input,
  Item,
  Form,
  Label,
  Card,
  ListItem,
  Left,
  Right,
} from "native-base";

// import { Card } from "@paraboly/react-native-card";

import { Actions } from "react-native-router-flux";

import { Fonts, Style, Colors } from "../../Themes";

import Styles from "./Style";
import numFormat from "@Component/numFormat";
import numPersen from "@Component/numPersen";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config/services";
import Mailer from "react-native-mail";
let isMount = false;
// create a component
class UnitInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hd: null,
      price: [],
      isVisible: false,
      isHide: false,
      getloads: [],
      gallery: [],
      getpaydet: [],

      property_cd: "",
      payment_cd: "",
      Group_cd: "",
      // dashmenu: [],
      bookpage: [],
      unitpage: [],
      payments: [],
      dataDetailPayment: [],
      kirimdatadetail: [],
      descs: ""
    };
    console.log("getProps", props);
  }

  async componentDidMount() {
    isMount = true;
    // const getprice = await _getData("@getprice");
    const dashmenu = await _getData("@DashMenu");
    const coba = this.state.price;

    const data = {
      hd: new Headers({
        Token: await _getData("@Token"),
      }),
      email: await _getData("@User"),
      userId: await _getData("@UserId"),
      name: await _getData("@Name"),
      handphone: await _getData("@Handphone"),
      Group_cd: await _getData("@Group"),
      descs:
        // "I'm interested about reservation " +
        // this.props.prevItems.project_descs +
        // " for No. Unit " +
        // this.props.items.lot_no +
        // "\n\n Contact me for the details information.",
        "I'm interested for No. Unit " +
        this.props.items.lot_no +
        "\n\n Contact me for the details information.",
      bookpage: dashmenu[1].URL,
      unitpage: dashmenu[2].URL,
      pm_cd: coba.payment_cd,
    };

    this.setState(data, () => {
      this.getPrice();
      // this.getPayDetail();
      this.getLoad();
      this.getGallery();
      this.getUserEmail();
      this.getPayments();
    });
    // console.log('get _paymentCD', data.pm_cd);
  }

  clickBooking({ item, data }) {
    console.log("item click booking", item);
    console.log("data click booking", data);

    if (item.status == "A") {
      Actions.BookingPage({
        datas: data,
        items: item,
        prevItems: this.props.prevItems,
        unitItems: this.props.unitItems,
        theItems: this.props.items,
        theTems: this.props.theItems,
      });
    }
  }

  getPrice = () => {
    const item = this.props.items;
    const items = this.props.prevItems;

    lot_nos = item.lot_no;
    data = JSON.stringify(lot_nos);
    const lotnos = lot_nos.replace("/", "__");
    console.log("lot_no", lotnos);

    {
      isMount
        ? fetch(
            urlApi +
              "c_booking/getPrice/" +
              items.db_profile +
              "/" +
              items.entity_cd +
              "/" +
              items.project_no +
              "/" +
              lotnos,

            {
              method: "POST",
              headers: this.state.hd,
            }
          )
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data[0];
                const resDataDetail = res.DataDetail;
                console.log("resDataDetail", resDataDetail);
                this.setState({
                  price: resData,
                  isLoaded: true,
                  dataDetailPayment: resDataDetail,
                });
                _storeData("@getprice", resData);
                // this.getPayDetail(res);
              }
              console.log("getPrice", res);
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  };

  getPayDetail = (res) => {
    // let result = res.Data;
    // // console.log("result payment code", result);
    // //   var myStringArray = ["Hello", "World"];
    // // var arrayLength = result.length;
    // // for (var i = 0; i < arrayLength; i++) {
    // //   console.log(result[i]);
    // //   //Do something
    // // //   console.log("looping payment cd", result[i].payment_cd);
    // //   var getpaymentcds = result[i].payment_cd;
    // //   console.log("looping payment cd", getpaymentcds);
    // // }

    // result.forEach((datas) => {
    //   console.log("datas", datas);
    //   if (datas) {
    //     getpaymentcds = datas.payment_cd;
    //   }
    //     console.log("looping", getpaymentcds);

    // });

    // const getpaymentcds = this.state.tes;
    // const getpaymentcds = result.payment_cd;
    // console.log("result payment code", getpaymentcds);
    const item = this.props.items;
    const items = this.props.prevItems;
    lot_nos = item.lot_no;
    data = JSON.stringify(lot_nos);
    const lotnos = lot_nos.replace("/", "__");

    // console.log('lot_no', lotnos);
    // console.log('cobaliat _getPaymentcds', getpaymentcds);

    {
      isMount
        ? fetch(
            urlApi +
              "c_booking/getprice/" +
              items.db_profile +
              "/" +
              items.entity_cd +
              "/" +
              items.project_no +
              "/" +
              lotnos +
              "/" +
              getpaymentcds,
            {
              method: "POST",
              //   body: JSON.stringify({payment_cd})
            }
          )
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({ getpaydet: resData, isLoaded: true });
              }
              console.log("getLoads", res);
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  };

  getPayments = () => {
    const item = this.props.items;
    const items = this.props.prevItems;

    lot_nos = item.lot_no;
    data = JSON.stringify(lot_nos);
    const lotnos = lot_nos.replace("/", "__");
    console.log("lot_no", lotnos);

    {
      isMount
        ? fetch(
            urlApi +
              "c_booking/getPrice/" +
              items.db_profile +
              "/" +
              items.entity_cd +
              "/" +
              items.project_no +
              "/" +
              lotnos,

            {
              method: "POST",
              headers: this.state.hd,
            }
          )
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({ payments: resData, isLoaded: true });
                //   _storeData("@getprice",resData);
                // this.getPayDetail(res);
              }
              console.log("getPayments", res);
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  };

  getLoad = () => {
    const item = this.props.items;
    const items = this.props.prevItems;
    let lot_nos = item.lot_no;
    const data = JSON.stringify(lot_nos);
    const lotnos = lot_nos.replace("/", "__");

    {
      isMount
        ? fetch(
            urlApi +
              "c_booking/getInfo/" +
              items.db_profile +
              "/" +
              items.entity_cd +
              "/" +
              items.project_no +
              "/" +
              items.tower +
              "/" +
              item.level_no +
              "/" +
              lotnos,
            {
              method: "GET",
              headers: this.state.hd,
              //   body: {name: "data", data : lot_nos}
              // body: data
            }
          )
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data[0];
                this.setState({ getloads: resData });
              }
              console.log("getLoadz", res);
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  };

  getGallery = () => {
    const item = this.props.prevItems;
    const theitemz = this.props.items;
    const lot_type = this.props.getUnit;
    {
      isMount
        ? fetch(
            urlApi +
              "c_product_info/getGallery/" +
              item.db_profile +
              "/" +
              item.entity_cd +
              "/" +
              item.project_no +
              "/" +
              theitemz.lot_type,
            {
              method: "GET",
              headers: this.state.hd,
            }
          )
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({ gallery: resData });
              } else {
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                  alert(res.Pesan);
                });
              }
              console.log("getBlok", res);
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  };

  getUserEmail() {
    const { db_profile, entity_cd, project_no } = this.props.prevItems;
    fetch(
      urlApi +
        "c_product_info/userEmail/" +
        db_profile +
        "/" +
        entity_cd +
        "/" +
        project_no,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((res) => {
        if (!res.Error) {
          const emails = res.Data[0].email_add;
          const wassaf = res.Data[0].wa_no;
          this.setState({ dataEmail: emails, dataWassaf: wassaf });
          console.log("get _dataEmail", emails);
          console.log("get _dataWassaf", wassaf);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sendWa() {
    const noHp = this.state.dataWassaf;
    const descs = this.props.prevItems.project_descs;
    // const descs = this.state.descs;
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
    const nounit = this.props.items.lot_no;
    const message = "I'm interested about reservation " + descs + '\n\n Name : ' + name + '\n Email : ' + email + '\n Phone Number : ' + nohps + '\n Choice of Unit : ' + nounit + '\n\n Contact me for the details information.';
  
    // Linking.openURL("https://wa.me/+" + noHp + "?text=" + descs);
    Linking.openURL('whatsapp://send?text=' + message + '&phone=+' + noHp);
  }

  sendEmail() {
    const email_add = this.state.dataEmail;
    const descs = this.props.prevItems.project_descs;
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

    const nounit = this.props.items.lot_no;
    const message = "<!DOCTYPE html> <meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'> <body> <div>  Name : " + name + 
                '<br> Email : ' + email + '<br> Phone Number : ' + nohps + '<br> Choice of Unit : ' + 
                nounit + '<br><br> Contact me for the details information. </div> </body> </html>';


    // alert(email_add);
    console.log("getdesc", descs);
    console.log("email send add", email_add);
    Mailer.mail(
      {
        subject: "I'm interested about reservation " + descs,
        recipients: [`${email_add}`],
        ccRecipients: [""],
        bccRecipients: [""],
        body: message,
        isHTML: true,
      },
      (error, event) => {
        Alert.alert(
          error,
          event,
          [
            {
              text: "Ok",
              onPress: () => console.log("OK: Email Error Response"),
            },
            {
              text: "Cancel",
              onPress: () => console.log("CANCEL: Email Error Response"),
            },
          ],
          { cancelable: true }
        );
      }
    );
  }

  lapsList() {
    return this.state.dataDetailPayment.map((data, key) => {
      return (
        <View key={key}>
          <Text>{data.dtl_payment_descs}</Text>
        </View>
      );
    });
  }

  render() {
    const item = this.props.items;
    const prevItems = this.props.prevItems;
    const getURL = this.props.goToItems.URL;
    const getGroup = this.state.Group_cd;
    const getRoutes = this.props.routes;

    console.log("check getURL", getURL);
    console.log("check getGroup", getGroup);

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
            <Text style={Style.actionBarText}>{"Unit Info".toUpperCase()}</Text>
          </View>
          <View style={Style.actionBarRight}></View>
        </Header>

        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
          {/* <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            scrollEventThrottle={0}
            pagingEnabled
            alwaysBounceHorizontal
            style={{ height: 340 }}
          > */}
            <View>
            {this.state.gallery.length !== 0
              ? this.state.gallery.map((item, key) => (
                  <Image
                    key={key}
                    source={{ uri: item.gallery_url }}
                    style={{
                      width: Dimensions.get("window").width,
                      height: 234,
                      resizeMode: "contain",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 0,
                    }}
                  />
                ))
              : null}
              </View>
          {/* </ScrollView> */}

          <Text
            style={{
              fontSize: 20,
              paddingTop: 16,
              marginLeft: 16,
              justifyContent: "center",
              alignItems: "center",
              fontFamily: Fonts.type.sfuiDisplayBold,
            }}
          >
            {prevItems.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              marginLeft: 16,
              fontFamily: Fonts.type.sfuiDisplayBold,
            }}
          >
            <Text>{prevItems.towerDescs} | </Text>
            <Text>Lantai {item.level_no} | </Text>
            <Text style={{ color: "red" }}>{item.lot_no}</Text>
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginLeft: 16,
              fontFamily: Fonts.type.sfuiDisplayBold,
            }}
          >
            {item.descs}
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginLeft: 16,
              fontFamily: Fonts.type.sfuiDisplayBold,
            }}
          >
            {/* {this.state.getloads.land_area} */}
            {this.state.getloads.land_area} {this.state.getloads.area_uom}
          </Text>

          {/* {(this.state.Group_cd != "Guest" && getURL == "UnitEnquiryPage") ||
          (getURL == "FindUnitPage" && this.state.Group_cd != "Guest") ? ( */}
          {(this.state.Group_cd == "INHOUSE" && getURL == "FindUnitPage") || 
          (getURL == "FindUnitPage" && this.state.Group_cd == "AGENT") 
         ? (
            <View>
              <View style={styles.lineStyle} />

              <Text
                style={{
                  fontSize: 15,
                  paddingTop: 16,
                  marginLeft: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  fontFamily: Fonts.type.sfuiDisplayBold,
                }}
              >
                PAYMENT DETAILS
              </Text>

              <View style={styles.containersLooping}>
                {this.state.payments.map((data, key) => (
                  <View key={key} style={styles.containers}>
                    <View style={styles.itemLeft}>
                      <Text
                        style={{
                          fontSize: 13,
                          marginLeft: 16,
                          fontFamily: Fonts.type.sfuiDisplayBold,
                        }}
                      >
                        {data.descs}
                      </Text>
                    </View>
                    <View style={styles.itemIdr}>
                      <Text
                        style={{
                          fontSize: 13,
                          marginLeft: 16,
                          fontFamily: Fonts.type.sfuiDisplayBold,
                          textAlign: "right",
                        }}
                      >
                        IDR.
                      </Text>
                    </View>
                    <View style={styles.itemRight}>
                      <Text
                        style={{
                          fontSize: 12,
                          marginLeft: 15,
                          fontFamily: Fonts.type.sfuiDisplayBold,
                          textAlign: "right",
                          marginRight: 18,
                        }}
                      >
                        {data.trx_amt}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (this.state.Group_cd == "INHOUSE"  && getURL == "BookingPage") || 
          (this.state.Group_cd == "AGENT"  && getURL == "BookingPage") ? (
            <View>
              <View style={styles.lineStyle} />

              <Text
                style={{
                  fontSize: 15,
                  paddingTop: 16,
                  marginLeft: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  fontFamily: Fonts.type.sfuiDisplayBold,
                }}
              >
                PAYMENT DETAILS
              </Text>
              {this.state.payments.map((data, key) => (
                <View key={key} style={[styles.containers, { paddingTop: 10 }]}>
                  <View style={styles.itemLeftPlan2}>
                    <Text
                      style={{
                        fontSize: 13,
                        marginLeft: 16,
                        fontFamily: Fonts.type.sfuiDisplayBold,
                      }}
                    >
                      Payment Plan
                    </Text>
                  </View>
                  <View style={styles.itemRightPlan2}>
                    <Text
                      style={{
                        width: "100%",
                        paddingRight: 16,
                        textAlign: "right",

                        color: Colors.redWine,
                        fontSize: 13,
                        //   marginLeft: 16,
                        fontFamily: Fonts.type.sfuiDisplayBold,
                      }}
                    >
                      {data.descs}
                    </Text>
                  </View>

                  <View style={styles.itemLeftPlan2}>
                    <Text
                      style={{
                        fontSize: 13,
                        marginLeft: 16,
                        fontFamily: Fonts.type.sfuiDisplayBold,
                      }}
                    >
                      Sell Price
                    </Text>
                  </View>

                  <View style={styles.itemRightPlan2}>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      {/* <Text>Idr.</Text> */}
                      <Text
                        style={{
                          width: "54%",
                          paddingRight: 16,
                          textAlign: "right",

                          color: Colors.redWine,
                          fontSize: 13,
                          //   marginLeft: 16,
                          fontFamily: Fonts.type.sfuiDisplayBold,
                        }}
                      >
                        IDR{" "}
                      </Text>
                      <Text
                        style={{
                          width: "46%",
                          paddingRight: 16,
                          textAlign: "right",

                          color: Colors.redWine,
                          fontSize: 13,
                          //   marginLeft: 16,
                          fontFamily: Fonts.type.sfuiDisplayBold,
                        }}
                      >
                        {data.trx_amt}
                      </Text>
                    </View>
                  </View>

                  {this.state.dataDetailPayment.map((data2, key2) =>
                    data.payment_cd == data2.dtl_payment_cd ? (
                      <ListItem key={key2}>
                        <View
                          style={{
                            flexDirection: "column",
                            width: "100%",
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              paddingBottom: 5,
                              paddingTop: 5,
                            }}
                          >
                            <View
                              style={{
                                position: "absolute",
                                width: "50%",
                              }}
                            >
                              <Text
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  fontSize: 13,
                                  fontFamily: Fonts.type.sfuiDisplayRegular,
                                }}
                              >
                                {data2.dtl_payment_descs}
                              </Text>
                            </View>
                            <View
                              style={{
                                position: "absolute",
                                width: "100%",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  width: "100%",
                                  paddingRight: 20,
                                }}
                              >
                                <Text
                                  style={{
                                    width: "70%",
                                    fontSize: 13,
                                    textAlign: "right",
                                    fontFamily: Fonts.type.sfuiDisplayRegular,
                                  }}
                                >
                                  Rp.
                                </Text>
                                <Text
                                  style={{
                                    width: "40%",
                                    paddingRight: 15,
                                    fontSize: 13,
                                    textAlign: "right",
                                    fontFamily: Fonts.type.sfuiDisplayRegular,
                                  }}
                                >
                                  {data2.dtl_trx_amt}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </ListItem>
                      
                    ) : null
                  )}

                  <View
                    style={{
                      width: "100%",
                      // backgroundColor: 'black'
                    }}
                  >
                    { (getGroup == "INHOUSE" && getURL == "BookingPage") || 
                    (this.state.Group_cd == "AGENT"  && getURL == "BookingPage") ? 
                      <Button
                        // rounded
                        // full
                        style={{
                          backgroundColor: "#906c48",
                          marginTop: 20,
                          alignSelf: "center",
                          // alignContent: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 40,
                          borderRadius: 5,
                          //   backgroundColor: Colors.headerOrange,
                          // width: "50%",
                        }}
                        onPress={() => {
                          this.clickBooking({ item, data });
                        }}
                      >
                        <Text
                          style={{ fontFamily: Fonts.type.sfuiDisplaySemibold }}
                        >
                          Booking {data.descs} now
                        </Text>
                      </Button>
                     : 
                    <Button
                        rounded
                        full
                        style={{ backgroundColor: "#906c48" }}
                        onPress={() => {
                          this.setState({ isVisible: true });
                        }}
                      >
                        <Text>Reserve Now</Text>
                      </Button>
                      }
                    <View style={styles.lineStyle} />
                  </View>
                </View>
              ))}
            </View>
             ) 
            : null
   
             
             }

        </Content>
        {
        (this.state.Group_cd == "Guest") ||
             (getURL == "FindUnitPage" && this.state.Group_cd == "DEBTOR") ?
   
               <Button
                           rounded
                           full
                           style={{ backgroundColor: "#906c48" }}
                           onPress={() => {
                             this.setState({ isVisible: true });
                           }}
                         >
                           {/* <Text>Reserve Now</Text> */}
                           <Text>I'm Interested</Text>
                   </Button>

            : null
        }

        
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.isVisible}
          onRequestClose={() => {
            console.log("Modal has been closed.");
          }}
        >
          <Header style={Style.navigationModal}>
            <StatusBar
              backgroundColor={Colors.brownTuansing}
              animated
              barStyle="light-content"
            />
            <View style={Style.actionBarLeft}></View>
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
                  this.setState({
                    isVisible: !this.state.isVisible,
                  });
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
          <ScrollView>
            <Form>
              <Item floatingLabel>
                <Label>Your name</Label>
                <Input
                  value={this.state.name}
                  onChangeText={(val) => this.setState({ name: val })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Handphone</Label>
                <Input
                  value={this.state.handphone}
                  onChangeText={(val) => this.setState({ handphone: val })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Description</Label>
                <Input
                  multiline
                  value={this.state.descs}
                  onChangeText={(val) => this.setState({ descs: val })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Reference Email</Label>
                <Input
                  value={this.state.refEmail}
                  onChangeText={(val) => this.setState({ refEmail: val })}
                />
              </Item>
              <Body style={{ paddingVertical: 32 }}>
                <Button
                  rounded
                  success
                  full
                  style={{ marginTop: 16 }}
                  onPress={() => this.sendEmail()}
                >
                  <Text>Send Email</Text>
                </Button>
                <Button
                  rounded
                  warning
                  iconRight
                  full
                  style={{ marginTop: 16 }}
                  onPress={() => this.sendWa()}
                >
                  <Text>Send via WhatsApp</Text>
                  <Icon name="whatsapp" type="FontAwesome5" />
                </Button>
              </Body>
            </Form>
          </ScrollView>
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
    // paddingBottom: 30
    backgroundColor: "#000000",
  },
  buttonPalingBawah: {
    flex: 1,
    marginLeft: 18,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: "black",
    margin: 10,
  },
  containers: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start", // if you want to fill rows left to right
    width: "100%",
  },
  containersLooping: {
    marginBottom: 40,
  },
  itemLeft: {
    width: "50%", // is 50% of container width
  },
  itemLeftPlan: {
    width: "61%", // is 50% of container width
  },
  itemIdr: {
    width: "15%",
  },
  itemRight: {
    width: "35%", // is 50% of container width
  },
  itemRightPlan: {
    width: "35%", // is 50% of container width
  },
  itemRightPlan2: {
    width: "65%", // is 50% of container width
  },
  itemLeftPlan2: {
    width: "35%", // is 50% of container width
  },
});

//make this component available to the app
export default UnitInfo;