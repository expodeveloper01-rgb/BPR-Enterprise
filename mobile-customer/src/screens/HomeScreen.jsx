import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useProductStore } from "../stores/productStore";
import { useAuthStore } from "../stores/authStore";
import ActiveOrdersCard from "./ActiveOrdersCard";

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

export default function HomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const [stores, setStores] = useState(STORES);
  const [isLoading, setIsLoading] = useState(false);

  const handleShopNow = (store) => {
    if (store.status !== "coming-soon") {
      navigation.navigate("ProductDetail", {
        kitchenId: store.id,
        kitchenName: store.name,
      });
    }
  };

  const userName = user?.firstName || "Guest";

  const getKitchenStatus = (store) => {
    return store.status || "active";
  };

  const renderFeatureItem = (feature) => (
    <View key={feature} style={styles.featureItemContainer}>
      <View style={styles.featureBullet} />
      <Text style={styles.featureItemText}>{feature}</Text>
    </View>
  );

  const renderKitchenCard = (store) => {
    const status = getKitchenStatus(store);
    const isActive = status === "active";
    const features = store.features || [];

    return (
      <TouchableOpacity
        key={store.id}
        style={[styles.kitchenCard, !isActive && styles.kitchenCardInactive]}
        onPress={() => handleShopNow(store)}
        activeOpacity={isActive ? 0.9 : 1}
        disabled={!isActive}
      >
        {/* Kitchen Logo/Image - Left Side */}
        <View style={styles.kitchenImageContainer}>
          {store.image ? (
            <Image
              source={store.image}
              style={styles.kitchenImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.kitchenImagePlaceholder}>
              <Text style={styles.placeholderText}>?</Text>
            </View>
          )}
        </View>

        {/* Kitchen Info Content - Right Side */}
        <View style={styles.kitchenInfo}>
          {/* Name & Description */}
          <View style={styles.kitchenHeader}>
            <Text style={styles.kitchenName}>{store.name}</Text>
            <Text style={styles.kitchenTagline}>{store.description}</Text>
          </View>

          {/* Category & Features */}
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
      {/* Welcome Header */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome, <Text style={styles.userName}>{user?.name || "Admin"}</Text>
        </Text>
        <Text style={styles.subtitle}>
          Choose a platform to get started with your order
        </Text>
      </View>

      {/* Active Orders Card */}
      <ActiveOrdersCard />

      {/* Loading State */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
        </View>
      ) : stores.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No stores available</Text>
        </View>
      ) : (
        <View style={styles.kitchensListContainer}>
          {stores.map((store) => renderKitchenCard(store))}
        </View>
      )}

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
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  userName: {
    color: "#E91E63",
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    fontWeight: "500",
  },
  kitchensListContainer: {
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  kitchenCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E91E63",
    marginBottom: 12,
    marginHorizontal: 0,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "stretch",
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  kitchenCardInactive: {
    borderColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
    opacity: 0.6,
    shadowColor: "#000",
    shadowOpacity: 0.03,
  },
  kitchenImageContainer: {
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
  kitchenImage: {
    width: "100%",
    height: "100%",
  },
  kitchenImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 32,
  },
  kitchenInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
  },
  kitchenHeader: {
    marginBottom: 4,
  },
  kitchenName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  kitchenTagline: {
    fontSize: 12,
    color: "#777",
    lineHeight: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  categoriesSection: {
    marginBottom: 0,
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
    marginTop: 0,
  },
  featureItemText: {
    fontSize: 11,
    color: "#555",
    fontWeight: "500",
    flex: 1,
  },
  loadingContainer: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
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
