/**
 * Terms of Service Screen
 */

import React from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Header } from '../components/CommonComponents';

const TermsOfServiceScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Terms of Service" onBackPress={() => navigation.goBack()} />
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: January 15, 2026</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.sectionText}>
          Welcome to Sister's Promise. By accessing or using our mobile application, website
          (sisterspromise.com), or any related services (collectively, the "Service"), you agree to be
          bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not
          use our Service.
        </Text>
        <Text style={styles.sectionText}>
          By creating an account, placing an order, or otherwise using the Service, you represent that
          you are at least 18 years of age or have the consent of a parent or legal guardian.
        </Text>

        <Text style={styles.sectionTitle}>2. Use of the App/Service</Text>
        <Text style={styles.sectionText}>
          You agree to use the Service only for lawful purposes and in accordance with these Terms. You
          agree not to:
        </Text>
        <Text style={styles.bulletPoint}>
          • Use the Service in any way that violates applicable federal, state, local, or international
          law or regulation
        </Text>
        <Text style={styles.bulletPoint}>
          • Attempt to gain unauthorized access to any portion of the Service, other accounts, or any
          systems or networks connected to the Service
        </Text>
        <Text style={styles.bulletPoint}>
          • Interfere with or disrupt the Service or servers or networks connected to the Service
        </Text>
        <Text style={styles.bulletPoint}>
          • Use any automated means to access the Service for any purpose without our express written
          permission
        </Text>
        <Text style={styles.bulletPoint}>
          • Impersonate or attempt to impersonate Sister's Promise, an employee, another user, or any
          other person or entity
        </Text>

        <Text style={styles.sectionTitle}>3. Products & Pricing</Text>
        <Text style={styles.sectionText}>
          Sister's Promise offers natural skincare products. We strive to provide accurate product
          descriptions, images, ingredient lists, and pricing information. However, we do not warrant
          that product descriptions, images, pricing, or other content on the Service is accurate,
          complete, reliable, current, or error-free.
        </Text>
        <Text style={styles.sectionText}>
          All prices are listed in U.S. dollars (USD) and are subject to change without notice. We
          reserve the right to modify or discontinue any product at any time. In the event of a pricing
          error, we reserve the right to cancel any orders placed at the incorrect price.
        </Text>
        <Text style={styles.sectionSubtitle}>Ingredient Disclaimer</Text>
        <Text style={styles.sectionText}>
          Our products are made with natural ingredients. While we take care in formulating our products,
          individual results may vary. Please review ingredient lists carefully before purchasing,
          especially if you have known allergies or sensitivities. Our products are not intended to
          diagnose, treat, cure, or prevent any disease.
        </Text>

        <Text style={styles.sectionTitle}>4. Orders & Payment</Text>
        <Text style={styles.sectionText}>
          When you place an order through the Service, you are making an offer to purchase the selected
          products. All orders are subject to acceptance and availability. We reserve the right to refuse
          or cancel any order for any reason, including but not limited to product availability, errors in
          product or pricing information, or suspected fraudulent activity.
        </Text>
        <Text style={styles.sectionSubtitle}>Payment Processing</Text>
        <Text style={styles.sectionText}>
          All payments are processed securely through Square. By submitting your payment information, you
          authorize us to charge the applicable amount to your selected payment method. We do not store
          your full credit card information on our servers. All payment data is handled in accordance with
          Square's security standards and PCI compliance requirements.
        </Text>
        <Text style={styles.sectionSubtitle}>Order Confirmation</Text>
        <Text style={styles.sectionText}>
          After placing an order, you will receive an email confirmation with your order details. This
          confirmation does not constitute acceptance of your order. We reserve the right to cancel any
          order after confirmation if we are unable to fulfill it.
        </Text>

        <Text style={styles.sectionTitle}>5. Shipping & Returns</Text>
        <Text style={styles.sectionSubtitle}>Shipping</Text>
        <Text style={styles.sectionText}>
          We currently ship within the United States. Shipping times and costs vary depending on your
          location and selected shipping method. Estimated delivery times are provided for reference only
          and are not guaranteed. Sister's Promise is not responsible for delays caused by shipping
          carriers, weather, or other circumstances beyond our control.
        </Text>
        <Text style={styles.sectionSubtitle}>Returns & Refunds</Text>
        <Text style={styles.sectionText}>
          Due to the nature of skincare products, we accept returns only for unopened and unused items
          within 30 days of delivery. To initiate a return, please contact us at info@sisterspromise.com
          with your order number and reason for the return. Refunds will be processed to the original
          payment method within 5-10 business days after we receive the returned item.
        </Text>
        <Text style={styles.sectionSubtitle}>Damaged or Defective Products</Text>
        <Text style={styles.sectionText}>
          If you receive a damaged or defective product, please contact us within 7 days of delivery with
          photos of the damage. We will arrange a replacement or full refund at no additional cost to you.
        </Text>

        <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
        <Text style={styles.sectionText}>
          All content on the Service, including but not limited to text, graphics, logos, images, product
          formulations, photographs, and software, is the property of Sister's Promise or its content
          suppliers and is protected by United States and international copyright, trademark, and other
          intellectual property laws.
        </Text>
        <Text style={styles.sectionText}>
          You may not reproduce, distribute, modify, create derivative works of, publicly display,
          publicly perform, republish, download, store, or transmit any of the material on our Service
          without our prior written consent, except as follows:
        </Text>
        <Text style={styles.bulletPoint}>
          • Your device may temporarily store copies of such materials incidental to your accessing and
          viewing those materials
        </Text>
        <Text style={styles.bulletPoint}>
          • You may print or download one copy of a reasonable number of pages for your own personal,
          non-commercial use
        </Text>

        <Text style={styles.sectionTitle}>7. User Accounts</Text>
        <Text style={styles.sectionText}>
          When you create an account with us, you are responsible for maintaining the confidentiality of
          your account credentials and for all activities that occur under your account. You agree to:
        </Text>
        <Text style={styles.bulletPoint}>
          • Provide accurate and complete information when creating your account
        </Text>
        <Text style={styles.bulletPoint}>
          • Update your account information promptly if it changes
        </Text>
        <Text style={styles.bulletPoint}>
          • Notify us immediately of any unauthorized use of your account
        </Text>
        <Text style={styles.bulletPoint}>
          • Not share your account credentials with any third party
        </Text>
        <Text style={styles.sectionText}>
          We reserve the right to suspend or terminate your account at our sole discretion, without
          notice, for conduct that we determine violates these Terms or is harmful to other users, us,
          or third parties, or for any other reason.
        </Text>

        <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
        <Text style={styles.sectionText}>
          To the fullest extent permitted by applicable law, Sister's Promise and its officers, directors,
          employees, agents, and suppliers shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including but not limited to loss of profits, data, use, or
          goodwill, arising out of or in connection with your use of the Service.
        </Text>
        <Text style={styles.sectionText}>
          In no event shall our total liability to you for all claims arising out of or relating to the
          use of the Service exceed the amount you paid to us in the twelve (12) months preceding the
          event giving rise to the liability.
        </Text>
        <Text style={styles.sectionText}>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any
          kind, either express or implied, including but not limited to implied warranties of
          merchantability, fitness for a particular purpose, and non-infringement.
        </Text>

        <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
        <Text style={styles.sectionText}>
          We reserve the right to update or modify these Terms at any time without prior notice. Changes
          will be effective immediately upon posting to the Service. The "Last updated" date at the top of
          these Terms indicates when they were last revised.
        </Text>
        <Text style={styles.sectionText}>
          Your continued use of the Service after any changes to these Terms constitutes your acceptance
          of the revised Terms. We encourage you to review these Terms periodically to stay informed of
          any updates.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact Information</Text>
        <Text style={styles.sectionText}>
          If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfServiceScreen;
