import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import { Scene, Router } from "react-native-router-flux";
import { Root } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import Home from "./Screens/Home/Home";
import Login from "./Screens/Intro/Intro";
import Signup from "./Screens/Signup/Signup";
import SignupAgent from "./Screens/Signup/SignupAgent";
import forgotPass from './Screens/Signup/forgotPass';
import Reset from "./Screens/ResetPass/Reset";
import Search from "./Screens/Find/Search";
import Calcu from "./Screens/Calcu/Calcu";
import Notif from "./Screens/Notif/Notif";
import Akun from "./Screens/Akun/Akun";
import AkunHome from "./Screens/Akun/AkunHome";
import PDFViewer from "./components/PDFViewer/index";

import Helpdesks from "./Screens/Helpdesk/Helpdesks";


import PropertyDetail from "./Screens/Property/PropertyDetail";

import Categoris from "./Screens/Categoris/Categoris";
import Unitgoris from "./Screens/Categoris/Unitgoris";
import Unittype from "./Screens/Categoris/Unittype";
import UnitDetail from "./Screens/Categoris/UnitDetail";

import ChouseFloor from "./Screens/Categoris/ChouseFloor";
import ChooseTower from "./Screens/Categoris/ChooseTower";
import ChouseUnit from "./Screens/Categoris/ChouseUnit";
import UnitInfo from "./Screens/Categoris/UnitInfo";
import UnitEnquiry from "./Screens/Categoris/UnitEnquiry";

//Reservation
import MyReservationProjectPage from "./Screens/Reservation/myReservation";
import CustomerDetail from "./Screens/Reservation/CustomerDetail";

//Unit
import MyUnitPage from "./Screens/MyUnit/myUnit";
import MyUnitDetailPage from "./Screens/MyUnit/myUnitDetail";
import UnitPaymentSchedule from "./Screens/MyUnit/UnitPaymentSchedule";

//Billing
import MyBillingPage from "./Screens/MyBilling/myBilling";

//Profile
import Profile from "./Screens/Profile";

//Feed
import Feed from "./Screens/Feed/Feed";

//News And Promo
import NewsPage from "./Screens/NewsAndPromo/news";

//Booking
import BookingPage from "./Screens/Booking/Booking";
import BookingDetail from "./Screens/Booking/BookingDetail";
import MyBooking from "./Screens/Booking/myBooking";
import BookingFormDetail from "./Screens/Booking/BookingFormDetail";


//Project
import Project from "./Screens/Project/Search";

//Download
import DownloadPage from "./Screens/Download/Download";

//Download
import NewsAndPromoDetail from "./Screens/NewsAndPromo/NewsAndPromoDetail";

//Report
import ReportPage from "./Screens/Reports/Reports";
import ManagementReport from "./Screens/Reports/ManagementReports";

//Report New
import ReportNew from "./Screens/ReportNew/ReportNew";

//Comission
import Comission from "./Screens/Comission/Comission";

// NUP
import NUPPage from "./Screens/NUP/NUP";
import NUPconfirmPage from "./Screens/NUP/NUPDetailConfirm";
import MyNup from "./Screens/MyNUP/myNup";
import NupDetails from "./Screens/MyNUP/NupDetail";

//Attendance
import Attendance from "./Screens/Attendance";

import Dashboard from "./Screens/Reports/Dashboard";

import { _storeData, _getData } from "@Component/StoreAsync";

import Menu from "./Screens/Menu/Menu";
import SignupGuest from "./Screens/Signup/SignupGuest";
import SignupGuests from "./Screens/Signup/SignupGuests";
import webview from "./components/WebView"

import FaqPage from "./Screens/FAQ/Faq";
import FaqDetailPage from "./Screens/FAQ/FaqDetail";
import FaqQuestionPage from "./Screens/FAQ/FaqQuestion";
import HelpCenterPage from "./Screens/FAQ/Helpcenter";


import Outstandings from "./Screens/Outstanding/Outstandings";
import OutstandingDetail from "./Screens/Outstanding/OutstandingDetail";
import OutstandingPayment from "./Screens/Outstanding/OutstandingPayment";

const TabIcon = ({ focused, iconName }) => {
    var color = focused ? '#a61f21' : "#7f8c8d";
    return (
        <Icon
            name={iconName}
            color={color}
            size={24}
            style={{ marginTop: 8 }}
        />
    );
};

class Routes extends Component {
    constructor() {
        super();

        this.state = {
            hasLogin: false,
            isLoaded: false
        };
    }

    async componentDidMount() {
        try {
            const isLogin = await _getData("@isLogin");
            console.log("isLogin: ", isLogin);
            if (isLogin) {
                this.setState({ hasLogin: true, isLoaded: true });
            } else {
                this.setState({ hasLogin: null, isLoaded: true });
            }
        } catch (err) {
            console.log("error: ", err);
        }
    }
    

    render() {
        // const reducerCreate = (params) => {
        //     const defaultReducer = new Reducer(params)
        //     return (state, action) => {
        //       console.log('Action :', action)
        //       console.log('State :', state)
        //       return defaultReducer(state, action)
        //     }
        //   }
        if (!this.state.isLoaded) {
            return <ActivityIndicator />;
        } else {
            return (
                <Root>
                    <Router>
                        <Scene key="root" headerLayoutPreset="center">
                            <Scene
                                key="Login"
                                initial={!this.state.hasLogin}
                                component={Login}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="tabbar"
                                initial={this.state.hasLogin}
                                hideNavBar
                                translucent={true}
                                tabs={true}
                            >
                                <Scene
                                    key="home"
                                    component={Home}
                                    navTransparent={true}
                                    hideNavBar={true}
                                    title=""
                                    tabBarLabel="Home"
                                    activeTintColor="#a2d"
                                    inactiveTintColor="#fff"
                                    iconName="home"
                                    icon={TabIcon}
                                />
                                <Scene
                                    key="ListingProjectPage"
                                    component={Search}
                                    navTransparent={true}
                                    hideNavBar={true}
                                    title=""
                                    tabBarLabel="Project"
                                    iconName="building-o"
                                    icon={TabIcon}
                                />
                                <Scene
                                    key="Menu"
                                    component={Menu}
                                    navTransparent={true}
                                    hideNavBar={true}
                                    title=""
                                    tabBarLabel="Menu"
                                    iconName="bars"
                                    icon={TabIcon}
                                />
                                {/* <Scene
                                    key="notif"
                                    component={Notif}
                                    navTransparent={true}
                                    hideNavBar={true}
                                    title=""
                                    tabBarLabel="Notification"
                                    iconName="bell"
                                    icon={TabIcon}
                                /> */}
                                
                                <Scene
                                    key="akun"
                                    component={AkunHome}
                                    navTransparent={true}
                                    hideNavBar={true}
                                    title=""
                                    tabBarLabel="Account"
                                    iconName="user"
                                    icon={TabIcon}
                                />
                            </Scene>
                            <Scene
                                key="Outstandings"
                                component={Outstandings}
                                hideNavBar={true}
                                title=""
                            />

<Scene
                                key="OutstandingDetail"
                                component={OutstandingDetail}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="OutstandingPayment"
                                component={OutstandingPayment}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="propertydetail"
                                component={PropertyDetail}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="webview"
                                component={webview}
                                hideNavBar={true}
                                title=""
                                onBack={()=>{this.Categoris}}
                                back={true}

                            />
                            <Scene
                                key="categoris"
                                component={Categoris}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="FaqPage"
                                component={FaqPage}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene 
                                key="FaqQuestionPage"
                                component={FaqQuestionPage}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="FaqDetailPage"
                                component={FaqDetailPage}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="HelpCenterPage"
                                component={HelpCenterPage}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="unitgoris"
                                component={Unitgoris}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="forgotPass"
                                component={forgotPass}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="unittype"
                                component={Unittype}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="unitdetail"
                                component={UnitDetail}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="chousefloor"
                                component={ChouseFloor}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="Helpdesks"
                                component={Helpdesks}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="ProductProjectPage"
                                component={ChooseTower}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="chouseunit"
                                component={ChouseUnit}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="unitinfo"
                                component={UnitInfo}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="UnitEnquiryProjectPage"
                                component={UnitEnquiry}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="profile"
                                component={Profile}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                    key="ManagementReport"
                                    component={ManagementReport}
                                    hideNavBar={true}
                                    title=""
                            />

                            <Scene
                                key="MyReservationProjectPage"
                                component={MyReservationProjectPage}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="MyNup"
                                component={MyNup}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="NUPconfirmPage"
                                component={NUPconfirmPage}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="MyUnitPage"
                                component={MyUnitPage}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="MyUnitDetailPage"
                                component={MyUnitDetailPage}
                                hideNavBar={true}
                                title=""
                            />
                            
                            <Scene 
                            key="BookingFormDetail"
                            component={BookingFormDetail}
                            hideNavBar={true}
                            title=""
                            />

                            <Scene
                                key="UnitPaymentSchedule"
                                component={UnitPaymentSchedule}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="CustomerDetail"
                                component={CustomerDetail}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="SimulasiPage"
                                component={Calcu}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="NewsPage"
                                component={NewsPage}
                                hideNavBar={true}
                                title=""
                            />

                            <Scene
                                key="BookingPage"
                                component={BookingPage}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="BookingDetail"
                                component={BookingDetail}
                                hideNavBar={true}
                                title=""
                            />
                             <Scene
                                key="MyBooking"
                                component={MyBooking}
                                hideNavBar={true}
                                title=""
                            />


                            <Scene
                                key="project"
                                component={Project}
                                hideNavBar={true}
                                title=""
                            />
  
                            <Scene
                                key="TWPBillProjectPage"
                                component={MyBillingPage}
                                hideNavBar={true}
                                title=""
                            />
                                
                            <Scene
                                key="ProjectDownloadPage"
                                component={DownloadPage}
                                hideNavBar={true}
                                title=""
                            />
                            {/* //!! Sementara diubah Dulu */}
                            <Scene
                                key="ReportProject"
                                component={ReportNew}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="Dashboard"
                                component={Dashboard}
                                hideNavBar={false}
                                title=""
                            />
                            <Scene
                                key="NewsAndPromoDetail"
                                component={NewsAndPromoDetail}
                                hideNavBar={true}
                                title=""
                            />

                            {/*//! Sementara diubah  */}
                            <Scene
                                key="ReportNew"
                                component={ReportPage}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="ComissionPage"
                                component={Comission}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="NUPPage"
                                component={NUPPage}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="Signup"
                                component={Signup}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="ResetPass"
                                component={Reset}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="PDFViewer"
                                component={PDFViewer}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="menu"
                                component={Akun}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="Feed"
                                component={Feed}
                                hideNavBar={true}
                                title=""
                            />
                            {/* <Scene
                                key="NUPPay"
                                component={NUPPay}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="NUPDetail"
                                component={NUPDetail}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="NUPTerm"
                                component={NUPTerm}
                                hideNavBar={true}
                                title=""
                            /> */}
                            <Scene
                                key="Attendance"
                                component={Attendance}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="SignupAgent"
                                component={SignupAgent}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="SignupGuest"
                                component={SignupGuest}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="SignupGuests"
                                component={SignupGuests}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="SignupGuest"
                                component={SignupGuest}
                                hideNavBar={true}
                                title=""
                            />
                            <Scene
                                key="NupDetails"
                                component={NupDetails}
                                hideNavBar={true}
                                title=""
                            />
                        </Scene>
                    </Router>
                </Root>
            );
        }
    }
}

export default Routes;
