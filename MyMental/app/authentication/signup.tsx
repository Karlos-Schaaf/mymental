import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../src/firebase/auth";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {
  console.log("Signup button pressed");
  console.log("Email:", JSON.stringify(email));
  console.log("Password:", JSON.stringify(password));

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    console.log("User created:", userCredential.user.email);

  } catch (error) {
    console.log("Signup error:", error);
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Create Account
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
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
        title="Sign Up"
        onPress={handleSignup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    padding:20,
  },
  title:{
    fontSize:28,
    marginBottom:20,
  },
  input:{
    borderWidth:1,
    padding:12,
    marginBottom:15,
    borderRadius:8,
  },
});