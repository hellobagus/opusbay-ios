//import liraries
import React, { Component } from "react";
import {
    StatusBar,
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
    FlatList,
    Modal
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
    Badge,
    Card
} from "native-base";

import { Actions } from "react-native-router-flux";
import ParallaxScroll from "@monterosa/react-native-parallax-scroll";

import { Style, Colors } from "../../Themes";
import Styles from "./Style";

import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config/services";
import moment from "moment";

let isMount = false;
// create a component
class NewsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hd: null,

            news: [],
            user: "",
            name: "",
            project: []
        };

        console.log("props cf", props);
    }

    async componentDidMount() {
        isMount = true;
        const data = {
            hd: new Headers({
                Token: await _getData("@Token")
            }),
            user: await _getData("@User"),
            name: await _getData("@UserId"),
            project: await _getData("@UserProject")
        };

        this.setState(data, () => {
            this.getNews();
        });
    }

    getNews = () => {
        {
            isMount
                ? fetch(urlApi + "c_newsandpromo/getDatanews2/IFCAMOBILE/", {
                      method: "GET",
                      headers: this.state.hd
                  })
                      .then(response => response.json())
                      .then(res => {
                          if (!res.Error) {
                              const resData = res.Data;
                              this.setState({news : resData.news})
                              resData.map(data => {
                                  this.setState(prevState => ({
                                      news: [...prevState.news, data]
                                  }));
                              });
                              console.log("res", res);
                          } else {
                              this.setState(
                                  { isLoaded: !this.state.isLoaded },
                                  () => {
                                    //   alert(res.Pesan);
                                  }
                              );
                          }
                          console.log("getNews", res);
                      })
                      .catch(error => {
                          console.log(error);
                      })
                : null;
        }
    };

    clickChouseUnit(item) {
        Actions.chouseunit({
            unitItems: item,
            items: this.props.item,
            prevItems: this.props.prevItems
        });
        // this.setState({ click : true})
    }
    clickUnitEnquiry() {
        Actions.unitenquiry();
        this.setState({ click: true });
    }
    render() {
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
                            {"Choose News".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight} />
                </Header>
                <Content
                    style={Style.layoutInner}
                    contentContainerStyle={Style.layoutContent}
                >
                    {/* <Image
              source={require("@Asset/images/tigabr.jpg")}
              style={{
                width: null,
                height: 168,
                resizeMode: "cover",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 8
              }}
            />  */}
                    <View>
                        <ScrollView>
                        {this.state.news.length > 0 ?
                            this.state.news.map((data, key) => (
                                <Card
                                    style={{
                                        height: null,
                                        backgroundColor: "white",
                                        shadowOffset: { width: 1, height: 1 },
                                        shadowColor: "#37BEB7",
                                        shadowOpacity: 0.5,
                                        elevation: 5,
                                        paddingHorizontal: 10,
                                        paddingVertical: 10
                                    }}
                                    key={key}
                                >
                            
                                    <View>
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    textAlign: "left",
                                                    color: "#333",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                {data.descs}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: "bold",
                                                    textAlign: "left",
                                                    color: "#333"
                                                }}
                                            >
                                                {data.subject}
                                            </Text>
                                        </View>
                                        <View>
                                            <Image
                                                source={{ uri: data.picture }}
                                                style={Styles.itemImg}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: "500",
                                                    textAlign: "left",
                                                    color: "#ff720d"
                                                }}
                                            >
                                                {data.date_created}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                </Card>
                            ))
                            : 
                            <Container style={Styles.bgValidate}>
                                <View style={Styles.containImages}>
                                  <Image
                                    style={{width: 110, height: 110}}
                                    source={require("../../../assets/images/exclam_gray.png")}
                                  />
                                  </View>
                                <Text style={[Styles.itemPrice,{alignSelf:'center'}]}>Oops! No news here.</Text>
                            </Container>
                            }

                        </ScrollView>
                    </View>
                </Content>
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
        backgroundColor: "#2c3e50"
    }
});

//make this component available to the app
export default NewsPage;
