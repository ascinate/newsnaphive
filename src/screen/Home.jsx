import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, Animated, TextInput, TouchableWithoutFeedback, Text } from 'react-native';
import { RefreshControl } from 'react-native';
import { Sparkles, Users, FileImage, Clock5, ImagePlus, MoveRight, Plus, FolderOpen, CalendarDays, Search, EllipsisVertical, Share2, Lock } from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { EventContext } from '../context/EventContext';
import { colors } from '../Theme/theme';
// components
import TopNav from '../components/TopNavbar';
import CustomText from '../components/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import AutoSyncModal from '../components/AutoSyncModal';
import { checkForNewCameraPhotos } from '../utils/photoDetector';
import { ImageResizer } from "react-native-image-resizer";
// assets
const hero = require('../../assets/hero.png');
const profile = require('../../assets/profile.jpg');


const { width, height } = Dimensions.get('window');

const Home = ({ navigation, route }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Background transition animation
  const [refreshing, setRefreshing] = useState(false);
  const [showImportBanner, setShowImportBanner] = useState(true);
  const { events, setEvents } = useContext(EventContext);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const { hives, setHives } = useContext(EventContext);
  const { t, i18n } = useTranslation();
  const [showAutoSyncModal, setShowAutoSyncModal] = useState(false);




  const [newPhotosData, setNewPhotosData] = useState({
    count: 0,
    photos: [],
    previewImage: null,
  });

  // Start background transition animation
  useFocusEffect(
    useCallback(() => {
      // Reset animation to start
      fadeAnim.setValue(0);

      // Start the transition animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  // Format date → DD/MM/YYYY
  const formatDisplayDate = (date) => {
    if (!date) return 'N/A';
    const dateObj = date instanceof Date ? date : new Date(date);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = monthNames[dateObj.getMonth()];
    const year = String(dateObj.getFullYear()).slice(-2); // Get last 2 digits of year

    return `${month} ${day}`;
  };

  // Format time → HH:MM AM/PM
  const formatTimeRemaining = (endTime, expiryDate) => {
    if (!expiryDate) return 'N/A';

    try {
      const now = new Date();
      const expiryDateTime = new Date(expiryDate);

      // If endTime is provided, set the exact time
      if (endTime) {
        const timeStr = endTime.toLowerCase();
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);

        let hour24 = hours;
        if (period === 'pm' && hours !== 12) {
          hour24 = hours + 12;
        } else if (period === 'am' && hours === 12) {
          hour24 = 0;
        }

        expiryDateTime.setHours(hour24, minutes, 0, 0);
      } else {
        expiryDateTime.setHours(23, 59, 59, 999);
      }

      const timeDiff = expiryDateTime - now;

      // If expired
      if (timeDiff <= 0) {
        return 'Expired';
      }

      // Calculate time remaining
      const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
      const daysLeft = Math.floor(hoursLeft / 24);
      const remainingHours = hoursLeft % 24;
      const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      // Format output based on time remaining
      if (daysLeft > 0) {
        if (remainingHours > 0) {
          return `${daysLeft}d ${remainingHours}h `;
        }
        return `${daysLeft}d `;
      } else if (hoursLeft > 0) {
        if (minutesLeft > 0) {
          return `${hoursLeft}h ${minutesLeft}m `;
        }
        return `${hoursLeft}h `;
      } else {
        return `${minutesLeft}m `;
      }
    } catch (error) {
      return 'N/A';
    }
  };
  const removeExpiredEvents = useCallback(() => {
    const now = new Date();

    setHives(prevHives =>
      prevHives.filter(hive => {
        if (!hive.isTemporary) return true;
        if (!hive.expiryDate) return true;

        const expiryDate = new Date(hive.expiryDate);

        if (hive.endTime) {
          const timeStr = hive.endTime.toLowerCase();
          const [time, period] = timeStr.split(' ');
          const [hours, minutes] = time.split(':').map(Number);

          let hour24 = hours;
          if (period === 'pm' && hours !== 12) {
            hour24 = hours + 12;
          } else if (period === 'am' && hours === 12) {
            hour24 = 0;
          }

          expiryDate.setHours(hour24, minutes, 0, 0);
        } else {
          expiryDate.setHours(23, 59, 59, 999);
        }

        const hasExpired = expiryDate < now;

        if (hasExpired) {
          console.log(`Removing expired hive: ${hive.hiveName}, expired at: ${expiryDate.toISOString()}`);
        }

        return !hasExpired;
      })
    );

    setEvents(prevEvents =>
      prevEvents.filter(event => {
        if (!event.isTemporary) return true;
        if (!event.expiryDate) return true;

        const expiryDate = new Date(event.expiryDate);

        if (event.endTime) {
          const timeStr = event.endTime.toLowerCase();
          const [time, period] = timeStr.split(' ');
          const [hours, minutes] = time.split(':').map(Number);

          let hour24 = hours;
          if (period === 'pm' && hours !== 12) {
            hour24 = hours + 12;
          } else if (period === 'am' && hours === 12) {
            hour24 = 0;
          }

          expiryDate.setHours(hour24, minutes, 0, 0);
        } else {
          expiryDate.setHours(23, 59, 59, 999);
        }

        return expiryDate >= now;
      })
    );
  }, [setHives, setEvents]);


  // Check for new camera photos on mount and focus
  // Check for new camera photos on mount and focus
  useFocusEffect(
    useCallback(() => {
      const checkPhotos = async () => {
        try {
          console.log('🔍 Checking for new photos...');
          const result = await checkForNewCameraPhotos();

          console.log('📊 Result:', {
            hasNewPhotos: result.hasNewPhotos,
            count: result.photoCount,
            photosLength: result.photos.length
          });

          if (result.hasNewPhotos && result.photoCount > 0) {
            const previewUri = result.photos[0]?.uri;

            console.log('✅ Setting photo data, preview:', previewUri ? 'exists' : 'missing');

            setNewPhotosData({
              count: result.photoCount,
              photos: result.photos,
              previewImage: previewUri || null,
            });

            // Show modal after a short delay
            setTimeout(() => {
              console.log('📱 Showing AutoSync modal');
              setShowAutoSyncModal(true);
            }, 500);
          } else {
            console.log('ℹ️ No new photos found');
          }
        } catch (error) {
          console.error('❌ Error checking photos:', error);
        }
      };

      checkPhotos();
    }, [])
  );

  const compressPhoto = async (photo) => {
    try {
      const resized = await ImageResizer.createResizedImage(
        photo.uri,
        1600,     // max width
        1600,     // max height
        "JPEG",
        80        // quality (KEY)
      );

      return {
        ...photo,
        uri: resized.uri,
        type: "image/jpeg",
        fileName: photo.fileName || "auto_sync.jpg",
      };
    } catch (err) {
      console.log("❌ Compression failed, using original:", err);
      return photo; // fallback
    }
  };


  useEffect(() => {
    removeExpiredEvents();
    const interval = setInterval(removeExpiredEvents, 30 * 1000);
    return () => clearInterval(interval);
  }, [removeExpiredEvents]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log("Loaded user:", JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("Error loading user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (route?.params?.newEvent) {
      const { name, photos } = route.params.newEvent;

      const newEvent = {
        img: { uri: uploadedImage },
        title: hiveName,
        description: hiveDescription || 'No description',
        count: '0 Photos',
        photos: [],
        createdAt: new Date().toISOString(),
      };

      setEvents(prevEvents => [newEventObj, ...prevEvents]);
      navigation.setParams({ newEvent: null });
    }
  }, [route?.params?.newEvent]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      removeExpiredEvents();
      setRefreshing(false);
    }, 1000);
  }, [removeExpiredEvents]);

  const handleLater = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setShowImportBanner(false));
  };

  const filteredHives = hives
    ? hives.filter(hive =>
      hive.hiveName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hive.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  useEffect(() => {
    const fetchHives = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          console.log("No auth token found. Please login first.");
          return;
        }

        const res = await axios.get(
          "https://snaphive-node.vercel.app/api/hives",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHives(res.data.hives);
        setEvents(res.data.hives);

        console.log("User Hives:", res.data.hives);

      } catch (err) {
        console.error("Error loading hives:", err.response?.data || err);
      }
    };

    fetchHives();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAF9' }}>
        <TopNav />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={[styles.searchContainer, { marginHorizontal: width * 0.05 }]}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('search')}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Search color="#6B7280" size={20} style={styles.searchIcon} />
          </View>

          {/* Background Transition Section */}
          <View style={[styles.ImportSection, { overflow: 'hidden' }]}>
            {/* Background color layer - fades out */}
            <Animated.View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: '#db6abdff',
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              }}
            />

            {/* Background image layer - fades in */}
            <Animated.Image
              source={require("../../assets/background.png")}
              style={{
                ...StyleSheet.absoluteFillObject,
                opacity: fadeAnim,
              }}
              resizeMode="cover"
            />

            {/* Content layer */}
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: width * 0.03,
                }}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignContent: 'center',
                      alignSelf: 'center',
                      gap: 8,
                      backgroundColor: 'rgba(255, 219, 186, 0.5)',
                      borderRadius: 25,
                      paddingHorizontal: 16,
                      paddingVertical: 6,
                    }}
                  >
                    <Sparkles color="#ffffff" size={22} />
                    <CustomText weight="medium" style={styles.importHeading}>
                      {t('welcome')}
                    </CustomText>
                    <CustomText weight="bold" style={styles.importHeading}>
                      {user ? user.name : t('loading')}!
                    </CustomText>
                  </View>

                  <CustomText weight="bold" style={[styles.importSub, { textAlign: 'center' }]}>
                    {t('captureYourMoments')}
                  </CustomText>

                  <CustomText weight="medium" style={[styles.importSubLine, { textAlign: 'center' }]}>
                    {t('letMemoriesFlow')}
                  </CustomText>

                  <TouchableOpacity
                    style={styles.importBtnWhite}
                    onPress={() => navigation.navigate('CreateHive')}
                  >
                    <View>
                      <Plus color="#DA3C84" size={20} />
                    </View>
                    <CustomText weight="bold" style={{ color: '#DA3C84', fontSize: 14 }}>
                      {t('createNewHive')}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={{ paddingHorizontal: width * 0.05 }}>
            {/* Dashboard Cards */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginTop: height * 0.01,
              }}
            >
              <View style={styles.dashCard}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#F98935',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 6,
                    }}
                  >
                    <FolderOpen color="#ffffff" />
                  </View>

                  <CustomText
                    weight="bold"
                    style={[styles.cardText, { color: '#000000', textAlign: 'center' }]}
                  >
                    {events.length}
                  </CustomText>

                  <CustomText
                    weight="medium"
                    style={[styles.dashText, { textAlign: 'center' }]}
                  >
                    {t('totalHives')}
                  </CustomText>
                </View>
              </View>

              <View style={styles.dashCard}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#F4B11E',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 6,
                    }}
                  >
                    <FileImage color="#ffffff" />
                  </View>

                  <CustomText
                    weight="bold"
                    style={[styles.cardText, { color: '#000000', textAlign: 'center' }]}
                  >
                    {events.reduce((total, event) => {
                      const imageCount = event.images?.length || event.photos?.length || 0;
                      return total + imageCount;
                    }, 0)}
                  </CustomText>

                  <CustomText
                    weight="medium"
                    style={[styles.dashText, { textAlign: 'center' }]}
                  >
                    {t('photos')}
                  </CustomText>
                </View>
              </View>

              <View style={styles.dashCard}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <View
                    style={{
                      backgroundColor: '#B674F9',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 6,
                    }}
                  >
                    <Users color="#ffffff" />
                  </View>

                  <CustomText
                    weight="bold"
                    style={[styles.cardText, { color: '#000000', textAlign: 'center' }]}
                  >
                    {hives.reduce((total, hive) => total + (hive.members?.length || 0), 0)}
                  </CustomText>

                  <CustomText
                    weight="medium"
                    style={[styles.dashText, { textAlign: 'center' }]}
                  >
                    {t('members')}
                  </CustomText>
                </View>
              </View>
            </View>

            <View style={{ paddingBottom: 100 }}>
              <View style={styles.eventHeader}>
                <CustomText weight="medium" style={styles.eventSection}>
                  {t('yourHives')}
                </CustomText>
                <CustomText weight="medium" style={{ color: colors.textGray, marginTop: 4 }}>
                  {t('managePhotoCollections')}
                </CustomText>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  marginTop: 16,
                }}
              >
                {filteredHives.length > 0 ? (
                  filteredHives.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{ width: "48%" }}
                      onPress={() =>
                        navigation.navigate("FolderLayout", {
                          image: { uri: item.coverImage },
                          folderName: item.hiveName,
                          date: item.createdAt,
                          hiveId: item._id,
                          owner: item.user?.name,
                          photos: item.images || [],
                          eventTitle: item.hiveName,
                          eventDescription: item.description,
                          eventEndTime: item.endTime,
                          eventExpiryDate: item.expiryDate,
                          membersCount: item.members?.length || 0,
                        })
                      }
                    >
                      <View style={[styles.eventCard]}>
                        <Image
                          source={{ uri: item.coverImage }}
                          style={styles.eventImage}
                        />

                        <TouchableWithoutFeedback>
                          <View
                            style={{
                              position: "absolute",
                              right: 15,
                              top: 15,
                              padding: 8,
                              borderRadius: 50,
                              backgroundColor: "rgba(134, 134, 134, 0.7)",
                            }}
                          >
                            <Lock size={14} color="#f5f4f4ff" />
                          </View>
                        </TouchableWithoutFeedback>

                        <View style={styles.eventInfo}>

                          <CustomText weight="bold" style={styles.eventTitle}>
                            {item.hiveName.length > 12
                              ? item.hiveName.substring(0, 12) + '...'
                              : item.hiveName}
                          </CustomText>


                          <View style={styles.eventTimeRow}>
                            <CalendarDays width={16} height={16} color="#F98935" />
                            <CustomText weight="medium" style={styles.eventTimeText}>
                              {formatTimeRemaining(item.endTime, item.expiryDate)} • {formatDisplayDate(item.expiryDate)}
                            </CustomText>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 4,
                              marginBottom: 6,
                              justifyContent: 'flex-start',
                            }}
                          >
                            <Users width={16} height={16} color="#F98935" style={{ display: 'grid' }} />
                            {/* <CustomText weight="medium" style={styles.eventTimeText}>
                              Lock
                            </CustomText> */}
                            <CustomText weight="bold" style={styles.eventTimeText}>
                              {item.members.length} {t('members')}
                            </CustomText>
                          </View>

                          {/* <CustomText weight="medium" style={styles.eventDescription}>
                            {item.description
                              ? item.description.length > 15
                                ? item.description.substring(0, 15) + '...'
                                : item.description
                              : "No description"}
                          </CustomText> */}


                          {/* <View style={styles.memberRow}>
                            <View style={styles.memberAvatar}>
                              <Image source={profile} style={styles.memberDP} />
                            </View>

                            <View style={styles.memberBadge}>
                              <CustomText weight="bold" style={styles.memberCount}>
                                +
                              </CustomText>
                            </View>

                            <CustomText weight="bold" style={{ marginLeft: 20 }}>
                              {item.members.length} {t('members')}
                            </CustomText>
                          </View> */}
                          <TouchableOpacity style={{ width: '100%', margin: 'auto', marginTop: 10 }} onPress={() => { navigation.navigate('InviteMember') }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                backgroundColor: '#F3691E',
                                paddingVertical: 6,
                                paddingHorizontal: 12,
                                borderRadius: 6,
                              }}
                            >
                              <Share2 color="#ffffff" size={18} />
                              <CustomText weight="bold" style={{ color: '#fff' }}>
                                Share
                              </CustomText>
                            </View>
                          </TouchableOpacity>


                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      marginTop: 60,
                      marginBottom: 80,
                      width: '100%',
                    }}
                  >
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: '#f7a0c7ff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 50,
                      }}
                    >
                      <ImagePlus color="#ffffff" size={28} />
                    </View>

                    <CustomText weight="medium" style={{ color: '#6B7280' }}>
                      {searchQuery ? t('noHivesFound') : t('noHivesYet')}
                    </CustomText>

                    {!searchQuery && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <CustomText
                          weight="bold"
                          style={{ color: '#DA3C84' }}
                          onPress={() => navigation.navigate('CreateHive')}
                        >
                          {t('createYourFirstHive')}
                        </CustomText>
                        <MoveRight color="#DA3C84" />
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <AutoSyncModal
          visible={showAutoSyncModal}
          photoCount={newPhotosData.count}
          previewImage={newPhotosData.previewImage}
          onCreate={async () => {
            setShowAutoSyncModal(false);

            // 🔥 COMPRESS PHOTOS HERE (CRITICAL)
            const compressedPhotos = [];

            for (const photo of newPhotosData.photos) {
              const compressed = await compressPhoto(photo);
              compressedPhotos.push(compressed);
            }

            console.log(
              "📦 AutoSync photos compressed:",
              compressedPhotos.map(p => p.uri)
            );

            // ✅ STORE COMPRESSED PHOTOS ONLY
            await AsyncStorage.setItem(
              "AUTO_SYNC_PHOTOS",
              JSON.stringify(compressedPhotos)
            );

            navigation.navigate("CreateHive");
          }}

          onSkip={() => {
            console.log('⏭️ Skip clicked');
            setShowAutoSyncModal(false);
          }}
        />

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF9",
  },
  heroSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
    gap: height * 0.02,
  },
  heroImg: {
    width: width * 0.9,
    height: height * 0.28,
    resizeMode: 'contain',
  },
  HeroHeading: {
    fontSize: width * 0.06,
    fontWeight: '600',
    color: '#fff',
    position: 'absolute',
    top: height * 0.05,
  },
  HeroSubText: {
    fontSize: width * 0.035,
    fontWeight: '500',
    color: '#fff',
    position: 'absolute',
    top: height * 0.11,
    textAlign: 'center',
    paddingHorizontal: width * 0.15,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.025,
    position: 'absolute',
    top: height * 0.18,
    backgroundColor: '#FDD32E',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.08,
    borderRadius: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  continueTxt: {
    fontSize: width * 0.04,
    color: '#000',
    fontWeight: '600',
  },
  ImportSection: {
    backgroundColor: '#ec9e00ff',
    marginTop: height * 0.025,
    padding: width * 0.06,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 12,
      },
    }),
  },
  cameraIcon: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: (width * 0.13) / 2,
    backgroundColor: '#FFE891',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffffff',
    marginBottom: 4,
    lineHeight: 20,
  },
  importSub: {
    marginTop: 10,
    fontSize: 24,
    color: '#ffffffff',
  },
  importSubLine: {
    marginTop: 10,
    fontSize: 14,
    color: '#ffffffff',
  },
  importBtnWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.025,
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 14,
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  laterBtn: {
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: height * 0.015,
    borderRadius: 6,
    marginVertical: 10,
  },
  dashCard: {
    flexDirection: 'row',
    alignItem: 'center',
    justifyContent: 'center',
    width: "30%",
    padding: width * 0.045,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: height * 0.02,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dashText: {
    color: '#6B7280',
    fontSize: 13,
  },
  icon: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: width * 0.06,
    fontWeight: '600',
    color: '#000',
  },
  newEvent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#feaa00',
  },
  eventSection: {
    fontSize: 20,
    fontWeight: '800',
  },
  eventHeader: {
    marginTop: height * 0.03,
  },
  eventRow: {
    marginTop: 16,
    width: '100%',
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 1,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventRowInformation: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#ffffffff',
    width: '100%',
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    // padding: 12,
    marginBottom: 16,
    shadowColor: '#7a7979',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 6,
  },
  eventImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  eventInfo: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: '#fff',
  },
  eventTitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  eventTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  eventTimeText: {
    fontSize: 12,
    color: '#6B7280',
    paddingBottom: 0,
    marginBottom: 0,
  },
  eventDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 28,
  },
  memberAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    zIndex: 2,
  },
  memberDP: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  memberBadge: {
    position: 'absolute',
    left: 16,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F98935',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  memberCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
});

export default Home;