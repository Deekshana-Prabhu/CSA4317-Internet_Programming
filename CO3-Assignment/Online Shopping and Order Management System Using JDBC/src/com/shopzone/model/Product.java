package com.shopzone.model;

import java.io.Serializable;

/**
 * Product Model Bean
 * Represents a product available in the SHOPZONE catalog.
 */
public class Product implements Serializable {
    private static final long serialVersionUID = 1L;

    private String productId;
    private String productName;
    private String category;
    private String description;
    private double price;
    private int stock;
    private String image;

    public Product() {
    }

    public Product(String productId, String productName, String category, String description, double price, int stock, String image) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.image = image;
    }

    // Getters and Setters
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getFormattedPrice() {
        return String.format("₹%,.2f", price);
    }

    public boolean isInStock() {
        return stock > 0;
    }

    @Override
    public String toString() {
        return "Product{" +
                "productId='" + productId + '\'' +
                ", productName='" + productName + '\'' +
                ", category='" + category + '\'' +
                ", price=" + price +
                ", stock=" + stock +
                '}';
    }
}
