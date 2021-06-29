import React, { Component } from "react";
import {
    StatusBar,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    ScrollView,
    View,
    Alert,
    ActivityIndicator,
    Modal,
} from "react-native";
import { WebView } from 'react-native-webview';
import {
    Container,
    Header,
    Content,
    Button,
    Icon,
    Text
} from "native-base";
import { Fonts, Style, Colors } from "../Themes";
import { Actions } from "react-native-router-flux";

const popRoot = () => {
    Actions.popTo('Outstandings');
    setTimeout(() => Actions.refresh())
        
}

export default class WebViewPage extends React.PureComponent {


    //   onBack () {
    //     const dataProps = {...this.props}
    //     if (dataProps) {
    //         console.log('cekk dataProps', dataProps);
    //       Actions.ProductProjectPage();
    //       setTimeout(() => {
    //         Actions.refresh({ item: dataProps });
    //       }, 0);
    //     }
    //     // this.setModalVisible(!this.state.modalVisible)
    //   };


    
    
    
    render() {
        const state = {...this.props.item}
      console.log('check props from NUP DETAIL',state);

        // const state = this.props;
        // console.log('check props from NUP DETAIL',state);

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
                            onPress={popRoot}
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
                            {"Payment Transaction".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight}></View>
                </Header>

                    <WebView style={{flex:1}} source={{ 
                            uri: state.redirects,
                            method:'GET'
                    }} />

        </Container>
           
        );
    }
}