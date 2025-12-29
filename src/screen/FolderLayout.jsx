import React, { useEffect, useState, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Plus,
  Users,
  SmilePlus,
  Images,
  Video,
  MessagesSquare,
  Share,
  EllipsisVertical,
  CameraIcon,
  ImagePlus,
  SendHorizonal,
  Send,
  ImagePlusIcon,
  PlusCircle,
} from "lucide-react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { useLoader } from "../context/LoaderContext";
import { useTranslation } from 'react-i18next';
import axios from "axios";

// SVGs
import QR from "../../assets/svg/qr.svg";

// Components
import ScreenLayout from "../components/ScreenLayout";
import CustomText from "../components/CustomText";
import SearchBar from "../components/SearchBar";
import MembersModal from "../components/MembersModal";
import { colors } from "../Theme/theme";
import { EventContext } from '../context/EventContext';

// Images
const createEvent = require("../../assets/background.png");
const profilePic = require("../../assets/picnic1.jpg");
const dp = require("../../assets/dp.jpg");
const dp2 = require("../../assets/dp2.webp");
const dp3 = require("../../assets/dp3.jpg");
const dp4 = require("../../assets/dp4.jpg");
const dp5 = require("../../assets/dp5.jpg");
const dp6 = require("../../assets/dp6.jpg");
const dp7 = require("../../assets/dp7.jpg");
const dp8 = require("../../assets/dp8.jpg");
const picnic1 = require("../../assets/picnic1.jpg");

const FolderLayout = ({ navigation, route }) => {

  const {
    image,
    folderName,
    date,
    hiveId,
    owner,
    photos = [],
    eventTitle,
    eventDescription,
    eventEndTime,
    eventExpiryDate,
    membersCount = 0,
  } = route.params || {};

  const [selectedTab, setSelectedTab] = useState("Gallery");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [showGalleryPicker, setShowGalleryPicker] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const { showLoader, hideLoader } = useLoader();
  const { t } = useTranslation();
  const { events, setEvents } = useContext(EventContext);

  console.log("hive id:" + hiveId);
  useEffect(() => {
    const fetchHive = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (!token || !storedUser) return;

        const loggedInUser = JSON.parse(storedUser);
        const loggedInUserId = loggedInUser._id;

        const res = await axios.get(
          `https://snaphive-node.vercel.app/api/hives/${hiveId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const hive = res.data.data;

        // PHOTOS
        setUploadedImages(hive.images || []);

        const combinedMembers = [
          {
            _id: hive.user._id,
            email: hive.user.email,
            name: hive.user.name,
            profileImage: hive.user.profileImage,
            role: "owner",
          },
          ...(hive.members || []).map(m => ({
            _id: m.memberId?._id,
            email: m.memberId?.email || m.email,
            name: m.memberId?.name,
            profileImage: m.memberId?.profileImage,
            role: "member",
            status: m.status,
          })),
        ];

        // 🔥 REMOVE LOGGED-IN USER ONLY
        const finalMembers = combinedMembers.filter(
          m => m._id?.toString() !== loggedInUserId
        );

        setMembersList(finalMembers);

      } catch (err) {
        console.error("Error fetching hive:", err);
      }
    };

    if (hiveId) fetchHive();
  }, [hiveId]);


  const formatDisplayDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date instanceof Date ? date : new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDisplayTime = (date) => {
    if (!date) return 'N/A';
    const dateObj = date instanceof Date ? date : new Date(date);
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
  };

  // useEffect(() => {
  //   loadSavedImages();
  // }, []);

  const loadSavedImages = async () => {
    try {
      // First, try to load from AsyncStorage
      const saved = await AsyncStorage.getItem(`folder_${folderName}`);

      if (saved) {
        const savedPhotos = JSON.parse(saved);
        setUploadedImages(savedPhotos);
        console.log('Loaded from storage:', savedPhotos.length);
      }
      // If no saved photos but we have photos from route params, use those
      else if (photos && photos.length > 0) {
        setUploadedImages(photos);
        // Save them to AsyncStorage for persistence
        await AsyncStorage.setItem(
          `folder_${folderName}`,
          JSON.stringify(photos)
        );
        console.log('Loaded from route params:', photos.length);
      }
    } catch (e) {
      console.log("Failed to load images", e);
      // Fallback to route params if storage fails
      if (photos && photos.length > 0) {
        setUploadedImages(photos);
      }
    }
  };
  const handleUpload = async () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
      quality: 0.5,
      selectionLimit: 0,
      maxWidth: 1920,
      maxHeight: 1920,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel || response.errorCode) return;
      if (!response.assets || response.assets.length === 0) return;

      showLoader(); //  Show loader before starting upload

      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          hideLoader();
          Alert.alert("Error", "Authentication token not found. Please login again.");
          return;
        }

        let formData = new FormData();

        response.assets.forEach((img, index) => {
          const file = {
            uri: img.uri,
            type: img.type || "image/jpeg",
            name: img.fileName || `image_${Date.now()}_${index}.jpg`,
          };
          formData.append("images", file);
        });

        const res = await axios.post(
          `https://snaphive-node.vercel.app/api/hives/${hiveId}/images`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            timeout: 60000,
          }
        );

        const updatedImages = res.data.images;
        setUploadedImages(updatedImages);

        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === hiveId ? { ...event, images: updatedImages } : event
          )
        );

        Alert.alert("Success", `${response.assets.length} image(s) uploaded successfully!`);
      } catch (error) {
        console.log("Upload Error:", error.response?.data || error.message);

        if (error.response) {
          if (error.response.status === 403) {
            Alert.alert("Upload Failed", "Permission denied.");
          } else if (error.response.status === 413) {
            Alert.alert("Upload Failed", "Images too large.");
          } else {
            Alert.alert("Upload Failed", error.response.data?.message || "Something went wrong.");
          }
        } else if (error.code === "ECONNABORTED") {
          Alert.alert("Upload Failed", "Upload timeout. Check your internet connection.");
        } else {
          Alert.alert("Upload Failed", "Network error.");
        }
      } finally {
        hideLoader(); //  Always hide loader at the end
      }
    });
  };


  const members = [
    { id: 1, name: "Demola Aoki", dp: dp },
    { id: 2, name: "Sofia Carrington", dp: dp3 },
  ];


  // AI MAGIC — PICK IMAGE & SHOW IN CHAT
  const handleAiImagePick = () => {
    launchImageLibrary({ mediaType: "photo", quality: 0.8 }, (response) => {
      if (response.didCancel || !response.assets) return;

      const imageUri = response.assets[0].uri;

      const userImg = {
        id: Date.now(),
        type: "image",
        uri: imageUri,
        time: "01:00 am",
        side: "user",
      };

      const aiImg = {
        id: Date.now() + 1,
        type: "image",
        uri: imageUri,
        time: "01:00 am",
        side: "ai",
      };

      setAiMessages((prev) => [...prev, userImg, aiImg]);
    });
  };


  // AI MAGIC — SEND TEXT MESSAGE
  const handleAiTextSend = () => {
    if (!textMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: "text",
      text: textMessage,
      time: "01:00 am",
      side: "user",
    };

    const aiReply = {
      id: Date.now() + 1,
      type: "text",
      text: textMessage, // AI echoes same message
      time: "01:00 am",
      side: "ai",
    };

    setAiMessages((prev) => [...prev, userMsg, aiReply]);
    setTextMessage("");
  };


  const handleGalleryImageSelect = (uri) => {
    setSelectedGalleryImage(uri);
    setShowGalleryPicker(false);

    // Add selected image to AI chat
    const userImg = {
      id: Date.now(),
      type: "image",
      uri: uri,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      side: "user",
    };

    const aiImg = {
      id: Date.now() + 1,
      type: "image",
      uri: uri,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      side: "ai",
    };

    setAiMessages((prev) => [...prev, userImg, aiImg]);
  };

  return (
    <ScreenLayout
      navigation={navigation}
      image={createEvent}
      folderName="Janifer Danis"
      date="+91 1841 510 1450"
      RightIcon={
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <EllipsisVertical height={width * 0.04} width={width * 0.04} />
        </TouchableOpacity>
      }
      OverlayContent={
        <View style={styles.profileOverlay}>
          <CustomText weight="bold" style={{ color: '#fff', fontSize: width * 0.075 }}>
            {eventTitle || folderName || '2025 Picnic'}
          </CustomText>
          <CustomText weight="medium" style={{ color: '#fff', fontSize: width * 0.035, marginBottom: height * 0.025 }}>
            {eventDescription || 'It is a long established fact that'}
          </CustomText>

          <View style={styles.rowBetween}>
            <TouchableOpacity
              style={styles.importBtnWhite}
              onPress={handleUpload}
            >
              <View>
                <Plus color="#DA3C84" size={width * 0.05} />
              </View>
              <CustomText weight="bold" style={{ color: '#DA3C84', fontSize: width * 0.035 }}>
                {t('myImages')}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.importBtnWhite, { backgroundColor: '#000000ff' }]}
              onPress={() => setModalVisible(true)}
            >
              <Users color="#ffffff" size={width * 0.05} />
              <CustomText weight="bold" style={{ color: '#ffffff', fontSize: width * 0.035 }}>
                {membersList.length} {t('members')}
              </CustomText>
            </TouchableOpacity>
          </View>

          {menuVisible && (
            <View
              style={{
                position: 'absolute',
                top: height * 0.03,
                right: -width * 0.01,
                backgroundColor: '#fff',
                paddingVertical: height * 0.012,
                borderRadius: width * 0.025,
                width: width * 0.45,
                elevation: 10,
                shadowColor: '#000',
                shadowOpacity: 0.2,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                zIndex: 999,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("ManagePermissions");
                }}
                style={{ paddingVertical: height * 0.015, paddingHorizontal: width * 0.04 }}
              >
                <CustomText weight="medium">{t('managePermissions')}</CustomText>
              </TouchableOpacity>

              <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("InviteMember", {
                    hiveId: hiveId,
                  })
                }
                style={{ paddingVertical: height * 0.015, paddingHorizontal: width * 0.04 }}
              >
                <CustomText weight="medium">{t('inviteMember')}</CustomText>
              </TouchableOpacity>


              {/* <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />

              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("PendingRequest");
                }}
                style={{ paddingVertical: height * 0.015, paddingHorizontal: width * 0.04 }}
              >
                <CustomText weight="medium">{t('pendingRequest')}</CustomText>
              </TouchableOpacity>

              <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />

              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("MemberStatus", { hiveId });
                }}
                style={{ paddingVertical: height * 0.015, paddingHorizontal: width * 0.04 }}
              >
                <CustomText weight="medium">{t('status')}</CustomText>
              </TouchableOpacity> */}
            </View>
          )}
        </View>
      }
      onPress={() => setMenuVisible(!menuVisible)} >

      <View style={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {[
              { key: "Gallery", label: t('gallery'), icon: <Images width={width * 0.04} height={width * 0.04} stroke={selectedTab === "Gallery" ? "#fff" : "#000"} /> },
              { key: "Chat", label: t('chat'), icon: <Video width={width * 0.04} height={width * 0.04} stroke={selectedTab === "Chat" ? "#fff" : "#000"} /> },
              { key: "AiMagic", label: t('aiMagic'), icon: <MessagesSquare width={width * 0.04} height={width * 0.04} stroke={selectedTab === "AiMagic" ? "#fff" : "#000"} /> },
            ].map((tab, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.tabButton, selectedTab === tab.key && styles.tabButtonActive]}
                onPress={() => setSelectedTab(tab.key)}
              >
                {tab.icon}
                <CustomText
                  weight="medium"
                  style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}
                >
                  {tab.label}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}>
            {selectedTab === "Gallery" && (
              <View style={styles.grid}>
                {uploadedImages.length === 0 ? (
                  <CustomText style={styles.infoText}>{t('noPhotos')}</CustomText>
                ) : (
                  <View style={styles.imageWrapperRow}>
                    {uploadedImages.map((uri, index) => {
                      let styleToApply = {};
                      const pos = index % 4;

                      if (pos === 0) styleToApply = styles.imageGridOne;
                      else if (pos === 1) styleToApply = styles.imageGridTwo;
                      else if (pos === 2) styleToApply = styles.imageGridThree;
                      else if (pos === 3) styleToApply = styles.imageGridFour;

                      return (
                        <View key={`uploaded-${index}`} style={styleToApply}>
                          <Image source={{ uri }} style={styles.photo} />
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            {selectedTab === "Chat" && (
              <>
                <SearchBar />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flexDirection: 'row',
                    gap: width * 0.025,
                    paddingHorizontal: width * 0.0375,
                    paddingVertical: height * 0.0125
                  }}
                >
                  {membersList.map((m, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => navigation.navigate("Chat", { user: m })}
                    >
                      <View style={styles.allMembarShadowWrapper}>
                        <Image
                          source={{ uri: m.profileImage }}
                          style={styles.allMembarDp}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>


                <View style={styles.chatList}>
                  {membersList.map((m, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => navigation.navigate("Chat", { user: m })}
                    >
                      <View style={styles.shadowWrapper}>
                        <View style={styles.chatListItem}>

                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: width * 0.0375 }}>
                            <Image source={{ uri: m.profileImage }} style={styles.dp} />

                            <View>
                              <CustomText weight="bold">{m.name}</CustomText>

                              <CustomText
                                weight="medium"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                  maxWidth: width * 0.4,
                                  fontSize: width * 0.03,
                                  color: '#888'
                                }}
                              >
                                Start chatting with {m.name}
                              </CustomText>
                            </View>
                          </View>

                          <View style={{ alignItems: 'flex-end', minWidth: width * 0.15 }}>
                            <CustomText weight="medium" style={{ fontSize: width * 0.03 }}>
                              Online
                            </CustomText>
                          </View>

                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

              </>
            )}
          </ScrollView>

          {selectedTab === "AiMagic" && (
            <View style={styles.aiMagicContainer}>
              <ScrollView
                style={styles.aiMagicScrollView}
                contentContainerStyle={styles.aiMagicContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.messagesContainer}>

                  {/* ----  STATIC USER MESSAGE ---- */}
                  <View style={styles.userTwoMessageBox}>
                    <View style={styles.messageText}>
                      <CustomText weight="medium" style={[styles.text, { color: '#3d3d3dff', fontSize: width * 0.03 }]}>
                        Hey! Turn this photo into a Pixar-style 3D character with a futuristic neon city!
                      </CustomText>
                    </View>
                    <CustomText weight="medium" style={{ fontSize: width * 0.025, color: '#888' }}>01:00 am</CustomText>
                  </View>

                  {/* ---- STATIC AI IMAGE ---- */}
                  <View style={styles.userOneMessageBox}>
                    <View style={styles.ImageTextLeft}>
                      <Image source={picnic1} style={styles.msgImage} />
                    </View>
                    <CustomText weight="medium" style={{ fontSize: width * 0.025, color: '#888' }}>
                      01:00 am
                    </CustomText>
                  </View>

                  {/* ---- STATIC AI TEXT ---- */}
                  <View style={styles.userOneMessageBox}>
                    <View style={styles.messageTextLeft}>
                      <CustomText weight="medium" style={[styles.textLeft, { color: '#ffffffff', fontSize: width * 0.03 }]}>
                        Sure! Upload your image — I can turn it into Pixar, Anime, Cyberpunk, Cartoon or Realistic styles!
                      </CustomText>
                    </View>
                    <CustomText weight="medium" style={{ fontSize: width * 0.025, color: '#888' }}>01:00 am</CustomText>
                  </View>

                  {/* ---- DYNAMIC AI MESSAGES ---- */}
                  {aiMessages.map((msg) => {
                    // USER MESSAGE (RIGHT SIDE)
                    if (msg.side === "user") {
                      return (
                        <View key={msg.id} style={styles.userTwoMessageBox}>
                          {/* IF USER IMAGE */}
                          {msg.type === "image" && (
                            <View style={styles.ImageTextRight}>
                              <Image source={{ uri: msg.uri }} style={styles.msgImage} />
                            </View>
                          )}

                          {/* IF USER TEXT */}
                          {msg.type === "text" && (
                            <View style={styles.messageText}>
                              <CustomText weight="medium" style={[styles.text, { color: '#3d3d3dff', fontSize: width * 0.03 }]}>
                                {msg.text}
                              </CustomText>
                            </View>
                          )}

                          <CustomText weight="medium" style={{ fontSize: width * 0.025, color: '#888' }}>
                            {msg.time}
                          </CustomText>
                        </View>
                      );
                    }

                    // AI MESSAGE (LEFT SIDE)
                    else {
                      return (
                        <View key={msg.id} style={styles.userOneMessageBox}>
                          {/* IF AI IMAGE */}
                          {msg.type === "image" && (
                            <View style={styles.ImageTextLeft}>
                              <Image source={{ uri: msg.uri }} style={styles.msgImage} />
                            </View>
                          )}

                          {/* IF AI TEXT */}
                          {msg.type === "text" && (
                            <View style={styles.messageTextLeft}>
                              <CustomText weight="medium" style={[styles.textLeft, { color: '#ffffffff', fontSize: width * 0.03 }]}>
                                {msg.text}
                              </CustomText>
                            </View>
                          )}

                          <CustomText weight="medium" style={{ fontSize: width * 0.025, color: '#888' }}>
                            {msg.time}
                          </CustomText>
                        </View>
                      );
                    }
                  })}

                </View>

              </ScrollView>

              {/* Input Box - Fixed at bottom */}
              <View style={styles.aiMagicInputContainer}>
                <View style={styles.aiMagicInputWrapper}>
                  <TouchableOpacity
                    style={{ marginRight: width * 0.025 }}
                    onPress={handleAiImagePick}
                  >
                    <ImagePlus size={width * 0.055} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginRight: width * 0.025 }}
                    onPress={() => setShowGalleryPicker(!showGalleryPicker)}>
                    <PlusCircle size={width * 0.055} color="#6B7280" />
                  </TouchableOpacity>

                  <TextInput
                    placeholder={t('askAnything')}
                    placeholderTextColor="#9CA3AF"
                    style={styles.aiMagicInput}
                    value={textMessage}
                    onChangeText={setTextMessage}
                  />

                  <TouchableOpacity
                    style={styles.aiMagicSendButton}
                    onPress={handleAiTextSend}
                  >
                    <SendHorizonal size={width * 0.05} color="#FFFFFF" />
                  </TouchableOpacity>



                </View>
              </View>
            </View>
          )}

          <MembersModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            members={membersList}
          />

          {showGalleryPicker && (
            <TouchableWithoutFeedback onPress={() => setShowGalleryPicker(false)}>
              <View style={styles.galleryPickerOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.galleryPickerModal}>
                    <View style={styles.galleryPickerHeader}>
                      <CustomText weight="bold" style={{ fontSize: width * 0.045 }}>
                        Select from Gallery
                      </CustomText>
                      <TouchableOpacity onPress={() => setShowGalleryPicker(false)}>
                        <CustomText weight="bold" style={{ fontSize: width * 0.04, color: '#DA3C84' }}>
                          Cancel
                        </CustomText>
                      </TouchableOpacity>
                    </View>

                    <ScrollView
                      style={styles.galleryPickerScroll}
                      showsVerticalScrollIndicator={false}>
                      {uploadedImages.length === 0 ? (
                        <Text style={styles.infoText}>No photos available</Text>
                      ) : (
                        <View style={styles.galleryPickerGrid}>
                          {uploadedImages.map((uri, index) => (
                            <TouchableOpacity
                              key={`gallery-select-${index}`}
                              style={styles.galleryPickerImageWrapper}
                              onPress={() => handleGalleryImageSelect(uri)}>
                              <Image source={{ uri }} style={styles.galleryPickerImage} />
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>

    </ScreenLayout>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.10,
    // backgroundColor: "#FAFAF9",
  },

  textBox: {
    flex: 1,
  },

  profileOverlay: {
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.05,
    justifyContent: "space-between",
  },

  bottomOverlay: {
    position: "absolute",
    bottom: height * 0.1125,
    left: width * 0.05,
    right: width * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: height * 0.025,
    borderRadius: width * 0.1,
    paddingVertical: height * 0.01,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: width * 0.015,
    paddingHorizontal: width * 0.053,
    paddingVertical: height * 0.0075,
    borderWidth: 1,
    borderColor: '#D0CACA',
    borderRadius: width * 0.01,
  },
  tabButtonActive: {
    backgroundColor: "#DA3C84",
    borderWidth: 1,
    borderColor: '#DA3C84',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  tabText: {
    color: "#888888",
    fontSize: width * 0.0375,
    fontWeight: "500",
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: "700",
  },
  iconInactive: {
    color: '#000'
  },
  iconActive: {
    color: '#fff'
  },

  grid: {
    width: '100%',
    marginTop: height * 0.0125,
    alignItems: 'center',

  },

  imageWrapperRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },

  imageGridOne: {
    width: '48%',
    height: height * 0.2,
    borderRadius: width * 0.025,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginBottom: height * 0.0187,
  },
  imageGridTwo: {
    width: '48%',
    height: height * 0.3,
    borderRadius: width * 0.025,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginBottom: height * 0.0187,
  },
  imageGridThree: {
    width: '48%',
    height: height * 0.3,
    borderRadius: width * 0.025,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginBottom: height * 0.0187,
    marginTop: height * -0.1,
  },
  imageGridFour: {
    width: '48%',
    height: height * 0.2,
    borderRadius: width * 0.025,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginBottom: height * 0.0187,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoText: {
    textAlign: "center",
    color: "#888888",
    marginTop: height * 0.025,
  },
  importBtnWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.02,
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.050,
    borderRadius: width * 0.035,
    marginVertical: height * 0.0125,
  },
  chatList: {
    marginTop: height * 0.025,
  },
  chatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: height * 0.025,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    paddingVertical: height * 0.0187,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#fff',
    borderRadius: width * 0.015,
    shadowColor: '#acacacff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 12,
  },

  dp: {
    width: width * 0.1275,
    height: width * 0.1275,
    borderRadius: width * 0.06375,
    resizeMode: "cover",
  },
  allMembarDp: {
    width: width * 0.1375,
    height: width * 0.1375,
    borderRadius: width * 0.06875,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  allMembarShadowWrapper: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7a7979ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 6,
  },

  aiMagicContainer: {
    height: height * 0.47
  },
  aiMagicContent: {
    paddingBottom: height * 0.10,
  },
  userOneMessageBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: width * 0.025,
    marginVertical: height * 0.015,
    maxWidth: '80%',
  },
  userTwoMessageBox: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: width * 0.025,
    marginVertical: height * 0.010,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  messageText: {
    borderRadius: width * 0.025,
    backgroundColor: '#fee8a3',
    paddingVertical: height * 0.0137,
    paddingHorizontal: width * 0.04,
    maxWidth: width * 0.6625,
    height: 'auto',
    shadowColor: '#acacacff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 12,
  },
  messageTextLeft: {
    borderRadius: width * 0.025,
    backgroundColor: '#cc4faa',
    paddingVertical: height * 0.0137,
    paddingHorizontal: width * 0.04,
    maxWidth: width * 0.6625,
    height: 'auto',
    shadowColor: '#acacacff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 12,
  },
  ImageTextLeft: {
    borderWidth: 5,
    borderColor: '#cc4faa',
    borderRadius: width * 0.025,
    overflow: 'hidden',
    width: width * 0.55,
    height: height * 0.2,
    shadowColor: '#acacacff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 12,
  },

  msgImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  text: {
    color: '#ffffff',
    fontWeight: '600',
  },
  textLeft: {
    color: '#636363',
    fontWeight: '600',
  },
  aiMagicInputContainer: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    paddingHorizontal: 0,
    paddingBottom: height * 0.015,
    paddingTop: height * 0.01,
    backgroundColor: 'transparent',
  },
  aiMagicInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.075,
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.035,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#888888ff',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  aiMagicInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#111827',
    paddingHorizontal: width * 0.015,
  },
  aiMagicSendButton: {
    backgroundColor: '#DA3C84',
    width: width * 0.105,
    height: width * 0.105,
    borderRadius: width * 0.0525,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: width * 0.02,
  },
  ImageTextRight: {
    borderWidth: 5,
    borderColor: '#fee8a3',
    borderRadius: width * 0.025,
    overflow: 'hidden',
    width: width * 0.55,
    height: height * 0.2,
    shadowColor: '#acacacff',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 12,
  },
  galleryPickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  galleryPickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
    maxHeight: height * 0.7,
    paddingBottom: height * 0.02,
  },
  galleryPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  galleryPickerScroll: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  galleryPickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: width * 0.025,
  },
  galleryPickerImageWrapper: {
    width: (width * 0.9 - width * 0.1 - width * 0.05) / 3,
    aspectRatio: 1,
    borderRadius: width * 0.02,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  galleryPickerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

});

export default FolderLayout;