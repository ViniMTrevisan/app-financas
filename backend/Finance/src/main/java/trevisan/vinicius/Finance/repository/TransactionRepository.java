package trevisan.vinicius.Finance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import trevisan.vinicius.Finance.model.Transaction;
import trevisan.vinicius.Finance.model.TransactionType;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByDateBetween(LocalDate start, LocalDate end);

    List<Transaction> findAllByType(TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.type = 'INCOME'")
    Double getTotalIncome();

    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.type = 'EXPENSE'")
    Double getTotalExpense();

    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.type = 'INCOME' AND t.date BETWEEN :startDate AND :endDate")
    Double getTotalIncomeBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0.0) FROM Transaction t WHERE t.type = 'EXPENSE' AND t.date BETWEEN :startDate AND :endDate")
    Double getTotalExpenseBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
