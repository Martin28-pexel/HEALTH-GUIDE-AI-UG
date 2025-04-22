import { HealthFacility } from "@/types";

// This is a fallback in case API fails
export const healthFacilities: HealthFacility[] = [
  {
    id: 1,
    name: "Mulago National Referral Hospital",
    address: "Upper Mulago Hill, Kampala",
    phone: "+256-414-541-133",
    hours: "Open 24 hours",
    type: "Public Hospital",
    services: ["Emergency Services", "General Healthcare", "Specialized Care"],
    coordinates: { lat: 0.3476, lng: 32.5825 },
    emergency: true
  },
  {
    id: 2,
    name: "Kampala International Hospital",
    address: "Namuwongo, Kampala",
    phone: "+256-312-188-800",
    hours: "Open 24 hours",
    type: "Private Hospital",
    services: ["Emergency Services", "General Healthcare", "Specialized Care"],
    coordinates: { lat: 0.3157, lng: 32.6078 },
    emergency: true
  },
  {
    id: 3,
    name: "Kiswa Health Center",
    address: "Bugolobi, Kampala",
    phone: "+256-414-220-889",
    hours: "8:00 AM - 5:00 PM",
    type: "Public Clinic",
    services: ["Primary Care", "Maternal Health", "Vaccinations"],
    coordinates: { lat: 0.3198, lng: 32.6135 },
    emergency: false
  },
  {
    id: 4,
    name: "Naguru General Hospital",
    address: "Naguru, Kampala",
    phone: "+256-414-510-096",
    hours: "Open 24 hours",
    type: "Public Hospital",
    services: ["Emergency Services", "General Healthcare", "HIV/AIDS Treatment"],
    coordinates: { lat: 0.3341, lng: 32.6069 },
    emergency: true
  },
  {
    id: 5,
    name: "Case Medical Center",
    address: "Kampala Road, Kampala",
    phone: "+256-312-250-700",
    hours: "Open 24 hours",
    type: "Private Hospital",
    services: ["Emergency Services", "General Healthcare", "Specialized Care"],
    coordinates: { lat: 0.3172, lng: 32.5872 },
    emergency: true
  }
];
