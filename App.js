
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from "react-native";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { NativeBaseProvider, Box } from "native-base";

dayjs.extend(customParseFormat);

export default function App() {
  const [location, setLocation] = useState("L4G7W7");
  const [lat, setLat] = useState(44.6532);
  const [lng, setLng] = useState(-79.3832);
  const [unit, setUnit] = useState(`metric`);
  const [weather, setWeather] = useState({
    current: { weather: [{ description: `` }] },
    daily: {},
    alerts: {}
  });

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
    setLng(data.results[0].geometry.location.lng);
    // if (data.results[0].address_components[4].short_name == "US") {
    //   setUnit('imperial')
    // }
  };


  const fetchWeather = async () => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?`
      + `lat=${lat}&lon=${lng}&exclude={}&appid=${OPEN_API}&units=${unit}`
    );
    if (!res.ok) {
      throw new Error(`OPENWEATHER HTTPS ERROR: ${res.status}`);
    }
    const data = await res.json();
    setWeather(data);
  };



  useEffect(() => {
    fetchWeather()
  }, [lat, lng]);


  return (
    <View style={styles.container}>
      <LocationSearch
        location={location}
        setLocation={setLocation}
        lat={lat}
        setLat={setLat}
        fetchLatLon={fetchLatLon}
      />
      <Text style={styles.locationText}>Timezone: {weather.timezone}</Text>
      <View style={styles.currentContainer}>
        <Text style={styles.textCurrent}>{Math.round(weather.current.temp)}°</Text>
      </View>
      <Text style={styles.locationText}>{weather.current.weather[0].description}</Text>
    </View>
  );
};


const LocationSearch = ({
  location, setLocation,
  lat, setLat,
  lon, setLon,
  fetchLatLon,
  // fetchWeather
}) => {

  const onChangeText = (newText) => {
    setLocation(newText);
  };

  const searchHandle = (e) => {
    fetchLatLon();
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput style={styles.weatherSearch}
        onChangeText={onChangeText}
        placeholder="Search by City or Postal Code"
        onSubmitEditing={searchHandle}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
  },
  textCurrent: {
    textAlign: "center",
    borderRadius: 5,
    width: "50%",
    fontSize: 50,
    fontWeight: "bold",
    backgroundColor: "white"
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  locationText: {
    display: "flex",
    justifyContent: "center",
    marginTop: 15,
    fontSize: 20,
    color: "black",
    backgroundColor: "white",
    marginBottom: 15,
  },
  weatherSearch: {
    height: 50,
    margin: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    minWidth: '80%',
    textAlign: "center",
    marginTop: 30,
    color: "black",
  },
  textTitle: {
    borderRadius: 5,
  },
  currentContainer: {
    padding: 5,
    alignContent: "center",
    backgroundColor: "blue",
    justifyContent: "center",
  },
});


