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
    TouchableOpacity
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
import { color } from "react-native-reanimated";

class FaqQuestionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: true,
            search: '',

            //array
            questions: []
        };

        console.log("props", props);
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
        this.getGeneralFaq()
        // this.getDebtors()
        // this.getPayProgress()
      })
    }

    updateSearch = (search) => {
      this.setState({ search });
    };

    goToFaqDetail(tez){
      Actions.FaqDetailPage({FaqData: tez});
    }

    getGeneralFaq = () => {
        const data = this.props.FaqData;
      {
          isMount
              ? fetch(
                    urlApi +
                        "c_faq/getFaqGeneral/" + data.category,
                    {
                        method: "GET",
                    }
                )
                    .then(response => response.json())
                    .then(res => {
                        if (!res.Error) {
                            const resData = res.Data;
                            this.setState({ questions: resData });
                          //   _storeData("@getprice",resData);
                          // this.getDebtors(res);
                        }
                        console.log("getGeneral", res);
                    })
                    .catch(error => {
                        console.log(error);
                    })
              : null;
      }
  };

    render() {
      const { search } = this.state;
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
                   {"FAQ Question".toUpperCase()}
                 </Text>
               </View>
               <View style={styles.actionBarRight}></View>
               </Header>

               <Content
               style={styles.layoutInner}
               contentContainerStyle={styles.layoutContent}
             >
                <View>
                    <ScrollView>
                        <View>
                                <View style={{marginTop: 14}}>
                                  {
                                    this.state.questions.length > 0 ?
                                    this.state.questions.map((data,key)=>
                                    <Card style={styles.cardBox} key={key}>
                                    <TouchableOpacity onPress={()=>this.goToFaqDetail(data)}>
                                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                                            <Text style={{
                                                fontSize: 14,
                                                textAlign: 'left',
                                                color: '#333',
                                                fontWeight : "bold",
                                                fontFamily: "Montserrat-Regular",
                                                flex: 1, 
                                                flexWrap: 'wrap'
                                            }}>
                                                {data.subject}
                                            </Text>
                                            <View>
                                              <Right style={{position:"relative", right: 5}}>
                                                <Icon name="chevron-right" style={{fontSize: 30}} type="MaterialCommunityIcons" />
                                              </Right>
                                            </View>
                                      </View>
                                      </TouchableOpacity>
                                    </Card>
                                    )
                                    :
                                    null
                                  }
                                  
                                </View>

                             
                        </View>
                  
                    </ScrollView>
                </View>
                </Content>
               </Container>
        );
    }
}
export default FaqQuestionPage;