import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";

// Screens
import HomeStack from "../navigation/HomeStack";
import MemberList from "../screen/MyHives";
import ClickPhoto from "../screen/ClickPhoto";
import Profile from "../screen/Profile";
import CreateHive from "../screen/CreateHive";

// Icons
import { Camera, CirclePlus, House, MessageCircle, UserRound, Image } from "lucide-react-native";
import CustomText from "./CustomText";



const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index].name;

  // Hide bottom tab bar on Camera screen
  if (currentRoute === "Camera" || currentRoute === "PhotoShare") {
    return null;
  }

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      {/* Bottom Navigation Bar */}
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let Icon;
          switch (route.name) {
            case "HomeScreen":
              Icon = (
                <View style={{ alignItems: 'center', gap: 2 }}>
                  {isFocused ? (
                    <LinearGradient
                      colors={[
                        '#DA3C84',
                        '#DA3C84',
                        '#FEE8A3'
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ padding: 10, borderRadius: 16 }}
                    >
                      <House width={25} height={25} color='#ffffff' />
                    </LinearGradient>
                  ) : (
                    <View style={{ padding: 10, borderRadius: 16 }}>
                      <House width={25} height={25} color='#6B7280' />
                    </View>
                  )}
                  <CustomText weight="mideum" style={{ color: '#6B7280' }}>Home</CustomText>
                </View>
              );
              break;

            case "Profile":
              Icon = (
                <View style={{ alignItems: 'center', gap: 2 }}>
                  {isFocused ? (
                    <LinearGradient
                       colors={[
                        '#DA3C84',
                        '#DA3C84',
                        '#FEE8A3'
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ padding: 10, borderRadius: 16 }}
                    >
                      <UserRound width={25} height={25} color='#ffffff' />
                    </LinearGradient>
                  ) : (
                    <View style={{ padding: 10, borderRadius: 16 }}>
                      <UserRound width={25} height={25} color='#6B7280' />
                    </View>
                  )}
                  <CustomText weight="mideum" style={{ color: '#6B7280' }}>Profile</CustomText>
                </View>
              );
              break;

            case "CreateHive":
              Icon = (
                <View style={{ alignItems: 'center', gap: 2 }}>
                  {isFocused ? (
                    <LinearGradient
                       colors={[
                        '#DA3C84',
                        '#DA3C84',
                        '#FEE8A3'
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ padding: 10, borderRadius: 16 }}
                    >
                      <CirclePlus width={25} height={25} color="#fff" />
                    </LinearGradient>
                  ) : (
                    <View style={{ padding: 10, borderRadius: 16 }}>
                      <CirclePlus width={25} height={25} color="#6B7280" />
                    </View>
                  )}
                  <CustomText weight="mideum" style={{ color: '#6B7280' }}>Create</CustomText>
                </View>
              );
              break;

            case "Messages":
              Icon = (
                <View style={{ alignItems: 'center', gap: 2 }}>
                  {isFocused ? (
                    <LinearGradient
                       colors={[
                        '#DA3C84',
                        '#DA3C84',
                        '#FEE8A3'
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ padding: 10, borderRadius: 16 }}
                    >
                      <Image width={25} height={25} color='#ffffff' />
                    </LinearGradient>
                  ) : (
                    <View style={{ padding: 10, borderRadius: 16 }}>
                      <Image width={25} height={25} color='#6B7280' />
                    </View>
                  )}
                  <CustomText weight="mideum" style={{ color: '#6B7280' }}>My Hives</CustomText>
                </View>
              );
              break;

            case "Camera":
              Icon = (
                <View style={{ alignItems: 'center', gap: 2 }}>
                  {isFocused ? (
                    <LinearGradient
                       colors={[
                        '#DA3C84',
                        '#DA3C84',
                        '#FEE8A3'
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ padding: 10, borderRadius: 16 }}
                    >
                      <Camera width={25} height={25} color='#ffffff' />
                    </LinearGradient>
                  ) : (
                    <View style={{ padding: 10, borderRadius: 16 }}>
                      <Camera width={25} height={25} color='#6B7280' />
                    </View>
                  )}
                  <CustomText weight="mideum" style={{ color: '#6B7280' }}>Camera</CustomText>
                </View>
              );
              break;

            default:
              Icon = <CustomText>{route.name}</CustomText>;
          }
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              {Icon}
              {isFocused && <View style={styles.underline} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="HomeScreen" component={HomeStack} />
      <Tab.Screen name="Messages" component={MemberList} />
      <Tab.Screen name="CreateHive" component={CreateHive} />
      <Tab.Screen name="Camera" component={ClickPhoto} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 90,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    width: "100%",
    paddingHorizontal: 30,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  // underline: {
  //   width: 30,
  //   height: 30,
  //   marginTop: 4,
  //   height: 3,
  //   width: 24,
  //   borderRadius: 2,
  //   backgroundColor: "red",
  // },



});