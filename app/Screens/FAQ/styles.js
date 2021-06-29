import { Platform, StyleSheet, Dimensions } from "react-native";
// Screen Styles
import { Fonts, Metrics, Colors } from "../../Themes";
import {StatusBar} from 'react-native';
const dw = Dimensions.get("window").width;

const styles = {
// ----------- 
    bgMain: {
        backgroundColor: '#f2f2f2',
    },
    navigation: {
        shadowOpacity: 0,
        elevation: 0,
        shadowOffset: {
            height: 0,
        },
        shadowRadius: 0,
        backgroundColor: 'transparent',
        width: '100%',
        borderBottomWidth: 0,
        borderColor: Colors.brownTuansing,
        backgroundColor: Colors.brownTuansing,
        marginTop: StatusBar.currentHeight,
    },
    actionBarLeft: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 2,
    },
    actionBarBtn: {
        alignSelf: 'flex-start',
        marginLeft: -10,
    },
    textWhite: {
        color: '#FFFFFF',
		fontFamily: "Montserrat-Regular",
    },
    actionBarMiddle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 6,
    },
    actionBarText: {
        color: '#FFFFFF',
		fontFamily: "Montserrat-Regular",
        fontSize: 14,
        textAlign: 'center',
    },
    actionBarRight: {
        justifyContent: 'center',
        flex: 2,
        alignItems: 'flex-end',
    },
    layoutInner: {
        width: '100%',
    },
    layoutContent:{
    },
    divider: {
        width: (Metrics.WIDTH * 0.92),
            height: 0.6,
            backgroundColor: 'rgba(0,0,0,0.1)',
            left:15,
            right:15,
    },
    textBlack: {
        color: '#3f3b38',
		fontFamily: "Montserrat-Regular",
    },
    textBig: {
        fontSize: 20,
    },
    textMedium: {
        fontSize: 16,
    },
    textAlign: {
        margin : 10
    },
    textAlign2: {
        margin : 15,
        flexWrap: 'wrap',
        textAlign: 'justify'
    },
    textAlign3: {
        margin : 15,
        flexWrap: 'wrap',
        // textAlign: 'justify'
    },
    cardBox: {
        height: null,
        width: 330,
        backgroundColor: 'white',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "#37BEB7",
        shadowOpacity: 0.5,
        elevation: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginLeft: 15.5
    },
    viewButton: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        // paddingVertical: 10,
    },
    buttonStyle: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        width: '33%',
        // margin: 10,
        // shadowOffset: { width: 1, height: 1 },
        // shadowColor: "#37BEB7",
        // shadowOpacity: 0.5,
        // elevation: 5,
        // marginBottom: 1,
        // marginLeft: 10,
        // marginRight: 10,
        // marginTop: 10
    },
    imgButton: {
        width: 60,
        height: 60,
        marginLeft: 15,
        marginTop: 5,
        marginRight: 15,
        marginBottom: 5
    },
    buttonTitle: {
        flex: 1,
        fontFamily: Fonts.type.sfuiDisplaySemibold,
        fontSize: 12,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoDesc: {
        fontFamily: "Montserrat-Regular",
        color: "#999",
        fontSize: 12,
        flexWrap: "wrap",
        width: dw * 0.65
    },
    sBtnHead: {
        padding: 1,
        backgroundColor: Colors.brownMoca,
        color: '#FFF',
        width: 55
    },
    sLinkHead: {
        color: '#f3f3f3',
        fontSize: 12,
        fontFamily: Fonts.type.sfuiDisplaySemibold,
        marginLeft: 8
    },
    overviewButton: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 2,
        justifyContent: 'center'
    },
    textButton: {
        fontFamily: Fonts.type.sfuiDisplaySemibold,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontSize: 14,
        width: '80%',
        textAlignVertical: 'top',
    },
};
export default styles;