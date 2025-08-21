import React from 'react';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

const BlurredBackground = (props: BottomSheetBackdropProps) => {
  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close" 
      style={styles.blurView}
    >
      <BlurView tint="systemThickMaterialDark" blurReductionFactor={1} experimentalBlurMethod="none" intensity={100} style={styles.blurView} />
    </BottomSheetBackdrop>
  );
};

const styles = StyleSheet.create({ blurView: { ...StyleSheet.absoluteFillObject, }, container: { ...StyleSheet.absoluteFillObject, borderTopLeftRadius: 10, borderTopRightRadius: 10, overflow: 'hidden', }, });

export default BlurredBackground;
