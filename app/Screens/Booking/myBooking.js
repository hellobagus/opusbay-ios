//import liraries
import React, { Component } from 'react';
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
    Modal,
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
    FooterTab,
    Badge,
    Card,
    Spinner
  } from "native-base";

  import { Actions } from "react-native-router-flux";
  import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

import { Style, Colors } from "../../Themes";
import Styles from "./myBookingStyle";

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';
import moment from 'moment'

import numFormat from "@Component/numFormat";
import numPersen from "@Component/numPersen";


let isMount = false
// create a component
class MyBooking extends Component {

    constructor(props){
      super(props)

      this.state={
        hd : null,

        nupss : [],
        user : "",
        name : "",
        names: '',
        project : [],
        progress: [],
        debtors: [],
        totalterima: [],

        isLoaded: false
    }

      console.log('props cf',props);
    }

    async componentDidMount(){
      isMount = true
      const data = {
        hd : new Headers({
          'Token' : await _getData('@Token')
        }),
        user : await _getData('@User'),
        name : await _getData('@UserId'),
        project : await _getData('@UserProject'),
        names: await _getData('@Name')
      }

      this.setState(data,()=>{
        this.getMyBooking()
        // this.getDebtors()
        // this.getPayProgress()
      })
    }

    getMyBooking = () => {
        const item = this.props.items;
        const emaill = this.state.user;
        // console.log('emaill', emaill);
        {
            isMount
                ? fetch(
                      urlApi +
                          "c_booking/getMyBooking/" +
                          item.db_profile +
                          "/" +
                          item.entity_cd +
                          "/" +
                          item.project_no, 
                      {
                          method: "POST",
                          headers: this.state.hd,
                          body: JSON.stringify({emaill})
                      }
                  )
                      .then(response => response.json())
                      .then(res => {
                          if (!res.Error) {
                              const resData = res.Data;
                              this.setState({ nupss: resData });
                            //   _storeData("@getprice",resData);
                            // this.getDebtors(res);
                          }
                          console.log("getMyNups", res);
                      })
                      .catch(error => {
                          console.log(error);
                      })
                : null;
        }
    };

    

    handleChooseNup(data) {
        // coba yang ini bang
        const getdataNup = this.state.nupss;
        Actions.BookingFormDetail({nupss : data, prevItems: this.props.items})
        // this.setState({ click : true})
    }
    render() {

        const getpaymentprog = this.state.progress;
        const gettotal = this.state.totalterima;
        
        // const payment_progress = getpaymentprog.Persentase;

        console.log('get __paymentprogress', getpaymentprog);
        // console.log('get __paymentprogress__', payment_progress);
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
                   {"My Booking".toUpperCase()}
                 </Text>
               </View>
               <View style={Style.actionBarRight}></View>
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
            {
                this.state.nupss.length == 0 ? (
                    // <Spinner color={Colors.headerOrange} />
                    // <ActivityIndicator />
                     <Container style={Styles.bgValidate}>
                            <View style={Styles.containImages}>
                            <Image
                                style={{width: 110, height: 110}}
                                source={require("../../../assets/images/exclam_gray.png")}
                            />
                            </View>
                            <Text style={[Styles.itemPrice,{alignSelf:'center'}]}>Oops! No Customers here.</Text>
                        </Container>
                ):( 
                    <View>
                    <ScrollView>
                    { this.state.nupss.length > 0 ?
                        this.state.nupss.map((data,key)=>
                            <Card style={{
                                height: null,
                                backgroundColor: 'white',
                                shadowOffset: { width: 1, height: 1 },
                                shadowColor: "#37BEB7",
                                shadowOpacity: 0.5,
                                elevation: 5,
                                paddingHorizontal: 10,
                                paddingVertical: 10
                            }} key={key}>
                                {/* <TouchableOpacity
                                        onPress={() =>
                                            this.handleChooseNup(data)
                                        }
                                    > */}
                                <View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{
                                            fontSize: 12,
                                            textAlign: 'left',
                                            color: '#333',
                                            fontWeight : "bold"
                                        }}>
                                            {data.ProjectName}
                                            </Text>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: '500',
                                            textAlign: 'left',
                                            color: 'green'
                                        }}>
                                            Booking
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        {
                                            data.orderid != null ?
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: '#333'
                                            }}>
                                            
                                                Order ID : {data.orderid}
    
                                            </Text>
                                            :
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: '#333'
                                            }}>
                                            
                                                Order ID : Not Available
    
                                            </Text>

                                        }
                                        
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                            textAlign: 'right',
                                            color: '#333'
                                        }}>
                                           
                                        </Text>

                                        {
                                               data.booking_no && data.booking_no.length > 0 ?
                                               <Text style={{
                                                    fontSize: 12,
                                                    fontWeight: '500',
                                                    textAlign: 'right',
                                                    color: 'green'
                                                }}>
                                                    {data.booking_no}
                                                </Text>
                                            :
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: '#ff6f00'
                                            }}>
                                                0000000000
                                            </Text>
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                            textAlign: 'right',
                                            color: '#333'
                                        }}>
                                           Buyer : {data.Name}
                                        </Text>
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                            textAlign: 'right',
                                            color: 'green',
                                            flex: 1,
                                            flexWrap: 'wrap'
                                        }}>
                                            {data.nup_desc + " | " + " Rp. " + numFormat(data.amounts)}
                                        </Text>
                                        
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                            textAlign: 'right',
                                            color: '#333'
                                        }}>
                                           Agent : {data.agent_name}
                                        </Text>
                                        {
                                               data.sttus && data.sttus == 'P' ?
                                               <Text style={{
                                                    fontSize: 12,
                                                    fontWeight: '500',
                                                    textAlign: 'right',
                                                    color: 'green'
                                                }}>
                                                    POSTED
                                                </Text>
                                            :
                                            data.sttus && data.sttus == 'S'?
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: '#ff6f00'
                                            }}>
                                                PROGRESS
                                            </Text>
                                            :
                                            data.sttus && data.sttus == 'T'?

                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: '#ff6f00'
                                            }}>
                                                PAYMENT PENDING
                                            </Text>
                                            :
                                            data.sttus && data.sttus == 'V'?
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: 'green'
                                            }}>
                                                VERIFICATION
                                            </Text>
                                            :
                                            data.sttus && data.sttus == 'X'?
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: 'red'
                                            }}>
                                                REJECTED
                                            </Text>
                                            :
                                            data.sttus && data.sttus == 'D'?
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: 'red'
                                            }}>
                                                FAILURE
                                            </Text>
                                            :
                                            data.sttus && data.sttus == 'C'?
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: 'red'
                                            }}>
                                                CANCELLED
                                            </Text>
                                            :
                                            data.sttus && data.sttus == 'B'?
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: 'blue'
                                            }}>
                                                BOOKED
                                            </Text>
                                            :
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right',
                                                color: 'red'
                                            }}>
                                                 NOT AVAILABLE
                                            </Text>
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                            textAlign: 'right',
                                            color: '#333'
                                        }}>
                                           
                                        </Text>
                                        {
                                            data.sttus == 'T' ?
                                            <Button rounded
                                                style={{ marginTop: 16, borderRadius: 20, width: '50%' }}
                                                // disabled={true}
                                                onPress={() =>
                                                    this.handleChooseNup(data)
                                                }>
                                                <Text style={Styles.signInBtnText}>ONLINE PAYMENT</Text>
                                            </Button>
                                            :
                                            <Button rounded
                                            style={{ marginTop: 16, borderRadius: 20, width: '50%', backgroundColor: Colors.lightGray }}
                                            // disabled={true}
                                            onPress={() =>
                                                this.handleChooseNup(data)
                                            }
                                            >
                                                <Text style={Styles.signInBtnText}>ONLINE PAYMENT</Text>
                                        </Button>
                                        }
                                        {/* <Button rounded
                                            style={{ marginTop: 16, borderRadius: 20, width: '25%' }}
                                            // disabled={true}
                                            onPress={() => {this.submit(item)}}>
                                                <Text style={Styles.signInBtnText}>PAY</Text>
                                        </Button> */}
                                        
                                    </View>
                                </View>
                                {/* </TouchableOpacity> */}
                            </Card>

                            
                        )
                    :
                    null
                    }
                    </ScrollView>
                </View>
                )
            }
              
             </Content>
             </Container>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default MyBooking;