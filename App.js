import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from "react";
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from "react-native";



export default function App() {
  const [location, setLocation] = useState("toronto");
  const [error, setError] = useState(null);
  const [lat, setLat] = useState(44);
  const [lon, setLon] = useState(-79);
  const [weather, setWeather] = useState({});
  const [unit, setUnit] = useState(`metric`);
  const OPEN_API = "30374f93c545aa34a2ac616c7d07d46f";
  const GEOCODE_API = "AIzaSyCk4bjICPjyZ5XRCMNMn8xxB4dB88TnUhs";

  const fetchLatLon = async() => {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?`+`address=${location}&key=${GEOCODE_API}`
    );
    if (!res.ok){
      throw new Error(`GEOCODE HTTPS ERROR: ${res.status}`);
    }
    const data = await res.json();
    setLat(data.results[0].geometry.location.lat);
    setLon(data.results[0].geometry.location.lng);
    if (data.results[0].address_components[4].short_name == "US") {
      setUnit('imperial')
    }
  };

  const fetchWeather = async() => {
     const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?`
       + `lat=${lat}&lon=${lon}&exclude={}&appid=${OPEN_API}&units=${unit}`
    );
    if (!res.ok){
      throw new Error(`OPENWEATHER HTTPS ERROR: ${res.status}`);
    }
    const data = await res.json();
    setWeather(data);
    };
  

  useEffect(() => {
    fetchWeather()
  },[lat, lon]);


  return (
  <View style={styles.container}>
    <Text>{JSON.stringify(weather.current.temp)} C</Text>
    <StatusBar style="auto" />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ADD8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    textAlign: "center",
  },
  textTitle:{

  },
  buttonContainer: {
    padding: 5,
  },
});


const LocationSearch = ({

})