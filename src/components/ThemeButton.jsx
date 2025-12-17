import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from './CustomText';

const ThemeButton = ({ text, icon, onPress, style, textStyle, iconPosition = 'left' }) => {
  return (
    <LinearGradient
      colors={['#DA3C84', '#FEE8A3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1.6, y: 0 }}
      style={[styles.continueBtn, style]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <View style={styles.content}>
          {/* Optional icon on the left */}
          {icon && iconPosition === 'left' && <View style={styles.icon}>{icon}</View>}

          {/* Button text */}
          <CustomText weight="Bold" style={[styles.continueTxt, textStyle]}>
            {text}
          </CustomText>

          {/* Optional icon on the right */}
          {icon && iconPosition === 'right' && <View style={styles.icon}>{icon}</View>}
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  continueBtn: {
    borderRadius: 12,
    width: '100%',
    marginVertical: 21,
    overflow: 'hidden',
  },
  touchable: {
    paddingVertical: 21,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // space between icon and text
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default ThemeButton;
