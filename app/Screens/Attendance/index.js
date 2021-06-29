import React, { Component } from "react";
import {
    View,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    Alert
} from "react-native";
import { Style, Colors } from "../../Themes";
import Styles from "./Style";
import {
    Container,
    Content,
    Header,
    Button,
    Icon,
    Spinner,
    Toast
} from "native-base";
import { Actions } from "react-native-router-flux";
import Geolocation from "@react-native-community/geolocation";
import ImagePicker from "react-native-image-crop-picker";
import { _storeData, _getData } from "@Component/StoreAsync";
import RNFetchBlob from "rn-fetch-blob";
import { urlApi } from "@Config/services";
class Attendance extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latitude: "",
            longitude: "",

            isLoaded: false,
            isSuccess: false,
            isHighAccurate: true,

            address: "",
            foto: require("../../../assets/images/user.png"),
            isFotoAv: false,
            email: "",
            nama: "",
            attend_sess: 1,
            hd: ""
        };

        this.showCamera = this.showCamera.bind(this);
        this.handleAbsent = this.handleAbsent.bind(this);
    }

    async componentDidMount() {
        const data = {
            email: await _getData("@User"),
            nama: await _getData("@Name"),
            hd: new Headers({
                Token: await _getData("@Token")
            }),
            attend_sess: await _getData("@sessAttended")
        };
        this.setState(data, () => this.getGeo());
    }

    getGeo = () => {
        const options = {
            timeout: 5000,
            maximumAge: 1000,
            enableHighAccuracy: false
        };

        this.setState({ isLoaded: false }, () => {
            Geolocation.getCurrentPosition(
                this.geoSuccess,
                this.geoError,
                options
            );
        });
    };

    geoSuccess = async position => {
        const { latitude, longitude } = position.coords;
        const apiKey = "AIzaSyBY0EdmxQjo65OoFYIlQZ8jQ1FS8VOTFC8";
        let messageToast = "";
        this.setState({ latitude, longitude });

        if (!position.mocked) {
            await fetch(
                "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                    latitude +
                    "," +
                    longitude +
                    "&key=" +
                    apiKey
            )
                .then(response => response.json())
                .then(res => {
                    console.log("ADDRESS GEOCODE is BACK!! => ", res);
                    if (res.status == "OK") {
                        const address = res.results[0].formatted_address;
                        this.setState(
                            { address, isLoaded: true, isSuccess: true },
                            () => {
                                messageToast = "Your address " + address;
                            }
                        );
                    } else {
                        res.status == "ZERO_RESULTS"
                            ? (messageToast = `Your Location doesn't available in maps`)
                            : null;
                        this.setState({ isLoaded: true, isSuccess: false });
                    }
                });
        } else {
            messageToast = `You are using mocked gps`;
        }

        Toast.show({
            text: messageToast,
            duration: 3000
        });
    };

    geoError = error => {
        console.log("error", error);
        Toast.show({
            text: error.message + ", please make sure your GPS is on.",
            duration: 3000
        });
        this.setState({
            isLoaded: true,
            isSuccess: false,
            isHighAccurate: false
        });
    };

    showCamera() {
        ImagePicker.openCamera({
            cropping: true,
            width: 500,
            height: 800
        })
            .then(image => {
                console.log("received image", image);

                this.setState({ isFotoAv: true, foto: { uri: image.path } });
            })
            .catch(e => console.log("tag", e));
    }

    handleAbsent() {
        const data = this.state;
        const formData = {
            email: data.email,
            nama: data.nama,
            coor: data.latitude + "," + data.longitude,
            positions: data.address,
            pict_url: data.foto.uri,
            attend_sess: data.attend_sess
        };
        let fileName = "Test.jpg";
        let fileImg = RNFetchBlob.wrap(data.foto.uri);
        console.log("form Data", fileImg);

        RNFetchBlob.fetch(
            "POST",
            urlApi + "/c_attendance/saveAttendance/IFCAPB",
            {
                "Content-Type": "multipart/form-data",
                Token: this.state.token
            },
            [
                { name: "photo", filename: fileName, data: fileImg },
                { name: "data", data: JSON.stringify(formData) }
            ]
        ).then(resp => {
            let res = JSON.parse(resp.data);
            console.log("res", res);
            alert(res.Pesan);
            if (!res.Error) {
                _storeData("@sessAttended", formData.attend_sess);
                Actions.pop();
            }
        });
    }

    render() {
        const { isLoaded, isSuccess, isFotoAv, foto } = this.state;

        return (
            <Container style={Style.bgMain}>
                <Header style={Style.navigation}>
                    <StatusBar
                        backgroundColor={Colors.statusBarOrange}
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
                            {"Absent".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight}></View>
                </Header>
                <Content
                    contentContainerStyle={[Style.layoutContent, Styles.homeBg]}
                >
                    {!isLoaded ? (
                        <View
                            style={[
                                Styles.wrapImg,
                                {
                                    borderWidth: 1,
                                    borderColor: "#333",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }
                            ]}
                        >
                            <Spinner size="large" />
                            <Text style={Style.textBlack}>
                                Try to get your location
                            </Text>
                        </View>
                    ) : isSuccess ? (
                        <TouchableOpacity
                            style={[
                                Styles.wrapImg,
                                { borderWidth: 1, borderColor: "#333" }
                            ]}
                            onPress={this.showCamera}
                        >
                            <Image
                                style={[
                                    Styles.wrapImg,
                                    { resizeMode: "cover" }
                                ]}
                                source={foto}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[
                                Styles.wrapImg,
                                { borderWidth: 1, borderColor: "#333" }
                            ]}
                            onPress={this.getGeo}
                        >
                            <Image
                                style={[
                                    Styles.wrapImg,
                                    { resizeMode: "center" }
                                ]}
                                source={require("../../../assets/images/retry.png")}
                            />
                        </TouchableOpacity>
                    )}
                    <View style={Styles.wrapBtn}>
                        <Button
                            primary
                            small
                            full
                            large
                            rounded
                            disabled={isSuccess == true && isFotoAv == true ? false : true }
                            onPress={this.handleAbsent}
                        >
                            <Text style={Style.textWhite}>Absent</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default Attendance;
