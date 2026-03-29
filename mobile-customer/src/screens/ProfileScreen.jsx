import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";

export default function ProfileScreen({ navigation }) {
  const { user, logout, isLoading, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logout();
            // Navigation happens automatically via conditional rendering
            // when isAuthenticated becomes false
          } catch (error) {
            Alert.alert("Error", "Failed to logout");
          }
        },
        style: "destructive",
      },
    ]);
  };

  // Get initials for avatar
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    return user?.firstName?.[0]?.toUpperCase() || "U";
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Not logged in</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Auth")}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // If authenticated but no user data, show minimal profile
  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{getInitials()}</Text>
          </View>
          <Text style={styles.userName}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.phoneNumber && (
            <Text style={styles.userPhone}>{user.phoneNumber}</Text>
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItemButton}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>✎</Text>
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Edit Profile</Text>
                  <Text style={styles.menuItemDesc}>
                    Update your name and phone
                  </Text>
                </View>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemButton}
              onPress={() => navigation.navigate("Addresses")}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconBox, { backgroundColor: "#FFF3E0" }]}>
                  <Text style={[styles.iconText, { color: "#FF9800" }]}>
                    📍
                  </Text>
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Addresses</Text>
                  <Text style={styles.menuItemDesc}>
                    Manage delivery addresses
                  </Text>
                </View>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemButton}
              onPress={() => navigation.navigate("PaymentMethods")}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconBox, { backgroundColor: "#E3F2FD" }]}>
                  <Text style={[styles.iconText, { color: "#2196F3" }]}>
                    💳
                  </Text>
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Payment Methods</Text>
                  <Text style={styles.menuItemDesc}>
                    Add or remove payment options
                  </Text>
                </View>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Orders & Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders & Activity</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItemButton}
              onPress={() => navigation.navigate("Orders")}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconBox, { backgroundColor: "#F3E5F5" }]}>
                  <Text style={[styles.iconText, { color: "#9C27B0" }]}>
                    📦
                  </Text>
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>My Orders</Text>
                  <Text style={styles.menuItemDesc}>
                    View order history and status
                  </Text>
                </View>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings & Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings & Support</Text>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItemButton}
              onPress={() => navigation.navigate("Settings")}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconBox, { backgroundColor: "#F5F5F5" }]}>
                  <Text style={[styles.iconText, { color: "#666" }]}>⚙</Text>
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Settings</Text>
                  <Text style={styles.menuItemDesc}>
                    Notifications and preferences
                  </Text>
                </View>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemButton}
              onPress={() =>
                Alert.alert("Help", "Contact support@belapari.com")
              }
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.iconBox, { backgroundColor: "#F0F4F8" }]}>
                  <Text style={[styles.iconText, { color: "#1976D2" }]}>?</Text>
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>Help & Support</Text>
                  <Text style={styles.menuItemDesc}>
                    Get help and contact us
                  </Text>
                </View>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, isLoading && styles.buttonDisabled]}
          onPress={handleLogout}
          disabled={isLoading}
        >
          <Text style={styles.logoutButtonText}>
            {isLoading ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  profileHeader: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    fontSize: 38,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
    fontWeight: "500",
  },
  userPhone: {
    fontSize: 13,
    color: "#777",
    fontWeight: "500",
  },
  section: {
    marginHorizontal: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 8,
    marginBottom: 10,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  menuItemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  iconText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 3,
    letterSpacing: -0.2,
  },
  menuItemDesc: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  menuItemArrow: {
    fontSize: 18,
    color: "#D0D0D0",
    marginLeft: 8,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#E91E63",
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginBottom: 24,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  spacer: {
    height: 20,
  },
});
