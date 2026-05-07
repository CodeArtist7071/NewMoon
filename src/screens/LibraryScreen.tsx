import React from "react";
import { TopTabNavigator } from "../navigation/TopTabNavigator";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { Factory, Play, Plus, Search } from "lucide-react-native";

export const LibraryScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcVWSM3dUw8TiBjgfCGIWybsb9019xq5el21HfcAj9rtGqCgq4bBgriLDIIPETz1gYCcN5RuohmgyhsjBhRkWnorqpTFQYKihXC9s_zRfrDyEX-JOhi7bUY0nQsPav5LG7pTa8Sj7zVg5lWJ0tnRkH1zQdDjGSOnmELzh3J89IDiUr4qVEmBpj2VmlF_-49LXWF1qiV81P6ELYFYtIlVbnlRlwSKFLsIfFOoQ7fEIl-VqJjSro4vbRwJGdgm9DkYsKCVwzq_LJXZJd",
            }}
            style={styles.avatar}
          />
          <Text style={styles.title}>Your Library</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Search size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("CreatePlaylist")}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Liked Songs Card */}
      <View
        // colors={["#b90df2", "#700694"]}
        style={styles.likedCard}
      >
        <View>
          <View style={styles.row}>
            <Factory size={20} color="#fff" />
            <Text style={styles.likedTitle}>Liked Songs</Text>
          </View>
          <Text style={styles.likedSub}>
            Offline Available
          </Text>
        </View>

        <TouchableOpacity style={styles.playButton}>
          <Play size={20} color="#b90df2" />
        </TouchableOpacity>
      </View>

      {/* Top Tabs */}
      <View style={{ flex: 1 }}>
        <TopTabNavigator />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#120814",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  likedCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  likedTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
  },
  likedSub: {
    color: "#ddd",
    marginTop: 4,
  },
  playButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
  },
});
