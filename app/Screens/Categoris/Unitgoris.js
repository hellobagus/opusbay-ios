//import liraries
import React from "react";
import {
  StatusBar,
  TouchableHighlight,
  Image,
  ImageBackground,
  View,
  FlatList
} from "react-native";
import { Container, Header, Content, Button, Icon, Text } from "native-base";

import PROPERGORIS from "./Propergoris";

import { Actions } from "react-native-router-flux";

import { Style, Colors } from "../../Themes/";
import Styles from "./Style";
class Unitgoris extends React.Component {
  state = {
    modalVisible: true
  };

  componentDidMount() {
    console.log("props", this.props);
  }

  onClose = () => this.setState({ modalVisible: false });

  clickUnittype() {
    Actions.unittype();
    this.setState({ click: true });
  }

  render() {
    return (
      <Container style={Style.bgMain}>
        <Header style={Style.navigation}>
          <StatusBar
            backgroundColor={Colors.statusBarOrange}
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
              {"Unit Group".toUpperCase()}
            </Text>
          </View>
          <View style={Style.actionBarRight} />
        </Header>

        <Content
          style={Style.layoutInner}
          contentContainerStyle={Style.layoutContent}
        >
          <ImageBackground style={Styles.homeBg}>
            <View style={Styles.section}>
              <FlatList
                data={PROPERGORIS}
                style={Styles.item}
                renderItem={({ item, separators }) => (
                  <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => {
                      this.clickUnittype();
                    }}
                  >
                    <View style={Styles.record}>
                      <Image
                        source={{ uri: item.image }}
                        style={Styles.itemImg}
                      />
                      <View style={Styles.itemInfo}>
                        <Text style={Styles.itemTitle}>{item.title}</Text>
                      </View>
                      {/* <View style={Styles.trash}>
                                            <Button transparent onPress={() => {
                                                NavigationService.navigate('MemberFavorites')
                                            }}>
                                                <Icon name="arrow-right" type="FontAwesome" style={Styles.itemIcon} />
                                            </Button>
                                        </View> */}
                    </View>
                  </TouchableHighlight>
                )}
              />
            </View>
          </ImageBackground>
          {/* <View style={{ flex: 1, marginTop: 50, alignItems: "center" }}>
        <RBSheet
          ref={ref => {
            this.RBSheet =  ref;
          }}
          height={450}
          paddingTop={64}
          duration={250}
          closeOnSwipeDown="false"
          
        >
        <ScrollView>
          <Unittype />
          </ScrollView>
        </RBSheet>
        </View> */}
        </Content>
      </Container>
    );
  }
}

//make this component available to the app
export default Unitgoris;
