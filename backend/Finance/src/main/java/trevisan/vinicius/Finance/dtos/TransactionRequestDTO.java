package trevisan.vinicius.Finance.dtos;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;
import trevisan.vinicius.Finance.model.TransactionType;

import java.time.LocalDate;

@Data
public class TransactionRequestDTO {
    @NotBlank(message = "Descrição não pode ser vazia")
    private String description;

    @NotNull(message = "Valor não pode ser nulo")
    private Double amount;

    @NotNull(message = "Data não pode ser nula")
    @PastOrPresent(message = "Data não pode ser no futuro")
    private LocalDate date;

    @NotNull(message = "Tipo não pode ser nulo")
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @NotNull(message = "Categoria é obrigatória")
    private Long categoryId;
}
