import React, { Component } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
    Image
} from "react-native";
import { Style, Colors, Metrics, Fonts } from "../../Themes";
import { Icon } from "native-base";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes
} from '@react-native-community/google-signin';

export default class GoogleLoginButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        };
    }

    handleEnable = () => {
        this.setState({ disabled: !this.state.disabled });
    };

    handleLogin = async () => {
        this.handleEnable();

        try {
            await GoogleSignin.configure({
                webClientId:
                    // "945884059945-0treh3o5vujr85pba419nb9dqttt310m.apps.googleusercontent.com",

                    // "286974213409-91csp3vlj0gj2vl396fuvtbs98mqfekj.apps.googleusercontent.com",
                    "746798557732-c0ubvihqkoo90he7mlhvhl3389oms6ot.apps.googleusercontent.com",
                    
                offlineAccess: true,
                forceConsentPrompt: true
            });
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            this._responseInfoCallback(userInfo);
        } catch (error) {
            this.handleEnable();            
            console.log("Error ", error);
        }
    };

    _responseInfoCallback = userInfo => {
        this.handleEnable();
        GoogleSignin.revokeAccess();
        GoogleSignin.signOut();
        const data = {
            Email: userInfo.user.email,
            Medsos: 1,
            LoginId: userInfo.user.id,
            device: Platform.OS,
            Token: userInfo.idToken,
            Name: userInfo.user.givenName + " " + userInfo.user.familyName
        };
        this.props.onPress(data);
    };

    render() {
        return (
            <TouchableOpacity
                disabled={this.state.disabled}
                style={styles.container}
                onPress={this.handleLogin}
            >
                {/* <Icon name="google" style={styles.icon} type="FontAwesome5" />
                 */}

                 <View style={{flex: 1, flexDirection: 'row', alignItems: "center",justifyContent: "center",}}>
                    <View style={{marginRight: 10}}>
                        <Image style={styles.icon} source={require('@Asset/images/google.png')}></Image> 
                    </View>
                    {/* <View style={{left: 43}}> */}
                    <Text style={styles.text}>
                        Sign In Guest With Google
                    </Text>

                 </View>
                 


               
                    {/* <Text style={{ backgroundColor:'lightblue', alignSelf: "center" }}>Vindhyachal</Text> */}
                {/* </View> */}

                {/* </View> */}
                
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: Metrics.HEIGHT * 0.06,
        width: Metrics.WIDTH * 0.75,
        borderRadius: 15,
        alignSelf: "center",
        elevation: 3,
        shadowColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        // flexDirection: 'row'
    },
    text: {
        // color: "#fff",
        fontSize: Fonts.moderateScale(17),
        // width: Metrics.WIDTH * 0.92,
        textAlign: "center",
        fontWeight: "500", 
        color: Colors.facebook, 
        fontSize: 12,
        fontFamily: Fonts.type.proximaNovaReg

        // fontFamily: Fonts.type.proximaNovaReg, fontWeight: "500", color: Colors.facebook, fontSize: 12
    },
    icon: {
        // justifyContent: "flex-end",
        // flexDirection: 'row',
        // fontSize: Fonts.moderateScale(17),
        // width: Metrics.WIDTH * 0.92,
        right: 10,
        width: 33, height: 33,
        // textAlign: "center",
    }
});
