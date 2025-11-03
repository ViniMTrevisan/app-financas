package trevisan.vinicius.Finance.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequestDTO {
    @NotBlank(message = "Name can't be blank")
    private String name;
}
