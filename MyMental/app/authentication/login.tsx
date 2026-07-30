import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";

import { router } from "expo-router";

import { login } from "../../src/firebase/auth";

export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = async () => {
    try {

      await login(email, password);

      Alert.alert(
        "Success",
        "Logged in"
      );

    } catch(error:any){

      Alert.alert(
        "Login failed",
        error.message
      );

    }
  };


  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Welcome back
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        title="Login"
        onPress={handleLogin}
      />

      <Button
  title="Create Account"
  onPress={() => router.push("/authentication/signup")}
  />

    </View>
  );
}


const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    padding:24,
  },

  title:{
    fontSize:32,
    marginBottom:30,
  },

  input:{
    borderWidth:1,
    borderColor:"#ccc",
    padding:12,
    borderRadius:8,
    marginBottom:15,
  },

});