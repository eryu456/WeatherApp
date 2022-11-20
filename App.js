import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import { StyleSheet, Text, View } from 'react-native';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from "react-native";



export default function App() {
  const [city, setCity] = useState(null);
  const [postal, setPostal] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = () => {
    fetch(
      "https://api.openweathermap.org/data/2.5/onecall?lat=44&lon=-79&exclude={}&appid=30374f93c545aa34a2ac616c7d07d46f"
    )
    .then((res) => res.json())

    };

  };


  const onPressLocate = () => {

  };


  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <View style={styles.buttonContainer}>
        <Button
          title = "Location"
          onPress={onPressLocate}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    textAlign: "center";
  },
  buttonContainer: {
    padding: 5,
  },
});
