//import liraries
import React, { Component } from 'react';
import {
    StatusBar,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    ScrollView,
    View,
    Alert
} from "react-native";
import {
    Container,
    Header,
    Content,
    Button,
    Icon,
    Text,
    Card,
    Picker
} from "native-base";

import { Actions } from "react-native-router-flux";
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';

import { Fonts, Style, Colors } from "../../Themes";
import Styles from "./Style";

//1. import komponen untuk upload foto
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob"
;
import { _storeData, _getData } from '@Component/StoreAsync';
import { urlApi } from '@Config/services';
import numFormat from "@Component/numFormat";
import moment from 'moment'

let isMount = false
// create a component
class CustomerDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hd: null,
            isLoaded: true,
            
            user: "",
            name: "",
            selected: "",
            projectName: "",
            towerName: "",
            level_descs: "",
            lot_no: "",
            payment_descs: "",
            payment_amt: "",
            choosebookingtp: '',
            booking_type:'',
        

            //state form
            fullname: '',
            nohp: '',
            email_add: '',
            no_ktp: '',
            citys: '',
            nationality_descs: '',
            addresses: '',
            bookingtp: '',
            amt: '',
            remarks: '',
            entity: '',
            project: '',
            lotnno: '',
            payment_cd: '',
            userId: '',
            Group_cd: '',
            agent_cd: '',
            rowID: '',
            business_id: '',

            reserve_by: '',

            //2. tambahkan state upload foto booking
            pictUrlKTP: '',
            pictUrlNPWP: '',
            pictUrlBuktiTF: '',


            //state looping
            project: [],
            customers: [],
            nationality: [],
            booking_type: [],
            amounts:[],
            sell_price: [],
            paydescs: [],
            trx_amts: [],
            
            // getAgentcd: [],
            // business_id: [],
            db_profile: [],
            entity_cd: [],
            project_no: []
            
            
        }

        console.log('props cf', props);
    }

    async componentDidMount() {
        const userproj = await _getData("@UserProject")
        const items = this.props.customers;
        isMount = true;
        const data = {

            db_profile: userproj[0].db_profile,
            entity_cd: userproj[0].entity_cd,
            project_no: userproj[0].project_no,
            

            reserve_by: items.reserve_by,
            fullname: items.Name,
            nohp: items.Phone,
            email_add: items.email_addr,
            no_ktp: items.ic_no,
            citys: items.city,
            nationality_descs: items.nationality,
            addresses: items.address1,
            bookingtp: items.descs,
            amt: items.nup_amt,
            pictUrlKTP: items.link_ktp,
            pictUrlNPWP: items.link_npwp,
            pictUrlBuktiTF: items.link_bukti_transfer,
            remarks: items.remark

        }
        // console.log('check _getPrice', data.db_profile);
        console.log('coba liat data', data);
        this.setState(data, () => {

            
        });
        console.log('get Props', this.props);

    }



    render() {
        // let { name } = this.state
        // const prevItems = this.props.prevItems;
        const items = this.props.customers;
        // const bsnnnn = this.state.getLoadData;
        // const bsns = bsnnnn[0].business_id;
        // console.log('check BSNS', bsnnnn);

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
                            {"Customers Detail".toUpperCase()}
                        </Text>
                    </View>
                    <View style={Style.actionBarRight}></View>
                </Header>
                <Content
                    style={Style.layoutInner}
                    contentContainerStyle={Style.layoutContent}
                >
                  <View>
                        <ScrollView>
                            <View style={Styles.overview}>
                                <Card style={{
                                    height: null,
                                    backgroundColor: 'white',
                                    shadowOffset: { width: 1, height: 1 },
                                    shadowColor: "#37BEB7",
                                    shadowOpacity: 0.5,
                                    elevation: 5,
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    flex: 1
                                }}>

                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 17,
                                                textAlign: 'left',
                                                color: '#333',
                                                fontWeight: "bold"
                                            }}>
                                                Booking Details
                                    </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, }}>
                                            <Text style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                color: '#333'
                                            }}>
                                                {items.ProjectName}
                                        </Text>
                                        </View>
                                    </View>
                                </Card>
                            </View>

                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Reserved By</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    value={this.state.reserve_by} 
                                    editable={false} 
                                />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Full Name</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({fullname : val})}
                                    value={this.state.fullname}
                                    editable={false}  />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Mobile Number</Text>
                                <TextInput 
                                    keyboardType={"number-pad"}
                                    style={Styles.textInput}
                                    onChangeText={val => this.setState({nohp : val})} 
                                    value={this.state.nohp}
                                    editable={false}  />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Email Address</Text>
                                <TextInput 
                                    keyboardType="email-address"
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({email_add : val})} 
                                    value={this.state.email_add}
                                    editable={false}  />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Identity No.</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({no_ktp : val})} 
                                    value={this.state.no_ktp}
                                    editable={false}  />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>City</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({citys : val})} 
                                    value={this.state.citys}
                                    editable={false}  /> 
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Nationality</Text>
                                <Picker note
                                    mode="dropdown"
                                    style={Styles.textInput}
                                    selectedValue={this.state.nationality_descs}
                                    onValueChange={(val)=>this.setState({nationality_descs:val})}
                                >
                                    <Picker.Item label="Choose Nationality" />
                                    {this.state.nationality.map((data, key) =>
                                        <Picker.Item key={key} label={data.descs} value={data.nationality_cd} />
                                    )}
                                </Picker>
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Your Address</Text>
                                <TextInput
                                    style={Styles.textInput}
                                    multiline={true}
                                    numberOfLines={5}
                                    onChangeText={val => this.setState({addresses : val})} 
                                    value={this.state.addresses}
                                    editable={false} 
                                />
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Booking Type</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({bookingtp : val})} 
                                    value={this.state.bookingtp}
                                    editable={false}  /> 
                                
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Amount</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({amt : val})} 
                                    value={numFormat(this.state.amt)}
                                    editable={false}  /> 
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Your Remarks</Text>
                                <TextInput
                                    style={Styles.textInput}
                                    multiline={true}
                                    numberOfLines={5}
                                    onChangeText={val => this.setState({remarks : val})} 
                                    value={this.state.remarks}
                                />
                                 {this.state.errorremarks ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12
                                    }}
                                > 
                                 ! Remarks Required
                                    </Text>
                                )
                                :null
                            }
                            </View>
                            <View style={Styles.containImageTop}>
                                <Text 
                                style={[
                                    Style.textBlack, 
                                    {paddingTop: 5}
                                ]}
                                
                                >
                                    Upload KTP
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10
                                    }}
                                    // onPress={() => this.showAlert("pictUrlKTP")}
                                    // pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlKTP == null || this.state.pictUrlKTP =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={{uri: (this.state.pictUrlKTP)}} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.containImageTop}>
                                <Text 
                                style={[
                                    Style.textBlack, 
                                    {paddingTop: 5}
                                ]}
                                
                                >
                                    Upload NPWP
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10,
                                    }}
                                    // onPress={() => this.showAlert("pictUrlNPWP")}
                                    // pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlNPWP == null || this.state.pictUrlNPWP =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={{uri: (this.state.pictUrlNPWP)}} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.containImageTop}>
                                <Text 
                                style={[
                                    Style.textBlack, 
                                    {paddingTop: 5}
                                ]}
                                
                                >
                                    Upload Bukti Transfer
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10
                                    }}
                                    // onPress={() => this.showAlert("pictUrlBuktiTF")}
                                    // pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlBuktiTF == null || this.state.pictUrlBuktiTF =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={{uri: (this.state.pictUrlBuktiTF)}} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>

                </Content>
            </Container >
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
    buttonUpload: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        height: 80,
    },

});

//make this component available to the app
export default CustomerDetail;