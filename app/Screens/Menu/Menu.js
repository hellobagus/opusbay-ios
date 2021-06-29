import React from 'react'
import { StatusBar,ActivityIndicator, TouchableOpacity, TextInput, StyleSheet, Image, TouchableHighlight, ImageBackground, Dimensions, ScrollView, Platform, SafeAreaView, FlatList } from 'react-native'
import { Container,List,ListItem, Header, Content, Button, Icon, Text, Title, Left, Right, Body, Input, Item, Footer, View, FooterTab, Badge } from 'native-base'

import NavigationService from '../../Service/Navigation'

import { Fonts, Metrics, Colors,Style } from '../../Themes/';
import Styles from './Style'
import Styles2 from './Style2'
import {_storeData,_getData} from '@Component/StoreAsync';
import { Actions } from "react-native-router-flux";
import {urlApi} from '@Config/services';
//const {width, height} = Dimensions.get('window')
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class Menu extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            email : '',
            name : '',
            group : '',
            dashmenu : [],
            fotoProfil : 'http://35.198.219.220:2121/alfaAPI/images/profil/avatar.png',
            isLogin : false,
            isLoaded : false
        }
    }

    async componentDidMount(){
        const data = {
          email :  await _getData('@User'),
          userId : await _getData('@UserId'),
          name :  await _getData('@Name'),
          group : await _getData('@Group'),
          token : await _getData('@Token'),
          dashmenu : await _getData('@DashMenu') ? await _getData('@DashMenu') : [],
          isLogin : await _getData('@isLogin')
        }

        console.log('datra222',data);
        this.setState(data,()=>{
            if(data.isLogin){
                this.getProfile()
            }
        })

        setTimeout(()=>{
            this.setState({isLoaded : true})
        },2000)
    }

    receiveProps = async() =>{
        const data = {
          name :  await _getData('@Name'),
        }

        if(await _getData('@ProfileUpdate')){
            _storeData('@ProfileUpdate',false)
            this.setState(data)
            this.getProfile()
        }

    }

    getProfile = () => {
        
        fetch(urlApi+'c_profil/getData/IFCAMOBILE/'+this.state.email+'/'+this.state.userId,{
            method : "GET",
            headers :{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Token' : this.state.token
            }
        })
        .then((response) => response.json())
        .then((res)=>{
            const resData = res.Data[0];

            // ? Agar Gambar Tidak ter cache 
            let url = resData.pict + '?random_number=' + new Date().getTime()
            this.setState({fotoProfil:url})
            console.log('res Profil',this.state);
        }).catch((error) => {
            console.log(error);
        });
    }


    goToFeed = (val) =>{
        if(val.isProject == 1){
            Actions.project({goTo : val})
        } else if (val.Title == 'Promo') {
            Actions.Feed({ types: 'promo'})
        } else if (val.Title == 'News') {
            Actions.Feed({ types: 'news'})
        }else {
            Actions[val.URL_angular]()
        }

        // console.log('test',val);
    }

    render() {
        let dashmenu = this.state.dashmenu.length % 3
        let secLoop = [0,1]

            return (
                <Container style={Style.bgMain}>
                    <StatusBar backgroundColor="rgba(0,0,0,0)" animated barStyle="dark-content" />
     
                    <Content style={Style.layoutInner} contentContainerStyle={Style.layoutContent}>
                        <View style={Styles.section}>


                            <List style={Styles2.infoTab}>

                                { this.state.dashmenu.map((val,key)=>

                                    key < this.state.dashmenu.length - 1 ? 
                                    <ListItem key={key} style={Styles2.infoItem} 
                                    onPress={()=>this.goToFeed(val)}>
                                        <Image source={{uri : urlApi+"images/dashPict/"+val.picture}} style={Styles2.infoIcon} />
                                        <View style={{alignSelf:'center'}} style={{alignSelf:'center'}}>
                                            <Text style={Styles2.infoHeader}>{val.Title}</Text>
                                            <Text style={Styles2.infoDesc}></Text>
                                        </View>

                                        <Right style={{position:'absolute',right:10}}>
                                            {/* <Icon name="ios-arrow-dropright" style={{fontSize: 30,}} /> */}
                                            <Icon name="chevron-right" style={{fontSize: 30}} type="MaterialCommunityIcons" />

                                        </Right>
                                    </ListItem>    
                                    :
                                    <ListItem key={key} style={Styles2.infoItemLast} onPress={()=>this.goToFeed(val) }>
                                        <Image source={{uri : urlApi+"images/dashPict/"+val.picture}} style={Styles2.infoIcon} />
                                        <View style={{alignSelf:'center'}} style={{alignSelf:'center'}}>
                                            <Text style={Styles2.infoHeader}>{val.Title}</Text>
                                            <Text style={Styles2.infoDesc}></Text>
                                        </View>

                                        <Right style={{position:'absolute',right:10}}>
                                            {/* <Icon name="ios-arrow-dropright" style={{fontSize: 30,}} /> */}
                                            <Icon name="chevron-right" style={{fontSize: 30}} type="MaterialCommunityIcons" />

                                        </Right>
                                    </ListItem>
                                    
                                )}

                                {/* <ListItem style={Styles2.infoItemLast} onPress={()=>this.goToFeed({URL_angular : "NUPPage",isProject:0}) }>
                                    <Image source={{uri : urlApi+"images/dashPict/nup_online.png"}} style={Styles2.infoIcon} />
                                    <View style={{alignSelf:'center'}} style={{alignSelf:'center'}}>
                                        <Text style={Styles2.infoHeader}>NUP Online</Text>
                                        <Text style={Styles2.infoDesc}>{'Account Setting & Change Password'}</Text>
                                    </View>

                                    <Right style={{position:'absolute',right:10}}>
                                        <Icon name="ios-arrow-dropright" style={{fontSize: 30,}} />
                                    </Right>
                                </ListItem> */}

                            </List>
                        </View>
                    </Content>
                </Container>
            )
        
    }
}

const LoginStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn : {
        backgroundColor : Colors.loginBlue,
        padding :10
    }
});
