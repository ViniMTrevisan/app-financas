package trevisan.vinicius.Finance.dtos;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import trevisan.vinicius.Finance.model.TransactionType;

import java.time.LocalDate;

@Data
public class TransactionResponseDTO {
    private Long id;
    private LocalDate date;
    private Double amount;
    private String description;
    @Enumerated(EnumType.STRING)
    private TransactionType type;
}
