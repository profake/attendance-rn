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

  const handleBatchPress = (batchId, batchName) => {
    // console.log(batchId);
    navigation.navigate("BatchInfo", { batchId, batchName });
  };

  const handleAddSelectedBatchesToCourse = async (batchIds) => {
    addSelectedBatchesToCourse(courseId, batchIds);
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

  const getData = async () => {
    const data = await getDetailedCourseData(courseId);
    setBatchesTakingCourse(data.batchesArray);
    setSelectedBatches(data.selectedBatchesArray);
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
          <Text style={styles.textHeader}>
            {batchesTakingCourse.length !== 0
              ? "Update Batches"
              : "Add Batches"}
          </Text>
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
            <TouchableOpacity
              onPress={() => handleBatchPress(item)}
              style={styles.courseContainer}
            >
              <Text style={styles.courseTextStyle}>{item}</Text>
            </TouchableOpacity>
          )}
        ></FlatList>
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
