import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  AsyncStorage,
  TouchableOpacity,
  Alert
} from "react-native";
import User from "../User";
import styles from "../constants/styles";
import firebase from "firebase";

export default class ProfileScreen extends Component {
  static navigationOptions = {
    title: "Profile"
  };

  state = {
    name: ""
  };

  componentDidMount = async () => {
    name = await AsyncStorage.getItem("userName");
    this.setState({ name });
  };

  handleChange = key => val => {
    this.setState({ [key]: val });
  };

  changeName = async () => {
    if (this.state.name.length < 3) {
      Alert.alert("Please enter a valid name");
    } else {
      firebase
        .database()
        .ref("users")
        .child(User.phone)
        .set({ name: this.state.name });
      await AsyncStorage.setItem("userName", this.state.name);
      Alert.alert("seccuss");
    }
  };

  _logout = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text>{User.phone}</Text>
        <TextInput
          style={styles.inputs}
          value={this.state.name}
          onChangeText={this.handleChange("name")}
        />
        <TouchableOpacity onPress={this.changeName}>
          <Text style={styles.btn}>Change Name</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop:30}} onPress={this._logout}>
          <Text style={styles.btn}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
