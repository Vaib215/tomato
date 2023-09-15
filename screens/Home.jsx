import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";
import {
  default as Icon,
  default as MaterialCommunityIcons,
} from "react-native-vector-icons/MaterialCommunityIcons";
import CartItem from "../components/CartItem";
import ItemCard from "../components/ItemCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as Location from "expo-location";
import dayjs from "dayjs";

import Voice from "@react-native-voice/voice";
import * as Speech from "expo-speech";

const Tab = createBottomTabNavigator();

const Home = () => {
  const vegetables = [
    {
      vegName: "tomato",
      price: 50,
      img: "https://5.imimg.com/data5/SELLER/Default/2023/3/294927331/LR/TQ/FD/186092443/hybrid-fresh-tomato.jpg",
    },
    {
      vegName: "potato",
      price: 25,
      img: "https://thumbs.dreamstime.com/b/raw-potatoes-white-background-61790721.jpg",
    },
    {
      vegName: "onion",
      price: 30,
      img: "https://media.istockphoto.com/id/503144946/photo/red-onion-with-the-outer-peel-removed.jpg?s=612x612&w=0&k=20&c=Zq7KI5GtxL8Ag2nHkGMOcqzuKBdFlnoHaoTEz1f8iRQ=",
    },
    {
      vegName: "lady Finger",
      price: 38,
      img: "https://uzhavu.in/image/cache/data/uzhavu/Vegetables/organic-Lady-Finger-650x650.jpg",
    },
    {
      vegName: "Brinjal",
      price: 46,
      img: "https://doorkisan.com/wp-content/uploads/2016/05/Bharta-Brinjal-Doorkisan6.jpg",
    },
    {
      vegName: "carrot",
      price: 35,
      img: "https://5.imimg.com/data5/SELLER/Default/2023/8/333669988/YR/XN/PC/28069126/organic-fresh-carrot-500x500.png",
    },
    {
      vegName: "capsicum",
      price: 84,
      img: "https://5.imimg.com/data5/SELLER/Default/2021/11/PA/KQ/DQ/74559679/green-capsicum-vegetable-500x500.png",
    },
    {
      vegName: "cauliflower",
      price: 110,
      img: "https://5.imimg.com/data5/SELLER/Default/2023/7/323950624/KJ/BQ/VJ/72589457/organic-white-cauliflower-500x500.jpg",
    },
    {
      vegName: "cabbage",
      price: 60,
      img: "https://images.eatthismuch.com/img/1903_Kitako13_8b1faec3-3d68-4ed5-a7b7-5b6cce4b2a24.png",
    },
    {
      vegName: "pumpkin",
      price: 55,
      img: "https://img.freepik.com/free-vector/fresh-pumpkin-white-b_1308-39708.jpg?w=2000",
    },
  ];

  return (
    <View className="h-full bg-white p-4 pb-0">
      <TextInput mode="outlined" placeholder="Search..." />
      <ScrollView className="mt-4">
        <View className="py-4 flex-row flex-wrap justify-around">
          {vegetables.map((vegetable, index) => (
            <ItemCard
              key={index}
              vegName={vegetable.vegName}
              price={vegetable.price}
              img={vegetable.img}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const Alerts = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState(null);

  const weatherImages = {
    rainy: "https://chitra.vaib.live/Ck8uFDJt0X",
    sunny: "https://chitra.vaib.live/DnOJZtN28q",
    cloudy: "http://chitra.vaib.live/~6s4U0GFjp",
    windy: "http://chitra.vaib.live/~SjSEgF-F5",
  };

  const getWeatherCondition = (data) => {
    const rainSum = data.daily.rain_sum;
    const maxTemperature = data.daily.temperature_2m_max;
    const minTemperature = data.daily.temperature_2m_min;
    const windSpeed = data.daily.windspeed_10m_max;
    const currentDate = new Date().toISOString().split("T")[0];
    const currentIndex = data.daily.time.indexOf(currentDate);
    const isRainy = rainSum[currentIndex] > 0;
    const temperatureRange =
      maxTemperature[currentIndex] - minTemperature[currentIndex];
    const isWindy = windSpeed[currentIndex] > 15;
    let weatherCondition = "";
    if (isRainy) {
      weatherCondition = "rainy";
    } else if (temperatureRange < 5) {
      weatherCondition = "cloudy";
    } else if (maxTemperature[currentIndex] > 30 && !isRainy) {
      weatherCondition = "sunny";
    } else if (isWindy) {
      weatherCondition = "windy";
    } else {
      weatherCondition = "unknown";
    }
    setCondition(weatherCondition);
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    const result = await Location.getCurrentPositionAsync({});
    setLocation(result);
  };

  const getWeather = async () => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location?.coords.latitude}&longitude=${location?.coords.longitude}&daily=temperature_2m_max,temperature_2m_min,rain_sum,windspeed_10m_max&timezone=auto&forecast_days=3`
    );
    const data = await response.json();
    setWeatherData(data);
    getWeatherCondition(data);
  };

  const init = async () => {
    getWeather();
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    init();
  }, [location]);

  return (
    <View className="h-full bg-white p-4">
      {weatherData && (
        <>
          <Card className="p-4 w-full bg-white relative border">
            <Card.Cover
              className="w-36 h-36 bg-transparent p-4"
              source={{
                uri:
                  weatherImages[condition] ||
                  "https://chitra.vaib.live/6s4U0GFjp",
              }}
            />
            <Card.Content className="justify-center pt-4 absolute left-32 top-0 bottom-0  w-fit text-right">
              <Text className="text-xl  text-yellow-800 capitalize font-semibolde">
                <Icon name="thermometer" size={24} />
                {weatherData?.daily?.temperature_2m_max[0] + "°C" ||
                  "Loading..."}
              </Text>
              <Text className="text-xl text-yellow-800 capitalize font-semibold">
                <Icon name="weather-cloudy" size={24} />
                {condition}
              </Text>
              <Text className="text-xl text-yellow-800 font-semibold">
                <Icon name="weather-windy" size={24} />
                {weatherData?.daily?.windspeed_10m_max[0] + " km/hr" ||
                  "Loading..."}
              </Text>
              <Text className="text-xl text-yellow-800 font-semibold">
                <Icon name="weather-rainy" size={24} />
                {weatherData?.daily?.rain_sum[0] + " mm" || "Loading..."}
              </Text>
            </Card.Content>
          </Card>
          <View className="flex-row gap-x-4 justify-between mt-4">
            <Card className="w-48 bg-white relative border">
              <Card.Cover
                className="w-24 h-24 bg-transparent p-4"
                source={{
                  uri:
                    weatherImages[condition] ||
                    "https://chitra.vaib.live/6s4U0GFjp",
                }}
              />
              <Card.Content className="justify-center pt-4 absolute left-16 top-0 bottom-0  w-fit text-right">
                <Text className="text-xl  text-yellow-800 capitalize font-semibolde">
                  {dayjs(weatherData?.daily?.time[1]).format("DD MMM, YY") ||
                    "Loading..."}
                </Text>

                <Text className="text-xl  text-yellow-800 capitalize font-semibolde">
                  <Icon name="thermometer" size={24} />
                  {weatherData?.daily?.temperature_2m_max[1] + "°C" ||
                    "Loading..."}
                </Text>
                <Text className="text-xl text-yellow-800 capitalize font-semibold">
                  <Icon name="weather-cloudy" size={24} />
                  {condition}
                </Text>
              </Card.Content>
            </Card>
            <Card className="p-1 w-48 bg-white relative border">
              <Card.Cover
                className="w-24 h-24 bg-transparent p-4"
                source={{
                  uri:
                    weatherImages[condition] ||
                    "https://chitra.vaib.live/6s4U0GFjp",
                }}
              />
              <Card.Content className="justify-center pt-4 absolute left-16 top-0 bottom-0  w-fit text-right">
                <Text className="text-xl  text-yellow-800 capitalize font-semibolde">
                  {dayjs(weatherData?.daily?.time[1]).format("DD MMM, YY") ||
                    "Loading..."}
                </Text>

                <Text className="text-xl  text-yellow-800 capitalize font-semibolde">
                  <Icon name="thermometer" size={24} />
                  {weatherData?.daily?.temperature_2m_max[2] + "°C" ||
                    "Loading..."}
                </Text>
                <Text className="text-xl text-yellow-800 capitalize font-semibold">
                  <Icon name="weather-cloudy" size={24} />
                  {condition}
                </Text>
              </Card.Content>
            </Card>
          </View>
        </>
      )}
    </View>
  );
};

const Schemes = () => {
  return <></>;
};

const Tips = () => {
  return <></>;
};

const ChatBot = () => {
  const [recognized, setRecognized] = useState("");
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechRecognized = (e) => {
    console.log("onSpeechRecognized: ", e);
    setRecognized("√");
  };

  const onSpeechResults = (e) => {
    console.log("onSpeechResults: ", e);
    setResults(e.value);
  };

  const onSpeechPartialResults = (e) => {
    console.log("onSpeechPartialResults: ", e);
    setPartialResults(e.value);
  };

  const onSpeechError = (e) => {
    console.log("onSpeechError: ", e);
  };

  const startListening = async () => {
    setRecognized("");
    setResults([]);
    setPartialResults([]);
    try {
      await Voice.start("en-US");
      setIsListening(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", position: "relative" }}>
      <View style={{ position: "absolute", bottom: 20, alignSelf: "center" }}>
        <IconButton
          className="border-4 mx-auto"
          icon={isListening ? "microphone-off" : "microphone"}
          size={64}
          onPress={() => {
            if (isListening) {
              stopListening();
            } else {
              startListening();
            }
          }}
        />
      </View>
    </View>
  );
};

const Feed = () => {
  const FeedTabs = createMaterialTopTabNavigator();

  return (
    <View className="h-full bg-white py-4 pb-0">
      <Text className="text-2xl font-semibold px-4">Sahayak</Text>
      <FeedTabs.Navigator>
        <FeedTabs.Screen name="Alerts" component={Alerts} />
        <FeedTabs.Screen name="Chat" component={ChatBot} />
        <FeedTabs.Screen name="Schemes" component={Schemes} />
        <FeedTabs.Screen name="Tips" component={Tips} />
      </FeedTabs.Navigator>
    </View>
  );
};

const Cart = () => {
  return (
    <View className="h-full bg-white p-4 pb-0">
      <Text className="text-2xl font-semibold">Cart</Text>
      <ScrollView className="mt-4">
        <View className="py-4">
          <CartItem
            vegName="Tomato"
            price={50}
            img="https://5.imimg.com/data5/SELLER/Default/2023/3/294927331/LR/TQ/FD/186092443/hybrid-fresh-tomato.jpg"
          />
          <CartItem
            vegName="Potato"
            price={25}
            img="https://thumbs.dreamstime.com/b/raw-potatoes-white-background-61790721.jpg"
          />
          <CartItem
            vegName="Onion"
            price={30}
            img="https://media.istockphoto.com/id/503144946/photo/red-onion-with-the-outer-peel-removed.jpg?s=612x612&w=0&k=20&c=Zq7KI5GtxL8Ag2nHkGMOcqzuKBdFlnoHaoTEz1f8iRQ="
          />
        </View>
      </ScrollView>
      <View className="absolute bottom-0 w-screen flex-row justify-between items-center p-4">
        <Text className="text-2xl">
          Total: <Text className="font-bold">₹ 200</Text>
        </Text>
        <Button
          mode="contained"
          className="rounded-full bg-red-500"
          onPress={() => {}}
        >
          <Text className="font-semibold text-xl text-white">Place Order</Text>
        </Button>
      </View>
    </View>
  );
};

const Profile = ({ setIsSignedIn }) => {
  return (
    <View className="h-full bg-white p-4 pb-0">
      <Text className="text-2xl font-semibold">Profile</Text>
      <View className="flex-row items-center p-2 mt-4 border rounded space-x-2">
        <Icon name="account" size={36} />
        <Text className="text-xl">Vaibhav Kumar Singh</Text>
      </View>
      <View className="flex-row items-center p-2 mt-4 border rounded space-x-2">
        <Icon name="email" size={36} />
        <Text className="text-xl">sisodiya.vaib215@gmail.com</Text>
      </View>

      <Button
        onPress={() => {
          AsyncStorage.removeItem("isSignedIn");
          setIsSignedIn(false);
        }}
        className="mt-auto mb-4 bg-red-500"
        mode="contained"
      >
        <Text className="text-xl font-semibold text-white">Sign Out</Text>
      </Button>
    </View>
  );
};

const HomeScreen = ({ setIsSignedIn }) => {
  return (
    <View className="h-screen">
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#e91e63",
          tabBarStyle: {
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 16,
            marginBottom: 2,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={36} />
            ),
          }}
          component={Home}
        />
        <Tab.Screen
          name="Sahayak"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="map" color={color} size={36} />
            ),
          }}
          component={Feed}
        />
        <Tab.Screen
          name="Cart"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cart" color={color} size={36} />
            ),
          }}
          component={Cart}
        />
        <Tab.Screen
          name="Profile"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={36} />
            ),
          }}
        >
          {(props) => <Profile {...props} setIsSignedIn={setIsSignedIn} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default HomeScreen;
