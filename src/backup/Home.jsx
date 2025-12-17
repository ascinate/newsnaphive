import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { RefreshControl } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { EventContext } from '../context/EventContext';

// SVGs
import Brush from '../../assets/svg/brush.svg';
import Photo from '../../assets/svg/photo.svg';
import CameraIcon from '../../assets/svg/camera.svg';
import Import from '../../assets/svg/import.svg';
import Camera from '../../assets/svg/camera.svg';
import RightArrow from '../../assets/svg/rightArrow.svg';

// components
import TopNav from '../components/TopNavbar';
import ThemeButton from '../components/ThemeButton';
import CustomText from '../components/CustomText';

// assets
const hero = require('../../assets/hero.png');
const picnic1 = require('../../assets/picnic1.jpg');
const picnic2 = require('../../assets/picnic2.jpg');
const picnic3 = require('../../assets/picnic3.jpg');
const picnic4 = require('../../assets/picnic4.jpg');

const { width, height } = Dimensions.get('window');

const Home = ({ navigation, route }) => {


  const [refreshing, setRefreshing] = useState(false);
const { events } = useContext(EventContext);

  const createdEventsRef = React.useRef([]);
  useEffect(() => {
    if (route?.params?.newEvent) {
      const { name, photos } = route.params.newEvent;

      const newEventObj = {
        img: { uri: photos[0]?.uri },
        title: name,
        count: `${photos.length} Photos`,
        photos,
      };

      // Append the new event instead of replacing
      setEvents(prevEvents => [newEventObj, ...prevEvents]);

      // Clear the params after adding, so it doesn't re-add on re-render
      navigation.setParams({ newEvent: null });
    }
  }, [route?.params?.newEvent]);


  const fetchEvents = useCallback(async () => {
    // Example: load events from local storage or backend
    // const storedEvents = await AsyncStorage.getItem('events');
    // setEvents(JSON.parse(storedEvents) || []);

    // For now, simulate a reload:
    console.log("Refreshing events...");
    setEvents(prev => [...prev]);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setEvents(prev => [...prev]); // re-render the event list
      setRefreshing(false);
    }, 1000);
  }, []);





  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', }}>
        <TopNav />

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image source={hero} style={styles.heroImg} />
            <CustomText weight="bold" style={styles.HeroHeading}>Welcome to Snaphive</CustomText>
            <CustomText weight="medium" style={styles.HeroSubText}>
              Import your photos, enhance automatically, and organize by events.
            </CustomText>

            <TouchableOpacity
              style={styles.importBtn}
              onPress={() => navigation.navigate('PhotoShare')}>
              <Import width={width * 0.045} height={width * 0.045} />
              <CustomText weight="bold" style={styles.continueTxt}>Import photo</CustomText>
            </TouchableOpacity>
          </View>

          {/* Gradient Section */}
          <View style={{ marginTop: height * 0.025 }}>
            <LinearGradient
              colors={['#FDD32E', '#FFA500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ImportSection}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: width * 0.03,
                }}>
                <View style={styles.cameraIcon}>
                  <Camera width={width * 0.07} height={width * 0.07} />
                </View>
                <View style={{ flex: 1 }}>
                  <CustomText weight="bold" style={styles.importHeading}>
                    We found 10 new photos in your library.
                  </CustomText>
                  <CustomText weight="medium" style={styles.importSub}>Import into Birthday Party?</CustomText>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: width * 0.02,
                }}>
                <TouchableOpacity
                  style={[styles.importBtnWhite, { flex: 0.7 }]}
                  onPress={() => navigation.navigate('PhotoShare')}>
                  <Import width={width * 0.04} height={width * 0.04} />
                  <CustomText weight="bold" style={styles.continueTxt}>Import</CustomText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.laterBtn, { flex: 0.3 }]}
                  onPress={() => console.log('Later pressed')}>
                  <CustomText weight="bold" style={[styles.continueTxt, { color: '#fff' }]}>Later</CustomText>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Dashboard Cards */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              marginTop: height * 0.03,
            }}>
            <View style={styles.dashCard}>
              <View
                style={[styles.icon, { backgroundColor: '#D2F7FF', borderRadius: 50 }]}>
                <Photo width={width * 0.045} height={width * 0.045} />
              </View>
              <View>
                <CustomText weight="bold" style={styles.cardText}>89%</CustomText>
                <CustomText weight="medium">Enhanced</CustomText>
              </View>
            </View>

            <View style={styles.dashCard}>
              <View
                style={[styles.icon, { backgroundColor: '#DBFFD2', borderRadius: 50 }]}>
                <Brush width={width * 0.045} height={width * 0.045} />
              </View>
              <View>
                <CustomText weight="bold" style={styles.cardText}>257</CustomText>
                <CustomText weight="medium">Total Photos</CustomText>
              </View>
            </View>
          </View>

          {/* Events Section */}
          <View>
            <View style={styles.eventHeader}>
              <CustomText weight="medium" style={styles.eventSection}>Your Events</CustomText>
              <TouchableOpacity onPress={() => { navigation.navigate('CreateEvent') }}>
                <CustomText weight="bold" style={styles.newEvent}>+ New Event</CustomText>
              </TouchableOpacity>
            </View>

            {events.map((item, index) => (
              <View key={index} style={styles.eventRow}>
                {console.log('EVENT ITEM PHOTOS:', item.photos)}
                <Image source={item.img} style={styles.cardImg} />
                <TouchableOpacity
                  style={{ flex: 1, marginLeft: width * 0.03 }}
                  onPress={() => navigation.navigate('PhotoFolder', { eventPhotos: item.photos })}>
                  <CustomText weight="bold" style={styles.eventTitle}>{item.title}</CustomText>
                  <CustomText weight="medium" style={styles.mtop}>{item.count}</CustomText>
                  <View style={styles.profileIcon}>
                    <CustomText weight="medium" style={{ color: '#FFFFFF' }}>PG</CustomText>
                  </View>
                </TouchableOpacity>
                <RightArrow width={width * 0.035} height={width * 0.035} />
              </View>
            ))}
          </View>

          {/* Recent Activity */}
          <View style={{ paddingBottom: 150 }}>
            <View style={styles.eventHeader}>
              <CustomText weight="bold" style={styles.eventSection}>Recent Activity</CustomText>
            </View>

            {[picnic1].map((img, i) => (
              <View key={i} style={styles.eventRow}>
                <Image source={img} style={styles.cardImg} />
                <View style={{ flex: 1, marginLeft: width * 0.03 }}>
                  <CustomText weight="bold" style={styles.eventTitle}>Summer Vacation</CustomText>
                  <CustomText weight="medium" style={styles.mtop}>10 Photos</CustomText>
                  <View style={styles.profileIcon}>
                    <CustomText weight="medium" style={{ color: '#FFFFFF' }}>PG</CustomText>
                  </View>
                </View>
                <RightArrow width={width * 0.035} height={width * 0.035} />
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#fff',

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
    top: height * 0.16,
    backgroundColor: '#FDD32E',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.08,
    borderRadius: 6,
    marginTop: 21,
  },
  continueTxt: {
    fontSize: width * 0.04,
    color: '#000',
    fontWeight: '600',
  },
  ImportSection: {
    borderRadius: 12,
    padding: width * 0.05,
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
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
    lineHeight: 20,
  },
  importSub: {
    fontSize: width * 0.035,
    color: '#333',
  },
  importBtnWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.02,
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.015,
    borderRadius: 6,
    marginVertical: 10,
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
    justifyContent: 'space-between',
    width: '48%',
    padding: width * 0.045,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 2,
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
    fontSize: width * 0.03,
    fontWeight: '600',
    color: '#00146F',
  },
  eventSection: {
    fontSize: width * 0.045,
    fontWeight: '800',
    padddingBottom: 200,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.04,

  },
  eventTitle: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#000',
  },
  cardImg: {
    width: width * 0.25,
    height: width * 0.22,
    borderRadius: 8,
  },
  profileIcon: {
    marginTop: height * 0.01,
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: (width * 0.08) / 2,
    backgroundColor: '#ED3C50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
    padding: width * 0.03,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  mtop: {
    marginTop: height * 0.01,
  },
});

export default Home;