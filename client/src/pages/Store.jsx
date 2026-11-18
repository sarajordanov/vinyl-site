import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AlbumCard from "../components/AlbumCard";
import PriceSlider from "../components/PriceSlider";
import "./Store.css";
import Dropdown from "../components/DropDown";

// Fetch JSON, and treat an error answer from the server as a failure
function getJson(url) {
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  });
}
const sortChoices = [
  { value: "", label: "Recommended" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "title", label: "Title A-Z" },
  { value: "newest", label: "Newest" },
];

export default function Store() {
  // The filters live in the address, e.g. /store?genre=Pop
  const [searchParams, setSearchParams] = useSearchParams();

  const [albums, setAlbums] = useState(null); // null means "still loading"
  const [options, setOptions] = useState({ genres: [], artists: [], bounds: null });
  const [error, setError] = useState(false);

  // Read the current filters from the address
  const q = searchParams.get("q") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const artist = searchParams.get("artist") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const sort = searchParams.get("sort") ?? "";

  // Once, when the page opens: load all albums to build the lists and the price range
  useEffect(() => {
    getJson("/api/albums")
      .then((all) => {
        const prices = all.map((a) => a.price_cents);
        setOptions({
          genres: [...new Set(all.map((a) => a.genre).filter(Boolean))].sort(),
          artists: [...new Set(all.map((a) => a.artist))].sort(),
          bounds: {
            min: Math.floor(Math.min(...prices) / 100),
            max: Math.ceil(Math.max(...prices) / 100),
          },
        });
      })
      .catch(() => setError(true));
  }, []);

  // Every time the filters change: ask the server for the matching albums
  useEffect(() => {
    let ignore = false; // protects us if an older answer arrives late

    getJson(`/api/albums?${searchParams.toString()}`)
      .then((data) => {
        if (!ignore) setAlbums(data);
      })
      .catch(() => setError(true));

    return () => {
      ignore = true;
    };
  }, [searchParams]);

  // Change one filter in the address. An empty value removes it.
  function updateFilter(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    setSearchParams(next, { replace: true });
  }

  // Change both ends of the price range at once.
  // A handle sitting at the end of the track means "no limit", so it is removed.
  function updatePrice(low, high) {
    const { min, max } = options.bounds;
    const next = new URLSearchParams(searchParams);
    if (low > min) next.set("minPrice", String(low));
    else next.delete("minPrice");
    if (high < max) next.set("maxPrice", String(high));
    else next.delete("maxPrice");
    setSearchParams(next, { replace: true });
  }

  function clearFilters() {
    setSearchParams({});
  }

  if (error) {
    return <p className="store-message">Could not load the albums. Is the server running?</p>;
  }

  return (
    <main className="store-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">All Products</span>
      </nav>

      <div className="store-layout">
        <aside className="sidebar">
          <input
            type="search"
            className="search-input"
            aria-label="Search by title or artist"
            placeholder="Search title or artist"
            value={q}
            onChange={(e) => updateFilter("q", e.target.value)}
          />

          <h2>Browse by</h2>
          <ul className="browse">
            <li>
              <button
                type="button"
                aria-current={!genre ? "true" : undefined}
                onClick={() => updateFilter("genre", "")}
              >
                All Products
              </button>
            </li>
            {options.genres.map((g) => (
              <li key={g}>
                <button
                  type="button"
                  aria-current={genre === g ? "true" : undefined}
                  onClick={() => updateFilter("genre", g)}
                >
                  {g}
                </button>
              </li>
            ))}
          </ul>

          <h2>Filter by</h2>

          {options.bounds && (
            <PriceSlider
              min={options.bounds.min}
              max={options.bounds.max}
              low={Number(minPrice) || options.bounds.min}
              high={Number(maxPrice) || options.bounds.max}
              onCommit={updatePrice}
            />
          )}

                    <Dropdown
            
            direction="up"
            value={artist}
            onChange={(value) => updateFilter("artist", value)}
            options={[
              { value: "", label: "All artists" },
              ...options.artists.map((name) => ({ value: name, label: name })),
            ]}
          />

          <button type="button" className="btn btn-lime" onClick={clearFilters}>
            Clear filters
          </button>
        </aside>

        <section className="results">
          <h1>{genre || "All Products"}</h1>

          <div className="results-bar">
            <p role="status">
              {albums === null
                ? "Loading records..."
                : `${albums.length} ${albums.length === 1 ? "record" : "records"}`}
            </p>

                        <Dropdown
              prefix="Sort by:"
              align="right"
              value={sort}
              onChange={(value) => updateFilter("sort", value)}
              options={sortChoices}
            />
          </div>

          {albums && albums.length === 0 && (
            <p>
              No records match these filters.{" "}
              <button type="button" className="link-button" onClick={clearFilters}>
                Clear the filters
              </button>
            </p>
          )}

          {albums && albums.length > 0 && (
            <div className="store-grid">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}