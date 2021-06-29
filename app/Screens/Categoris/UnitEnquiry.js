import React, { Component } from "react";
import {
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  View,
  Alert,
  FlatList
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  Spinner
} from "native-base";

import { Actions } from "react-native-router-flux";
import { _storeData, _getData } from "@Component/StoreAsync";
import { Fonts, Style, Colors } from "../../Themes";
import { urlApi } from "@Config/services";

// create a component
class UnitEnquiry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      name: "",
      hd: null,
      dataTower: [],

      dataLevel: [],
      dataUnit: [],
      dashmenu:[],
      Group_cd: '',

      isLoaded: false
    };

    console.log("props", props);
   
  }

  async componentDidMount() {
    //   console.log('Data Project',await _getData('@UserProject'));
    const data = {
      hd: new Headers({
        Token: await _getData("@Token")
      }),
      email: await _getData("@User"),
      name: await _getData("@Name"),
      dataTower: await _getData("@UserProject"),
      Group_cd: await _getData("@Group"),

    };
 
    

    this.setState(data, () => {
      this.getLevel();
      this.getEnquiry();
      // this.getPrice();
    });

    console.log('get _prevItems', this.props.prevItems);
    console.log('get _prevItems', this.props.items);
    console.log('get __GoTo from chooseTower', this.props.gotoItems);
    console.log('get LOTYPES', this.props.lottypes);
  }



  getLevel = () => {
    let { db_profile, entity_cd, project_no, tower } = this.props.prevItems
      ? this.props.prevItems
      : this.props.items;
    !tower ? (tower = 1) : tower;
    fetch(
      urlApi +
        "c_product_info/getLevelEnquiry/" +
        db_profile +
        "/" +
        entity_cd +
        "/" +
        project_no +
        "/" +
        tower,
      {
        method: "GET",
        headers: this.state.hd
      }
    )
      .then(response => response.json())
      .then(res => {
        if (!res.Error) {
          const resData = res.Data;

          this.setState({ dataLevel: resData });

          console.log('getLevel',resData);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  getEnquiry = () => {
    let { db_profile, entity_cd, project_no, tower, lot_type } = this.props
      .prevItems
      ? this.props.prevItems
      : this.props.items;
    !tower ? (tower = 1) : tower;
    !lot_type ? (lot_type = "") : lot_type;

    

    fetch(
      urlApi +
        "c_product_info/getAllUnit/" +
        db_profile +
        "/" +
        entity_cd +
        "/" +
        project_no +
        "/" +
        tower +
        "/" +
        lot_type,
      {
        method: "GET",
        headers: this.state.hd
      }
    )
      .then(response => response.json())
      .then(res => {
        if (!res.Error) {
          const resData = res.Data;

          // var arr2 = resData.reduce( (a,b) => {
          //     var i = a.findIndex( x => x.id === b.id);
          //     return i === -1 ? a.push({ level_no : b.id, times : 1 }) : a[i].times++, a;
          // }, []);

          this.setState({ dataUnit: resData, isLoaded: true });
          console.log('getEnquiry', resData);
          // _storeData("@getUnitEnquiry", resData)
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

//   getPrice = () => {
//     const item = this.props.items;
//     const items = this.props.prevItems;

//     // console.log('punya getprice', item);
//     {
//         isMount
//           //  ? fetch(
//                   urlApi +
//                       "c_booking/getPrice/" +
//                       items.db_profile +
//                       "/" +
//                       items.entity_cd +
//                       "/" +
//                       items.project_no +
//                       "/" +
//                       item.lot_no,
//                   {
//                       method: "POST",
//                       headers: this.state.hd
//                   }
//               )
//                   .then(response => response.json())
//                   .then(res => {
//                       if (!res.Error) {
//                           const resData = res.Data[0];
//                           this.setState({ price: resData });
//                           // _storeData("@getprice",resData);
//                       }
//                       console.log("getPrice", res);
//                   })
//                   .catch(error => {
//                       console.log(error);
//                   })
//             : null;
//     }
// };

  GetGridViewItem(item) {
    Alert.alert(item);
  }

  clickUnitInfo(item) {
    
    const grupcd = this.state.Group_cd;
    console.log('item',item);
    // console.log('grupcd', grupcd);
    // if (item.status == "A" || grupcd == 'Guest' || grupcd == 'DEBTOR') {
    if (item.status == "A") {
      Actions.unitinfo({
        items: item,
        prevItems: this.props.prevItems,
        unitItems: this.props.unitItems,
        theItems: this.props.items,
        theItemz: this.props.lottypes,
        goToItems: this.props.gotoItems,
        // grupcd: grupcd
        // dashmenu:this.state.dashmenu
      });
    } else {
      alert("This Unit is Not Available");
    }
    console.log('cek item dong', item);
    // this.setState({ click: true });
  }

  state = {
    isVisible: false //state of modal default false
  };

  render() {
    const { dataLevel, dataUnit } = this.state;
    const { project_descs } = this.props.prevItems
      ? this.props.prevItems
      : this.props.items;
    return (
      <Container style={Style.bgMain}>
        <Header style={Style.navigation}>
          <StatusBar
            backgroundColor={Colors.brownTuansing}
            animated
            barStyle="dark-content"
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
              {"Unit Enquiry".toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight}></View>
        </Header>
        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              color: "#000000"
            }}
          >
            {project_descs}
          </Text>

          <Text style={{ fontSize: 15, color: "#000000" }}>Apartment</Text>
        </View>

        {/* <Header style={{backgroundColor:'#fff'}}>
          <View style={Style.actionBarLeft}>
            <Text>Block /Tower</Text>
          </View>
          <View style={Style.actionBarMiddle}>
            <Text style={Style.actionBarText}>{"Unit".toUpperCase()}</Text>
          </View>
          <View style={Style.actionBarRight} />
        </Header> */}
        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
          <View style={styles.container}></View>
          <View style={styles.MainContainer}>
            {/* head */}

            {/* end head */}

            {/* top fixed */}

            <View
              style={{
                backgroundColor: "#ffffff",
                width: "100%",
                height: 50
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ padding: 10, width: "40%" }}>
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 15,
                      fontFamily: Fonts.type.sfuiDisplaySemibold
                    }}
                  >
                    Block / Floor
                  </Text>
                </View>
                <View style={{ padding: 10, width: "70%"}}>
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 15,
                      textAlign: "center",
                      fontFamily: Fonts.type.sfuiDisplaySemibold 
                    }}
                  >
                    Unit
                  </Text>
                </View>
              </View>
            </View>

                  {/* {!this.state.isLoaded ? (
                          <Spinner color={Colors.headerOrange} />
                        ):(
                        <ScrollView>
                            <View style={{ flexDirection: "row" }}>
                                <FlatList
                                    style={{ width: "35%" }}
                                    data={dataLevel}
                                    keyExtractor= {item => item.level_no}
                                    renderItem={({ item }) => (
                                        <View style={ styles.GridViewBlockStyle_Left }>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: "#ffffff",
                                                    fontFamily: Fonts.type.sfuiDisplaySemibold 
                                                }}
                                                onPress={this.GetGridViewItem.bind(
                                                    this,
                                                    item.level_no
                                                )}
                                            >
                                                {" "}
                                                {item.descs}{" "}
                                            </Text>
                                        </View>
                                    )}
                                    numColumns={1}
                                />
                                <ScrollView horizontal>
                                    <FlatList
                                        columnWrapperStyle={{flexWrap: 'wrap', flex: 1, }}
                                        style={{ width: "65%" }}
                                        data={dataUnit}
                                        keyExtractor={item => item.level_no}
                                        renderItem={({ item }) => (
                                            <View style={ styles.GridViewBlockStyle }>
                                                <TouchableOpacity
                                                    style={[{backgroundColor : item.status !=="A" ? '#eb4034' :'#34eb6e'},styles.childGridView]}
                                                    onPress={()=>this.clickUnitInfo(item)}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            color: "#ffffff"
                                                        }}
                                                        
                                                    >
                                                        {" "}
                                                        {item.lot_no}{" "}
                                                    </Text>
                                                    <Text style={{
                                                            fontSize: 10,
                                                            color: "#ffffff"
                                                        }}>{item.descs}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                        numColumns={20}
                                    />
                                </ScrollView>
                            </View>
                        </ScrollView> 
                        )} */}

                                    {!this.state.isLoaded ? (
              <Spinner color={Colors.headerOrange} />
            ) : (
              this.state.dataLevel.map((level, key) => (
                <View
                  key={key}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    flex: 1
                  }}
                >
                  <View
                    style={[{ width: "90%" }, styles.GridViewBlockStyle_Left]}
                  >
                    <Text>{level.descs}</Text>
                  </View>
                  
                  <ScrollView style={{width: '50%'}} horizontal={true} bounces={false}>  
                    {this.state.dataUnit.map((unit, key) => {
                      if (unit.level_no == level.level_no) {
                        return (
                          <View style={styles.GridViewBlockStyle} key={key}>
                            {
                              this.state.Group_cd == 'Guest' || this.state.Group_cd == 'DEBTOR' ?
                              <TouchableOpacity
                              style={[
                                {
                                  backgroundColor: unit.status !== "A" && unit.status == 'A' ? "#ffffff" : "#ffffff"
                                },
                                styles.childGridView
                              ]}
                              onPress={() => this.clickUnitInfo(unit)}
                            >
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: "#000000",
                                  textAlign:"center"
                                }}
                              >
                                {" "}
                                {unit.lot_no}{" "}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: "#000000",
                                  textAlign: "center"
                                }}
                              >
                                {unit.descs}
                              </Text>
                            </TouchableOpacity>
                            :
                            // this.state.Group_cd == 'ADMINWEB' || this.state.Group_cd == 'INHOUSE' ?
                            <TouchableOpacity
                              style={[
                                {
                                  backgroundColor:
                                    unit.status == "A" ? "#34eb6e" 
                                    :
                                    unit.status == "R" ? "#FFDE4A"
                                    : "#eb4034" 
                                },
                                styles.childGridView
                              ]}
                              onPress={() => this.clickUnitInfo(unit)}
                            >
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: "#ffffff",
                                  textAlign: "center"
                                }}
                              >
                                {" "}
                                {unit.lot_no}{" "}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 10,
                                  color: "#ffffff",
                                  textAlign: "center"
                                }}
                              >
                                {unit.descs}
                              </Text>
                            </TouchableOpacity>
                            // :
                            // null
                            }
                            
                          </View>
                        );
                      } else {
                        return null;
                      }
                    })}
                    </ScrollView>
              </View>
              ))
            )} 

            {/* <View
                            style={{
                                backgroundColor: "#ffffff",
                                width: "100%",
                                height: 50
                            }}
                        >
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ padding: 10, width: "30%" }}>
                                    <Text
                                        style={{
                                            color: "#000000",
                                            fontSize: 15
                                        }}
                                    >
                                        Block / Floor
                                    </Text>
                                </View>
                                <View style={{ padding: 10, width: "70%" }}>
                                    <Text
                                        style={{
                                            color: "#000000",
                                            fontSize: 15,
                                            textAlign: "center"
                                        }}
                                    >
                                        Unit
                                    </Text>
                                </View>
                            </View>
                        </View> */}
            {/* end top fixed */}
          </View>
        </Content>
      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flexibleContainer: {
    flex: 1
  },
  text: {
    textAlign: "center",
    color: "#02326b",
    fontSize: 40,
    lineHeight: 80
  },
  MainContainer: {
    justifyContent: "center",
    flex: 1,
    margin: 10,
    paddingTop: Platform.OS === "ios" ? 20 : 0
  },

  GridViewBlockStyle_Left: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    height: 55,
    // marginTop: 5,
    backgroundColor: "#ff720d",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },

  GridViewBlockStyle: {
    justifyContent: "center",
    // start: 'left',
    flex: 1,
    // alignItems: 'center',
    height: '90%',
    width: '100%',
    
    // borderRadius: 20,
    // margin: 5,
    padding: 1,
    backgroundColor: "white",
    borderBottomColor: "grey",
    borderBottomWidth: 1
  },

  GridViewInsideTextItemStyle: {
    color: "#fff",
    //  padding: 10,
    fontSize: 18,
    justifyContent: "center",
    fontFamily: Fonts.type.sfuiDisplaySemibold
  },
  childGridView: {
    borderRadius: 10,
    paddingLeft: 5,
    borderWidth: 3,
    borderColor: "#c1c1c0",
    elevation: 2,
    height: 58,
    width: 110,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 2
  },
  contentContainer:{
    paddingVertical: 20
  }
});

//make this component available to the app
export default UnitEnquiry;