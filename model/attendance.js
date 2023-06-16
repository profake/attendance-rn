import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAttendanceData = async() => {
  let value = await AsyncStorage.getItem("Attendance");
  value = JSON.parse(value);
  return value;
}

export const getBatchesUnderCourse = async(courseId) => {
  try {
    const value = await AsyncStorage.getItem("Courses");
    if (value !== null) {
      const batchesArray = [];
      let parsedCourses = JSON.parse(value);
      const index = parsedCourses.findIndex((item) => item.id === courseId);
      let parsedBatches = await AsyncStorage.getItem("Batches");
      parsedBatches = JSON.parse(parsedBatches);
      parsedCourses[index]?.batches.forEach((item) => {
        console.log(item);
        try {
          const iindex = parsedBatches.findIndex((batch) => batch.id === item);
          if (iindex !== -1) {
            batchesArray.push({ label: parsedBatches[iindex].batchName, value: parsedBatches[iindex].id });
          }
          setBatchData(value);
        } catch (e) {}
      });

      return batchesArray;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAllCourses = async() => {
  try {
    const value = await AsyncStorage.getItem("Courses");
    const courseArray = [];
    if (value !== null) {
      const parsed = JSON.parse(value);
      parsed.forEach((item) => {
        courseArray.push({ label: item.courseCode, value: item.id });
      });
    return courseArray;
    } else {
      console.log("value not found");
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
}