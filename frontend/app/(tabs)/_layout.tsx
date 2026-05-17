import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useFonts } from "expo-font";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../../global.css";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    MplusBlack: require("../../assets/font/MPLUSRounded1c-Black.ttf"),
    MplusExtraBold: require("../../assets/font/MPLUSRounded1c-ExtraBold.ttf"),
    MplusBold: require("../../assets/font/MPLUSRounded1c-Bold.ttf"),
    MplusMedium: require("../../assets/font/MPLUSRounded1c-Medium.ttf"),
    MplusRegular: require("../../assets/font/MPLUSRounded1c-Regular.ttf"),
    MplusLight: require("../../assets/font/MPLUSRounded1c-Light.ttf"),
    MplusThin: require("../../assets/font/MPLUSRounded1c-Thin.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",

        tabBarLabelStyle: {
          fontFamily: "MplusBold",
          fontSize: 12,
          marginTop: 2,
        },

        tabBarStyle: {
          position: "absolute",

          left: 0,
          right: 0,
          bottom: 0,

          backgroundColor: "white",

          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",

          elevation: 8,

          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,

          paddingTop: 6,

          // IMPORTANT
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,

          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
        },

        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="maps"
        options={{
          title: "Maps",
          tabBarIcon: ({ color }) => (
            <Feather name="map" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="export"
        options={{
          title: "Export",
          tabBarIcon: ({ color }) => (
            <Feather name="file" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}