import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopNavbar from '../components/TopNavbar'

const { width, height } = Dimensions.get("window");

// svg
import LeftArrow from '../../assets/svg/leftArrow.svg'
import CameraIcon from '../../assets/svg/cameraIcon.svg'
import VoiceMesssage from '../../assets/svg/voiceMesssage.svg'

import MultiImage from '../../assets/svg/multiImage.svg'
import CustomText from '../components/CustomText'
import { ArrowLeft, Ellipsis, ImagePlus, MoveLeft, Send, SendHorizonal } from "lucide-react-native";
// image
const dp = require("../../assets/dp.jpg");
const picnic1 = require("../../assets/picnic1.jpg");

const Chat = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>

            {/* Header Section */}
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: width * 0.025 }} >

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft size={width * 0.06} />
                    </TouchableOpacity>

                    <View style={styles.profileContainer}>
                        <View style={styles.displayPictureContainer}>
                            <Image source={dp} style={styles.displayPicture} />
                        </View>
                        <View>
                            <CustomText weight="bold" style={styles.userName}>James Danis</CustomText>
                            <CustomText weight="medium" style={{ fontSize: width * 0.03, color: '#00A236' }}>Online</CustomText>
                        </View>
                    </View>
                </View>
                <Ellipsis size={width * 0.06} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>



                <View style={styles.messagesContainer}>
                    {/* Message Box */}
                    <View style={styles.userOneMessageBox}>

                        <View style={styles.messageContent}>
                            <View style={styles.messageImageContainer}>
                                <Image source={picnic1} style={styles.messageImage} />
                            </View>
                            <View style={{ flexDirection: 'row', gap: width * 0.025 }}>
                                <View style={styles.messageImageContainerTwo}>
                                    <Image source={picnic1} style={styles.messageImage} />
                                </View>
                                <View style={styles.messageImageContainerMore}>
                                    <CustomText weight="medium" style={{ fontSize: width * 0.0625, color: '#5F636E' }}>50+ </CustomText>
                                </View>
                            </View>

                        </View>
                        <CustomText weight="medium" style={{ fontSize: width * 0.025 }} >01:00 am</CustomText>
                    </View>

                    <View style={styles.userTwoMessageBox}>

                        <View style={styles.messageText}>
                            <CustomText weight="medium" style={[styles.text, { color: '#636363', fontSize: width * 0.03 }]}>Hey Tobi, are you join our
                                new Hive?

                            </CustomText>
                            <View style={styles.messageArrowRight} />
                        </View>
                        <CustomText weight="medium" style={{ fontSize: width * 0.025 }} >01:00 am</CustomText>
                    </View>

                    <View style={styles.userOneMessageBox}>
                        <View style={styles.messageTextLeft}>
                            <CustomText weight="medium" style={[styles.textLeft, { color: '#636363', fontSize: width * 0.03 }]}>Hey Tobi, are you join our
                                new Hive?
                            </CustomText>
                            <View style={styles.messageArrowLeft} />
                        </View>
                        <CustomText weight="medium" style={{ fontSize: width * 0.025 }} >01:00 am</CustomText>
                    </View>

                    <View style={styles.userOneMessageBox}>


                        <View style={styles.messageContent}>
                            <View style={{ flexDirection: 'row', gap: width * 0.025 }}>
                                <View style={styles.messageImageContainerTwo}>
                                    <Image source={picnic1} style={styles.messageImage} />
                                </View>
                                <View style={styles.messageImageContainerMore}>
                                    <Image source={picnic1} style={styles.messageImage} />
                                </View>
                            </View>

                        </View>
                        <CustomText weight="medium" style={{ fontSize: width * 0.025, margin: 0 }} >01:00 am</CustomText>
                    </View>

                </View>
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: width * 0.025, paddingVertical: height * 0.02, paddingHorizontal: width * 0.0625, alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ backgroundColor: '#DA3C84', height: width * 0.1, width: width * 0.1, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                    <CameraIcon height={width * 0.06} width={width * 0.06} />
                </View>
                <View style={{ position: 'relative' }}>
                    <TextInput style={styles.inputType} placeholder='Type here..' placeholderTextColor="#AAAAAA" />

                    <ImagePlus size={width * 0.06} color='#575757' style={styles.send} />
                </View>

                <View
                    style={{ 
                        width: width * 0.11,
                        height: width * 0.11,
                        backgroundColor: '#DA3C84',
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <SendHorizonal size={width * 0.06} color="#ffffff" />
                </View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF9',

    },
    scrollContainer: {
        paddingVertical: height * 0.00,
        paddingHorizontal: width * 0.0625,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: width * 0.03,
        marginBottom: height * 0.025,
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.0625,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: width * 0.025,
    },
    displayPictureContainer: {
        width: width * 0.11,
        height: width * 0.11,
        borderRadius: 50,
        overflow: 'hidden',
    },
    displayPicture: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    userName: {
        fontSize: width * 0.04,
        fontWeight: '600',
        color: '#000',
    },
    messagesContainer: {
        flex: 1,
        paddingTop: height * 0.0,
    },
    userOneMessageBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: width * 0.045,
        marginBlock: height * 0.02,
        maxWidth: '80%',
    },
    userTwoMessageBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: width * 0.045,
        marginBlock: height * 0.02,
        maxWidth: '80%',
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    messageDpContainer: {
        width: width * 0.0875,
        height: width * 0.0875,
        borderRadius: width * 0.04375,
        overflow: 'hidden',
    },
    messageDp: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    messageContent: {
        flex: 1,
        gap: width * 0.025,
    },
    messageImageContainer: {
        width: width * 0.5375,
        height: height * 0.15,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    messageImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    messageImageContainerTwo: {
        width: width * 0.25,
        height: height * 0.1125,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },

    messageImageContainerMore: {
        width: width * 0.25,
        height: height * 0.1125,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center'
    },
    messageText: {
        borderRadius: 10,
        backgroundColor: '#FFE49A',
        paddingVertical: height * 0.0137,
        paddingHorizontal: width * 0.07,
        maxWidth: width * 0.6625,
        height: 'auto',
        shadowColor: '#acacacff',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 12,
    },
    messageTextLeft: {
        borderRadius: 10,
        backgroundColor: '#fff',
        paddingVertical: height * 0.0137,
        paddingHorizontal: width * 0.07,
        maxWidth: width * 0.6625,
        height: 'auto',
        shadowColor: '#acacacff',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 12,
    },
    text: {
        color: '#000000',
        fontWeight: 600,
    },
    textLeft: {
        color: '#ffffffff',
        fontWeight: 600,
    },
    messageArrowRight: {
        position: 'absolute',
        right: -5,
        bottom: 2,
        width: 0,
        height: 0,
        borderTopWidth: 8,
        borderTopColor: 'transparent',
        borderBottomWidth: 8,
        borderBottomColor: 'transparent',
        borderLeftWidth: 8,
        borderLeftColor: '#FFE49A',
    },
    messageArrowLeft: {
        position: 'absolute',
        left: -5,
        bottom: 2,
        width: 0,
        height: 0,
        borderTopWidth: 8,
        borderTopColor: 'transparent',
        borderBottomWidth: 8,
        borderBottomColor: 'transparent',
        borderRightWidth: 8,
        borderRightColor: '#fff',
    },
    inputType: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 50,
        paddingLeft: width * 0.05,
        width: width * 0.63,
        height: width * 0.11
    },
    voiceMesssage: {
        position: 'absolute',
        right: width * 0.1,
        top: '20%',
    },
    send: {
        position: 'absolute',
        right: width * 0.03,
        top: '22%',
    }
})

export default Chat