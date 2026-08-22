import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { searchContacts as searchContactsApi } from "../api/contacts";

/**
 * Reusable contact search + filter hook.
 *
 * Designed to be backend-ready: when the backend search endpoint
 * (GET /api/contacts/search?query=...) ships, set `useBackend: true` and
 * this hook will offload filtering to the server via query parameters
 * instead of filtering the in-memory array. This is important for large
 * datasets so we don't load unnecessary data into the frontend.
 *
 * @param {Array} contacts - Full list of contacts to search/filter.
 * @param {Object} options
 * @param {boolean} options.favoriteOnly - Only search within favorites.
 * @param {boolean} options.useBackend - When true, call the backend
 *   search endpoint instead of filtering locally. Only works when the
 *   backend GET /api/contacts/search endpoint has shipped.
 */
const useContactSearch = (
  contacts = [],
  { favoriteOnly = false, useBackend = false } = {},
) => {
  const [searchText, setSearchText] = useState("");
  const [relationFilter, setRelationFilter] = useState("");
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [backendResults, setBackendResults] = useState(null);
  const [backendLoading, setBackendLoading] = useState(false);
  const [backendError, setBackendError] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Derive the pool of contacts to search within (client-side mode only).
  const basePool = useMemo(() => {
    if (favoriteOnly) {
      return contacts.filter((c) => c.contact_favorite === true);
    }
    return contacts;
  }, [contacts, favoriteOnly]);

  // Unique relations for the filter dropdown (client-side mode).
  const availableRelations = useMemo(() => {
    const relations = new Set();
    basePool.forEach((c) => {
      if (c.contact_relation) relations.add(c.contact_relation);
    });
    return Array.from(relations).sort();
  }, [basePool]);

  /**
   * Core search/filter function. Extracted so it can later be replaced
   * with a backend call: `searchContacts(query, filters)`.
   */
  const searchContacts = useCallback(
    (pool, query, filters) => {
      const { relation, favorite } = filters;
      const q = (query || "").trim().toLowerCase();

      return pool.filter((contact) => {
        // Text search across name, phone, email, role, relation.
        if (q) {
          const haystack = [
            contact.contact_name,
            String(contact.contact_phone || ""),
            contact.contact_email,
            contact.contact_role,
            contact.contact_relation,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (!haystack.includes(q)) return false;
        }

        // Relation filter.
        if (relation && contact.contact_relation !== relation) return false;

        // Favorite filter.
        if (favorite && contact.contact_favorite !== true) return false;

        return true;
      });
    },
    [],
  );

  // Backend search with debounce. Sends query params so large datasets
  // are filtered server-side rather than loaded fully into the frontend.
  useEffect(() => {
    if (!useBackend) return undefined;

    // Clear previous timeout.
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const hasQuery = Boolean(searchText.trim());
    const hasRelation = Boolean(relationFilter);
    const hasFavorite = Boolean(favoriteFilter);

    // No filters — nothing to fetch; show the full pool locally.
    // (Set the states asynchronously via the timeout below only when
    //  filters are actually present, avoiding cascading renders.)
    if (!hasQuery && !hasRelation && !hasFavorite) {
      return undefined;
    }

    // Debounce 300ms to avoid a request per keystroke.
    searchTimeoutRef.current = setTimeout(async () => {
      setBackendLoading(true);
      try {
        const results = await searchContactsApi(searchText, {
          relation: relationFilter,
          favorite: favoriteFilter,
        });
        setBackendResults(results);
        setBackendError(null);
      } catch (err) {
        console.error("Backend contact search failed:", err);
        setBackendError(err.response?.data?.message || "Search failed");
        setBackendResults(null);
      } finally {
        setBackendLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [useBackend, searchText, relationFilter, favoriteFilter]);

  const filteredContacts = useMemo(() => {
    const hasFilters = Boolean(
      searchText.trim() || relationFilter || favoriteFilter,
    );

    // Backend mode: results come from the server via query params.
    // When no active filters, show the full already-loaded pool instead
    // of making a wasteful request.
    if (useBackend) {
      if (!hasFilters) return basePool;
      return backendResults || [];
    }

    return searchContacts(basePool, searchText, {
      relation: relationFilter,
      favorite: favoriteFilter,
    });
  }, [
    useBackend,
    backendResults,
    basePool,
    searchText,
    relationFilter,
    favoriteFilter,
    searchContacts,
  ]);

  const hasActiveFilters = Boolean(searchText.trim() || relationFilter || favoriteFilter);

  const activeFilterCount =
    (searchText.trim() ? 1 : 0) +
    (relationFilter ? 1 : 0) +
    (favoriteFilter ? 1 : 0);

  const resetFilters = useCallback(() => {
    setSearchText("");
    setRelationFilter("");
    setFavoriteFilter(false);
    setBackendResults(null);
    setBackendError(null);
  }, []);

  return {
    searchText,
    setSearchText,
    relationFilter,
    setRelationFilter,
    favoriteFilter,
    setFavoriteFilter,
    availableRelations,
    filteredContacts,
    hasActiveFilters,
    activeFilterCount,
    resetFilters,
    searchContacts, // exposed for backend swap
    backendLoading,
    backendError,
  };
};

export default useContactSearch;