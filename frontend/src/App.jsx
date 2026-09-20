import { useState } from 'react';
import TypeaheadSearch from './components/TypeaheadSearch.jsx';

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true" />
      <main className="hero">
        <p className="brand">Typeflow</p>
        <h1 className="headline">Find it as you type.</h1>
        <p className="subcopy">
          Autocomplete powered by Spring Boot and Supabase PostgreSQL.
        </p>
        <TypeaheadSearch onSelect={setSelected} />
        {selected ? (
          <p className="selection" role="status">
            Selected <strong>{selected.name}</strong>
            <span className="selection-meta"> · {selected.category}</span>
          </p>
        ) : (
          <p className="hint">Try “react”, “spring”, or “postgres”.</p>
        )}
      </main>
    </div>
  );
}
