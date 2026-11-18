package com.shopzone.model;

import java.io.Serializable;

/**
 * CartItem Model Bean
 * Represents an individual product line in the customer's shopping cart.
 */
public class CartItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private Product product;
    private int quantity;

    public CartItem() {
    }

    public CartItem(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getSubtotal() {
        if (product != null) {
            return product.getPrice() * quantity;
        }
        return 0.0;
    }

    public String getFormattedSubtotal() {
        return String.format("₹%,.2f", getSubtotal());
    }
}
