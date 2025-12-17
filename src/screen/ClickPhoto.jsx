import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, Platform, PermissionsAndroid, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Contrast as ContrastFilter, Brightness as BrightnessFilter } from 'react-native-color-matrix-image-filters';
import PhotoCropModal from '../components/PhotoCropModal';

// Components
import TopNav from '../components/TopNavbar';
import PhotoEditMenu from '../components/PhotoEditMenu';
import PhotoEditOriginalvsEnhanced from '../components/PhotoEditOriginalvsEnhanced';
import PhotoEditSideIcons from '../components/PhotoEditSideIcons';

// SVG icons
import Gallery from '../../assets/svg/gallery.svg';
import Settings from '../../assets/svg/settings.svg';
import Adjustment from '../../assets/svg/adjustment.svg';
import CameraSwitch from '../../assets/svg/cameraswitch.svg';
import Undo from '../../assets/svg/undo.svg';
import Crop from '../../assets/svg/crop.svg';

const ClickPhoto = ({ navigation }) => {
    const [photo, setPhoto] = useState(null);
    const [showCamera, setShowCamera] = useState(true);

    const [isSaving, setIsSaving] = useState(false);
    const [isEditingUI, setIsEditingUI] = useState(false);
    const [brightness, setBrightness] = useState(50);
    const [contrast, setContrast] = useState(50);
    const [activeIcon, setActiveIcon] = useState('brightness');
    const [cameraPosition, setCameraPosition] = useState('back');

    const [showCropModal, setShowCropModal] = useState(false);
    const [croppedPhoto, setCroppedPhoto] = useState(null);
    const [originalPhoto, setOriginalPhoto] = useState(null);
    const [cropData, setCropData] = useState(null); // Store crop coordinates

    const cameraRef = useRef(null);
    const device = useCameraDevice(cameraPosition);

    const { hasPermission, requestPermission } = useCameraPermission();

    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, [hasPermission]);

    const handleEditToggle = () => setIsEditingUI(!isEditingUI);

    const savePhotoToGallery = async (photoPath) => {
        try {
            setIsSaving(true);

            if (Platform.OS === 'android') {
                const apiLevel = Platform.Version;
                let granted = false;

                if (apiLevel >= 33 || apiLevel >= 29) {
                    granted = true;
                } else {
                    granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        {
                            title: 'Save Photo Permission',
                            message: 'This app needs permission to save photos to your gallery.',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        }
                    );
                    granted = granted === PermissionsAndroid.RESULTS.GRANTED;
                }

                if (!granted && apiLevel < 29) {
                    Alert.alert('Permission Denied', 'Cannot save photo without permission.');
                    setIsSaving(false);
                    return null;
                }
            }

            const savedPhoto = await CameraRoll.save(photoPath, { type: 'photo' });
            setIsSaving(false);
            return savedPhoto;
        } catch (error) {
            console.error('Failed to save photo:', error);
            Alert.alert('Error', 'Failed to save photo to gallery');
            setIsSaving(false);
            return null;
        }
    };

    const takePhoto = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePhoto({
                    qualityPrioritization: 'balanced',
                    flash: 'off',
                });

                const photoPath = Platform.OS === 'ios' ? photo.path : `file://${photo.path}`;
                const photoUri = `file://${photo.path}`;
                setPhoto(photoUri);
                setOriginalPhoto(photoUri);
                setShowCamera(false);
                await savePhotoToGallery(photoPath);
            } catch (error) {
                console.error('Failed to take photo:', error);
                Alert.alert('Error', 'Failed to capture photo');
            }
        }
    };

    
    const retakePhoto = () => {
        setPhoto(null);
        setOriginalPhoto(null);
        setShowCamera(true);
        setBrightness(50);
        setContrast(50);
        setIsEditingUI(false);
        setCroppedPhoto(null);
        setCropData(null);
    };

    const usePhoto = () => navigation.navigate('PhotoShare');

    // Handle Brightness & Contrast change
    const handleBrightnessChange = (value) => {
        setBrightness(value);
    };

    const handleContrastChange = (value) => {
        setContrast(value);
    };

    const handleUndo = () => {
        setBrightness(50);
        setContrast(50);
        setIsEditingUI(false);
        setActiveIcon(null);
        setCroppedPhoto(null);
        setCropData(null);
        if (originalPhoto) {
            setPhoto(originalPhoto);
        }
    }

    // Simple crop implementation - just store the crop data
    const handleCropComplete = (cropDataFromModal) => {
        try {
            setShowCropModal(false);
            setCropData(cropDataFromModal);
            setCroppedPhoto(cropDataFromModal);
            setActiveIcon('Crop');
            
            // Show success message
            console.log('Crop applied:', cropDataFromModal);
        } catch (error) {
            console.error('Crop failed:', error);
            Alert.alert('Error', 'Failed to apply crop');
        }
    };

    if (!hasPermission) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <TopNav />
                    <View style={styles.container}>
                        <Text style={styles.permissionText}>Camera permission required</Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (!device) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.safeArea}>
                    <TopNav />
                    <View style={styles.container}>
                        <Text style={styles.permissionText}>Camera not available</Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <TopNav />
                <View style={styles.container}>
                    {showCamera ? (
                        <Camera
                            ref={cameraRef}
                            style={styles.camera}
                            device={device}
                            isActive={showCamera}
                            photo={true}
                        />
                    ) : (
                        <View style={styles.imageContainer}>
                            {/* Apply crop if exists */}
                            {cropData ? (
                                <View style={styles.croppedContainer}>
                                    <ContrastFilter amount={contrast / 50}>
                                        <BrightnessFilter amount={brightness / 50}>
                                            <Image 
                                                source={{ uri: originalPhoto || photo }} 
                                                style={[
                                                    styles.image,
                                                    {
                                                        width: cropData.imageWidth,
                                                        height: cropData.imageHeight,
                                                        marginLeft: -cropData.x,
                                                        marginTop: -cropData.y,
                                                    }
                                                ]} 
                                                resizeMode="cover" 
                                            />
                                        </BrightnessFilter>
                                    </ContrastFilter>
                                </View>
                            ) : (
                                <ContrastFilter amount={contrast / 50}>
                                    <BrightnessFilter amount={brightness / 50}>
                                        <Image source={{ uri: photo }} style={styles.image} resizeMode="cover" />
                                    </BrightnessFilter>
                                </ContrastFilter>
                            )}
                        </View>
                    )}

                    {!showCamera && (
                        <View style={styles.photoActions}>
                            <TouchableOpacity style={styles.actionButton} onPress={retakePhoto}>
                                <Text style={styles.actionButtonText}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.usePhotoButton]}
                                onPress={usePhoto}
                                disabled={isSaving}
                            >
                                <Text style={styles.actionButtonText}>
                                    {isSaving ? 'Saving...' : 'Use Photo'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.shutter}
                        onPress={showCamera ? takePhoto : retakePhoto}
                        activeOpacity={0.7}
                    >
                        <View style={styles.shutterBtn} />
                    </TouchableOpacity>

                    {!showCamera && (
                        <>
                            <PhotoEditOriginalvsEnhanced />
                            <TouchableOpacity style={styles.settingsBtn} onPress={handleEditToggle}>
                                <Settings />
                            </TouchableOpacity>

                            <View style={styles.sideIcons}>
                                <TouchableOpacity
                                    style={[styles.sideIcon, activeIcon === 'brightness' && styles.activeTab]}
                                    onPress={() => setActiveIcon('brightness')}
                                >
                                    <Adjustment />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.sideIcon, activeIcon === 'Crop' && styles.activeTab]}
                                    onPress={() => setShowCropModal(true)}
                                >
                                    <Crop />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.sideIcon, activeIcon === 'Undo' && styles.activeTab]}
                                    onPress={handleUndo}
                                >
                                    <Undo />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.galleryBtn}
                        onPress={() => navigation.navigate('PhotoShare')}
                    >
                        <Gallery width={25} height={25} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.closeText}>X</Text>
                    </TouchableOpacity>

                    {showCamera && (
                        <TouchableOpacity
                            style={styles.cameraSwitchBtn}
                            onPress={() =>
                                setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'))
                            }
                        >
                            <CameraSwitch width={25} height={25} />
                        </TouchableOpacity>
                    )}

                </View>

                {isEditingUI && (
                    <PhotoEditMenu
                        onClose={() => setIsEditingUI(false)}
                        brightness={brightness}
                        onBrightnessChange={handleBrightnessChange}
                        contrast={contrast}
                        onContrastChange={handleContrastChange}
                        photoUri={photo}
                    />
                )}

                <PhotoCropModal
                    visible={showCropModal}
                    photoUri={originalPhoto || photo}
                    onClose={() => setShowCropModal(false)}
                    onCropComplete={handleCropComplete}
                />

            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ClickPhoto;

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, position: 'relative' },
    camera: { width: '100%', height: '100%', position: 'absolute' },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    image: { width: '100%', height: '100%' },
    croppedContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    shutter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'red',
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    shutterBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
    },
    settingsBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#030303B2',
        borderRadius: 20,
        position: 'absolute',
        bottom: 30,
        right: 70,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },
    galleryBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#030303B2',
        borderRadius: 20,
        position: 'absolute',
        bottom: 30,
        left: 70,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },
    closeBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF4D',
        borderRadius: 20,
        position: 'absolute',
        top: 20,
        left: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },
    closeText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

    cameraSwitchBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF4D',
        borderRadius: 20,
        position: 'absolute',
        top: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 15,
    },

    permissionText: { color: 'white', fontSize: 16, textAlign: 'center', marginTop: 50 },
    photoActions: {
        position: 'absolute',
        top: 100,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        zIndex: 20,
    },
    actionButton: {
        backgroundColor: '#030303B2',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    usePhotoButton: { backgroundColor: '#4CAF50' },
    actionButtonText: { color: 'white', fontSize: 14, fontWeight: '500' },
    sideIcons: {
        position: 'absolute',
        right: 20,
        top: 100,
        marginTop: -80,
        gap: 15,
    },
    sideIcon: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
        padding: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#ffffff',
    },
});