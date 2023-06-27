import { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import { Modal } from "react-native";
import { addCourse, getAllCourses } from "../../model/course";

const Courses = ({ navigation }) => {
  const [courseData, setCourseData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [courseName, onChangeCourseName] = useState("");
  const [courseCode, onChangeCourseCode] = useState("");

  const handleAddEntry = async (courseCode, courseName) => {
    setCourseData(await addCourse(courseCode, courseName));
  };

  const handleCourseClick = (courseId, courseName) => {
    navigation.navigate("CourseInfo", { courseId, courseName });
  };
  
  const getData = async () => {
      console.log("Hello");
      const data = await getAllCourses();
      setCourseData(data);
  };

  useEffect(() => {
      getData();
  }, [courseData?.length]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.textHeader}>Add Course</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeCourseCode}
            value={courseCode}
            placeholder="Course Code"
          />
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeCourseName}
            value={courseName}
            placeholder="Course Name"
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button]}
              onPress={() => {
                setModalVisible(!modalVisible);
                handleAddEntry(courseCode, courseName);
              }}
            >
              <Text style={styles.textStyle}>Add Entry</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {courseData ? (
        <FlatList
          style={{ width: "100%", height: "80%" }}
          data={courseData}
          keyExtractor={(course) => course.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.courseContainer}
              onPress={() => {
                handleCourseClick(item.id, item.courseCode);
              }}
            >
              <Text style={styles.courseTextStyle}>{item.courseCode}</Text>
              <Text style={[styles.courseTextStyle, styles.smallText]}>
                {item.courseName} {/* This is actually the id */}
              </Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      ) : (
        <Text style={styles.text}>No courses found.</Text>
      )}
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Add Course</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
    paddingTop: 20,
  },
  courseContainer: {
    flexDirection: "column",
    backgroundColor: "#333333",
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginTop: 8,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  smallText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#b9b9b9",
  },
  textHeader: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 10,
  },
  button: {
    width: "50%",
    margin: 8,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  buttonClose: {
    backgroundColor: "#161f26",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  courseTextStyle: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
});

export default Courses;
