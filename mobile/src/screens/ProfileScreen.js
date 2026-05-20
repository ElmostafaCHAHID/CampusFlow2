import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, Platform } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (!user) return;
      const response = await api.get(`/users/${user.id}/profile`);
      setProfileData(response.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.identityHeader}>
          <View style={styles.avatarLargeContainer}>
            <View style={styles.avatarLargeCircle}>
              <Text style={styles.avatarLargeInitial}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
            <TouchableOpacity style={styles.avatarCameraBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.identityName}>{user?.name || 'Academic Scholar'}</Text>
          <Text style={styles.identityEmail}>{user?.email}</Text>
          
          <View style={styles.identityRoleBadge}>
            <Text style={styles.identityRoleText}>{user?.role?.toUpperCase() || 'STUDENT'}</Text>
          </View>
        </View>

        <View style={styles.metricsCard}>
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{profileData?.user?.articles_count || 0}</Text>
            <Text style={styles.metricLabel}>PAPERS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{profileData?.user?.followers_count || 0}</Text>
            <Text style={styles.metricLabel}>FOLLOWERS</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricBox}>
            <Text style={styles.metricValue}>{profileData?.user?.following_count || 0}</Text>
            <Text style={styles.metricLabel}>FOLLOWING</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>ENGAGEMENT</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Write')}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="add" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.menuItemLabel}>Compose New Paper</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#f0fdf4' }]}>
              <Ionicons name="bookmark" size={20} color="#22c55e" />
            </View>
            <Text style={styles.menuItemLabel}>Saved Collections</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>PREFERENCES</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#fff7ed' }]}>
              <Ionicons name="settings-sharp" size={20} color="#f97316" />
            </View>
            <Text style={styles.menuItemLabel}>Account Settings</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { marginTop: 10 }]} onPress={handleLogout}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#fef2f2' }]}>
              <Ionicons name="log-out" size={20} color="#ef4444" />
            </View>
            <Text style={[styles.menuItemLabel, { color: '#ef4444' }]}>Sign Out</Text>
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
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  identityHeader: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  avatarLargeContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarLargeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  avatarLargeInitial: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
  },
  avatarCameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1e293b',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  identityName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -1,
  },
  identityEmail: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  identityRoleBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 15,
  },
  identityRoleText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 1.5,
  },
  metricsCard: {
    flexDirection: 'row',
    marginHorizontal: 25,
    marginVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 25,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 3,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  metricDivider: {
    width: 1,
    height: '50%',
    backgroundColor: '#f1f5f9',
    alignSelf: 'center',
  },
  menuSection: {
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#cbd5e1',
    marginBottom: 20,
    letterSpacing: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },
});

export default ProfileScreen;
