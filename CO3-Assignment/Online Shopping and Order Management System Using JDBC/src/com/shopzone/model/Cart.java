package com.shopzone.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Shopping Cart Model
 * Holds items selected by the customer in their current HTTP session.
 * Enforces stock boundaries and calculates subtotals and totals automatically.
 */
public class Cart implements Serializable {
    private static final long serialVersionUID = 1L;

    // Preserve insertion order using LinkedHashMap
    private final Map<String, CartItem> items;

    public Cart() {
        this.items = new LinkedHashMap<>();
    }

    /**
     * Add product to cart with stock validation.
     * @return String error message if stock exceeded, or null on success.
     */
    public synchronized String addItem(Product product, int quantity) {
        if (product == null) {
            return "Invalid product!";
        }
        if (quantity <= 0) {
            quantity = 1;
        }

        String pid = product.getProductId();
        int existingQty = items.containsKey(pid) ? items.get(pid).getQuantity() : 0;
        int newTotalQty = existingQty + quantity;

        if (newTotalQty > product.getStock()) {
            return "Cannot add " + quantity + " more item(s). Available stock is only " + product.getStock() + " (you already have " + existingQty + " in your cart).";
        }

        if (items.containsKey(pid)) {
            items.get(pid).setQuantity(newTotalQty);
        } else {
            items.put(pid, new CartItem(product, quantity));
        }
        return null;
    }

    /**
     * Update quantity of an item with stock limit validation.
     * @return String error message if stock exceeded, or null on success.
     */
    public synchronized String updateQuantity(String productId, int newQuantity, int availableStock) {
        if (!items.containsKey(productId)) {
            return "Item not found in cart!";
        }

        if (newQuantity <= 0) {
            items.remove(productId);
            return null;
        }

        if (newQuantity > availableStock) {
            items.get(productId).setQuantity(availableStock);
            return "Adjusted quantity to maximum available stock of " + availableStock + ".";
        }

        items.get(productId).setQuantity(newQuantity);
        return null;
    }

    /**
     * Remove an item from the cart.
     */
    public synchronized void removeItem(String productId) {
        items.remove(productId);
    }

    /**
     * Clear all items from the cart.
     */
    public synchronized void clear() {
        items.clear();
    }

    public Collection<CartItem> getItems() {
        return items.values();
    }

    public Map<String, CartItem> getItemsMap() {
        return items;
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    /**
     * Total number of individual items in the cart.
     */
    public int getTotalItemCount() {
        int count = 0;
        for (CartItem item : items.values()) {
            count += item.getQuantity();
        }
        return count;
    }

    /**
     * Total amount for all items in the cart.
     */
    public double getTotalAmount() {
        double total = 0.0;
        for (CartItem item : items.values()) {
            total += item.getSubtotal();
        }
        return total;
    }

    public String getFormattedTotalAmount() {
        return String.format("₹%,.2f", getTotalAmount());
    }
}
