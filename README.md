# Saudi Address Pro (JS SDK)

[![TGA 2026 Compliant](https://img.shields.io/badge/TGA%202026-Compliant-green?style=flat-square)](https://saudiaddresspro.com)
[![Arabic Support](https://img.shields.io/badge/Language-Arabic%20%2B%20English-blue?style=flat-square)](https://saudiaddresspro.com)
[![NPM Version](https://img.shields.io/npm/v/saudi-address-pro?style=flat-square)](https://www.npmjs.com/package/saudi-address-pro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**The smartest address verification widget for Saudi e-commerce.**

Saudi Address Pro automatically validates and auto-fills Saudi National Addresses using official SPL data. It turns a complex 6-field form into a single "Short Address" lookup (e.g., `RRHA8147`), reducing typing errors by 80% and ensuring 100% delivery success.

🔗 **[Try the Live Demo](https://saudiaddresspro.com)**


---

## 🚀 Why Use This?

Most "Saudi Address" libraries just use Regex to check if a phone number starts with `+966`. **This is different.**

We connect directly to the **Saudi Post (SPL) API** to verify that the building actually exists.

| Feature | Old Way (Regex Scripts) | Saudi Address Pro (This SDK) |
| :--- | :--- | :--- |
| **Validation Type** | "Does it look like an address?" | "Does this building exist?" |
| **Data Source** | None (Guesswork) | **Official SPL Government Data** |
| **Auto-Fill** | ❌ No | ✅ **Yes (City, District, Zip, etc.)** |
| **User Effort** | High (Type 6 fields) | **Low (Type 4 chars)** |
| **Accuracy** | ~70% | **100% Verified** |

---

## 📦 Installation

### Option 1: NPM (Recommended for React/Vue/Next.js)
```bash
npm install saudi-address-pro
```

### Option 2: CDN (Easiest for HTML/Shopify/Salla)
Simply add this script to your checkout page header:
```html
<script src="https://cdn.saudiaddresspro.com/widget.js" async></script>
```

---

## 🛠 Usage

### Basic Example (Vanilla JS)
```html
<!-- 1. The Container -->
<div id="saudi-address-widget"></div>

<!-- 2. The Script -->
<script>
  window.SaudiAddressPro.init({
    apiKey: "YOUR_PUBLIC_API_KEY", // Get one at saudiaddresspro.com
    language: "en", // or "ar" for Arabic
    onAddressSelected: function(address) {
      // Auto-fill your checkout form
      document.getElementById('city').value = address.city;
      document.getElementById('district').value = address.district;
      document.getElementById('zip').value = address.postalCode;
    }
  });
</script>
```

## ⚡ How to load ONLY for Saudi Arabia

Building a global checkout? You don't need to load this script for customers in London or New York.

Here is the standard recipe to conditionally load the widget **only** when the user selects "Saudi Arabia" (SA).

```javascript
const countrySelect = document.getElementById('billing_country');

countrySelect.addEventListener('change', (e) => {
  if (e.target.value === 'SA') {
    // 1. Load the script dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.saudiaddresspro.com/widget/v1.js';
    script.onload = () => {
      // 2. Initialize the widget once loaded
      new SaudiAddress({ selector: '#address-input', apiKey: 'YOUR_KEY' });
    };
    document.head.appendChild(script);
  }
});
```

This ensures **zero performance impact** for your non-Saudi customers.


---

## 🛡️ Fail-Safe Guarantee (Zero Blocking)

We understand that your checkout is critical. This widget is designed with a **"Fail-Open"** architecture.

*   **Smart Mode:** If the API is reachable, users get the full auto-fill experience.
*   **Fail-Safe Mode:** If the user is offline or the API is unreachable, the widget **automatically downgrades** to a standard text input.
*   **Result:** Your customer can *always* complete their purchase. We never block the "Place Order" button.

---

## 🇸🇦 Arabic Support (RTL)

Built for the Kingdom. The widget fully supports Arabic and English with automatic RTL (Right-to-Left) layout switching.

```javascript
window.SaudiAddressPro.init({
  language: "ar", // Switches UI to Arabic & RTL
  // ...
});
```


---

## 💻 Quick Start

### 1. The "Free" Version (Format Validation Only)
You can use the SDK for free to validate the *format* of Saudi Short Addresses.

```javascript
import { SaudiAddress } from 'saudi-address-pro';

// Initialize in "Dumb Mode" (No API Key)
const addressWidget = new SaudiAddress({
  selector: '#address-input'
});

// Result: Ensures user types 4 letters + 4 numbers.
```

### 2. The "Pro" Version (Full Verification & Auto-fill)
Get your API Key at [saudiaddresspro.com](https://saudiaddresspro.com) to unlock the magic.

```javascript
const addressWidget = new SaudiAddress({
  selector: '#address-input',
  apiKey: 'YOUR_API_KEY_HERE', // Get this from saudiaddresspro.com
  
  // Optional: Map fields to auto-fill your form
  fields: {
    city: '#billing_city',
    district: '#billing_district',
    zip: '#billing_postcode',
    street: '#billing_street1'
  }
});
```

**That's it.** When a user types `RCTB4359`, your form fills itself.

---

## 🧩 Supported Platforms

*   **HTML/JS:** Native support (see above).
*   **React:** `<SaudiAddressWidget />` component included.
*   **Vue:** Vue plugin included.

---

## 🤝 Compatibility

Works out of the box with:
*   ✅ **Custom React / Vue / Angular Apps**
*   ✅ **Shopify** (via Script Tag)
*   ✅ **Salla** (via Custom Code)
*   ✅ **WooCommerce** (via Header Scripts)
*   ✅ **Magento / Adobe Commerce**

---

## 📄 License

MIT License © 2024 Saudi Address Pro.

Free to use for format validation. API key required for SPL data verification.
[Get your API Key here](https://saudiaddresspro.com).
