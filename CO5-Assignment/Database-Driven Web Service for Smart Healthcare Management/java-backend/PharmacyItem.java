package com.mediconnect.model;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Pharmacy Item Entity Model
 * Represents medicinal supplies, stock volume, and dispensing requirements.
 */
@XmlRootElement(name = "pharmacyItem", namespace = "http://service.mediconnect.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class PharmacyItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @XmlElement(required = true)
    private String medicineId;

    @XmlElement(required = true)
    private String medicineName;

    @XmlElement(required = true)
    private String category;

    @XmlElement(required = true)
    private int availableStock;

    @XmlElement(required = true)
    private String prescriptionStatus;

    @XmlElement(required = true)
    private BigDecimal unitPrice;

    @XmlElement
    private String manufacturer;

    @XmlElement
    private String expiryDate;

    public PharmacyItem() {
    }

    public PharmacyItem(String medicineId, String medicineName, String category, 
                        int availableStock, String prescriptionStatus, 
                        BigDecimal unitPrice, String manufacturer, String expiryDate) {
        this.medicineId = medicineId;
        this.medicineName = medicineName;
        this.category = category;
        this.availableStock = availableStock;
        this.prescriptionStatus = prescriptionStatus;
        this.unitPrice = unitPrice;
        this.manufacturer = manufacturer;
        this.expiryDate = expiryDate;
    }

    public String getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(String medicineId) {
        this.medicineId = medicineId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getAvailableStock() {
        return availableStock;
    }

    public void setAvailableStock(int availableStock) {
        this.availableStock = availableStock;
    }

    public String getPrescriptionStatus() {
        return prescriptionStatus;
    }

    public void setPrescriptionStatus(String prescriptionStatus) {
        this.prescriptionStatus = prescriptionStatus;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }
}
