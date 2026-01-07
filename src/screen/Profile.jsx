import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import {
  ChevronRight, Crown, Languages, LogOut, Share2,
  QrCode,
  MessageCircle,
  Heart,
  PencilLine,
} from "lucide-react-native";
import { Linking } from "react-native";
import { Share } from "react-native";
import { useLoader } from "../context/LoaderContext";
import { useTranslation } from 'react-i18next';
// Components
import ScreenLayout from "../components/ScreenLayout";
import CustomText from "../components/CustomText";
import PremiumModal from "../components/PremiumModal";
import Toast from 'react-native-toast-message';

// Images
const beforeImage = require("../../assets/selfie.jpg");
const afterImage = require("../../assets/dp3.jpg");
const createEvent = require("../../assets/background.png");
const profilePic = require("../../assets/profile.jpg");

const Profile = ({ navigation, }) => {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const { showLoader, hideLoader } = useLoader();
  const openStore = () => {
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.snaphive";
    const appStoreUrl = "https://apps.apple.com/app/id1234567890";

    const url = Platform.OS === "ios" ? appStoreUrl : playStoreUrl;

Linking.openURL(url).catch(() => {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: 'Unable to open the store',
  });
});
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("user");
      if (data) {
        setUser(JSON.parse(data));
      }
    })();
  }, []);

  const shareApp = async () => {
    try {
      const message =
        "Try the Airbum app! Download now:\n\n" +
        "Android: https://play.google.com/store/apps/details?id=com.snaphive\n" +
        "iOS: https://apps.apple.com/app/id1234567890";

      await Share.share({ message });
    } catch (error) {
      console.log("Share Error:", error);
    }
  };


const handleLogout = async () => {
  try {
    showLoader();

    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");

    Toast.show({
      type: 'success',
      text1: 'Logged Out',
      text2: 'See you again 👋',
    });

    setTimeout(() => {
      navigation.replace("Login");
    }, 500);

  } catch (err) {
    Toast.show({
      type: 'error',
      text1: 'Logout Failed',
      text2: 'Please try again',
    });
    console.error("Logout error:", err);
  } finally {
    hideLoader();
  }
};




  return (
    <ScreenLayout
      navigation={navigation}
      image={createEvent}
folderName={user?.name || t('userName')}
date={user?.email || t('noEmail')}
      RightIcon={
        <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
          <View style={{ padding: 10, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.3)", }}>
   <PencilLine width={16} height={16} />
          </View>
        </TouchableOpacity>
      }

      OverlayContent={
        <View style={styles.profileOverlay}>
          <Image
            source={
              user?.profileImage
                ? { uri: user.profileImage }
                : require("../../assets/profile.jpg")
            }
            style={styles.profileImage}
          />
          <View>
<CustomText weight="bold" style={styles.profileName}>
  {user?.name || t('userName')}
</CustomText>

<CustomText style={styles.profileNumber}>
  {user?.email || t('noEmail')}
</CustomText>
          </View>
        </View>
      }
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >

        <CustomText weight="medium" style={styles.category}>
    {t('account')}
        </CustomText>

        <TouchableOpacity
          style={styles.rowProfile}
          onPress={() => navigation.navigate('Language')}
        >
          <View style={styles.iconBox}>
            <Languages size={20} color="#F98935" />
          </View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>
      {t('language')}
            </CustomText>
            {/* <CustomText weight="medium" style={styles.subtitle}>
         {t('english')}
            </CustomText> */}
          </View>
          <ChevronRight color="#B0B0B0" size={18} />
        </TouchableOpacity>

        <CustomText weight="medium" style={styles.category}>
      {t('benefit')}
        </CustomText>

        <TouchableOpacity
          style={styles.rowProfile}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.iconBox}>
            <Crown size={20} color="#F98935" />
          </View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>
              {t('premium')}
            </CustomText>
            <CustomText weight="medium" style={styles.subtitle}>
            {t('unlockAllFeatures')}
            </CustomText>
          </View>
          <ChevronRight color="#B0B0B0" size={18} />
        </TouchableOpacity>


        <CustomText weight="medium" style={styles.category}>
  {t('other')}
        </CustomText>

        <TouchableOpacity
          style={styles.rowProfile}
          onPress={() => navigation.navigate('ContactUs')}
        >
          <View style={styles.iconBox}>
            <MessageCircle size={20} color="#F98935" />
          </View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>
          {t('contactUs')}
            </CustomText>
            <CustomText weight="medium" style={styles.subtitle}>
              {t('getSupportAnytime')}
            </CustomText>
          </View>
          <ChevronRight color="#B0B0B0" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rowProfile}
          onPress={openStore}
        >
          <View style={styles.iconBox}>
            <Heart size={20} color="#F98935" />
          </View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>
              {t('giveUsFeedback')}
            </CustomText>
            <CustomText weight="medium" style={styles.subtitle}>
        {t('loveTheApp')}
            </CustomText>
          </View>
          <ChevronRight color="#B0B0B0" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rowProfile}
          onPress={shareApp}
        >
          <View style={styles.iconBox}>
            <Share2 size={20} color="#F98935" />
          </View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>
            {t('shareTheApp')}
            </CustomText>
            <CustomText weight="medium" style={styles.subtitle}>
          {t('inviteFriends')}
            </CustomText>
          </View>
          <ChevronRight color="#B0B0B0" size={18} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.rowProfile, { borderBottomWidth: 0 }]}
          onPress={handleLogout}
        >
          <View style={[styles.iconBox, { backgroundColor: "#ffe2e2ff" }]}>
            <LogOut size={20} color="#ff1f1fff" />
          </View>
          <View style={styles.textBox}>
            <CustomText weight="bold" style={styles.title}>
           {t('logout')}
            </CustomText>
          </View>
        </TouchableOpacity>

        <PremiumModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          beforeImage={beforeImage}
          afterImage={afterImage}
        />
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  category: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    marginTop: 0,
    textTransform: "uppercase",
  },
  rowProfile: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1C",
  },
  profileOverlay: {
    alignItems: "center",
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
  },
  profileNumber: {
    color: "#f0f0f0",
    fontSize: 14,
  },

  category: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F98935',
    marginTop: 25,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  rowProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF3E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: '#111',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 40,
    marginBottom: 60,
    width: '60%',
    alignSelf: 'center',
  },
});

export default Profile;