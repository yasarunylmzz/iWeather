import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { getBackgroundImage } from "../constants/Clocks";
import { DateTime } from "luxon";
import fetchLocalTime from "../api/fetchLocalTime";

API_KEY = "9f7b96750665ffb639e69a2a081678fc";

const SecondScreen = ({ route, navigation }) => {
  const { city, latitude, longitude } = route.params;
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState("unknown");
  const [currentTimes, setCurrentTimes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let lat = latitude;
        let lon = longitude;

        if (city && city.coord) {
          lat = city.coord.lat;
          lon = city.coord.lon;
        } else if (!city) {
          const cityResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
          );
          const cityData = await cityResponse.json();
          const cityName = cityData[0]?.name || "Unknown";
          setCityName(cityName);
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Hava durumu verilerini alırken hata:", error);
        setWeatherData(null);
      }
    };

    fetchData();
  }, [city, latitude, longitude]);

  let year;
  let month;
  let day;
  let hour;
  let minute;
  let second;
  let dayOfWeekText;
  let monthTexts;
  let dayNamesOfWeek = [];

  if (weatherData && weatherData.list && weatherData.list.length > 0) {
    const dateTime = DateTime.fromFormat(
      weatherData.list[0].dt_txt,
      "yyyy-MM-dd HH:mm:ss"
    );

    year = dateTime.year;
    month = dateTime.month;
    day = dateTime.day;
    hour = dateTime.hour;
    dayOfWeek = dateTime.weekday;
    // console.log(hour);

    const daysOfWeekText = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const monthText = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    monthTexts = monthText[month - 1];
    dayOfWeekText = daysOfWeekText[dayOfWeek - 1];

    const localDateTime = DateTime.local();

    let unixNextDay = [];
    for (let i = 0; i < 5; i++) {
      const nextDayDateTime = localDateTime.plus({ days: i });
      const nextDayUnix = nextDayDateTime.toSeconds();
      unixNextDay.push(nextDayUnix.toFixed(0));
    }

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    for (let i = 0; i < 5; i++) {
      const nextDayDateTime = DateTime.fromSeconds(parseInt(unixNextDay[i]));
      const dayOfWeekIndex = nextDayDateTime.weekday;
      const dayName = dayNames[dayOfWeekIndex - 1];
      dayNamesOfWeek.push(dayName);
    }
  }

  if (weatherData && weatherData.list && weatherData.list.length > 0) {
    const dateTime = weatherData.list[0].dt_txt;
    const hour = dateTime.split(" ")[1].split(":").slice(0, 2).join(":");
    // console.log(hour);
    // console.log(weatherData.list[0].dt_txt);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let lat = latitude;
        let lon = longitude;

        if (!lat && !lon && city && city.coord) {
          lat = city.coord.lat;
          lon = city.coord.lon;
        } else if (!lat && !lon && !city) {
          const cityResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
          );
          const cityData = await cityResponse.json();
          const cityName = cityData[0]?.name || "Unknown";
          setCityName(cityName);
          lat = cityData[0]?.lat || null;
          lon = cityData[0]?.lon || null;
        }

        const currentTime = await fetchLocalTime(lat, lon);
        setCurrentTimes(parseInt(currentTime.split(":")[0], 10));
      } catch (error) {
        console.error("Zaman bilgisini alırken hata:", error);
        setCurrentTimes(null);
      }
    };

    fetchData();
  }, [city, latitude, longitude]);

  return (
    <>
      {weatherData && weatherData.list && weatherData.list.length > 0 ? (
        <ImageBackground
          source={require("../../assets/Background.png")}
          style={styles.background}
        >
          <SafeAreaView>
            <ScrollView>
              <View style={styles.main}>
                <View style={styles.backArrow}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.goBack();
                    }}
                  >
                    <MaterialIcons
                      name="arrow-back-ios-new"
                      size={32}
                      color="white"
                    />
                  </TouchableOpacity>
                  <View style={styles.topIcons}>
                    <Image source={require("../../assets/sembol.png")} />
                    <Text style={styles.stateText}>iWeather</Text>
                  </View>
                </View>
                {/* Üst Kısım */}
                <View style={styles.topSection}>
                  {/* saat kısmı burası */}
                  <ImageBackground
                    source={getBackgroundImage(currentTimes)}
                    style={styles.imageBackground}
                  >
                    {/* Üst Kısım 1 */}
                    <View style={styles.topComp}>
                      <Text style={styles.stateText}>
                        {city && city.name
                          ? `${city.name}, ${city.country}`
                          : cityName}
                      </Text>
                      <Text style={styles.dateText}>
                        {dayOfWeekText}, {monthTexts} {month}, {year}
                      </Text>
                    </View>
                    {/* Üst Kısım 2 */}
                    <View style={styles.top2}>
                      {/* Text Kısmı */}
                      <View style={styles.mainComp}>
                        <Text style={styles.degreeText}>
                          {(weatherData.list[0].main.temp - 273.15).toFixed(0)}
                          ºc
                        </Text>
                        <Text style={styles.feels}>
                          {(weatherData.list[0].main.temp_min - 273.15).toFixed(
                            0
                          )}
                          ºc /{" "}
                          {(weatherData.list[0].main.temp_max - 273.15).toFixed(
                            0
                          )}
                          ºc
                        </Text>
                        <Text style={styles.cloud}>
                          {weatherData.list[0].weather[0].main}
                        </Text>
                      </View>
                      <Image
                        source={require("../../assets/fewClouds.png")}
                        style={styles.weatherImage}
                      ></Image>
                    </View>
                  </ImageBackground>
                </View>

                <View style={styles.secondSection}>
                  <View style={styles.component}>
                    <View style={styles.secondComponent}>
                      <Image
                        style={styles.images}
                        source={require("../../assets/thermalSensation.png")}
                      />
                      <Text style={styles.texts}>Thermal sensation</Text>
                    </View>
                    <Text style={styles.texts}>
                      {(weatherData.list[0].main.feels_like - 273.15).toFixed(
                        0.1
                      )}
                      ºc
                    </Text>
                  </View>

                  <View style={styles.component}>
                    <View style={styles.secondComponent}>
                      <Image
                        style={styles.images}
                        source={require("../../assets/clouds2.png")}
                      />
                      <Text style={styles.texts}>Probability of rain</Text>
                    </View>
                    <Text style={styles.texts}>0%</Text>
                  </View>

                  <View style={styles.component}>
                    <View style={styles.secondComponent}>
                      <Image
                        style={styles.images}
                        source={require("../../assets/wind.png")}
                      />
                      <Text style={styles.texts}>Wind speed</Text>
                    </View>
                    <Text style={styles.texts}>
                      {weatherData.list[0].wind.speed} km/h
                    </Text>
                  </View>

                  <View style={styles.component}>
                    <View style={styles.secondComponent}>
                      <Image
                        style={styles.images}
                        source={require("../../assets/drop.png")}
                      />
                      <Text style={styles.texts}>Air humidity</Text>
                    </View>
                    <Text style={styles.texts}>
                      {weatherData.list[0].main.humidity}%
                    </Text>
                  </View>

                  <View style={styles.component}>
                    <View style={styles.secondComponent}>
                      <Image
                        style={styles.images}
                        source={require("../../assets/sun.png")}
                      />
                      <Text style={styles.texts}>Uv Index</Text>
                    </View>
                    <Text style={styles.texts}>5</Text>
                  </View>
                </View>
                {/* Third Components */}
                <View style={styles.thirdComponents}>
                  <View style={styles.weatherSection}>
                    <Text style={styles.weatherSectionText1}>
                      {dayNamesOfWeek[0].substring(0, 3)}
                    </Text>
                    <Image
                      source={require("../../assets/clear.png")}
                      style={styles.weatherSectionImage}
                    />
                    <View>
                      <Text style={styles.weatherSectionText2}>
                        {(weatherData.list[1].main.temp_max - 273).toFixed(0.1)}
                        ºc
                      </Text>
                      <Text style={styles.weatherSectionText3}>
                        {(weatherData.list[1].main.temp_min - 273).toFixed(0.1)}
                        ºc
                      </Text>
                    </View>
                  </View>

                  <View style={styles.weatherSection}>
                    <Text style={styles.weatherSectionText1}>
                      {dayNamesOfWeek[1].substring(0, 3)}
                    </Text>
                    <Image
                      source={require("../../assets/storm.png")}
                      style={styles.weatherSectionImage}
                    />
                    <View>
                      <Text style={styles.weatherSectionText2}>
                        {(weatherData.list[2].main.temp_max - 273).toFixed(0.1)}
                        ºc
                      </Text>
                      <Text style={styles.weatherSectionText3}>
                        {(weatherData.list[2].main.temp_min - 273).toFixed(0.1)}
                        ºc
                      </Text>
                    </View>
                  </View>

                  <View style={styles.weatherSection}>
                    <Text style={styles.weatherSectionText1}>Wed</Text>
                    <Image
                      source={require("../../assets/rain.png")}
                      style={styles.weatherSectionImage}
                    />
                    <View>
                      <Text style={styles.weatherSectionText2}>
                        {(weatherData.list[3].main.temp_max - 273).toFixed(0.1)}
                        ºc
                      </Text>
                      <Text style={styles.weatherSectionText3}>
                        {(weatherData.list[3].main.temp_min - 273).toFixed(0.1)}
                        ºc
                      </Text>
                    </View>
                  </View>

                  <View style={styles.weatherSection}>
                    <Text style={styles.weatherSectionText1}>
                      {dayNamesOfWeek[3].substring(0, 3)}
                    </Text>
                    <Image
                      source={require("../../assets/fewClouds.png")}
                      style={styles.weatherSectionImage}
                    />
                    <View>
                      <Text style={styles.weatherSectionText2}>
                        {(weatherData.list[4].main.temp_max - 273).toFixed(0.1)}
                        ºc
                      </Text>
                      <Text style={styles.weatherSectionText3}>
                        {(weatherData.list[4].main.temp_min - 273).toFixed(0.0)}
                        ºc
                      </Text>
                    </View>
                  </View>

                  <View style={styles.weatherSection}>
                    <Text style={styles.weatherSectionText1}>
                      {dayNamesOfWeek[4].substring(0, 3)}
                    </Text>
                    <Image
                      source={require("../../assets/cloudy.png")}
                      style={styles.weatherSectionImage}
                    />
                    <View>
                      <Text style={styles.weatherSectionText2}>
                        {(weatherData.list[5].main.temp_max - 273).toFixed(0.1)}
                        ºc
                      </Text>
                      <Text style={styles.weatherSectionText3}>
                        {(weatherData.list[5].main.temp_min - 273).toFixed(0.0)}
                        ºc
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </ImageBackground>
      ) : (
        // Add your desired JSX content here
        <ImageBackground
          source={require("../../assets/Background.png")}
        ></ImageBackground>
      )}
    </>
  );
};

export default SecondScreen;

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  topSection: {
    display: "flex",
    width: 350,
    height: 340,
    overflow: "hidden",
  },
  imageBackground: {
    display: "flex",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    flex: 1,
    overflow: "hidden",
    borderRadius: 10,
  },
  topComp: {
    gap: 5,
  },

  stateText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  dateText: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  mainComp: {
    gap: 3,
  },
  degreeText: {
    color: "white",
    fontSize: 48,
    fontWeight: "800",
    paddingBottom: 5,
  },
  feels: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  cloud: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  weatherImage: {
    objectFit: "contain",
    width: "100%",
    height: 160,
  },
  top2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    objectFit: "cover",
  },
  secondSection: {
    backgroundColor: "rgba(28, 28, 39, 1)",
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  component: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  secondComponent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  images: {
    width: 24,
    height: 24,
  },
  texts: {
    fontWeight: "700",
    color: "rgba(191, 191, 212, 1)",
    fontSize: 14,
    marginLeft: 5,
  },
  thirdComponents: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    width: 360,
    height: 180,
    backgroundColor: "rgba(28, 28, 39, 1)",
    borderRadius: 12,
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  weatherSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  weatherSectionImage: {
    width: "200%",
    height: "55%",
    objectFit: "contain",
  },
  weatherSectionText1: {
    color: "rgba(191, 191, 212, 1)",
    fontSize: 20,
    fontWeight: "700",
  },
  weatherSectionText2: {
    fontSize: 20,
    fontWeight: "700",
    color: "rgba(250, 250, 250, 1)",
  },
  weatherSectionText3: {
    fontSize: 20,
    color: "rgba(191, 191, 212, 1)",
    fontWeight: "700",
  },
  backArrow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  topIcons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
});
