const WEATHER_ICONS = {
  day: {
    0: 'wi-day-sunny',                // Clear Sky
    1: 'wi-day-sunny-overcast',       // Mainly Clear
    2: 'wi-day-cloudy',              // Partly Cloudy
    3: 'wi-cloudy',                  // Overcast
    45: 'wi-fog',                    // Fog
    48: 'wi-fog',                    // Depositing rime fog
    51: 'wi-day-sprinkle',           // Light Drizzle
    53: 'wi-day-sprinkle',           // Moderate Drizzle
    55: 'wi-day-showers',            // Dense Drizzle
    56: 'wi-day-showers',            // Light Freezing Drizzle
    57: 'wi-day-showers',            // Dense Freezing Drizzle
    61: 'wi-rain',                   // Slight Rain
    63: 'wi-rain',                   // Moderate Rain
    65: 'wi-rain',                   // Heavy Rain
    66: 'wi-rain-mix',               // Light Freezing Rain
    67: 'wi-rain-mix',               // Heavy Freezing Rain
    71: 'wi-snow',                   // Slight Snow Fall
    73: 'wi-snow',                   // Moderate Snow Fall
    75: 'wi-snow',                   // Heavy Snow Fall
    77: 'wi-snowflake-cold',         // Snow Grains
    80: 'wi-showers',                // Slight Rain Showers
    81: 'wi-showers',                // Moderate Rain Showers
    82: 'wi-showers',                // Violent Rain Showers
    85: 'wi-snow-wind',              // Slight Snow Showers
    86: 'wi-snow-wind',              // Heavy Snow Showers
    95: 'wi-thunderstorm',           // Thunderstorm
    96: 'wi-thunderstorm',           // Thunderstorm w/ Slight Hail
    99: 'wi-thunderstorm'            // Thunderstorm w/ Heavy Hail
  },
  night: {
    0: 'wi-night-clear',             // Clear Sky
    1: 'wi-night-cloudy',            // Mainly Clear
    2: 'wi-night-cloudy',            // Partly Cloudy
    51: 'wi-night-sprinkle',         // Light Drizzle
    53: 'wi-night-sprinkle',         // Moderate Drizzle
    55: 'wi-night-showers',          // Dense Drizzle
    56: 'wi-night-showers',          // Light Freezing Drizzle
    57: 'wi-night-showers'           // Dense Freezing Drizzle
    // Other codes will fallback to day icons
  }
};

const weatherCodeToIcon = (code, isDaytime = true) => {
  const timeOfDay = isDaytime ? 'day' : 'night';
  const icon = WEATHER_ICONS[timeOfDay][code];
  
  // Fallback to day icons for codes without night variants
  if (!icon && !isDaytime) {
    return WEATHER_ICONS.day[code] || 'wi-na';
  }
  
  return icon || 'wi-na';
};

// แยก descriptions ออกมาเป็น constant
const WEATHER_DESCRIPTIONS = {
  en: {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  },
  th: {
    0: 'ท้องฟ้าแจ่มใส',
    1: 'ส่วนใหญ่แจ่มใส',
    2: 'มีเมฆบางส่วน',
    3: 'เมฆมาก',
    45: 'หมอก',
    48: 'หมอกเยือกแข็ง',
    51: 'ฝนปรอยเล็กน้อย',
    53: 'ฝนปรอยปานกลาง',
    55: 'ฝนปรอยหนัก',
    56: 'ฝนน้ำแข็งเบา',
    57: 'ฝนน้ำแข็งหนัก',
    61: 'ฝนเล็กน้อย',
    63: 'ฝนปานกลาง',
    65: 'ฝนหนัก',
    66: 'ฝนน้ำแข็งเล็กน้อย',
    67: 'ฝนน้ำแข็งหนัก',
    71: 'หิมะตกเล็กน้อย',
    73: 'หิมะตกปานกลาง',
    75: 'หิมะตกหนัก',
    77: 'เกล็ดหิมะ',
    80: 'ฝนตกปรอย',
    81: 'ฝนตกปานกลาง',
    82: 'ฝนตกหนักมาก',
    85: 'หิมะตกเล็กน้อย',
    86: 'หิมะตกหนัก',
    95: 'พายุฝนฟ้าคะนอง',
    96: 'พายุฝนฟ้าคะนองกับลูกเห็บเล็กน้อย',
    99: 'พายุฝนฟ้าคะนองกับลูกเห็บหนัก'
  }
};

// เพิ่ม validation และ type safety
const weatherCodeToDescription = (code, lang = 'en') => {
  // Validate language support
  if (!['en', 'th'].includes(lang)) {
    console.warn(`Unsupported language: ${lang}, falling back to English`);
    lang = 'en';
  }

  // Validate weather code
  if (typeof code !== 'number') {
    console.warn(`Invalid weather code: ${code}`);
    return lang === 'th' ? 'ไม่ทราบสภาพอากาศ' : 'Unknown weather';
  }

  return WEATHER_DESCRIPTIONS[lang][code] || 
    (lang === 'th' ? 'ไม่ทราบสภาพอากาศ' : 'Unknown weather');
};

export { 
  weatherCodeToIcon, 
  weatherCodeToDescription,
  WEATHER_DESCRIPTIONS // Export for testing or external use
};

