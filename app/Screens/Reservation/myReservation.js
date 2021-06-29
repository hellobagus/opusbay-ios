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
    Card,
    Spinner
  } from "native-base";

  import { Actions } from "react-native-router-flux";
  import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

import { Style, Colors } from "../../Themes";
import Styles from "./Style";

import {_storeData,_getData} from '@Component/StoreAsync';
import {urlApi} from '@Config/services';
import moment from 'moment'

import numFormat from "@Component/numFormat";
import numPersen from "@Component/numPersen";


let isMount = false
// create a component
class MyReservationProjectPage extends Component {

    constructor(props){
      super(props)

      this.state={
        hd : null,

        customers : [],
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
        this.getCustomers()
        // this.getDebtors()
        // this.getPayProgress()
      })

    //   console.log('get Project', data.project.db_profile);
    }

    getCustomers = () => {
        const item = this.props.items;
        {
            isMount
                ? fetch(
                      urlApi +
                          "c_reservate/myReservation/" +
                          item.db_profile +
                          "/" +
                          item.entity_cd +
                          "/" +
                          item.project_no +
                          "/" +
                          this.state.names,
                      {
                          method: "POST",
                          headers: this.state.hd
                      }
                  )
                      .then(response => response.json())
                      .then(res => {
                          if (!res.Error) {
                              const resData = res.Data;
                              this.setState({ customers: resData });
                            //   _storeData("@getprice",resData);
                            this.getDebtors(res);
                          }
                          console.log("getCustomers", res);
                      })
                      .catch(error => {
                          console.log(error);
                      })
                : null;
        }
    };

    getDebtors = res => {
        let result = res.Data;
        const getlotno = result[0].lot_no;
        const item = this.props.items;
        {
            isMount
                ? fetch(
                      urlApi +
                          "c_reservate/getDebtors/" +
                          item.db_profile +
                          "/" +
                          item.entity_cd +
                          "/" +
                          item.project_no +
                          "/"+
                          getlotno,
                      {
                          method: "POST",
                          headers: this.state.hd
                      }
                  )
                      .then(response => response.json())
                      .then(res => {
                          if (!res.Error) {
                              const resData = res.Data;
                              this.setState({ debtors: resData });
                            //   _storeData("@getprice",resData);
                            this.getPayProgress(res);
                          }
                          console.log("getDebtors", res);
                      })
                      .catch(error => {
                          console.log(error);
                      })
                : null;
        }
    };

    getPayProgress = res => {
        let result = res.Data;
        const getdebtors = result[0].debtor_acct;
        const item = this.props.items;

        // console.log('cobaliat _getDebtors', getdebtors);

        {
            isMount
                ? fetch(
                      urlApi +
                          "c_reservate/getPayProgress/" +
                          item.db_profile +
                          "/" +
                          getdebtors,
                      {
                          method: "POST",
                          headers: this.state.hd
                      }
                  )
                      .then((response) => response.json())
                      .then((res) => {
                          if (!res.Error) {
                              const resData = res.Data;
                              const payprog = resData[0].Persentase;
                              const total_terima = resData[0].Total_Penerimaan;
                              this.setState({ progress: payprog, totalterima: total_terima });
                            //   console.log('heheh', payprog);
                              console.log("getPayProgress", res);
                          }else {
                            this.setState({isLoaded: !this.state.isLoaded},()=>{
                            // alert(res.Pesan)
                            });
                        }
                        //   console.log("getPayProgress", res.Data[0].Persentase);

                      })
                      .catch((error) => {
                          console.log(error);
                      })
                : null;
        }
    };


    // getCustomers = () =>{
        
    //     {isMount ?
    //         this.state.project.map((val)=>{
    //             // console.log('hehehe', val);
    //             fetch(urlApi+'c_reservate/myReservation/'+val.db_profile+'/'+this.state.names,{
    //                 method:'GET',
    //                 headers : this.state.hd,
    //             }).then((response) => response.json())
    //             .then((res)=>{
    //                 if(!res.Error){
    //                     const resData = res.Data
    //                     resData.map((data)=>{
    //                         this.setState(prevState=>({
    //                             customers : [...prevState.customers, data]
    //                         }))
    //                     })
    //                     // this.getPayProgress(res)
    //                 } else {
    //                     this.setState({isLoaded: !this.state.isLoaded},()=>{
    //                         // alert(res.Pesan)
    //                     });
    //                 }
    //                 console.log('getCustomers',res);
    //             }).catch((error) => {
    //                 console.log(error);
    //             })
    //         })
    //     :null}
    // }

    // getPayProgress = res =>{
    //     let result = res.Data[0];
    //     const getName = result.Name;
    //     const useprj = this.state.project;
    //     const db_profile = useprj[0].db_profile;

    //     console.log('getName', getName);
    //     console.log('gett __dbProfile', db_profile);

    //     {isMount ?
    //         this.state.project.map((val)=>{
    //             fetch(urlApi+'c_reservate/getPayProgress/'+val.db_profile+'/'+getName,
    //             {
    //                 method:'POST',
    //                 headers : this.state.hd,
    //             }
    //             )
    //             .then(response => response.json())
    //             .then(res =>{
    //                 if(!res.Error){
    //                     const resData = res.Data
    //                     const payment_prog = resData.payment_progress
    //                     this.setState({ progress: payment_prog, isLoaded: true });
    //                 } 
                    // else {
                    //     this.setState({isLoaded: !this.state.isLoaded},()=>{
                    //     alert(res.Pesan)
                    //     });
                    // }
    //                 console.log('getProgress',res);
    //             }).catch((error) => {
    //                 console.log(error);
    //             })
    //         })
    //     :null}
    // }

    clickChouseUnit(item) {
      
        Actions.chouseunit({
          unitItems : item,
          items : this.props.item,
          prevItems : this.props.prevItems
        });
        // this.setState({ click : true})
    }
    clickUnitEnquiry() {
        Actions.unitenquiry();
        this.setState({ click : true})
    }


    handleChooseCustomer(data) {
      
        Actions.CustomerDetail({customers : data})
        // this.setState({ click : true})
    }
    render() {

        const getpaymentprog = this.state.progress;
        const gettotal = this.state.totalterima;
        
        // const payment_progress = getpaymentprog.Persentase;

        // console.log('get __paymentprogress', getpaymentprog);
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
                   {"Choose Customers".toUpperCase()}
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
            {/* {
                !this.state.isLoaded ? (
                    <Spinner color={Colors.headerOrange} />
                ):( */}
                    <View>
                    <ScrollView>
                    { this.state.customers.length > 0 ?
                        this.state.customers.map((data,key)=>
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
                                <TouchableOpacity
                                        onPress={() =>
                                            this.handleChooseCustomer(data)
                                        }
                                    >
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
                                            {data.StatusText}
                                        </Text>
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
                                            color: '#333'
                                        }}>
                                            {data.Property + " | " + data.Level}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                            textAlign: 'right',
                                            color: '#333'
                                        }}>
                                           Sell Price : Rp. {numFormat(data.sell_price)}
                                        </Text>
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                            textAlign: 'right',
                                            color: '#333'
                                        }}>
                                            {data.LotTypeDesc}
                                        </Text>
                                    </View>
                                    
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        
                                            {/* <View>
                                                <Text style={{
                                                        fontSize: 12,
                                                        fontWeight: '500',
                                                        textAlign: 'right',
                                                        color: '#02da00'
                                                }}>
                                                     No payment progress
                                                </Text>
                                            </View> */}
                                            {
                                                getpaymentprog && getpaymentprog.length > 0 && data.Status =='B' || data.Status == 'A' && gettotal !== 0 && gettotal !== null ?
                                                <View>
                                                <Text style={{
                                                        fontSize: 12,
                                                        fontWeight: '500',
                                                        textAlign: 'right',
                                                        color: '#02da00'
                                                }}>
                                                     Payment Progress : {numPersen(getpaymentprog)}
                                                </Text>
                                            </View>
                                            :
                                            <View>
                                                <Text style={{
                                                        fontSize: 12,
                                                        fontWeight: '500',
                                                        textAlign: 'right',
                                                        color: '#02da00'
                                                }}>
                                                     Payment Progress : 0 %
                                                </Text>
                                            </View>
                                            }
                                            
                                        
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '500',
                                            textAlign: 'right',
                                            color: '#ff720d'
                                        }}>
                                            {data.LotNo}
                                        </Text>
                                    </View>
                                </View>
                                </TouchableOpacity>
                            </Card>

                            
                        )
                    :
                        <Container style={Styles.bgValidate}>
                            <View style={Styles.containImages}>
                            <Image
                                style={{width: 110, height: 110}}
                                source={require("../../../assets/images/exclam_gray.png")}
                            />
                            </View>
                            <Text style={[Styles.itemPrice,{alignSelf:'center'}]}>Oops! No Customers here.</Text>
                        </Container>
                    }
                    </ScrollView>
                </View>
                {/* )
            } */}
              
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
export default MyReservationProjectPage;