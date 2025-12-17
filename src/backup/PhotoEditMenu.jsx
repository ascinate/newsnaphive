import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ThemeButton from './ThemeButton';
import CustomText from './CustomText';

// SVG icons
import Portrait from '../../assets/svg/portrait.svg';
import Hdr from '../../assets/svg/hdr.svg';
import Filter from '../../assets/svg/filter.svg';
import PremiumModal from './PremiumModal';

// Define before/after images for modal
const beforeImage = require("../../assets/selfie.jpg");
const afterImage = require("../../assets/dp3.jpg");

const PhotoEditMenu = ({
    onClose,
    brightness: initialBrightness = 50,
    onBrightnessChange,
    contrast: initialContrast = 50,
    onContrastChange,
    photoUri
}) => {
    const navigation = useNavigation();
    const [localBrightness, setLocalBrightness] = useState(initialBrightness);
    const [localContrast, setLocalContrast] = useState(initialContrast);
    const [modalVisible, setModalVisible] = useState(false);

    // 🔹 Brightness PanResponder
    const brightnessResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => updateBrightnessFromTouch(evt.nativeEvent.locationX),
            onPanResponderMove: (evt) => updateBrightnessFromTouch(evt.nativeEvent.locationX),
        })
    ).current;

    // 🔹 Contrast PanResponder
    const contrastResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => updateContrastFromTouch(evt.nativeEvent.locationX),
            onPanResponderMove: (evt) => updateContrastFromTouch(evt.nativeEvent.locationX),
        })
    ).current;

    const updateBrightnessFromTouch = (locationX) => {
        const sliderWidth = 270;
        const newValue = Math.max(0, Math.min(100, Math.round((locationX / sliderWidth) * 100)));
        setLocalBrightness(newValue);
        onBrightnessChange?.(newValue);
    };

    const updateContrastFromTouch = (locationX) => {
        const sliderWidth = 270;
        const newValue = Math.max(0, Math.min(100, Math.round((locationX / sliderWidth) * 100)));
        setLocalContrast(newValue);
        onContrastChange?.(newValue);
    };

    return (
        <View style={styles.bottomPanel}>
            <Text style={styles.closeBtn} onPress={onClose}>X</Text>
            {/* feature photo edit Container */}
            <View>
                <ScrollView style={styles.brightnessSection}>

                    {/* 🔸 Brightness Section */}
                    <View style={styles.brightnessHeader}>
                        <CustomText weight="medium" style={styles.brightnessLabel}>
                            Brightness • {localBrightness}
                        </CustomText>
                    </View>
                    <View style={styles.sliderContainer}>
                        <View style={styles.customSlider} {...brightnessResponder.panHandlers}>
                            <View style={styles.sliderTrack}>
                                <View style={[styles.sliderFill, { width: `${localBrightness}%` }]} />
                                <View style={[styles.sliderThumb, { left: `${localBrightness}%` }]} />
                            </View>
                        </View>
                        <CustomText weight="semiBold" style={styles.brightnessValue}>{localBrightness}%</CustomText>
                    </View>

                    {/* 🔸 Contrast Section */}
                    <View style={styles.brightnessHeader}>
                        <CustomText weight="medium" style={styles.brightnessLabel}>
                            Contrast • {localContrast}
                        </CustomText>
                    </View>
                    <View style={styles.sliderContainer}>
                        <View style={styles.customSlider} {...contrastResponder.panHandlers}>
                            <View style={styles.sliderTrack}>
                                <View style={[styles.sliderFill, { width: `${localContrast}%` }]} />
                                <View style={[styles.sliderThumb, { left: `${localContrast}%` }]} />
                            </View>
                        </View>
                        <CustomText weight="semiBold" style={styles.brightnessValue}>{localContrast}%</CustomText>
                    </View>

                </ScrollView>
                {/* 🔸 Premium Tools */}
                <View style={styles.premiumSection}>
                    <CustomText weight="medium" style={styles.premiumTitle}>Premium Tools</CustomText>
                    <View style={styles.toolsContainer}>
                        <TouchableOpacity style={styles.premiumTool} onPress={() => setModalVisible(true)}>
                            <View style={styles.toolIcon}>
                                <Portrait width={24} height={24} />
                            </View>
                            <CustomText weight="semiBold" style={styles.toolText}>Portrait Retouch</CustomText>
                            <View style={styles.crownIcon}>
                                <CustomText weight="semiBold" style={styles.crownText}>👑</CustomText>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.premiumTool} onPress={() => setModalVisible(true)}>
                            <View style={styles.toolIcon}>
                                <Hdr width={24} height={24} />
                            </View>
                            <CustomText weight="semiBold" style={styles.toolText}>Advanced Filters</CustomText>
                            <View style={styles.crownIcon}>
                                <CustomText weight="semiBold" style={styles.crownText}>👑</CustomText>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.premiumTool} onPress={() => setModalVisible(true)}>
                            <View style={styles.toolIcon}>
                                <Filter width={24} height={24} />
                            </View>
                            <CustomText weight="semiBold" style={styles.toolText}>HDR Boost</CustomText>
                            <View style={styles.crownIcon}>
                                <CustomText weight="semiBold" style={styles.crownText}>👑</CustomText>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>



            {/* 🔸 Continue Button */}
            <ThemeButton
                text="Continue"
                onPress={() => navigation.navigate('ClickPhotoThree')}
                style={{ width: '100%' }}
            />

            {/* 🔸 Premium Modal */}
            <PremiumModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                beforeImage={beforeImage}
                afterImage={afterImage}
            />
        </View>
    );
};

export default PhotoEditMenu;

const styles = StyleSheet.create({
    bottomPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000CC',
        padding: 20,
        paddingBottom: 40,
        zIndex: 15,
    },
    brightnessSection: { marginBottom: 25, height: 120 },
    brightnessHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    brightnessLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    closeBtn: {
        color: '#ffffff',
        fontSize: 20,
        paddingHorizontal: 10,
        alignSelf: 'flex-end',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginBottom: 25,
    },
    customSlider: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    sliderTrack: {
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        position: 'relative',
    },
    sliderFill: {
        height: 4,
        backgroundColor: '#4CAF50',
        borderRadius: 2,
    },
    sliderThumb: {
        width: 20,
        height: 20,
        backgroundColor: '#4CAF50',
        borderRadius: 10,
        position: 'absolute',
        top: -8,
        marginLeft: -10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    brightnessValue: {
        color: '#fff',
        fontSize: 14,
        minWidth: 35,
    },
    premiumSection: { marginBottom: 25 },
    premiumTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    toolsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    premiumTool: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        position: 'relative',
    },
    toolIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    toolText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    crownIcon: {
        position: 'absolute',
        top: 8,
        right: 10,
    },
    crownText: { fontSize: 14 },
});
