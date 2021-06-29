import React from "react";
//import react in project
import {
    PermissionsAndroid,
    Text,
    View,
    Image,
    StatusBar,
    Platform,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    BackHandler,
    I18nManager, 
    SafeAreaView,
    TextInput
} from "react-native";
import {
    Container,
    Button,
    Icon,
    Right,
    Item,
    Input,
    Header,
    Left,
    Body,
    Title,
    Label
} from "native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
//import all the required component
import AppIntroSlider from "react-native-app-intro-slider";
import styles from "./styles";
import { Style, Colors, Metrics, Fonts } from "../../Themes";
import { Actions } from "react-native-router-flux";
import { _storeData, _getData } from "@Component/StoreAsync";
import DeviceInfo from "react-native-device-info";
import { urlApi } from "@Config/services";
import IntlPhoneInput from '@Component/CountryCode';

class SignupGuest extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: true,
            email: props.data && props.data.Email,
            fullname: props.data && props.data.Name,
            nohp: "",
            password: "",
            isHide: false,
            // Id: props.data.LoginId,

            emails: "",
            fullnames: "",
        };

        console.log("props", props);
    }
    
    onChangeTextPhone = ({dialCode, unmaskedPhoneNumber, phoneNumber, isVerified}) => {
        
        this.setState({nohp :dialCode + unmaskedPhoneNumber});
        // console.log(dialCode, unmaskedPhoneNumber, phoneNumber, isVerified);
        // console.log('nohp',this.state.nohp);
      };

    validating = validationData => {
        const keys = Object.keys(validationData);
        const errorKey = [];
        let isValid = false;

        keys.map((data, key) => {
            if (validationData[data].require) {
                let isError =
                    !this.state[data] || this.state[data].length == 0
                        ? true
                        : false;
                let error = "error" + data;
                errorKey.push(isError);
                this.setState({ [error]: isError });
            }
        });

        for (var i = 0; i < errorKey.length; i++) {
            if (errorKey[i]) {
                isValid = false;
                break;
            }
            isValid = true;
        }

        return isValid;
    };

    SignupSosmed() {
        this.setState({ isLoaded: !this.state.isLoaded });


        const data = {
            Email: this.state.email,
            FullName: this.state.fullname,
            Handphone: this.state.nohp,
            Medsos: 1,
            Id: this.props.data.LoginId,
            password: this.state.password,
            Emailz: this.state.emails,
            FullNamez: this.state.fullnames
        };
        console.log('data kirim', data);

        fetch(urlApi + "c_auth/SignUpGuest/", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(res => {
                console.log("Login Result", res);
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                    alert(res.Pesan);
                    Actions.pop()
                });
            })
            .catch(error => {
                console.log(error);
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                    alert(error);
                });
            });


    }

    Capitalize(str){
        return str.charAt(0).toUpperCase() + str.slice(1);
        }

    validating = validationData => {
        const keys = Object.keys(validationData);
        const errorKey = [];
        let isValid = false;

        keys.map((data, key) => {
            if (validationData[data].require) {
                let isError =
                    !this.state[data] || this.state[data].length == 0
                        ? true
                        : false;
                let error = "error" + data;
                errorKey.push(isError);
                this.setState({ [error]: isError });
            }
        });

        for (var i = 0; i < errorKey.length; i++) {
            if (errorKey[i]) {
                isValid = false;
                break;
            }
            isValid = true;
        }

        return isValid;
    };

    render() {
        return (
            <Container>
                <ImageBackground style={styles.backgroundImage2}>
                    <Header style={styles.header}>
                        <Left style={styles.left}>
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
                        </Left>
                        <Body style={styles.body}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    // fontWeight: "bold",
                                    color: Colors.white,
                                    fontFamily: Fonts.type.sfuiDisplayMedium
                                }}
                            >
                                {"REGISTRATION"}
                                {/* {this.Capitalize("Registration")} */}
                            </Text>
                        </Body>
                        <Right style={styles.right}></Right>
                    </Header>
                    <View style={styles.inputFieldStyles}>
                        {/* <Image
                            style={styles.images}
                            source={require("../Images/logo.png")}
                        /> */}
                        {/* <View style={{width: 200,height: 100, marginBottom: 65}}>
                                <Image
                                    // style={styles.images}
                                style={styles.styleLogo}
                                source={require("../Images/logo.png")}
                            />
                        </View> */}

                        <View style={{justifyContent : 'center',width: Metrics.WIDTH * 0.92,}}> 

                            <View style={{paddingBottom: 20,}}>
                                {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <Text style={styles.overviewTitles}>Full Name</Text>
                                </View> */}
                                {/* <Item floatingLabel style={styles.marginround}> */}
                                    <Label style={{color: "#fff", fontSize: 14, fontFamily: Fonts.type.sfuiDisplayRegular}}>Email</Label>
                                    <TextInput 
                                        // placeholder='Full Name' 
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        autoCorrect={false}
                                        placeholderTextColor="#FFF"
                                        value={this.state.email}
                                        onChangeText={val =>
                                            this.setState({ email: val })
                                        }
                                        
                                        ref="email"
                                        style={styles.positionTextInput,{backgroundColor:'#FFF'}}
                                        
                                        />
                                        {this.state.erroremail ? (
                                        <Icon style={{color: "red", bottom: 3, position: "absolute", right: 0}} name='close-circle' />
                                        ) : null}
                                    {/* <Icon name='close-circle' /> */}
                                {/* </Item> */}
                                {this.state.erroremail ? (<Text
                                    style={{
                                        position: "absolute",
                                        bottom:10,
                                        left: 15,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                >
                                    Email Required
                                </Text>) : null}
                            </View>
                            
                            <View style={{paddingBottom: 20}}>
                                {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <Text style={styles.overviewTitles}>Full Name</Text>
                                </View> */}
                                {/* <Item floatingLabel style={styles.marginround}> */}
                                    <Label style={{color: "#fff", fontSize: 14, fontFamily: Fonts.type.sfuiDisplayRegular}}>Full Name</Label>
                                    {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                        <Icon solid name='star' style={styles.iconSub} type="FontAwesome5" />
                                        <Icon name='id-card-alt' type="FontAwesome5" style={styles.iconColor} />
                                    </View> */}
                                    <TextInput 
                                        // placeholder='Full Name' 
                                        // keyboardType="email-address"
                                        autoCapitalize="words"
                                        returnKeyType="next"
                                        autoCorrect={false}
                                        placeholderTextColor="#FFF"
                                        ref="fullname"
                                        style={styles.positionTextInput,{backgroundColor:'#FFF'}}
                                        value={this.state.fullname}
                                        onChangeText={val =>
                                            this.setState({ fullname: val })
                                        }

                                        // editable={true}
                                        // underlineColorAndroid="transparent"
                                        // textAlign={
                                        //     I18nManager.isRTL ? "right" : "left"
                                        // }
                                        // placeholder="Full Name"
                                        // placeholderTextColor="rgba(0,0,0,0.20)"
                                        
                                        
                                        />
                                        {this.state.errorfullname ? (
                                        <Icon style={{color: "red", bottom: 3, position: "absolute", right: 0}} name='close-circle' />
                                        ) : null}
                                    {/* <Icon name='close-circle' /> */}
                                {/* </Item> */}
                                {this.state.errorfullname ? (<Text
                                    style={{
                                        position: "absolute",
                                        bottom:10,
                                        left: 15,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                >
                                    Full Name Required
                                </Text>) : null}
                            </View>
                    
                            <View style={{paddingBottom: 20}}>
                                {/* <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                                    <Text style={styles.overviewTitles}>Full Name</Text>
                                </View> */}
                                {/* <Item rounded style={{height: 35}}>
                                <Picker note 
                                    mode="dropdown"
                                    // style={Styles.textInput}
                                    selectedValue={this.state.nohp}
                                    onValueChange={(val)=>this.setState({nohp:val})}
                                >
                                    <Picker.Item Icon="../Images/logo.png" label="Handphone" />
                                    {dataCountry.map((data, key) =>
                                        <Picker.Item key={key} label={data.name} value={data.dialCode}/>
                                    )}
                                </Picker>
                            </Item> */}
                            <SafeAreaView>
                                <IntlPhoneInput onChangeText={this.onChangeTextPhone} defaultCountry="ID" 
                                renderAction={() => <View><Text></Text></View>} 
                                />
                                <Text style={{fontStyle: 'italic'}}> {'Valid Number : ' + (this.state.nohp)} </Text>
                            </SafeAreaView>
                                {this.state.errornohp ? (<Text
                                    style={{
                                        position: "absolute",
                                        bottom:10,
                                        left: 15,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                >
                                    Handphone Required
                                </Text>) : null}
                            </View>

                            <View style={{paddingBottom: 20}}>
                               
                                {/* <Item floatingLabel style={styles.marginround}> */}
                                    <Label style={{color: "#fff", fontSize: 14, fontFamily: Fonts.type.sfuiDisplayRegular}}>Password</Label>
                                    
                                    <TextInput
                                        ref="password"
                                        style={styles.positionTextInput}
                                        editable={true}
                                        onChangeText={val =>
                                            this.setState({ password: val })
                                        }
                                        keyboardType="default"
                                        returnKeyType="next"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholderTextColor={'#666'} 
                                        // underlineColorAndroid="transparent"
                                        // textAlign={
                                        //     I18nManager.isRTL ? "right" : "left"
                                        // }
                                        // placeholder="Password"
                                        // placeholderTextColor="rgba(0,0,0,0.20)"
                                        secureTextEntry={!this.state.isHide}
                                        value={this.state.password}
                                        />
                                        {/* {this.state.errorpassword ? (
                                        <Icon style={{color: "red", bottom: 3, position: "absolute", right: 0}} name='close-circle' />
                                        ) : null} */}
                                        {/* <Icon
                                            name={this.state.isHide ? "eye-off" : "eye"}
                                            style={[styles.eye,{color: Colors.white}]}
                                            onPress={() =>
                                                this.setState({
                                                    isHide: !this.state.isHide
                                                })
                                            }
                                        /> */}
                                    {/* <Icon name='close-circle' /> */}
                                {/* </Item> */}
                                {this.state.errorpassword ? (<Text
                                    style={{
                                        position: "absolute",
                                        bottom:10,
                                        left: 15,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                >
                                    Password Required
                                </Text>) : null}
                            </View>
                        </View>

                        <View
                        style={{marginTop: 40}}
                        pointerEvents={this.state.isLoaded ? "auto" : "none"}
                    >
                        <Button
                            style={styles.signInBtnMedium}
                            onPress={() => this.SignupSosmed()}
                            backgroundColor = '#BAB7B7'
                        >
                            {!this.state.isLoaded ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={[styles.signInBtnText,{fontSize: 15}]}>
                                    Register Now
                                </Text>
                            )}
                        </Button>
                    </View>


                    </View>
                    {/* <View
                        // style={styles.signbtnSec}
                        style={{marginTop: 40}}
                        pointerEvents={this.state.isLoaded ? "auto" : "none"}
                    >
                        <Button
                            style={styles.signInBtnMedium}
                            onPress={() => this.SignupSosmed()}
                        >
                            {!this.state.isLoaded ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.signInBtnText}>
                                    Register Now
                                </Text>
                            )}
                        </Button>
                    </View> */}
                </ImageBackground>
            </Container>
        );
    }
}
export default SignupGuest;