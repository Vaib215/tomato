import React from "react";
import { Text } from "react-native";
import { Button, Card } from "react-native-paper";

const ItemCard = ({vegName,price,img}) => {
  return (
    <Card className="m-1 p-0.5 my-4 bg-white">
      <Card.Cover
        source={{
          uri: img,
        }}
      />
      <Card.Content>
        <Text className="capitalize text-xl font-semibold">{vegName}</Text>
        <Text className="text-lg font-medium">₹ {price}<Text className="font-normal">/kg</Text></Text>
      </Card.Content>
      <Card.Actions className="w-min">
        <Button compact>
          <Text className="text-lg font-medium">Add to Cart</Text>
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default ItemCard;
