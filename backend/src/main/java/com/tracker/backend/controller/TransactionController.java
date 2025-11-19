package com.tracker.backend.controller;

import com.tracker.backend.model.Transaction;
import com.tracker.backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    // Constructor injection (recommended approach)
    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * GET /api/transactions - Get all transactions
     * @return List of all transactions with 200 OK status
     */
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    /**
     * GET /api/transactions/{id} - Get single transaction by ID
     * @param id The transaction ID
     * @return Transaction with 200 OK status, or 404 Not Found if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable String id) {
        try {
            Transaction transaction = transactionService.getTransactionById(id);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/transactions - Create new transaction
     * @param transaction The transaction to create (validated)
     * @return Created transaction with 201 Created status, or 400 Bad Request if validation fails
     */
    @PostMapping
    public ResponseEntity<?> createTransaction(@Valid @RequestBody Transaction transaction) {
        try {
            Transaction createdTransaction = transactionService.createTransaction(transaction);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create transaction: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * PUT /api/transactions/{id} - Update existing transaction
     * @param id The transaction ID to update
     * @param transaction The updated transaction data (validated)
     * @return Updated transaction with 200 OK status, or 404 Not Found if not found, or 400 Bad Request if validation fails
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable String id, @Valid @RequestBody Transaction transaction) {
        try {
            Transaction updatedTransaction = transactionService.updateTransaction(id, transaction);
            return ResponseEntity.ok(updatedTransaction);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update transaction: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * DELETE /api/transactions/{id} - Delete transaction by ID
     * @param id The transaction ID to delete
     * @return Success message with 200 OK status, or 404 Not Found if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTransaction(@PathVariable String id) {
        try {
            transactionService.deleteTransaction(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Transaction deleted successfully");
            response.put("id", id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * GET /api/transactions/balance - Get current balance
     * @return Balance information with 200 OK status
     */
    @GetMapping("/balance")
    public ResponseEntity<Map<String, Double>> getBalance() {
        Double balance = transactionService.calculateBalance();
        Map<String, Double> response = new HashMap<>();
        response.put("balance", balance);
        return ResponseEntity.ok(response);
    }
}

