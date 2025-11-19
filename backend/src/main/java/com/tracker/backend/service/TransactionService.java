package com.tracker.backend.service;

import com.tracker.backend.model.Transaction;
import com.tracker.backend.model.TransactionType;
import com.tracker.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    // Constructor injection (recommended approach)
    @Autowired
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    /**
     * Get all transactions
     * @return List of all transactions
     */
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    /**
     * Get a single transaction by ID
     * @param id The transaction ID
     * @return Transaction if found
     * @throws RuntimeException if transaction not found
     */
    public Transaction getTransactionById(String id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    /**
     * Create a new transaction
     * @param transaction The transaction to create
     * @return The created transaction
     */
    public Transaction createTransaction(Transaction transaction) {
        // Validation is handled by @Valid annotation in controller
        // Additional business logic validation can be added here if needed
        validateTransaction(transaction);
        return transactionRepository.save(transaction);
    }

    /**
     * Update an existing transaction
     * @param id The transaction ID to update
     * @param transaction The updated transaction data
     * @return The updated transaction
     * @throws RuntimeException if transaction not found
     */
    public Transaction updateTransaction(String id, Transaction transaction) {
        // Check if transaction exists
        Transaction existingTransaction = getTransactionById(id);
        
        // Update fields
        existingTransaction.setDescription(transaction.getDescription());
        existingTransaction.setAmount(transaction.getAmount());
        existingTransaction.setType(transaction.getType());
        existingTransaction.setDate(transaction.getDate());
        existingTransaction.setCategory(transaction.getCategory());
        
        // Validate before saving
        validateTransaction(existingTransaction);
        
        return transactionRepository.save(existingTransaction);
    }

    /**
     * Delete a transaction by ID
     * @param id The transaction ID to delete
     * @throws RuntimeException if transaction not found
     */
    public void deleteTransaction(String id) {
        // Check if transaction exists before deleting
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
    }

    /**
     * Calculate current balance (sum of income - sum of expenses)
     * @return The current balance
     */
    public Double calculateBalance() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        
        double totalIncome = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        double totalExpenses = allTransactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        return totalIncome - totalExpenses;
    }

    /**
     * Get all income transactions
     * @return List of income transactions
     */
    public List<Transaction> getIncomeTransactions() {
        return transactionRepository.findByType(TransactionType.INCOME);
    }

    /**
     * Get all expense transactions
     * @return List of expense transactions
     */
    public List<Transaction> getExpenseTransactions() {
        return transactionRepository.findByType(TransactionType.EXPENSE);
    }

    /**
     * Validate transaction before saving
     * Additional business logic validation beyond JPA annotations
     * @param transaction The transaction to validate
     * @throws IllegalArgumentException if validation fails
     */
    private void validateTransaction(Transaction transaction) {
        if (transaction.getDescription() == null || transaction.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Transaction description cannot be empty");
        }
        
        if (transaction.getAmount() == null || transaction.getAmount() <= 0) {
            throw new IllegalArgumentException("Transaction amount must be positive");
        }
        
        if (transaction.getType() == null) {
            throw new IllegalArgumentException("Transaction type is required");
        }
        
        if (transaction.getDate() == null) {
            throw new IllegalArgumentException("Transaction date is required");
        }
    }
}

