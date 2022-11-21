import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from "react-native";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function App() {
  const [location, setLocation] = useState("L4G7W7");
  const [error, setError] = useState(null);
  const [lat, setLat] = useState(44);
  const [lon, setLon] = useState(-79);
  const [weather, setWeather] = useState({
    current: {},
    daily: {},
    alerts: {}
  });
  const [unit, setUnit] = useState(`metric`);
  const OPEN_API = "30374f93c545aa34a2ac616c7d07d46f";
  const GEOCODE_API = "AIzaSyCk4bjICPjyZ5XRCMNMn8xxB4dB88TnUhs";

  const fetchLatLon = async () => {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?`
      + `address=${location}&key=${GEOCODE_API}`
    );
    if (!res.ok) {
      throw new Error(`GEOCODE HTTPS ERROR: ${res.status}`);
    }
    const data = await res.json();
    setLat(data.results[0].geometry.location.lat);
    setLon(data.results[0].geometry.location.lng);
    // if (data.results[0].address_components[4].short_name == "US") {
    //   setUnit('imperial')
    // }
  };

  const fetchWeather = async () => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?`
      + `lat=${lat}&lon=${lon}&exclude={}&appid=${OPEN_API}&units=${unit}`
    );
    if (!res.ok) {
      throw new Error(`OPENWEATHER HTTPS ERROR: ${res.status}`);
    }
    const data = await res.json();
    setWeather(data);
  };

  const onChangeText = (newText) => {
    setLocation(newText);
  };

  const LocationSearch = ({
    location, setLocation,
    lat, setLat,
    lon, setLon,
    fetchLatLon,
    // fetchWeather
  }) => {

    // const searchHandle = (e) => {
    //   fetchLatLon();
    // };

    return (
      <View style={styles.container}>
        <TextInput style={styles.weatherSearch}
          onChangeText={onChangeText}
          placeholder="Search by City or Postal Code"
          onSubmitEditing={fetchLatLon()}
        />
      </View>
    )
  }


  useEffect(() => {
    fetchWeather()
  }, [lat, lon]);


  return (
    <View style={styles.container}>
      <LocationSearch
        location={location}
        setLocation={setLocation}
        lat={lat}
        setLat={setLat}
        fetchLatLon={fetchLatLon}
      />
      <Text>{weather.current.temp}°</Text>
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
  text: {
    textAlign: "center",
  },
  weatherSearch: {
    fontSize: 20,
    textAlign: "center",
    color: "black",
    // color: "#FFFFFF",
    // margin: 12,
    // marginTop: 12,
    // borderRadius: 5,
    // width: "95%",
    // height: 50,

  },
  textTitle: {
    borderRadius: 5,
  },
  buttonContainer: {
    padding: 5,
  },
});


