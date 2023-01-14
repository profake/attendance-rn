import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from "react-native";
import { React, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CourseInfo = ({ route, navigation }) => {
  const [batchesTakingCourse, setBatchesTakingCourse] = useState([]);
  const { courseId, courseName } = route.params;

  const handleBatchPress = (batchId, batchName) => {
    console.log(batchId);
    navigation.navigate("BatchInfo", {batchId, batchName});
  };

  const handleAddBatchesToCourse = async () => {
    navigation.navigate("Batches");
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("Courses");
      if (value !== null) {
        let courseInfo = JSON.parse(value);
        courseInfo = courseInfo.filter((item) => item.id === courseId);
        setBatchesTakingCourse(courseInfo[0].batches);
      } else {
        console.log("Error: No batches found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
  }, [batchesTakingCourse?.length]);

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>{courseName}</Text>
      {batchesTakingCourse && batchesTakingCourse?.length !== 0 ? (
        <FlatList
          style={{ width: "100%", height: "80%" }}
          data={batchesTakingCourse}
          keyExtractor={(batch) => batch.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleBatchPress(item.id, item.batchName)} style={styles.courseContainer}>
              <Text style={styles.courseTextStyle}>{item.batchName}</Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      ) : (
        <Text style={styles.text}>No batches found under this course.</Text>
      )}
      <Pressable style={styles.button} onPress={() => handleAddBatchesToCourse()}>
        <Text style={styles.textStyle}>{batchesTakingCourse.length !== 0 ? "Update Batches" : "Add Batches"}</Text>
      </Pressable>
    </View>
  );
};

export default CourseInfo;

const styles = StyleSheet.create({
  selected: {
    backgroundColor: "green",
  },
  batchesList: {
    width: "70%",
    height: "90%",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  courseContainer: {
    flex: 1,
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
    height: "95%",
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
    padding: 10,
  },
  button: {
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
