import React, { Component } from "react";
import {
    Platform,
    ScrollView,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Image,
    ActivityIndicator,
    FlatList,
    Alert,
    Linking
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
    Badge,
    List,
    ListItem,
    Tab,
    Tabs,
    Fab,
    Form,
    Label
} from "native-base";
import LinearGradient from "react-native-linear-gradient";
import Carousel, {
    Pagination,
    ParallaxImage
} from "react-native-snap-carousel";
import { sliderWidth, itemWidth } from "./styles/SliderEntry";
import SliderEntry from "../../components/SlideEntry";
import styles, { colors } from "./styles/index";
import { ENTRIES1, ENTRIES2 } from "./static/entries";
import { scrollInterpolators, animatedStyles } from "./utils/animations";
import CardSlide from "../../components/CardSlide";
const { height, width } = Dimensions.get("window");
import { urlApi } from "@Config/services";
import { _storeData, _getData } from "@Component/StoreAsync";
import { Actions } from "react-native-router-flux";
import Styles from "./Style";
const IS_ANDROID = Platform.OS === "android";
const SLIDER_1_FIRST_ITEM = 0;
import SIMILAR from "../Property/Similar";
import moment from "moment";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            name: "",
            email: "",
            dataTower: [],
            dataPromo: [],
            dataNews: [],
            attendanceSession: [],
            currentSession: 0,
            typenews: 'Y',
            typepromoo: 'P',

            isCorLoaded: false
        };
    }

    componentWillMount() {
        this.startHeaderHeight = 80;
        if (Platform.OS == "android") {
            this.startHeaderHeight = 100 + StatusBar.currentHeight;
        }
    }

    async componentDidMount() {
        console.log("Data Project", await _getData("@UserProject"));
        const data = {
            email: await _getData("@User"),
            name: await _getData("@Name"),
            dataTower: await _getData("@UserProject"),
            // attendanceSession: await _getData("@AttendanceSession"),
            isCorLoaded: true
        };

        // const isAttend = await _getData("@sessAttended");

        this.setState(data, () => {
            this.getPromo();
            this.getNews();
            // this.goToLinkk();
            // if (data.attendanceSession != null) {
            //     this.checkAttendance(isAttend);
            // }
        });
    }

    checkAttendance = session => {
        const { attendanceSession } = this.state;

        for (let i = 0; i < attendanceSession.length; i++) {
            var from = attendanceSession[i].attendance_time;
            var to = attendanceSession[i + 1]
                ? attendanceSession[i + 1].attendance_time
                : moment(new Date(2000, 1, 1, 18, 0, 0, 0)).format("H:mm:ss");
            var sessAttend = attendanceSession[i].session_cd;

            if (
                moment().format("H:mm:ss") >= from &&
                moment().format("H:mm:ss") <= to
            ) {
                if (sessAttend !== session) {
                    console.log("oke", attendanceSession.length);
                    _storeData("@sessAttended", sessAttend);
                    this.showAlertAttendance(attendanceSession[i]);
                    break;
                }
            }
            console.log("from", from);
            console.log("now", moment().format("H:mm:ss"));
            console.log("to", to);
        }
    };
    showAlertAttendance = session => {
        this.setState({});
        Alert.alert(
            "Attendance Notification",
            `let's attend your activity [${session.descs}]`,
            [
                {
                    text: "Ask me later",
                    onPress: () => console.log("Ask me later pressed")
                },

                {
                    text: "Let's Go !",
                    onPress: () => {
                        Actions.Attendance();
                    }
                }
            ],
            { cancelable: false }
        );
    };

    getPromo = () => {
        fetch(urlApi + "c_newsandpromo/getDatapromo2/IFCAMOBILE", {
            method: "GET"
        })
            .then(response => response.json())
            .then(res => {
                if (!res.Error) {
                    const resData = res.Data;

                    this.setState({ dataPromo: resData });
                    console.log("dataPRopmo", resData);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    getNews = () => {
        fetch(urlApi + "c_newsandpromo/getDatanews2/IFCAMOBILE", {
            method: "GET"
        })
            .then(response => response.json())
            .then(res => {
                if (!res.Error) {
                    const resData = res.Data;

                    this.setState({ dataNews: resData });
                    console.log("dataNews", resData);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    // _renderItem({ item, index }) {
    //   return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
    // }

    _renderItemPromo({ item, index }, parallaxProps) {
        if(item.attach_type == 'P'){
            return (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => Actions.NewsAndPromoDetail({ items: item })}
                >
                    <ParallaxImage
                        source={{ uri: item.picture }}
                        containerStyle={styles.imageContainer}
                        style={styles.image}
                        parallaxFactor={0.4}
                        {...parallaxProps}
                    />
                    <View style={styles.newsTitle}>
                        <Text style={styles.newsTitleText2} numberOfLines={2}>
                            {item.descs}
                        </Text>
                        <Text style={Styles.itemLocation}>{item.subject}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if(item.attach_type == 'L'){
            return (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => { Linking.openURL(item.article_link)}}
                >
                    <ParallaxImage
                        source={{ uri: item.picture }}
                        containerStyle={styles.imageContainer}
                        style={styles.image}
                        parallaxFactor={0.4}
                        {...parallaxProps}
                    />
                    <View style={styles.newsTitle}>
                        <Text style={styles.newsTitleText2} numberOfLines={2}>
                            {item.descs}
                        </Text>
                        <Text style={Styles.itemLocation}>{item.subject}</Text>
                    </View>
                </TouchableOpacity>
            );
        }else if(item.attach_type == 'Y'){
            return (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => Actions.NewsAndPromoDetail({ items: item })}
                >
                    <ParallaxImage
                        source={{ uri: item.picture }}
                        containerStyle={styles.imageContainer}
                        style={styles.image}
                        parallaxFactor={0.4}
                        {...parallaxProps}
                    />
                    <View style={styles.newsTitle}>
                        <Text style={styles.newsTitleText2} numberOfLines={2}>
                            {item.descs}
                        </Text>
                        <Text style={Styles.itemLocation}>{item.subject}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    _renderItemNews({ item, index }, parallaxProps) {
    
        if(item.attach_type == 'P'){
            return (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => Actions.NewsAndPromoDetail({ items: item })}
                >
                    <ParallaxImage
                        source={{ uri: item.picture }}
                        containerStyle={styles.imageContainer}
                        style={styles.image}
                        parallaxFactor={0.4}
                        {...parallaxProps}
                    />
                    <View style={styles.newsTitle}>
                        <Text style={styles.newsTitleText2} numberOfLines={2}>
                            {item.descs}
                        </Text>
                        <Text style={Styles.itemLocation}>{item.subject}</Text>
                    </View>
                </TouchableOpacity>
            );
        } else if(item.attach_type == 'L'){
            return (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => { Linking.openURL(item.article_link)}}
                >
                    <ParallaxImage
                        source={{ uri: item.picture }}
                        containerStyle={styles.imageContainer}
                        style={styles.image}
                        parallaxFactor={0.4}
                        {...parallaxProps}
                    />
                    <View style={styles.newsTitle}>
                        <Text style={styles.newsTitleText2} numberOfLines={2}>
                            {item.descs}
                        </Text>
                        <Text style={Styles.itemLocation}>{item.subject}</Text>
                    </View>
                </TouchableOpacity>
            );
        }else if(item.attach_type == 'Y'){
            return (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => Actions.NewsAndPromoDetail({ items: item })}
                >
                    <ParallaxImage
                        source={{ uri: item.picture }}
                        containerStyle={styles.imageContainer}
                        style={styles.image}
                        parallaxFactor={0.4}
                        {...parallaxProps}
                    />
                    <View style={styles.newsTitle}>
                        <Text style={styles.newsTitleText2} numberOfLines={2}>
                            {item.descs}
                        </Text>
                        <Text style={Styles.itemLocation}>{item.subject}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    _renderItemWithParallax({ item, index }, parallaxProps) {
        return (
            <SliderEntry
                data={item}
                even={(index + 1) % 2 === 0}
                parallax={true}
                parallaxProps={parallaxProps}
                onPress={() => Actions.propertydetail({ items: item })}
            />
        );
    }

    _renderLightItem({ item, index }) {
        return <SliderEntry data={item} even={false} />;
    }

    _renderDarkItem({ item, index }) {
        return <SliderEntry data={item} even={true} />;
    }

    mainExample(number, title) {
        const { slider1ActiveSlide } = this.state;

        return (
            <View style={styles.exampleContainer}>
                {/* //??? Di Matiin Belum nemu Solusi Biar ke refresh */}
                {/* <Text style={styles.title}>Hey {this.state.name}</Text> */}
                <Text style={styles.title}>Tuansing</Text>
                {/* <Text style={styles.subtitle}>{`Brings life to you`}</Text> */}

                <View
                    style={{
                        justifyContent: "flex-end",
                        flexDirection: "row",
                        flex: 1,
                        paddingRight: 16,
                        marginTop: -32
                    }}
                >
                    <Button
                        small
                        rounded
                        style={Styles.sBtnHead}
                        onPress={() => Actions.ListingProjectPage()}
                    >
                        <Text style={Styles.sLinkHead}>ALL PROJECT</Text>
                    </Button>
                </View>

                <View style={styles.corContainerStyle}>
                    {this.state.dataTower.length == 0 ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Carousel
                            ref={c => (this._slider1Ref = c)}
                            data={this.state.dataTower}
                            renderItem={this._renderItemWithParallax}
                            sliderWidth={sliderWidth}
                            itemWidth={itemWidth}
                            hasParallaxImages={true}
                            firstItem={SLIDER_1_FIRST_ITEM}
                            inactiveSlideScale={0.94}
                            inactiveSlideOpacity={0.7}
                            inactiveSlideShift={20}
                            containerCustomStyle={styles.slider}
                            contentContainerCustomStyle={
                                styles.sliderContentContainer
                            }
                            loop={false}
                            loopClonesPerSide={2}
                            enableMomentum={false}
                            lockScrollWhileSnapping={true}
                            autoplay={false}
                            autoplayDelay={1000}
                            autoplayInterval={3000}
                        />
                    )}
                </View>
            </View>
        );
    }

    get gradient() {
        return (
            <LinearGradient
            colors={[colors.background1, colors.background2]}
            startPoint={{ x: 0, y: 0 }}
            endPoint={{ x: 0, y: 1 }}
            style={styles.gradient}
            />
        );
    }


    render() {
        const example1 = this.mainExample(1, "");

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor={"rgba(0, 0, 0, 0.3)"}
                    barStyle={"dark-content"}
                />
                {this.gradient}
                <ScrollView
                    style={styles.scrollview}
                    scrollEventThrottle={200}
                    directionalLockEnabled={true}
                >
                    {example1}
                    <ScrollView scrollEventThrottle={16}>
                        <View style={{ flex: 1 }}>
                            <View style={Styles.sectionTransparent}>
                                <View style={Styles.headerBg}>
                                    <Text style={Styles.sHeader}>
                                        {"Tuansing Promo".toUpperCase()}
                                    </Text>
                                    <Right>
                                        <Button
                                            small
                                            rounded
                                            style={Styles.sBtn}
                                            onPress={() => Actions.Feed({
                                                types: 'promo'
                                            })}
                                        >
                                            <Text style={Styles.sLink}>
                                                See All
                                            </Text>
                                        </Button>
                                    </Right>
                                </View>
                                <Carousel
                                    autoplay={true}
                                    autoplayDelay={1000}
                                    autoplayInterval={3000}
                                    sliderWidth={width}
                                    sliderHeight={width}
                                    itemWidth={width - 60}
                                    data={this.state.dataPromo}
                                    renderItem={this._renderItemPromo}
                                    hasParallaxImages={true}
                                />
                            </View>

                            <View style={Styles.sectionTransparent}>
                                <View style={Styles.headerBg}>
                                    <Text style={Styles.sHeader}>
                                        {"Tuansing News".toUpperCase()}
                                    </Text>

                                    <Right>
                                        <Button
                                            small
                                            rounded
                                            style={Styles.sBtn}
                                            onPress={() => Actions.Feed({
                                                types: 'news'
                                            })}
                                        >
                                            <Text style={Styles.sLink}>
                                                See All
                                            </Text>
                                        </Button>
                                    </Right>
                                </View>
                                <Carousel
                                    autoplay={true}
                                    autoplayDelay={1000}
                                    autoplayInterval={3000}
                                    sliderWidth={width}
                                    sliderHeight={width}
                                    itemWidth={width - 60}
                                    data={this.state.dataNews}
                                    renderItem={this._renderItemNews}
                                    hasParallaxImages={true}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </ScrollView>
            </View>
        );
    }
}
