import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image
} from "react-native";
import styles from "../constants/styles";
import User from "../User";
import firebase from "firebase";

export default class ChatsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("name", null)
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      person: {
        name: props.navigation.getParam("name"),
        phone: props.navigation.getParam("phone")
      },
      textMessage: "",
      messagesList: []
    };
  }

  componentDidMount = () => {
    firebase
      .database()
      .ref("messages")
      .child(User.phone)
      .child(this.state.person.phone)
      .on("child_added", value => {
        this.setState(prevState => {
          return {
            messagesList: [...prevState.messagesList, value.val()]
          };
        });
      });
  };

  handleChange = key => val => {
    this.setState({ [key]: val });
  };

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = firebase
        .database()
        .ref("messages")
        .child(User.phone)
        .child(this.state.person.phone)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: User.phone
      };
      updates[
        "messages/" + User.phone + "/" + this.state.person.phone + "/" + msgId
      ] = message;
      updates[
        "messages/" + this.state.person.phone + "/" + User.phone + "/" + msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
    }
    this.setState({ textMessage: "" });
  };

  convertTime = time => {
    var ts = new Date(time);
    return ts.toDateString();
  };

  renderRow = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          width: "auto",
          alignSelf: item.from === User.phone ? "flex-end" : "flex-start",
          backgroundColor: item.from === User.phone ? "#00897b" : "#111",
          borderRadius: 5,
          marginBottom: 10
        }}
      >
        <Text style={{ color: "#fff", padding: 7, fontSize: 16 }}>
          {item.message}
        </Text>
        <Text style={{ color: "#ccc", padding: 3, fontSize: 9 }}>
          {this.convertTime(item.time)}
        </Text>
      </View>
    );
  };

  render() {
    let { height, width } = Dimensions.get("window");
    return (
      <SafeAreaView>
        <FlatList
          style={{ padding: 10, height: height * 0.8 }}
          data={this.state.messagesList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={styles.inputs}
            value={this.state.textMessage}
            placeholder="Type A Message ..."
            onChangeText={this.handleChange("textMessage")}
          />
          <TouchableOpacity
            onPress={() => this.sendMessage()}
            style={{ paddingBottom: 10, marginLeft: 5 }}
          >
            <Text style={{ fontSize: 40, color: "darkblue" }}> &#x27A2;</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
