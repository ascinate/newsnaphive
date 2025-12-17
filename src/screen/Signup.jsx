import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


// components
import { registerUser } from "../API/API";
import CustomText from '../components/CustomText';
import ThemeButton from '../components/ThemeButton';
import Logo from '../components/Logo';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal'; //
// svg
import Igoogle from "../../assets/Igoogle.svg";
import Iapple from "../../assets/apple2.svg";
const Signup = ({ navigation }) => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const { width, height } = useWindowDimensions();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);



  const isValidEmail = (text) => /\S+@\S+\.\S+/.test(text);
  const isValidPhone = (text) => /^[0-9]{10,15}$/.test(text);


  const handleContinue = () => {
    if (!userID.trim()) {
      Alert.alert("Create account guide", "Please enter your email or phone number");
      return;
    }


    if (!isValidEmail(userID) && !isValidPhone(userID)) {
      Alert.alert("Create account guide", "Please enter a valid email or phone number");
      return;
    }


    if (!password.trim()) {
      Alert.alert("Create account guide", "Please create a password");
      return;
    }


    registerUser({
      name: userID.split("@")[0],
      email: userID,
      password,
    })
      .then((res) => {
        console.log("Register Response:", res.data);
        if (res.data && res.data.message.includes("OTP sent")) {
          Alert.alert("Success", "OTP sent to your email", [
            { text: "OK", onPress: () => navigation.navigate("OTP", { email: userID }) },
          ]);
        } else {
          Alert.alert("Error", res.data.message || "Something went wrong");
        }
      })
      .catch((err) => {
        console.log("Register error:", err.response?.data || err.message);
        Alert.alert("Error", err.response?.data?.message || "Registration failed");
      });
  };
  return (
    <SafeAreaProvider style={[styles.container, { padding: 20 }]}>


      <Logo />


      {/* Description */}
      <CustomText weight='medium' style={[styles.description, { paddingInline: 32 }]}>
        Automatically share photos taken by members of your group
      </CustomText>


      {/* Email or Phone Field */}
      <View style={{ width: '100%', marginTop: 20 }}>


        <TextInput
          style={styles.input}
          value={userID}
          onChangeText={setUserID}
          placeholder='Enter your email or phone number'
          keyboardType='email-address'
          autoCapitalize='none'
        />
      </View>


      {/* Password Field */}
      <View style={{ width: '100%', marginTop: 20 }}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder='Create your password'
          secureTextEntry={true}
        />
      </View>


      {/* Continue Button */}
      <ThemeButton
        text="Sign up →"
        onPress={handleContinue}
        style={{ width: '100%', marginTop: 20 }}
      />


      {/* OR line */}
      <View style={styles.orLine}>
        <View style={[styles.line, { width: width * 0.35 }]} />
        <CustomText weight='medium' style={[styles.text, { fontSize: 16 }]}>Or</CustomText>
        <View style={[styles.line, { width: width * 0.35 }]} />
      </View>


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
              marginBottom: 10,
              borderWidth:1,
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


      {/* Already a user */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <CustomText weight='medium' style={{}}>Already have an account ? </CustomText>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
          <View>
            <CustomText
              weight="bold"
              style={[styles.continueTxt, { fontWeight: '500', color: '#111a94' }]}>
              Log in
            </CustomText>
          </View>
        </TouchableWithoutFeedback>
      </View>


      {/* Terms & Privacy */}


      <CustomText weight='medium' style={[styles.description, { position: 'absolute', bottom: 20, textAlign: 'center', fontSize: 14 }]}>
        By continuing I accept Selfso's Terms of Use and
        <TouchableWithoutFeedback onPress={() => setShowPrivacyModal(true)}>
          <CustomText
            weight='medium'
            style={[
              styles.continueTxt,
              {
                fontWeight: '600',
                textDecorationLine: 'underline',
                color: '#000',
              },
            ]}
          >
            {' '}Privacy Policy
          </CustomText>
        </TouchableWithoutFeedback>
      </CustomText>
      <PrivacyPolicyModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#646464',
    textAlign: 'center',
    width: '100%',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 21,
    fontSize: 16,
    textAlign: 'left',
    paddingLeft: 27,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    width: '100%',
    marginTop: 21,
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
  line: {
    height: 1,
    backgroundColor: '#ccc',
  },
  text: {
    marginHorizontal: 10,
    color: '#000',
  },
});


export default Signup;
