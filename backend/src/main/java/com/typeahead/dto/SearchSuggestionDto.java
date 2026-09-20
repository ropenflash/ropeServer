package com.typeahead.dto;

public record SearchSuggestionDto(
    Long id,
    String name,
    String category,
    String description
) {}
