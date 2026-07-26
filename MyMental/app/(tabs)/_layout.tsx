import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../src/constants/theme";

type TabIconProps = {
  icon: keyof typeof Ionicons.glyphMap;
  outlineIcon: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
};

function TabIcon({
  icon,
  outlineIcon,
  label,
  focused,
}: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={focused ? icon : outlineIcon}
        size={22}
        color={focused ? colors.coral : colors.mutedLight}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="home"
              outlineIcon="home-outline"
              label="Home"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="book"
              outlineIcon="book-outline"
              label="Journal"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="analytics"
              outlineIcon="analytics-outline"
              label="Insights"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="resources"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="library"
              outlineIcon="library-outline"
              label="Resources"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon="person"
              outlineIcon="person-outline"
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 72,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabLabel: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.mutedLight,
  },
  tabLabelActive: {
    color: colors.coral,
  },
});