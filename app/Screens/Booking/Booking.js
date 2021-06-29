//import liraries
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
  TouchableHighlight,
  SafeAreaView
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Text,
  Card,
  Picker,
  InputGroup,
} from "native-base";

import { Actions } from "react-native-router-flux";
import ParallaxScroll from "@monterosa/react-native-parallax-scroll";

import { Fonts, Style, Colors } from "../../Themes";
import Styles from "./Style";

//1. import komponen untuk upload foto
import ImagePicker from "react-native-image-crop-picker";
import RNFetchBlob from "rn-fetch-blob";
import { _storeData, _getData } from "@Component/StoreAsync";
import { urlApi } from "@Config/services";
import numFormat from "@Component/numFormat";
import moment from "moment";
import IntlPhoneInput from '@Component/CountryCode';

let isMount = false;
// create a component
class BookingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hd: null,
      isLoaded: true,
      isLoadeds: true,

      user: "",
      name: "",
      selected: "",
      projectName: "",
      towerName: "",
      level_descs: "",
      lot_no: "",
      payment_descs: "",
      payment_amt: "",
      choosebookingtp: "",
      booking_type: "",
      db_profile: "",

      //state form
      fullname: "",
      nohp: "",
      email_add: "",
      no_ktp: "",
      citys: "",
      nationality_descs: "",
      addresses: "",
      bookingtp: "",
      amt: "",
      remarks: "",
      entity: "",
      project: "",
      lotnno: "",
      payment_cd: "",
      userId: "",
      Group_cd: "",
      agent_cd: "",
      rowID: "",
      business_id: "",

      //2. tambahkan state upload foto booking
      pictUrlKTP: "",
      pictUrlNPWP: "",
      pictUrlBuktiTF: "",

      //state looping
      project: [],
      customers: [],
      nationality: [],
      booking_type: [],
      amounts: [],
      sell_price: [],
      paydescs: [],
      trx_amts: [],
      email: "",
      refcode: [],
      referralcd: "",
      getBookingNo: [],
      redcodeValid: [],
      redcodeError: [],
      redcode: [],
      towers: [],
      order_id: "",
      current_date: new Date()

      // getAgentcd: [],
      // business_id: [],
    };

    console.log("props cf", props);
  }

  async componentDidMount() {
    // start : 2.
    const items = this.props.items;
    const datas = this.props.datas;
    const prevItems = this.props.prevItems;
    const getprc = await _getData("@getprice");
    // end : 2.
    isMount = true;
    const data = {
      email: await _getData("@User"),
      name: await _getData("@Name"),
      no_hp: await _getData("@Handphone"),
      token: await _getData("@Token"),
      userId: await _getData("@UserId"),
      Group_cd: await _getData("@Group"),
      agent_cd: await _getData("@AgentCd"),

      paydescs: datas.descs,
      trx_amts: datas.trx_amt,
      sell_price: getprc.trx_amt2,
      lotnno: items.lot_no,
      entity: prevItems.entity_cd,
      project: prevItems.project_no,
      payment_cd: getprc.payment_cd,
      phase_cd: datas.phase_cd,
      towers: prevItems.towerDescs
    };

    console.log("check _getPrice", getprc);
    console.log("coba liat data", data);
    this.setState(data, () => {
      // this.getMedia()
      this.getNationality();
      this.getBookingType();
      // this.getAmount();
      // this.getAgent();
      this.getSprice();
      this.getLoadData();
      // this.getReferalCode();
    });
    console.log(
      "get __GoTo from booking or unit enquiry",
      this.props.goToItems
    );
  }

  // goBacktoUnit(){
  //      Actions.chousefloor({
  //         prevItems: this.props.prevItems,
  //        gotoTheItem: this.props.gotoTheItem,
  //       item: this.props.theTems
  //   });
  // }

  getNationality = () => {
    const items = this.props.prevItems;
    // console.log('got item', items);

    {
      isMount
        ? fetch(urlApi + "c_booking/getNationality/" + items.db_profile, {
            method: "GET",
            // method:'POST',
            // body: JSON.stringify({province_cd})
            // headers : this.state.hd,
          })
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({ nationality: resData });
              } else {
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                  alert(res.Pesan);
                });
              }
              console.log("getNationality", res);
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  };


  getBookingType = () => {
    const items = this.props.prevItems;
    // console.log('got item', items);
    {
      isMount
        ? fetch(
            urlApi +
              "c_booking/getNupType/" +
              items.db_profile +
              "/" +
              items.entity_cd +
              "/" +
              items.project_no,
            {
              method: "GET",
              // method:'POST',
              // body: JSON.stringify({province_cd})
              // headers : this.state.hd,
            }
          )
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({ booking_type: resData });
                _storeData("@checkNUP", resData);
                // this.getOrderId(res);
              } else {
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                  alert(res.Pesan);
                });
              }
              console.log("getBookingType", res);
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  };

  getOrderId = (val) => {
    const orderid = val.trim() + Math.floor(Math.random() * 1000001);
    this.setState({ order_id: orderid });
    console.log('check orderID', orderid);
  }

  getAgent = () => {
    const items = this.props.prevItems;
    // console.log('got item', items);
    {
      isMount
        ? fetch(urlApi + "c_booking/getAgent/" + items.db_profile, {
            method: "GET",
            // method:'POST',
            // body: JSON.stringify({province_cd})
            // headers : this.state.hd,
          })
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data;
                this.setState({ agent: resData });
                // _storeData("@checkNUP", resData);
                // console.log('get',);
              } else {
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                  alert(res.Pesan);
                });
              }
              console.log("getAgent", res);
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  };

  getAmount = async (val) => {
    if (val != undefined) {
      const items = this.props.prevItems;
      const dataBtype = await _getData("@checkNUP");
      const nup_type = dataBtype[0].nup_type;
      console.log("got nuptype", nup_type);
      {
        isMount
          ? fetch(
              urlApi +
                "c_booking/getAmount/" +
                items.db_profile +
                "/" +
                items.entity_cd +
                "/" +
                items.project_no +
                "/",
              {
                // method: 'GET',
                method: "POST",
                body: JSON.stringify({ nup_type }),
                // headers : this.state.hd,
              }
            )
              .then((response) => response.json())
              .then((res) => {
                if (!res.Error) {
                  const resData = res.Data;
                  this.setState({ amounts: resData });
                  console.log("liat amou", resData);
                } else {
                  this.setState({ isLoaded: !this.state.isLoaded }, () => {
                    alert(res.Pesan);
                  });
                }
                // console.log('getAmount',res.Data.amount);
              })
              .catch((error) => {
                console.log(error);
              })
          : null;
      }
    } else {
      const items = this.props.prevItems;
      const dataBtype = await _getData("@checkNUP");
      const nup_type = dataBtype[0].nup_type;
      console.log("got nuptype", nup_type);
      {
        isMount
          ? fetch(
              urlApi +
                "c_booking/getAmount/" +
                items.db_profile +
                "/" +
                items.entity_cd +
                "/" +
                items.project_no +
                "/",
              {
                // method: 'GET',
                method: "POST",
                body: JSON.stringify({ nup_type }),
                // headers : this.state.hd,
              }
            )
              .then((response) => response.json())
              .then((res) => {
                if (!res.Error) {
                  const resData = res.Data;
                  this.setState({ amounts: resData });
                  console.log("liat amou", resData);
                } else {
                  this.setState({ isLoaded: !this.state.isLoaded }, () => {
                    alert(res.Pesan);
                  });
                }
                // console.log('getAmount',res.Data.amount);
              })
              .catch((error) => {
                console.log(error);
              })
          : null;
      }
    }
  };

  getSprice = () => {
    const item = this.props.items;
    const items = this.props.prevItems;
    const pay_cd = this.state.payment_cd;

    // console.log('get __payCD', item);
    {
      isMount
        ? fetch(
            urlApi +
              "c_booking/getSprice/" +
              items.db_profile +
              "/" +
              items.entity_cd +
              "/" +
              items.project_no +
              "/" +
              pay_cd +
              "/" +
              item.lot_no,
            {
              method: "POST",
              headers: this.state.hd,
            }
          )
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data[0];
                this.setState({ sell_price: resData });
                //   _storeData("@getprice",resData);
              }
              console.log("getSPrice", res);
            })
            .catch((error) => {
              //   console.log(error);
            })
        : null;
    }
  };

  getLoadData = () => {
    const items = this.props.prevItems;
    const userid = this.state.userId;
    const rowid = this.state.rowID;

    console.log("get _userID", userid);
    console.log("get _rowID", rowid);

    {
      isMount
        ? fetch(
            urlApi +
              "c_booking/myReservation/" +
              items.db_profile +
              "/" +
              userid +
              "/" +
              rowid,
            {
              method: "POST",
              headers: this.state.hd,
            }
          )
            .then((response) => response.json())
            .then((res) => {
              if (!res.Error) {
                const resData = res.Data[0].business_id;
                this.setState({ business_id: resData });
                //   _storeData("@getprice",resData);
                // console.log('check RESDATA', resData)
              }
              console.log("check _getLoadData", res);
            })
            .catch((error) => {
              //   console.log(error);
            })
        : null;
    }
  };


  selectAmount = (val) => {
    // alert('tes');
    console.log('val',val);

    if (val == undefined) {
    } else {
      this.setState({ bookingtp: val }, () => {
        this.getAmount(val);
        this.getOrderId(val);
      });
    }
  };

  getReferalCode(referecd) {
    const today = this.state.current_date; 
    const addhour = moment(today).add(1, 'hours')
    const datetm = moment(addhour).format("DD/MM/YYYY H:mm:ss");
    
    console.log('daate', datetm);
    {
      isMount
        ? fetch(
            "https://staging-cmsapi-tsh.synectics.digital/api/referral-validate/" +
              referecd,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "api-key": "ckCmflViJgFGt1VCaNssdBp8NWKpTUhn",
              }
            }
          )
            .then((response) => response.json())
            .then((res) => {
              console.log("getRefCode", res);
              if (!res.Error) {
                const resData = res.data;
                // this.setState({ refcode: resData });
                if (res.status == 'ok') {
                  this.setState({ refcode: res });
                  alert("Voucher Status : " + res.data.voucherStatus);
                  // this.getRedeemCode(res);
                }else{
                  alert("Voucher Status : " + res.error.voucherStatus);
                }
                
              } else {
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                  // alert(res.Pesan)
                  alert("Voucher Status : " + res.error.voucherStatus);
                });
              }
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  }

  // getRedeemCode = res => {
    getRedeemCode = refer_code => {
    let result = refer_code;
    console.log('get result', result);
    // let result = res.data;
    const ref_code = result.referralCode;
    const refmemberID = result.memberID;
    const {
      fullname
    } = this.state;
    const ref_name = fullname;
    const today = this.state.current_date; 
    const addhour = moment(today).add(1, 'hours')
    const datetm = moment(addhour).format("DD/MM/YYYY H:mm:ss");
    const order_id = this.state.order_id;

    console.log('check orderid on redeemcode', order_id);
    console.log('getRefCode', ref_code);
    console.log('get datetime', datetm);

    {
      isMount
        ? fetch(
            "https://staging-cmsapi-tsh.synectics.digital/api/redeem-referral",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "api-key": "ckCmflViJgFGt1VCaNssdBp8NWKpTUhn",
              },
              body: JSON.stringify({
                referralCode: ref_code,
                refereeName: ref_name,
                refereeMemberID: refmemberID,
                TrxRef: order_id,
                PropertyName:"Opus Bay",
                PropertyCode:"OB01",
                datetime: datetm
              })
            }
          )
            .then((response) => response.json())
            .then((res) => {
              console.log("getRedCode", res);
              if (!res.Error) {
                const resDataValid = res.data;
                const resDataError = res.error;
                const resData = res;
                this.setState({ redcodeValid: resDataValid, redcodeError: resDataError, redcode: resData });
                if (res.status == 'ok') {
                  console.log("voucher status = ", res.data.voucherStatus);
                }else{
                  console.log("voucher status = ", res.error.voucherStatus);
                }
                console.log('resData', resData);
                
              } else {
                this.setState({ isLoaded: !this.state.isLoaded }, () => {
                  // alert(res.Pesan)
                  alert("Voucher Status : " + res.error.voucherStatus);
                });
              }
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  }

  //2. tambahkan beberapa function untuk upload photo
  // ------START-----

  fromCamera(key) {
    ImagePicker.openCamera({
      cropping: true,
      width: 600,
      height: 600,
    })
      .then((image) => {
        console.log("Receive Image", image);
        this.setState({ [key]: { uri: image.path } });
      })
      .catch((e) => console.log("tag", e));
  }

  fromGallery(key) {
    ImagePicker.openPicker({
      multiple: false,
      width: 600,
      height: 600,
    })
      .then((image) => {
        console.log("Received Image", image);
        this.setState({ [key]: { uri: image.path } });
      })
      .catch((e) => console.log("tag", e));
  }

  showAlert = (key) => {
    Alert.alert(
      "Select a Photo",
      "Choose the place where you want to get a photo",
      [
        { text: "Gallery", onPress: () => this.fromGallery(key) },
        { text: "Camera", onPress: () => this.fromCamera(key) },
        {
          text: "Cancel",
          onPress: () => console.log("User Cancel"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  validating = (validationData) => {
    const keys = Object.keys(validationData);
    const errorKey = [];
    let isValid = false;

    keys.map((data, key) => {
      if (validationData[data].require) {
        let isError =
          !this.state[data] || this.state[data].length == 0 ? true : false;
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

  onChangeTextPhone = ({dialCode, unmaskedPhoneNumber, phoneNumber, isVerified}) => {
        
    this.setState({nohp :dialCode + unmaskedPhoneNumber});
    // console.log(dialCode, unmaskedPhoneNumber, phoneNumber, isVerified);
    // console.log('nohp',this.state.nohp);
  };

  // ------END-------

  // --------------------- START ACTION SUBMIT ------------------


  submitCash = () => {
    this.setState({ isLoaded: !this.state.isLoaded });

    let filektp = "";
    if (this.state.pictUrlKTP == 0 || this.state.pictUrlKTP.uri == "undefined") {
        filektp = null;
    }
    else{
    filektp = RNFetchBlob.wrap(
            this.state.pictUrlKTP.uri.replace("file://", "")
        );
    }

    let filenpwp = "";
    if (this.state.pictUrlNPWP == 0 || this.state.pictUrlNPWP.uri == "undefined") {
        filenpwp = null;
    }
    else{
    filenpwp = RNFetchBlob.wrap(
            this.state.pictUrlNPWP.uri.replace("file://", "")
        );
    }

    let filebuktitf = "";
    if (this.state.pictUrlBuktiTF == 0 || this.state.pictUrlBuktiTF.uri == "undefined") {
        filebuktitf = null;
    }
    else{
    filebuktitf = RNFetchBlob.wrap(
            this.state.pictUrlBuktiTF.uri.replace("file://", "")
        );
    }


    const items = this.props.prevItems;
    const refereememberID = this.state.refcode.memberID;
    
    
    let jsoncd = '';
    const getredeem = this.state.refcode

    if(getredeem.status == 'error'){
      jsoncd = JSON.parse(JSON.stringify(getredeem))
    }else if(getredeem.status == 'ok'){
      jsoncd = JSON.parse(JSON.stringify(getredeem))
    }else{
      jsoncd = " "
    }


    let refmembers = "";
    if(refereememberID == "" || refereememberID == 'undefined' || refereememberID == null ){
      refmembers = " ";
    }else{
      refmembers = refereememberID;
    }
    
    console.log('get jsoncd', jsoncd);
    console.log('get redeem', JSON.parse(JSON.stringify(getredeem)));

    const refer_code = this.state.refcode;
    console.log('check refercode', refer_code);

    const {
      name,
      fullname,
      nohp,
      email_add,
      no_ktp,
      citys,
      nationality_descs,
      addresses,
      booking_type,
      amounts,
      remarks,
      userId,
      lotnno,
      entity,
      project,
      payment_cd,
      rowID,
      business_id,
      sell_price,
      Group_cd,
      email,
      phase_cd,
      referralcd,
      order_id
    } = this.state;

    // console.log('check order_id on submitCash', order_id);

    let remarkz = "";
    if (remarks == ""){
      remarkz = ""
    }else{
      remarkz = remarks
    }

    const formData = {
      bookedby: name,
      fullname: fullname,
      nohp: nohp,
      email_add: email_add,
      no_ktp: no_ktp,
      citys: citys,
      nationality_descs: nationality_descs,
      addresses: addresses,
      book_type: booking_type,
      amounts: amounts,
      remarks: remarkz,
      userID: userId,
      mailadd: email,
      lotNo: lotnno,
      entitys: entity,
      projects: project,
      payment_cds: payment_cd,
      rowID: rowID,
      business_id: business_id,
      sell_price: sell_price,
      Group_cd: Group_cd,
      productcd: items.product_cd,
      prodtype: items.product_descs,
      refcode: referralcd,
      

      pictUrlKTP: filektp,
      pictUrlNPWP: filenpwp,
      pictUrlBuktiTF: filebuktitf,
      phase_cd: phase_cd,
      order_id: order_id,
      refmemberID: refmembers,
      res_json: jsoncd
    };

    const isValid = this.validating({
      fullname: { require: true },
      nohp: { require: true },
      email_add: { require: true },
      no_ktp: { require: true },
      citys: { require: true },
      nationality_descs: { require: true },
      addresses: { require: true },
      bookingtp: { require: true },
      amounts: { require: true },
    });

    const _fullname = fullname.replace(/\s+/g, "_");

    let fileNameKtp = "";
    if (this.state.pictUrlKTP == 0 || this.state.pictUrlKTP.uri == "undefined") {
        fileNameKtp = null;
    }
    else{
        fileNameKtp = "KTP_RegistAgent_"+_fullname+".png";
    }

    let fileNameNpwp = "";
    if (this.state.pictUrlNPWP == 0 || this.state.pictUrlNPWP.uri == "undefined") {
        fileNameNpwp = null;
    }
    else{
        fileNameNpwp = "NPWP_RegistAgent_"+_fullname+".png";
    }

    let fileNameBuktiTf = "";
    if (this.state.pictUrlBuktiTF == 0 || this.state.pictUrlBuktiTF.uri == "undefined") {
        fileNameBuktiTf = null;
    }
    else{
        fileNameBuktiTf = "BuktiTF_RegistAgent_"+_fullname+".png";
    }

    console.log("_getDataSaveBooking", formData);


    if (isValid) {
      if (this.state.pictUrlKTP == null|| this.state.pictUrlKTP.uri == null || this.state.pictUrlNPWP == null|| this.state.pictUrlNPWP.uri == null || this.state.pictUrlBuktiTF == null|| this.state.pictUrlBuktiTF.uri == null) {
        alert("Please Upload Photo!");
                this.setState({
                    isLoaded: true
        });
      }else{
        // alert("Success");
        // this.setState({
        //     isLoaded: true
        // });
        // if(refer_code != null || refer_code.length != 0){
        //   this.getRedeemCode(refer_code);
        //   // alert("Successs");
        //   // this.setState({
        //   //   isLoaded: true
        //   // });
        // }else{
        //   alert("Failed");
        //   this.setState({
        //     isLoaded: true
        //   });
        // }

      RNFetchBlob.fetch(
        "POST",
        urlApi + "c_booking/saveBooking/" + items.db_profile,
        {
          "Content-Type": "multipart/form-data",
        },
        [
          { name: "photoktp", filename: fileNameKtp, data: filektp },
          { name: "photonpwp", filename: fileNameNpwp, data: filenpwp },
          {
            name: "photobuktitf",
            filename: fileNameBuktiTf,
            data: filebuktitf,
          },
          { name: "data", data: JSON.stringify(formData) },
        ]
      ).then((resp) => {
        console.log("res_if", resp);
        const res = JSON.parse(resp.data);
        console.log("get __formData", res);

        console.log(res.Pesan);
        if (!res.Error) {
          this.setState({ isLogin: true }, () => {
            alert(res.Pesan);
            Actions.popTo('chousefloor');
            setTimeout(() => Actions.refresh())
            // const rez = 
            // this.getRedeemCode()
            // Actions.refresh({onBack:()=>this.goBacktoUnit()})
          });
            this.getRedeemCode(refer_code.data);
        } else {
          this.setState({ isLoaded: !this.state.isLoaded }, () => {
            alert(res.Pesan);
          });
        }
      });
      }
      console.log('ttes');

    } else {
      alert("Please complete the form!");
            this.setState({
                isLoaded: true
            })
    }
  };

  submit_op(item){
    this.setState({ isLoadeds: !this.state.isLoadeds});

    let filektp = "";
    if (this.state.pictUrlKTP == 0 || this.state.pictUrlKTP.uri == "undefined") {
        filektp = null;
    }
    else{
    filektp = RNFetchBlob.wrap(
            this.state.pictUrlKTP.uri.replace("file://", "")
        );
    }

    let filenpwp = "";
    if (this.state.pictUrlNPWP == 0 || this.state.pictUrlNPWP.uri == "undefined") {
        filenpwp = null;
    }
    else{
    filenpwp = RNFetchBlob.wrap(
            this.state.pictUrlNPWP.uri.replace("file://", "")
        );
    }

    let filebuktitf = "";
    if (this.state.pictUrlBuktiTF == 0 || this.state.pictUrlBuktiTF.uri == "undefined") {
        console.log("replace", this.state.replaceFoto);
        filebuktitf = './img/noimage.png';
    }
    else{
    filebuktitf = RNFetchBlob.wrap(
            this.state.pictUrlBuktiTF.uri.replace("file://", "")
        );
    }   

    // const items = this.props.prevItems;
    // const refereememberID = this.state.refcode.memberID;
    
    
    // let jsoncd = '';
    // const getredeem = this.state.redcode

    // if(getredeem.status == 'error'){
    //   jsoncd = JSON.parse(JSON.stringify(getredeem))
    // }else if(getredeem.status == 'ok'){
    //   jsoncd = JSON.parse(JSON.stringify(getredeem))
    // }
    
    // console.log('get jsoncd', jsoncd);
    // console.log('get redeem', JSON.parse(JSON.stringify(getredeem)));
    const items = this.props.prevItems;
    const refereememberID = this.state.refcode;

    
    
    let jsoncd = '';
    const getredeem = this.state.refcode
    console.log('get jsoncd', getredeem);


    if(getredeem.status == 'error'){
      jsoncd = JSON.parse(JSON.stringify(getredeem))
    }else if(getredeem.status == 'ok'){
      jsoncd = JSON.parse(JSON.stringify(getredeem))
    }else{
      jsoncd = " "
    }


    let refmembers = "";
    if(getredeem.memberID == "" || getredeem.memberID == 'undefined' || getredeem.memberID == null ){
      refmembers = " ";
    }else{
      refmembers = getredeem.memberID;
    }
    
    // console.log('get jsoncd', jsoncd);

    const refer_code = this.state.refcode;
    console.log('check refercode', refer_code);

    const {
      name,
      fullname,
      nohp,
      email_add,
      no_ktp,
      citys,
      nationality_descs,
      addresses,
      booking_type,
      amounts,
      remarks,
      userId,
      lotnno,
      entity,
      project,
      payment_cd,
      rowID,
      business_id,
      sell_price,
      Group_cd,
      email,
      phase_cd,
      referralcd,
      towers,
      order_id,
      db_profile
    } = this.state;

    
    let remarkz = "";
    if (remarks == ""){
      remarkz = ""
    }else{
      remarkz = remarks
    }

    let refscode = "";
    if (referralcd == ""){
      refscode = ""
    }else{
      refscode = referralcd
    }

    const formData = {
      bookedby: name,
      fullname: fullname,
      no_ktp: no_ktp,
      email_add: email_add,
      addresses: addresses,
      mailadd: email,
      lotNo: lotnno,
      nohp: nohp,
      amounts: amounts,
      citys: citys,
      nationality_descs: nationality_descs,
      remarks: remarks,
      userID: userId,
      entitys: entity,
      projects: project,
      business_id: business_id,
      Group_cd: Group_cd,
      towerd: towers,
      rowID: rowID,
      payment_cds: payment_cd,
      productcd: items.product_cd,
      prodtype: items.product_descs,
      book_type: booking_type,
      sell_price: sell_price,
      refcode: refscode,
      

      pictUrlKTP: filektp,
      pictUrlNPWP: filenpwp,
      pictUrlBuktiTF: filebuktitf,
      phase_cd: phase_cd,
      order_id: order_id,
      refmemberID: refmembers,
      res_json: jsoncd,
      cons: items.db_profile,
      allrefcode: refer_code,
    }

    const isValid = this.validating({
        fullname: { require: true },
        nohp: { require: true },
        email_add: { require: true },
        no_ktp: { require: true },
        citys: { require: true },
        nationality_descs: { require: true },
        addresses: { require: true },
        amounts: { require: true },
    });

    const _fullname = fullname.replace(/\s+/g, '_');

    let fileNameKtp = "";
    if (this.state.pictUrlKTP == 0 || this.state.pictUrlKTP.uri == "undefined") {
        fileNameKtp = null;
    }
    else{
        fileNameKtp = "KTP_RegistAgent_"+_fullname+".png";
    }

    let fileNameNpwp = "";
    if (this.state.pictUrlNPWP == 0 || this.state.pictUrlNPWP.uri == "undefined") {
        fileNameNpwp = null;
    }
    else{
        fileNameNpwp = "NPWP_RegistAgent_"+_fullname+".png";
    }

    let fileNameBuktiTf = "";
    if (this.state.pictUrlBuktiTF == 0 || this.state.pictUrlBuktiTF.uri == "undefined") {
        fileNameBuktiTf = "./img/noimage.png";
        console.log("fileNameAttach", fileNameBuktiTf);
    }
    else{
        fileNameBuktiTf = "BuktiTF_RegistAgent_"+_fullname+".png";
    }

    console.log('_check for to bookingDetail', formData);
    this.setState({
      isLoadeds: true
  })

    if (isValid) {
        if (this.state.pictUrlKTP == null|| this.state.pictUrlKTP.uri == null || this.state.pictUrlNPWP == null|| this.state.pictUrlNPWP.uri == null) {
            alert("Please Upload Photo!");
            this.setState({
                isLoadeds: true
            })
        }else{
            Actions.BookingDetail({
                itemz : item,
                prevItems : this.props.prevItems,
                cekform: formData,
                goTo: this.props.goToItems,
            });
        }

    }else{
        alert("Please complete the form!");
        this.setState({
            isLoadeds: true
        })
    }
}


  testingPrefix() {
    const entity = this.state.entity;
    console.log("entity", entity);
    const prefix = this.state.booking_type[0].prefix;
    console.log("prefix", prefix);
    const items = this.props.prevItems;
    //today di api aja
    // mgr di api aja

    {
      isMount
        ? fetch(
            urlApi +
              "c_booking/getBookingNo/" +
              items.db_profile +
              "/" +
              entity +
              "/" +
              prefix,

            {
              method: "GET",
              headers: this.state.hd,
              //   body: {name: "data", data : lot_nos}
              // body: data
            }
          )
            .then((response) => response.json())
            .then((res) => {
              console.log("getBookingNo", res);
              if (!res.Error) {
                const resData = res.Data[0];
                this.setState({ getBookingNo: resData });
              }
              console.log("getBookingNo", res);
            })
            .catch((error) => {
              console.log(error);
            })
        : null;
    }
  }
  render() {
    let { name } = this.state;
    const prevItems = this.props.prevItems;
    const item = this.props.items;

    const { refcode } = this.state;
    // console.log('check refcode', refcode);



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
            <Text style={Style.actionBarText}>{"Booking".toUpperCase()}</Text>
          </View>
          <View style={Style.actionBarRight}></View>
        </Header>
        <ScrollView keyboardShouldPersistTaps="handled">
        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
          <View>
              <View style={Styles.overview}>
                <Card
                  style={{
                    height: null,
                    backgroundColor: "white",
                    shadowOffset: { width: 1, height: 1 },
                    shadowColor: "#37BEB7",
                    shadowOpacity: 0.5,
                    elevation: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 10,
                    flex: 1,
                  }}
                >
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 17,
                          textAlign: "left",
                          color: "#333",
                          fontWeight: "bold",
                        }}
                      >
                        Booking Details
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingTop: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          textAlign: "left",
                          color: "#333",
                        }}
                      >
                        {prevItems.title}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          textAlign: "left",
                          color: "#333",
                        }}
                      >
                        {prevItems.towerDescs} | Lantai {item.level_no} |{" "}
                        {item.lot_no}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "500",
                          textAlign: "left",
                          color: "#333",
                        }}
                      >
                        {this.state.paydescs} | IDR. {this.state.trx_amts}
                      </Text>
                    </View>
                  </View>
                </Card>
              </View>

              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Booked By</Text>
                <TextInput
                  style={Styles.textInput}
                  value={this.state.name}
                  editable={false}
                />
              </View>
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Full Name</Text>
                <TextInput
                  style={Styles.textInput}
                  onChangeText={(val) => this.setState({ fullname: val })}
                  value={this.state.fullname}
                />

                {this.state.errorfullname ? (
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 25,
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    ! Full Name Required
                  </Text>
                ) : null}
              </View>
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Mobile Number</Text>
                <IntlPhoneInput onChangeText={this.onChangeTextPhone} defaultCountry="ID" 
                                renderAction={() => <View><Text></Text></View>} 
                                />
                <Text style={{fontStyle: 'italic'}}> {'Valid Number : ' + (this.state.nohp)} </Text>

                {/* <TextInput
                  keyboardType={"number-pad"}
                  style={Styles.textInput}
                  onChangeText={(val) => this.setState({ nohp: val })}
                  value={this.state.nohp}
                /> */}
               
                {/* {this.state.errornohp ? (
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 25,
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    ! Mobile Number Required
                  </Text>
                ) : null} */}
              </View>

                {/* <SafeAreaView>
                    <IntlPhoneInput onChangeText={this.onChangeTextPhone} defaultCountry="SG" 
                                renderAction={() => <View><Text></Text></View>} 
                                />
                    <Text style={{fontStyle: 'italic'}}> {'Valid Number : ' + (this.state.nohp)} </Text>
                </SafeAreaView> */}
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Email Address</Text>
                <TextInput
                  keyboardType="email-address"
                  style={Styles.textInput}
                  onChangeText={(val) => this.setState({ email_add: val })}
                  value={this.state.email_add}
                />

                {this.state.erroremail_add ? (
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 25,
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    ! Email Required
                  </Text>
                ) : null}
              </View>
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Identity No.</Text>
                <TextInput
                  style={Styles.textInput}
                  onChangeText={(val) => this.setState({ no_ktp: val })}
                  value={this.state.no_ktp}
                />

                {this.state.errorno_ktp ? (
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 25,
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    ! Identity No. Required
                  </Text>
                ) : null}
              </View>
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>City</Text>
                <TextInput
                  style={Styles.textInput}
                  onChangeText={(val) => this.setState({ citys: val })}
                  value={this.state.citys}
                />
                {this.state.errorcitys ? (
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 25,
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    ! City Required
                  </Text>
                ) : null}
              </View>
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Nationality</Text>
                <Picker
                  note
                  mode="dropdown"
                  style={Styles.textInput}
                  selectedValue={this.state.nationality_descs}
                  onValueChange={(val) =>
                    this.setState({ nationality_descs: val })
                  }
                >
                  <Picker.Item label="Choose Nationality" />
                  {this.state.nationality.map((data, key) => (
                    <Picker.Item
                      key={key}
                      label={data.descs}
                      value={data.nationality_cd}
                    />
                  ))}
                </Picker>

                {this.state.errornationality_descs ? (
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 25,
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    ! Select Nationality Required
                  </Text>
                ) : null}
              </View>
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Address</Text>
                <TextInput
                  style={Styles.textInput}
                  multiline={true}
                  numberOfLines={5}
                  onChangeText={(val) => this.setState({ addresses: val })}
                  value={this.state.addresses}
                />

                {this.state.erroraddresses ? (
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 25,
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    ! Address Required
                  </Text>
                ) : null}
              </View>
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Booking Type</Text>
                <Picker
                  note
                  mode="dropdown"
                  style={Styles.textInput}
                  selectedValue={this.state.bookingtp}
                  onValueChange={(val) => this.selectAmount(val)}
                >
                  <Picker.Item label="Choose Booking Type" />
                  {this.state.booking_type.map((data, key) => (
                    <Picker.Item
                      key={key}
                      label={data.descs}
                      value={data.nup_type}
                    />
                  ))}
                </Picker>

                {this.state.errorbookingtp ? (
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 25,
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    ! Select Booking Type Required
                  </Text>
                ) : null}
              </View>
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Amount</Text>

                {this.state.amounts.length == 0 ? (
                  <TextInput
                    style={Styles.textInput}
                    keyboardType="numeric"
                    value={this.state.amt}
                    editable={false}
                    onChangeText={(val) => this.setState({ amt: val })}
                  />
                ) : (
                  <View>
                    {this.state.amounts.map((data, key) => (
                      <TextInput
                        key={key}
                        style={Styles.textInput}
                        keyboardType="numeric"
                        value={numFormat(data.value)}
                        editable={false}
                        label={data.label}
                      />
                    ))}
                  </View>
                )}
              </View>
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Your Remarks</Text>
                <TextInput
                  style={Styles.textInput}
                  multiline={true}
                  numberOfLines={5}
                  onChangeText={(val) => this.setState({ remarks: val })}
                  value={this.state.remarks}
                />
                {/* {this.state.errorremarks ? (
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 25,
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    ! Remarks Required
                  </Text>
                ) : null} */}
              </View>
              {/* <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Referral Code</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({referralcd : val})}
                                    value={this.state.referralcd} />
                            </View> */}
              <View style={Styles.overview}>
                <Text style={Styles.overviewTitle}>Referral Code</Text>
                <View style={Styles.colReferral}>
                  <TextInput
                    style={Styles.textInputreferral}
                    onChangeText={(val) => this.setState({ referralcd: val })}
                    value={this.state.referralcd}
                  />
                  <Button
                    style={Styles.btnReff}
                    onPress={() => this.getReferalCode(this.state.referralcd)}
                  >
                    <Text style={styles.formBtnText}>
                      {"CHECK".toUpperCase()}
                    </Text>
                    {/* <Icon active name="search" type="FontAwesome" style={styles.formBtnIcon} /> */}
                  </Button>
                </View>
              </View>
              <View style={Styles.containImageTop}>
                <Text style={[Style.textBlack, { paddingTop: 5 }]}>
                  Upload Identity Card/Passport
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 2,
                    borderWidth: 1,
                    borderColor: "#d3d3d3",
                    margin: 10,
                  }}
                  onPress={() => this.showAlert("pictUrlKTP")}
                  pointerEvents={this.state.isLoaded ? "auto" : "none"}
                >
                  {this.state.pictUrlKTP == null ||
                  this.state.pictUrlKTP == "" ? (
                    <View>
                      <Image
                        style={{ width: 200, height: 130 }}
                        source={
                          (uri = require("../../../assets/images/ktp.png"))
                        }
                      />
                    </View>
                  ) : (
                    <Image
                      style={{ width: 200, height: 130 }}
                      source={this.state.pictUrlKTP}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={Styles.containImageTop}>
                <Text style={[Style.textBlack, { paddingTop: 5 }]}>
                  Upload NPWP
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 2,
                    borderWidth: 1,
                    borderColor: "#d3d3d3",
                    margin: 10,
                  }}
                  onPress={() => this.showAlert("pictUrlNPWP")}
                  pointerEvents={this.state.isLoaded ? "auto" : "none"}
                >
                  {this.state.pictUrlNPWP == null ||
                  this.state.pictUrlNPWP == "" ? (
                    <View>
                      <Image
                        style={{ width: 200, height: 130 }}
                        source={
                          (uri = require("../../../assets/images/ktp.png"))
                        }
                      />
                    </View>
                  ) : (
                    <Image
                      style={{ width: 200, height: 130 }}
                      source={this.state.pictUrlNPWP}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={Styles.containImageTop}>
                <Text style={[Style.textBlack, { paddingTop: 5 }]}>
                  Upload Proof of Payment
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 2,
                    borderWidth: 1,
                    borderColor: "#d3d3d3",
                    margin: 10,
                  }}
                  onPress={() => this.showAlert("pictUrlBuktiTF")}
                  pointerEvents={this.state.isLoaded ? "auto" : "none"}
                >
                  {this.state.pictUrlBuktiTF == null ||
                  this.state.pictUrlBuktiTF == "" ? (
                    <View>
                      <Image
                        style={{ width: 200, height: 130 }}
                        source={
                          (uri = require("../../../assets/images/ktp.png"))
                        }
                      />
                    </View>
                  ) : (
                    <Image
                      style={{ width: 200, height: 130 }}
                      source={this.state.pictUrlBuktiTF}
                    />
                  )}
                </TouchableOpacity>
              </View>

              {
                                    this.state.Group_cd != "INHOUSE" ? 
                                    <View style={Styles.overviewConfirm}>
                                        <Button rounded warning
                                            style={{ marginTop: 16, borderRadius: 20, width: '100%' }}
                                            onPress={() => {this.submit_op(item)}}>
                                                
                                            {
                                                !this.state.isLoadeds ? (
                                                    <ActivityIndicator color="#fff" />
                                                ):(
                                                    <Text style={Styles.signInBtnText}>ONLINE PAYMENT</Text>
                                                )

                                                
                                            }
                                            
                                        
                                        </Button>
                                        
                                    </View>
                                : 
                                    <View style={Styles.overviewConfirm}>
                                        <Button rounded warning
                                            style={{ marginTop: 16, borderRadius: 20, width: '40%' }}
                                            onPress={() => {this.submitCash()}}>
                                                
                                            {
                                                !this.state.isLoaded ? (
                                                    <ActivityIndicator color="#fff" />
                                                ):(
                                                    <Text style={Styles.signInBtnText}>CASH</Text>
                                                )
                                            } 
                                        </Button>
                                        <Button rounded warning
                                            style={{ marginTop: 16, borderRadius: 20, width: '55%' }}
                                            onPress={() => {this.submit_op(item)}}>
                                                
                                            {
                                                !this.state.isLoadeds ? (
                                                    <ActivityIndicator color="#fff" />
                                                ):(
                                                    <Text style={Styles.signInBtnText}>ONLINE PAYMENT</Text>
                                                )

                                                
                                            }
                                            
                                        
                                        </Button>
                                    </View>
                                }
                                
          </View>
        </Content>
        </ScrollView>
      </Container>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  buttonUpload: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    height: 80,
  },
});

//make this component available to the app
export default BookingPage;