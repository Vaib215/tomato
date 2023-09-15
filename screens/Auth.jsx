import { View, Text, Image, ToastAndroid } from "react-native";
import React, { useState } from "react";
import { Button, TextInput } from "react-native-paper";
import { getOtp, verifyOtp } from "../utils/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthScreen = ({ setIsSignedIn }) => {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <View className="bg-white min-h-screen p-6 items-center justify-center">
      <Image
        className="w-full h-64 -my-16"
        source={{
          uri: "http://chitra.vaib.live/XX~9gV-eqZ",
        }}
      />
      <View className="w-full gap-y-0">
        {step === 0 && (
          <TextInput
            keyboardType="number-pad"
            placeholder="Enter your number"
            className="w-full text-xl mb-4"
            mode="outlined"
            value={phone}
            onChangeText={(text) => setPhone(text)}
          />
        )}
        {step === 1 && (
          <TextInput
            keyboardType="number-pad"
            placeholder="Enter OTP"
            className="w-full text-xl mb-4"
            mode="outlined"
            value={otp}
            onChangeText={(text) => setOtp(text)}
          />
        )}
        {step === 0 && (
          <Button
            onPress={async () => {
              setLoading(true);
              const userId = await getOtp(phone);
              setUser(userId);
              setLoading(false);
              setStep(1);
            }}
            loading={loading}
            mode="contained"
            className="w-full rounded-full bg-red-500"
          >
            <Text className="font-semibold text-xl text-white">Get OTP</Text>
          </Button>
        )}
        {step === 1 && (
          <Button
            onPress={async () => {
              setLoading(true);
              const signIn = await verifyOtp(user, otp);
              setLoading(false);
              setIsSignedIn(signIn ? true : false);
              if (!signIn) {
                ToastAndroid.show("Invalid OTP", ToastAndroid.SHORT);
              } else {
                AsyncStorage.setItem("isSignedIn", user);
              }
            }}
            loading={loading}
            mode="contained"
            className="w-full rounded-full bg-red-500"
          >
            <Text className="font-semibold text-xl text-white">Verify OTP</Text>
          </Button>
        )}
        {step === 1 && (
          <View className="flex-row w-full justify-between">
            <Button
              onPress={() => {
                setStep(0);
              }}
            >
              Change Number
            </Button>
            <Button
              onPress={async () => {
                setLoading(true);
                const userId = await getOtp(phone);
                setUser(userId);
                setLoading(false);
              }}
            >
              Resend OTP
            </Button>
          </View>
        )}
      </View>
    </View>
  );
};

export default AuthScreen;
