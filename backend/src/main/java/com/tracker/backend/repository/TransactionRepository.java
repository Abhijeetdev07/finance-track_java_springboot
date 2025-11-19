package com.tracker.backend.repository;

import com.tracker.backend.model.Transaction;
import com.tracker.backend.model.TransactionType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {

    // Inherited methods from MongoRepository (automatically available):
    // - save(Transaction entity) - Save/create transaction
    // - findAll() - Get all transactions
    // - findById(String id) - Get transaction by ID
    // - deleteById(String id) - Delete transaction by ID
    // - existsById(String id) - Check if transaction exists
    // - count() - Count all transactions
    // - delete(Transaction entity) - Delete transaction
    // - deleteAll() - Delete all transactions

    // Custom query methods (Spring Data MongoDB automatically implements these based on method names)

    /**
     * Find all transactions by type (INCOME or EXPENSE)
     * @param type The transaction type (INCOME or EXPENSE)
     * @return List of transactions matching the type
     */
    List<Transaction> findByType(TransactionType type);

    /**
     * Find all transactions within a date range
     * @param startDate The start date (inclusive)
     * @param endDate The end date (inclusive)
     * @return List of transactions within the date range
     */
    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);

    /**
     * Find all transactions by type within a date range
     * @param type The transaction type (INCOME or EXPENSE)
     * @param startDate The start date (inclusive)
     * @param endDate The end date (inclusive)
     * @return List of transactions matching type and date range
     */
    List<Transaction> findByTypeAndDateBetween(TransactionType type, LocalDate startDate, LocalDate endDate);

    /**
     * Find all transactions by category
     * @param category The transaction category
     * @return List of transactions matching the category
     */
    List<Transaction> findByCategory(String category);
}

