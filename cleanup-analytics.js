/**
 * Analytics Data Cleanup Script
 * Removes old session files based on retention policy
 */

const fs = require('fs');
const path = require('path');

async function cleanupAnalytics() {
  const sessionsDir = path.join(__dirname, 'data', 'sessions');
  const configFile = path.join(__dirname, 'data', 'analytics-config.json');
  
  try {
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const retentionDays = config.sessionRetentionDays || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const files = fs.readdirSync(sessionsDir);
    let deletedCount = 0;
    
    for (const file of files) {
      if (!file.startsWith('sessions_') || !file.endsWith('.json')) continue;
      
      const dateStr = file.replace('sessions_', '').replace('.json', '');
      const fileDate = new Date(dateStr);
      
      if (fileDate < cutoffDate) {
        const filePath = path.join(sessionsDir, file);
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`Deleted old session file: ${file}`);
      }
    }
    
    console.log(`Cleanup completed. Deleted ${deletedCount} old session files.`);
  } catch (error) {
    console.error('Cleanup failed:', error.message);
  }
}

cleanupAnalytics();
