/**
 * Comprehensive Country Data and Detection
 * All 195 UN-recognized countries + territories
 */

export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  nativeName: string;
  continent: string;
  region: string;
  currency: string;
  languages: string[];
  flag: string; // Emoji flag
  timezone: string;
  tmdbRegion?: string; // TMDB watch region code
}

export const COUNTRIES: Country[] = [
  // Africa
  { code: 'DZ', name: 'Algeria', nativeName: 'الجزائر', continent: 'Africa', region: 'Northern Africa', currency: 'DZD', languages: ['ar', 'fr'], flag: '🇩🇿', timezone: 'Africa/Algiers', tmdbRegion: 'DZ' },
  { code: 'AO', name: 'Angola', nativeName: 'Angola', continent: 'Africa', region: 'Middle Africa', currency: 'AOA', languages: ['pt'], flag: '🇦🇴', timezone: 'Africa/Luanda', tmdbRegion: 'AO' },
  { code: 'BJ', name: 'Benin', nativeName: 'Bénin', continent: 'Africa', region: 'Western Africa', currency: 'XOF', languages: ['fr'], flag: '🇧🇯', timezone: 'Africa/Porto-Novo', tmdbRegion: 'BJ' },
  { code: 'BW', name: 'Botswana', nativeName: 'Botswana', continent: 'Africa', region: 'Southern Africa', currency: 'BWP', languages: ['en', 'tn'], flag: '🇧🇼', timezone: 'Africa/Gaborone', tmdbRegion: 'BW' },
  { code: 'BF', name: 'Burkina Faso', nativeName: 'Burkina Faso', continent: 'Africa', region: 'Western Africa', currency: 'XOF', languages: ['fr'], flag: '🇧🇫', timezone: 'Africa/Ouagadougou', tmdbRegion: 'BF' },
  { code: 'BI', name: 'Burundi', nativeName: 'Burundi', continent: 'Africa', region: 'Eastern Africa', currency: 'BIF', languages: ['fr', 'rn'], flag: '🇧🇮', timezone: 'Africa/Bujumbura', tmdbRegion: 'BI' },
  { code: 'CM', name: 'Cameroon', nativeName: 'Cameroun', continent: 'Africa', region: 'Middle Africa', currency: 'XAF', languages: ['en', 'fr'], flag: '🇨🇲', timezone: 'Africa/Douala', tmdbRegion: 'CM' },
  { code: 'CV', name: 'Cape Verde', nativeName: 'Cabo Verde', continent: 'Africa', region: 'Western Africa', currency: 'CVE', languages: ['pt'], flag: '🇨🇻', timezone: 'Atlantic/Cape_Verde', tmdbRegion: 'CV' },
  { code: 'CF', name: 'Central African Republic', nativeName: 'République centrafricaine', continent: 'Africa', region: 'Middle Africa', currency: 'XAF', languages: ['fr', 'sg'], flag: '🇨🇫', timezone: 'Africa/Bangui', tmdbRegion: 'CF' },
  { code: 'TD', name: 'Chad', nativeName: 'Tchad', continent: 'Africa', region: 'Middle Africa', currency: 'XAF', languages: ['fr', 'ar'], flag: '🇹🇩', timezone: 'Africa/Ndjamena', tmdbRegion: 'TD' },
  { code: 'KM', name: 'Comoros', nativeName: 'Comores', continent: 'Africa', region: 'Eastern Africa', currency: 'KMF', languages: ['ar', 'fr'], flag: '🇰🇲', timezone: 'Indian/Comoro', tmdbRegion: 'KM' },
  { code: 'CG', name: 'Congo', nativeName: 'Congo', continent: 'Africa', region: 'Middle Africa', currency: 'XAF', languages: ['fr', 'ln'], flag: '🇨🇬', timezone: 'Africa/Brazzaville', tmdbRegion: 'CG' },
  { code: 'CD', name: 'DR Congo', nativeName: 'République démocratique du Congo', continent: 'Africa', region: 'Middle Africa', currency: 'CDF', languages: ['fr', 'ln', 'sw'], flag: '🇨🇩', timezone: 'Africa/Kinshasa', tmdbRegion: 'CD' },
  { code: 'CI', name: 'Ivory Coast', nativeName: 'Côte d\'Ivoire', continent: 'Africa', region: 'Western Africa', currency: 'XOF', languages: ['fr'], flag: '🇨🇮', timezone: 'Africa/Abidjan', tmdbRegion: 'CI' },
  { code: 'DJ', name: 'Djibouti', nativeName: 'Djibouti', continent: 'Africa', region: 'Eastern Africa', currency: 'DJF', languages: ['fr', 'ar'], flag: '🇩🇯', timezone: 'Africa/Djibouti', tmdbRegion: 'DJ' },
  { code: 'EG', name: 'Egypt', nativeName: 'مصر', continent: 'Africa', region: 'Northern Africa', currency: 'EGP', languages: ['ar'], flag: '🇪🇬', timezone: 'Africa/Cairo', tmdbRegion: 'EG' },
  { code: 'GQ', name: 'Equatorial Guinea', nativeName: 'Guinea Ecuatorial', continent: 'Africa', region: 'Middle Africa', currency: 'XAF', languages: ['es', 'fr'], flag: '🇬🇶', timezone: 'Africa/Malabo', tmdbRegion: 'GQ' },
  { code: 'ER', name: 'Eritrea', nativeName: 'ኤርትራ', continent: 'Africa', region: 'Eastern Africa', currency: 'ERN', languages: ['ti', 'ar', 'en'], flag: '🇪🇷', timezone: 'Africa/Asmara', tmdbRegion: 'ER' },
  { code: 'ET', name: 'Ethiopia', nativeName: 'ኢትዮጵያ', continent: 'Africa', region: 'Eastern Africa', currency: 'ETB', languages: ['am'], flag: '🇪🇹', timezone: 'Africa/Addis_Ababa', tmdbRegion: 'ET' },
  { code: 'GA', name: 'Gabon', nativeName: 'Gabon', continent: 'Africa', region: 'Middle Africa', currency: 'XAF', languages: ['fr'], flag: '🇬🇦', timezone: 'Africa/Libreville', tmdbRegion: 'GA' },
  { code: 'GM', name: 'Gambia', nativeName: 'The Gambia', continent: 'Africa', region: 'Western Africa', currency: 'GMD', languages: ['en'], flag: '🇬🇲', timezone: 'Africa/Banjul', tmdbRegion: 'GM' },
  { code: 'GH', name: 'Ghana', nativeName: 'Ghana', continent: 'Africa', region: 'Western Africa', currency: 'GHS', languages: ['en'], flag: '🇬🇭', timezone: 'Africa/Accra', tmdbRegion: 'GH' },
  { code: 'GN', name: 'Guinea', nativeName: 'Guinée', continent: 'Africa', region: 'Western Africa', currency: 'GNF', languages: ['fr'], flag: '🇬🇳', timezone: 'Africa/Conakry', tmdbRegion: 'GN' },
  { code: 'GW', name: 'Guinea-Bissau', nativeName: 'Guiné-Bissau', continent: 'Africa', region: 'Western Africa', currency: 'XOF', languages: ['pt'], flag: '🇬🇼', timezone: 'Africa/Bissau', tmdbRegion: 'GW' },
  { code: 'KE', name: 'Kenya', nativeName: 'Kenya', continent: 'Africa', region: 'Eastern Africa', currency: 'KES', languages: ['en', 'sw'], flag: '🇰🇪', timezone: 'Africa/Nairobi', tmdbRegion: 'KE' },
  { code: 'LS', name: 'Lesotho', nativeName: 'Lesotho', continent: 'Africa', region: 'Southern Africa', currency: 'LSL', languages: ['en', 'st'], flag: '🇱🇸', timezone: 'Africa/Maseru', tmdbRegion: 'LS' },
  { code: 'LR', name: 'Liberia', nativeName: 'Liberia', continent: 'Africa', region: 'Western Africa', currency: 'LRD', languages: ['en'], flag: '🇱🇷', timezone: 'Africa/Monrovia', tmdbRegion: 'LR' },
  { code: 'LY', name: 'Libya', nativeName: 'ليبيا', continent: 'Africa', region: 'Northern Africa', currency: 'LYD', languages: ['ar'], flag: '🇱🇾', timezone: 'Africa/Tripoli', tmdbRegion: 'LY' },
  { code: 'MG', name: 'Madagascar', nativeName: 'Madagasikara', continent: 'Africa', region: 'Eastern Africa', currency: 'MGA', languages: ['fr', 'mg'], flag: '🇲🇬', timezone: 'Indian/Antananarivo', tmdbRegion: 'MG' },
  { code: 'MW', name: 'Malawi', nativeName: 'Malawi', continent: 'Africa', region: 'Eastern Africa', currency: 'MWK', languages: ['en'], flag: '🇲🇼', timezone: 'Africa/Blantyre', tmdbRegion: 'MW' },
  { code: 'ML', name: 'Mali', nativeName: 'Mali', continent: 'Africa', region: 'Western Africa', currency: 'XOF', languages: ['fr'], flag: '🇲🇱', timezone: 'Africa/Bamako', tmdbRegion: 'ML' },
  { code: 'MR', name: 'Mauritania', nativeName: 'موريتانيا', continent: 'Africa', region: 'Western Africa', currency: 'MRU', languages: ['ar'], flag: '🇲🇷', timezone: 'Africa/Nouakchott', tmdbRegion: 'MR' },
  { code: 'MU', name: 'Mauritius', nativeName: 'Maurice', continent: 'Africa', region: 'Eastern Africa', currency: 'MUR', languages: ['en', 'fr'], flag: '🇲🇺', timezone: 'Indian/Mauritius', tmdbRegion: 'MU' },
  { code: 'MA', name: 'Morocco', nativeName: 'المغرب', continent: 'Africa', region: 'Northern Africa', currency: 'MAD', languages: ['ar', 'fr'], flag: '🇲🇦', timezone: 'Africa/Casablanca', tmdbRegion: 'MA' },
  { code: 'MZ', name: 'Mozambique', nativeName: 'Moçambique', continent: 'Africa', region: 'Eastern Africa', currency: 'MZN', languages: ['pt'], flag: '🇲🇿', timezone: 'Africa/Maputo', tmdbRegion: 'MZ' },
  { code: 'NA', name: 'Namibia', nativeName: 'Namibia', continent: 'Africa', region: 'Southern Africa', currency: 'NAD', languages: ['en'], flag: '🇳🇦', timezone: 'Africa/Windhoek', tmdbRegion: 'NA' },
  { code: 'NE', name: 'Niger', nativeName: 'Niger', continent: 'Africa', region: 'Western Africa', currency: 'XOF', languages: ['fr'], flag: '🇳🇪', timezone: 'Africa/Niamey', tmdbRegion: 'NE' },
  { code: 'NG', name: 'Nigeria', nativeName: 'Nigeria', continent: 'Africa', region: 'Western Africa', currency: 'NGN', languages: ['en'], flag: '🇳🇬', timezone: 'Africa/Lagos', tmdbRegion: 'NG' },
  { code: 'RW', name: 'Rwanda', nativeName: 'Rwanda', continent: 'Africa', region: 'Eastern Africa', currency: 'RWF', languages: ['rw', 'en', 'fr'], flag: '🇷🇼', timezone: 'Africa/Kigali', tmdbRegion: 'RW' },
  { code: 'ST', name: 'São Tomé and Príncipe', nativeName: 'São Tomé e Príncipe', continent: 'Africa', region: 'Middle Africa', currency: 'STN', languages: ['pt'], flag: '🇸🇹', timezone: 'Africa/Sao_Tome', tmdbRegion: 'ST' },
  { code: 'SN', name: 'Senegal', nativeName: 'Sénégal', continent: 'Africa', region: 'Western Africa', currency: 'XOF', languages: ['fr'], flag: '🇸🇳', timezone: 'Africa/Dakar', tmdbRegion: 'SN' },
  { code: 'SC', name: 'Seychelles', nativeName: 'Seychelles', continent: 'Africa', region: 'Eastern Africa', currency: 'SCR', languages: ['fr', 'en'], flag: '🇸🇨', timezone: 'Indian/Mahe', tmdbRegion: 'SC' },
  { code: 'SL', name: 'Sierra Leone', nativeName: 'Sierra Leone', continent: 'Africa', region: 'Western Africa', currency: 'SLL', languages: ['en'], flag: '🇸🇱', timezone: 'Africa/Freetown', tmdbRegion: 'SL' },
  { code: 'SO', name: 'Somalia', nativeName: 'Soomaaliya', continent: 'Africa', region: 'Eastern Africa', currency: 'SOS', languages: ['so', 'ar'], flag: '🇸🇴', timezone: 'Africa/Mogadishu', tmdbRegion: 'SO' },
  { code: 'ZA', name: 'South Africa', nativeName: 'South Africa', continent: 'Africa', region: 'Southern Africa', currency: 'ZAR', languages: ['af', 'en', 'zu'], flag: '🇿🇦', timezone: 'Africa/Johannesburg', tmdbRegion: 'ZA' },
  { code: 'SS', name: 'South Sudan', nativeName: 'South Sudan', continent: 'Africa', region: 'Eastern Africa', currency: 'SSP', languages: ['en'], flag: '🇸🇸', timezone: 'Africa/Juba', tmdbRegion: 'SS' },
  { code: 'SD', name: 'Sudan', nativeName: 'السودان', continent: 'Africa', region: 'Northern Africa', currency: 'SDG', languages: ['ar', 'en'], flag: '🇸🇩', timezone: 'Africa/Khartoum', tmdbRegion: 'SD' },
  { code: 'SZ', name: 'Eswatini', nativeName: 'Eswatini', continent: 'Africa', region: 'Southern Africa', currency: 'SZL', languages: ['en', 'ss'], flag: '🇸🇿', timezone: 'Africa/Mbabane', tmdbRegion: 'SZ' },
  { code: 'TZ', name: 'Tanzania', nativeName: 'Tanzania', continent: 'Africa', region: 'Eastern Africa', currency: 'TZS', languages: ['sw', 'en'], flag: '🇹🇿', timezone: 'Africa/Dar_es_Salaam', tmdbRegion: 'TZ' },
  { code: 'TG', name: 'Togo', nativeName: 'Togo', continent: 'Africa', region: 'Western Africa', currency: 'XOF', languages: ['fr'], flag: '🇹🇬', timezone: 'Africa/Lome', tmdbRegion: 'TG' },
  { code: 'TN', name: 'Tunisia', nativeName: 'تونس', continent: 'Africa', region: 'Northern Africa', currency: 'TND', languages: ['ar'], flag: '🇹🇳', timezone: 'Africa/Tunis', tmdbRegion: 'TN' },
  { code: 'UG', name: 'Uganda', nativeName: 'Uganda', continent: 'Africa', region: 'Eastern Africa', currency: 'UGX', languages: ['en', 'sw'], flag: '🇺🇬', timezone: 'Africa/Kampala', tmdbRegion: 'UG' },
  { code: 'ZM', name: 'Zambia', nativeName: 'Zambia', continent: 'Africa', region: 'Eastern Africa', currency: 'ZMW', languages: ['en'], flag: '🇿🇲', timezone: 'Africa/Lusaka', tmdbRegion: 'ZM' },
  { code: 'ZW', name: 'Zimbabwe', nativeName: 'Zimbabwe', continent: 'Africa', region: 'Eastern Africa', currency: 'ZWL', languages: ['en', 'sn', 'nd'], flag: '🇿🇼', timezone: 'Africa/Harare', tmdbRegion: 'ZW' },

  // Asia
  { code: 'AF', name: 'Afghanistan', nativeName: 'افغانستان', continent: 'Asia', region: 'Southern Asia', currency: 'AFN', languages: ['ps', 'uz'], flag: '🇦🇫', timezone: 'Asia/Kabul', tmdbRegion: 'AF' },
  { code: 'AM', name: 'Armenia', nativeName: 'Հայաստան', continent: 'Asia', region: 'Western Asia', currency: 'AMD', languages: ['hy'], flag: '🇦🇲', timezone: 'Asia/Yerevan', tmdbRegion: 'AM' },
  { code: 'AZ', name: 'Azerbaijan', nativeName: 'Azərbaycan', continent: 'Asia', region: 'Western Asia', currency: 'AZN', languages: ['az'], flag: '🇦🇿', timezone: 'Asia/Baku', tmdbRegion: 'AZ' },
  { code: 'BH', name: 'Bahrain', nativeName: 'البحرين', continent: 'Asia', region: 'Western Asia', currency: 'BHD', languages: ['ar'], flag: '🇧🇭', timezone: 'Asia/Bahrain', tmdbRegion: 'BH' },
  { code: 'BD', name: 'Bangladesh', nativeName: 'বাংলাদেশ', continent: 'Asia', region: 'Southern Asia', currency: 'BDT', languages: ['bn'], flag: '🇧🇩', timezone: 'Asia/Dhaka', tmdbRegion: 'BD' },
  { code: 'BT', name: 'Bhutan', nativeName: 'ʼbrug-yul', continent: 'Asia', region: 'Southern Asia', currency: 'BTN', languages: ['dz'], flag: '🇧🇹', timezone: 'Asia/Thimphu', tmdbRegion: 'BT' },
  { code: 'BN', name: 'Brunei', nativeName: 'Brunei', continent: 'Asia', region: 'South-Eastern Asia', currency: 'BND', languages: ['ms'], flag: '🇧🇳', timezone: 'Asia/Brunei', tmdbRegion: 'BN' },
  { code: 'KH', name: 'Cambodia', nativeName: 'កម្ពុជា', continent: 'Asia', region: 'South-Eastern Asia', currency: 'KHR', languages: ['km'], flag: '🇰🇭', timezone: 'Asia/Phnom_Penh', tmdbRegion: 'KH' },
  { code: 'CN', name: 'China', nativeName: '中国', continent: 'Asia', region: 'Eastern Asia', currency: 'CNY', languages: ['zh'], flag: '🇨🇳', timezone: 'Asia/Shanghai', tmdbRegion: 'CN' },
  { code: 'GE', name: 'Georgia', nativeName: 'საქართველო', continent: 'Asia', region: 'Western Asia', currency: 'GEL', languages: ['ka'], flag: '🇬🇪', timezone: 'Asia/Tbilisi', tmdbRegion: 'GE' },
  { code: 'IN', name: 'India', nativeName: 'भारत', continent: 'Asia', region: 'Southern Asia', currency: 'INR', languages: ['hi', 'en'], flag: '🇮🇳', timezone: 'Asia/Kolkata', tmdbRegion: 'IN' },
  { code: 'ID', name: 'Indonesia', nativeName: 'Indonesia', continent: 'Asia', region: 'South-Eastern Asia', currency: 'IDR', languages: ['id'], flag: '🇮🇩', timezone: 'Asia/Jakarta', tmdbRegion: 'ID' },
  { code: 'IR', name: 'Iran', nativeName: 'ایران', continent: 'Asia', region: 'Southern Asia', currency: 'IRR', languages: ['fa'], flag: '🇮🇷', timezone: 'Asia/Tehran', tmdbRegion: 'IR' },
  { code: 'IQ', name: 'Iraq', nativeName: 'العراق', continent: 'Asia', region: 'Western Asia', currency: 'IQD', languages: ['ar', 'ku'], flag: '🇮🇶', timezone: 'Asia/Baghdad', tmdbRegion: 'IQ' },
  { code: 'IL', name: 'Israel', nativeName: 'יִשְׂרָאֵל', continent: 'Asia', region: 'Western Asia', currency: 'ILS', languages: ['he', 'ar'], flag: '🇮🇱', timezone: 'Asia/Jerusalem', tmdbRegion: 'IL' },
  { code: 'JP', name: 'Japan', nativeName: '日本', continent: 'Asia', region: 'Eastern Asia', currency: 'JPY', languages: ['ja'], flag: '🇯🇵', timezone: 'Asia/Tokyo', tmdbRegion: 'JP' },
  { code: 'JO', name: 'Jordan', nativeName: 'الأردن', continent: 'Asia', region: 'Western Asia', currency: 'JOD', languages: ['ar'], flag: '🇯🇴', timezone: 'Asia/Amman', tmdbRegion: 'JO' },
  { code: 'KZ', name: 'Kazakhstan', nativeName: 'Қазақстан', continent: 'Asia', region: 'Central Asia', currency: 'KZT', languages: ['kk', 'ru'], flag: '🇰🇿', timezone: 'Asia/Almaty', tmdbRegion: 'KZ' },
  { code: 'KW', name: 'Kuwait', nativeName: 'الكويت', continent: 'Asia', region: 'Western Asia', currency: 'KWD', languages: ['ar'], flag: '🇰🇼', timezone: 'Asia/Kuwait', tmdbRegion: 'KW' },
  { code: 'KG', name: 'Kyrgyzstan', nativeName: 'Кыргызстан', continent: 'Asia', region: 'Central Asia', currency: 'KGS', languages: ['ky', 'ru'], flag: '🇰🇬', timezone: 'Asia/Bishkek', tmdbRegion: 'KG' },
  { code: 'LA', name: 'Laos', nativeName: 'ລາວ', continent: 'Asia', region: 'South-Eastern Asia', currency: 'LAK', languages: ['lo'], flag: '🇱🇦', timezone: 'Asia/Vientiane', tmdbRegion: 'LA' },
  { code: 'LB', name: 'Lebanon', nativeName: 'لبنان', continent: 'Asia', region: 'Western Asia', currency: 'LBP', languages: ['ar', 'fr'], flag: '🇱🇧', timezone: 'Asia/Beirut', tmdbRegion: 'LB' },
  { code: 'MY', name: 'Malaysia', nativeName: 'Malaysia', continent: 'Asia', region: 'South-Eastern Asia', currency: 'MYR', languages: ['ms'], flag: '🇲🇾', timezone: 'Asia/Kuala_Lumpur', tmdbRegion: 'MY' },
  { code: 'MV', name: 'Maldives', nativeName: 'Maldives', continent: 'Asia', region: 'Southern Asia', currency: 'MVR', languages: ['dv'], flag: '🇲🇻', timezone: 'Indian/Maldives', tmdbRegion: 'MV' },
  { code: 'MN', name: 'Mongolia', nativeName: 'Монгол', continent: 'Asia', region: 'Eastern Asia', currency: 'MNT', languages: ['mn'], flag: '🇲🇳', timezone: 'Asia/Ulaanbaatar', tmdbRegion: 'MN' },
  { code: 'MM', name: 'Myanmar', nativeName: 'မြန်မာ', continent: 'Asia', region: 'South-Eastern Asia', currency: 'MMK', languages: ['my'], flag: '🇲🇲', timezone: 'Asia/Yangon', tmdbRegion: 'MM' },
  { code: 'NP', name: 'Nepal', nativeName: 'नेपाल', continent: 'Asia', region: 'Southern Asia', currency: 'NPR', languages: ['ne'], flag: '🇳🇵', timezone: 'Asia/Kathmandu', tmdbRegion: 'NP' },
  { code: 'KP', name: 'North Korea', nativeName: '북한', continent: 'Asia', region: 'Eastern Asia', currency: 'KPW', languages: ['ko'], flag: '🇰🇵', timezone: 'Asia/Pyongyang', tmdbRegion: 'KP' },
  { code: 'OM', name: 'Oman', nativeName: 'عمان', continent: 'Asia', region: 'Western Asia', currency: 'OMR', languages: ['ar'], flag: '🇴🇲', timezone: 'Asia/Muscat', tmdbRegion: 'OM' },
  { code: 'PK', name: 'Pakistan', nativeName: 'Pakistan', continent: 'Asia', region: 'Southern Asia', currency: 'PKR', languages: ['ur', 'en'], flag: '🇵🇰', timezone: 'Asia/Karachi', tmdbRegion: 'PK' },
  { code: 'PS', name: 'Palestine', nativeName: 'فلسطين', continent: 'Asia', region: 'Western Asia', currency: 'ILS', languages: ['ar'], flag: '🇵🇸', timezone: 'Asia/Gaza', tmdbRegion: 'PS' },
  { code: 'PH', name: 'Philippines', nativeName: 'Pilipinas', continent: 'Asia', region: 'South-Eastern Asia', currency: 'PHP', languages: ['en', 'tl'], flag: '🇵🇭', timezone: 'Asia/Manila', tmdbRegion: 'PH' },
  { code: 'QA', name: 'Qatar', nativeName: 'قطر', continent: 'Asia', region: 'Western Asia', currency: 'QAR', languages: ['ar'], flag: '🇶🇦', timezone: 'Asia/Qatar', tmdbRegion: 'QA' },
  { code: 'SA', name: 'Saudi Arabia', nativeName: 'العربية السعودية', continent: 'Asia', region: 'Western Asia', currency: 'SAR', languages: ['ar'], flag: '🇸🇦', timezone: 'Asia/Riyadh', tmdbRegion: 'SA' },
  { code: 'SG', name: 'Singapore', nativeName: 'Singapore', continent: 'Asia', region: 'South-Eastern Asia', currency: 'SGD', languages: ['en', 'ms', 'ta', 'zh'], flag: '🇸🇬', timezone: 'Asia/Singapore', tmdbRegion: 'SG' },
  { code: 'KR', name: 'South Korea', nativeName: '대한민국', continent: 'Asia', region: 'Eastern Asia', currency: 'KRW', languages: ['ko'], flag: '🇰🇷', timezone: 'Asia/Seoul', tmdbRegion: 'KR' },
  { code: 'LK', name: 'Sri Lanka', nativeName: 'ශ්‍රී ලංකා', continent: 'Asia', region: 'Southern Asia', currency: 'LKR', languages: ['si', 'ta'], flag: '🇱🇰', timezone: 'Asia/Colombo', tmdbRegion: 'LK' },
  { code: 'SY', name: 'Syria', nativeName: 'سوريا', continent: 'Asia', region: 'Western Asia', currency: 'SYP', languages: ['ar'], flag: '🇸🇾', timezone: 'Asia/Damascus', tmdbRegion: 'SY' },
  { code: 'TW', name: 'Taiwan', nativeName: '臺灣', continent: 'Asia', region: 'Eastern Asia', currency: 'TWD', languages: ['zh'], flag: '🇹🇼', timezone: 'Asia/Taipei', tmdbRegion: 'TW' },
  { code: 'TJ', name: 'Tajikistan', nativeName: 'Тоҷикистон', continent: 'Asia', region: 'Central Asia', currency: 'TJS', languages: ['tg', 'ru'], flag: '🇹🇯', timezone: 'Asia/Dushanbe', tmdbRegion: 'TJ' },
  { code: 'TH', name: 'Thailand', nativeName: 'ประเทศไทย', continent: 'Asia', region: 'South-Eastern Asia', currency: 'THB', languages: ['th'], flag: '🇹🇭', timezone: 'Asia/Bangkok', tmdbRegion: 'TH' },
  { code: 'TL', name: 'Timor-Leste', nativeName: 'Timor-Leste', continent: 'Asia', region: 'South-Eastern Asia', currency: 'USD', languages: ['pt'], flag: '🇹🇱', timezone: 'Asia/Dili', tmdbRegion: 'TL' },
  { code: 'TR', name: 'Turkey', nativeName: 'Türkiye', continent: 'Asia', region: 'Western Asia', currency: 'TRY', languages: ['tr'], flag: '🇹🇷', timezone: 'Europe/Istanbul', tmdbRegion: 'TR' },
  { code: 'TM', name: 'Turkmenistan', nativeName: 'Türkmenistan', continent: 'Asia', region: 'Central Asia', currency: 'TMT', languages: ['tk', 'ru'], flag: '🇹🇲', timezone: 'Asia/Ashgabat', tmdbRegion: 'TM' },
  { code: 'AE', name: 'United Arab Emirates', nativeName: 'الإمارات العربية المتحدة', continent: 'Asia', region: 'Western Asia', currency: 'AED', languages: ['ar'], flag: '🇦🇪', timezone: 'Asia/Dubai', tmdbRegion: 'AE' },
  { code: 'UZ', name: 'Uzbekistan', nativeName: 'Oʻzbekiston', continent: 'Asia', region: 'Central Asia', currency: 'UZS', languages: ['uz', 'ru'], flag: '🇺🇿', timezone: 'Asia/Tashkent', tmdbRegion: 'UZ' },
  { code: 'VN', name: 'Vietnam', nativeName: 'Việt Nam', continent: 'Asia', region: 'South-Eastern Asia', currency: 'VND', languages: ['vi'], flag: '🇻🇳', timezone: 'Asia/Ho_Chi_Minh', tmdbRegion: 'VN' },
  { code: 'YE', name: 'Yemen', nativeName: 'اليمن', continent: 'Asia', region: 'Western Asia', currency: 'YER', languages: ['ar'], flag: '🇾🇪', timezone: 'Asia/Aden', tmdbRegion: 'YE' },

  // Europe
  { code: 'AL', name: 'Albania', nativeName: 'Shqipëri', continent: 'Europe', region: 'Southern Europe', currency: 'ALL', languages: ['sq'], flag: '🇦🇱', timezone: 'Europe/Tirane', tmdbRegion: 'AL' },
  { code: 'AD', name: 'Andorra', nativeName: 'Andorra', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['ca'], flag: '🇦🇩', timezone: 'Europe/Andorra', tmdbRegion: 'AD' },
  { code: 'AT', name: 'Austria', nativeName: 'Österreich', continent: 'Europe', region: 'Western Europe', currency: 'EUR', languages: ['de'], flag: '🇦🇹', timezone: 'Europe/Vienna', tmdbRegion: 'AT' },
  { code: 'BY', name: 'Belarus', nativeName: 'Беларусь', continent: 'Europe', region: 'Eastern Europe', currency: 'BYN', languages: ['be', 'ru'], flag: '🇧🇾', timezone: 'Europe/Minsk', tmdbRegion: 'BY' },
  { code: 'BE', name: 'Belgium', nativeName: 'België', continent: 'Europe', region: 'Western Europe', currency: 'EUR', languages: ['nl', 'fr', 'de'], flag: '🇧🇪', timezone: 'Europe/Brussels', tmdbRegion: 'BE' },
  { code: 'BA', name: 'Bosnia and Herzegovina', nativeName: 'Bosna i Hercegovina', continent: 'Europe', region: 'Southern Europe', currency: 'BAM', languages: ['bs', 'hr', 'sr'], flag: '🇧🇦', timezone: 'Europe/Sarajevo', tmdbRegion: 'BA' },
  { code: 'BG', name: 'Bulgaria', nativeName: 'България', continent: 'Europe', region: 'Eastern Europe', currency: 'BGN', languages: ['bg'], flag: '🇧🇬', timezone: 'Europe/Sofia', tmdbRegion: 'BG' },
  { code: 'HR', name: 'Croatia', nativeName: 'Hrvatska', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['hr'], flag: '🇭🇷', timezone: 'Europe/Zagreb', tmdbRegion: 'HR' },
  { code: 'CY', name: 'Cyprus', nativeName: 'Κύπρος', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['el', 'tr'], flag: '🇨🇾', timezone: 'Asia/Nicosia', tmdbRegion: 'CY' },
  { code: 'CZ', name: 'Czech Republic', nativeName: 'Česká republika', continent: 'Europe', region: 'Eastern Europe', currency: 'CZK', languages: ['cs'], flag: '🇨🇿', timezone: 'Europe/Prague', tmdbRegion: 'CZ' },
  { code: 'DK', name: 'Denmark', nativeName: 'Danmark', continent: 'Europe', region: 'Northern Europe', currency: 'DKK', languages: ['da'], flag: '🇩🇰', timezone: 'Europe/Copenhagen', tmdbRegion: 'DK' },
  { code: 'EE', name: 'Estonia', nativeName: 'Eesti', continent: 'Europe', region: 'Northern Europe', currency: 'EUR', languages: ['et'], flag: '🇪🇪', timezone: 'Europe/Tallinn', tmdbRegion: 'EE' },
  { code: 'FI', name: 'Finland', nativeName: 'Suomi', continent: 'Europe', region: 'Northern Europe', currency: 'EUR', languages: ['fi', 'sv'], flag: '🇫🇮', timezone: 'Europe/Helsinki', tmdbRegion: 'FI' },
  { code: 'FR', name: 'France', nativeName: 'France', continent: 'Europe', region: 'Western Europe', currency: 'EUR', languages: ['fr'], flag: '🇫🇷', timezone: 'Europe/Paris', tmdbRegion: 'FR' },
  { code: 'DE', name: 'Germany', nativeName: 'Deutschland', continent: 'Europe', region: 'Western Europe', currency: 'EUR', languages: ['de'], flag: '🇩🇪', timezone: 'Europe/Berlin', tmdbRegion: 'DE' },
  { code: 'GR', name: 'Greece', nativeName: 'Ελλάδα', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['el'], flag: '🇬🇷', timezone: 'Europe/Athens', tmdbRegion: 'GR' },
  { code: 'HU', name: 'Hungary', nativeName: 'Magyarország', continent: 'Europe', region: 'Eastern Europe', currency: 'HUF', languages: ['hu'], flag: '🇭🇺', timezone: 'Europe/Budapest', tmdbRegion: 'HU' },
  { code: 'IS', name: 'Iceland', nativeName: 'Ísland', continent: 'Europe', region: 'Northern Europe', currency: 'ISK', languages: ['is'], flag: '🇮🇸', timezone: 'Atlantic/Reykjavik', tmdbRegion: 'IS' },
  { code: 'IE', name: 'Ireland', nativeName: 'Éire', continent: 'Europe', region: 'Northern Europe', currency: 'EUR', languages: ['ga', 'en'], flag: '🇮🇪', timezone: 'Europe/Dublin', tmdbRegion: 'IE' },
  { code: 'IT', name: 'Italy', nativeName: 'Italia', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['it'], flag: '🇮🇹', timezone: 'Europe/Rome', tmdbRegion: 'IT' },
  { code: 'XK', name: 'Kosovo', nativeName: 'Kosova', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['sq', 'sr'], flag: '🇽🇰', timezone: 'Europe/Belgrade', tmdbRegion: 'XK' },
  { code: 'LV', name: 'Latvia', nativeName: 'Latvija', continent: 'Europe', region: 'Northern Europe', currency: 'EUR', languages: ['lv'], flag: '🇱🇻', timezone: 'Europe/Riga', tmdbRegion: 'LV' },
  { code: 'LI', name: 'Liechtenstein', nativeName: 'Liechtenstein', continent: 'Europe', region: 'Western Europe', currency: 'CHF', languages: ['de'], flag: '🇱🇮', timezone: 'Europe/Vaduz', tmdbRegion: 'LI' },
  { code: 'LT', name: 'Lithuania', nativeName: 'Lietuva', continent: 'Europe', region: 'Northern Europe', currency: 'EUR', languages: ['lt'], flag: '🇱🇹', timezone: 'Europe/Vilnius', tmdbRegion: 'LT' },
  { code: 'LU', name: 'Luxembourg', nativeName: 'Luxembourg', continent: 'Europe', region: 'Western Europe', currency: 'EUR', languages: ['fr', 'de', 'lb'], flag: '🇱🇺', timezone: 'Europe/Luxembourg', tmdbRegion: 'LU' },
  { code: 'MT', name: 'Malta', nativeName: 'Malta', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['mt', 'en'], flag: '🇲🇹', timezone: 'Europe/Malta', tmdbRegion: 'MT' },
  { code: 'MD', name: 'Moldova', nativeName: 'Moldova', continent: 'Europe', region: 'Eastern Europe', currency: 'MDL', languages: ['ro'], flag: '🇲🇩', timezone: 'Europe/Chisinau', tmdbRegion: 'MD' },
  { code: 'MC', name: 'Monaco', nativeName: 'Monaco', continent: 'Europe', region: 'Western Europe', currency: 'EUR', languages: ['fr'], flag: '🇲🇨', timezone: 'Europe/Monaco', tmdbRegion: 'MC' },
  { code: 'ME', name: 'Montenegro', nativeName: 'Црна Гора', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['sr', 'bs', 'sq', 'hr'], flag: '🇲🇪', timezone: 'Europe/Podgorica', tmdbRegion: 'ME' },
  { code: 'NL', name: 'Netherlands', nativeName: 'Nederland', continent: 'Europe', region: 'Western Europe', currency: 'EUR', languages: ['nl'], flag: '🇳🇱', timezone: 'Europe/Amsterdam', tmdbRegion: 'NL' },
  { code: 'MK', name: 'North Macedonia', nativeName: 'Северна Македонија', continent: 'Europe', region: 'Southern Europe', currency: 'MKD', languages: ['mk'], flag: '🇲🇰', timezone: 'Europe/Skopje', tmdbRegion: 'MK' },
  { code: 'NO', name: 'Norway', nativeName: 'Norge', continent: 'Europe', region: 'Northern Europe', currency: 'NOK', languages: ['no', 'nb', 'nn'], flag: '🇳🇴', timezone: 'Europe/Oslo', tmdbRegion: 'NO' },
  { code: 'PL', name: 'Poland', nativeName: 'Polska', continent: 'Europe', region: 'Eastern Europe', currency: 'PLN', languages: ['pl'], flag: '🇵🇱', timezone: 'Europe/Warsaw', tmdbRegion: 'PL' },
  { code: 'PT', name: 'Portugal', nativeName: 'Portugal', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['pt'], flag: '🇵🇹', timezone: 'Europe/Lisbon', tmdbRegion: 'PT' },
  { code: 'RO', name: 'Romania', nativeName: 'România', continent: 'Europe', region: 'Eastern Europe', currency: 'RON', languages: ['ro'], flag: '🇷🇴', timezone: 'Europe/Bucharest', tmdbRegion: 'RO' },
  { code: 'RU', name: 'Russia', nativeName: 'Россия', continent: 'Europe', region: 'Eastern Europe', currency: 'RUB', languages: ['ru'], flag: '🇷🇺', timezone: 'Europe/Moscow', tmdbRegion: 'RU' },
  { code: 'SM', name: 'San Marino', nativeName: 'San Marino', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['it'], flag: '🇸🇲', timezone: 'Europe/San_Marino', tmdbRegion: 'SM' },
  { code: 'RS', name: 'Serbia', nativeName: 'Србија', continent: 'Europe', region: 'Southern Europe', currency: 'RSD', languages: ['sr'], flag: '🇷🇸', timezone: 'Europe/Belgrade', tmdbRegion: 'RS' },
  { code: 'SK', name: 'Slovakia', nativeName: 'Slovensko', continent: 'Europe', region: 'Eastern Europe', currency: 'EUR', languages: ['sk'], flag: '🇸🇰', timezone: 'Europe/Bratislava', tmdbRegion: 'SK' },
  { code: 'SI', name: 'Slovenia', nativeName: 'Slovenija', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['sl'], flag: '🇸🇮', timezone: 'Europe/Ljubljana', tmdbRegion: 'SI' },
  { code: 'ES', name: 'Spain', nativeName: 'España', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['es'], flag: '🇪🇸', timezone: 'Europe/Madrid', tmdbRegion: 'ES' },
  { code: 'SE', name: 'Sweden', nativeName: 'Sverige', continent: 'Europe', region: 'Northern Europe', currency: 'SEK', languages: ['sv'], flag: '🇸🇪', timezone: 'Europe/Stockholm', tmdbRegion: 'SE' },
  { code: 'CH', name: 'Switzerland', nativeName: 'Schweiz', continent: 'Europe', region: 'Western Europe', currency: 'CHF', languages: ['de', 'fr', 'it'], flag: '🇨🇭', timezone: 'Europe/Zurich', tmdbRegion: 'CH' },
  { code: 'UA', name: 'Ukraine', nativeName: 'Україна', continent: 'Europe', region: 'Eastern Europe', currency: 'UAH', languages: ['uk'], flag: '🇺🇦', timezone: 'Europe/Kiev', tmdbRegion: 'UA' },
  { code: 'GB', name: 'United Kingdom', nativeName: 'United Kingdom', continent: 'Europe', region: 'Northern Europe', currency: 'GBP', languages: ['en'], flag: '🇬🇧', timezone: 'Europe/London', tmdbRegion: 'GB' },
  { code: 'VA', name: 'Vatican City', nativeName: 'Vaticano', continent: 'Europe', region: 'Southern Europe', currency: 'EUR', languages: ['it', 'la'], flag: '🇻🇦', timezone: 'Europe/Vatican', tmdbRegion: 'VA' },

  // North America
  { code: 'AG', name: 'Antigua and Barbuda', nativeName: 'Antigua and Barbuda', continent: 'North America', region: 'Caribbean', currency: 'XCD', languages: ['en'], flag: '🇦🇬', timezone: 'America/Antigua', tmdbRegion: 'AG' },
  { code: 'BS', name: 'Bahamas', nativeName: 'Bahamas', continent: 'North America', region: 'Caribbean', currency: 'BSD', languages: ['en'], flag: '🇧🇸', timezone: 'America/Nassau', tmdbRegion: 'BS' },
  { code: 'BB', name: 'Barbados', nativeName: 'Barbados', continent: 'North America', region: 'Caribbean', currency: 'BBD', languages: ['en'], flag: '🇧🇧', timezone: 'America/Barbados', tmdbRegion: 'BB' },
  { code: 'BZ', name: 'Belize', nativeName: 'Belize', continent: 'North America', region: 'Central America', currency: 'BZD', languages: ['en'], flag: '🇧🇿', timezone: 'America/Belize', tmdbRegion: 'BZ' },
  { code: 'CA', name: 'Canada', nativeName: 'Canada', continent: 'North America', region: 'Northern America', currency: 'CAD', languages: ['en', 'fr'], flag: '🇨🇦', timezone: 'America/Toronto', tmdbRegion: 'CA' },
  { code: 'CR', name: 'Costa Rica', nativeName: 'Costa Rica', continent: 'North America', region: 'Central America', currency: 'CRC', languages: ['es'], flag: '🇨🇷', timezone: 'America/Costa_Rica', tmdbRegion: 'CR' },
  { code: 'CU', name: 'Cuba', nativeName: 'Cuba', continent: 'North America', region: 'Caribbean', currency: 'CUP', languages: ['es'], flag: '🇨🇺', timezone: 'America/Havana', tmdbRegion: 'CU' },
  { code: 'DM', name: 'Dominica', nativeName: 'Dominica', continent: 'North America', region: 'Caribbean', currency: 'XCD', languages: ['en'], flag: '🇩🇲', timezone: 'America/Dominica', tmdbRegion: 'DM' },
  { code: 'DO', name: 'Dominican Republic', nativeName: 'República Dominicana', continent: 'North America', region: 'Caribbean', currency: 'DOP', languages: ['es'], flag: '🇩🇴', timezone: 'America/Santo_Domingo', tmdbRegion: 'DO' },
  { code: 'SV', name: 'El Salvador', nativeName: 'El Salvador', continent: 'North America', region: 'Central America', currency: 'USD', languages: ['es'], flag: '🇸🇻', timezone: 'America/El_Salvador', tmdbRegion: 'SV' },
  { code: 'GD', name: 'Grenada', nativeName: 'Grenada', continent: 'North America', region: 'Caribbean', currency: 'XCD', languages: ['en'], flag: '🇬🇩', timezone: 'America/Grenada', tmdbRegion: 'GD' },
  { code: 'GT', name: 'Guatemala', nativeName: 'Guatemala', continent: 'North America', region: 'Central America', currency: 'GTQ', languages: ['es'], flag: '🇬🇹', timezone: 'America/Guatemala', tmdbRegion: 'GT' },
  { code: 'HT', name: 'Haiti', nativeName: 'Haïti', continent: 'North America', region: 'Caribbean', currency: 'HTG', languages: ['fr', 'ht'], flag: '🇭🇹', timezone: 'America/Port-au-Prince', tmdbRegion: 'HT' },
  { code: 'HN', name: 'Honduras', nativeName: 'Honduras', continent: 'North America', region: 'Central America', currency: 'HNL', languages: ['es'], flag: '🇭🇳', timezone: 'America/Tegucigalpa', tmdbRegion: 'HN' },
  { code: 'JM', name: 'Jamaica', nativeName: 'Jamaica', continent: 'North America', region: 'Caribbean', currency: 'JMD', languages: ['en'], flag: '🇯🇲', timezone: 'America/Jamaica', tmdbRegion: 'JM' },
  { code: 'MX', name: 'Mexico', nativeName: 'México', continent: 'North America', region: 'Central America', currency: 'MXN', languages: ['es'], flag: '🇲🇽', timezone: 'America/Mexico_City', tmdbRegion: 'MX' },
  { code: 'NI', name: 'Nicaragua', nativeName: 'Nicaragua', continent: 'North America', region: 'Central America', currency: 'NIO', languages: ['es'], flag: '🇳🇮', timezone: 'America/Managua', tmdbRegion: 'NI' },
  { code: 'PA', name: 'Panama', nativeName: 'Panamá', continent: 'North America', region: 'Central America', currency: 'PAB', languages: ['es'], flag: '🇵🇦', timezone: 'America/Panama', tmdbRegion: 'PA' },
  { code: 'KN', name: 'Saint Kitts and Nevis', nativeName: 'Saint Kitts and Nevis', continent: 'North America', region: 'Caribbean', currency: 'XCD', languages: ['en'], flag: '🇰🇳', timezone: 'America/St_Kitts', tmdbRegion: 'KN' },
  { code: 'LC', name: 'Saint Lucia', nativeName: 'Saint Lucia', continent: 'North America', region: 'Caribbean', currency: 'XCD', languages: ['en'], flag: '🇱🇨', timezone: 'America/St_Lucia', tmdbRegion: 'LC' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', nativeName: 'Saint Vincent and the Grenadines', continent: 'North America', region: 'Caribbean', currency: 'XCD', languages: ['en'], flag: '🇻🇨', timezone: 'America/St_Vincent', tmdbRegion: 'VC' },
  { code: 'TT', name: 'Trinidad and Tobago', nativeName: 'Trinidad and Tobago', continent: 'North America', region: 'Caribbean', currency: 'TTD', languages: ['en'], flag: '🇹🇹', timezone: 'America/Port_of_Spain', tmdbRegion: 'TT' },
  { code: 'US', name: 'United States', nativeName: 'United States', continent: 'North America', region: 'Northern America', currency: 'USD', languages: ['en'], flag: '🇺🇸', timezone: 'America/New_York', tmdbRegion: 'US' },

  // South America
  { code: 'AR', name: 'Argentina', nativeName: 'Argentina', continent: 'South America', region: 'South America', currency: 'ARS', languages: ['es'], flag: '🇦🇷', timezone: 'America/Argentina/Buenos_Aires', tmdbRegion: 'AR' },
  { code: 'BO', name: 'Bolivia', nativeName: 'Bolivia', continent: 'South America', region: 'South America', currency: 'BOB', languages: ['es', 'ay', 'qu'], flag: '🇧🇴', timezone: 'America/La_Paz', tmdbRegion: 'BO' },
  { code: 'BR', name: 'Brazil', nativeName: 'Brasil', continent: 'South America', region: 'South America', currency: 'BRL', languages: ['pt'], flag: '🇧🇷', timezone: 'America/Sao_Paulo', tmdbRegion: 'BR' },
  { code: 'CL', name: 'Chile', nativeName: 'Chile', continent: 'South America', region: 'South America', currency: 'CLP', languages: ['es'], flag: '🇨🇱', timezone: 'America/Santiago', tmdbRegion: 'CL' },
  { code: 'CO', name: 'Colombia', nativeName: 'Colombia', continent: 'South America', region: 'South America', currency: 'COP', languages: ['es'], flag: '🇨🇴', timezone: 'America/Bogota', tmdbRegion: 'CO' },
  { code: 'EC', name: 'Ecuador', nativeName: 'Ecuador', continent: 'South America', region: 'South America', currency: 'USD', languages: ['es'], flag: '🇪🇨', timezone: 'America/Guayaquil', tmdbRegion: 'EC' },
  { code: 'GY', name: 'Guyana', nativeName: 'Guyana', continent: 'South America', region: 'South America', currency: 'GYD', languages: ['en'], flag: '🇬🇾', timezone: 'America/Guyana', tmdbRegion: 'GY' },
  { code: 'PY', name: 'Paraguay', nativeName: 'Paraguay', continent: 'South America', region: 'South America', currency: 'PYG', languages: ['es', 'gn'], flag: '🇵🇾', timezone: 'America/Asuncion', tmdbRegion: 'PY' },
  { code: 'PE', name: 'Peru', nativeName: 'Perú', continent: 'South America', region: 'South America', currency: 'PEN', languages: ['es'], flag: '🇵🇪', timezone: 'America/Lima', tmdbRegion: 'PE' },
  { code: 'SR', name: 'Suriname', nativeName: 'Suriname', continent: 'South America', region: 'South America', currency: 'SRD', languages: ['nl'], flag: '🇸🇷', timezone: 'America/Paramaribo', tmdbRegion: 'SR' },
  { code: 'UY', name: 'Uruguay', nativeName: 'Uruguay', continent: 'South America', region: 'South America', currency: 'UYU', languages: ['es'], flag: '🇺🇾', timezone: 'America/Montevideo', tmdbRegion: 'UY' },
  { code: 'VE', name: 'Venezuela', nativeName: 'Venezuela', continent: 'South America', region: 'South America', currency: 'VES', languages: ['es'], flag: '🇻🇪', timezone: 'America/Caracas', tmdbRegion: 'VE' },

  // Oceania
  { code: 'AU', name: 'Australia', nativeName: 'Australia', continent: 'Oceania', region: 'Australia and New Zealand', currency: 'AUD', languages: ['en'], flag: '🇦🇺', timezone: 'Australia/Sydney', tmdbRegion: 'AU' },
  { code: 'FJ', name: 'Fiji', nativeName: 'Fiji', continent: 'Oceania', region: 'Melanesia', currency: 'FJD', languages: ['en', 'fj'], flag: '🇫🇯', timezone: 'Pacific/Fiji', tmdbRegion: 'FJ' },
  { code: 'KI', name: 'Kiribati', nativeName: 'Kiribati', continent: 'Oceania', region: 'Micronesia', currency: 'AUD', languages: ['en'], flag: '🇰🇮', timezone: 'Pacific/Tarawa', tmdbRegion: 'KI' },
  { code: 'MH', name: 'Marshall Islands', nativeName: 'Marshall Islands', continent: 'Oceania', region: 'Micronesia', currency: 'USD', languages: ['en', 'mh'], flag: '🇲🇭', timezone: 'Pacific/Majuro', tmdbRegion: 'MH' },
  { code: 'FM', name: 'Micronesia', nativeName: 'Micronesia', continent: 'Oceania', region: 'Micronesia', currency: 'USD', languages: ['en'], flag: '🇫🇲', timezone: 'Pacific/Pohnpei', tmdbRegion: 'FM' },
  { code: 'NR', name: 'Nauru', nativeName: 'Nauru', continent: 'Oceania', region: 'Micronesia', currency: 'AUD', languages: ['en', 'na'], flag: '🇳🇷', timezone: 'Pacific/Nauru', tmdbRegion: 'NR' },
  { code: 'NZ', name: 'New Zealand', nativeName: 'New Zealand', continent: 'Oceania', region: 'Australia and New Zealand', currency: 'NZD', languages: ['en', 'mi'], flag: '🇳🇿', timezone: 'Pacific/Auckland', tmdbRegion: 'NZ' },
  { code: 'PW', name: 'Palau', nativeName: 'Palau', continent: 'Oceania', region: 'Micronesia', currency: 'USD', languages: ['en'], flag: '🇵🇼', timezone: 'Pacific/Palau', tmdbRegion: 'PW' },
  { code: 'PG', name: 'Papua New Guinea', nativeName: 'Papua Niugini', continent: 'Oceania', region: 'Melanesia', currency: 'PGK', languages: ['en'], flag: '🇵🇬', timezone: 'Pacific/Port_Moresby', tmdbRegion: 'PG' },
  { code: 'WS', name: 'Samoa', nativeName: 'Samoa', continent: 'Oceania', region: 'Polynesia', currency: 'WST', languages: ['sm', 'en'], flag: '🇼🇸', timezone: 'Pacific/Apia', tmdbRegion: 'WS' },
  { code: 'SB', name: 'Solomon Islands', nativeName: 'Solomon Islands', continent: 'Oceania', region: 'Melanesia', currency: 'SBD', languages: ['en'], flag: '🇸🇧', timezone: 'Pacific/Guadalcanal', tmdbRegion: 'SB' },
  { code: 'TO', name: 'Tonga', nativeName: 'Tonga', continent: 'Oceania', region: 'Polynesia', currency: 'TOP', languages: ['en', 'to'], flag: '🇹🇴', timezone: 'Pacific/Tongatapu', tmdbRegion: 'TO' },
  { code: 'TV', name: 'Tuvalu', nativeName: 'Tuvalu', continent: 'Oceania', region: 'Polynesia', currency: 'AUD', languages: ['en'], flag: '🇹🇻', timezone: 'Pacific/Funafuti', tmdbRegion: 'TV' },
  { code: 'VU', name: 'Vanuatu', nativeName: 'Vanuatu', continent: 'Oceania', region: 'Melanesia', currency: 'VUV', languages: ['bi', 'en', 'fr'], flag: '🇻🇺', timezone: 'Pacific/Efate', tmdbRegion: 'VU' },
];

/**
 * Get country by code
 */
export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code.toUpperCase() === code.toUpperCase());
}

/**
 * Get countries by continent
 */
export function getCountriesByContinent(continent: string): Country[] {
  return COUNTRIES.filter(c => c.continent === continent);
}

/**
 * Get countries by region
 */
export function getCountriesByRegion(region: string): Country[] {
  return COUNTRIES.filter(c => c.region === region);
}

/**
 * Search countries by name
 */
export function searchCountries(query: string): Country[] {
  const lowerQuery = query.toLowerCase();
  return COUNTRIES.filter(
    c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.nativeName.toLowerCase().includes(lowerQuery) ||
      c.code.toLowerCase() === lowerQuery
  );
}

/**
 * Get all continents
 */
export function getContinents(): string[] {
  return Array.from(new Set(COUNTRIES.map(c => c.continent)));
}

/**
 * Get all regions
 */
export function getRegions(): string[] {
  return Array.from(new Set(COUNTRIES.map(c => c.region)));
}

/**
 * Detect country from IP (browser-based)
 */
export async function detectCountryFromIP(): Promise<Country | null> {
  try {
    // Using ipapi.co (free tier: 1000 requests/day)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.country_code) {
      return getCountryByCode(data.country_code) || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error detecting country from IP:', error);
    return null;
  }
}

/**
 * Detect country from timezone
 */
export function detectCountryFromTimezone(): Country | null {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const country = COUNTRIES.find(c => c.timezone === timezone);
    return country || null;
  } catch (error) {
    console.error('Error detecting country from timezone:', error);
    return null;
  }
}

/**
 * Detect country from language
 */
export function detectCountriesFromLanguage(lang: string): Country[] {
  return COUNTRIES.filter(c => c.languages.includes(lang));
}

/**
 * Get country data for recommendations
 */
export interface CountryRecommendationData {
  country: Country;
  preferredLanguages: string[];
  preferredRegion: string;
  similarCountries: Country[];
}

export function getCountryRecommendationData(
  countryCode: string
): CountryRecommendationData | null {
  const country = getCountryByCode(countryCode);
  
  if (!country) return null;
  
  // Get similar countries (same region)
  const similarCountries = COUNTRIES.filter(
    c => c.region === country.region && c.code !== country.code
  ).slice(0, 5);
  
  return {
    country,
    preferredLanguages: country.languages,
    preferredRegion: country.tmdbRegion || country.code,
    similarCountries,
  };
}

