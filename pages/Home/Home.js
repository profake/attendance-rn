import { View, Button, Text } from "react-native";

const Home = ({ navigation }) => {
  return (
    <View>
      <Button title="Courses" onPress={() => navigation.navigate('Courses')}></Button>
      <Button title="Batches" onPress={() => navigation.navigate('Batches')}></Button>
    </View>
  );
};

export default Home;
