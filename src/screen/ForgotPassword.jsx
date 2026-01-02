import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableWithoutFeedback, } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Logo from '../components/Logo';
import ThemeButton from '../components/ThemeButton';
import CustomText from '../components/CustomText';
import { forgotpassword } from '../API/API';
import Toast from 'react-native-toast-message';
const Login = ({ navigation }) => {
  const [userID, setUserID] = useState('');

const handleSendOTP = async () => {
  if (!userID.trim()) {
    Toast.show({
      type: 'error',
      text1: 'Missing Email',
      text2: 'Please enter your registered email',
    });
    return;
  }

  try {
    const { data } = await forgotpassword({ email: userID });

Toast.show({
  type: 'success',
  text1: 'OTP Sent',
  visibilityTime: 2000,
});

    navigation.navigate("NewPassword", { email: userID });

  } catch (err) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: err.response?.data?.message || 'Something went wrong',
    });
  }
};


  return (
    <SafeAreaProvider style={styles.container}>
      <Logo />
      <CustomText weight='medium' style={styles.description}>
        Reset your password to regain access to your account
      </CustomText>

      <TextInput
        style={styles.emailInput}
        value={userID}
        onChangeText={setUserID}
        placeholder='Enter your email'
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <ThemeButton
        text="Get OTP →"
        style={{ width: "100%", marginTop: 20 }}
        onPress={handleSendOTP}
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
  description: { paddingInline: 32, fontSize: 16, color: '#646464', textAlign: 'center', width: '100%' },
  emailInput: {
    marginTop: 36,
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
});

export default Login;
