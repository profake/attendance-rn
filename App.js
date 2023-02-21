import { View } from "react-native";
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

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
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
}
