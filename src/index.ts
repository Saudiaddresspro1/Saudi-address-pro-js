export { searchAddresses } from "./core";
export type { AddressResult, SaudiAddressConfig } from "./types";

const BASE_URL = "https://app.saudiaddresspro.com";

interface VanillaConfig {
  container: string | HTMLElement;
  apiKey?: string;
  lang?: "en" | "ar";
  placeholder?: string;
  countryField?: string;
  onSelect: (address: import("./types").AddressResult) => void;
}

export function init(config: VanillaConfig): { destroy: () => void } {
  const container =
    typeof config.container === "string"
      ? document.querySelector<HTMLElement>(config.container)
      : config.container;

  if (!container) throw new Error(`[saudi-address-pro] Container not found: ${config.container}`);

  const lang = config.lang ?? "en";
  const isRtl = lang === "ar";
  const ph =
    config.placeholder ??
    (isRtl
      ? "أدخل الرمز المختصر أو ابحث عن العنوان..."
      : "Enter short code or search address...");

  container.style.position = "relative";
  container.style.direction = isRtl ? "rtl" : "ltr";
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = ph;
  input.autocomplete = "off";
  input.setAttribute("spellcheck", "false");
  Object.assign(input.style, {
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#111827",
    direction: isRtl ? "rtl" : "ltr",
  });

  const dropdown = document.createElement("div");
  Object.assign(dropdown.style, {
    display: "none",
    position: "absolute",
    top: "calc(100% + 4px)",
    left: "0",
    right: "0",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    zIndex: "9999",
    maxHeight: "280px",
    overflowY: "auto",
  });

  container.appendChild(input);
  container.appendChild(dropdown);

  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let currentResults: import("./types").AddressResult[] = [];
  let activeIdx = -1;

  const renderDropdown = () => {
    dropdown.innerHTML = "";
    if (!currentResults.length) { dropdown.style.display = "none"; return; }

    currentResults.forEach((addr, i) => {
      const item = document.createElement("div");
      Object.assign(item.style, {
        padding: "10px 14px",
        cursor: "pointer",
        borderBottom: i < currentResults.length - 1 ? "1px solid #f3f4f6" : "none",
        backgroundColor: i === activeIdx ? "#f0fdf4" : "#ffffff",
      });
      item.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:2px;">
          ${addr.shortCode ? `<span style="font-family:monospace;font-size:11px;font-weight:700;color:#1a7f4b;background:#f0fdf4;padding:1px 6px;border-radius:4px;border:1px solid #bbf7d0;">${addr.shortCode}</span>` : ""}
          <span style="font-size:13px;color:#111827;font-weight:500;">${[addr.street, addr.district].filter(Boolean).join(", ")}</span>
        </div>
        <div style="font-size:12px;color:#6b7280;">${[addr.city, addr.postalCode].filter(Boolean).join(" · ")}</div>
      `;
      item.addEventListener("mousedown", () => {
        input.value = addr.shortCode || addr.city;
        dropdown.style.display = "none";
        config.onSelect(addr);
      });
      item.addEventListener("mouseenter", () => {
        activeIdx = i;
        renderDropdown();
      });
      dropdown.appendChild(item);
    });

    const brand = document.createElement("div");
    brand.style.cssText = `padding:5px 14px;text-align:${isRtl ? "left" : "right"};border-top:1px solid #f3f4f6;`;
    brand.innerHTML = `<a href="https://saudiaddresspro.com" target="_blank" rel="noopener noreferrer" style="font-size:10px;color:#9ca3af;text-decoration:none;">powered by Saudi Address Pro</a>`;
    dropdown.appendChild(brand);
    dropdown.style.display = "block";
  };

  input.addEventListener("input", () => {
    const val = input.value;
    activeIdx = -1;
    if (debounceTimer) clearTimeout(debounceTimer);
    if (val.length < 2) { currentResults = []; renderDropdown(); return; }

    debounceTimer = setTimeout(async () => {
      const endpoint = config.apiKey
        ? `${BASE_URL}/api/address/search`
        : `${BASE_URL}/api/demo/search`;
      const url = `${endpoint}?q=${encodeURIComponent(val)}&language=${lang}&limit=5`;
      const headers: Record<string, string> = {};
      if (config.apiKey) headers["X-API-Key"] = config.apiKey;
      try {
        const res = await fetch(url, { headers });
        if (!res.ok) return;
        const data = await res.json();
        const raw = data.addresses ?? data.results ?? (Array.isArray(data) ? data : []);
        currentResults = raw.map((r: Record<string, any>) => ({
          shortCode: r.shortAddress || r.shortCode || "",
          buildingNumber: r.buildingNumber || "",
          street: r.street || "",
          district: r.district || "",
          city: r.city || "",
          postalCode: r.postalCode || "",
          additionalNumber: r.additionalNumber,
          unitNumber: r.unitNumber,
          latitude: r.latitude,
          longitude: r.longitude,
        }));
        renderDropdown();
      } catch {}
    }, 300);
  });

  input.addEventListener("keydown", (e) => {
    if (!currentResults.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, currentResults.length - 1); renderDropdown(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); renderDropdown(); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); input.value = currentResults[activeIdx].shortCode || currentResults[activeIdx].city; dropdown.style.display = "none"; config.onSelect(currentResults[activeIdx]); }
    else if (e.key === "Escape") { dropdown.style.display = "none"; }
  });

  const closeOnOutside = (e: MouseEvent) => {
    if (!container.contains(e.target as Node)) dropdown.style.display = "none";
  };
  document.addEventListener("mousedown", closeOnOutside);

  if (config.countryField) {
    const checkCountry = () => {
      const el = document.querySelector(config.countryField!) as HTMLSelectElement | null;
      if (!el) return;
      const v = el.value.toUpperCase().trim();
      const show = v === "SA" || v === "SAU" || v === "966" || v === "SAUDI ARABIA";
      container.style.display = show ? "" : "none";
    };
    checkCountry();
    document.querySelector(config.countryField)?.addEventListener("change", checkCountry);
  }

  return {
    destroy() {
      document.removeEventListener("mousedown", closeOnOutside);
      container.innerHTML = "";
    },
  };
}
