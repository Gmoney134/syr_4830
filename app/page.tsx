'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Login failed');
    } else {
      localStorage.setItem('token', data.token); // optional, for future auth use
      router.push('/motorcycles'); // redirect after login
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-center">
      {/* ✅ TITLE AND DESCRIPTION */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Store Your Rides</h1>
        <p className="text-gray-600 text-lg">
          Easily save, view, and manage your favorite motorcycles in one place.
        </p>
      </div>

      {/* ✅ LOGIN FORM */}
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80 space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}

