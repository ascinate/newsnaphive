import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Platform, Animated, Text, TextInput, TouchableWithoutFeedback, Switch, Keyboard } from 'react-native';
import { navigate } from '../navigation/RootNavigation';
import { Sparkles, Users, FileImage, Clock5, RotateCwSquare, Image as LucidImage, LockOpen, Lock, Calendar, Timer, TimerOff, CalendarOff, Plus, Upload, CalendarDays, Shield, Info, Check, BadgeInfo } from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { EventContext } from '../context/EventContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLoader } from "../context/LoaderContext";
// components
import TopNav from '../components/TopNavbar';
import CustomText from '../components/CustomText';
import ThemeButton from '../components/ThemeButton';
import { colors } from '../Theme/theme';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';

import AsyncStorage from '@react-native-async-storage/async-storage';

// assets
const hero = require('../../assets/hero.png');
const picnic1 = require('../../assets/picnic1.jpg');
const picnic2 = require("../../assets/picnic2.jpg");
const picnic3 = require("../../assets/picnic3.jpg");
const picnic4 = require("../../assets/picnic4.jpg");
const { width, height } = Dimensions.get('window');

const CreateHive = ({ navigation, route }) => {
    const { showLoader, hideLoader } = useLoader();
    const [uploadedImage, setUploadedImage] = useState(null);
    const [hiveName, setHiveName] = useState("");
    const [selectedOption, setSelectedOption] = useState('enable')
    const [hiveDescription, setHiveDescription] = useState("");
    const { addEvent } = useContext(EventContext);
    const [isEnabled, setIsEnabled] = useState(false);
    const [selected, setSelected] = useState('automatic');
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [uploadType, setUploadType] = useState('');
    const [hiveType, setHiveType] = useState(null);
    const [checked, setChecked] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openStartTime, setOpenStartTime] = useState(false);
    const [openEndTime, setOpenEndTime] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    // Format date → DD/MM/YYYY
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Format time → HH:MM AM/PM
    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${ampm}`;
    };
    const data = [
        { label: 'Invite Only', value: '1' },
        { label: 'Public', value: '2' },
    ];



    // Convert JS Date → API format YYYY-MM-DD
    const formatAPIDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    // Convert JS Date → API format HH:mm AM/PM (12-hour format)
    const formatAPITime = (date) => {
        if (!date) return "";
        const d = new Date(date);
        let hours = d.getHours();
        let minutes = d.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${ampm}`;
    };


    useEffect(() => {
        if (route?.params?.cameraPhotos) {
            console.log('Received camera photos:', route.params.cameraPhotos.length);
        }
    }, [route?.params?.cameraPhotos]);
    const isCreateDisabled =
        !hiveName.trim() ||
        !uploadedImage ||
        !checked ||
        !uploadType ||
        !hiveType;   // 🔥 NEW VALIDATION


    const handleCreateHive = async () => {
        try {
            if (isCreateDisabled) {
                alert("Please complete all required fields (Hive name, cover image, privacy policy)");
                return;
            }



            showLoader();

            const payload = {
                hiveName,
                description: hiveDescription || "No description",
                privacyMode: uploadType,
                isTemporary: isEnabled,
                eventDate: isEnabled ? formatAPIDate(startDate) : "",
                startTime: isEnabled ? formatAPITime(startTime) : "",
                endTime: isEnabled ? formatAPITime(endTime) : "",
                expiryDate: isEnabled ? formatAPIDate(endDate) : "",
            };

            const formData = new FormData();
            Object.keys(payload).forEach(key => formData.append(key, payload[key]));

            console.log('payload:', payload);
            let imageUri = uploadedImage;
            if (typeof uploadedImage === 'number') {
                const resolved = Image.resolveAssetSource(uploadedImage);
                imageUri = resolved.uri;

                try {
                    if (typeof uploadedImage === 'number') {
                        const resolved = Image.resolveAssetSource(uploadedImage);
                        imageUri = resolved?.uri || uploadedImage;
                    }

                    // On Android bundled assets may not be accessible via the resolved uri.
                    // Try to copy the asset to a temp file using react-native-fs if available.
                    if (Platform.OS === 'android' && imageUri && !imageUri.startsWith('file://') && !imageUri.startsWith('http')) {
                        let RNFS = null;
                        try { RNFS = require('react-native-fs'); } catch (e) { RNFS = null; console.log('react-native-fs not installed'); }
                        if (RNFS && RNFS.copyFileAssets) {
                            try {
                                const assetPath = imageUri.replace(/^asset:\/\/+/, '');
                                const dest = `${RNFS.CachesDirectoryPath}/cover_${Date.now()}.jpg`;
                                await RNFS.copyFileAssets(assetPath, dest);
                                imageUri = `file://${dest}`;
                            } catch (e) {
                                console.log('Failed to copy asset to temp file:', e);
                            }
                        } else {
                            console.log('RNFS copy not available, imageUri:', imageUri);
                        }
                    }
                } catch (e) {
                    console.log('Error resolving image uri', e);
                }

                console.log('Final cover image uri:', imageUri);

            }
            formData.append("coverImage", {
                uri: imageUri,
                name: "cover.jpg",
                type: "image/jpeg",
            });

            const token = await AsyncStorage.getItem("token");

            const response = await fetch("https://snaphive-node.vercel.app/api/hives", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,

                },
                body: formData
            });

            const result = await response.json();
            console.log("Create Hive result:", result);

            if (!response.ok) {
                alert(result.message || "Error creating hive");
                return;
            }

            alert("Hive created successfully!");

            navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });

        } catch (error) {
            console.log("Create Hive Error:", error);
            alert("Something went wrong!");
        } finally {
            hideLoader();
        }
    };



    const handleChange = (text) => {
        let formatted = text.replace(/[^0-9]/g, '');
        if (formatted.length > 2 && formatted.length <= 4)
            formatted = `${formatted.slice(0, 2)}-${formatted.slice(2)}`;
        else if (formatted.length > 4)
            formatted = `${formatted.slice(0, 2)}-${formatted.slice(2, 4)}-${formatted.slice(4, 6)}`;
        setDate(formatted);
    }





    // ios date time picker

    const onStartDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setOpenStartDate(false);
        }
        if (event.type === 'set' && selectedDate) {
            setStartDate(selectedDate);
            if (Platform.OS === 'ios') {
                // Don't auto-close on iOS, let user press Done
            }
        } else if (event.type === 'dismissed') {
            setOpenStartDate(false);
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        if (Platform.OS === 'android') {
            setOpenEndDate(false);
        }
        if (event.type === 'set' && selectedDate) {
            setEndDate(selectedDate);
        } else if (event.type === 'dismissed') {
            setOpenEndDate(false);
        }
    };

    const onStartTimeChange = (event, selectedTime) => {
        if (Platform.OS === 'android') {
            setOpenStartTime(false);
        }
        if (event.type === 'set' && selectedTime) {
            setStartTime(selectedTime);
        } else if (event.type === 'dismissed') {
            setOpenStartTime(false);
        }
    };

    const onEndTimeChange = (event, selectedTime) => {
        if (Platform.OS === 'android') {
            setOpenEndTime(false);
        }
        if (event.type === 'set' && selectedTime) {
            setEndTime(selectedTime);
        } else if (event.type === 'dismissed') {
            setOpenEndTime(false);
        }
    };
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <TopNav />
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ alignItems: 'flex-start', marginTop: 12 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                alignSelf: 'flex-start',
                                gap: 8,
                                backgroundColor: 'rgba(255, 227, 186, 0.5)',
                                borderRadius: 25,
                                paddingHorizontal: 16,
                                paddingVertical: 6,
                            }}
                        >
                            <Sparkles color="#FFAD60" size={14} />
                            <CustomText weight="medium" style={styles.importHeading}>
                                Create a new
                            </CustomText>
                            <CustomText weight="bold" style={styles.importHeading}>
                                Hive
                            </CustomText>
                        </View>
                    </View>

                    <View>
                        <CustomText weight="bold" style={styles.snapText}>
                            Start Sharing Memories
                        </CustomText>
                    </View>
                    <CustomText weight='regular' style={{ color: '#374151' }}>Set up your photo collection in seconds</CustomText>

                    <View style={[styles.createHiveCard, { marginBottom: 120, }]}>
                        <LinearGradient
                            colors={['#DA3C84', '#FEE8A3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1.6, y: 0 }}
                            style={styles.continueBtn}
                        >
                            <View style={styles.touchable}>
                                <View style={styles.content}>

                                    <CustomText weight="Bold" style={styles.continueTxt}>
                                        Hive Details
                                    </CustomText>
                                </View>
                            </View>
                        </LinearGradient>

                        <View style={{ paddingHorizontal: 20, }}>
                            <View style={{ marginBottom: 16, marginTop: 16 }}>
                                <CustomText weight='bold' style={{ marginBottom: 4, color: '#374151' }}>Hive Name *</CustomText>
                                <TextInput
                                    placeholder='Summer Wedding, Family Vacation'
                                    style={styles.inputType}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={hiveName}
                                    onChangeText={setHiveName}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                />
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <CustomText weight="bold" style={{ marginBottom: 4, color: '#374151' }}>
                                    Description
                                </CustomText>
                                <TextInput
                                    placeholder="Share details about your hive..."
                                    style={[styles.inputType, { textAlignVertical: 'top', height: 100 }]}
                                    multiline={true}
                                    numberOfLines={4}
                                    value={hiveDescription}
                                    onChangeText={setHiveDescription}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                />
                            </View>

                            <CustomText weight='bold' style={{ marginBottom: 0, color: '#374151' }}>Cover Image</CustomText>


                            <CustomText weight='mediumItalic' style={{ marginBottom: 8, color: '#777777ff', fontSize: 12 }}>( Only images under 1MB are allowed. Larger files will be rejected. )</CustomText>
                            <TouchableWithoutFeedback onPress={() => {
                                const options = {
                                    mediaType: "photo",
                                    quality: 1,
                                    includeExtra: true,
                                };

                                launchImageLibrary(options, (response) => {
                                    if (response.didCancel) {
                                        console.log("User cancelled image picker");
                                        return;
                                    }

                                    if (response.errorCode) {
                                        console.log("ImagePicker Error: ", response.errorMessage);
                                        return;
                                    }

                                    if (response.assets && response.assets.length > 0) {
                                        const selectedImage = response.assets[0];

                                        console.log("PICKED FILE INFO:", selectedImage);

                                        if (selectedImage.fileSize && selectedImage.fileSize > 1 * 1024 * 1024) {
                                            alert("This image is larger than 1MB. Please choose a smaller file.");
                                            return;
                                        }

                                        setUploadedImage(selectedImage.uri);
                                    }
                                });

                            }}>
                                <View style={styles.uploadContainer}>
                                    {uploadedImage ? (
                                        <View style={{ width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden' }}>
                                            <Animated.Image
                                                source={typeof uploadedImage === 'string'
                                                    ? { uri: uploadedImage }
                                                    : uploadedImage}

                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    ) : (
                                        <>
                                            <Upload color='#9B9B9B' width={28} height={28} />

                                            <CustomText weight='medium' style={{ marginTop: 4, color: '#67696b' }}>Upload your own image</CustomText>
                                        </>
                                    )}
                                </View>
                            </TouchableWithoutFeedback>


                            <CustomText weight="medium" style={{ marginBottom: 15, color: colors.textGray, marginTop: 16, }}>
                                Or choose from stock options based on event type
                            </CustomText>
                            <View style={styles.imageGrid}>
                                <TouchableOpacity
                                    style={styles.imageContainer}
                                    onPress={() => setUploadedImage(picnic1)}
                                    activeOpacity={0.7}
                                >
                                    <Image source={picnic1} style={styles.image} />
                                    <View style={styles.overlay}>
                                        <Text style={styles.imageText}>Corporate</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.imageContainer} onPress={() => setUploadedImage(picnic2)}>

                                    <Image source={picnic2} style={styles.image} />
                                    <View style={styles.overlay}>
                                        <Text style={styles.imageText}>Birthday party</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.imageContainer} onPress={() => setUploadedImage(picnic3)}>

                                    <Image source={picnic3} style={styles.image} />
                                    <View style={styles.overlay}>
                                        <Text style={styles.imageText}>Wedding</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.imageContainer} onPress={() => setUploadedImage(picnic4)}>

                                    <Image source={picnic4} style={styles.image} />
                                    <View style={styles.overlay}>
                                        <Text style={styles.imageText}>Reunion</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.imageContainer} onPress={() => setUploadedImage(picnic1)}>

                                    <Image source={picnic1} style={styles.image} />
                                    <View style={styles.overlay}>
                                        <Text style={styles.imageText}>Others</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <CustomText weight="bold" style={{ marginBottom: 4, color: '#374151' }}>
                                    Privacy Mode
                                </CustomText>
                                <Dropdown
                                    style={[styles.inputType]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={data}
                                    search
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    searchPlaceholder="Search..."
                                    placeholder="Hive Type"
                                    value={hiveType}
                                    onChange={item => {
                                        setHiveType(item.value);
                                    }}
                                />
                            </View>

                            <View style={[styles.radiobuttonContainer, { borderColor: '#FFBCE1', backgroundColor: '#FDF2F8', marginTop: 20 }]}>

                                <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 12 }}>
                                    <Shield color='#5B0064' />
                                    <CustomText weight='bold' style={{ fontSize: 16, }}>Media Upload Settings</CustomText>
                                </View>
                                <TouchableOpacity
                                    style={styles.privacy}
                                    onPress={() => setUploadType('automatic')}
                                    activeOpacity={0.7}
                                >
                                    <View >
                                        <View style={{
                                            height: 20,
                                            width: 20,
                                            borderRadius: 10,
                                            borderWidth: 2,
                                            borderColor: uploadType === 'automatic' ? '#EC4899' : '#D1D5DB',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {uploadType === 'automatic' && (
                                                <View style={{
                                                    height: 10,
                                                    width: 10,
                                                    borderRadius: 5,
                                                    backgroundColor: '#EC4899',
                                                }} />
                                            )}
                                        </View>
                                    </View>

                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <CustomText weight='bold' style={{ fontSize: 16 }}>Automatic Upload</CustomText>
                                        <CustomText weight='medium' style={{ color: colors.textGray, fontSize: 12 }}>All media is uploaded instantly. Only select if you trust your group and the content they'll share</CustomText>
                                    </View>
                                </TouchableOpacity>

                                {uploadType === 'automatic' && (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            backgroundColor: '#FFF0CF',
                                            borderRadius: 12,
                                            padding: 16,
                                            marginTop: 8,
                                            marginBottom: 10,
                                        }}
                                    >
                                        <View>
                                            <BadgeInfo color="#a1a1a1ff" size={20} />
                                        </View>

                                        <View style={{ flex: 1, marginLeft: 8 }}>
                                            <CustomText
                                                weight='medium'
                                                style={{ color: colors.textGray, fontSize: 12 }}>
                                                I understand that I am responsible for all media automatically uploaded
                                                to this Hive. Members will be able to upload photos and videos without
                                                my approval.
                                            </CustomText>
                                        </View>
                                    </View>
                                )}



                                <TouchableOpacity
                                    style={styles.privacy}
                                    onPress={() => setUploadType('approval')}
                                    activeOpacity={0.7}
                                >
                                    <View >
                                        <View style={{
                                            height: 20,
                                            width: 20,
                                            borderRadius: 10,
                                            borderWidth: 2,
                                            borderColor: uploadType === 'approval' ? '#EC4899' : '#D1D5DB',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {uploadType === 'approval' && (
                                                <View style={{
                                                    height: 10,
                                                    width: 10,
                                                    borderRadius: 5,
                                                    backgroundColor: '#EC4899',
                                                }} />
                                            )}
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <CustomText weight='bold' style={{ fontSize: 16 }}>Approval Required</CustomText>
                                        <CustomText weight='medium' style={{ color: colors.textGray, fontSize: 12 }}>Uploaded media must be reviewed and approved by authorized members. Best for formal events.</CustomText>
                                    </View>
                                </TouchableOpacity>





                            </View>
                            <View style={{ marginBottom: 12, }}>
                                <View style={styles.privacyContainer}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                            <CalendarDays />
                                            <View style={{ marginLeft: 12 }}>
                                                <CustomText weight='bold' style={{ fontSize: 16 }}>Temporary Event Hive</CustomText>
                                                <CustomText weight='regular' style={{ color: '#374151', fontSize: 12 }}>Set dates for this event</CustomText>
                                            </View>
                                        </View>
                                        <Switch
                                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                                            thumbColor={isEnabled ? '#4b5cf5ff' : '#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleSwitch}
                                            value={isEnabled}
                                        />
                                    </View>
                                    {/* that time only show this View */}
                                    {isEnabled && (
                                        <View>
                                            {/* Divider */}
                                            <View style={{ marginTop: 15 }}>
                                                <View style={{ backgroundColor: "#ccc", height: 0.4, width: "100%" }} />

                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        marginBottom: 5,
                                                        marginTop: 15,
                                                    }}
                                                >
                                                    <Calendar width={16} />
                                                    <CustomText weight="semiBold" color="#374151">
                                                        Event Start Date
                                                    </CustomText>
                                                </View>

                                                <TouchableOpacity
                                                    onPress={() => setOpenStartDate(true)}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={styles.input} pointerEvents="none">
                                                        <TextInput
                                                            placeholder="Select Date"
                                                            value={formatDate(startDate)}
                                                            editable={false}
                                                            style={{ color: '#000' }}
                                                        />
                                                    </View>
                                                </TouchableOpacity>

                                                {openStartDate && (
                                                    <View>
                                                        <DateTimePicker
                                                            value={startDate}
                                                            mode="date"
                                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                            onChange={onStartDateChange}
                                                            minimumDate={new Date()}
                                                        />
                                                        {Platform.OS === 'ios' && (
                                                            <TouchableOpacity
                                                                onPress={() => setOpenStartDate(false)}
                                                                style={{
                                                                    padding: 12,
                                                                    backgroundColor: '#007AFF',
                                                                    borderRadius: 8,
                                                                    alignItems: 'center',
                                                                    marginTop: 8
                                                                }}
                                                            >
                                                                <CustomText weight="bold" style={{ color: '#fff' }}>Done</CustomText>
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                )}
                                            </View>
                                            {/* --------------------- EVENT END DATE ---------------------- */}
                                            <View style={{ marginTop: 20 }}>
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                                    <CalendarOff width={16} />
                                                    <CustomText weight="semiBold" color="#374151">
                                                        Event End Date
                                                    </CustomText>
                                                </View>

                                                <TouchableOpacity
                                                    onPress={() => setOpenEndDate(true)}
                                                    activeOpacity={0.7}
                                                >
                                                    <View style={styles.input} pointerEvents="none">
                                                        <TextInput
                                                            placeholder="Select Date"
                                                            value={formatDate(endDate)}
                                                            editable={false}
                                                            style={{ color: '#000' }}
                                                        />
                                                    </View>
                                                </TouchableOpacity>

                                                {openEndDate && (
                                                    <View>
                                                        <DateTimePicker
                                                            value={endDate}
                                                            mode="date"
                                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                            onChange={onEndDateChange}
                                                            minimumDate={startDate}
                                                        />
                                                        {Platform.OS === 'ios' && (
                                                            <TouchableOpacity
                                                                onPress={() => setOpenEndDate(false)}
                                                                style={{
                                                                    padding: 12,
                                                                    backgroundColor: '#007AFF',
                                                                    borderRadius: 8,
                                                                    alignItems: 'center',
                                                                    marginTop: 8
                                                                }}
                                                            >
                                                                <CustomText weight="bold" style={{ color: '#fff' }}>Done</CustomText>
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                )}
                                            </View>


                                            {/* --------------------- START TIME + END TIME ---------------------- */}
                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                                {/* START TIME */}
                                                <View style={{ marginTop: 20, width: "48%" }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                                        <Timer width={16} />
                                                        <CustomText weight="semiBold" color="#374151">
                                                            Start Time
                                                        </CustomText>
                                                    </View>

                                                    <TouchableOpacity
                                                        onPress={() => setOpenStartTime(true)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <View style={styles.input} pointerEvents="none">
                                                            <TextInput
                                                                placeholder="Select Time"
                                                                value={formatTime(startTime)}
                                                                editable={false}
                                                                style={{ color: '#000' }}
                                                            />
                                                        </View>
                                                    </TouchableOpacity>

                                                    {openStartTime && (
                                                        <View>
                                                            <DateTimePicker
                                                                value={startTime}
                                                                mode="time"
                                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                                onChange={onStartTimeChange}
                                                            />
                                                            {Platform.OS === 'ios' && (
                                                                <TouchableOpacity
                                                                    onPress={() => setOpenStartTime(false)}
                                                                    style={{
                                                                        padding: 12,
                                                                        backgroundColor: '#007AFF',
                                                                        borderRadius: 8,
                                                                        alignItems: 'center',
                                                                        marginTop: 8
                                                                    }}
                                                                >
                                                                    <CustomText weight="bold" style={{ color: '#fff' }}>Done</CustomText>
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                    )}
                                                </View>

                                                {/* END TIME */}
                                                <View style={{ marginTop: 20, width: "48%" }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                                        <TimerOff width={16} />
                                                        <CustomText weight="semiBold" color="#374151">
                                                            End Time
                                                        </CustomText>
                                                    </View>

                                                    <TouchableOpacity
                                                        onPress={() => setOpenEndTime(true)}
                                                        activeOpacity={0.7}
                                                    >
                                                        <View style={styles.input} pointerEvents="none">
                                                            <TextInput
                                                                placeholder="Select Time"
                                                                value={formatTime(endTime)}
                                                                editable={false}
                                                                style={{ color: '#000' }}
                                                            />
                                                        </View>
                                                    </TouchableOpacity>

                                                    {openEndTime && (
                                                        <View>
                                                            <DateTimePicker
                                                                value={endTime}
                                                                mode="time"
                                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                                onChange={onEndTimeChange}
                                                            />
                                                            {Platform.OS === 'ios' && (
                                                                <TouchableOpacity
                                                                    onPress={() => setOpenEndTime(false)}
                                                                    style={{
                                                                        padding: 12,
                                                                        backgroundColor: '#007AFF',
                                                                        borderRadius: 8,
                                                                        alignItems: 'center',
                                                                        marginTop: 8
                                                                    }}
                                                                >
                                                                    <CustomText weight="bold" style={{ color: '#fff' }}>Done</CustomText>
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                </View>




                                <View style={[styles.radiobuttonContainer, { borderColor: '#5AAF9A', backgroundColor: '#F0FCF9' }]}>

                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 12 }}>
                                        <Shield color='#5B0064' />
                                        <CustomText weight='bold' style={{ fontSize: 16 }}>Messaging & Comments</CustomText>
                                    </View>

                                    {/* Enable Messaging */}
                                    <TouchableOpacity style={styles.privacy} onPress={() => setSelectedOption('enable')}>
                                        {/* Radio Button */}
                                        <View style={{
                                            height: 18,
                                            width: 18,
                                            borderRadius: 10,
                                            borderWidth: 2,
                                            borderColor: selectedOption === 'enable' ? '#5AAF9A' : '#9CA3AF',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {selectedOption === 'enable' && (
                                                <View style={{
                                                    height: 10,
                                                    width: 10,
                                                    borderRadius: 6,
                                                    backgroundColor: '#5AAF9A'
                                                }} />
                                            )}
                                        </View>

                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <CustomText weight='bold' style={{ fontSize: 16 }}>Enable Messaging</CustomText>
                                            <CustomText weight='medium' style={{ color: '#374151' }}>
                                                Allow members to post messages and comment on photos
                                            </CustomText>
                                        </View>
                                    </TouchableOpacity>

                                    {/* Admin Message Control */}
                                    <TouchableOpacity style={styles.privacy} onPress={() => setSelectedOption('admin')}>
                                        {/* Radio Button */}
                                        <View style={{
                                            height: 18,
                                            width: 18,
                                            borderRadius: 10,
                                            borderWidth: 2,
                                            borderColor: selectedOption === 'admin' ? '#5AAF9A' : '#9CA3AF',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {selectedOption === 'admin' && (
                                                <View style={{
                                                    height: 10,
                                                    width: 10,
                                                    borderRadius: 6,
                                                    backgroundColor: '#5AAF9A'
                                                }} />
                                            )}
                                        </View>

                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <CustomText weight='bold' style={{ fontSize: 16 }}>Admin Message Control</CustomText>
                                            <CustomText weight='medium' style={{ color: '#374151' }}>
                                                Allow admin to remove member messages
                                            </CustomText>
                                        </View>
                                    </TouchableOpacity>

                                    <View style={[styles.privacy, { backgroundColor: 'transparent', borderColor: '#5AAF9A' }]}>
                                        <Info color='#5AAF9A' />
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <CustomText weight='medium' style={{ color: '#5AAF9A' }}>
                                                Members will be able to react with emojis and comments.
                                            </CustomText>
                                        </View>
                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => setChecked(!checked)}
                                        style={{
                                            height: 20,
                                            width: 20,
                                            borderRadius: 4,
                                            borderWidth: 2,
                                            borderColor: checked ? '#69ec48ff' : '#9CA3AF',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        {checked && (
                                            <View
                                                style={{
                                                    height: 12,
                                                    width: 12,
                                                    backgroundColor: '#5bec48ff',
                                                    borderRadius: 2,
                                                }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableWithoutFeedback onPress={() => setShowPrivacyModal(true)}>
                                        <View style={{ paddingHorizontal: 20 }}>
                                            <CustomText weight="medium" style={{ color: '#646464' }}>
                                                I have read the
                                                <CustomText weight="bold" style={{ textDecorationLine: 'underline' }}> Content Responsibility & Privacy Policy </CustomText>
                                                and agree that I am responsible for all content uploaded to my event hive.
                                            </CustomText>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>



                                <View style={{}}>
                                    <ThemeButton
                                        text="Create Hive"
                                        onPress={handleCreateHive}
                                        style={{
                                            width: "100%",
                                            opacity: isCreateDisabled ? 0.5 : 1,
                                        }}
                                        disabled={isCreateDisabled}


                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <PrivacyPolicyModal
                        visible={showPrivacyModal}
                        onClose={() => setShowPrivacyModal(false)}
                    />
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
    snapText: {
        fontSize: 30,
        marginTop: 10,
        color: '#000',
    },
    uploadContainer: {
        width: '100%',
        height: 200,
        borderWidth: 1.8,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    inputType: {
        borderWidth: 1,
        borderColor: '#F6F6F6',
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        paddingLeft: 18,
        paddingVertical: 16,
        fontSize: 16,
    },

    privacyContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginVertical: 30,
    },
    privacy: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        marginTop: 8,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        width: '100%'
    },

    importHeading: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E3761B',
        marginBottom: 4,
        lineHeight: 20,
    },
    continueBtn: {
        width: '100%',

        overflow: 'hidden',
    },
    touchable: {
        paddingVertical: 21,
        paddingHorizontal: 20,

    },
    content: {
        flexDirection: 'row',
        gap: 8,
    },
    continueTxt: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    createHiveCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 20,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#F6F6F6',
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        paddingHorizontal: 18,
        paddingVertical: 16,
        fontSize: 16,
        color: '#800b0b',
    },
    placeholderStyle: {
        color: '#999',
        fontSize: 16,
    },
    selectedTextStyle: {
        color: '#000',
        fontSize: 16,
    },
    radiobuttonContainer: {
        borderWidth: 1,

        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 16,
    },

    // Stock image
    imageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 20,
    },
    imageContainer: {
        position: "relative",
        width: width * 0.38,  // 42% of screen width
        height: height * 0.12, // 12% of screen height
        marginBottom: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    imageText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default CreateHive;