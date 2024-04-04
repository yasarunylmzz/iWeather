import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  FlatList,
  ActivityIndicator,
} from "react-native";

import React, { useState, useEffect } from "react";
import citiesData from "../json/cityList.json"; // cities.json dosyanızın bulunduğu yolu buraya ekleyin
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

const FirstScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [loadedCities, setLoadedCities] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [location, setLocation] = useState(null);

  // console.log(lat, lon);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLoadedCities = loadedCities + 10000;

      if (currentLoadedCities <= citiesData.length) {
        // setFilteredCities(citiesData.slice(0, currentLoadedCities));
        setLoadedCities(currentLoadedCities);
      } else {
        clearInterval(interval);
      }
    }, 100000);

    return () => clearInterval(interval);
  }, [loadedCities]);

  useEffect(() => {
    let filtered;
    if (searchQuery.length > 0) {
      filtered = citiesData.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      filtered = [];
    }
    // console.log(filtered.length);
    setFilteredCities(filtered.slice(0, 10));
  }, [searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cityItem}
      onPress={() => {
        handleCityPress(item);
      }}
    >
      <Text style={styles.cityText}>
        {item.name}, {item.country}
      </Text>
    </TouchableOpacity>
  );
  const handleCityPress = (city) => {
    setSelectedCity(city);
    navigation.navigate("SecondScreen", { city: city });
    // console.log(city);
  };

  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };
    // const lat = location.coords.latitude;
    // const lon = location.coords.longitude;
    // console.log(lat, lon);
    getPermission();
  });

  if (location && location.coords) {
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;
    // console.log(location["coords"].latitude, location["coords"].longitude);
    // console.log(location.coords.latitude, location.coords.longitude);
  }

  const handleLocationButtonPress = async () => {
    if (location && location.coords) {
      const { latitude, longitude } = location.coords;
      navigation.navigate("SecondScreen", { latitude, longitude });
    } else {
      console.error("Konum izni verilmedi");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Background.png")}
      style={styles.background}
    >
      <View style={styles.index}>
        <View style={styles.logo}>
          <Image
            source={require("../../assets/sembol.png")}
            style={styles.sembol}
          />
          <Text style={styles.logoText}>iWeather</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Welcome To The </Text>
          <Text style={styles.text2}>TypeWeather</Text>
        </View>
        <View style={styles.textContainer2}>
          <Text style={styles.subtitle}>
            Choose a location to see the weather forecast
          </Text>
          <KeyboardAvoidingView behavior="padding">
            <View style={styles.inputAndLocationButton}>
              <TextInput
                style={styles.inputText}
                placeholder="Şehir Ara"
                onChangeText={(text) => {
                  setSearchQuery(text);
                  {
                    text == "" ? setIsLoading(false) : setIsLoading(true);
                  }
                }}
              />
              <TouchableOpacity
                style={styles.locationWeather}
                onPress={handleLocationButtonPress}
              >
                <Ionicons name="location" size={32} color="white" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <ActivityIndicator
                size="medium"
                color="#8FB2F5"
                style={styles.loadingIcons}
              />
            ) : null}
          </KeyboardAvoidingView>
        </View>
        <View style={styles.flatList}>
          <FlatList
            data={searchQuery.length > 0 ? filteredCities : []}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  textContainer: {
    display: "flex",
    flexDirection: "row",
  },
  textContainer2: {
    display: "flex",
    alignItems: "center",
    paddingTop: 10,
  },
  index: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  text2: {
    color: "#8FB2F5",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#ABABC4",
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    paddingBottom: 10,
  },
  inputText: {
    backgroundColor: "rgba(30, 30, 41, 1)",
    color: "white",
    width: 280,
    height: 60,
    borderRadius: 10,
    paddingLeft: 20,
    marginTop: 20,
    fontWeight: "400",
    fontSize: 16,
    position: "relative",
  },
  logo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: 100,
    height: 100,
    top: 20,
    gap: 5,
  },
  logoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  locations: {
    position: "relative",
    width: 330,
    height: 100,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  touch: {
    backgroundColor: "rgba(30, 30, 41, 1)",
    width: 330,
    height: 60,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
  },
  text3: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 20,
  },
  cityItem: {
    backgroundColor: "rgba(30, 30, 41, 1)",
    width: 350,
    height: 60,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    marginTop: 10,
  },
  cityText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 20,
  },
  sembol: {
    width: 40,
    height: 40,
  },
  flatList: {
    position: "relative",
    height: 200,
  },
  loadingIcons: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 75,
    top: 35,
  },
  locationWeather: {
    backgroundColor: "#1E1E29",
    width: 50,
    height: 50,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    marginTop: 10,
  },
  locationWeather: {
    backgroundColor: "#1E1E29",
    width: 60,
    height: 60,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  inputAndLocationButton: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
});

export default FirstScreen;
