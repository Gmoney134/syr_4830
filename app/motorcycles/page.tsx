'use client';

import { useEffect, useState } from 'react';

type Motorcycle = {
  id: string;
  name: string;
  createdAt: string;
};

const BRANDS = [
  'Honda',
  'Yamaha',
  'Harley-Davidson',
  'Kawasaki',
  'Suzuki',
  'BMW',
  'Ducati',
  'KTM',
  'Triumph',
  'Royal Enfield',
  'Aprilia',
  'Husqvarna',
  'MV Agusta',
  'Moto Guzzi',
  'Indian',
];

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const fetchMotorcycles = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view motorcycles.');
      return;
    }

    const res = await fetch('/api/motorcycles', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data: Motorcycle[] = await res.json();
      setMotorcycles(data);
      applyFilters(data, selectedBrand, search); // Initial filter
    } else {
      const { error } = await res.json();
      setError(error || 'Failed to load motorcycles.');
    }
  };

  const applyFilters = (data: Motorcycle[], brand: string, searchText: string) => {
    const lowerSearch = searchText.toLowerCase();
    const filtered = data.filter((m) => {
      const nameLower = m.name.toLowerCase();
      const matchesBrand = brand === 'All' || nameLower.includes(brand.toLowerCase());
      const matchesSearch = !searchText || nameLower.includes(lowerSearch);
      return matchesBrand && matchesSearch;
    });
    setFilteredMotorcycles(filtered);
  };

  const addMotorcycle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to add motorcycles.');
      return;
    }

    if (!name.trim()) return;

    const res = await fetch('/api/motorcycles', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      setName('');
      fetchMotorcycles();
    } else {
      const { error } = await res.json();
      setError(error || 'Failed to add motorcycle.');
    }
  };

  const deleteMotorcycle = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('/api/motorcycles', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchMotorcycles();
    } else {
      const { error } = await res.json();
      setError(error || 'Failed to delete motorcycle.');
    }
  };

  useEffect(() => {
    fetchMotorcycles();
  }, []);

  // Re-run filtering when brand or search changes
  useEffect(() => {
    applyFilters(motorcycles, selectedBrand, search);
  }, [selectedBrand, search, motorcycles]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4 font-semibold">My Motorcycles</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input
        className="border p-2 w-full mb-2"
        style={{ color: 'black' }}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter motorcycle name"
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full"
        onClick={addMotorcycle}
      >
        Add Motorcycle
      </button>

      {/* FILTER CONTROLS */}
      <div className="flex gap-2 mb-4">
        <select
          className="border p-2 flex-1 text-black"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="All">All Brands</option>
          {BRANDS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* SEARCH BAR */}
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 flex-1 text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* DISPLAY FILTERED LIST */}
      <ul>
        {filteredMotorcycles.map((moto) => (
          <li key={moto.id} className="border-b py-2 flex justify-between items-center">
            <span>{moto.name}</span>
            <button
              className="text-red-600 hover:underline text-sm"
              onClick={() => deleteMotorcycle(moto.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
