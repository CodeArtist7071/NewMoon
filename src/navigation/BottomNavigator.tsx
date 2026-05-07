import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import HomeScreen from "../screens/HomeScreen";
import  SettingsScreen  from "../screens/SettingsScreen";
import { LibraryScreen } from "../screens/LibraryScreen";
import TrackList from "../components/TrackList";

import { 
  Home, 
  Music, 
  Library, 
  Settings 
} from "lucide-react-native";

export const BottomNavigator = () => {
  const Bottom = createBottomTabNavigator();

  return (
    <Bottom.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#111",
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Home":
              return <Home size={size} color={color} />;
            case "Songs":
              return <Music size={size} color={color} />;
            case "Library":
              return <Library size={size} color={color} />;
            case "Settings":
              return <Settings size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Bottom.Screen name="Home" component={HomeScreen} />
      <Bottom.Screen name="Songs" component={TrackList} />
      <Bottom.Screen name="Library" component={LibraryScreen} />
      <Bottom.Screen name="Settings" component={SettingsScreen} />
    </Bottom.Navigator>
  );
};
