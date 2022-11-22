
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Image } from "react-native";
import 'intl';
import 'intl/locale-data/jsonp/en';

export default function App() {
  const [location, setLocation] = useState("toronto");
  const [lat, setLat] = useState(44.6532);
  const [lng, setLng] = useState(-79.3832);
  const [unit, setUnit] = useState(`metric`);
  const [weather, setWeather] = useState({
    current: { weather: [{ description: '' }] },
    daily: [{ temp: [{ min: '', max: '', rain: '' }] }],
    alerts: {}
  });
  const [cityName, setcityName] = useState("Toronto, CA")

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
    const numAddressElements = data.results[0].address_components.length;
    setcityName((data.results[0].address_components[numAddressElements - 2].long_name) + ", " +
      (data.results[0].address_components[numAddressElements - 1].short_name))
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
      <Text style={styles.descripText}>{weather.current.weather[0].description}</Text>
      <Text style={styles.locationText}>{cityName}</Text>
      <View style={styles.currentContainer}>
        <Text style={styles.textCurrent}>{Math.round(weather.current.temp)}°</Text>
      </View>
      <View style={styles.detailContainer}>
        <View style={styles.currentDetails}>
          <View style={styles.StatBox}>
            <Text style={styles.label}>Min</Text>
            <Text style={styles.label}>{Math.round(weather.current.feels_like)}°</Text>
          </View>
          <View style={styles.StatBox}>
            <Text style={styles.label}>Feels Like</Text>
            <Text style={styles.label}>{Math.round(weather.daily[0].temp.min)}°</Text>
          </View>
          <View style={styles.StatBox}>
            <Text style={styles.label}>Max</Text>
            <Text style={styles.label}>{Math.round(weather.daily[0].temp.max)}°</Text>
          </View>
        </View>
        <View style={styles.currentDetails}>
          <View style={styles.StatBox}>
            <Text style={styles.label}>Wind</Text>
            <Text style={styles.label}>{Math.round(weather.current.wind_speed)} m/s</Text>
          </View>
          <View style={styles.StatBox}>
            <Text style={styles.label}>Humidity</Text>
            <Text style={styles.label}>{weather.current.humidity}%</Text>
          </View>
          <View style={styles.StatBox}>
            <Text style={styles.label}>Rain</Text>
            <Text style={styles.label}>{weather.daily > 0 ? weather.daily[0].temp.rain : "0"}mm</Text>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.forecastScroll}>
        <View style={styles.detailContainer}>
          {weather.daily[1] ? <FutureForecast day={weather.daily[1]} index={1} /> : null}
        </View>
        <View style={styles.detailContainer}>
          {weather.daily[2] ? <FutureForecast day={weather.daily[2]} index={2} /> : null}
        </View>
        <View style={styles.detailContainer}>
          {weather.daily[3] ? <FutureForecast day={weather.daily[3]} index={3} /> : null}
        </View>
        <View style={styles.detailContainer}>
          {weather.daily[4] ? <FutureForecast day={weather.daily[4]} index={4} /> : null}
        </View>
        <View style={styles.detailContainer}>
          {weather.daily[5] ? <FutureForecast day={weather.daily[5]} index={5} /> : null}
        </View>
        <View style={styles.detailContainer}>
          {weather.daily[6] ? <FutureForecast day={weather.daily[6]} index={6} /> : null}
        </View>
        <View style={styles.detailContainer}>
          {weather.daily[7] ? <FutureForecast day={weather.daily[7]} index={7} /> : null}
        </View>
      </ScrollView>
    </View >
  );
};


const LocationSearch = ({
  location, setLocation,
  lat, setLat,
  lon, setLon,
  cityName, setcityName,
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

const FutureForecast = ({ day, index }) => {

  const dayWeek = (dayData) => {
    const options = { weekday: 'short' };
    const dayDate = new Date(dayData.dt * 1000);
    return (new Intl.DateTimeFormat('en-CA', options).format(dayDate.getDay()));
  };

  return (
    <View styles={styles.detailContainer}>
      <View styles={styles.StatBox}>
        <Text styles={styles.weekDay}>{dayWeek(day)}</Text>
      </View>
      <Image styles={styles.weekIcon}
        source={{
          url: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`
        }}
        resizeMode={"contain"}
      />
      <Text style={styles.label}>{Math.round(day.temp.day)}°</Text>
    </View>
  );
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
    // backgroundColor: "white"
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
    marginTop: 5,
    fontSize: 15,
    color: "black",
    marginBottom: 15,
  },
  descripText: {
    display: "flex",
    justifyContent: "center",
    marginTop: 5,
    fontSize: 15,
    color: "black",
    textTransform: "capitalize",
    marginBottom: 15,
  },
  weatherSearch: {
    height: 50,
    margin: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    minWidth: '90%',
    textAlign: "center",
    marginTop: 30,
    color: "black",
  },
  currentDetails: {
    display: "flex",
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-around",
    alignItems: "center",
    alignContent: "center",
    padding: 10,
  },
  textTitle: {
    borderRadius: 5,
  },
  currentContainer: {
    padding: 5,
    alignContent: "center",
    // backgroundColor: "blue",
    justifyContent: "center",
  },
  detailContainer: {
    padding: 5,
    backgroundColor: "white",
    display: "flex",
    margin: 20,
    width: "95%",
    alignContent: "space-between",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
  },
  forecastScroll: {
    flexGrow: 1,
    flex: 1,
    minWidth: "95%",
    alignItems: "center",
    justifyContent: "space-around",
    alignContent: "center",
  },
  StatBox: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12
  },
  futureContainer: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    display: "flex",
    margin: 10,
    alignItems: 10
  },
  weekIcon: {
    width: 50,
    height: 50,
  },
});
