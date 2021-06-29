import React from "react";
import {
    StatusBar,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    ImageBackground,
    Dimensions,
    ScrollView,
    Platform,
    SafeAreaView,
    FlatList,
    ActivityIndicator
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
    View,
    FooterTab,
    Badge
} from "native-base";
import RadioGroup from "react-native-custom-radio-group";
import { Actions } from "react-native-router-flux";
import { Style } from "../../Themes/";
import { Fonts, Metrics, Colors } from "../../Themes/";
import Styles from "./Style";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config/services";
// import Shimmer from 'react-native-shimmer';
import Shimmer from "@Component/Shimmer";
//const {width, height} = Dimensions.get('window')
const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
    "window"
);

export default class Project extends React.Component {
    state = {
        dataTower: [],
        isVisible: false,
        tower: []
    };

    

    async componentDidMount() {
        isMount = true;
        const data = {
            dataTower: await _getData("@UserProject")
        };

        // console.log("data", data);
        console.log("dataku", data.dataTower);


        // setTimeout(() => {
        //     this.setState(data);
        // }, 1000);

        this.setState(data, () => {
            this.getTower();
        });

        console.log('check props __goToURL ', this.props.goTo);
    }

    getTower = () => {
        const dbprofile = this.state.dataTower[0].db_profile;
        const entitycd = this.state.dataTower[0].entity_cd;
        const projectno = this.state.dataTower[0].project_no;

        const getGotoUrl = this.props.goTo;
        const GotoUrl = getGotoUrl.URL;

        console.log('check __getTower', dbprofile);
        {
            isMount
                ? fetch(
                      urlApi +
                          "c_product_info/getTower/" +
                          dbprofile +
                          "/" +
                          entitycd +
                          "/" +
                          projectno,
                      {
                        method: "POST",
                        body: JSON.stringify({GotoUrl}),
                      }
                  )
                      .then(response => response.json())
                      .then(res => {
                          if (!res.Error) {
                              const resData = res.Data;
                              this.setState({ tower: resData });
                              _storeData("@getTows", resData);
                          } else {
                              this.setState(
                                  { isLoaded: !this.state.isLoaded },
                                  () => {
                                      alert(res.Pesan);
                                  }
                              );
                          }
                          console.log("getTower RES", res);
                      })
                      .catch(error => {
                          console.log(error);
                      })
                : null;
        }
    };

    componentWillMount() {}

    clickProject(item) {
        console.log("property", this.props);
        const getpropertycd = this.state.tower[0].property_cd;
        console.log('hehehe', getpropertycd);
        let isBook = false;
        let isProduct = false;
        let isNup = false;
        if (this.props.goTo == "BookingPage") {
            isBook = true;
            this.props.goTo = "ProductProjectPage";
        } else if (this.props.goTo == "ProductProjectPage") {
            isProduct = true;
        }
        else if (this.props.goTo == "NUPPage") {
            isNup = true;
            this.props.goTo = "ProductProjectPage";
        } 
        else {
            isProduct = true;
        }
        // console.log("item", this.props.goTo);
        Actions[this.props.goTo.URL_angular]({
            items: item,
            goTo: this.props.goTo,
            dyn: true,
            isBook,
            isProduct,
            isNup,
            propertycds: getpropertycd,
            // entityz: gettower_entity,
            // projectz: gettower_project 
        });
        // this.setState({ click : true})
    }
    render() {

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
                            {"Choose Project".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight}></View>
                </Header>

                <Content style={Style.layoutContent}>
                    <ScrollView
                        scrollEventThrottle={200}
                        directionalLockEnabled={true}
                    >
                        <View style={Styles.sectionGrey}>
                            {this.state.dataTower.length == 0 ? (
                                <View style={Styles.city}>
                                    <Shimmer
                                        autoRun={true}
                                        style={Styles.btnCity}
                                    />
                                    <Shimmer
                                        autoRun={true}
                                        style={Styles.btnCity}
                                    />
                                    <Shimmer
                                        autoRun={true}
                                        style={Styles.btnCity}
                                    />
                                    <Shimmer
                                        autoRun={true}
                                        style={Styles.btnCity}
                                    />
                                </View>
                            ) : (
                                <View style={Styles.city}>
                                    {this.state.dataTower.map((item, key) => (
                                        <TouchableOpacity
                                            key={key}
                                            style={Styles.btnCity}
                                            onPress={() =>
                                                this.clickProject(item)
                                            }
                                        >
                                            <Image
                                                source={{
                                                    uri:
                                                        item.picture_url +
                                                        "?random_number=" +
                                                        new Date().getTime()
                                                }}
                                                resizeMode={"cover"}
                                                style={Styles.btnCityImg}
                                            />
                                            <View
                                                style={Styles.btnCityLocation}
                                            >
                                                <Text
                                                    style={Styles.btnCityText}
                                                >
                                                    {item.project_descs}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}