import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TouchableOpacity,
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { useFonts, Jost_400Regular } from "@expo-google-fonts/jost";
import { useState, useEffect } from "react";
import { getAllCourses } from "./../../model/course";
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
};

const Home = ({ navigation }) => {
  const [courseData, setCourseData] = useState(null);
  useFonts({ Jost_400Regular });

  useEffect(() => {
    const getCourses = async () => {
      const data = await getAllCourses();
      setCourseData(data);
    };
    getCourses();
  }, []);

  const handleCourseClick = (course) => {
    console.log(course);
    const courseId = course.id;
    const courseName = course.courseCode;
    navigation.navigate("CourseInfo", { courseId, courseName });
  };

  return (
    <View style={styles.bigContainer}>
      <View style={styles.container}>
        <Text style={styles.dateText}>February 24</Text>
        <Text style={styles.timeText}>9:18 PM</Text>
      </View>
      <View style={styles.courseHeader}>
        <Text style={styles.basicText}>Your Courses</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Courses")}>
          <Text style={styles.basicText}>Show All</Text>
        </TouchableOpacity>
      </View>
      {courseData ? (
        <FlatList
          horizontal={true}
          style={{ width: "100%", height: "20%" }}
          data={courseData}
          keyExtractor={(course) => course.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.courseContainer}
              onPress={() => {
                handleCourseClick(item);
              }}
            >
              <Text style={styles.courseTextStyle}>{item.courseId}</Text>
              <Text style={[styles.courseSubTextStyle]}>{item.courseCode}</Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      ) : (
        <Text style={styles.text}>No courses found.</Text>
      )}
      {/* <Button
        title="Batches"
        onPress={() => navigation.navigate("Batches")}
      ></Button> */}
      {/* <Button
        title="Attendance"
        onPress={() => navigation.navigate("Attendance")}
      ></Button> */}
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Export")}
      >
        <Text>Export Attendance</Text>
      </Pressable>
      {/* <Button title="CLEAR ALL" onPress={() => clearAll()}></Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 8,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  courseHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingEnd: 20,
  },
  basicText: {
    padding: 16,
    fontFamily: "Jost_400Regular",
    fontsize: 18,
  },
  bigContainer: {
    display: "flex",
    backgroundColor: "#f7f7f7",
    height: "100%",
  },
  container: {
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 4,
  },
  dateText: {
    fontFamily: "Jost_400Regular",
    fontSize: 30,
  },
  timeText: {
    fontFamily: "Jost_400Regular",
    fontSize: 16,
  },
  courseContainer: {
    height: 120,
    width: 300,
    backgroundColor: "#ffffff",
    padding: 16,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    marginTop: 8,
  },
  courseTextStyle: {
    fontSize: 18,
    fontFamily: "Jost_400Regular",
    color: "black",
    fontWeight: "bold",
  },
  courseSubTextStyle: {
    fontSize: 16,
    fontFamily: "Jost_400Regular",
    color: "black",
  },
});

export default Home;
