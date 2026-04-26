import { useState, useEffect, useCallback } from "react";

const API_ROOT = "https://api242.onrender.com/api/homes";

export function useHomes() {
  const [homes, setHomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all homes
  const loadHomes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ROOT);
      if (!res.ok) throw new Error("Failed to load homes");
      const data = await res.json();
      setHomes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single home by ID
  const getHome = useCallback(async (id: string) => {
    const res = await fetch(`${API_ROOT}/${id}`);
    if (!res.ok) throw new Error("Failed to load home");
    return await res.json();
  }, []);

  // Update home (used for Admin)
  const updateHome = useCallback(async (id: string, body: any) => {
    const res = await fetch(`${API_ROOT}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to update home");
    await loadHomes(); // refresh list
  }, [loadHomes]);

  // Delete home
  const deleteHome = useCallback(async (id: string) => {
    const res = await fetch(`${API_ROOT}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete home");
    await loadHomes();
  }, [loadHomes]);

  // Load homes on mount
  useEffect(() => {
    loadHomes();
  }, [loadHomes]);

  return {
    homes,
    loading,
    error,
    loadHomes,
    getHome,
    updateHome,
    deleteHome,
  };
}
