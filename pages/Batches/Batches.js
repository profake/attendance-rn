import { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v1 as uuidv1 } from "uuid";

const Batches = ({ navigation }) => {
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [selectedCourseId, setselectedCourseId] = useState(null);
  const [courses, setCourses] = useState([]);

  const [batchData, setBatchData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [batchName, onChangeBatchName] = useState("");

  const handleAddEntry = async (batchName) => {
    let id = uuidv1();
    let batch = {
      id,
      batchName,
      students: [],
    };
    // console.log("BatchName: " + batchName + " Course: " + selectedCourseId);
    try {
      const value = await AsyncStorage.getItem("Courses");
      if (value !== null) {
        const batchesArray = [];
        let parsedValues = JSON.parse(value);
        const index = parsedValues.findIndex(
          (item) => item.id === selectedCourseId
        ); // find course selected in dropdown
        console.log(parsedValues[index]);
        parsedValues[index].batches.push(batch);
        await AsyncStorage.setItem("Courses", JSON.stringify(parsedValues));
        getData(); // not good, must change. change batchData here preferably
      } else {
        console.log("Error: No batches found");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showBatchInfo = (batchId, batchName) => {
    navigation.navigate("BatchInfo", { batchId, batchName });
  };

  useEffect(() => {
    getData();
  }, [batchData?.length]);

  const getData = async () => {
    console.log('hell');
    try {
      const value = await AsyncStorage.getItem("Courses");
      if (value !== null) {
        //setCourses(JSON.parse(value));
        const courseArray = [];
        const batchesArray = [];
        const parsed = JSON.parse(value);
        parsed.forEach((item) => {
          courseArray.push({ label: item.courseName, value: item.id });
          item.batches.forEach((batch) =>  batchesArray.push(batch) );
        });
        setCourses(courseArray);
        setBatchData(batchesArray);
      } else {
        console.log("value not found");
      }
    } catch (e) {
      console.error(e);
    }
  };

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
          <Text style={styles.textHeader}>Add Batch</Text>
          <DropDownPicker
            style={styles.dropDown}
            placeholder="Select a Course"
            zIndex={3000}
            open={courseDropdownOpen}
            value={selectedCourseId}
            items={courses}
            setOpen={setCourseDropdownOpen}
            setValue={setselectedCourseId}
            setItems={setCourses}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeBatchName}
            value={batchName}
            placeholder="Batch Name"
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
                handleAddEntry(batchName);
              }}
            >
              <Text style={styles.textStyle}>Add Entry</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {batchData ? (
        <FlatList
          style={{ width: "100%", height: "80%" }}
          data={batchData}
          keyExtractor={(course) => course.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.courseContainer}
              onPress={() => showBatchInfo(item.id, item.batchName)}
            >
              <Text style={styles.courseTextStyle}>{item.batchName}</Text>
            </TouchableOpacity>
          )}
        ></FlatList>
      ) : (
        <Text style={styles.text}>No batches found.</Text>
      )}
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Add Batch</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  dropDown: {
    marginTop: 10,
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

export default Batches;
