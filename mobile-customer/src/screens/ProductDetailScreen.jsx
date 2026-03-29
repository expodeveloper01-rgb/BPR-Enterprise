import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { productService } from "../services/products.service";
import { useCartStore } from "../stores/cartStore";

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const { addItem } = useCartStore();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProduct(productId);
      setProduct(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      Alert.alert("Error", "Please select a valid quantity");
      return;
    }

    setIsAdding(true);
    try {
      await addItem(productId, quantity, selectedOptions);
      Alert.alert("Success", "Item added to cart!", [
        {
          text: "Continue Shopping",
          onPress: () => navigation.goBack(),
        },
        {
          text: "Go to Cart",
          onPress: () => navigation.navigate("Cart"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" style={{ flex: 1 }} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        {product.image && (
          <Image source={{ uri: product.image }} style={styles.productImage} />
        )}

        <View style={styles.content}>
          {/* Product Info */}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Price and Rating */}
          <View style={styles.priceRatingContainer}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>
                ₱{Number(product.price || 0).toFixed(2)}
              </Text>
            </View>
            {product.rating && (
              <View>
                <Text style={styles.ratingLabel}>Rating</Text>
                <Text style={styles.rating}>⭐ {product.rating}/5</Text>
              </View>
            )}
          </View>

          {/* Kitchen Info */}
          {product.kitchen && (
            <View style={styles.kitchenInfo}>
              <Text style={styles.kitchenLabel}>Available from</Text>
              <Text style={styles.kitchenName}>{product.kitchen.name}</Text>
            </View>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={styles.optionLabel}>Select Size</Text>
              <View style={styles.sizeOptions}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size.id}
                    style={[
                      styles.sizeOption,
                      selectedOptions.sizeId === size.id &&
                        styles.sizeOptionSelected,
                    ]}
                    onPress={() =>
                      setSelectedOptions({
                        ...selectedOptions,
                        sizeId: size.id,
                        sizeName: size.name,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.sizeOptionText,
                        selectedOptions.sizeId === size.id &&
                          styles.sizeOptionTextSelected,
                      ]}
                    >
                      {size.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity Selection */}
          <View style={styles.quantitySection}>
            <Text style={styles.optionLabel}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityBtnText}>−</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.quantityInput}
                value={quantity.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text) || 1;
                  setQuantity(Math.max(1, num));
                }}
                keyboardType="number-pad"
              />
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional Details */}
          {product.prepTime && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Prep Time:</Text>
              <Text style={styles.detailValue}>{product.prepTime} mins</Text>
            </View>
          )}

          {product.calories && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Calories:</Text>
              <Text style={styles.detailValue}>{product.calories}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addButton, isAdding && styles.buttonDisabled]}
          onPress={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add to Cart</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  productImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  content: {
    padding: 16,
  },
  productName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  ratingLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
  },
  rating: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  kitchenInfo: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  kitchenLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
  },
  kitchenName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  optionSection: {
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  sizeOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  sizeOptionSelected: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  sizeOptionText: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  sizeOptionTextSelected: {
    color: "#fff",
  },
  quantitySection: {
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityBtn: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  quantityInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 16,
  },
  addButton: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
