import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function EntryDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Entry ID: {id}</Text>
    </View>
  );
}