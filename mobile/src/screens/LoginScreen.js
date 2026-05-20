import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      if (Platform.OS === 'web') {
        alert('Please enter email and password');
      } else {
        Alert.alert('Error', 'Please enter email and password');
      }
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.message || 'Invalid credentials or server error.';
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert('Login Failed', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>CampusFlow</Text>
          <Text style={styles.subtitle}>Mobile Academic Portal</Text>
          
          <TouchableOpacity 
            style={styles.topRegisterLink}
            onPress={() => navigation.navigate('Register')}
          >
             <Text style={styles.topRegisterText}>Don't have an account? <Text style={{fontWeight: '900'}}>Register</Text></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. professor@campus.edu"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Security Token / Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Log Into Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 30,
    paddingBottom: 100, // Extra padding to ensuring scrolling
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: Platform.OS === 'web' ? 40 : 20,
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    color: '#3b82f6',
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '500',
  },
  topRegisterLink: {
    marginTop: 15,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  topRegisterText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  form: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 450 : '100%',
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 60,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  button: {
    height: 60,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 12,
  },
  registerButton: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  registerButtonText: {
    color: '#3b82f6',
    fontSize: 18,
    fontWeight: '800',
  },
});

export default LoginScreen;
