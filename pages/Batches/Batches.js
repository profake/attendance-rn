import { useState, useEffect } from "react";
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

const Batches = ({navigation}) => {
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
    try {
      let value = await AsyncStorage.getItem("Batches");
      value = JSON.parse(value);
      if (value) value.push(batch);
      else value = [batch];
      await AsyncStorage.setItem("Batches", JSON.stringify(value));
      setBatchData(value);
    } catch (e) {
      console.log(e.message);
    }
  };

  const showBatchInfo = (batchId, batchName) => {
    navigation.navigate("BatchInfo", {batchId, batchName})
  }

  useEffect(() => {
    getData();
  }, [batchData?.length]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("Batches");
      if (value !== null) {
        console.log("Set value: " + value);
        setBatchData(JSON.parse(value));
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
            <TouchableOpacity style={styles.courseContainer} onPress={() => showBatchInfo(item.id, item.batchName)}>
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
