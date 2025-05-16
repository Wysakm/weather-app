
const weatherCodeToIcon = (code, isDaytime = true) => {
  const prefix = isDaytime ? 'wi-day-' : 'wi-night-';

  switch (code) {
    case 0: return isDaytime ? 'wi-day-sunny' : 'wi-night-clear'; // Clear Sky
    case 1: return isDaytime ? 'wi-day-sunny-overcast' : 'wi-night-cloudy'; // Mainly Clear / Clear Night
    case 2: return prefix + 'cloudy'; // Partly Cloudy
    case 3: return 'wi-cloudy'; // Overcast
    case 45: return 'wi-fog'; // Fog
    case 48: return 'wi-fog'; // Depositing rime fog
    case 51: return prefix + 'sprinkle'; // Light Drizzle
    case 53: return prefix + 'sprinkle'; // Moderate Drizzle
    case 55: return prefix + 'showers'; // Dense Drizzle
    case 56: return prefix + 'showers'; // Light Freezing Drizzle
    case 57: return prefix + 'showers'; // Dense Freezing Drizzle
    case 61: return 'wi-rain'; // Slight Rain
    case 63: return 'wi-rain'; // Moderate Rain
    case 65: return 'wi-rain'; // Heavy Rain
    case 66: return 'wi-rain-mix'; // Light Freezing Rain
    case 67: return 'wi-rain-mix'; // Heavy Freezing Rain
    case 71: return 'wi-snow'; // Slight Snow Fall
    case 73: return 'wi-snow'; // Moderate Snow Fall
    case 75: return 'wi-snow'; // Heavy Snow Fall
    case 77: return 'wi-snowflake-cold'; // Snow Grains
    case 80: return 'wi-showers'; // Slight Rain Showers
    case 81: return 'wi-showers'; // Moderate Rain Showers
    case 82: return 'wi-showers'; // Violent Rain Showers
    case 85: return 'wi-snow-wind'; // Slight Snow Showers
    case 86: return 'wi-snow-wind'; // Heavy Snow Showers
    case 95: return 'wi-thunderstorm'; // Thunderstorm
    case 96: return 'wi-thunderstorm'; // Thunderstorm w/ Slight Hail
    case 99: return 'wi-thunderstorm'; // Thunderstorm w/ Heavy Hail
    default: return 'wi-na'; // Unknown
  }
};

const weatherCodeToDescription = (code, lang = 'en') => {
  const descriptions = {
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

  return descriptions[lang][code] || (lang === 'th' ? 'ไม่ทราบสภาพอากาศ' : 'Unknown weather');
};

export { weatherCodeToIcon, weatherCodeToDescription };

