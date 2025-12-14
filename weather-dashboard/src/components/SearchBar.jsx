import { useState } from "react";

export default function SearchBar() {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", city);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border px-3 py-2 rounded"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Search
      </button>
    </form>
  );
}
