import fs from 'fs';
import path from 'path';

// Persistent storage for blocked IPs and countries
const STORAGE_FILE = path.join(process.cwd(), 'data', 'blocked-data.json');

// Ensure data directory exists
const dataDir = path.dirname(STORAGE_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load persistent data
function loadPersistentData() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
      return {
        blockedIPs: new Set(data.blockedIPs || []),
        blockedCountries: new Set(data.blockedCountries || []),
        allSeenIPs: new Set(data.allSeenIPs || []),
        allSeenCountries: new Set(data.allSeenCountries || [])
      };
    }
  } catch (error) {
    console.error('Error loading persistent data:', error);
  }
  return {
    blockedIPs: new Set<string>(),
    blockedCountries: new Set<string>(),
    allSeenIPs: new Set<string>(),
    allSeenCountries: new Set<string>()
  };
}

// Save persistent data
function savePersistentData(data: any) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving persistent data:', error);
  }
}

// Initialize persistent storage
let persistentData = loadPersistentData();
const blockedIPs = persistentData.blockedIPs;
const blockedCountries = persistentData.blockedCountries;
const allSeenIPs = persistentData.allSeenIPs;
const allSeenCountries = persistentData.allSeenCountries;

// Storage service for blocked IPs and countries
export const blockedStorage = {
  getBlockedIPs: () => Array.from(blockedIPs),
  getBlockedCountries: () => Array.from(blockedCountries),
  getAllSeenIPs: () => Array.from(allSeenIPs),
  getAllSeenCountries: () => Array.from(allSeenCountries),
  
  blockIP: (ip: string) => {
    console.log(`Blocking IP: "${ip}"`);
    const result = blockedIPs.add(ip);
    console.log(`Blocked IPs set now contains: [${Array.from(blockedIPs).join(', ')}]`);
    savePersistentData({
      blockedIPs: Array.from(blockedIPs),
      blockedCountries: Array.from(blockedCountries),
      allSeenIPs: Array.from(allSeenIPs),
      allSeenCountries: Array.from(allSeenCountries)
    });
    return result;
  },
  
  unblockIP: (ip: string) => {
    console.log(`Unblocking IP: "${ip}"`);
    console.log(`Blocked IPs set before: [${Array.from(blockedIPs).join(', ')}]`);
    const result = blockedIPs.delete(ip);
    console.log(`Blocked IPs set after: [${Array.from(blockedIPs).join(', ')}]`);
    console.log(`Delete result: ${result}`);
    savePersistentData({
      blockedIPs: Array.from(blockedIPs),
      blockedCountries: Array.from(blockedCountries),
      allSeenIPs: Array.from(allSeenIPs),
      allSeenCountries: Array.from(allSeenCountries)
    });
    return result;
  },
  
  blockCountry: (country: string) => {
    console.log(`Blocking country: "${country}"`);
    const result = blockedCountries.add(country);
    console.log(`Blocked countries set now contains: [${Array.from(blockedCountries).join(', ')}]`);
    savePersistentData({
      blockedIPs: Array.from(blockedIPs),
      blockedCountries: Array.from(blockedCountries),
      allSeenIPs: Array.from(allSeenIPs),
      allSeenCountries: Array.from(allSeenCountries)
    });
    return result;
  },
  
  unblockCountry: (country: string) => {
    console.log(`Unblocking country: "${country}"`);
    console.log(`Blocked countries set before: [${Array.from(blockedCountries).join(', ')}]`);
    const result = blockedCountries.delete(country);
    console.log(`Blocked countries set after: [${Array.from(blockedCountries).join(', ')}]`);
    console.log(`Delete result: ${result}`);
    savePersistentData({
      blockedIPs: Array.from(blockedIPs),
      blockedCountries: Array.from(blockedCountries),
      allSeenIPs: Array.from(allSeenIPs),
      allSeenCountries: Array.from(allSeenCountries)
    });
    return result;
  },
  
  addSeenIP: (ip: string) => {
    const added = !allSeenIPs.has(ip);
    allSeenIPs.add(ip);
    if (added) {
      savePersistentData({
        blockedIPs: Array.from(blockedIPs),
        blockedCountries: Array.from(blockedCountries),
        allSeenIPs: Array.from(allSeenIPs),
        allSeenCountries: Array.from(allSeenCountries)
      });
    }
    return added;
  },
  
  addSeenCountry: (country: string) => {
    const added = !allSeenCountries.has(country);
    allSeenCountries.add(country);
    if (added) {
      savePersistentData({
        blockedIPs: Array.from(blockedIPs),
        blockedCountries: Array.from(blockedCountries),
        allSeenIPs: Array.from(allSeenIPs),
        allSeenCountries: Array.from(allSeenCountries)
      });
    }
    return added;
  },
  
  isIPBlocked: (ip: string) => blockedIPs.has(ip),
  isCountryBlocked: (country: string) => blockedCountries.has(country),
  
  getStats: () => ({
    blockedIPs: blockedIPs.size,
    blockedCountries: blockedCountries.size,
    activeIPs: allSeenIPs.size,
    activeCountries: allSeenCountries.size,
  })
};
