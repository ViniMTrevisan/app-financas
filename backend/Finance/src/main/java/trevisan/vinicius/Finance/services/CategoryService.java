package trevisan.vinicius.Finance.services;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import trevisan.vinicius.Finance.dtos.CategoryRequestDTO;
import trevisan.vinicius.Finance.dtos.CategoryResponseDTO;
import trevisan.vinicius.Finance.exceptions.CategoryNotFound;
import trevisan.vinicius.Finance.mappers.CategoryMapper;
import trevisan.vinicius.Finance.model.Category;
import trevisan.vinicius.Finance.repository.CategoryRepository;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryResponseDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(categoryMapper::toDto)
                .toList();
    }

    public CategoryResponseDTO getCategoryById(Long id) {
        var catId = categoryRepository.findById(id).orElseThrow(
                () -> new CategoryNotFound("Category not found with id " + id)
        );
        return categoryMapper.toDto(catId);
    }

    public CategoryResponseDTO registerCategory(CategoryRequestDTO request) {
        var category = categoryMapper.toEntity(request);
        var savedCategory = categoryRepository.save(category);
        return categoryMapper.toDto(savedCategory);
    }

    public CategoryResponseDTO updateCategory(
            @PathVariable Long id,
            CategoryRequestDTO request) {
        var category =  categoryRepository.findById(id).orElseThrow(
                () -> new CategoryNotFound("Category with id " + id + " not found")
        );

        categoryMapper.updateFromDto(request, category);

        return categoryMapper.toDto(categoryRepository.save(category));
    }

    public void deleteSingleCategory(
            @PathVariable Long id
    ) {
        var catId =  categoryRepository.findById(id).orElseThrow(
                () -> new CategoryNotFound("Category with id " + id + " not found")
        );
        categoryRepository.delete(catId);
    }
}
