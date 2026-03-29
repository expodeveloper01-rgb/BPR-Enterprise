import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useAuthStore } from "../stores/authStore";

// Import store images
import uncleLogo from "../../assets/images/uncle-brew.png";
import diomedesLogo from "../../assets/images/diomedes-logo.png";

// Store data similar to web version
const STORES = [
  {
    id: "uncle-brew",
    name: "Uncle Brew",
    description: "Premium Coffee & Gourmet Bites",
    image: uncleLogo,
    category: "Coffee & Food",
    status: "active",
    features: ["Specialty Coffee", "Fresh Pastries", "Gourmet Sandwiches"],
  },
  {
    id: "diomedes",
    name: "Diomedes Bakeshop",
    description: "Artisanal Bakery & Café",
    image: diomedesLogo,
    category: "Bakery",
    status: "active",
    features: ["Sourdough Bread", "Fresh Pastries", "Premium Coffee"],
  },
  {
    id: "coming-soon-2",
    name: "Coming Soon",
    description: "New venture launching soon",
    image: null,
    category: "TBA",
    status: "coming-soon",
    features: [],
  },
];

export default function StoresScreen({ navigation }) {
  const { user } = useAuthStore();
  const [stores] = useState(STORES);

  const handleSelectStore = (store) => {
    if (store.status !== "coming-soon") {
      navigation.navigate("ProductDetail", {
        kitchenId: store.id,
        kitchenName: store.name,
      });
    }
  };

  const renderFeatureItem = (feature) => (
    <View key={feature} style={styles.featureItemContainer}>
      <View style={styles.featureBullet} />
      <Text style={styles.featureItemText}>{feature}</Text>
    </View>
  );

  const renderStoreCard = (store) => {
    const isActive = store.status === "active";
    const features = store.features || [];

    return (
      <TouchableOpacity
        key={store.id}
        style={[styles.storeCard, !isActive && styles.storeCardInactive]}
        onPress={() => handleSelectStore(store)}
        activeOpacity={isActive ? 0.9 : 1}
        disabled={!isActive}
      >
        {/* Store Logo/Image - Left Side */}
        <View style={styles.storeImageContainer}>
          {store.image ? (
            <Image
              source={store.image}
              style={styles.storeImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.storeImagePlaceholder}>
              <Text style={styles.placeholderText}>?</Text>
            </View>
          )}
        </View>

        {/* Store Info Content - Right Side */}
        <View style={styles.storeInfo}>
          {/* Name & Description */}
          <View style={styles.storeHeader}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeTagline}>{store.description}</Text>
          </View>

          {/* Features */}
          {features.length > 0 && (
            <View style={styles.featuresList}>
              {features
                .slice(0, 2)
                .map((feature) => renderFeatureItem(feature))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Available Stores</Text>
        <Text style={styles.headerSubtitle}>
          Explore all our premium food and beverage platforms
        </Text>
      </View>

      {/* Stores Grid */}
      <View style={styles.storesListContainer}>
        {stores.map((store) => renderStoreCard(store))}
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F7F4",
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontWeight: "500",
  },
  storesListContainer: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  storeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E91E63",
    marginBottom: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "stretch",
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  storeCardInactive: {
    borderColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
    opacity: 0.6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  storeImageContainer: {
    width: 100,
    height: 110,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "#f0f0f0",
    flexShrink: 0,
  },
  storeImage: {
    width: "100%",
    height: "100%",
  },
  storeImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 32,
  },
  storeInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  storeHeader: {
    marginBottom: 4,
  },
  storeName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  storeTagline: {
    fontSize: 12,
    color: "#777",
    lineHeight: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  categoriesSection: {
    marginBottom: 0,
    display: "none",
  },
  categoriesLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    display: "none",
  },
  featuresList: {
    marginTop: 0,
  },
  featureItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  featureBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E91E63",
    marginRight: 6,
  },
  featureItemText: {
    fontSize: 11,
    color: "#555",
    fontWeight: "500",
    flex: 1,
  },
  shopButton: {
    display: "none",
  },
  shopButtonDisabled: {
    display: "none",
  },
  shopButtonText: {
    display: "none",
  },
  shopButtonTextDisabled: {
    display: "none",
  },
  shopButtonArrow: {
    display: "none",
  },
  aboutSection: {
    marginHorizontal: 16,
    marginVertical: 20,
    marginBottom: 24,
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#666",
    fontWeight: "500",
  },
  aboutBoldText: {
    fontWeight: "800",
    color: "#1a1a1a",
  },
  spacer: {
    height: 20,
  },
});
