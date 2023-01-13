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
  const [modalVisible, setModalVisible] = useState(false);
  const [allBatches, setAllBatches] = useState();
  const [selectedBatches, setSelectedBatches] = useState([]);

  const handleBatchPress = (batchId) => {
    console.log(batchId);
    navigation.navigate("BatchInfo", {batchId});
  };

  const handleAddSelectedBatchesToCourse = async (courseIds) => {
    try {
      const value = await AsyncStorage.getItem("Courses");
      if (value !== null) {
        let parsedValues = JSON.parse(value);
        const index = parsedValues.findIndex((item) => item.id === courseId);
        parsedValues[index].batches = courseIds;
        await AsyncStorage.setItem("Courses", JSON.stringify(parsedValues));
        setBatchesTakingCourse(courseIds);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBatchSelection = (courseId) => {
    console.log(courseId);
    if (selectedBatches.includes(courseId)) {
      setSelectedBatches(selectedBatches.filter((batch) => batch !== courseId));
    } else {
      setSelectedBatches([...selectedBatches, courseId]);
    }
  };

  const handleAddBatchesToCourse = async () => {
    try {
      const value = await AsyncStorage.getItem("Batches");
      if (value !== null) {
        let parsedValues = JSON.parse(value);
        console.log(parsedValues);
        setAllBatches(parsedValues);
        setModalVisible(true);
        // await AsyncStorage.setItem("Batches", JSON.stringify(parsedValues));
      } else {
        console.log("Error: No batches found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("Courses");
      if (value !== null) {
        let courseInfo = JSON.parse(value);
        courseInfo = courseInfo.filter((item) => item.id === courseId);
        setBatchesTakingCourse(courseInfo[0].batches);
        setSelectedBatches(courseInfo[0].batches);
        console.log("Filtered courseinfo: " + courseInfo[0].batches);
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
          <Text style={styles.textHeader}>{batchesTakingCourse.length !== 0 ? "Update Batches" : "Add Batches"}</Text>
          <View style={styles.buttonContainer}>
            <FlatList
              numColumns={2}
              style={styles.batchesList}
              data={allBatches}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleBatchSelection(item.id)}
                  style={
                    selectedBatches.includes(item.id)
                      ? [styles.button, styles.buttonClose, styles.selected]
                      : [styles.button, styles.buttonClose]
                  }
                >
                  <Text style={styles.textStyle}>{item.batchName}</Text>
                </Pressable>
              )}
            ></FlatList>
            <Pressable
              style={[styles.button]}
              onPress={() => {
                setModalVisible(false);
                handleAddSelectedBatchesToCourse(selectedBatches);
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text style={styles.textHeader}>{courseName}</Text>
      {batchesTakingCourse && batchesTakingCourse?.length !== 0 ? (
        <FlatList
          style={{ width: "100%", height: "80%" }}
          data={batchesTakingCourse}
          keyExtractor={(batch) => batch}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleBatchPress(item)} style={styles.courseContainer}>
              <Text style={styles.courseTextStyle}>{item}</Text>
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
