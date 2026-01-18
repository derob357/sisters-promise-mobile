/**
 * Blog Screen - Company blog and news
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Header, Spinner, ErrorMessage } from '../components/CommonComponents';
import api from '../services/api';
import logger from '../utils/logger';

const BlogScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setError('');
      const response = await api.get('/api/blog/posts');
      if (response.data && response.data.success) {
        setPosts(response.data.posts || []);
      } else {
        // Use placeholder posts if API not available
        setPosts(getPlaceholderPosts());
      }
    } catch (err) {
      logger.error('Error loading blog posts:', err);
      // Use placeholder posts on error
      setPosts(getPlaceholderPosts());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getPlaceholderPosts = () => [
    {
      id: '1',
      title: 'Welcome to Sisters Promise',
      excerpt: 'Discover our journey of creating natural, handcrafted skincare products that nourish your skin and soul.',
      date: new Date().toISOString(),
      image: null,
      category: 'News',
    },
    {
      id: '2',
      title: 'The Benefits of Natural Ingredients',
      excerpt: 'Learn why we choose only the finest natural ingredients for our skincare products.',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      image: null,
      category: 'Education',
    },
    {
      id: '3',
      title: 'Skincare Tips for Every Season',
      excerpt: 'How to adapt your skincare routine as the seasons change for optimal skin health.',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      image: null,
      category: 'Tips',
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    loadBlogPosts();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Blog" />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && <ErrorMessage message={error} />}

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Latest Posts</Text>

          {posts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No blog posts available</Text>
            </View>
          ) : (
            posts.map((post, index) => (
              <TouchableOpacity
                key={post._id || post.id || `post-${index}`}
                style={styles.postCard}
                onPress={() => navigation.navigate('BlogDetail', { post })}
              >
                {post.image && (
                  <Image source={{ uri: post.image }} style={styles.postImage} />
                )}
                <View style={styles.postContent}>
                  <View style={styles.postMeta}>
                    <Text style={styles.postCategory}>{post.category}</Text>
                    <Text style={styles.postDate}>{formatDate(post.date)}</Text>
                  </View>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postExcerpt} numberOfLines={2}>
                    {post.excerpt}
                  </Text>
                  <Text style={styles.readMore}>Read More →</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#F0F0F0',
  },
  postContent: {
    padding: 16,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
    textTransform: 'uppercase',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  postExcerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});

export default BlogScreen;
