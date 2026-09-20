package com.typeahead.service;

import com.typeahead.dto.SearchSuggestionDto;
import com.typeahead.model.SearchItem;
import com.typeahead.repository.SearchItemRepository;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class SearchService {

  private static final int DEFAULT_LIMIT = 8;
  private static final int MAX_LIMIT = 20;

  private final SearchItemRepository searchItemRepository;

  public SearchService(SearchItemRepository searchItemRepository) {
    this.searchItemRepository = searchItemRepository;
  }

  public List<SearchSuggestionDto> autocomplete(String query, Integer limit) {
    if (!StringUtils.hasText(query) || query.trim().length() < 1) {
      return List.of();
    }

    int pageSize = limit == null ? DEFAULT_LIMIT : Math.min(Math.max(limit, 1), MAX_LIMIT);
    String normalized = query.trim();

    return searchItemRepository.searchByQuery(normalized, PageRequest.of(0, pageSize)).stream()
        .map(this::toDto)
        .toList();
  }

  private SearchSuggestionDto toDto(SearchItem item) {
    return new SearchSuggestionDto(
        item.getId(),
        item.getName(),
        item.getCategory(),
        item.getDescription()
    );
  }
}
