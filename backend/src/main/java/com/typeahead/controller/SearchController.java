package com.typeahead.controller;

import com.typeahead.dto.SearchSuggestionDto;
import com.typeahead.service.SearchService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SearchController {

  private final SearchService searchService;

  public SearchController(SearchService searchService) {
    this.searchService = searchService;
  }

  @GetMapping("/health")
  public Map<String, String> health() {
    return Map.of("status", "ok");
  }

  @GetMapping("/search")
  public List<SearchSuggestionDto> search(
      @RequestParam(name = "q", defaultValue = "") String query,
      @RequestParam(name = "limit", required = false) Integer limit
  ) {
    return searchService.autocomplete(query, limit);
  }
}
