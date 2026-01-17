"use client";

import { useEffect, useMemo, useState } from "react";

const sampleSnippets = [
  {
    id: "snip-1",
    title: "Fetch JSON with timeout",
    language: "javascript",
    tags: ["api", "fetch"],
    code: "const controller = new AbortController();\nconst timeout = setTimeout(() => controller.abort(), 4000);\nconst res = await fetch(url, { signal: controller.signal });\nclearTimeout(timeout);\nreturn res.json();"
  },
  {
    id: "snip-2",
    title: "SQLite insert helper",
    language: "sql",
    tags: ["db", "sqlite"],
    code: "INSERT INTO snippets (id, title, code, language, tags, created_at, updated_at)\nVALUES (@id, @title, @code, @language, @tags, @created_at, @updated_at);"
  },
  {
    id: "snip-3",
    title: "Zod validation schema",
    language: "javascript",
    tags: ["validation", "zod"],
    code: "const SnippetSchema = z.object({\n  title: z.string().min(1),\n  code: z.string().min(1),\n  language: z.string().min(1),\n  tags: z.array(z.string()).optional()\n});"
  }
];

const defaultForm = {
  title: "",
  language: "",
  tags: "",
  code: ""
};

export default function Page() {
  const [snippets, setSnippets] = useState(sampleSnippets);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ query: "", language: "", tag: "" });
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "");
  const [useApi, setUseApi] = useState(Boolean(process.env.NEXT_PUBLIC_API_URL));
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = apiUrl.replace(/\/$/, "");
  const apiEnabled = useApi && baseUrl.length > 0;

  const languages = useMemo(() => {
    const list = new Set(snippets.map((item) => item.language).filter(Boolean));
    return Array.from(list).sort();
  }, [snippets]);

  const visibleSnippets = useMemo(() => {
    if (apiEnabled) {
      return snippets;
    }
    const query = filters.query.trim().toLowerCase();
    const tag = filters.tag.trim().toLowerCase();
    return snippets.filter((snippet) => {
      const matchesQuery =
        !query ||
        snippet.title.toLowerCase().includes(query) ||
        snippet.code.toLowerCase().includes(query);
      const matchesLanguage =
        !filters.language || snippet.language === filters.language;
      const matchesTag =
        !tag || snippet.tags.some((entry) => entry.toLowerCase().includes(tag));
      return matchesQuery && matchesLanguage && matchesTag;
    });
  }, [snippets, filters, apiEnabled]);

  useEffect(() => {
    if (apiEnabled) {
      refreshSnippets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiEnabled]);

  async function refreshSnippets() {
    if (!apiEnabled) {
      setSnippets(sampleSnippets);
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const params = new URLSearchParams();
      if (!filters.query) {
        if (filters.language) params.set("language", filters.language);
        if (filters.tag) params.set("tag", filters.tag);
        const res = await fetch(`${baseUrl}/api/snippets?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load snippets.");
        setSnippets(data);
      } else {
        const res = await fetch(
          `${baseUrl}/api/snippets/search?q=${encodeURIComponent(filters.query)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to search snippets.");
        setSnippets(data);
      }
      setStatus({ type: "success", message: "Synced with API." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function parseTags(input) {
    return input
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);
    const payload = {
      title: form.title.trim(),
      language: form.language.trim(),
      code: form.code.trim(),
      tags: parseTags(form.tags)
    };
    if (!payload.title || !payload.language || !payload.code) {
      setStatus({ type: "error", message: "Title, language, and code are required." });
      return;
    }
    setLoading(true);
    try {
      if (apiEnabled) {
        const target = editingId
          ? `${baseUrl}/api/snippets/${editingId}`
          : `${baseUrl}/api/snippets`;
        const method = editingId ? "PUT" : "POST";
        const res = await fetch(target, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Request failed.");
        await refreshSnippets();
      } else {
        setSnippets((prev) => {
          if (editingId) {
            return prev.map((item) =>
              item.id === editingId ? { ...item, ...payload } : item
            );
          }
          const next = {
            id: `snip-${Date.now()}`,
            ...payload
          };
          return [next, ...prev];
        });
      }
      setForm(defaultForm);
      setEditingId(null);
      setStatus({
        type: "success",
        message: editingId ? "Snippet updated." : "Snippet created."
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(snippet) {
    setEditingId(snippet.id);
    setForm({
      title: snippet.title,
      language: snippet.language,
      tags: snippet.tags.join(", "),
      code: snippet.code
    });
    setStatus(null);
  }

  async function handleDelete(snippetId) {
    setStatus(null);
    setLoading(true);
    try {
      if (apiEnabled) {
        const res = await fetch(`${baseUrl}/api/snippets/${snippetId}`, {
          method: "DELETE"
        });
        if (!res.ok) throw new Error("Delete failed.");
        await refreshSnippets();
      } else {
        setSnippets((prev) => prev.filter((item) => item.id !== snippetId));
      }
      setStatus({ type: "success", message: "Snippet removed." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(defaultForm);
    setEditingId(null);
  }

  return (
    <main className="page">
      <section className="hero">
        <span className="tag">API-first workspace</span>
        <h1>Snippet Manager Studio</h1>
        <p>
          A focused front end for capturing, filtering, and refining code snippets.
          Switch between demo data and your live API in seconds.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#composer">
            Create snippet
          </a>
          <a className="button button-secondary" href="#collection">
            Browse library
          </a>
        </div>
      </section>

      <section className="grid columns-2">
        <div className="panel" id="composer">
          <h2>{editingId ? "Edit snippet" : "Create a new snippet"}</h2>
          <p className="muted">
            Keep drafts clean with tags and a language label. Use commas to split tags.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                placeholder="Readable name for the snippet"
              />
            </div>
            <div className="field">
              <label htmlFor="language">Language</label>
              <input
                id="language"
                value={form.language}
                onChange={(event) => updateForm("language", event.target.value)}
                placeholder="javascript, python, sql"
              />
            </div>
            <div className="field">
              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                value={form.tags}
                onChange={(event) => updateForm("tags", event.target.value)}
                placeholder="api, fetch, helpers"
              />
            </div>
            <div className="field">
              <label htmlFor="code">Code</label>
              <textarea
                id="code"
                value={form.code}
                onChange={(event) => updateForm("code", event.target.value)}
                placeholder="Paste the snippet here"
              />
            </div>
            <div className="controls">
              <button className="button button-primary" type="submit" disabled={loading}>
                {editingId ? "Save changes" : "Save snippet"}
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={resetForm}
                disabled={loading}
              >
                Clear form
              </button>
            </div>
          </form>
          {status && (
            <div className={`status ${status.type}`}>
              {status.message}
            </div>
          )}
        </div>

        <div className="panel">
          <h2>Connection</h2>
          <p className="muted">
            Point the UI at your live API or stay in demo mode. Use the environment
            variable NEXT_PUBLIC_API_URL on Vercel to set this automatically.
          </p>
          <div className="field">
            <label htmlFor="api-url">API base URL</label>
            <input
              id="api-url"
              value={apiUrl}
              onChange={(event) => setApiUrl(event.target.value)}
              placeholder="https://your-api.example.com"
            />
          </div>
          <div className="controls">
            <button
              className="button button-primary"
              type="button"
              onClick={() => setUseApi(true)}
              disabled={loading || !baseUrl}
            >
              Use API
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setUseApi(false)}
              disabled={loading}
            >
              Demo mode
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={refreshSnippets}
              disabled={loading || !apiEnabled}
            >
              {loading ? "Syncing..." : "Refresh"}
            </button>
          </div>
          <div className="status">
            Mode: {apiEnabled ? "Live API" : "Demo data"}
          </div>
        </div>
      </section>

      <section className="panel" id="collection">
        <h2>Snippet library</h2>
        <p className="muted">
          Filter by language, tag, or keywords. Results update instantly in demo mode.
        </p>
        <div className="grid columns-3">
          <div className="field">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              value={filters.query}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, query: event.target.value }))
              }
              placeholder="Search title or code"
            />
          </div>
          <div className="field">
            <label htmlFor="language-filter">Language</label>
            <select
              id="language-filter"
              value={filters.language}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, language: event.target.value }))
              }
            >
              <option value="">All languages</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tag-filter">Tag</label>
            <input
              id="tag-filter"
              value={filters.tag}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, tag: event.target.value }))
              }
              placeholder="api, db, auth"
            />
          </div>
        </div>
        <div className="controls">
          <button
            className="button button-primary"
            type="button"
            onClick={refreshSnippets}
            disabled={loading}
          >
            Apply filters
          </button>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setFilters({ query: "", language: "", tag: "" })}
          >
            Reset
          </button>
        </div>
        <div className="snippet-grid">
          {visibleSnippets.map((snippet, index) => (
            <div
              key={snippet.id}
              className="snippet-card"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="snippet-title">{snippet.title}</div>
              <div className="snippet-meta">
                <span className="tag">{snippet.language}</span>
                {snippet.tags.map((tag) => (
                  <span className="tag" key={`${snippet.id}-${tag}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <pre className="code-block">
                <code>{snippet.code}</code>
              </pre>
              <div className="controls">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => handleEdit(snippet)}
                >
                  Edit
                </button>
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => handleDelete(snippet.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {visibleSnippets.length === 0 && (
            <div className="status">No snippets match the current filters.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Deploy on Vercel</h2>
        <p className="muted">
          The frontend lives in the web directory. Set the Vercel Root Directory to
          web and configure NEXT_PUBLIC_API_URL to point at your API server.
        </p>
        <div className="grid columns-3">
          <div>
            <div className="tag">Build command</div>
            <p>npm run build</p>
          </div>
          <div>
            <div className="tag">Output</div>
            <p>Next.js default</p>
          </div>
          <div>
            <div className="tag">Env var</div>
            <p>NEXT_PUBLIC_API_URL</p>
          </div>
        </div>
      </section>
    </main>
  );
}
