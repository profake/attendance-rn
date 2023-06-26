import { View, Text, Button, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./pages/Home/Home";
import Courses from "./pages/Courses/Courses";
import Batches from "./pages/Batches/Batches";
import BatchInfo from "./pages/Batches/BatchInfo";
import CourseInfo from "./pages/Courses/CourseInfo";
import Attendance from "./pages/Attendance/Attendance";
import AttendanceAdd from "./pages/Attendance/AttendanceAdd";
import Export from "./pages/Export/Export";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function App() {
  let [fontsLoaded] = useFonts({
    Jost_400Regular,
  });
  const Stack = createNativeStackNavigator();

  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontFamily: "Jost_400Regular",
            },
          }}
        >
          <Stack.Screen name="Home" component={Home} options={({ navigation }) => ({title: "Home",})} />
          <Stack.Screen name="Courses" component={Courses} />
          <Stack.Screen name="Batches" component={Batches} />
          <Stack.Screen name="BatchInfo" component={BatchInfo} />
          <Stack.Screen name="CourseInfo" component={CourseInfo} />
          <Stack.Screen name="Attendance" component={Attendance} />
          <Stack.Screen name="AttendanceAdd" component={AttendanceAdd} />
          <Stack.Screen name="Export" component={Export} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return <Text>Loading</Text>;
  }
}
