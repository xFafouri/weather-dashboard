import React, { useState, useEffect } from "react";

/** helper to fetch weather */
async function fetchWeather(city) {
  const key = import.meta.env.VITE_WEATHER_API_KEY;
  if (!key) throw new Error("Missing VITE_WEATHER_API_KEY in env");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${key}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body?.message || "Failed to fetch";
    throw new Error(message);
  }
  return res.json();
}

function SearchBar({ onSearch, initial = "" }) {
  const [value, setValue] = useState(initial);

  useEffect(() => setValue(initial), [initial]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (v) onSearch(v);
      }}
      className="w-full flex gap-3 items-center"
    >
      <input
        className="flex-1 rounded-lg px-4 py-3 bg-white/10 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-sm"
        placeholder="Enter a city (e.g. Casablanca)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg shadow"
      >
        Search
      </button>
    </form>
  );
}

function Spinner({ size = 6 }) {
  // Tailwind animate-spin + border trick
  return (
    <div
      className={`inline-block rounded-full border-4 border-white/10 border-t-white animate-spin w-${size} h-${size}`}
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      aria-hidden="true"
    />
  );
}

function WeatherCard({ data }) {
  if (!data) return null;
  const weather = data.weather && data.weather[0];
  const icon = weather?.icon;
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;

  return (
    <div className="mt-6 w-full max-w-xl card-glass">
      <div className="flex items-center gap-4">
        {iconUrl ? (
          <img src={iconUrl} alt={weather.description} className="w-24 h-24" />
        ) : (
          <div className="w-24 h-24 rounded-lg bg-white/10 flex items-center justify-center">—</div>
        )}

        <div>
          <h2 className="text-2xl font-semibold">
            {data.name}, <span className="text-sm text-white/80">{data.sys?.country}</span>
          </h2>
          <p className="text-sm text-white/80 capitalize">{weather?.description}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xs text-white/70">Temperature</div>
          <div className="text-2xl font-medium">{Math.round(data.main.temp)}°C</div>
        </div>

        <div>
          <div className="text-xs text-white/70">Humidity</div>
          <div className="text-2xl font-medium">{data.main.humidity}%</div>
        </div>

        <div>
          <div className="text-xs text-white/70">Wind</div>
          <div className="text-2xl font-medium">
            {Math.round((data.wind.speed || 0) * 3.6)} km/h
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-white/70 flex justify-between items-center">
        <div>
          <span className="text-white/80">Feels like:</span> {Math.round(data.main.feels_like)}°C
        </div>
        <div className="text-xs text-white/60">
          Last update: {data.dt ? new Date(data.dt * 1000).toLocaleTimeString() : "—"}
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="mt-4 max-w-xl w-full bg-red-600/20 border border-red-400/20 text-red-100 p-3 rounded-lg">
      {message}
    </div>
  );
}

export default function App() {
  const [city, setCity] = useState(() => localStorage.getItem("lastCity") || "Casablanca");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // initial fetch
  useEffect(() => {
    if (city) doSearch(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-refresh every 5 minutes
  useEffect(() => {
    const id = setInterval(() => {
      if (city) doSearch(city, { silent: true });
    }, 1000 * 60 * 5);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  async function doSearch(nextCity, { silent = false } = {}) {
    try {
      if (!silent) {
        setLoading(true);
        setError("");
      }
      const res = await fetchWeather(nextCity);
      setData(res);
      setCity(nextCity);
      localStorage.setItem("lastCity", nextCity);
    } catch (err) {
      setError(err.message || "Unable to fetch weather");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-tight">Weather Dashboard</h1>
          <p className="mt-2 text-white/80">Quickly search the current weather for any city.</p>
        </header>

        <main className="mx-auto flex flex-col items-center">
          <div className="w-full max-w-xl card-glass">
            <SearchBar onSearch={(c) => doSearch(c)} initial={city} />

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => doSearch(city)}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
                disabled={loading || !city}
              >
                Refresh
              </button>

              <div className="flex items-center gap-2 text-sm text-white/80">
                {loading ? (
                  <>
                    <Spinner size={5} />
                    <span>Loading…</span>
                  </>
                ) : data ? (
                  <span>Last: {data.dt ? new Date(data.dt * 1000).toLocaleTimeString() : "—"}</span>
                ) : (
                  <span>Enter a city and press Search</span>
                )}
              </div>
            </div>
          </div>

          <ErrorMessage message={error} />
          <WeatherCard data={data} />

          <footer className="footer-muted text-center">
            Built with React • Vite • Tailwind CSS — Data from OpenWeatherMap
          </footer>
        </main>
      </div>
    </div>
  );
}
