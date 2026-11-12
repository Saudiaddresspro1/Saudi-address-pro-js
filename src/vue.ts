import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  h,
  type PropType,
} from "vue";
import type { AddressResult } from "./types";
import { searchAddresses } from "./core";

export const SaudiAddressInput = defineComponent({
  name: "SaudiAddressInput",

  props: {
    apiKey: { type: String as PropType<string>, default: undefined },
    placeholder: { type: String as PropType<string>, default: undefined },
    lang: { type: String as PropType<"en" | "ar">, default: "en" },
    countryField: { type: String as PropType<string>, default: undefined },
    disabled: { type: Boolean, default: false },
    modelValue: { type: String, default: "" },
  },

  emits: ["select", "update:modelValue"],

  setup(props, { emit }) {
    const query = ref("");
    const results = ref<AddressResult[]>([]);
    const open = ref(false);
    const loading = ref(false);
    const activeIdx = ref(-1);
    const visible = ref(!props.countryField);
    const rateLimited = ref(false);
    const wrapEl = ref<HTMLElement | null>(null);

    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    const isRtl = computed(() => props.lang === "ar");
    const ph = computed(
      () =>
        props.placeholder ??
        (isRtl.value
          ? "أدخل الرمز المختصر أو ابحث عن العنوان..."
          : "Enter short code or search address...")
    );

    const checkCountry = () => {
      if (!props.countryField) return;
      const el = document.querySelector(props.countryField) as HTMLSelectElement | null;
      if (!el) return;
      const v = el.value.toUpperCase().trim();
      visible.value =
        v === "SA" || v === "SAU" || v === "966" ||
        v === "SAUDI ARABIA" || v === "المملكة العربية السعودية";
    };

    const doSearch = async (val: string) => {
      if (val.length < 2) { results.value = []; open.value = false; return; }
      loading.value = true;
      try {
        const data = await searchAddresses(val, props.apiKey, props.lang);
        results.value = data;
        open.value = data.length > 0;
      } catch (err: any) {
        if (String(err?.message).startsWith("RATE_LIMIT")) rateLimited.value = true;
        results.value = [];
        open.value = false;
      } finally {
        loading.value = false;
      }
    };

    const handleInput = (val: string) => {
      query.value = val;
      rateLimited.value = false;
      activeIdx.value = -1;
      emit("update:modelValue", val);
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => doSearch(val), 300);
    };

    const handleSelect = (addr: AddressResult) => {
      query.value = addr.shortCode || addr.city;
      open.value = false;
      results.value = [];
      emit("select", addr);
      emit("update:modelValue", query.value);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (!open.value) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIdx.value = Math.min(activeIdx.value + 1, results.value.length - 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIdx.value = Math.max(activeIdx.value - 1, 0);
      } else if (e.key === "Enter" && activeIdx.value >= 0) {
        e.preventDefault();
        handleSelect(results.value[activeIdx.value]);
      } else if (e.key === "Escape") {
        open.value = false;
      }
    };

    const handleOutside = (e: MouseEvent) => {
      if (wrapEl.value && !wrapEl.value.contains(e.target as Node)) {
        open.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("mousedown", handleOutside);
      if (props.countryField) {
        checkCountry();
        const el = document.querySelector(props.countryField);
        if (el) el.addEventListener("change", checkCountry);
      }
    });

    onBeforeUnmount(() => {
      document.removeEventListener("mousedown", handleOutside);
      if (debounceTimer) clearTimeout(debounceTimer);
    });

    const GREEN = "#1a7f4b";
    const BORDER = "#e5e7eb";
    const TEXT = "#111827";
    const MUTED = "#6b7280";

    return () => {
      if (!visible.value) return null;

      return h(
        "div",
        {
          ref: wrapEl,
          style: { position: "relative", direction: isRtl.value ? "rtl" : "ltr" },
        },
        [
          h("style", {}, "@keyframes _sap_spin{to{transform:translateY(-50%) rotate(360deg)}}"),

          h("div", { style: { position: "relative" } }, [
            h("input", {
              type: "text",
              value: query.value,
              placeholder: ph.value,
              disabled: props.disabled,
              autocomplete: "off",
              spellcheck: "false",
              role: "combobox",
              "aria-expanded": open.value,
              "aria-autocomplete": "list",
              style: {
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
                direction: isRtl.value ? "rtl" : "ltr",
              },
              onInput: (e: Event) => handleInput((e.target as HTMLInputElement).value),
              onKeydown: handleKey,
              onFocus: () => { if (results.value.length > 0) open.value = true; },
            }),
            loading.value &&
              h("span", {
                style: {
                  position: "absolute",
                  right: isRtl.value ? "auto" : "12px",
                  left: isRtl.value ? "12px" : "auto",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "14px",
                  height: "14px",
                  border: `2px solid ${BORDER}`,
                  borderTopColor: GREEN,
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "_sap_spin 0.6s linear infinite",
                },
              }),
          ]),

          rateLimited.value &&
            h(
              "p",
              { style: { fontSize: "12px", color: "#dc2626", margin: "4px 0 0" } },
              isRtl.value
                ? "تم الوصول إلى الحد المجاني. أضف مفتاح API للمتابعة."
                : "Free tier limit reached. Add an API key — saudiaddresspro.com"
            ),

          open.value &&
            results.value.length > 0 &&
            h(
              "div",
              {
                role: "listbox",
                style: {
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
                },
              },
              [
                ...results.value.map((addr, i) =>
                  h(
                    "div",
                    {
                      key: `${addr.shortCode}-${i}`,
                      role: "option",
                      "aria-selected": i === activeIdx.value,
                      style: {
                        padding: "10px 14px",
                        cursor: "pointer",
                        borderBottom: i < results.value.length - 1 ? `1px solid #f3f4f6` : "none",
                        backgroundColor: i === activeIdx.value ? "#f0fdf4" : "#ffffff",
                      },
                      onMousedown: () => handleSelect(addr),
                      onMouseenter: () => { activeIdx.value = i; },
                    },
                    [
                      h("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" } }, [
                        addr.shortCode &&
                          h(
                            "span",
                            {
                              style: {
                                fontFamily: "monospace",
                                fontSize: "11px",
                                fontWeight: 700,
                                color: GREEN,
                                backgroundColor: "#f0fdf4",
                                padding: "1px 6px",
                                borderRadius: "4px",
                                border: "1px solid #bbf7d0",
                                flexShrink: 0,
                              },
                            },
                            addr.shortCode
                          ),
                        h(
                          "span",
                          { style: { fontSize: "13px", color: TEXT, fontWeight: 500 } },
                          [addr.street, addr.district].filter(Boolean).join(", ")
                        ),
                      ]),
                      h(
                        "div",
                        { style: { fontSize: "12px", color: MUTED } },
                        [addr.city, addr.postalCode].filter(Boolean).join(" · ")
                      ),
                    ]
                  )
                ),
                h(
                  "div",
                  { style: { padding: "5px 14px", textAlign: isRtl.value ? "left" : "right", borderTop: `1px solid #f3f4f6` } },
                  h(
                    "a",
                    {
                      href: "https://saudiaddresspro.com",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      style: { fontSize: "10px", color: "#9ca3af", textDecoration: "none" },
                    },
                    "powered by Saudi Address Pro"
                  )
                ),
              ]
            ),
        ]
      );
    };
  },
});

export type { AddressResult };
