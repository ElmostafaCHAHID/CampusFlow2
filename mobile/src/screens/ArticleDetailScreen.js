import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator, Image, Platform, Linking } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const ArticleDetailScreen = ({ navigation, route }) => {
  const { article } = route.params;
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchArticleDetails();
  }, []);

  const fetchArticleDetails = async () => {
    try {
      const response = await api.get(`/articles/${article.id}`);
      const data = response.data.data || response.data;
      // Get comments for this article
      const commentsResponse = await api.get(`/articles/${article.id}/comments`);
      setComments(commentsResponse.data.data || []);
    } catch (e) {
      console.error('Error fetching details:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to like articles.');
      return;
    }

    try {
      if (liked) {
        await api.delete(`/articles/${article.id}/like`);
        setLiked(false);
      } else {
        await api.post(`/articles/${article.id}/like`);
        setLiked(true);
      }
    } catch (e) {
      console.error('Like error:', e);
      Alert.alert('Error', 'Could not process like.');
    }
  };

  const handleComment = () => {
    Alert.prompt(
      'Add Comment',
      'Write your comment:',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Post',
          onPress: async (comment) => {
            if (!comment.trim()) return;
            try {
              await api.post(`/articles/${article.id}/comments`, {
                body: comment
              });
              Alert.alert('Success', 'Comment posted!');
              fetchArticleDetails();
            } catch (e) {
              console.error('Comment error:', e);
              Alert.alert('Error', 'Could not post comment.');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#3b82f6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category & Date */}
        <View style={styles.metaContainer}>
          <View style={styles.categoryContainer}>
            <View style={styles.categoryDot} />
            <Text style={styles.categoryBadge}>{article.category?.name || 'General'}</Text>
          </View>
          <Text style={styles.date}>{new Date(article.created_at).toLocaleDateString()}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{article.title}</Text>

        {/* Cover Image */}
        {article.cover_image_url && (
          <Image
            source={{ uri: article.cover_image_url }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        )}

        {/* Author Info */}
        <View style={styles.authorContainer}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarChar}>{(article.user?.name || 'A')[0]}</Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{article.user?.name || 'Academic Writer'}</Text>
            <Text style={styles.authorEmail}>{article.user?.email || ''}</Text>
          </View>
        </View>

        {/* Article Body */}
        <View style={styles.bodyContainer}>
          <Text style={styles.body}>{article.body || article.content}</Text>
        </View>

        {/* Video Section */}
        {article.video_url && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>📹 Video</Text>
            <TouchableOpacity 
              style={styles.videoPlaceholder}
              onPress={() => Linking.openURL(article.video_url)}
            >
              <Ionicons name="play-circle" size={60} color="#f43f5e" />
              <Text style={styles.videoText}>Tap to play video</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Audio Section */}
        {article.audio_url && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>🎵 Audio</Text>
            <TouchableOpacity 
              style={styles.audioPlaceholder}
              onPress={() => Linking.openURL(article.audio_url)}
            >
              <Ionicons name="play" size={40} color="#8b5cf6" />
              <Text style={styles.audioText}>Tap to play audio</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>💬 Comments ({comments.length})</Text>
          {comments.length === 0 ? (
            <Text style={styles.noComments}>No comments yet. Be the first!</Text>
          ) : (
            comments.map((comment, index) => (
              <View key={index} style={styles.commentCard}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarChar}>{(comment.user?.name || 'U')[0]}</Text>
                </View>
                <View style={styles.commentContent}>
                  <Text style={styles.commentAuthor}>{comment.user?.name || 'User'}</Text>
                  <Text style={styles.commentText}>{comment.body}</Text>
                  <Text style={styles.commentDate}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.spacing} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={[styles.actionBtn, liked && styles.actionBtnActive]}
          onPress={handleLike}
        >
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={24} 
            color={liked ? "#ef4444" : "#64748b"} 
          />
          <Text style={[styles.actionLabel, liked && styles.actionLabelActive]}>
            Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={handleComment}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#64748b" />
          <Text style={styles.actionLabel}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, saved && styles.actionBtnActive]}
          onPress={() => setSaved(!saved)}
        >
          <Ionicons 
            name={saved ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={saved ? "#f59e0b" : "#64748b"} 
          />
          <Text style={[styles.actionLabel, saved && styles.actionLabelActive]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff4f8',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginRight: 8,
  },
  categoryBadge: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 20,
    lineHeight: 36,
    letterSpacing: -0.8,
  },
  coverImage: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: '#f1f5f9',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarChar: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  authorEmail: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  bodyContainer: {
    marginBottom: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 28,
    color: '#475569',
  },
  mediaSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f43f5e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#f43f5e',
  },
  audioPlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  commentsSection: {
    marginBottom: 24,
  },
  noComments: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  commentCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarChar: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3b82f6',
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  commentText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 4,
    lineHeight: 20,
  },
  commentDate: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  spacing: {
    height: 40,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionBtnActive: {
    // Light background for active state
  },
  actionLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  actionLabelActive: {
    color: '#3b82f6',
    fontWeight: '800',
  },
});

export default ArticleDetailScreen;
