import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Text
} from "react-native";

import HeaderBar from "../../components/header";

import { ScrollView, TextInput } from "react-native-gesture-handler";

import {
  LeftIcon,
  RightIcon,
  EmptyIcon,
  SchoolIcons,
  GenericIcon
} from "../../classes/icons";

import { Courses } from "../../classes/courses";

import { boxShadows } from "../../constants/boxShadows";

import Touchable from "../../components/react-native-platform-touchable";

import { Day } from "../../classes/days";

import { ifIphoneX } from "react-native-iphone-x-helper";
import ApexAPI from "../../http/api";

const width = Dimensions.get("window").width; //full width
const height = Dimensions.get("window").height; //full height

export default class ChatroomScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.textInput = React.createRef();
    this.state = {
      text: ""
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };
  sendMessage = () => {
    console.log(this.state.text);
    if (this.state.text) {
      let api = new ApexAPI(global.user);
      api
        .post("contact", {
          text: this.state.text
        })
        .then(data => data.json())
        .then(data => {
          console.log(data);
          if (data.status == "ok") {
            this.props.screenProps.message.current.success(
              "Feedback sent successfully!"
            );
            this.setState({ text: "" });
          } else {
            this.props.screenProps.message.current.error(data.body.error);
          }
        })
        .catch(e => {
          this.props.screenProps.message.current.error(e.message);
        });
    } else {
      this.props.screenProps.message.current.error("Error: message requires body");
    }

  };
  render() {
    return (
      <View style={[styles.container, global.user.primaryTheme()]}>
        <HeaderBar
          iconLeft={
            <Touchable onPress={() => this.props.navigation.goBack()}>
              <LeftIcon size={28} />
            </Touchable>
          }
          iconRight={<EmptyIcon width={28} height={32} />}
          width={width}
          height={60}
          title="Feedback"
        />
        <View style={[styles.bodyHolder, global.user.primaryTheme()]}>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 30
            }}
            bounces={false}
          >
            <TextInput
              ref={this.textInput}
              value={this.state.text}
              onChangeText={text => this.setState({ text })}
              style={[
                {
                  width: width * 0.8,
                  backgroundColor: global.user.getSecondaryTheme(),
                  minHeight: width * 0.5,
                  borderRadius: 5,
                  padding: 20,
                  paddingTop: 20,
                  fontSize: 18,
                  color: global.user.getSecondaryTextColor()
                },
                boxShadows.boxShadow4
              ]}
              placeholderTextColor={global.user.getTertiaryTextColor()}
              multiline={true}
              placeholder={"Give your feedback here!"}
            />
            <Touchable onPress={this.sendMessage}>
              <Text
                style={[
                  {
                    textAlign: "center",
                    fontSize: 18,
                    color: "white",
                    fontWeight: "600",
                    width: width * 0.8,
                    marginTop: 20,
                    padding: 10,
                    backgroundColor: "#3dbfae",
                    borderRadius: 22
                  },
                  boxShadows.boxShadow2
                ]}
              >
                SUBMIT
              </Text>
            </Touchable>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    flexGrow: 1,
    backgroundColor: "#f0f0f0"
  },
  bodyHolder: {
    zIndex: 1,
    height: ifIphoneX(height - 80, height - 60)
  },
  courseRow: {
    alignItems: "center",
    flexDirection: "row",
    width: width,
    height: 50.0,
    backgroundColor: "white"
  },
  courseRowInfo: {
    height: 50.0,
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "rgb(210,210,210)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: 10
  },
  courseRowStack: {
    flexDirection: "column"
  },
  icon: {
    width: 35,
    height: 35,
    margin: 7.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  },
  courseRowCourse: {
    fontSize: 17
  },
  courseRowTeacher: {
    fontSize: 10,
    fontStyle: "italic",
    opacity: 0.7
  },
  courseRowTime: {
    fontSize: 17
  },
  dayList: {
    borderColor: "rgb(210,210,210)",
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    marginTop: 10
  }
});
