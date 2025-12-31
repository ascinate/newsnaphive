import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { colors } from '../Theme/theme';
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Animated,
    Text,
    TextInput,
    RefreshControl,
} from 'react-native';
import {
    Sparkles,
    Users,
    FileImage,
    Clock5,
    ImagePlus,
    MoveRight,
    Brush,
    Image as Photo,
    Search,
    CirclePlus,
} from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { EventContext } from '../context/EventContext';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground } from "react-native";
// components
import TopNav from '../components/TopNavbar';
import CustomText from '../components/CustomText';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/SearchBar';
// assets
const picnic1 = require('../../assets/picnic1.jpg');

const { width, height } = Dimensions.get('window');

const MyHives = ({ navigation, route }) => {
    const [refreshing, setRefreshing] = useState(false);
    const { hives } = useContext(EventContext);
    const { t, i18n } = useTranslation();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <TopNav />
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} />
                    }>
                    {/* Header Section */}

                    <View style={styles.headerSection}>
                        <CustomText weight="bold" style={styles.title}>{t('myHives')}</CustomText>
                        <CustomText style={styles.subtitle}>
                            {t('allSharedMemories')}
                        </CustomText>
                        <View style={{ position: 'relative', justifyContent: 'center' }}>
                            {/* <Search
                                size={18}
                                color="#9CA3AF"
                                style={{
                                    position: 'absolute',
                                    top: ' 45%',
                                    left: 14,

                                    zIndex: 10,
                                }}
                                
                            /> */}
                            {/* <TextInput
                                style={[styles.searchInput, { paddingLeft: 38 }]}
                                placeholder={t('searchHive')}
                                placeholderTextColor="#9CA3AF"
                                /> */}
                                <SearchBar />

                        </View>
                    </View>

                    {/* Dashboard Cards Section */}

                    <View style={styles.row}>
                        <View style={styles.cardWrap}>
                            <View
                                style={[styles.dashCard, { backgroundColor: colors.primary }]}

                            >
                                <View>
                                    <CustomText weight="bold" style={styles.cardText}>
                                        {hives.length}

                                    </CustomText>
                                    <CustomText weight="medium" style={{ color: '#fff' }}>
                                        {t('totalHives')}
                                    </CustomText>
                                </View>
                            </View>
                        </View>

                        <View style={styles.cardWrap}>
                            <View
                                style={[styles.dashCard, { backgroundColor: '#cc4faa' }]}

                            >
                                <View>
                                    <CustomText weight="bold" style={styles.cardText}>
                                        {hives.reduce((total, event) => {
                                            // Check both 'images' (from API) and 'photos' (legacy/local)
                                            const imageCount = event.images?.length || event.photos?.length || 0;
                                            return total + imageCount;
                                        }, 0)}

                                    </CustomText>
                                    <CustomText weight="medium" style={{ color: '#fff' }}>
                                        {t('photos')}
                                    </CustomText>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Example Event Row */}

                    {/* Event Row Section */}
                    <View style={{ marginTop: 20, paddingBottom: 100 }}>
                        {hives && hives.length > 0 ? (
                            hives.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() =>
                                        navigation.navigate("FolderLayout", {
                                            image: { uri: item.coverImage },
                                            folderName: item.hiveName,
                                            hiveId: item._id,
                                            date: item.createdAt,
                                            owner: item.ownerName,
                                             eventDescription: item.description,
                                            photos: item.photos || [],
                                        })
                                    }
                                >
                                    <View style={styles.eventRow}>
                                        <Image
                                            source={{ uri: item.coverImage }}
                                            style={styles.eventImg}
                                        />

                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <CustomText weight="bold" style={styles.eventTitle}>
                                                {item.hiveName}
                                            </CustomText>

                                            <CustomText weight="medium" style={styles.mtop}>
                                                {item.description || "No description"}
                                            </CustomText>

                                            <View style={{ flexDirection: "row", gap: 20, marginTop: 6 }}>
                                                <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
                                                    <Users width={14} height={14} color="#6B7280" />
                                                    <CustomText style={{ color: "#6B7280" }}>1</CustomText>
                                                </View>

                                                <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
                                                    <FileImage width={14} height={14} color="#6B7280" />
                                                    <CustomText style={{ color: "#6B7280" }}>
                                                        {item.photos?.length || 0}
                                                    </CustomText>
                                                </View>
                                            </View>
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
                                }}
                            >
                                <View
                                    style={{
                                        width: 60,
                                        height: 60,
                                        backgroundColor: '#c2beffff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 50,
                                    }}
                                >
                                    <ImagePlus color="#fff" size={28} />
                                </View>

                                <CustomText weight="medium" style={{ color: '#da3c84' }}>
                                    {t('noHivesYet')}
                                </CustomText>
                                <TouchableOpacity onPress={() => navigation.navigate('CreateHive')}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 6,
                                            backgroundColor: '#f7a481',
                                            padding: 15,
                                            borderRadius: 12,
                                            marginTop: 8,
                                        }}
                                    >
                                        <CustomText weight="bold" style={{ color: '#ffffff' }}>
                                            {t('createYourFirstHive')}
                                        </CustomText>
                                        <CirclePlus color="#ffffff" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>


                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider >
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05,
        backgroundColor: '#fff',
    },
    headerSection: {
        marginVertical: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.primary,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    searchInput: {
        marginTop: 12,
        backgroundColor: '#fff',

        paddingHorizontal: 20,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        color: '#111827',
        borderRadius: 16,
    },
    eventRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        marginTop: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    eventImg: {
        width: 90,
        height: 90,
        borderRadius: 12,
        marginRight: width * 0.01,
    },
    eventTitle: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '600',
    },
    mtop: {
        marginTop: 6,
        color: '#6B7280',
    },

    profileIcon: {
        position: 'absolute',
        right: -10,
        bottom: -5,
        backgroundColor: '#ec4899',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },

    cardWrap: {
        width: "48%",
    },

    dashCard: {
        padding: width * 0.045,
        borderRadius: 12,
        // alignItems: 'center',
        justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 2,
        overflow: "hidden",
    },

    cardText: {
        fontSize: 18,
        color: '#fff',
    },
});

export default MyHives;
