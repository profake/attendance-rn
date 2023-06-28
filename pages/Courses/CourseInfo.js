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
import { addBatchesToCourse, addSelectedBatchesToCourse, getDetailedCourseData } from "../../model/course";

const CourseInfo = ({ route, navigation }) => {
  const [batchesTakingCourse, setBatchesTakingCourse] = useState([]);
  const { courseId, courseName } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [allBatches, setAllBatches] = useState();
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [doneSelecting, setDoneSelecting] = useState(true);

  const handleBatchPress = (batchId, batchName) => {
    console.log(courseName);
    navigation.navigate("BatchInfo", { courseId, courseName, batchId, batchName });
  };

  const handleAddSelectedBatchesToCourse = async (batchIds) => {
    addSelectedBatchesToCourse(courseId, batchIds);
    setDoneSelecting(true);
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
    const data = await addBatchesToCourse();
    setAllBatches(data);
    setModalVisible(true);
  };

  const handleAddBatchesButton = () => {
    navigation.navigate("Batches");
  };

  const getData = async () => {
    const data = await getDetailedCourseData(courseId);
    setBatchesTakingCourse(data.batchesArray);
    setSelectedBatches(data.selectedBatchesArray);
    setDoneSelecting(false);
  };

  useEffect(() => {
    getData();
  }, [doneSelecting, batchesTakingCourse?.length]);

  return (
    <View style={styles.bigContainer}>
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
          <Text style={styles.textHeader}> 
            Select Batches Taking This Course
          </Text>
          <View style={styles.buttonContainer}>
            {!allBatches && <Text>No batches found. Please add a new batch with the button</Text>}
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
            <View style={styles.horizontalButtonContainer}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  setModalVisible(false);
                  handleAddBatchesButton();
                }}
              >
                <Text style={styles.textStyle}>Add New Batch</Text>
              </Pressable>
              <Pressable
                style={[styles.button]}
                onPress={() => {
                  setModalVisible(false);
                  handleAddSelectedBatchesToCourse(selectedBatches);
                }}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* <Text style={styles.textHeader}>{courseName}</Text> */}
      <View style={styles.studentInfoContainer}>
        <Text style={styles.dateText}>{courseName}</Text>
        <Text style={styles.timeText}>{batchesTakingCourse?.length} Batches</Text>
      </View>
      {batchesTakingCourse && batchesTakingCourse?.length !== 0 ? (        
        <View style={{ width: "100%", height: "65%" }}>
          <Text style={styles.courseSubTextStyle}>Batches taking this course</Text>
          <FlatList
          horizontal={true}
          style={{ width: "100%", height: "30%" }}
          data={batchesTakingCourse}
          keyExtractor={(item) => item[0]}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleBatchPress(item[0], item[1])}
              style={styles.courseContainer}
            >
              <Text style={styles.courseTextStyle}>{item[1]}</Text>
              {/* <Text style={styles.courseSubTextStyle}>21 students</Text> */}
            </TouchableOpacity>
          )}
        ></FlatList>
        </View>
      ) : (
        <Text style={styles.text}>No batches found under this course.</Text>
      )}
      <Pressable
        style={styles.button}
        onPress={() => handleAddBatchesToCourse()}
      >
        <Text style={styles.textStyle}>
          {batchesTakingCourse.length !== 0 ? "Update Batches" : "Add Batches"}
        </Text>
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
  bigContainer: {
    paddingTop: 20,
    justifyContent: "center",
    display: "flex",
    backgroundColor: "#f7f7f7",
    height: "100%",
  },
  container: {
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  courseContainer: {
    height: 120,
    width: 240,
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
    fontSize: 24,
    fontFamily: "Jost_400Regular",
    color: "black",
    fontWeight: "bold",
  },
  courseSubTextStyle: {
    fontSize: 16,
    fontFamily: "Jost_400Regular",
    color: "black",
    padding: 16,
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
  horizontalButtonContainer: {
    flexDirection: "row",
    padding: 10,
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
  studentInfoContainer: {
    width: "90%",
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 16,
    elevation: 4,
  },dateText: {
    fontFamily: "Jost_400Regular",
    fontSize: 30,
  },
  timeText: {
    fontFamily: "Jost_400Regular",
    fontSize: 16,
  },
});
