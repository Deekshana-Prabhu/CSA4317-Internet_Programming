package com.shopzone.model;

import java.io.Serializable;

/**
 * Customer Model Bean
 * Represents a registered customer in the SHOPZONE system.
 */
public class Customer implements Serializable {
    private static final long serialVersionUID = 1L;

    private String customerId;
    private String customerName;
    private String email;
    private String mobile;
    private String password;
    private String address;

    public Customer() {
    }

    public Customer(String customerId, String customerName, String email, String mobile, String password, String address) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.email = email;
        this.mobile = mobile;
        this.password = password;
        this.address = address;
    }

    // Getters and Setters
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "customerId='" + customerId + '\'' +
                ", customerName='" + customerName + '\'' +
                ", email='" + email + '\'' +
                ", mobile='" + mobile + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}
