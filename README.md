# saudi-address-pro

Saudi National Address (SPL) autocomplete and validation widget — for React, Vue 3, and vanilla JavaScript.

When a user selects Saudi Arabia in your address form, a smart short-code input appears. They type a short address code (e.g. `RCTB4359`) or search by city/district, and the full verified address auto-fills instantly.

**100 free lookups/month** included. No API key required to start.

---

## Installation

```bash
npm install saudi-address-pro
# or
yarn add saudi-address-pro
```

---

## React

```tsx
import { SaudiAddressInput } from 'saudi-address-pro/react';

function CheckoutForm() {
  const handleSelect = (address) => {
    console.log(address.shortCode);      // "RCTB4359"
    console.log(address.buildingNumber); // "4359"
    console.log(address.street);         // "King Abdul Aziz Road"
    console.log(address.district);       // "Al Olaya"
    console.log(address.city);           // "Riyadh"
    console.log(address.postalCode);     // "12643"
  };

  return (
    <form>
      <select name="country" id="country">
        <option value="SA">Saudi Arabia</option>
        <option value="AE">UAE</option>
      </select>

      {/* Auto-shows when Saudi Arabia is selected */}
      <SaudiAddressInput
        apiKey="YOUR_API_KEY"
        onSelect={handleSelect}
        countryField="#country"
        lang="en"
      />
    </form>
  );
}
```

---

## Vue 3

```vue
<template>
  <form>
    <select v-model="country" id="country">
      <option value="SA">Saudi Arabia</option>
      <option value="AE">UAE</option>
    </select>

    <SaudiAddressInput
      api-key="YOUR_API_KEY"
      @select="onAddressSelect"
      country-field="#country"
      lang="en"
    />
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { SaudiAddressInput } from 'saudi-address-pro/vue';

const country = ref('SA');

const onAddressSelect = (address) => {
  console.log(address.shortCode);
  console.log(address.city);
};
</script>
```

---

## Vanilla JavaScript

```html
<div id="address-widget"></div>

<script type="module">
  import { init } from 'saudi-address-pro';

  init({
    container: '#address-widget',
    apiKey: 'YOUR_API_KEY',
    lang: 'en',
    onSelect(address) {
      document.getElementById('short_code').value = address.shortCode;
      document.getElementById('city').value = address.city;
    }
  });
</script>
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiKey` | `string` | — | Your API key from [saudiaddresspro.com](https://app.saudiaddresspro.com). First 100 lookups/month free without a key. |
| `onSelect` / `@select` | `function` | required | Called when the user selects an address. Receives an `AddressResult` object. |
| `lang` | `"en" \| "ar"` | `"en"` | Language. Arabic mode enables RTL layout automatically. |
| `placeholder` | `string` | auto | Custom input placeholder text. |
| `countryField` | `string` | — | CSS selector of the country dropdown. Widget shows automatically when Saudi Arabia is selected. |
| `disabled` | `boolean` | `false` | Disables the input. |

---

## AddressResult object

```ts
interface AddressResult {
  shortCode: string;        // SPL short code, e.g. "RCTB4359"
  buildingNumber: string;
  street: string;
  district: string;
  city: string;
  postalCode: string;
  additionalNumber?: string;
  unitNumber?: string;
  latitude?: number;
  longitude?: number;
}
```

---

## Free tier

The first **100 lookups per month** work without an API key — the widget calls our demo endpoint automatically. When the free tier is exhausted, the widget displays a prompt to upgrade.

Get an API key at **[app.saudiaddresspro.com](https://app.saudiaddresspro.com)** — 60-day free trial, no credit card required.

---

## Arabic / RTL

```tsx
<SaudiAddressInput
  apiKey="YOUR_API_KEY"
  onSelect={handleSelect}
  lang="ar"
/>
```

When `lang="ar"`, the widget switches to Arabic labels and RTL layout automatically.

---

## License

MIT © [Saudi Address Pro](https://saudiaddresspro.com)
