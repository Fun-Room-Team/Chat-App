import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from "react-native";
import User from "../User";
import styles from "../constants/styles";
import firebase from "firebase";
import "firebase/firestore";

export default class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  };
  state = {
    phone: "",
    name: ""
  };

  componentWillMount = () => {
    AsyncStorage.getItem("userPhone").then(val => {
      if (val) {
        this.setState({ phone: val });
      }
    });
  };

  handleChange = key => val => {
    this.setState({ [key]: val });
  };

  sumbitForm = async () => {
    if (this.state.phone.length < 10) {
      Alert.alert("Invalid Phone Number");
    } else if (this.state.name.length < 3) {
      Alert.alert("Invalid Name");
    } else {
      await AsyncStorage.setItem("userPhone", this.state.phone);
      await AsyncStorage.setItem("userName", this.state.name);
      User.phone = this.state.phone;
      User.name = this.state.name;
      firebase
        .database()
        .ref("users/" + User.phone)
        .set({ name: this.state.name });
      this.props.navigation.navigate("App");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Name"
          style={styles.inputs}
          value={this.state.name}
          onChangeText={this.handleChange("name")}
        />
        <TextInput
          style={styles.inputs}
          keyboardType="number-pad"
          placeholder="Phone Number"
          value={this.state.phone}
          onChangeText={this.handleChange("phone")}
        />
        <TouchableOpacity onPress={() => this.sumbitForm()}>
          <Text style={styles.btn}>Enter</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
