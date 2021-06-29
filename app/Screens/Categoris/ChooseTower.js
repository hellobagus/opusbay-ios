//import liraries
import React from "react";
import {
    StatusBar,
    ActivityIndicator,
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
    FlatList
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
    Badge
} from "native-base";

import NavigationService from "@Service/Navigation";

import PROPERTIES from "./Properties";

import { Actions } from "react-native-router-flux";

import { Style, Colors } from "../../Themes/";
import Styles from "./Style";
import { _storeData, _getData, _navigate } from "@Component/StoreAsync";
import { urlApi } from "@Config/services";

//const {width, height} = Dimensions.get('window')
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
    "window"
);
let isMount = false;

// create a component
class Categoris extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hd: null,

            tower: [],
            lottype: [],
            properties:[],
            product_type: [],
            item: []
        };
        // console.log("check props __GOTO on choose tower", this.props.goTo);
        // console.log('props _getProductcd', this.props.propertycds);

        console.log('check props from Choose Project', this.props);
    }

    async componentDidMount() {
        isMount = true;
        const getLotType = await _getData("@getLotType");

        const data = {
            hd: new Headers({
                Token: await _getData("@Token"),
            }),
            lottype: getLotType
            
        };
        this.setState(data, () => {
            this.getTower();
            this.getProductType();
        });


        // console.log('test', this.state.tower);
      
    }

    componentWillReceiveProps(props) {
        // props dari WebView
        const getDataProps = props.item; // props dari WebView
        console.log('check getdataProps', getDataProps);
        // console.log("props getback", getDataProps);
        if (getDataProps) {
          this.setState({ c: getDataProps });
        }
    }


    getTower = () => {
        const item = this.props.items;
        const getGotoUrl = this.props.goTo;
        const GotoUrl = getGotoUrl.URL;

        // console.log('check __GotoUrl', GotoUrl);
        {
            isMount
                ? fetch(
                      urlApi +
                          "c_product_info/getTower/" +
                          item.db_profile +
                          "/" +
                          item.entity_cd +
                          "/" +
                          item.project_no,
                      {
                          method: "POST",
                          body: JSON.stringify({GotoUrl}),
                        //   headers: this.state.hd
                      }
                  )
                      .then(response => response.json())
                      .then(res => {
                          if (!res.Error) {
                              const resData = res.Data;
                            //   const propertyccd = resData.property_cd;
                              this.setState({ tower: resData });
                              _storeData("@getTowers", resData);
                              this.getLotType(res);
                          } else {
                              this.setState(
                                  { isLoaded: !this.state.isLoaded },
                                  () => {
                                    //   alert(res.Pesan);
                                  }
                              );
                          }
                          console.log("getTower", res);
                      })
                      .catch(error => {
                          console.log(error);
                      })
                : null;
        }
    };

    getLotType = res =>{
        let result = res.Data[0];
        const getpropertycd = result.property_cd;
        const propertycd = getpropertycd;
        const item = this.props.items;

        console.log('check _getLOTYPE', propertycd);
        {isMount ?
            fetch(urlApi+'c_product_info/getLotType/'+item.db_profile+'/'+item.entity_cd+'/'+item.project_no+'/'+propertycd,{
                method:'GET',
                headers : this.state.hd,
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data
                    this.setState({lottype : resData})
                    _storeData("@getLotType", resData);
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        // alert(res.Pesan)
                    });
                }
                console.log('getLotType',res);
            }).catch((error) => {
                console.log(error);
            })
        :null}
    }

    getProductType= () => {
        const item = this.props.items;
        {isMount ?
            fetch(urlApi + 'c_nups/getProdsType/'+ item.db_profile + "/" + item.entity_cd + "/" + item.project_no,{
                method: 'GET',
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data;
                    this.setState({ product_type : resData});
                    _storeData("@prodType", resData);
                    // this.getNupType(res);
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        alert(res.Pesan)
                    });
                }
                console.log('getProductType', res);
            }).catch((error) => {
                console.log(error);
            })
            :null}
    }

    // getNupType= () => {
    //     const item = this.props.items;
    //     {isMount ?
    //         fetch(urlApi + 'c_nups/getNupType/'+ item.db_profile + "/" + item.entity_cd + "/" + item.project_no,{
    //             method: 'GET',
    //         }).then((response) => response.json())
    //         .then((res)=>{
    //             if(!res.Error){
    //                 const resData = res.Data;
    //                 this.setState({ product_type : resData});
    //                 _storeData("@nupsType", resData);
    //             } else {
    //                 this.setState({isLoaded: !this.state.isLoaded},()=>{
    //                     alert(res.Pesan)
    //                 });
    //             }
    //             console.log('getnupType', res);
    //         }).catch((error) => {
    //             console.log(error);
    //         })
    //         :null}
    // }

    goTo(item) {
        const data = this.props.items;
        const takeLotType = this.state.lottype;
        let url;
        data["tower"] = item.property_cd;
        data["towerDescs"] = item.descs;
        data["product_cd"] = item.product_cd;
        data["product_descs"] = item.product_descs;
        data["open_nup"] = item.open_nup;

        // console.log('check DATA', data);
        // console.log("get __goTo", this.props.goTo);
        // console.log('get __routeName', this.props.routeName);
        // console.log("check _getLotType", takeLotType);


        if (this.props.goTo) {
            if (this.props.goTo.URL == "UnitEnquiryPage") {
                // console.log("dyn true", this.props.dyn);
                _navigate("UnitEnquiryProjectPage", {
                    prevItems: data,
                    items: this.props.items,
                    gotoItems: this.props.goTo,
                    lottypes: takeLotType
                });
            } else if (this.props.goTo.URL == "NUPPage") {
                // console.log("dyn true", this.props.dyn);
                _navigate("NUPPage", {
                    prevItems: data,
                    items: this.props.items,
                    gotoItems: this.props.goTo,
                    lottypes: takeLotType
                });
            } else {
                // console.log("dyn false", this.props.dyn);
                Actions.chousefloor({
                    items: this.props.items,
                    goToItems: this.props.goTo,
                    lottypes: takeLotType,
                    routes: this.props.routes,
                    prevItems: data,
                });
                // _navigate("categoris", { 
                //     items: this.props.items,
                //     gotoItems: this.props.goTo,
                //     lottypes: takeLotType,
                //     routes: this.props.routes,
                //     prevItems: data,
                // });
            }
        } else {
            _navigate("categoris", { 
                items: this.props.items,
                prevItems: data,
            });
        }
    }

    render() {
        const takeLotType = this.state.lottype;
        // const getGotoUrl = this.props.goTo;

        // console.log("check _getLotType", takeLotType);
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
                            {"Choose Cluster / Tower".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight} />
                </Header>

                <Content
                    style={Style.layoutInner}
                    contentContainerStyle={Style.layoutContent}
                >
                    <ImageBackground style={Styles.homeBg}>
                        <View style={Styles.section}>
                            {this.state.tower.length == 0 ? (
                                <ActivityIndicator />
                            ) : (
                                <FlatList
                                    data={this.state.tower}
                                    style={Styles.item}
                                    keyExtractor={item => item.rowID}
                                    renderItem={({ item, separators }) => (
                                        <TouchableHighlight
                                            underlayColor="transparent"
                                            onPress={() => this.goTo(item)}
                                        >
                                            <View style={Styles.record}>
                                                <Image
                                                    source={{
                                                        uri: item.picture_url
                                                    }}
                                                    style={Styles.itemImg}
                                                />
                                                <View style={Styles.itemInfo}>
                                                    <Text
                                                        style={Styles.itemTitle}
                                                    >
                                                        {item.descs}
                                                    </Text>
                                                </View>
                                                <View style={Styles.trash}>
                                                    <Button
                                                        transparent
                                                        onPress={() => {
                                                            NavigationService.navigate(
                                                                "MemberFavorites"
                                                            );
                                                        }}
                                                    >
                                                        <Icon
                                                            name="arrow-right"
                                                            type="FontAwesome"
                                                            style={
                                                                Styles.itemIcon
                                                            }
                                                        />
                                                    </Button>
                                                </View>
                                            </View>
                                        </TouchableHighlight>
                                    )}
                                />
                            )}
                        </View>
                    </ImageBackground>
                </Content>
            </Container>
        );
    }
}

//make this component available to the app
export default Categoris;
