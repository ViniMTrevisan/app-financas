package trevisan.vinicius.Finance.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import trevisan.vinicius.Finance.dtos.TransactionRequestDTO;
import trevisan.vinicius.Finance.dtos.TransactionResponseDTO;
import trevisan.vinicius.Finance.model.Transaction;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    Transaction toEntity(TransactionResponseDTO transaction);
    Transaction toEntity(TransactionRequestDTO transaction);
    TransactionResponseDTO toDto(Transaction transaction);
    List<TransactionResponseDTO> toDtoList(List<Transaction> transactions);

    void updateFromDto(TransactionRequestDTO dto, @MappingTarget Transaction transaction);
}
