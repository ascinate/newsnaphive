import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableWithoutFeedback, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import ThemeButton from '../components/ThemeButton';
import CustomText from '../components/CustomText';
import { resetpassword } from '../API/API';
import { resendOtp } from '../API/API';


const NewPassword = ({ navigation, route }) => {
  const { email } = route.params;
  const [OTP, setOTP] = useState('');
  const [password, setPassword] = useState('');

  const handleResetPassword = async () => {
    if (!OTP.trim()) {
      Alert.alert("Error", "Please enter your OTP");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }

    try {
      const { data } = await resetpassword({
        email,
        otp: OTP,
        newPassword: password,
      });
      Alert.alert("Success", data.message, [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err) {
      console.log("Reset Error:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <Logo />

      <TextInput
        style={styles.emailInput}
        value={OTP}
        onChangeText={setOTP}
        placeholder='Enter OTP sent to your email'
        keyboardType='number-pad'
        autoCapitalize='none'
      />

    <View style={{ width: '97%', marginTop: 10 }}>
    <TouchableWithoutFeedback onPress={async () => {
        try {
        const { data } = await resendOtp({ email });
        Alert.alert("Success", data.message);
        } catch (err) {
        Alert.alert("Error", err.response?.data?.message || "Failed to resend OTP");
        }
     }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CustomText weight='medium' style={{ color: '#5e5e5e' }}>
            Didn't get a code?
        </CustomText>
        <CustomText weight='medium' style={{ color: '#111a94', marginLeft: 4 }}>
            Resend
        </CustomText>
        </View>
    </TouchableWithoutFeedback>
    </View>

      

      <TextInput
        style={styles.emailInput}
        value={password}
        onChangeText={setPassword}
        placeholder='Enter new password'
        secureTextEntry={true}
        autoCapitalize='none'
      />

      <ThemeButton
        text="Reset Password →"
        style={{ width: "100%", marginTop: 20 }}
        onPress={handleResetPassword}
      />

      <CustomText
        weight='medium'
        style={[styles.description, { position: 'absolute', bottom: 20, textAlign: 'center', fontSize: 14 }]}
      >
        By continuing I accept Selfso's Terms of Use and
        <TouchableWithoutFeedback>
          <CustomText
            weight='medium'
            style={[styles.continueTxt, { fontWeight: '600', textDecorationLine: "underline", color: "#000" }]}
          >
            {" "}Privacy Policy
          </CustomText>
        </TouchableWithoutFeedback>
      </CustomText>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#fff", padding: 20 },
  emailInput: {
    marginTop: 32,
    width: "100%",
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 21,
    fontSize: 16,
    textAlign: 'left',
    paddingLeft: 27,
  },
  description: { fontSize: 16, color: '#646464', textAlign: 'center', width: '100%' },
});

export default NewPassword;
