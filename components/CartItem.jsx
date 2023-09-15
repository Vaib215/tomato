import React, { useState } from "react";
import { Text } from "react-native";
import { Card, IconButton, TextInput } from "react-native-paper";

const CartItem = ({ vegName, price, img }) => {
  const [quantity, setQuantity] = useState(1); 

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Card className="relative w-full h-24 my-2">
      <Card.Cover
        className="w-24 h-24 absolute left-0"
        source={{
          uri: img,
        }}
      />
      <Card.Content className="ml-24 my-4">
        <Text className="text-xl font-semibold">{vegName}</Text>
        <Text className="text-lg font-medium">₹ {price}<Text className="font-normal">/kg</Text> </Text>
      </Card.Content>
      <Card.Actions className="absolute right-0 bottom-0 top-0">
        <IconButton icon="minus" onPress={decreaseQuantity} />
        <TextInput
          className="w-10 h-10 text-center text-black"
          value={quantity.toString()} 
          disabled
          mode="outlined"
        />
        <IconButton icon="plus" onPress={increaseQuantity} />
      </Card.Actions>
    </Card>
  );
};

export default CartItem;
