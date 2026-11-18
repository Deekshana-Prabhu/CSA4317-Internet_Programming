package com.shopzone.model;

import java.io.Serializable;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * Order Model Bean
 * Represents a customer's placed order with associated items.
 */
public class Order implements Serializable {
    private static final long serialVersionUID = 1L;

    private String orderId;
    private String customerId;
    private String customerName;
    private String deliveryAddress;
    private String mobile;
    private double totalAmount;
    private String paymentMethod;
    private Timestamp orderDate;
    private String orderStatus;
    private List<OrderItem> items;

    public Order() {
        this.items = new ArrayList<>();
    }

    public Order(String orderId, String customerId, double totalAmount, String paymentMethod, Timestamp orderDate, String orderStatus) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.items = new ArrayList<>();
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Timestamp getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Timestamp orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public void addItem(OrderItem item) {
        this.items.add(item);
    }

    public String getFormattedTotalAmount() {
        return String.format("₹%,.2f", totalAmount);
    }

    public String getFormattedDate() {
        if (orderDate != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy, hh:mm a");
            return sdf.format(orderDate);
        }
        return "N/A";
    }
}
