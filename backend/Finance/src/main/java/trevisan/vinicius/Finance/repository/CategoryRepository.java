package trevisan.vinicius.Finance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import trevisan.vinicius.Finance.model.Category;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
