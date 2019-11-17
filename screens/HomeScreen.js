import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import User from "../User";
import styles from "../constants/styles";
import firebase from "firebase";

export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "chats",
      headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            style={{ width: 32, height: 32, marginRight: 5 }}
            source={require("../images/user.png")}
          />
        </TouchableOpacity>
      )
    };
  };

  state = {
    users: []
  };

  componentWillMount = () => {
    let dbRef = firebase.database().ref("users");
    dbRef.on("child_added", val => {
      let person = val.val();
      person.phone = val.key;
      if (person.phone === User.phone) {
        User.name === person.name;
      } else {
        this.setState(prevstate => {
          return {
            users: [...prevstate.users, person]
          };
        });
      }
    });
  };

  renderRow = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate("Chat", item)}
        style={{
          width: 200,
          padding: 10,
          borderBottomColor: "#ccc",
          borderBottomWidth: 1
        }}
      >
        <Text style={{ fontSize: 20 }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={item => item.phone}
        />
      </SafeAreaView>
    );
  }
}
