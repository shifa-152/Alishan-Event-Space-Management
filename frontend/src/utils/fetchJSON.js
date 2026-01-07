export async function fetchJSON(url, options = {}) {
  const res = await fetch(url, options);

  const text = await res.text(); // 👈 read raw response first
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text || "Invalid server response");
  }

  if (!res.ok) {
    throw new Error(data.message || text || "Request failed");
  }

  return data;
}
