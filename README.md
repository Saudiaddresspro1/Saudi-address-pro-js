# Saudi Address Pro SDK 🇸🇦

[![npm version](https://img.shields.io/npm/v/saudi-address-pro.svg?style=flat-square)](https://www.npmjs.com/package/saudi-address-pro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Saudi Post Verified](https://img.shields.io/badge/Data-Verified%20by%20SPL-green?style=flat-square)](https://splonline.com.sa/)

**The only address field that knows the difference between "Correct Format" and "Correct Address."**

Saudi Address Pro is a drop-in JavaScript widget that converts the 4-digit Saudi Short Address code (e.g., `RRHA8147`) into a full, verified National Address.

> **"Stop guessing. Start verifying."**

---

## 🚀 Why Use This?

Most Saudi e-commerce sites use "Dumb" validation. They check if the code *looks* right (4 letters, 4 numbers). They don't check if it *is* right.

| Feature | ❌ Standard Regex / Old Scripts | ✅ Saudi Address Pro |
| :--- | :---: | :---: |
| **Checks Format** (e.g. AAAA1111) | ✅ Yes | ✅ Yes |
| **Verifies Existence** (Real Building?) | ❌ No | ✅ **Yes** (Direct SPL Connection) |
| **Auto-fills City/District/Zip** | ❌ No | ✅ **Yes** (100% Accurate) |
| **Prevents Fake Addresses** | ❌ No | ✅ **Yes** |
| **Reliability** | High | **Unbreakable** (See "Smart Fallback") |

---

## 🛡️ The "Smart Fallback" Guarantee (Zero Risk)

We know your checkout flow is sacred. You cannot afford for a 3rd-party script to break your sales.

**Saudi Address Pro is built with a "Fail-Open" architecture:**

1.  **Smart Mode (Default):** When you have a valid API Key, the widget connects to the Saudi Post (SPL) database to verify addresses in real-time.
2.  **Dumb Mode (Fallback):** If your API Key expires, or the internet connection is flaky, the widget **automatically and instantly** downgrades to a standard text input.
    *   ✅ The user can still type their address manually.
    *   ✅ Your checkout **never** breaks.
    *   ✅ You never lose a sale.

It works just like the "Dumb" field you already have—until you turn on the "Smart" engine.

---

## 📦 Installation

### Option 1: CDN (Easiest)
Add this single line to your checkout page header:

```html
<script src="https://cdn.saudiaddresspro.com/widget/v1.js"></script>
```

### Option 2: NPM (For React/Vue/Angular)
```bash
npm install saudi-address-pro
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

**That's it.** When a user types `RRHA8147`, your form fills itself.

---

## 🧩 Supported Platforms

*   **HTML/JS:** Native support (see above).
*   **React:** `<SaudiAddressWidget />` component included.
*   **Vue:** Vue plugin included.
*   **Magento / Shopify / WooCommerce:** [Download our official plugins here](https://saudiaddresspro.com/plugins).

---

## 📄 License

This SDK is open-source (MIT). You are free to fork, modify, and use the code.
**Note:** The "Smart Verification" feature requires a paid API subscription from [saudiaddresspro.com](https://saudiaddresspro.com) to cover SPL data costs.
