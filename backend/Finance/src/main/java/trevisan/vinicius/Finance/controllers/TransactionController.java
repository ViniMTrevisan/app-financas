package trevisan.vinicius.Finance.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import trevisan.vinicius.Finance.dtos.SummaryDTO;
import trevisan.vinicius.Finance.dtos.TransactionRequestDTO;
import trevisan.vinicius.Finance.dtos.TransactionResponseDTO;
import trevisan.vinicius.Finance.mappers.TransactionMapper;
import trevisan.vinicius.Finance.model.TransactionType;
import trevisan.vinicius.Finance.services.TransactionService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {
    private final TransactionMapper transactionMapper;
    private final TransactionService transactionService;

    @GetMapping("/balance")
    public ResponseEntity<SummaryDTO> getBalance() {
        return ResponseEntity.ok(transactionService.getBalanceSummary());
    }

    @GetMapping("/summary/weekly")
    public ResponseEntity<SummaryDTO> getWeeklyBalance() {
        return ResponseEntity.ok(transactionService.getWeeklyBalance());
    }

    @GetMapping("/summary/monthly")
    public ResponseEntity<SummaryDTO> getMonthlyBalance() {
        return ResponseEntity.ok(transactionService.getMonthlyBalance());
    }

    @GetMapping("/findByDate")
    public ResponseEntity<?> findAllByDateBetween(
            @RequestParam("start")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate start,
            @RequestParam("end")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate end) {
        var transactions = transactionService.findByDateBetween(start, end);
        List<TransactionResponseDTO> transactionDTO = transactionMapper.toDtoList(transactions);
        return ResponseEntity.ok().body(transactionDTO);
    }

    @GetMapping("/findByType")
    public ResponseEntity<?> findByType(
            @RequestParam("type")
            TransactionType type
    ) {
        var transactions = transactionService.findByType(type);
        List<TransactionResponseDTO> transactionDTO = transactionMapper.toDtoList(transactions);
        return ResponseEntity.ok().body(transactionDTO);
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getAllTransactions() {
        return ResponseEntity.ok().body(transactionService.getAllTransactions());
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getSingleTransactionById(id));
    }

    @PostMapping("/transactions")
    public ResponseEntity<?> registerTransaction(
            @Valid @RequestBody TransactionRequestDTO requestDTO,
            UriComponentsBuilder uriBuilder
    ) {
        var dto = transactionService.createTransaction(requestDTO);
        var uri = uriBuilder.path("/transactions/{id}").buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping("/transactions/{id}")
    public ResponseEntity<?> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequestDTO requestDTO) {
        return ResponseEntity.ok(transactionService.updateTransactionById(id, requestDTO));
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<?> deleteTransaction(
            @PathVariable Long id
    ) {
        transactionService.deleteSingleTransaction(id);
        return ResponseEntity.noContent().build();
    }
}


