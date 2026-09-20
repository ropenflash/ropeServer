import { useEffect, useId, useRef, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function fetchSuggestions(query, signal) {
  const params = new URLSearchParams({ q: query, limit: '8' });
  const response = await fetch(`${API_BASE}/api/search?${params}`, { signal });
  if (!response.ok) {
    throw new Error(`Search failed (${response.status})`);
  }
  return response.json();
}

export default function TypeaheadSearch({ onSelect }) {
  const listboxId = useId();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      setError('');
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const results = await fetchSuggestions(trimmed, controller.signal);
        setSuggestions(results);
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Could not load suggestions.');
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function choose(item) {
    setQuery(item.name);
    setOpen(false);
    setSuggestions([]);
    onSelect?.(item);
  }

  function onKeyDown(event) {
    if (!open || suggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      choose(suggestions[activeIndex]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="typeahead">
      <label className="sr-only" htmlFor="typeahead-input">
        Search technologies
      </label>
      <div className={`search-shell ${open ? 'is-open' : ''}`}>
        <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id="typeahead-input"
          ref={inputRef}
          type="search"
          autoComplete="off"
          spellCheck="false"
          placeholder="Start typing to search…"
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          onChange={(event) => {
            setQuery(event.target.value);
            onSelect?.(null);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setOpen(true);
            }
          }}
          onBlur={() => {
            // Delay so option click can register
            window.setTimeout(() => setOpen(false), 120);
          }}
        />
        {loading ? <span className="spinner" aria-hidden="true" /> : null}
      </div>

      {error ? <p className="error">{error}</p> : null}

      {open && suggestions.length > 0 ? (
        <ul id={listboxId} className="suggestions" role="listbox">
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'is-active' : undefined}
              onMouseDown={(event) => {
                event.preventDefault();
                choose(item);
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="suggestion-name">{item.name}</span>
              <span className="suggestion-category">{item.category}</span>
              {item.description ? (
                <span className="suggestion-description">{item.description}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {open && !loading && query.trim() && suggestions.length === 0 && !error ? (
        <p className="empty">No matches for “{query.trim()}”.</p>
      ) : null}
    </div>
  );
}
