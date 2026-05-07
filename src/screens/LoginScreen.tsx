import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../stores'
import { login } from '../stores/authSlice'
import { ArrowRight, EyeClosed, EyeOff, Library, LockKeyhole, LucideMove, Server, User } from 'lucide-react-native'

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const status = useSelector((state: RootState) => state.auth.status)
  const error = useSelector((state: RootState) => state.auth.error)

  const [serverUrl, setServerUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [secure, setSecure] = useState(true)

  const handleLogin = () => {
    if (!serverUrl || !username || !password) return
    dispatch(login({ serverUrl, username, password }))
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Background Glow Effects */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Library  size={40} color="white" />
        </View>

        <Text style={styles.appTitle}>VIBE</Text>
        <Text style={styles.tagline}>Sound on. World off.</Text>
      </View>

      {/* Login Card */}
      <View style={styles.card}>

        {error ? (
          <View style={{ backgroundColor: 'rgba(255,0,0,0.1)', padding: 10, borderRadius: 8, marginBottom: 15 }}>
            <Text style={{ color: '#ff4444', textAlign: 'center' }}>{error}</Text>
          </View>
        ) : null}

        {/* Server URL */}
        <Text style={styles.label}>Server URL</Text>
        <View style={styles.inputContainer}>
          <Server size={20} color="#888" />
          <TextInput
            placeholder="http://your-jellyfin-server:8096"
            placeholderTextColor="#555"
            style={styles.input}
            value={serverUrl}
            onChangeText={setServerUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Username */}
        <Text style={[styles.label, { marginTop: 20 }]}>Username</Text>
        <View style={styles.inputContainer}>
          <User size={20} color="#888" />
          <TextInput
            placeholder="Enter your username"
            placeholderTextColor="#555"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={{ marginTop: 20 }}>
          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </View>

          <View style={styles.inputContainer}>
            <LockKeyhole size={20} color="#888" />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#555"
              secureTextEntry={secure}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)}>
              {secure ? <EyeOff size={20}
                color="#888"/> : <EyeClosed size={20}
                color="#888"/>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.loginText}>Login</Text>
              <ArrowRight size={18} color="white" />
            </>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
          <View style={styles.line} />
        </View>

        {/* Social Buttons */}
        {/* <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <LucideMove size={20} color="white" />
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View> */}
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        Don’t have an account?
        <Text style={styles.signUp}> Sign Up</Text>
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    padding: 20,
    paddingTop: 80,
  },

  bgCircleTop: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    backgroundColor: '#b90df2',
    opacity: 0.15,
    borderRadius: 150,
  },

  bgCircleBottom: {
    position: 'absolute',
    bottom: -120,
    right: -120,
    width: 300,
    height: 300,
    backgroundColor: '#3d0df2',
    opacity: 0.1,
    borderRadius: 150,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logoBox: {
    width: 70,
    height: 70,
    backgroundColor: '#b90df2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#b90df2',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },

  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 15,
  },

  tagline: {
    color: '#aaa',
    marginTop: 5,
  },

  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 20,
  },

  label: {
    color: '#ccc',
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 15,
    borderRadius: 12,
  },

  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 14,
    marginLeft: 10,
  },

  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  forgot: {
    color: '#b90df2',
    fontSize: 12,
  },

  loginButton: {
    marginTop: 25,
    backgroundColor: '#b90df2',
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },

  dividerText: {
    color: '#666',
    fontSize: 10,
    marginHorizontal: 10,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  socialButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 5,
  },

  socialIcon: {
    width: 18,
    height: 18,
  },

  socialText: {
    color: 'white',
    fontWeight: '500',
  },

  footerText: {
    marginTop: 30,
    color: '#aaa',
  },

  signUp: {
    color: '#b90df2',
    fontWeight: 'bold',
  },
})