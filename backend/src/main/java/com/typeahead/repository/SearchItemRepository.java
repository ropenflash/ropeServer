package com.typeahead.repository;

import com.typeahead.model.SearchItem;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SearchItemRepository extends JpaRepository<SearchItem, Long> {

  @Query(
      """
      SELECT s FROM SearchItem s
      WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))
         OR LOWER(s.category) LIKE LOWER(CONCAT('%', :query, '%'))
         OR LOWER(COALESCE(s.description, '')) LIKE LOWER(CONCAT('%', :query, '%'))
      ORDER BY
        CASE WHEN LOWER(s.name) LIKE LOWER(CONCAT(:query, '%')) THEN 0 ELSE 1 END,
        s.name ASC
      """)
  List<SearchItem> searchByQuery(@Param("query") String query, Pageable pageable);
}
