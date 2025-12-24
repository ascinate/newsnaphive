import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { navigationRef } from "./src/navigation/RootNavigation";
import { NotificationProvider } from "./src/context/NotificationContext";
import { EventProvider } from "./src/context/EventContext";
import { LoaderProvider } from "./src/context/LoaderContext";
import i18n from "./src/i18n";
import { I18nextProvider } from "react-i18next";
import Toast from "react-native-toast-message";
import SnaphiveToast from "./src/components/SnaphiveToast";

// Screens
import Landing from "./src/screen/Landing";
import Signup from "./src/screen/Signup";
import Login from "./src/screen/Login";
import OTP from "./src/screen/OTP";
import MyTabs from "./src/components/MyTabs";
import PhotoFolder from "./src/screen/PhotoFolder";
import CreateAlbum from "./src/screen/CreateAlbum";
import CreateFolder from "./src/screen/CreateFolder";
import Folder from "./src/screen/Folder";
import AddExpenseBlock from "./src/screen/AddExpenseBlock";
import AddNote from "./src/screen/AddNote";
import NewPage from "./src/screen/ShareApps";
import Home from "./src/screen/Home";
import PhotoShare from "./src/screen/PhotoShare";
import AddMember from "./src/screen/AddMember";
import Notification from "./src/screen/Notification";
import Camera from "./src/screen/Camera";
import Subscribe from "./src/screen/Subscribe";
import CreateEvent from "./src/screen/CreateEvent";
import CreateEventTwo from "./src/screen/CreateEventTwo";
import CreateEventThree from "./src/screen/CreateEventThree";
import CreateEventFour from "./src/screen/CreateEventFour";
import CreateEventFive from "./src/screen/CreateEventFive";
import InviteMember from "./src/screen/InviteMember";
import ClickPhoto from "./src/screen/ClickPhoto";
import FolderTitle from "./src/screen/FolderTitle";
import QRcode from "./src/screen/QRcode";
import Locking from "./src/screen/Locking";
import MemberShare from "./src/screen/MemberShare";
import YourOpinion from "./src/screen/YourOpinion";
import ContactUs from "./src/screen/ContactUs";
import InviteHiveMember from "./src/screen/InviteHiveMember";
import ManagePermissions from "./src/screen/ManagePermissions";
import Language from "./src/screen/Language";
import MyFriend from "./src/screen/MyFriend";
import EditProfile from "./src/screen/EditProfile";
import Chat from "./src/screen/Chat";
import ForgotPassword from "./src/screen/ForgotPassword";
import NewPassword from "./src/screen/NewPassword";
import CreateHive from './src/screen/CreateHive'
import FolderLayout from './src/screen/FolderLayout'
import MyHives from './src/screen/MyHives'
import FolderStockPhotos from './src/screen/FolderStockPhotos'
import AutoCreateHive from './src/screen/AutoCreateHive'
import PendingRequest from './src/screen/PendingRequest'
import MemberStatus from './src/screen/MemberStatus'
// Demo camera UI
import ClickPhotoTwo from "./src/screen/ClickPhotoTwo";
import ClickPhotoThree from "./src/screen/ClickPhotoThree";

const Stack = createNativeStackNavigator();

const App = () => {



  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const onLanguageChange = (lng) => {
      setLanguage(lng);
    };

    i18n.on("languageChanged", onLanguageChange);

    return () => {
      i18n.off("languageChanged", onLanguageChange);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <LoaderProvider>
        <NotificationProvider>
          <EventProvider>
            <I18nextProvider i18n={i18n}>
              <NavigationContainer ref={navigationRef} key={language} >
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Landing" component={Landing} />
                  <Stack.Screen name="Signup" component={Signup} />
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="OTP" component={OTP} />
                  <Stack.Screen name="MyTabs" component={MyTabs} />
                  <Stack.Screen name="PhotoFolder" component={PhotoFolder} />
                  <Stack.Screen name="CreateAlbum" component={CreateAlbum} />
                  <Stack.Screen name="CreateFolder" component={CreateFolder} />
                  <Stack.Screen name="Folder" component={Folder} />
                  <Stack.Screen name="AddExpenseBlock" component={AddExpenseBlock} />
                  <Stack.Screen name="AddNote" component={AddNote} />
                  <Stack.Screen name="NewPage" component={NewPage} />
                  <Stack.Screen name="Home" component={MyTabs} />
                  <Stack.Screen name="CreateHive" component={CreateHive} />
                  <Stack.Screen name="PhotoShare" component={PhotoShare} />
                  <Stack.Screen name="AddMember" component={AddMember} />
                  <Stack.Screen name="Notification" component={Notification} />
                  <Stack.Screen name="Camera" component={Camera} />
                  <Stack.Screen name="Subscribe" component={Subscribe} />
                  <Stack.Screen name="CreateEvent" component={CreateEvent} />
                  <Stack.Screen name="CreateEventTwo" component={CreateEventTwo} />
                  <Stack.Screen name="CreateEventThree" component={CreateEventThree} />
                  <Stack.Screen name="CreateEventFour" component={CreateEventFour} />
                  <Stack.Screen name="CreateEventFive" component={CreateEventFive} />
                  <Stack.Screen name="InviteMember" component={InviteMember} />
                  <Stack.Screen name="ClickPhoto" component={ClickPhoto} />
                  <Stack.Screen name="FolderTitle" component={FolderTitle} />
                  <Stack.Screen name="QRcode" component={QRcode} />
                  <Stack.Screen name="Locking" component={Locking} />
                  <Stack.Screen name="MemberShare" component={MemberShare} />
                  <Stack.Screen name="YourOpinion" component={YourOpinion} />
                  <Stack.Screen name="ContactUs" component={ContactUs} />
                  <Stack.Screen name="InviteHiveMember" component={InviteHiveMember} />
                  <Stack.Screen name="ManagePermissions" component={ManagePermissions} />
                  <Stack.Screen name="Language" component={Language} />
                  <Stack.Screen name="MyFriend" component={MyFriend} />
                  <Stack.Screen name="EditProfile" component={EditProfile} />
                  <Stack.Screen name="Chat" component={Chat} />
                  <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                  <Stack.Screen name="NewPassword" component={NewPassword} />
                  <Stack.Screen name="ClickPhotoTwo" component={ClickPhotoTwo} />
                  <Stack.Screen name="ClickPhotoThree" component={ClickPhotoThree} />
                  <Stack.Screen name="FolderLayout" component={FolderLayout} />
                  <Stack.Screen name="MyHives" component={MyHives} />
                  <Stack.Screen name="FolderStockPhotos" component={FolderStockPhotos} />
                  <Stack.Screen name="AutoCreateHive" component={AutoCreateHive} />
                  <Stack.Screen name="PendingRequest" component={PendingRequest} />
                  <Stack.Screen name="MemberStatus" component={MemberStatus} />
                </Stack.Navigator>
              </NavigationContainer>
            </I18nextProvider>
          </EventProvider>
        </NotificationProvider>
      </LoaderProvider>
<Toast config={SnaphiveToast} />
    </SafeAreaProvider>

  );
};

export default App;
