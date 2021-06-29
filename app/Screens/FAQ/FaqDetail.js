import React from "react";
import { 
  SearchBar
} from 'react-native-elements';
//import react in project
import {
    PermissionsAndroid,
    Text,
    View,
    Image,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from "react-native";
import {
    Container,
    Button,
    Icon,
    Header,
    Content,
    List,
    ListItem,
    Right,
    Card
} from "native-base";
import FontAwesome from "react-native-vector-icons/FontAwesome";
//import all the required component
import AppIntroSlider from "react-native-app-intro-slider";
import styles from "./styles";
import { Style, Colors, Metrics, Fonts } from "../../Themes";
import { Actions } from "react-native-router-flux";
import { _storeData, _getData } from "@Component/StoreAsync";
import DeviceInfo from "react-native-device-info";
import { urlApi } from "@Config/services";
import IntlPhoneInput from '@Component/CountryCode';
import HTML from 'react-native-render-html';
import RNFetchBlob from "rn-fetch-blob";

class FaqDetailPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: true,
            search: '',
        };

        console.log("props", props);
    }

    updateSearch = (search) => {
      this.setState({ search });
    };

    downloadFiles1 = () => {
      
      const items  = this.props.FaqData
      const android = RNFetchBlob.android
      if (items.url_download1 == "") {
        alert("No File Attached!")
      } else {
          RNFetchBlob
        .config({
            fileCache : true,
            addAndroidDownloads: {
                path: RNFetchBlob.fs.dirs.SDCardDir +'/downloads/',
                useDownloadManager: true,
                notification: true,
                overwrite: true,
                description: 'downloading content...',
                mime: 'application/pdf',
                mediaScannable: true
            }
        })
        .fetch('GET', items.url_download1)
        .then((res) => {
            console.log('The file saved to ', res.path())
        })
      }
      
    }

    downloadFiles2 = () => {
      
      const items  = this.props.FaqData
      const android = RNFetchBlob.android
      if (items.url_download2 == "") {
        alert("No File Attached!")
      } else {
      RNFetchBlob
      .config({
          fileCache : true,
          addAndroidDownloads: {
              path: RNFetchBlob.fs.dirs.SDCardDir +'/downloads/',
              useDownloadManager: true,
              notification: true,
              overwrite: true,
              description: 'downloading content...',
              mime: 'application/pdf',
              mediaScannable: true
          }
      })
      .fetch('GET', items.url_download2)
      .then((res) => {
        console.log('chec', res)
          console.log('The file saved to ', res.path())
      })
    }
    }

    downloadFiles3 = () => {
      const items  = this.props.FaqData;
      if (items.url_download3 == "") {
        alert("No File Attached!")
      } else {
        RNFetchBlob
        .config({
            fileCache : true,
            addAndroidDownloads: {
                path: RNFetchBlob.fs.dirs.SDCardDir +'/downloads/',
                useDownloadManager: true,
                notification: true,
                overwrite: true,
                description: 'downloading content...',
                mime: 'application/pdf',
                mediaScannable: true
            }
        })
        .fetch('GET', items.url_download3)
        .then((res) => {
            console.log('The file saved to ', res.path())
        })
      }
    }

    // renderGeneralQuestion(){
    //     const generals = this.props.FaqData;
    //     return (
    //         <View>
    //             <View style={{ 
    //                     backgroundColor: 'white',
    //                     width: null,
    //                     height: null,
    //                     flexDirection: "row"
    //                 }}>
    //                     <Text style={[styles.textBlack,styles.textBig, styles.textAlign3]}>
    //                         {generals.subject}
    //                     </Text>
    //                 </View>
    //             <View style={{ 
    //                     backgroundColor: 'white',
    //                     width: null,
    //                     height: null,
    //                     flexDirection: "row",
    //                     marginTop: 15, 
    //             }}>
    //                     <View style={[styles.textBlack,styles.textMedium, styles.textAlign2]}>
    //                         <HTML html={generals.content} imagesMaxWidth={Dimensions.get('window').width} />
    //                     </View>
                        
    //             </View>
    //             <View style={{ 
    //                     backgroundColor: 'white',
    //                     width: null,
    //                     height: null,
    //                     flexDirection: "column",
    //                     marginTop: 10, 
    //             }}>
    //                     <Text style={[styles.textBlack,styles.textMedium, styles.textAlign3]}>
    //                         Download for more details
    //                     </Text>

    //                     <View style={styles.viewButton}>
    //                           <TouchableOpacity
    //                                       onPress={()=>this.downloadFiles(generals.url_download1)}
    //                                       style={styles.buttonStyle}>
    //                                       <Image style={styles.imgButton} source={require('@Asset/images/folder.png')} />
    //                                       {/* <Text style={styles.buttonTitle}>AGENT</Text> */}
    //                           </TouchableOpacity>
    //                           <TouchableOpacity
    //                                       onPress={()=>this.goToFaqDetail(generals.url_download2)}
    //                                       style={styles.buttonStyle}>
    //                                       <Image style={styles.imgButton} source={require('@Asset/images/folder.png')} />
    //                                       {/* <Text style={styles.buttonTitle}>AGENT</Text> */}
    //                           </TouchableOpacity>
    //                           <TouchableOpacity
    //                                       onPress={()=>this.goToFaqDetail(generals.url_download3)}
    //                                       style={styles.buttonStyle}>
    //                                       <Image style={styles.imgButton} source={require('@Asset/images/folder.png')} />
    //                                       {/* <Text style={styles.buttonTitle}>AGENT</Text> */}
    //                           </TouchableOpacity>
    //                     </View>
    //             </View>
    //       </View>
    //     );
    // }



  
    

    render() {
      const { search } = this.state;
      const faqData = this.props.FaqData;

        return (
            <Container style={styles.bgMain}>
            <Header style={styles.navigation}>
               <StatusBar
                 backgroundColor={Colors.brownTuansing}
                 animated
                 barStyle="light-content"
               />
     
               <View style={styles.actionBarLeft}>
                 <Button
                   transparent
                   style={styles.actionBarBtn}
                   onPress={Actions.pop}
                 >
                   <Icon
                     active
                     name="arrow-left"
                     style={styles.textWhite}
                     type="MaterialCommunityIcons"
                   />
                 </Button>
               </View>
               <View style={styles.actionBarMiddle}>
                 <Text style={styles.actionBarText}>
                   {"FAQ detail question".toUpperCase()}
                 </Text>
               </View>
               <View style={styles.actionBarRight}></View>
               </Header>

               <Content
                style={styles.layoutInner}
                contentContainerStyle={styles.layoutContent}
               >
                 {/* {
                     this.props.FaqData.category == "G" ? (
                         this.renderGeneralQuestion()
                     ) : null
                 } */}

            <View>
              <View style={{ 
                      backgroundColor: 'white',
                      width: null,
                      height: null,
                      flexDirection: "row"
                  }}>
                      <Text style={[styles.textBlack,styles.textBig, styles.textAlign3]}>
                          {faqData.subject}
                      </Text>
                  </View>
              <View style={{ 
                      backgroundColor: 'white',
                      width: null,
                      height: null,
                      flexDirection: "row",
                      marginTop: 15, 
              }}>
                      <View style={[styles.textBlack,styles.textMedium, styles.textAlign2]}>
                          <HTML html={faqData.content} imagesMaxWidth={Dimensions.get('window').width} />
                      </View>
                      
              </View>
              {/* <View style={{ 
                      backgroundColor: 'white',
                      width: null,
                      height: null,
                      flexDirection: "column",
                      marginTop: 10, 
              }}>
                      <Text style={[styles.textBlack,styles.textMedium, styles.textAlign3]}>
                          Download for more details
                      </Text>
                      <View style={styles.viewButton}>
                            <TouchableOpacity
                                        onPress={()=>this.downloadFiles1()}
                                        style={styles.buttonStyle}>
                                        <Image style={styles.imgButton} source={require('@Asset/images/folder.png')} />
                                        <Text style={styles.buttonTitle}>{faqData.url_download1}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                        onPress={()=>this.downloadFiles2()}
                                        style={styles.buttonStyle}>
                                        <Image style={styles.imgButton} source={require('@Asset/images/folder.png')} />
                                        {
                                          faqData.url_download2 == "" ?
                                          <Text style={styles.buttonTitle}>(empty)</Text>
                                          :
                                          <Text style={styles.buttonTitle}>{faqData.url_download2}</Text>
                                        }
                                        
                            </TouchableOpacity>
                            <TouchableOpacity
                                        onPress={()=>this.downloadFiles3()}
                                        style={styles.buttonStyle}>
                                        <Image style={styles.imgButton} source={require('@Asset/images/folder.png')} />
                                        {
                                          faqData.url_download3 == "" ?
                                          <Text style={styles.buttonTitle}>(empty)</Text>
                                          :
                                          <Text style={styles.buttonTitle}>{faqData.url_download3}</Text>
                                        }
                            </TouchableOpacity>
                      </View>
              </View> */}
        </View>
                </Content>
               </Container>
        );
    }
}
export default FaqDetailPage;