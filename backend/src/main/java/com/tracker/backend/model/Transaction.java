package com.tracker.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    @NotBlank(message = "Description is required")
    @Field("description")
    private String description;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    @Field("amount")
    private Double amount;

    @NotNull(message = "Type is required")
    @Field("type")
    private TransactionType type;

    @NotNull(message = "Date is required")
    @Field("date")
    private LocalDate date;

    @Field("category")
    private String category;

    // Default constructor
    public Transaction() {
    }

    // Constructor with fields
    public Transaction(String description, Double amount, TransactionType type, LocalDate date, String category) {
        this.description = description;
        this.amount = amount;
        this.type = type;
        this.date = date;
        this.category = category;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "id='" + id + '\'' +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                ", type=" + type +
                ", date=" + date +
                ", category='" + category + '\'' +
                '}';
    }
}

