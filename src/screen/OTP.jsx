import React, { useState, useRef } from 'react';
import { View, Alert, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeButton from '../components/ThemeButton';
import CustomText from '../components/CustomText';
import { verifyOtp } from '../API/API';
import { resendOtp } from '../API/API';

const OTP = ({ navigation, route }) => {
  const { email } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);

    if (text && index < 3) inputRefs.current[index + 1].focus();
  };

  const handleVerify = async () => {
    const finalOtp = otp.join('');
    if (finalOtp.length < 4) {
      Alert.alert('Invalid', 'Please enter the complete 4-digit OTP');
      return;
    }

    try {
      const res = await verifyOtp({ email, otp: finalOtp });
      console.log("OTP Verify Response:", res.data);
      if (res?.data?.message) {
        await AsyncStorage.setItem('token', res.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        Alert.alert('Success', res.data.message, [
          { text: 'OK', onPress: () => navigation.navigate('MyTabs') },
        ]);
      } else {
        Alert.alert('Error', 'Unexpected response from server');
      }
    } catch (err) {
      console.log('OTP Verify Error:', err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.flex}>
        <CustomText weight="medium" style={styles.title}>Enter Code</CustomText>
      </View>

      <CustomText weight="medium" style={styles.description}>
        Enter the Four-digit code sent to your email.
      </CustomText>

      <View style={styles.otpRow}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            style={styles.emailInput}
            keyboardType="numeric"
            maxLength={1}
            value={value}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      <ThemeButton
        text="Confirm →"
        onPress={handleVerify}
        style={{ width: '100%', marginTop: 20 }}
      />


      <View style={styles.resendRow}>
        <CustomText weight="medium">Didn’t receive a code? </CustomText>
        <TouchableWithoutFeedback onPress={async () => {
          try {
            const { data } = await resendOtp({ email });
            Alert.alert("Success", data.message);
          } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Failed to resend OTP");
          }
        }}>
          <View>
            <CustomText weight="Bold" style={[styles.continueTxt, { fontWeight: 600 }]}>
              Resend
            </CustomText>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <CustomText weight="medium" style={[styles.description, { marginTop: 200 }]}>
        By continuing I accept Selfso's Terms of Use and
        <TouchableWithoutFeedback>
          <CustomText
            weight="bold"
            style={{
              fontWeight: 600,
              textDecorationLine: 'underline',
              color: '#000000ff',
            }}
          >
            {' '}
            Privacy Policy
          </CustomText>
        </TouchableWithoutFeedback>
      </CustomText>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 35,
    color: '#000',
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#646464',
    textAlign: 'center',
    width: '100%',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  emailInput: {
    width: 50,
    borderColor: '#ccc',
    backgroundColor: '#F0F5F5',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OTP;
