import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
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
  Row,
} from "native-base";
import { Style, Colors } from "../../Themes";
import Styles from "./Style";
import { Actions } from "react-native-router-flux";
import moment from "moment";
import numFormat from "@Component/numFormat";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config/services";

class MyUnitDetailPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      units: [],
      rowid: "",
      rowID: "",

      isLoaded: false,
      user: [],
      // cons: ''
    };

    console.log("get _props unit details", props);
  }

  async componentDidMount() {
    isMount = true;
    const data = {
      hd: new Headers({
        Token: await _getData("@Token"),
      }),
      email: await _getData("@User"),
      name: await _getData("@UserId"),
      user: await _getData("@UserProject"),
    };

    this.setState(data, () => {
      this.getUnitDetail();
    });
  }

  getUnitDetail = () => {
    const { LotNo, entity_cd, project_no, debtor_acct } = this.props.unit;
    const { user } = this.state;
    const cons = user.db_profile;

    {
      isMount
        ? // fetch(urlApi+'c_myunits/myUnitDetail/'+cons+'/'+entity_cd.trim()+'/'+project_no.trim()+'/'+debtor_acct,{
          fetch(
            urlApi +
              "c_myunits/myUnitDetail/" +
              entity_cd.trim() +
              "/" +
              project_no.trim() +
              "/" +
              debtor_acct,
            {
              method: "GET",
              headers: this.state.hd,
            }
          )
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data;
                // const data = {
                //     rowID: resData[0].rowID
                // }
                // console.log('getrowid', data);
                this.setState({
                  units: resData,
                  isLoaded: !this.state.isLoaded,
                });
                _storeData("@getRowID", resData);
              } else {
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                  alert(res.Pesan);
                });
              }
              console.log("getunits", res);
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  };
  handleOnlinePayment(data) {
    // coba yang ini bang
    // const getdataNup = this.state.nupss;
    Actions.UnitPaymentSchedule({ myunits: data, unit: this.props.unit });
    // this.setState({ click : true})
  }

  render() {
    const { ProjectName, Property, Level, LotNo, sell_price } = this.props.unit;

    // const getrowid = this.state.units;
    // const rowids = getrowid[0].rowID;
    // console.log('rowids', rowids);
    // console.log('getrrowid', getrowid);

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
              {"Unit Detail".toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight} />
        </Header>
        <Content>
          <List>
            <ListItem itemHeader>
              <View>
                <Text style={[Style.textBlack, Style.textMedium]}>
                  {ProjectName}
                </Text>
                <Text style={[Style.textBlack, Style.textSmall]}>
                  {Property} | {Level} |{" "}
                  <Text style={Style.textRed}>{LotNo}</Text>
                </Text>
                <Text style={[Style.textBlack, Style.textMedium]}>
                  {`Selling Price : \t`}
                  <Thumbnail
                    style={{ width: 18, height: 18 }}
                    source={require("@Asset/icon/rupiah.png")}
                  />
                  <Text style={[Style.textGreen, Style.textMedium]}>
                    {" "}
                    {numFormat(sell_price)}
                  </Text>
                </Text>
              </View>
            </ListItem>
            <ListItem itemDivider />
            {this.state.units.map((data, key) => (
              <ListItem key={key}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#3f3b38",
                        fontFamily: "Montserrat-Regular",
                        fontSize: 10,
                      }}
                    >
                      {data.descs}
                    </Text>
                  </View>

                  <View style={{ flex: 0 }}>
                    <Text
                      style={{
                        color: "#3f3b38",
                        fontFamily: "Montserrat-Regular",
                        fontSize: 10,
                        alignContent: "center",
                        alignSelf: "center",
                      }}
                    >
                      {moment(data.bill_date).format("DD MMM YYYY")}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        {
                          fontFamily: "Montserrat-Regular",
                          fontSize: 10,
                          alignContent: "center",
                          alignSelf: "center",
                        },
                        Style.textBlue,
                      ]}
                    >
                      Rp. {numFormat(data.trx_amt)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0,
                      alignItems: "flex-end",
                      alignContent: "center",
                      alignSelf: "center",
                    }}
                  >
                    {data.status_pembayaran == "Y" ? (
                      <TouchableOpacity
                        style={{
                          borderRadius: 10,
                          backgroundColor: "#3CE543",
                          width: 60,
                          height: 30,
                        }}
                        disabled={true}
                      >
                        <Text
                          style={{
                            fontFamily: "Montserrat-Regular",
                            fontSize: 10,
                            color: "#000000",
                            alignSelf: "center",
                            alignContent: "center",
                            textAlign: "right",
                            marginTop: 8,
                          }}
                        >
                          Paid
                        </Text>
                      </TouchableOpacity>
                    ) : data.status_pembayaran == "O" ? (
                      <TouchableOpacity
                        style={{
                          borderRadius: 7,
                          backgroundColor: "#FF9652",
                          width: 60,
                          height: 30,
                        }}
                        // onPress={()=>Actions.UnitPaymentSchedule({
                        //     unit: this.props.unit,
                        //     duedate: data.due_date,
                        //     Amount: data.trx_amt,
                        //     rowid: data.rowID
                        // })}
                        disabled={true}
                      >
                        <Text
                          style={{
                            fontFamily: "Montserrat-Regular",
                            fontSize: 10,
                            color: "#FFFFFF",
                            alignSelf: "center",
                            alignContent: "center",
                            textAlign: "right",
                            marginTop: 8,
                          }}
                        >
                          Progress
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          borderRadius: 7,
                          backgroundColor: "#DE2828",
                          width: 60,
                          height: 30,
                        }}
                        // onPress={()=>Actions.UnitPaymentSchedule({
                        //     unit: this.props.unit,
                        //     duedate: data.due_date,
                        //     Amount: data.trx_amt,
                        //     rowid: data.rowID
                        // })}
                        onPress={() => this.handleOnlinePayment(data)}
                      >
                        <Text
                          style={{
                            fontFamily: "Montserrat-Regular",
                            fontSize: 10,
                            color: "#FFFFFF",
                            alignSelf: "center",
                            alignContent: "center",
                            textAlign: "right",
                            marginTop: 8,
                          }}
                        >
                          Not Paid
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </ListItem>
            ))}
          </List>
          {!this.state.isLoaded ? <Spinner color="#31C998" /> : null}
        </Content>
      </Container>
    );
  }
}
export default MyUnitDetailPage;
