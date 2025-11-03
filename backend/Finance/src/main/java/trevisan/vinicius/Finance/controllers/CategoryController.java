package trevisan.vinicius.Finance.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import trevisan.vinicius.Finance.dtos.CategoryRequestDTO;
import trevisan.vinicius.Finance.services.CategoryService;


@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(){
        return ResponseEntity.ok().body(categoryService.getAllCategories());
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<?> getCategory(@PathVariable Long id){
        return ResponseEntity.ok().body(categoryService.getCategoryById(id));
    }

    @PostMapping("/categories")
    public ResponseEntity<?> registerCategory(
            @Valid @RequestBody CategoryRequestDTO request,
            UriComponentsBuilder uriBuilder
    ) {
        var dto = categoryService.registerCategory(request);
        var uri =  uriBuilder.path("/categories/{id}").buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategoryById(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequestDTO request
    ) {
        return ResponseEntity.ok().body(categoryService.updateCategory(id, request));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategoryById(
            @PathVariable Long id
    ) {
        categoryService.deleteSingleCategory(id);
        return ResponseEntity.noContent().build();
    }
}
