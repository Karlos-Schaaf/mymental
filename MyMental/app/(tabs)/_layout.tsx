import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fonts } from "../../src/constants/theme";

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
        size={30}
        paddingTop={1}
        color={focused ? colors.coral : colors.mutedLight}
      />

      <Text
        numberOfLines={1}
        style={[
          styles.tabLabel,
          focused && styles.tabLabelActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}


export default function TabsLayout() {
  return (
    <SafeAreaView
  style={{ flex: 1, backgroundColor: colors.white }}
  edges={["bottom"]}
>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: {
            flex: 1,
          },
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
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 55, // Increased height to accommodate multi-line text
    paddingTop: 20,
    paddingBottom: 0,
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
    minWidth: 200,
    },

  tabLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    marginTop: 5,
    color: colors.mutedLight,
    textAlign: "center",
    overflow: "visible",
    position: "relative",
    zIndex: 1,
  },

  tabLabelActive: {
    color: colors.coral,
  },
});