import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, spacing } from '../../src/constants/theme';
import { createEntry } from '../../src/firebase/firestore';

export default function ProfileScreen() {
  const testFirebase = async () => {
    try {
      const id = await createEntry({
        title: 'Firebase Test',
        body: 'This is my first Firestore entry!',
        mood: 'Happy',
        energy: 8,
        createdAt: new Date(),
      });

      console.log('Created entry:', id);
      Alert.alert('Success', `Entry created!\nID: ${id}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create entry.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <Button
          title="Test Firebase"
          onPress={testFirebase}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.ink,
  },
});