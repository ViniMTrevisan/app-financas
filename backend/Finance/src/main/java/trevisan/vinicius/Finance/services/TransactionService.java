package trevisan.vinicius.Finance.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import trevisan.vinicius.Finance.dtos.SummaryDTO;
import trevisan.vinicius.Finance.dtos.TransactionRequestDTO;
import trevisan.vinicius.Finance.dtos.TransactionResponseDTO;
import trevisan.vinicius.Finance.exceptions.InvalidDateException;
import trevisan.vinicius.Finance.exceptions.TransactionNotFound;
import trevisan.vinicius.Finance.mappers.TransactionMapper;
import trevisan.vinicius.Finance.model.Transaction;
import trevisan.vinicius.Finance.model.TransactionType;
import trevisan.vinicius.Finance.repository.TransactionRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;

    // api/balance
    public SummaryDTO getBalanceSummary() {
        Double income = transactionRepository.getTotalIncome();
        Double expense = transactionRepository.getTotalExpense();

        return new SummaryDTO(income, expense, (income - expense));
    }

    // api/summary/weekly
    public SummaryDTO getWeeklyBalance() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);

        Double income = transactionRepository.getTotalIncomeBetweenDates(startDate, endDate);
        Double expense = transactionRepository.getTotalExpenseBetweenDates(startDate, endDate);

        return new SummaryDTO(income, expense, (income - expense));
    }

    // api/summary/monthly
    public SummaryDTO getMonthlyBalance() {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.withDayOfMonth(1);

        Double income = transactionRepository.getTotalIncomeBetweenDates(startDate, endDate);
        Double expense = transactionRepository.getTotalExpenseBetweenDates(startDate, endDate);

        return new SummaryDTO(income, expense, (income - expense));
    }

    public List<Transaction> findByDateBetween(LocalDate start, LocalDate end){
        if (start.isAfter(end)) {
            throw new InvalidDateException("Start date is after end date");
        }
        return transactionRepository.findAllByDateBetween(start, end);
    }

    public List<Transaction> findByType(TransactionType type) {
        if (type == TransactionType.INCOME) {}
         return transactionRepository.findAllByType(type);
    }

    public TransactionResponseDTO createTransaction(TransactionRequestDTO requestDTO) {
        var transaction = transactionMapper.toEntity(requestDTO);

        var savedTransaction = transactionRepository.save(transaction);

        return transactionMapper.toDto(savedTransaction);
    }

    public List<TransactionResponseDTO> getAllTransactions(){

        List<Transaction> transactions = transactionRepository.findAll();

        return transactions.stream()
                .map(transactionMapper::toDto)
                .toList();
    }

    public TransactionResponseDTO getSingleTransactionById(@PathVariable Long id) {
        var transaction = transactionRepository.findById(id).orElseThrow(
                () -> new TransactionNotFound("Transaction not found")
        );
        return transactionMapper.toDto(transaction);
    }

    public TransactionResponseDTO updateTransactionById(
            @PathVariable Long id, TransactionRequestDTO requestDTO) {

        var transaction = transactionRepository.findById(id).orElseThrow(
                () -> new TransactionNotFound("Transaction not found")
        );

        transactionMapper.updateFromDto(requestDTO, transaction);

        return transactionMapper.toDto(transactionRepository.save(transaction));
    }
    public void deleteSingleTransaction(Long id) {
        var transaction = transactionRepository.findById(id).orElse(null);
        if (transaction == null) {
            throw new TransactionNotFound("Transaction not found");
        }
        transactionRepository.delete(transaction);
    }
}
