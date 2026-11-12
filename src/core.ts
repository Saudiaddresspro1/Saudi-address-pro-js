import type { AddressResult } from "./types";

const BASE_URL = "https://app.saudiaddresspro.com";

function mapResult(raw: Record<string, any>): AddressResult {
  return {
    shortCode: raw.shortAddress || raw.shortCode || "",
    buildingNumber: raw.buildingNumber || "",
    street: raw.street || raw.streetName || "",
    district: raw.district || "",
    city: raw.city || "",
    postalCode: raw.postalCode || "",
    additionalNumber: raw.additionalNumber ?? undefined,
    unitNumber: raw.unitNumber ?? undefined,
    latitude: raw.latitude ?? undefined,
    longitude: raw.longitude ?? undefined,
  };
}

export async function searchAddresses(
  query: string,
  apiKey?: string,
  lang: "en" | "ar" = "en",
  limit = 5
): Promise<AddressResult[]> {
  if (!query || query.length < 2) return [];

  const endpoint = apiKey
    ? `${BASE_URL}/api/address/search`
    : `${BASE_URL}/api/demo/search`;

  const url = `${endpoint}?q=${encodeURIComponent(query)}&language=${lang}&limit=${limit}`;

  const headers: Record<string, string> = {};
  if (apiKey) headers["X-API-Key"] = apiKey;

  const res = await fetch(url, { headers });

  if (res.status === 429) {
    throw new Error("RATE_LIMIT");
  }
  if (!res.ok) {
    throw new Error(`API_ERROR:${res.status}`);
  }

  const data = await res.json();
  const raw: Record<string, any>[] = data.addresses ?? data.results ?? (Array.isArray(data) ? data : []);
  return raw.map(mapResult);
}
