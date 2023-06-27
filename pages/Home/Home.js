import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TouchableOpacity,
  Modal,
  Alert,
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
import moment from "moment";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    setCourseData(null);
  } catch (e) {
    // clear error
  }
};

const Home = ({ navigation }) => {
  const [date, setDate] = useState(moment(new Date()).format("MMMM D, YYYY"));
  const [time, setTime] = useState(moment(new Date()).format("hh:mm A"));
  const [courseData, setCourseData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const isFocused = useIsFocused();
  
  useFonts({ Jost_400Regular });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setModalVisible(true)}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </Pressable>
      ),
    });
  }, []);

  useEffect(() => {
    const getCourses = async () => {
      data = await getAllCourses();
      setCourseData(data);
    };
    getCourses();
  }, [isFocused, courseData]);

  const updateTime = () => setTime(moment(new Date()).format("hh:mm A"));

  useEffect(() => {
    updateTime();
  }, []);

  setInterval(updateTime, 60000);

  const handleCourseClick = (course) => {
    console.log(course);
    const courseId = course.id;
    const courseName = course.courseCode;
    navigation.navigate("CourseInfo", { courseId, courseName });
  };

  return (
    <View style={styles.bigContainer}>
      <View style={styles.container}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.courseHeader}>
        <Text style={styles.basicText}>Your Courses</Text>
        {/* <TouchableOpacity onPress={() => navigation.navigate("Courses")}>
          <Text style={styles.basicText}>Show All</Text>
        </TouchableOpacity> */}
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
              <Text style={styles.courseTextStyle}>{item.courseCode}</Text>
              <Text style={[styles.courseSubTextStyle]}>{item.courseName}</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.addCourseContainer}
              onPress={() => {
                navigation.navigate("Courses");
              }}
            >
              <Text style={[styles.courseTextStyle, { color: "white" }]}>
                Add Course
              </Text>
            </TouchableOpacity>
          }
        ></FlatList>
      ) : (
        <View style={{alignItems: "center", height:"70%"}}>
          <Text style={styles.text}>No courses found.</Text>
          <TouchableOpacity
            style={styles.addCourseContainer}
            onPress={() => {
              navigation.navigate("Courses");
            }}
          >
            <Text style={[styles.courseTextStyle, { color: "white" }]}>
              Add Course
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Export")}
      >
        <Text style={styles.textStyle}>Export Attendance</Text>
      </Pressable> */}
      {/* <Button title="CLEAR ALL" onPress={() => clearAll()}></Button> */}
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={[styles.textStyle, { color: "black", fontSize: 18 }]}>
              Settings
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setModalVisible(false);
                clearAll();
              }}
            >
              <Text style={styles.textStyle}>Delete All Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "grey" }]}
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
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
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
    fontSize: 15,
  },
  bigContainer: {
    paddingTop: 20,
    display: "flex",
    justifyContent: "center",
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
  addCourseContainer: {
    height: 80,
    width: 150,
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
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
  modalView: {
    width: "100%",
    height: "45%",
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Home;
