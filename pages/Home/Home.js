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
    <View flex backgroundColor="#ebebeb">
      <Card
        paddingH-25
        paddingT-65
        backgroundColor={"#89c4f5"}
        flex
        borderRadius={24}
        elevation={4}
      >
        <Card.Section
          content={[{ text: "Sunday", text30: true, white: true }]}
          contentStyle={{ alignItems: "center" }}
        />
        <Card.Section
          content={[{ text: "2 classes today", text80: true, grey70: true }]}
          contentStyle={{ alignItems: "center" }}
        />
      </Card>
      <Card
        paddingT-10
        marginT-20
        marginH-10
        paddingH-10
        backgroundColor={"#ffffff"}
        flex
        borderRadius={24}
        elevation={4}
      >
        <View flex row center>
          <Card
            containerStyle={{backgroundColor: "#e4e4e4", borderColor: "#d3d3d3", borderWidth: 2, alignItems: 'center',}}
            flex column
            paddingT-30
            marginH-5
            onPress={() => navigation.navigate("Attendance")}
          >
            <Icon resizeMode="contain" size={40} source={require("../../resources/icons/attendance_icon.png")} tintColor="black"/>
            <Card.Section
              content={[{ text: "Attendance", text70: true, grey10: true }]}
              contentStyle={{ alignItems: "center", margin: 10 }}
            />
          </Card>
          <Card
            containerStyle={{backgroundColor: "#e4e4e4", borderColor: "#d3d3d3", borderWidth: 2, alignItems: 'center',}}
            flex column
            paddingT-30
            marginH-5
            onPress={() => navigation.navigate("Batches")}
          >
            <Icon resizeMode="contain" size={40} source={require("../../resources/icons/batch_icon.png")} tintColor="black"/>
            <Card.Section
              content={[{ text: "Batches", text70: true, grey10: true }]}
              contentStyle={{ alignItems: "center", margin: 10 }}
            />
          </Card>
          <Card
            containerStyle={{backgroundColor: "#e4e4e4", borderColor: "#d3d3d3", borderWidth: 2, alignItems: 'center',}}
            flex column
            paddingT-30
            marginH-5
            onPress={() => navigation.navigate("Courses")}
          >
            <Icon resizeMode="contain" size={40} source={require("../../resources/icons/course_icon.png")} tintColor="black"/>
            <Card.Section
              content={[{ text: "Courses", text70: true, grey10: true }]}
              contentStyle={{ alignItems: "center", margin: 10 }}
            />
          </Card>
          </View>
      </Card>
      <View marginT-10></View>
      <Card flex row marginH-10 padding-25 containerStyle={{backgroundColor: "#ffffff",}}>  
        <Icon resizeMode="contain"
          source={require("../../resources/icons/history_icon.png")}
          size={24}
        />
        <Text marginH-8 text70 grey10>
          Attendance History
        </Text>
      </Card>

    </View>
  );
};

export default Home;
