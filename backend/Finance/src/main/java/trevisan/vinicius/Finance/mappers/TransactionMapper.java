package trevisan.vinicius.Finance.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import trevisan.vinicius.Finance.dtos.TransactionRequestDTO;
import trevisan.vinicius.Finance.dtos.TransactionResponseDTO;
import trevisan.vinicius.Finance.model.Transaction;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface TransactionMapper {

    @Mapping(target = "category", ignore = true)
    Transaction toEntity(TransactionRequestDTO transaction);
    TransactionResponseDTO toDto(Transaction transaction);
    List<TransactionResponseDTO> toDtoList(List<Transaction> transactions);
    @Mapping(target = "category", ignore = true)
    void updateFromDto(TransactionRequestDTO dto, @MappingTarget Transaction transaction);
}
