import React, { useEffect } from "react";
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuthStore } from "../stores/authStore";
import { useProductStore } from "../stores/productStore";

// BeLaPaRi Logo
import belapariBrand from "../../assets/images/belapari-icon.png";

// Auth Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

// App Screens
import HomeScreen from "../screens/HomeScreen";
import StoresScreen from "../screens/StoresScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Header Component with Logo and Cart
const CustomHeader = ({ navigation, screenName }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerLeft}>
        <Image source={belapariBrand} style={styles.headerLogo} />
        <Text style={styles.headerLogoText}>BeLaPaRi</Text>
      </View>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate("Cart")}
      >
        <MaterialIcons name="shopping-bag" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// Cart Header Component with Back Button
const CartHeader = ({ navigation: navProp }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: "#E91E63", paddingTop: insets.top },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navProp.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Shopping Cart</Text>
      <View style={{ width: 24 }} />
    </View>
  );
};

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        header: () => <CustomHeader navigation={navigation} />,
        headerStyle: {
          backgroundColor: "#E91E63",
        },
        headerTintColor: "#fff",
      })}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          header: ({ navigation: navProp, route, tintColor }) => (
            <View
              style={[styles.headerContainer, { backgroundColor: "#E91E63" }]}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navProp.goBack()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Product Details</Text>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => navProp.navigate("Cart")}
              >
                <MaterialIcons name="shopping-bag" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          header: ({ navigation: navProp }) => (
            <CartHeader navigation={navProp} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function StoresStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        header: () => <CustomHeader navigation={navigation} />,
        headerStyle: {
          backgroundColor: "#E91E63",
        },
        headerTintColor: "#fff",
      })}
    >
      <Stack.Screen name="StoresScreen" component={StoresScreen} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          header: ({ navigation: navProp }) => (
            <View
              style={[styles.headerContainer, { backgroundColor: "#E91E63" }]}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navProp.goBack()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Product Details</Text>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => navProp.navigate("Cart")}
              >
                <MaterialIcons name="shopping-bag" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          header: ({ navigation: navProp }) => (
            <View
              style={[styles.headerContainer, { backgroundColor: "#E91E63" }]}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navProp.goBack()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Shopping Cart</Text>
              <View style={{ width: 24 }} />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function OrdersStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        header: () => <CustomHeader navigation={navigation} />,
        headerStyle: {
          backgroundColor: "#E91E63",
        },
        headerTintColor: "#fff",
      })}
    >
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          header: ({ navigation: navProp }) => (
            <View
              style={[styles.headerContainer, { backgroundColor: "#E91E63" }]}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navProp.goBack()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Shopping Cart</Text>
              <View style={{ width: 24 }} />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        header: () => <CustomHeader navigation={navigation} />,
        headerStyle: {
          backgroundColor: "#E91E63",
        },
        headerTintColor: "#fff",
      })}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          header: ({ navigation: navProp }) => (
            <View
              style={[styles.headerContainer, { backgroundColor: "#E91E63" }]}
            >
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navProp.goBack()}
              >
                <MaterialIcons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Shopping Cart</Text>
              <View style={{ width: 24 }} />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E91E63",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#eee",
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 8,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Stores"
        component={StoresStack}
        options={{
          title: "Stores",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="storefront" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersStack}
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="assignment" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const { fetchProducts, fetchCategories, fetchCuisines } = useProductStore();

  useEffect(() => {
    // Initialize auth state from storage
    const init = async () => {
      await initializeAuth();
    };
    init();
  }, []);

  // Load initial data when app starts
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchCategories();
      fetchCuisines();
    }
  }, [isAuthenticated]);

  // Show splash screen while initializing
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppTabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#E91E63",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLogo: {
    width: 36,
    height: 36,
    resizeMode: "contain",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 4,
  },
  headerLogoText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  cartButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.2,
    flex: 1,
    textAlign: "center",
  },
});
