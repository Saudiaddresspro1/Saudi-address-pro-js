export interface AddressResult {
  shortCode: string;
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

export interface SaudiAddressConfig {
  apiKey?: string;
  lang?: "en" | "ar";
  theme?: "light" | "dark" | "auto";
  placeholder?: string;
  countryField?: string;
  onSelect: (address: AddressResult) => void;
}
