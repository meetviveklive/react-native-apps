import React, { useState } from "react";
import { StyleSheet, Text, View, Button, FlatList, Image } from "react-native";

import TodoItem from "./components/TodoItem";
import TodoInput from "./components/TodoInput";
import DisplayImage from "./components/DisplayImage";
import Header from "./components/Header";

// import { StatusBar } from "expo-status-bar";
// import { Component } from "react";
// import { StyleSheet, Text, View } from "react-native";

import {
  ACPTarget,
  ACPTargetPrefetchObject,
  ACPTargetRequestObject,
  ACPTargetOrder,
  ACPTargetProduct,
  ACPTargetParameters,
} from "@adobe/react-native-acptarget";
import { ACPAnalytics } from "@adobe/react-native-acpanalytics";
import { ACPLifecycle } from "@adobe/react-native-acpcore";
import { ACPCore } from "@adobe/react-native-acpcore";

// Function Based Approach //

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!!!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// Using Class Based Approach//
// class PropExample extends Component {
//   render() {
//     return (
//       <View style={{ alignItems: "center" }}>
//         <Text>This is coming as Prop: {this.props.name}</Text>
//       </View>
//     );
//   }
// }

// export default class App extends Component {
//   state = {
//     myState: "This comes from State",
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         <Text> Hello World from Class Type Component</Text>
//         <Text> {this.state.myState} </Text>
//         <PropExample name="Test Prop 1"></PropExample>
//         <PropExample name="Test Prop 2"></PropExample>
//         <PropExample name="Test Prop 3"></PropExample>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

// To DO Item Using Function Approach
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [addTasks, setAddTasks] = useState(false);

  const addTaskHandler = (taskTitle) => {
    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Math.random().toString(), value: taskTitle },
    ]);
    setAddTasks(false);
  };

  const deleteTaskHandler = (taskId) => {
    setTasks((currentTasks) => {
      return currentTasks.filter((task) => task.id !== taskId);
    });
  };

  const canceltaskAdditionHandler = () => {
    setAddTasks(false);
  };

  console.log("Testing Console Message");
  ACPTarget.extensionVersion().then((version) =>
    console.log("AdobeExperienceSDK: ACPTarget version: " + version)
  );
  ACPTarget.getTntId().then((id) =>
    console.log("AdobeExperienceSDK: TNT ID " + id)
  );
  ACPAnalytics.extensionVersion().then((version) =>
    console.log("AdobeExperienceSDK: ACPAnalytics version: " + version)
  );
  ACPAnalytics.getTrackingIdentifier().then((aid) =>
    console.log("AdobeExperienceSDK: Tracking identifier: " + aid)
  );
  ACPAnalytics.getVisitorIdentifier().then((vid) =>
    console.log("AdobeExperienceSDK: Visitor identifier: " + vid)
  );
  ACPCore.extensionVersion().then((version) =>
    console.log("AdobeExperienceSDK: ACPCore version: " + version)
  );
  ACPAnalytics.sendQueuedHits();

  ACPCore.trackState("state", { mytest: "state" });
  // ACPTarget.registerExtension();

  console.log("After Registering Extension");

  var targetresponse = "default";

  var request1 = new ACPTargetRequestObject(
    "testapp-targeting1",
    null,
    "defaultContent1",
    (error, content) => {
      // targetresponse = content;
      if (error) {
        console.error(error);
      } else {
        console.log(
          "Adobe Target content:" +
            content +
            " Text Content: " +
            JSON.parse(content).text
        );
        targetresponse = JSON.parse(content).text;
        console.log(targetresponse);
      }
    }
  );

  var locationRequests = [request1];
  ACPTarget.retrieveLocationContent(locationRequests, null);

  function trackaction() {
    ACPCore.trackAction("action", { mytest: "action" });
    setResponse(targetresponse);
  }
  // ACPTarget.resetExperience();
  const [targetresponse1, setResponse] = useState(targetresponse);

  return (
    <View>
      <Header title="To-Do App"></Header>
      <View style={styles.screen}>
        <Text onPress={trackaction}>
          Test Target Content : {targetresponse1}
        </Text>
        <Button title="Add New task" onPress={() => setAddTasks(true)}></Button>
        <TodoInput
          visible={addTasks}
          onAddTask={addTaskHandler}
          onCancel={canceltaskAdditionHandler}
        />
      </View>
      <DisplayImage taskStatus={tasks} />

      <View style={styles.screenlist}>
        <FlatList
          keyExtractor={(item, index) => item.id}
          data={tasks}
          renderItem={(itemData) => (
            <TodoItem
              title={itemData.item.value}
              onDelete={deleteTaskHandler}
              id={itemData.item.id}
            />
          )}
        ></FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 70,
    paddingHorizontal: 70,
  },
  screenlist: {
    marginLeft: 20,
    marginRight: 20,
  },
});
