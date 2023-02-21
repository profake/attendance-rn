import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Card,
  TextField,
  Text,
  Button,
  FloatingButton,
  Icon,
} from "react-native-ui-lib";

const Home = ({ navigation }) => {
  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }
  };
  return (
    // <View>
    //   <Button title="Courses" onPress={() => navigation.navigate('Courses')}></Button>
    //   <Button title="Batches" onPress={() => navigation.navigate('Batches')}></Button>
    //   <Button title="Attendance" onPress={() => navigation.navigate('Attendance')}></Button>
    //   <Button title="Export" onPress={() => navigation.navigate('Export')}></Button>
    //   {/* <Button title="CLEAR ALL" onPress={() => clearAll()}></Button> */}
    // </View>
    <View flex backgroundColor="#ffffff">
      <Card
        paddingH-25
        paddingT-65
        backgroundColor={"#993230"}
        flex
        borderRadius={24}
        elevation={4}
        onPress={() => console.log("pressed")}
      >
        <Card.Section
          content={[{ text: "Sunday", text30: true, white: true }]}
          contentStyle={{ alignItems: "center" }}
        />
        <Card.Section
          content={[{ text: "2 classes today", text80: true, grey80: true }]}
          contentStyle={{ alignItems: "center" }}
        />
        <View flex row center>
          <Card
            flex
            paddingT-85
            marginH-5
            onPress={() => navigation.navigate('Attendance')}
          >
            <Card.Section
              content={[{ text: "Attendance", text70: true, grey10: true }]}
              contentStyle={{ alignItems: "center", margin: 10 }}
            />
          </Card>
          <Card
            paddingT-85
            marginH-5
            flex
            center
            onPress={() => navigation.navigate('Batches')}
          >
            <Card.Section
              content={[{ text: "Batches", text70: true, grey10: true }]}
              contentStyle={{ alignItems: "center", margin: 10 }}
            />
          </Card>
          <Card
            paddingT-85
            marginH-5
            flex
            center
            onPress={() => navigation.navigate('Courses')}
          >
            <Card.Section
              content={[{ text: "Courses", text70: true, grey10: true }]}
              contentStyle={{ alignItems: "center", margin: 10 }}
            />
          </Card>
        </View>
      </Card>
      <View marginT-10></View>
      <View flex row padding-25 >
        <Icon source={require('../../resources/icons/history_icon.png')} size={24}/>
        <Text marginH-8 text70 grey10>Attendance History</Text>
      </View>
    </View>
  );
};

export default Home;
