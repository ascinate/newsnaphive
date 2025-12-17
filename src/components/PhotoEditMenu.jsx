import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ThemeButton from './ThemeButton';
import CustomText from './CustomText';
import PremiumModal from './PremiumModal';

// SVG icons
import Portrait from '../../assets/svg/portrait.svg';
import Hdr from '../../assets/svg/hdr.svg';
import Filter from '../../assets/svg/filter.svg';
import Replce from '../../assets/svg/replce.svg';
import Mirror from '../../assets/svg/mirror.svg';
import Filp from '../../assets/svg/filp.svg';
import Bottom from '../../assets/svg/bottom.svg';

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
    const [activeMenu, setActiveMenu] = useState(null); // "filters" or "portrait"

    // Dummy color filters
    // Dynamic color filters with labels
    const colorFilters = [
        { id: 1, label: 'Vivd', color: '#FF6F61' },
        { id: 2, label: 'B&W', color: '#FFD54F' },
        { id: 3, label: 'Sunny', color: '#4FC3F7' },
        { id: 4, label: 'Moonbeam', color: '#81C784' },
    ];

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

            {/* ===================== MAIN CONTENT ===================== */}
            {!activeMenu ? (
                <>
                    {/* 🔸 Brightness & Contrast Section */}
                    <ScrollView style={styles.brightnessSection}>
                        {/* 🔸 Brightness */}
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

                        {/* 🔸 Contrast */}
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
                            {/*  Portrait Retouch opens Collage UI */}
                            <TouchableOpacity style={styles.premiumTool} onPress={() => setActiveMenu("portrait")}>
                                <View style={styles.toolIcon}><Portrait width={24} height={24} /></View>
                                <CustomText weight="semiBold" style={styles.toolText}>Portrait Retouch</CustomText>
                                <View style={styles.crownIcon}><CustomText weight="semiBold" style={styles.crownText}>👑</CustomText></View>
                            </TouchableOpacity>

                            {/*  Advanced Filters opens Filter UI */}
                            <TouchableOpacity style={styles.premiumTool} onPress={() => setActiveMenu("filters")}>
                                <View style={styles.toolIcon}><Hdr width={24} height={24} /></View>
                                <CustomText weight="semiBold" style={styles.toolText}>Advanced Filters</CustomText>
                                <View style={styles.crownIcon}><CustomText weight="semiBold" style={styles.crownText}>👑</CustomText></View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.premiumTool} onPress={() => setModalVisible(true)}>
                                <View style={styles.toolIcon}><Filter width={24} height={24} /></View>
                                <CustomText weight="semiBold" style={styles.toolText}>HDR Boost</CustomText>
                                <View style={styles.crownIcon}><CustomText weight="semiBold" style={styles.crownText}>👑</CustomText></View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            ) : activeMenu === "filters" ? (
                // ===================== FILTER UI =====================
                <View style={styles.filterContainer}>
                    <View style={styles.filtersHeader}>
                        <TouchableOpacity onPress={() => setActiveMenu(null)}>
                            <Text style={styles.filtersText}>✕</Text>
                        </TouchableOpacity>
                        <Text style={styles.filtersTitle}>Filters</Text>
                        <TouchableOpacity onPress={() => setActiveMenu(null)}>
                            <Text style={styles.filtersApply}>✓</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.colorFiltersContainer}>
                        <View style={styles.colorFiltersRow}>
                            {colorFilters.map((filter) => (
                                <View key={filter.id} style={{ alignItems: 'center', marginHorizontal: 10 }}>
                                    {/* Dynamic label */}
                                    <Text style={{ color: '#ffffff', marginBottom: 10 }}>{filter.label}</Text>

                                    {/* Color circle */}
                                    <TouchableOpacity style={[styles.colorCircle, { backgroundColor: filter.color }]} />
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            ) : (
                // ===================== PORTRAIT RETOUCH (COLLAGE) UI =====================
                <View style={styles.filterContainer}>
                    <View style={styles.filtersHeader}>
                        <TouchableOpacity onPress={() => setActiveMenu(null)}>
                            <Text style={styles.filtersText}>✕</Text>
                        </TouchableOpacity>
                        <Text style={styles.filtersTitle}>Collage</Text>
                        <TouchableOpacity onPress={() => setActiveMenu(null)}>
                            <Text style={styles.filtersApply}>✓</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.collageContainer}>
                        <View>
                            <Text style={styles.collageText}>Replce</Text>
                            <View style={styles.collageManu}><Replce /></View>
                        </View>
                        <View>
                            <Text style={styles.collageText}>Mirror</Text>
                            <View style={styles.collageManu}><Mirror /></View>
                        </View>
                        <View>
                            <Text style={styles.collageText}>Flip</Text>
                            <View style={styles.collageManu}><Filp /></View>
                        </View>
                        <View>
                            <Text style={styles.collageText}>Bottom</Text>
                            <View style={styles.collageManu}><Bottom /></View>
                        </View>
                    </View>
                </View>
            )}

            {/*  Continue Button */}
            <ThemeButton
                text="Continue"
                onPress={() => navigation.navigate('ClickPhotoThree')}
                style={{ width: '100%' }}
            />

            {/*  Premium Modal */}
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
    closeBtn: {
        color: '#ffffff',
        fontSize: 20,
        paddingHorizontal: 10,
        alignSelf: 'flex-end',
    },
    brightnessSection: { marginBottom: 25, height: 100 },
    brightnessHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    brightnessLabel: { color: '#fff', fontSize: 16, fontWeight: '600' },
    sliderContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 25 },
    customSlider: { flex: 1, height: 40, justifyContent: 'center', paddingHorizontal: 5 },
    sliderTrack: { height: 4, backgroundColor: '#333', borderRadius: 2, position: 'relative' },
    sliderFill: { height: 4, backgroundColor: '#4CAF50', borderRadius: 2 },
    sliderThumb: {
        width: 20, height: 20, backgroundColor: '#4CAF50', borderRadius: 10,
        position: 'absolute', top: -8, marginLeft: -10, shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5,
    },
    brightnessValue: { color: '#fff', fontSize: 14, minWidth: 35 },

    premiumSection: { marginBottom: 25, borderTopColor: '#444', borderTopWidth: 1, paddingTop: 15 },
    premiumTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 15 },
    toolsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    premiumTool: {
        flex: 1, backgroundColor: '#fff', borderRadius: 15, padding: 15,
        alignItems: 'center', position: 'relative',
    },
    toolIcon: {
        width: 40, height: 40, backgroundColor: '#fff', borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginBottom: 8,
    },
    toolText: { color: '#000', fontSize: 12, fontWeight: '500', textAlign: 'center' },
    crownIcon: { position: 'absolute', top: 8, right: 10 },
    crownText: { fontSize: 14 },

    // 🔹 Filter Styles
    filterContainer: { marginTop: 10 },
    filtersHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20,
    },
    filtersText: { color: '#fff', fontSize: 22 },
    filtersTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
    filtersApply: { color: '#4CAF50', fontSize: 22 },
    colorFiltersContainer: { alignItems: 'center', paddingInline: 45 },
    colorFiltersContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    colorFiltersRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    colorCircle: {
        width: 50, height: 50, borderRadius: 8,
        borderWidth: 2, borderColor: '#fff',
    },

    collageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        paddingInline: 45,
    },
    collageManu: {
        height: 55,
        width: 55,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    collageText: {
        color: '#ffffffff',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 5,
    }
});
