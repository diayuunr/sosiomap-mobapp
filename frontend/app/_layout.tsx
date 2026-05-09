import { Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",

        tabBarStyle: {
          position: "absolute",

          bottom: 25,
          marginHorizontal: 40,

          paddingTop: 10,
          paddingBottom: 10,

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
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="maps"
        options={{
          title: "Maps",
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="export"
        options={{
          title: "Export",
          tabBarIcon: ({ color, size }) => (
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
