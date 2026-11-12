import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
} from "react";
import type { AddressResult, SaudiAddressConfig } from "./types";
import { searchAddresses } from "./core";

export interface SaudiAddressInputProps extends SaudiAddressConfig {
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

const GREEN = "#1a7f4b";
const BORDER = "#e5e7eb";
const HOVER_BG = "#f0fdf4";
const TEXT = "#111827";
const MUTED = "#6b7280";

export function SaudiAddressInput({
  apiKey,
  onSelect,
  placeholder,
  lang = "en",
  countryField,
  className,
  style,
  disabled = false,
}: SaudiAddressInputProps) {
  const isRtl = lang === "ar";
  const ph =
    placeholder ??
    (isRtl
      ? "أدخل الرمز المختصر أو ابحث عن العنوان..."
      : "Enter short code or search address...");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [visible, setVisible] = useState(!countryField);
  const [rateLimited, setRateLimited] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!countryField) return;
    const check = () => {
      const el = document.querySelector(countryField) as HTMLSelectElement | HTMLInputElement | null;
      if (!el) return;
      const v = el.value.toUpperCase().trim();
      setVisible(
        v === "SA" || v === "SAU" || v === "966" ||
        v === "SAUDI ARABIA" || v === "المملكة العربية السعودية"
      );
    };
    check();
    const el = document.querySelector(countryField);
    if (el) {
      el.addEventListener("change", check);
      return () => el.removeEventListener("change", check);
    }
  }, [countryField]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = useCallback(
    async (val: string) => {
      if (val.length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const data = await searchAddresses(val, apiKey, lang);
        setResults(data);
        setOpen(data.length > 0);
      } catch (err: any) {
        if (String(err?.message).startsWith("RATE_LIMIT")) setRateLimited(true);
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, lang]
  );

  const handleChange = (val: string) => {
    setQuery(val);
    setRateLimited(false);
    setActiveIdx(-1);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => doSearch(val), 300);
  };

  const handleSelect = (addr: AddressResult) => {
    setQuery(addr.shortCode || addr.city);
    setOpen(false);
    setResults([]);
    onSelect(addr);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (!visible) return null;

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "10px 38px 10px 14px",
    fontSize: "14px",
    lineHeight: "1.5",
    border: `1px solid ${BORDER}`,
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: TEXT,
    direction: isRtl ? "rtl" : "ltr",
  };

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", direction: isRtl ? "rtl" : "ltr", ...style }}
    >
      <style>{`@keyframes _sap_spin{to{transform:translateY(-50%) rotate(360deg)}}`}</style>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={ph}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          style={inputStyle}
          aria-label={isRtl ? "البحث عن العنوان الوطني السعودي" : "Saudi national address search"}
          aria-expanded={open}
          aria-autocomplete="list"
          role="combobox"
        />
        {loading && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: isRtl ? "auto" : "12px",
              left: isRtl ? "12px" : "auto",
              top: "50%",
              transform: "translateY(-50%)",
              width: "14px",
              height: "14px",
              border: `2px solid ${BORDER}`,
              borderTopColor: GREEN,
              borderRadius: "50%",
              display: "inline-block",
              animation: "_sap_spin 0.6s linear infinite",
            }}
          />
        )}
      </div>

      {rateLimited && (
        <p style={{ fontSize: "12px", color: "#dc2626", margin: "4px 0 0" }}>
          {isRtl
            ? "تم الوصول إلى الحد المجاني. أضف مفتاح API للمتابعة."
            : "Free tier limit reached. Add an API key to continue — saudiaddresspro.com"}
        </p>
      )}

      {open && results.length > 0 && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            border: `1px solid ${BORDER}`,
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            zIndex: 9999,
            maxHeight: "280px",
            overflowY: "auto",
          }}
        >
          {results.map((addr, i) => (
            <div
              key={`${addr.shortCode}-${i}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={() => handleSelect(addr)}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom: i < results.length - 1 ? `1px solid #f3f4f6` : "none",
                backgroundColor: i === activeIdx ? HOVER_BG : "#ffffff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                {addr.shortCode && (
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: GREEN,
                      backgroundColor: HOVER_BG,
                      padding: "1px 6px",
                      borderRadius: "4px",
                      border: "1px solid #bbf7d0",
                      flexShrink: 0,
                    }}
                  >
                    {addr.shortCode}
                  </span>
                )}
                <span style={{ fontSize: "13px", color: TEXT, fontWeight: 500 }}>
                  {[addr.street, addr.district].filter(Boolean).join(", ")}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: MUTED }}>
                {[addr.city, addr.postalCode].filter(Boolean).join(" · ")}
              </div>
            </div>
          ))}
          <div
            style={{
              padding: "5px 14px",
              textAlign: isRtl ? "left" : "right",
              borderTop: `1px solid #f3f4f6`,
            }}
          >
            <a
              href="https://saudiaddresspro.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "10px", color: "#9ca3af", textDecoration: "none" }}
            >
              powered by Saudi Address Pro
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export type { AddressResult, SaudiAddressConfig };
