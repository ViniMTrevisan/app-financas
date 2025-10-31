package trevisan.vinicius.Finance.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryDTO {

    private Double totalIncome;
    private Double totalExpense;
    private Double netBalance;
}
