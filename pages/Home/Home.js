import { View, Button, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  }
  return (
    <View>
      <Button title="Courses" onPress={() => navigation.navigate('Courses')}></Button>
      <Button title="Batches" onPress={() => navigation.navigate('Batches')}></Button>
      <Button title="Attendance" onPress={() => navigation.navigate('Attendance')}></Button>
      <Button title="CLEAR ALL" onPress={() => clearAll()}></Button>
    </View>
  );
};

export default Home;
