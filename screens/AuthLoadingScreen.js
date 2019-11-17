import React from "react";
import { ActivityIndicator, AsyncStorage, StatusBar, View } from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import User from "../User";

export default class AuthLoadingScreen extends React.Component {  
  componentDidMount() {
    this._bootstrapAsync();
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyC5H_NnSNYdWuSacNauxd76qyuvsBuaOHA",
      authDomain: "fir-chat-f80f2.firebaseapp.com",
      databaseURL: "https://fir-chat-f80f2.firebaseio.com",
      projectId: "fir-chat-f80f2",
      storageBucket: "fir-chat-f80f2.appspot.com",
      messagingSenderId: "557651244090",
      appId: "1:557651244090:web:c1d5feffdad0d659de3103",
      measurementId: "G-HSE8N0PD61"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem("userPhone");
    this.props.navigation.navigate(User.phone ? "App" : "Auth");
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
