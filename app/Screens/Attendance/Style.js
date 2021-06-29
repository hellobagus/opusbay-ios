const React = require("react-native");
const { Platform } = React;
import { Fonts, Metrics, Colors } from "../../Themes";

export default {
    layoutContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    homeBg: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
    },

    wrapBtn: { width: "80%", marginTop: 20 },
    wrapImg: { width : 340,height : 340, borderRadius: 5,},
};
