import React from 'react';
import { Stack } from 'expo-router';

import { NewEntryProvider } from '../../../src/context/NewEntryContext';
import { JournalingPreferencesProvider } from '../../../src/context/JournalPreferencesContext';

export default function EntryLayout() {
  return (
    <JournalingPreferencesProvider>
      <NewEntryProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </NewEntryProvider>
    </JournalingPreferencesProvider>
  );
}