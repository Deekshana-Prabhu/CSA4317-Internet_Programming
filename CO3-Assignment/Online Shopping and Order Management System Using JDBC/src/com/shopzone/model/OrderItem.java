package com.shopzone.model;

import java.io.Serializable;

/**
 * OrderItem Model Bean
 * Represents a single line item within an order stored in MySQL.
 */
public class OrderItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private int orderItemId;
    private String orderId;
    private String productId;
    private String productName;
    private String productImage;
    private int quantity;
    private double price;

    public OrderItem() {
    }

    public OrderItem(int orderItemId, String orderId, String productId, String productName, String productImage, int quantity, double price) {
        this.orderItemId = orderItemId;
        this.orderId = orderId;
        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.quantity = quantity;
        this.price = price;
    }

    public OrderItem(String orderId, String productId, int quantity, double price) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }

    public int getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(int orderItemId) {
        this.orderItemId = orderItemId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getSubtotal() {
        return price * quantity;
    }

    public String getFormattedPrice() {
        return String.format("₹%,.2f", price);
    }

    public String getFormattedSubtotal() {
        return String.format("₹%,.2f", getSubtotal());
    }
}
