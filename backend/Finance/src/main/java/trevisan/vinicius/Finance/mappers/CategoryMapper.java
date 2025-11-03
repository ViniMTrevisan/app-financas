package trevisan.vinicius.Finance.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import trevisan.vinicius.Finance.dtos.CategoryRequestDTO;
import trevisan.vinicius.Finance.dtos.CategoryResponseDTO;
import trevisan.vinicius.Finance.model.Category;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    Category toEntity(CategoryRequestDTO request);
    CategoryResponseDTO toDto(Category category);
    List<CategoryResponseDTO> toDtoList(List<Category> categories);

    void updateFromDto(CategoryRequestDTO request, @MappingTarget Category category);
}
