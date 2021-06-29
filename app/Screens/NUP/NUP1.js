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
    Alert,
    ActivityIndicator,
    
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
    Textarea,
    Form
} from "native-base";

import { SafeAreaView } from 'react-navigation';


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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


let isMount = false
// create a component
class NUPPage extends Component {

    constructor(props) {
        super(props)

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
            choosebookingtp: '',
            booking_type:'',
            qtys: [],
        

            //state form
            fullname: '',
            nohp: '',
            email_add: '',
            no_ktp: '',
            citys: '',
            nationality_descs: '',
            addresses: '',
            nuptp: '',
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
            producttp: '',
            getmedia: '',
            getreasons: '',
            getpropertys: '',
            getunits:'',


            //2. tambahkan state upload foto booking
            pictUrlKTP: '',
            pictUrlNPWP: '',
            pictUrlBuktiTF: '',
            uploadfoto: false,


            //state looping
            project: [],
            customers: [],
            nationality: [],
            booking_type: [],
            amounts:[],
            paydescs: [],
            trx_amts: [],
            product_type: [],
            nup_type:[],
            email: '',
            towers: [],
            medias: [],
            reasons: [],
            pproperty: [],
            units: []
            
            // getAgentcd: [],
            // business_id: [],
            
            
        }

        console.log('check props from Choose Tower', this.props);
    }

    async componentDidMount() {
        const prevItems = this.props.prevItems;
        isMount = true;
        const data = {
            email: await _getData("@User"),
            name: await _getData("@Name"),
            no_hp: await _getData("@Handphone"),
            token: await _getData("@Token"),
            userId: await _getData("@UserId"),
            Group_cd: await _getData("@Group"),
            agent_cd: await _getData("@AgentCd"),

            entity: prevItems.entity_cd,
            project: prevItems.project_no,
            towers: prevItems.towerDescs

        }
        this.setState(data, () => {
            this.getNationality();
            this.getLoadData();
            this.getMedias();
            this.getReason();
            this.getNupType();
            this.getProductType();
        });

    }


    getNationality = () => {
        const items = this.props.prevItems;
        {isMount ?
            fetch(urlApi + 'c_nups/getNationality/'+items.db_profile,{
                method: 'GET',
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data
                    this.setState({ nationality : resData});
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        alert(res.Pesan)
                    });
                }
                console.log('getNationality',res);
            }).catch((error) => {
                console.log(error);
            })
            :null}
    }

    getMedias = () => {
        const items = this.props.prevItems;
        // console.log('got item', items);
        {isMount ?
            fetch(urlApi + 'c_nups/getMedias/'+items.db_profile,{
                method: 'GET',
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data
                    this.setState({ medias : resData});
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        alert(res.Pesan)
                    });
                }
                console.log('getMedia',res);
            }).catch((error) => {
                console.log(error);
            })
            :null}
    }

    getReason = () => {
        const items = this.props.prevItems;
        // console.log('got item', items);
        {isMount ?
            fetch(urlApi + 'c_nups/getReason/'+items.db_profile+"/"+items.entity_cd+"/"+items.project_no,{
                method: 'GET',
                // method:'POST',
                // body: JSON.stringify({province_cd})
                // headers : this.state.hd,
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data
                    this.setState({ reasons : resData});
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        alert(res.Pesan)
                    });
                }
                console.log('getReason',res);
            }).catch((error) => {
                console.log(error);
            })
            :null}
    }

    getNupType= () => {
        const items = this.props.prevItems;
        const getagent_cd = this.state.userId
        // console.log('get agent code', getagent_cd);
        {isMount ?
            fetch(urlApi + 'c_nups/getNupType/'+ items.db_profile + "/" + items.entity_cd + "/" + items.project_no + "/" + items.product_cd + "/" + getagent_cd,{
                method: 'GET',
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data;
                    this.setState({ nup_type : resData});
                    // _storeData("@checkProdType", resData);
                    // this.getNupType(res);
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        alert(res.Pesan)
                    });
                }
                console.log('getNUPType',res);
            }).catch((error) => {
                console.log(error);
            })
            :null}
    }

    getAmount = async(val) => {
        if(val != undefined){
            const items = this.props.prevItems;
            const dataBtype = await _getData("@nupsType");
            const nup_type = val.nup_type;
            console.log('got nuptype', nup_type);
            {isMount ?
                fetch(urlApi + 'c_nups/getAmount/'+ items.db_profile + "/" + items.entity_cd + "/" + items.project_no + "/" ,{
                    // method: 'GET',
                    method:'POST',
                    body: JSON.stringify({nup_type})
                    // headers : this.state.hd,
                }).then((response) => response.json())
                .then((res)=>{
                    if(!res.Error){
                        const resData = res.Data;
                        this.setState({ amounts : resData});
                        console.log('liat amou',resData);
                    } else {
                        this.setState({isLoaded: !this.state.isLoaded},()=>{
                            alert(res.Pesan)
                        });
                    }
                    // console.log('getAmount',res.Data.amount);
                }).catch((error) => {
                    console.log(error);
                })
                :null}

        }else{
            const items = this.props.prevItems;
            const dataBtype = await _getData("@nupsType");
            const nup_type = val.nup_type;
            console.log('got nuptype', nup_type);
            {isMount ?
                fetch(urlApi + 'c_nups/getAmount/'+ items.db_profile + "/" + items.entity_cd + "/" + items.project_no + "/" ,{
                    // method: 'GET',
                    method:'POST',
                    body: JSON.stringify({nup_type})
                    // headers : this.state.hd,
                }).then((response) => response.json())
                .then((res)=>{
                    if(!res.Error){
                        const resData = res.Data;
                        this.setState({ amounts : resData});
                        console.log('liat amou',resData);
                    } else {
                        this.setState({isLoaded: !this.state.isLoaded},()=>{
                            alert(res.Pesan)
                        });
                    }
                    // console.log('getAmount',res.Data.amount);
                }).catch((error) => {
                    console.log(error);
                })
                :null}
        }
        
    }

    getUnits = async(val) => {
        if(val != undefined){
            const items = this.props.prevItems;
            const property_cd = val.property_cd;
            console.log('got product', property_cd);
            {isMount ?
                fetch(urlApi + 'c_nups/getUnits/'+ items.db_profile + "/" + items.entity_cd + "/" + items.project_no + "/" ,{
                    // method: 'GET',
                    method:'POST',
                    body: JSON.stringify({property_cd})
                    // headers : this.state.hd,
                }).then((response) => response.json())
                .then((res)=>{
                    if(!res.Error){
                        const resData = res.Data;
                        this.setState({ units : resData});
                        console.log('liat unit',resData);
                    } else {
                        this.setState({isLoaded: !this.state.isLoaded},()=>{
                            alert(res.Pesan)
                        });
                    }
                    // console.log('getAmount',res.Data.amount);
                }).catch((error) => {
                    console.log(error);
                })
                :null}

        }else{
            const items = this.props.prevItems;
            const property_cd = val.property_cd;
            console.log('got property_cd', property_cd);
            {isMount ?
                fetch(urlApi + 'c_nups/getUnits/'+ items.db_profile + "/" + items.entity_cd + "/" + items.project_no + "/" ,{
                    // method: 'GET',
                    method:'POST',
                    body: JSON.stringify({property_cd})
                    // headers : this.state.hd,
                }).then((response) => response.json())
                .then((res)=>{
                    if(!res.Error){
                        const resData = res.Data;
                        this.setState({ units : resData});
                        console.log('liat unit',resData);
                    } else {
                        this.setState({isLoaded: !this.state.isLoaded},()=>{
                            alert(res.Pesan)
                        });
                    }
                    // console.log('getAmount',res.Data.amount);
                }).catch((error) => {
                    console.log(error);
                })
                :null}
        }
        
    }

    selectUnits = (val) => {
        if(val == undefined ){
            
        }else{
            console.log("TEST=",val);
            var dataQty= [];
            for(var i = 0; i < parseInt(val.qty); i++){
                dataQty.push(i);
            }
            console.log(dataQty);
            const pilhnuptype = val.nup_type;
            console.log('ppi',pilhnuptype);
            this.setState({nuptp :val, qtys: dataQty, pilhnuptype: pilhnuptype},()=>{
                this.getAmount(val),
                this.getUnits(val)
            })
            
        }

    }

    unitChanges(i, value) {
        this.setState({
          getunits: { ...this.state.getunits, [i]: value }
        });

        // var toUnits = [...this.state.units];
        // var toValue = toUnits.indexOf(i);
        // toUnits.splice(toValue, -1);
        // this.setState({ units: toUnits });
        // console.log('check units', toUnits);

      }


    getProductType= () => {
        const items = this.props.prevItems;
        {isMount ?
            fetch(urlApi + 'c_nups/getProdType/'+ items.db_profile + "/" + items.entity_cd + "/" + items.project_no + "/" + items.product_cd ,{
                method: 'GET',
            }).then((response) => response.json())
            .then((res)=>{
                if(!res.Error){
                    const resData = res.Data;
                    this.setState({ product_type : resData});
                    // _storeData("@checkProdType", resData);
                    // this.getNupType(res);
                } else {
                    this.setState({isLoaded: !this.state.isLoaded},()=>{
                        alert(res.Pesan)
                    });
                }
                console.log('getProductType',res);
            }).catch((error) => {
                console.log(error);
            })
            :null}
    }

    getLoadData = () => {
       
        const items = this.props.prevItems;
        const userid = this.state.userId;
        const rowid = this.state.rowID;

        // console.log('get _userID', userid);
        // console.log('get _rowID', rowid);

        {
            isMount
                ? fetch(
                      urlApi +
                          "c_nups/myReservation/" +
                          items.db_profile +
                          "/" +
                          userid +
                          "/" +
                          rowid,
                      {
                          method: "POST",
                          headers: this.state.hd
                      }
                  )
                      .then(response => response.json())
                      .then(res => {
                          if (!res.Error) {
                              const resData = res.Data[0].business_id;
                              this.setState({ business_id: resData });
                          }
                      })
                      .catch(error => {
                      })
                : null;
        }
    };



    //2. tambahkan beberapa function untuk upload photo
    // ------START-----

    fromCamera(key){
        ImagePicker.openCamera({
            cropping: true,
            width: 600,
            height: 600
        })
            .then(image => {
                console.log("Receive Image", image);
                this.setState({ [key]: {uri: image.path}});
            })
                .catch(e => console.log("tag", e));
    }

    fromGallery(key){
        ImagePicker.openPicker({
            multiple: false,
            width: 600,
            height: 600
        })
            .then(image => {
                console.log('Received Image', image);
                this.setState({ [key]: {uri: image.path} });
            })
                .catch(e => console.log("tag", e));
    }

    showAlert = (key) => {
        Alert.alert(
            "Select a Photo",
            "Choose the place where you want to get a photo",
            [
                {text: "Gallery", onPress:()=>this.fromGallery(key)},
                {text: "Camera", onPress:()=>this.fromCamera(key)},
                {
                    text: "Cancel",
                    onPress:()=> console.log("User Cancel"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
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

    // ------END-------


    // --------------------- START ACTION SUBMIT ------------------

    confirmSubmit = () => {
        this.setState({ isLoaded: !this.state.isLoaded});

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
        const {
            name,
            fullname,
            nohp,
            email_add,
            no_ktp,
            citys,
            nationality_descs,
            addresses,
            product_type,
            amounts,
            remarks,
            userId,
            entity,
            project,
            nup_type,
            nuptp,
            rowID,
            business_id,
            towers,
            Group_cd,
            email,
            getreasons,
            getmedia,
            getunits,
            amt
        } = this.state;

        const formData = {
            bookedby: name,
            fullname: fullname,
            nohp: nohp,
            email_add: email_add,
            no_ktp: no_ktp,
            citys: citys,
            nationality_descs: nationality_descs,
            addresses: addresses,
            productype: product_type[0].product_cd,
            productcd: product_type[0].descs,
            nuptypes: nuptp,
            amounts: amounts,
            // amts: amounts[0].label,
            remarks: remarks,
            userID: userId,
            mailadd: email,
            entitys: entity,
            projects: project,
            rowID: rowID,
            business_id: business_id,
            Group_cd: Group_cd,
            towerd: towers,
            mediaz: getmedia,
            reasonz: getreasons,
            lotnoz: getunits,

            pictUrlKTP: filektp,
            pictUrlNPWP: filenpwp,
            pictUrlBuktiTF: filebuktitf,
        }

        const isValid = this.validating({
            fullname: { require: true },
            nohp: { require: true },
            email_add: { require: true },
            no_ktp: { require: true },
            citys: { require: true },
            nationality_descs: { require: true },
            addresses: { require: true },
            nuptp: { require: true },
            nup_type: { require: true },
            amounts: { require: true },
            remarks: { require: true },
            getmedia: { require : true },
            getreasons: {require : true },
            getunits: { require : true },
            units: { require : true },
            qtys : { require : true }
            // pictUrlKTP: { require : true },
            // pictUrlNPWP: { require : true },
            // pictUrlBuktiTF: { require : true },
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
            fileNameBuktiTf = null;
        }
        else{
            fileNameBuktiTf = "BuktiTF_RegistAgent_"+_fullname+".png";
        }

       

        console.log('_getDataSaveNUP', formData);
        console.log('_checkUnit', this.state.units);

        if (isValid) {   
            if (this.state.pictUrlKTP == null|| this.state.pictUrlKTP.uri == null || this.state.pictUrlNPWP == null|| this.state.pictUrlNPWP.uri == null || this.state.pictUrlBuktiTF == null|| this.state.pictUrlBuktiTF.uri == null) {
                alert("Please Upload Photo!");
                this.setState({
                    isLoaded: true
                })
            }else{
                // alert("Success");
                // if (this.state.amounts.length != 0 ) {
                //     alert("not null");
                // }else{
                //     alert("null");
                // }
                RNFetchBlob.fetch(
                "POST",
                urlApi + "c_nups/saveNUPconfirm/"+items.db_profile,
                {
                    "Content-Type": "multipart/form-data"
                },
                [
                    {name: "photoktp", filename: fileNameKtp, data: filektp},
                    {name: "photonpwp", filename: fileNameNpwp, data: filenpwp},
                    {name: "photobuktitf", filename: fileNameBuktiTf, data: filebuktitf},
                    {name: "data", data: JSON.stringify(formData)}
                ]
                 )
                .then(resp =>{
                    console.log("res_if", resp);
                    const res = JSON.parse(resp.data);
                    console.log("get __formData", res);

                    console.log(res.Pesan);
                    if (!res.Error) {
                        this.setState({ isLogin: true, isLoaded: this.state.isLoaded}, () => {
                            alert(res.Pesan);
                            Actions.pop({});
                        });
                    }else{
                        this.setState({ isLoaded: !this.state.isLoaded }, () => {
                            alert(res.Pesan);
                        });
                    }
                });
            }
            // console.log('chek ktpp', this.state.pictUrlKTP.uri);
            
        }else{
            alert("Please complete the form!");
            this.setState({
                isLoaded: true
            })
        }
    };

    submit(item){
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
            filebuktitf = null;
        }
        else{
        filebuktitf = RNFetchBlob.wrap(
                this.state.pictUrlBuktiTF.uri.replace("file://", "")
            );
        }   

        console.log('nnutp',this.state.pilhnuptype);
        console.log('uunnittt', this.state.units);
        console.log('amt', this.state.amounts);

        const {
            name,
            fullname,
            nohp,
            email_add,
            no_ktp,
            citys,
            nationality_descs,
            addresses,
            product_type,
            amounts,
            remarks,
            userId,
            entity,
            project,
            nup_type,
            nuptp,
            rowID,
            business_id,
            towers,
            Group_cd,
            email,
            getreasons,
            getmedia,
            getunits
        } = this.state;

        const arrNuptp = this.state.nup_type;
        const arrAmounts = this.state.amounts;
        const arrUnits = this.state.units;


        const formData = {
            bookedby: name,
            fullname: fullname,
            nohp: nohp,
            email_add: email_add,
            no_ktp: no_ktp,
            citys: citys,
            nationality_descs: nationality_descs,
            addresses: addresses,
            productype: product_type[0].product_cd,
            productcd: product_type[0].descs,
            nuptypes: nuptp,
            amounts: amounts,
            remarks: remarks,
            userID: userId,
            mailadd: email,
            entitys: entity,
            projects: project,
            rowID: rowID,
            business_id: business_id,
            Group_cd: Group_cd,
            towerd: towers,
            mediaz: getmedia,
            reasonz: getreasons,
            lotnoz: getunits,

            pictUrlKTP: filektp,
            pictUrlNPWP: filenpwp,
            pictUrlBuktiTF: filebuktitf,

            // untuk validasi
            array_nuptype: arrNuptp,
            array_amounts: arrAmounts,
            array_units: arrUnits
        }

        const isValid = this.validating({
            fullname: { require: true },
            nohp: { require: true },
            email_add: { require: true },
            no_ktp: { require: true },
            citys: { require: true },
            nationality_descs: { require: true },
            addresses: { require: true },
            nuptp: { require: true },
            amounts: { require: true },
            remarks: { require: true },
            getmedia: { require : true },
            getreasons: {require : true },
            getunits: { require : true }
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
            fileNameBuktiTf = null;
        }
        else{
            fileNameBuktiTf = "BuktiTF_RegistAgent_"+_fullname+".png";
        }

        if (isValid) {
            if (this.state.pictUrlKTP == null|| this.state.pictUrlKTP.uri == null || this.state.pictUrlNPWP == null|| this.state.pictUrlNPWP.uri == null || this.state.pictUrlBuktiTF == null|| this.state.pictUrlBuktiTF.uri == null) {
                alert("Please Upload Photo!");
                this.setState({
                    isLoadeds: true
                })
            }else{
                Actions.NUPconfirmPage({
                    itemz : item,
                    prevItems : this.props.prevItems,
                    cekform: formData,
                    goTo: this.props.goToItems,
                    // isLoadeds: true
                    // goTo: this.props.goToItems
                });
            }

        }else{
            alert("Please complete the form!");
            this.setState({
                isLoadeds: true
            })
        }
    }

    inputFocused(refName) {
        setTimeout(() => {
            let scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(findNodeHandle(this.refs[refName]),100,true);
        }, 50);
    }



    render() {
        let { name } = this.state
        const prevItems = this.props.prevItems;
        const item = this.props.items;
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
                            {"Add NUP".toUpperCase()}
                        </Text>
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
                                                NUP Details
                                    </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, }}>
                                            <Text style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                color: '#333'
                                            }}>
                                                {prevItems.title}
                                        </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                color: '#333'
                                            }}>
                                              {prevItems.product_descs} | {prevItems.towerDescs} 
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </View>

                            {/* <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Booked By</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    value={this.state.name} 
                                    editable={false} 
                                />
                            </View> */}
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Full Name</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({fullname : val})}
                                    value={this.state.fullname} />

                                {this.state.errorfullname ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12,
                                        fontFamily: Fonts.type.sfuiDisplaySemibold
                                    }}
                                > 
                                 ! Full Name Required
                                </Text>
                                )
                                :null
                            }
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Mobile Number</Text>
                                <TextInput 
                                    keyboardType={"number-pad"}
                                    style={Styles.textInput}
                                    onChangeText={val => this.setState({nohp : val})} 
                                    value={this.state.nohp} />
                                
                                {this.state.errornohp ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12,
                                        fontFamily: Fonts.type.sfuiDisplaySemibold
                                    }}
                                > 
                                 ! Mobile Number Required
                                </Text>
                                )
                                :null
                            }
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Email Address</Text>
                                <TextInput 
                                    keyboardType="email-address"
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({email_add : val})} 
                                    value={this.state.email_add} />
                                
                                {this.state.erroremail_add ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12,
                                        fontFamily: Fonts.type.sfuiDisplaySemibold
                                    }}
                                > 
                                 ! Email Required
                                </Text>
                                )
                                :null
                            }
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Identity No.</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({no_ktp : val})} 
                                    value={this.state.no_ktp} />

                                {this.state.errorno_ktp ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12,
                                        fontFamily: Fonts.type.sfuiDisplaySemibold
                                    }}
                                > 
                                 ! Identity No. Required
                                    </Text>
                                )
                                :null
                            }
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>City</Text>
                                <TextInput 
                                    style={Styles.textInput} 
                                    onChangeText={val => this.setState({citys : val})} 
                                    value={this.state.citys} />
                                 {this.state.errorcitys ? (
                                    <Text
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 25,
                                        color: "red",
                                        fontSize: 12,
                                        fontFamily: Fonts.type.sfuiDisplaySemibold
                                    }}
                                > 
                                 ! City Required
                                    </Text>
                                )
                                :null
                            }
                                
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

                                {this.state.errornationality_descs ? (
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 25,
                                                color: "red",
                                                fontSize: 12,
                                                fontFamily: Fonts.type.sfuiDisplaySemibold
                                            }}
                                        >
                                            ! Select Nationality Required
                                        </Text>
                                    ) : null}
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Address</Text>
                                <Textarea
                                    style={Styles.textInputAddress}
                                    rowSpan={10}
                                    onChangeText={val => this.setState({addresses : val})} 
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
                                        fontFamily: Fonts.type.sfuiDisplaySemibold
                                    }}
                                > 
                                 ! Address Required
                                    </Text>
                                )
                                :null
                            }
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Nup Type</Text>
                                    <Picker note
                                    mode="dropdown"
                                    style={Styles.textInput}
                                    selectedValue={this.state.nuptp}
                                    onValueChange={(val)=>this.selectUnits(val)}
                                >
                                    <Picker.Item label="Choose Nup Type" />
                                    {this.state.nup_type.map((data, key) =>
                                        <Picker.Item key={key} label={data.descs} value={data} />
                                    )}
                                </Picker>
                                
                                {this.state.errornuptp ? (
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 25,
                                                color: "red",
                                                fontSize: 12,
                                                fontFamily: Fonts.type.sfuiDisplaySemibold
                                            }}
                                        >
                                            ! Select NUP Type Required
                                        </Text>
                                    ) : null}
                            </View>
                           
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Amount</Text>
                                {this.state.amounts.length == 0 ?
                                    <TextInput 
                                    style={Styles.textInput} 
                                    keyboardType="numeric" 
                                    value={this.state.amt}
                                    editable={false} 
                                    onChangeText={(val)=>this.setState({amt:val})}  
                                    />
                                    :
                                    <View>
                                        {this.state.amounts.map((data, key) =>
                                        <TextInput key={key} 
                                        style={Styles.textInput} 
                                        keyboardType="numeric"
                                        // value={this.state.amt[data]}
                                        editable={false} 
                                        // onChangeText={(val)=>this.amtChanges(data, val)} 
                                        value={numFormat(data.value)}
                                        label = {[data.label]}
                                        />

                                        
                                        )}
                                        
                                    </View>
    }

                                    {this.state.erroramt ? 
                                        (
                                            <Text
                                                style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 25,
                                                    color: "red",
                                                    fontSize: 12,
                                                    fontFamily: Fonts.type.sfuiDisplaySemibold
                                                }}
                                            >
                                                ! Amounts Required
                                            </Text>
                                        ) : null
                                    }
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Choice of Units</Text>
                                {
                                    this.state.qtys.map((data,key)=>
                                        <Picker note key={key}
                                            mode="dropdown"
                                            style={Styles.textInput}
                                            selectedValue={this.state.getunits[data]}
                                            onValueChange={(val)=>this.unitChanges(data, val)}
                                        >
                                            <Picker.Item label="Choose Units" />
                                            {this.state.units.map((data, key) =>
                                                <Picker.Item key={key} label={data.lot_no + " - " + data.types} value={data} />
                                            )}
                                        </Picker>
                                        // <Text style={Styles.overviewTitle}>{data}</Text>
                                    )
                                }
                                
                                {this.state.errorgetunits ? (
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 25,
                                                color: "red",
                                                fontSize: 12,
                                                fontFamily: Fonts.type.sfuiDisplaySemibold
                                            }}
                                        >
                                            ! Select Units Required
                                        </Text>
                                    ) : null}
                            </View>
                           
                            <View style={Styles.overview}> 
                                <Text style={Styles.overviewTitle}>How do you know about Opus By?</Text>
                                <Picker note
                                    mode="dropdown"
                                    style={Styles.textInput}
                                    selectedValue={this.state.getmedia}
                                    onValueChange={(val)=>this.setState({getmedia:val})}
                                >
                                    <Picker.Item label="Choose Media" />
                                    {this.state.medias.map((data, key) =>
                                        <Picker.Item key={key} label={data.descs} value={data.media_cd} />
                                    )}
                                </Picker>

                                {this.state.errorgetmedia ? (
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 25,
                                                color: "red",
                                                fontSize: 12,
                                                fontFamily: Fonts.type.sfuiDisplaySemibold
                                            }}
                                        >
                                            ! Select Media Required
                                        </Text>
                                    ) : null}
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Reason Owner</Text>
                                <Picker note
                                    mode="dropdown"
                                    style={Styles.textInput}
                                    selectedValue={this.state.getreasons}
                                    onValueChange={(val)=>this.setState({getreasons:val})}
                                >
                                    <Picker.Item label="Choose the Reason" />
                                    {this.state.reasons.map((data, key) =>
                                        <Picker.Item key={key} label={data.descs} value={data.reason_owner} />
                                    )}
                                </Picker>

                                {this.state.errorgetreasons ? (
                                        <Text
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 25,
                                                color: "red",
                                                fontSize: 12,
                                                fontFamily: Fonts.type.sfuiDisplaySemibold
                                            }}
                                        >
                                            ! Select Reason Required
                                        </Text>
                                    ) : null}
                            </View>
                            <View style={Styles.overview}>
                                <Text style={Styles.overviewTitle}>Your Remarks</Text>
                                <Textarea
                                    style={Styles.textInputAddress}
                                    rowSpan={10}
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
                                        fontSize: 12,
                                        fontFamily: Fonts.type.sfuiDisplaySemibold
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
                                    Upload Identify Card/Passport
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10
                                    }}
                                    onPress={() => this.showAlert("pictUrlKTP")}
                                    // pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlKTP == null || this.state.pictUrlKTP =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={require("../../../assets/images/ktp.png")}
                                                 />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={this.state.pictUrlKTP} />
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
                                    onPress={() => this.showAlert("pictUrlNPWP")}
                                    pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlNPWP == null || this.state.pictUrlNPWP =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={this.state.pictUrlNPWP} />
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
                                    Upload Proof of Payment
                                </Text>
                                <TouchableOpacity 
                                    style={{
                                        padding: 2,
                                        borderWidth: 1,
                                        borderColor: '#d3d3d3',
                                        margin: 10
                                    }}
                                    onPress={() => this.showAlert("pictUrlBuktiTF")}
                                    pointerEvents={this.state.isLoaded ? "auto" : "none"}
                                    >
                                    {
                                        this.state.pictUrlBuktiTF == null || this.state.pictUrlBuktiTF =='' ?
                                            <View>
                                                <Image
                                                style={{width: 200, height: 130}}
                                                source={uri = require("../../../assets/images/ktp.png")} />
                                            </View>
                                        :

                                        <Image style={{width: 200, height: 130}} source={this.state.pictUrlBuktiTF} />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.overviewConfirm}>
                                <Button rounded warning
                                    style={{ marginTop: 16, borderRadius: 20, width: '40%' }}
                                    onPress={() => {this.confirmSubmit()}}>
                                        
                                    {
                                        !this.state.isLoaded ? (
                                            <ActivityIndicator color="#fff" />
                                        ):(
                                            <Text style={Styles.signInBtnText}>CONFIRM</Text>
                                        )
                                    }
                                    
                                   
                                </Button>
                                <Button rounded warning
                                    style={{ marginTop: 16, borderRadius: 20, width: '40%' }}
                                    onPress={() => {this.submit(item)}}>
                                        
                                    {
                                        !this.state.isLoadeds ? (
                                            <ActivityIndicator color="#fff" />
                                        ):(
                                            <Text style={Styles.signInBtnText}>BUY</Text>
                                        )
                                    }
                                    
                                   
                                </Button>
                            </View>
                    </View>
                </Content>
                </ScrollView>
            </Container >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#2c3e50',
    // },
    buttonUpload: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        height: 80,
    },

});

//make this component available to the app
export default NUPPage;
