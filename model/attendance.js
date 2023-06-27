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

export const getCourseName = async (courseId) => {
  try {
    const value = await AsyncStorage.getItem("Courses");
    if (value !== null) {
      let courseInfo = JSON.parse(value);
      const index = courseInfo.findIndex((item) => item.id === courseId);
      return courseInfo[index].courseCode;
    } else {
      console.log("Error: No batches found");
      return null;
    }
  } catch (e) {
    console.error(e);
  }
}

export const getBatchData = async(batchId) => {
    try {
      let value = await AsyncStorage.getItem("Batches");
      value = JSON.parse(value);
      const index = value.findIndex((item) => item.id === batchId);
      if (index !== -1) {
        return value[index];
      }
      else return null;
    } catch (e) {}
}
 
export const getAttendance = async (date, courseId, batchId) => {
    try {
      const value = await AsyncStorage.getItem("Attendance");
      if (value !== null) {
        let attendance = JSON.parse(value);
        const index = attendance.findIndex(
          (item) =>
            item.date === date &&
            item.courseId === courseId &&
            item.batchId === batchId
        );
        if (index !== -1) {
          console.log("Got attendance for date: " + attendance[index].date);
          return attendance[index].students;
        } else {
          console.log("No attendance for date: " + date);
          return [];
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

export const saveAttendance = async(attendance) => {
  console.log(attendance);
  let value = await AsyncStorage.getItem("Attendance");
    value = JSON.parse(value);
    if (value) {
      console.log(value);
      const index = value.findIndex((item) => item.date === attendance.date);
      if (index !== -1) {
        //console.log(item);
        value[index] = attendance;
      } else {
        value.push(attendance);
      }
    } else {
      value = [attendance];
    }
    await AsyncStorage.setItem("Attendance", JSON.stringify(value));
}

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