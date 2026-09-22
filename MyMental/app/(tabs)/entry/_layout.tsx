import React from 'react';
import { Stack } from 'expo-router';

import { NewEntryProvider } from '../../../src/context/NewEntryContext';

export default function EntryLayout() {
  return (
    <NewEntryProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </NewEntryProvider>
  );
}