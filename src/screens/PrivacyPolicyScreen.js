/**
 * Privacy Policy Screen
 */

import React from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Header } from '../components/CommonComponents';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Privacy Policy" onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: January 15, 2026</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.sectionText}>
          Sister's Promise ("we," "our," or "us") respects your privacy and is committed to protecting
          your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you visit our mobile application.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.sectionSubtitle}>Account Information</Text>
        <Text style={styles.sectionText}>
          When you create an account, we collect your name, email address, and phone number. You can
          choose to provide additional information such as your address for shipping purposes.
        </Text>

        <Text style={styles.sectionSubtitle}>Transaction Information</Text>
        <Text style={styles.sectionText}>
          We collect information about your purchases, including items purchased, quantity, price,
          and payment method (processed through secure payment gateways - we do not store full credit
          card numbers).
        </Text>

        <Text style={styles.sectionSubtitle}>Device Information</Text>
        <Text style={styles.sectionText}>
          We automatically collect certain information about your device, including device model,
          operating system, unique device identifiers, and mobile network information.
        </Text>

        <Text style={styles.sectionSubtitle}>Analytics Information</Text>
        <Text style={styles.sectionText}>
          We use Google Analytics 4 and Apple Analytics to understand how users interact with our
          app. This includes screen views, button clicks, search queries, and product interactions.
          Your data is anonymized and used solely for improving our service.
        </Text>

        <Text style={styles.sectionSubtitle}>Email Communications</Text>
        <Text style={styles.sectionText}>
          If you subscribe to our email list, we collect your email address to send you newsletters,
          promotions, and order updates. You can unsubscribe at any time by clicking the unsubscribe
          link in our emails.
        </Text>

        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.sectionText}>
          We use the information we collect for the following purposes:
        </Text>
        <Text style={styles.bulletPoint}>• Processing and fulfilling your orders</Text>
        <Text style={styles.bulletPoint}>• Providing customer support and responding to inquiries</Text>
        <Text style={styles.bulletPoint}>• Sending transactional emails (order confirmations, shipping updates)</Text>
        <Text style={styles.bulletPoint}>• Sending marketing emails (only with your consent)</Text>
        <Text style={styles.bulletPoint}>• Analyzing app usage to improve features and user experience</Text>
        <Text style={styles.bulletPoint}>• Preventing fraudulent transactions and securing our services</Text>
        <Text style={styles.bulletPoint}>• Complying with legal obligations</Text>

        <Text style={styles.sectionTitle}>4. Data Sharing and Third Parties</Text>
        <Text style={styles.sectionText}>
          We do not sell, trade, or rent your personal information to third parties. However, we may
          share your information with:
        </Text>
        <Text style={styles.bulletPoint}>
          • Payment processors (Square) - for processing transactions securely
        </Text>
        <Text style={styles.bulletPoint}>
          • Email service providers (SendGrid, Nodemailer) - for sending newsletters and transactional
          emails
        </Text>
        <Text style={styles.bulletPoint}>
          • Analytics providers (Google Analytics 4) - for understanding app usage patterns
        </Text>
        <Text style={styles.bulletPoint}>
          • Shipping partners - only your address information for order delivery
        </Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.sectionText}>
          We implement industry-standard security measures to protect your personal information,
          including:
        </Text>
        <Text style={styles.bulletPoint}>• SSL/TLS encryption for data in transit</Text>
        <Text style={styles.bulletPoint}>• Password hashing using bcryptjs</Text>
        <Text style={styles.bulletPoint}>• JWT tokens for secure authentication</Text>
        <Text style={styles.bulletPoint}>• Regular security audits and updates</Text>
        <Text style={styles.sectionText}>
          However, no security system is impenetrable. While we strive to protect your information,
          we cannot guarantee absolute security.
        </Text>

        <Text style={styles.sectionTitle}>6. Data Retention</Text>
        <Text style={styles.sectionText}>
          We retain your personal information for as long as necessary to provide our services and
          fulfill the purposes outlined in this policy. You can request deletion of your account and
          associated data by contacting us at info@sisterspromise.com.
        </Text>

        <Text style={styles.sectionTitle}>7. Your Privacy Rights</Text>
        <Text style={styles.sectionText}>
          Depending on your location, you may have the following rights:
        </Text>
        <Text style={styles.bulletPoint}>
          • GDPR (European residents): Right to access, rectify, erase, and restrict processing
        </Text>
        <Text style={styles.bulletPoint}>
          • CCPA (California residents): Right to know, delete, and opt-out of data sale
        </Text>
        <Text style={styles.bulletPoint}>
          • General: Right to request a copy of your data and understand how it's used
        </Text>

        <Text style={styles.sectionTitle}>8. Cookies and Tracking</Text>
        <Text style={styles.sectionText}>
          Our mobile app uses cookies and similar tracking technologies for:
        </Text>
        <Text style={styles.bulletPoint}>• Remembering your login information</Text>
        <Text style={styles.bulletPoint}>• Tracking app analytics</Text>
        <Text style={styles.bulletPoint}>• Personalizing your experience</Text>
        <Text style={styles.sectionText}>
          You can adjust your device settings to limit tracking, but this may affect app functionality.
        </Text>

        <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
        <Text style={styles.sectionText}>
          Our app is not intended for children under 13 years old. We do not knowingly collect
          personal information from children. If we discover we have collected information from a
          child under 13, we will delete it immediately.
        </Text>

        <Text style={styles.sectionTitle}>10. Third-Party Links</Text>
        <Text style={styles.sectionText}>
          Our app may contain links to third-party websites and services. We are not responsible for
          their privacy practices. Please review their privacy policies before providing any personal
          information.
        </Text>

        <Text style={styles.sectionTitle}>11. Changes to This Policy</Text>
        <Text style={styles.sectionText}>
          We may update this Privacy Policy from time to time to reflect changes in our practices or
          legal requirements. We will notify you of significant changes via email or app notification.
          Your continued use of the app signifies your acceptance of the updated policy.
        </Text>

        <Text style={styles.sectionTitle}>12. Contact Us</Text>
        <Text style={styles.sectionText}>
          If you have questions about this Privacy Policy or our privacy practices, please contact us at:
        </Text>
        <Text style={styles.contact}>Email: info@sisterspromise.com</Text>
        <Text style={styles.contact}>Website: www.sisterspromise.com</Text>
        <Text style={styles.contact}>Address: Sister's Promise, USA</Text>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 12,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginLeft: 12,
    marginBottom: 6,
  },
  contact: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  spacer: {
    height: 32,
  },
});

export default PrivacyPolicyScreen;
