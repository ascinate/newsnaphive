
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
import Home from "../screen/Home";
import FolderLayout from "../screen/FolderLayout";
import Notification from "../screen/Notification";
import InviteMember from "../screen/InviteMember";
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen name="FolderLayout" component={FolderLayout} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="InviteMember" component={InviteMember} />
    </Stack.Navigator>
  );
}
