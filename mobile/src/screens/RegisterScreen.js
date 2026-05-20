import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      const msg = 'Please fill all academic identification fields.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Incomplete Data', msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Verification Error', msg);
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, confirmPassword);
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.message || 'Registration failed. Identity may already exist.';
      if (Platform.OS === 'web') alert(msg); else Alert.alert('Registration Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>CampusFlow</Text>
          <Text style={styles.subtitle}>Create Professional Identity</Text>
        </View>

        <View style={styles.form}>
           <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Legal Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. John Doe"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>University Email</Text>
            <TextInput
              style={styles.input}
              placeholder="name@university.edu"
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Verify Security Token</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register Identity</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              Already registered? <Text style={styles.loginHighlight}>Login to Dashboard</Text>
            </Text>
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
  scrollContent: {
    padding: 30,
    paddingBottom: 60,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: Platform.OS === 'web' ? 20 : 0,
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
  form: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 450 : '100%',
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 16,
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
    marginTop: 20,
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
  loginLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  loginText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '500',
  },
  loginHighlight: {
    color: '#3b82f6',
    fontWeight: '700',
  },
});

export default RegisterScreen;
