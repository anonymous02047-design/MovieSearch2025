// Simple in-memory storage for admin functions (Edge Runtime compatible)
const blockedIPs = new Set<string>();
const blockedCountries = new Set<string>();
const ipRateLimits = new Map<string, { count: number; firstRequestTime: number }>();
const countryRateLimits = new Map<string, { count: number; firstRequestTime: number }>();
const allSeenIPs = new Set<string>();
const allSeenCountries = new Set<string>();

// Admin service for API routes (Edge Runtime compatible - in-memory only)
export const adminService = {
  getBlockedIPs: () => Array.from(blockedIPs),
  getBlockedCountries: () => Array.from(blockedCountries),
  blockIP: (ip: string) => blockedIPs.add(ip),
  unblockIP: (ip: string) => blockedIPs.delete(ip),
  blockCountry: (country: string) => blockedCountries.add(country),
  unblockCountry: (country: string) => blockedCountries.delete(country),
  getRateLimitStats: () => ({
    ipRateLimits: Object.fromEntries(ipRateLimits),
    countryRateLimits: Object.fromEntries(countryRateLimits),
    activeIPs: allSeenIPs.size,
    activeCountries: allSeenCountries.size,
    blockedIPs: blockedIPs.size,
    blockedCountries: blockedCountries.size,
  }),
};
