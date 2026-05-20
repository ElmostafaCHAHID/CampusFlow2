import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, RefreshControl, TextInput, Platform, Alert, Image } from 'react-native';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [savedArticles, setSavedArticles] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles');
      setArticles(response.data.data.data || response.data.data || []);
    } catch (e) {
      console.error('Error fetching articles:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchArticles();
  };

  const handleLike = async (articleId) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to like articles.');
      return;
    }

    try {
      if (likedArticles.has(articleId)) {
        await api.delete(`/articles/${articleId}/like`);
        setLikedArticles(prev => {
          const newSet = new Set(prev);
          newSet.delete(articleId);
          return newSet;
        });
      } else {
        await api.post(`/articles/${articleId}/like`);
        setLikedArticles(prev => new Set(prev).add(articleId));
      }
      // Refresh to get updated like count
      fetchArticles();
    } catch (e) {
      console.error('Like error:', e);
      Alert.alert('Error', 'Could not process like.');
    }
  };

  const handleComment = (articleId) => {
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
              await api.post(`/articles/${articleId}/comments`, {
                body: comment
              });
              Alert.alert('Success', 'Comment posted!');
              fetchArticles();
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

  const handleSave = (articleId) => {
    if (savedArticles.has(articleId)) {
      setSavedArticles(prev => {
        const newSet = new Set(prev);
        newSet.delete(articleId);
        return newSet;
      });
      Alert.alert('Removed', 'Article removed from saved.');
    } else {
      setSavedArticles(prev => new Set(prev).add(articleId));
      Alert.alert('Saved', 'Article saved successfully!');
    }
  };

  const handleArticleClick = (article) => {
    navigation.navigate('ArticleDetail', { article });
  };

  const filteredArticles = articles.filter(item => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.category?.name || '').toLowerCase().includes(q) ||
      (item.user?.name || '').toLowerCase().includes(q)
    );
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleArticleClick(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardTop}>
        <View style={styles.categoryContainer}>
          <View style={styles.categoryDot} />
          <Text style={styles.categoryBadge}>{item.category?.name || 'General'}</Text>
        </View>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>

      <Text style={styles.title}>{item.title}</Text>
      
      {/* Cover Image Display */}
      {item.cover_image_url && (
        <Image
          source={{ uri: item.cover_image_url }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}

      {/* Media Indicator Row */}
      <View style={styles.mediaRow}>
        {item.cover_image_url && (
          <Ionicons name="image" size={16} color="#3b82f6" style={styles.mediaMiniIcon} />
        )}
        {item.video_url && (
          <Ionicons name="videocam" size={16} color="#f43f5e" style={styles.mediaMiniIcon} />
        )}
        {item.audio_url && (
          <Ionicons name="musical-notes" size={16} color="#8b5cf6" style={styles.mediaMiniIcon} />
        )}
        {(item.cover_image_url || item.video_url || item.audio_url) && (
          <Text style={styles.mediaText}>Has Media</Text>
        )}
      </View>

      <Text style={styles.excerpt} numberOfLines={3}>{item.body || item.content}</Text>
      
      {/* Author Section */}
      <View style={styles.footer}>
        <View style={styles.authorGroup}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarChar}>{(item.user?.name || 'A')[0]}</Text>
          </View>
          <View>
            <Text style={styles.author}>{item.user?.name || 'Academic Writer'}</Text>
            <Text style={styles.authorTime}>Just now</Text>
          </View>
        </View>
      </View>

      {/* Interaction Row */}
      <View style={styles.interactionRow}>
        <TouchableOpacity 
          style={[styles.interactionBtn, likedArticles.has(item.id) && styles.interactionBtnActive]}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons 
            name={likedArticles.has(item.id) ? "heart" : "heart-outline"} 
            size={18} 
            color={likedArticles.has(item.id) ? "#ef4444" : "#64748b"} 
          />
          <Text style={[styles.interactionLabel, likedArticles.has(item.id) && styles.interactionLabelActive]}>
            {item.likes_count || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.interactionBtn}
          onPress={() => handleComment(item.id)}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={18} 
            color="#64748b" 
          />
          <Text style={styles.interactionLabel}>
            {item.comments_count || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.interactionBtn, savedArticles.has(item.id) && styles.interactionBtnActive]}
          onPress={() => handleSave(item.id)}
        >
          <Ionicons 
            name={savedArticles.has(item.id) ? "bookmark" : "bookmark-outline"} 
            size={18} 
            color={savedArticles.has(item.id) ? "#f59e0b" : "#64748b"} 
          />
          <Text style={[styles.interactionLabel, savedArticles.has(item.id) && styles.interactionLabelActive]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainHeader}>
        <View style={styles.branding}>
          <Text style={styles.brandingLogo}>CampusFlow</Text>
          <Text style={styles.brandingSub}>Discover academic insights</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerAvatar} 
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Text style={styles.avatarInitial}>{(user?.name || 'U')[0].toLowerCase()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInputField}
            placeholder="Search articles..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <FlatList
        data={filteredArticles}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.feedList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#3b82f6" />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyStateText}>No articles yet. Be the first to post!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff4f8', // Matching the light blueish background in screenshot
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'web' ? 20 : 15,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  branding: {
    flex: 1,
  },
  brandingLogo: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: -1.5,
  },
  brandingSub: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginTop: -2,
  },
  headerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarInitial: {
    color: '#3b82f6',
    fontWeight: '700',
    fontSize: 18,
  },
  searchBox: {
    paddingHorizontal: 25,
    paddingBottom: 25,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 54,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInputField: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  feedList: {
    padding: 20,
    paddingBottom: 40,
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 14,
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
    fontSize: 13,
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
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 12,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  coverImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#f1f5f9',
  },
  mediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  mediaMiniIcon: {
    marginRight: 6,
  },
  mediaText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginLeft: 2,
  },
  excerpt: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 26,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  authorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarChar: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  author: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },
  authorTime: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 2,
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  interactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  interactionBtnActive: {
    backgroundColor: '#fef2f2',
  },
  interactionLabel: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  interactionLabelActive: {
    color: '#ef4444',
  },
  readMore: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  readMoreText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    color: '#64748b',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  emptyStateText: {
    color: '#94a3b8',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
  },
});

export default HomeScreen;
