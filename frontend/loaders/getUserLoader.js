const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export async function getUserLoader() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include',
    });

    if (!res.ok) {
      return { user: null };
    }

    const data = await res.json();
    const user = data?.data?.user ?? data?.data ?? null;
    return { user };
  } catch {
    return { user: null };
  }
}
