import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from "react-native-paper";
import AuthScreen from "./screens/Auth";
import HomeScreen from "./screens/Home";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "./components/Loading";
import { View } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    AsyncStorage.getItem('isSignedIn').then((value) => {
      setIsSignedIn(value);
    }).finally(() => {
      setIsLoading(false);
    });
  })
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
          contentStyle: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
          }
        }}>
          {isLoading && (
            <Stack.Screen name="LoadingScreen" >
              {props => <View className="bg-white h-screen items-center justify-center" {...props}><Loading /></View>}
            </Stack.Screen>
          )}
          {!isLoading && isSignedIn && (
            <>
              <Stack.Screen name="HomeScreen" >
                {props => <HomeScreen {...props} setIsSignedIn={setIsSignedIn} />}
              </Stack.Screen>
            </>
          )}
          {!isLoading && !isSignedIn && (
            <>
              <Stack.Screen name="AuthScreen">
                {props => <AuthScreen {...props} setIsSignedIn={setIsSignedIn} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
