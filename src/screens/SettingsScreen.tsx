import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowBigLeft, ArrowRight, AudioLines, Bell, LogOut, MoveRight, Music, Palette } from 'lucide-react-native';
import SleepTimer from '../components/SleepTimer';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores';
import { logout } from '../stores/authSlice';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(true);
  const [newMusic, setNewMusic] = useState(true);
  const navigation = useNavigation<any>();
  const [followerActivity, setFollowerActivity] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);

  const [wifiQuality, setWifiQuality] = useState('Very High (320kbps)');
  const [cellularQuality, setCellularQuality] = useState('Normal');
  const [sleepTimerVisible, setSleepTimerVisible] = useState(false);

  // Redux state to display active timer value in the Settings Menu
  const { sleepTimerDuration } = useSelector((state: RootState) => state.player);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowBigLeft size={24} color="#b90df2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Profile */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: 'https://i.pravatar.cc/150',
            }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Julian Sterling</Text>
            <Text style={styles.profileEmail}>julian.s@streaming.io</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Premium Plus</Text>
            </View>
          </View>
          <MoveRight size={24} color="#888" />
        </View>

        {/* Audio Quality */}
        <SectionTitle icon={<AudioLines color={"white"} size={15}/>} title="Audio Quality" />

        <SettingBox label="Streaming on WiFi" value={wifiQuality} />
        <SettingBox label="Streaming on Cellular" value={cellularQuality} />

        {/* Playback */}
        <SectionTitle icon={<Music color={"white"} size={15}/>} title={"Playback"} />

        <TouchableOpacity style={styles.row} onPress={() => setSleepTimerVisible(true)}>
          <Text style={styles.rowTitle}>Sleep Timer</Text>
          <View style={styles.rowRight}>
            <Text style={styles.rowValue}>{sleepTimerDuration ? `${sleepTimerDuration}m` : 'Off'}</Text>
            <ArrowRight size={20} color="#888" />
          </View>
        </TouchableOpacity>

        {/* Theme Customization */}
        <SectionTitle icon={<Palette color={"white"} size={15}/>} title="Theme Customization" />

        <View style={styles.row}>
          <Text style={styles.rowTitle}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor="#fff"
            trackColor={{ true: '#b90df2' }}
          />
        </View>

        {/* Notifications */}
        <SectionTitle icon={<Bell color={"white"} size={15}/>} title="Notifications" />

        <ToggleRow
          title="New Music"
          subtitle="Alerts for your followed artists"
          value={newMusic}
          onChange={setNewMusic}
        />

        <ToggleRow
          title="Follower Activity"
          subtitle="When friends follow your playlists"
          value={followerActivity}
          onChange={setFollowerActivity}
        />

        <ToggleRow
          title="App Updates"
          subtitle="New features and exclusive offers"
          value={appUpdates}
          onChange={setAppUpdates}
        />

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => dispatch(logout())}>
          <LogOut size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          Music Stream v4.12.0 (Build 829)
        </Text>
      </ScrollView>

      <SleepTimer visible={sleepTimerVisible} onClose={() => setSleepTimerVisible(false)} />
    </SafeAreaView>
  );
};

export default SettingsScreen;

const SectionTitle = ({ icon, title }: any) => (
  <View style={styles.sectionTitle}>
    <Text>{icon}</Text>
    <Text style={styles.sectionText}>{title}</Text>
  </View>
);

const SettingBox = ({ label, value }: any) => (
  <TouchableOpacity style={styles.settingBox}>
    <Text style={styles.rowTitle}>{label}</Text>
    <View style={styles.rowRight}>
      <Text style={styles.rowValue}>{value}</Text>
      <MoveRight size={20} color="#888" />
    </View>
  </TouchableOpacity>
);

const ToggleRow = ({ title, subtitle, value, onChange }: any) => (
  <View style={styles.row}>
    <View>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ true: '#b90df2' }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1022',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a1630',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileEmail: {
    fontSize: 13,
    color: '#aaa',
  },
  badge: {
    backgroundColor: '#b90df2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
    gap: 8,
  },
  sectionText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingBox: {
    backgroundColor: '#2a1630',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    backgroundColor: '#2a1630',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  rowSubtitle: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    color: '#aaa',
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: '#b90df2',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 30,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginTop: 20,
  },
});