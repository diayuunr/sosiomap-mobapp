import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useFonts } from "expo-font";
import "../global.css";

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    MplusBlack: require("../assets/font/MPLUSRounded1c-Black.ttf"),
    MplusExtraBold: require("../assets/font/MPLUSRounded1c-ExtraBold.ttf"),
    MplusBold: require("../assets/font/MPLUSRounded1c-Bold.ttf"),
    MplusMedium: require("../assets/font/MPLUSRounded1c-Medium.ttf"),
    MplusRegular: require("../assets/font/MPLUSRounded1c-Regular.ttf"),
    MplusLight: require("../assets/font/MPLUSRounded1c-Light.ttf"),
    MplusThin: require("../assets/font/MPLUSRounded1c-Thin.ttf"),
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
          marginTop: 0,
        },

        tabBarStyle: {
          position: "absolute",

          bottom: 40,
          marginHorizontal: 20,

          paddingTop: 7,
          paddingBottom: 7,

          elevation: 0,

          backgroundColor: "white",

          borderRadius: 100,

          height: 70,

          borderTopWidth: 0,

          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="maps"
        options={{
          title: "Maps",
          tabBarIcon: ({ color }) => (
            <Feather name="map" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="export"
        options={{
          title: "Export",
          tabBarIcon: ({ color }) => (
            <Feather name="file" size={24} color={color} />
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