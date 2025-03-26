'use client';

import { useEffect, useState } from 'react';

type Motorcycle = {
  id: string;
  name: string;
  createdAt: string;
};

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

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
    } else {
      const { error } = await res.json();
      setError(error || 'Failed to load motorcycles.');
    }
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

      <ul>
        {motorcycles.map((moto) => (
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