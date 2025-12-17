import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableWithoutFeedback, TouchableHighlight, Alert, useWindowDimensions, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { loginUser } from "../API/API";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLoader } from "../context/LoaderContext";

import Logo from '../components/Logo';
import ThemeButton from '../components/ThemeButton';
import CustomText from '../components/CustomText';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal'; //
const logo = require("../../assets/logo.png");
// svg
import Igoogle from "../../assets/Igoogle.svg";
import Iapple from "../../assets/apple2.svg";

const Login = ({ navigation }) => {
    const { showLoader, hideLoader } = useLoader();
    const { width, height } = useWindowDimensions();
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const isValidEmail = (text) => /\S+@\S+\.\S+/.test(text);
    const isValidPhone = (text) => /^[0-9]{10,15}$/.test(text);

    const handleContinue = async () => {
        if (!userID.trim()) {
            Alert.alert("Error", "Please enter your email or phone number");
            return;
        }

        if (!isValidEmail(userID) && !isValidPhone(userID)) {
            Alert.alert("Error", "Invalid email or phone number");
            return;
        }

        if (!password.trim()) {
            Alert.alert("Error", "Please enter your password");
            return;
        }

        try {
            showLoader(); // Show Global Loader

            const res = await loginUser({
                email: userID,
                password,
            });

            if (res.data && res.data.token) {
                await AsyncStorage.setItem("token", res.data.token);
                await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

                navigation.replace("MyTabs");
            } else {
                Alert.alert("Error", "Invalid response from server");
            }
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Login failed");
        } finally {
            hideLoader(); // Hide Global Loader
        }
    };



    return (
        <SafeAreaProvider style={[styles.container, { height: '100%', width: '100%' }]}>

            <Logo />
            <CustomText weight='medium' style={[styles.description, { paddingInline: 32 }]}>
                Login to your account in Snaphive to start Photo and video share
            </CustomText>

            <TextInput style={styles.emailInput}
                value={userID}
                onChangeText={setUserID}
                placeholder='Enter your email or phone number'
                keyboardType='email-address'
                autoCapitalize='none' />
            <TextInput style={styles.emailInput}
                value={password}
                onChangeText={setPassword}
                placeholder='Enter your password'
                secureTextEntry={true} />

            <View style={{ width: '100%', marginTop: 10 }}>
                <TouchableWithoutFeedback>
                    <CustomText weight='medium' style={{ color: '#111a94ff', textAlign: 'left' }} onPress={() => navigation.navigate("ForgotPassword")}>
                        Forgot your password ?
                    </CustomText>
                </TouchableWithoutFeedback>
            </View>


            <ThemeButton
                text={loading ? "" : "Login →"}
                onPress={handleContinue}
                style={{ width: "100%", marginTop: 15 }}
            >

            </ThemeButton>




            <CustomText weight='medium' style={[styles.description, { position: 'absolute', bottom: 20, textAlign: 'center', fontSize: 14 }]}>
                By continuing I accept Selfso's Terms of Use
                and
                <TouchableWithoutFeedback onPress={() => setShowPrivacyModal(true)}>
                    <CustomText weight='medium' style={[styles.continueTxt, { fontWeight: 600, textDecorationLine: "underline", color: "#000000ff" }]}> Privacy Policy</CustomText>
                </TouchableWithoutFeedback>
            </CustomText>
            <PrivacyPolicyModal
                visible={showPrivacyModal}
                onClose={() => setShowPrivacyModal(false)}
            />
            {/* Continue with Google */}
            <TouchableWithoutFeedback>
                <View style={[styles.outlineBtn, { paddingVertical: height * 0.02 }]}>
                    <View style={styles.iconContainer}>
                        <Igoogle width={width * 0.06} height={width * 0.06} />
                    </View>
                    <CustomText weight='bold'
                        style={[
                            styles.continueTxt,
                            {
                                fontSize: width * 0.03,
                                fontFamily: 'Montserrat-Medium',
                                fontWeight: '500',
                                color: '#000',
                            },
                        ]}
                    >
                        Continue with Google
                    </CustomText>
                </View>
            </TouchableWithoutFeedback>

            {/* Continue with Apple */}
            <TouchableWithoutFeedback>
                <View
                    style={[
                        styles.outlineBtn,
                        {
                            paddingVertical: height * 0.02,
                            backgroundColor: '#000000',
                            marginTop: 15,
                            marginBottom: 8,
                            borderWidth: 1,
                            borderColor: '#000',
                        }
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <Iapple width={width * 0.06} height={width * 0.06} />
                    </View>
                    <CustomText
                        style={[
                            styles.continueTxt,
                            {
                                fontSize: width * 0.03,
                                fontFamily: 'Montserrat-Medium',
                                fontWeight: '600',
                                color: '#fff', // White text
                            },
                        ]}
                    >
                        Continue with Apple
                    </CustomText>
                </View>
            </TouchableWithoutFeedback>


            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <CustomText weight='medium' style={{ color: '#000000ff' }}>Don’t have an account ?  </CustomText>
                <TouchableWithoutFeedback >
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('Signup')}>
                        <CustomText weight="bold" style={[styles.continueTxt, { fontWeight: 600, color: '#111a94ff' }]}>Sign up</CustomText>
                    </TouchableWithoutFeedback>
                </TouchableWithoutFeedback>
            </View>




        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", padding: 20 },
    flex: { flexDirection: "row", justifyContent: "center", alignItems: 'center', marginBottom: 24 },
    logo: { width: 50, height: 50, resizeMode: "contain", marginRight: 10 },
    title: { fontSize: 35, color: '#000', fontWeight: '700', textAlign: 'center', },
    description: { fontSize: 16, color: '#646464', textAlign: 'center', width: '100%' },

    emailInput: {
        marginTop: 20,
        width: "100%",
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 21,
        fontSize: 16,
        textAlign: 'left',
        paddingLeft: 27,
    },

    inputType: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingLeft: 10,
        paddingVertical: 16,
        fontSize: 16,
    },
    outlineBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 12,
        width: '100%',

        position: 'relative',
    },
    iconContainer: {
        position: 'absolute',
        left: 22,
    },
    orLine: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },





});

export default Login;