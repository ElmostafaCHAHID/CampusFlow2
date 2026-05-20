import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import api from '../api/client';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const WriteReportScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Media State
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const cats = response.data.data || response.data || [];
      if (cats.length > 0) {
        setCategories(cats);
        setCategoryId(cats[0].id);
      } else {
        Alert.alert('Notice', 'No categories available. Please contact support.');
      }
    } catch (e) {
      console.error('Categories fetch error:', e);
      Alert.alert('Error', 'Could not load categories. Check your connection.');
    } finally {
      setFetching(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      // Ensure fileName is set for proper FormData handling
      asset.fileName = asset.fileName || `photo_${Date.now()}.jpg`;
      setImage(asset);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      // Ensure fileName is set for proper FormData handling
      asset.fileName = asset.fileName || `video_${Date.now()}.mp4`;
      setVideo(asset);
    }
  };

  const pickAudio = async () => {
    if (Platform.OS === 'web') {
      alert('Audio attachment is not supported on web in this build.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
    });

    if (!result.canceled) {
      setAudio(result.assets[0]);
    }
  };

  const handlePublish = async () => {
    if (!title || !content || !categoryId) {
      const msg = 'Please fill in title, category, and content to post your article.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Missing Information', msg);
      return;
    }

    setLoading(true);
    try {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', content);
      formData.append('category_id', categoryId);

      if (image) {
        if (Platform.OS === 'web') {
          // For web, fetch the blob and create a File object
          const response = await fetch(image.uri);
          const blob = await response.blob();
          const file = new File([blob], image.fileName || 'photo.jpg', { type: blob.type || 'image/jpeg' });
          formData.append('cover_image', file);
        } else {
          formData.append('cover_image', {
            uri: image.uri,
            name: image.fileName || 'photo.jpg',
            type: 'image/jpeg',
          });
        }
      }

      if (video) {
        if (Platform.OS === 'web') {
          // For web, fetch the blob and create a File object
          const response = await fetch(video.uri);
          const blob = await response.blob();
          const file = new File([blob], video.fileName || 'video.mp4', { type: blob.type || 'video/mp4' });
          formData.append('video', file);
        } else {
          formData.append('video', {
            uri: video.uri,
            name: video.fileName || 'video.mp4',
            type: video.mimeType || 'video/mp4',
          });
        }
      }

      if (audio) {
        if (Platform.OS === 'web') {
          // Audio not fully supported on web, skip it
          console.warn('Audio upload not supported on web');
        } else {
          formData.append('audio', {
            uri: audio.uri,
            name: audio.name || 'audio.mp3',
            type: audio.mimeType || 'audio/mpeg',
          });
        }
      }

      const response = await api.post('/articles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const successMsg = 'Article posted successfully! 🎉';
      
      // Reset form
      setTitle('');
      setContent('');
      setImage(null);
      setVideo(null);
      setAudio(null);
      
      if (Platform.OS === 'web') {
        alert(successMsg);
        navigation.navigate('Home');
      } else {
        Alert.alert('Success', successMsg, [
          { text: 'View Feed', onPress: () => navigation.navigate('Home') }
        ]);
      }
    } catch (e) {
      console.error('Article publish error:', e);
      const errMsg = e.response?.data?.message || 'Failed to post article. Please try again.';
      if (Platform.OS === 'web') alert(errMsg);
      else Alert.alert('Error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Text style={styles.topBarTitle}>Compose Article</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.discardBtn}>
               <Text style={styles.discardText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mainContent}>
            {/* Article Details Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="document-text-outline" size={20} color="#3b82f6" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Article Details</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>TITLE</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="What's your article about?"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={150}
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.fieldLabel}>CATEGORY</Text>
                <View style={styles.categoryPillContainer}>
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryPill,
                        categoryId === cat.id && styles.categoryPillSelected
                      ]}
                      onPress={() => setCategoryId(cat.id)}
                    >
                      <Text style={[
                        styles.categoryPillText,
                        categoryId === cat.id && styles.categoryPillTextSelected
                      ]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Write Your Story Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="pencil-outline" size={20} color="#3b82f6" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Write Your Story</Text>
              </View>

              <View style={styles.editorContainer}>
                <TextInput
                  style={styles.editorInput}
                  placeholder="Share your thoughts, findings, or ideas..."
                  value={content}
                  onChangeText={setContent}
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Media Attachments Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="image-outline" size={20} color="#3b82f6" style={styles.cardIcon} />
                <Text style={styles.cardTitle}>Add Media</Text>
              </View>

              <View style={styles.mediaGrid}>
                <TouchableOpacity style={styles.mediaCard} onPress={pickImage}>
                  <Ionicons name="image-outline" size={32} color={image ? '#3b82f6' : '#cbd5e1'} />
                  <Text style={styles.mediaCardLabel}>Cover Image</Text>
                  {image && <Text style={styles.mediaCardStatus}>✓ Added</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.mediaCard} onPress={pickVideo}>
                  <Ionicons name="videocam-outline" size={32} color={video ? '#f43f5e' : '#cbd5e1'} />
                  <Text style={styles.mediaCardLabel}>Video</Text>
                  {video && <Text style={styles.mediaCardStatus}>✓ Added</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.mediaCard} onPress={pickAudio}>
                  <Ionicons name="musical-notes-outline" size={32} color={audio ? '#8b5cf6' : '#cbd5e1'} />
                  <Text style={styles.mediaCardLabel}>Audio</Text>
                  {audio && <Text style={styles.mediaCardStatus}>✓ Added</Text>}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.postBtn, loading && styles.postBtnDisabled]}
              onPress={handlePublish}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.postBtnText}>Post Article</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff4f8',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  topBar: {
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'web' ? 24 : 40,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  topBarTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -1.2,
  },
  discardBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fef2f2',
    borderRadius: 10,
  },
  discardText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },
  mainContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  inputGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
    marginBottom: 12,
    letterSpacing: 1.5,
  },
  textInput: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#f1f5f9',
  },
  categoryPillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  categoryPillSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  categoryPillText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '700',
  },
  categoryPillTextSelected: {
    color: '#3b82f6',
  },
  mediaActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    flexWrap: 'wrap',
    gap: 10,
  },
  imageAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imageActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
  },
  mediaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  mediaCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  mediaCardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
    textAlign: 'center',
  },
  mediaCardStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    marginTop: 6,
  },
  editorContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    minHeight: 250,
  },
  editorInput: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 26,
    flex: 1,
    fontWeight: '500',
  },
  finalPublishBtn: {
    backgroundColor: '#3b82f6',
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  finalPublishBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  postBtn: {
    backgroundColor: '#1f2937',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  postBtnDisabled: {
    opacity: 0.6,
  },
  postBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default WriteReportScreen;
