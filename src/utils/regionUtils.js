// utils/regionUtils.js
import { provinces } from '../configs/provinces.js';

// จัดกลุ่มจังหวัดตามภูมิภาค
export const THAILAND_REGIONS = {
  central: {
    name: { th: 'ภาคกลาง', en: 'Central Thailand' },
    provinces: [
      'กรุงเทพมหานคร', 'นครปฐม', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 
      'สมุทรสาคร', 'สมุทรสงคราม', 'ลพบุรี', 'ชัยนาท', 'สิงห์บุรี', 
      'อ่างทอง', 'สระบุรี', 'นครนายก', 'ฉะเชิงเทรา', 'ปราจีนบุรี', 
      'สุพรรณบุรี', 'กาญจนบุรี', 'ราชบุรี', 'เพชรบุรี', 'ประจวบคีรีขันธ์'
    ]
  },
  north: {
    name: { th: 'ภาคเหนือ', en: 'Northern Thailand' },
    provinces: [
      'เชียงใหม่', 'เชียงราย', 'แม่ฮ่องสอน', 'น่าน', 'พะเยา', 'แพร่', 
      'ลำปาง', 'ลำพูน', 'อุตรดิตถ์', 'ตาก', 'สุโขทัย', 'พิษณุโลก', 
      'พิจิตร', 'เพชรบูรณ์', 'กำแพงเพชร', 'นครสวรรค์', 'อุทัยธานี'
    ]
  },
  northeast: {
    name: { th: 'ภาคตะวันออกเฉียงเหนือ', en: 'Northeastern Thailand' },
    provinces: [
      'นครราชสีมา', 'บุรีรัมย์', 'สุรินทร์', 'ศรีสะเกษ', 'อุบลราชธานี', 
      'ยโสธร', 'ชัยภูมิ', 'อำนาจเจริญ', 'หนองบัวลำภู', 'ขอนแก่น', 
      'อุดรธานี', 'เลย', 'หนองคาย', 'บึงกาฬ', 'สกลนคร', 'นครพนม', 
      'มุกดาหาร', 'กาฬสินธุ์', 'ร้อยเอ็ด', 'มหาสารคาม'
    ]
  },
  east: {
    name: { th: 'ภาคตะวันออก', en: 'Eastern Thailand' },
    provinces: [
      'ระยอง', 'ชลบุรี', 'จันทบุรี', 'ตราด', 'สระแก้ว'
    ]
  },
  south: {
    name: { th: 'ภาคใต้', en: 'Southern Thailand' },
    provinces: [
      'ชุมพร', 'ระนอง', 'สุราษฎร์ธานี', 'พังงา', 'กระบี่', 'ภูเก็ต', 
      'นครศรีธรรมราช', 'ตรัง', 'พัทลุง', 'สงขลา', 'สตูล', 'ปัตตานี', 
      'ยะลา', 'นราธิวาส'
    ]
  }
};

// ฟังก์ชันหาภูมิภาคของจังหวัด
export const getProvinceRegion = (provinceName) => {
  for (const [regionKey, regionData] of Object.entries(THAILAND_REGIONS)) {
    if (regionData.provinces.includes(provinceName)) {
      return {
        key: regionKey,
        name: regionData.name
      };
    }
  }
  return null;
};

// ฟังก์ชันจัดกลุ่ม suggestions ตามภูมิภาค
export const groupSuggestionsByRegion = (suggestions, language = 'th') => {
  const groupedSuggestions = {};
  
  suggestions.forEach(suggestion => {
    // ตรวจสอบว่า suggestion เป็นจังหวัดหรือไม่
    const province = provinces.find(p => 
      p.names.th === suggestion.name || 
      p.names.en === suggestion.name ||
      suggestion.name?.includes(p.names.th) ||
      suggestion.name?.includes(p.names.en)
    );
    
    if (province) {
      const region = getProvinceRegion(province.names.th);
      if (region) {
        const regionName = region.name[language] || region.name.th;
        
        if (!groupedSuggestions[regionName]) {
          groupedSuggestions[regionName] = {
            regionKey: region.key,
            regionName: regionName,
            suggestions: []
          };
        }
        
        groupedSuggestions[regionName].suggestions.push({
          ...suggestion,
          province: province.names[language] || province.names.th,
          region: regionName
        });
      }
    } else {
      // สำหรับ suggestions ที่ไม่ใช่จังหวัด จัดเป็นกลุ่ม "อื่นๆ"
      const otherGroupName = language === 'th' ? 'อื่นๆ' : 'Others';
      if (!groupedSuggestions[otherGroupName]) {
        groupedSuggestions[otherGroupName] = {
          regionKey: 'others',
          regionName: otherGroupName,
          suggestions: []
        };
      }
      groupedSuggestions[otherGroupName].suggestions.push(suggestion);
    }
  });
  
  return groupedSuggestions;
};

// ฟังก์ชันเรียงลำดับภูมิภาค
export const getSortedRegions = (groupedSuggestions, language = 'th') => {
  const regionOrder = ['central', 'north', 'northeast', 'east', 'south', 'others'];
  
  return regionOrder
    .map(regionKey => {
      const regionName = regionKey === 'others' 
        ? (language === 'th' ? 'อื่นๆ' : 'Others')
        : THAILAND_REGIONS[regionKey]?.name[language] || THAILAND_REGIONS[regionKey]?.name.th;
      
      return groupedSuggestions[regionName];
    })
    .filter(Boolean);
};

// ฟังก์ชันจัดกลุ่มสถานที่ตามจังหวัด
export const groupPlacesByProvince = (places) => {
  const grouped = {};
  
  places.forEach(place => {
    const provinceName = place.province?.name || place.provinceName || 'อื่นๆ';
    
    if (!grouped[provinceName]) {
      grouped[provinceName] = {
        provinceName,
        places: [],
        region: getProvinceRegion(provinceName)
      };
    }
    
    grouped[provinceName].places.push(place);
  });
  
  return grouped;
};

// ฟังก์ชันเรียงลำดับจังหวัดตามภูมิภาค
export const getSortedProvinceGroups = (groupedPlaces, language = 'th') => {
  const regionOrder = ['central', 'north', 'northeast', 'east', 'south'];
  const sortedGroups = [];
  const unassignedGroups = [];
  const processedGroups = new Set();
  
  // จัดกลุ่มตามภูมิภาคที่กำหนด
  regionOrder.forEach(regionKey => {
    Object.values(groupedPlaces).forEach(group => {
      if (group.region?.key === regionKey && !processedGroups.has(group.provinceName)) {
        sortedGroups.push(group);
        processedGroups.add(group.provinceName);
      }
    });
  });
  
  // เพิ่มจังหวัดที่ไม่ได้จัดกลุ่มหรือไม่มีภูมิภาค
  Object.values(groupedPlaces).forEach(group => {
    if (!processedGroups.has(group.provinceName)) {
      unassignedGroups.push(group);
    }
  });
  
  return [...sortedGroups, ...unassignedGroups];
};
