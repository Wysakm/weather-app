const p = [
  {
    "names": { "th": "กรุงเทพมหานคร", "en": "Bangkok" },
    "lat": 13.7563,
    "lon": 100.5018
  },
  {
    "names": { "th": "กระบี่", "en": "Krabi" },
    "lat": 8.0863,
    "lon": 98.9063
  },
  {
    "names": { "th": "กาญจนบุรี", "en": "Kanchanaburi" },
    "lat": 14.0227,
    "lon": 99.5328
  },
  {
    "names": { "th": "กาฬสินธุ์", "en": "Kalasin" },
    "lat": 16.4315,
    "lon": 103.5059
  },
  {
    "names": { "th": "กำแพงเพชร", "en": "Kamphaeng Phet" },
    "lat": 16.4827,
    "lon": 99.5226
  },
  {
    "names": { "th": "ขอนแก่น", "en": "Khon Kaen" },
    "lat": 16.4419,
    "lon": 102.8360
  },
  {
    "names": { "th": "จันทบุรี", "en": "Chanthaburi" },
    "lat": 12.6113,
    "lon": 102.1035
  },
  {
    "names": { "th": "ฉะเชิงเทรา", "en": "Chachoengsao" },
    "lat": 13.6904,
    "lon": 101.0772
  },
  {
    "names": { "th": "ชลบุรี", "en": "Chonburi" },
    "lat": 13.3611,
    "lon": 100.9847
  },
  {
    "names": { "th": "ชัยนาท", "en": "Chai Nat" },
    "lat": 15.1851,
    "lon": 100.1251
  },
  {
    "names": { "th": "ชัยภูมิ", "en": "Chaiyaphum" },
    "lat": 15.8068,
    "lon": 102.0284
  },
  {
    "names": { "th": "ชุมพร", "en": "Chumphon" },
    "lat": 10.4930,
    "lon": 99.1800
  },
  {
    "names": { "th": "เชียงราย", "en": "Chiang Rai" },
    "lat": 19.9071,
    "lon": 99.8305
  },
  {
    "names": { "th": "เชียงใหม่", "en": "Chiang Mai" },
    "lat": 18.7883,
    "lon": 98.9853
  },
  {
    "names": { "th": "ตรัง", "en": "Trang" },
    "lat": 7.5593,
    "lon": 99.6110
  },
  {
    "names": { "th": "ตราด", "en": "Trat" },
    "lat": 12.2427,
    "lon": 102.5177
  },
  {
    "names": { "th": "ตาก", "en": "Tak" },
    "lat": 16.8839,
    "lon": 99.1258
  },
  {
    "names": { "th": "นครนายก", "en": "Nakhon Nayok" },
    "lat": 14.2057,
    "lon": 101.2131
  },
  {
    "names": { "th": "นครปฐม", "en": "Nakhon Pathom" },
    "lat": 13.8196,
    "lon": 100.0645
  },
  {
    "names": { "th": "นครพนม", "en": "Nakhon Phanom" },
    "lat": 17.3910,
    "lon": 104.7690
  },
  {
    "names": { "th": "นครราชสีมา", "en": "Nakhon Ratchasima" },
    "lat": 14.9799,
    "lon": 102.0978
  },
  {
    "names": { "th": "นครศรีธรรมราช", "en": "Nakhon Si Thammarat" },
    "lat": 8.4304,
    "lon": 99.9633
  },
  {
    "names": { "th": "นครสวรรค์", "en": "Nakhon Sawan" },
    "lat": 15.7030,
    "lon": 100.1367
  },
  {
    "names": { "th": "นนทบุรี", "en": "Nonthaburi" },
    "lat": 13.8622,
    "lon": 100.5144
  },
  {
    "names": { "th": "นราธิวาส", "en": "Narathiwat" },
    "lat": 6.4251,
    "lon": 101.8252
  },
  {
    "names": { "th": "น่าน", "en": "Nan" },
    "lat": 18.7756,
    "lon": 100.7734
  },
  {
    "names": { "th": "บึงกาฬ", "en": "Bueng Kan" },
    "lat": 18.3609,
    "lon": 103.6466
  },
  {
    "names": { "th": "บุรีรัมย์", "en": "Buriram" },
    "lat": 14.9953,
    "lon": 103.1029
  },
  {
    "names": { "th": "ปทุมธานี", "en": "Pathum Thani" },
    "lat": 14.0208,
    "lon": 100.5235
  },
  {
    "names": { "th": "ประจวบคีรีขันธ์", "en": "Prachuap Khiri Khan" },
    "lat": 11.8126,
    "lon": 99.7957
  },
  {
    "names": { "th": "ปราจีนบุรี", "en": "Prachinburi" },
    "lat": 14.0579,
    "lon": 101.3725
  },
  {
    "names": { "th": "ปัตตานี", "en": "Pattani" },
    "lat": 6.8692,
    "lon": 101.2550
  },
  {
    "names": { "th": "พระนครศรีอยุธยา", "en": "Phra Nakhon Si Ayutthaya" },
    "lat": 14.3692,
    "lon": 100.5876
  },
  {
    "names": { "th": "พะเยา", "en": "Phayao" },
    "lat": 19.1664,
    "lon": 100.2002
  },
  {
    "names": { "th": "พังงา", "en": "Phang Nga" },
    "lat": 8.4510,
    "lon": 98.5150
  },
  {
    "names": { "th": "พัทลุง", "en": "Phatthalung" },
    "lat": 7.6174,
    "lon": 100.0743
  },
  {
    "names": { "th": "พิจิตร", "en": "Phichit" },
    "lat": 16.4429,
    "lon": 100.3487
  },
  {
    "names": { "th": "พิษณุโลก", "en": "Phitsanulok" },
    "lat": 16.8298,
    "lon": 100.2654
  },
  {
    "names": { "th": "เพชรบุรี", "en": "Phetchaburi" },
    "lat": 13.1119,
    "lon": 99.9399
  },
  {
    "names": { "th": "เพชรบูรณ์", "en": "Phetchabun" },
    "lat": 16.4189,
    "lon": 101.1591
  },
  {
    "names": { "th": "แพร่", "en": "Phrae" },
    "lat": 18.1445,
    "lon": 100.1405
  },
  {
    "names": { "th": "ภูเก็ต", "en": "Phuket" },
    "lat": 7.8804,
    "lon": 98.3923
  },
  {
    "names": { "th": "มหาสารคาม", "en": "Maha Sarakham" },
    "lat": 16.1851,
    "lon": 103.3027
  },
  {
    "names": { "th": "มุกดาหาร", "en": "Mukdahan" },
    "lat": 16.5420,
    "lon": 104.7208
  },
  {
    "names": { "th": "แม่ฮ่องสอน", "en": "Mae Hong Son" },
    "lat": 19.3020,
    "lon": 97.9654
  },
  {
    "names": { "th": "ยโสธร", "en": "Yasothon" },
    "lat": 15.7927,
    "lon": 104.1451
  },
  {
    "names": { "th": "ยะลา", "en": "Yala" },
    "lat": 6.5413,
    "lon": 101.2803
  },
  {
    "names": { "th": "ร้อยเอ็ด", "en": "Roi Et" },
    "lat": 16.0538,
    "lon": 103.6520
  },
  {
    "names": { "th": "ระนอง", "en": "Ranong" },
    "lat": 9.9529,
    "lon": 98.6085
  },
  {
    "names": { "th": "ระยอง", "en": "Rayong" },
    "lat": 12.6833,
    "lon": 101.2372
  },
  {
    "names": { "th": "ราชบุรี", "en": "Ratchaburi" },
    "lat": 13.5282,
    "lon": 99.8134
  },
  {
    "names": { "th": "ลพบุรี", "en": "Lopburi" },
    "lat": 14.7995,
    "lon": 100.6534
  },
  {
    "names": { "th": "ลำปาง", "en": "Lampang" },
    "lat": 18.2783,
    "lon": 99.4877
  },
  {
    "names": { "th": "ลำพูน", "en": "Lamphun" },
    "lat": 18.5744,
    "lon": 99.0087
  },
  {
    "names": { "th": "เลย", "en": "Loei" },
    "lat": 17.4860,
    "lon": 101.7223
  },
  {
    "names": { "th": "ศรีสะเกษ", "en": "Sisaket" },
    "lat": 15.1186,
    "lon": 104.3242
  },
  {
    "names": { "th": "สกลนคร", "en": "Sakon Nakhon" },
    "lat": 17.1555,
    "lon": 104.1348
  },
  {
    "names": { "th": "สงขลา", "en": "Songkhla" },
    "lat": 7.1896,
    "lon": 100.5945
  },
  {
    "names": { "th": "สตูล", "en": "Satun" },
    "lat": 6.6238,
    "lon": 100.0678
  },
  {
    "names": { "th": "สมุทรปราการ", "en": "Samut Prakan" },
    "lat": 13.5990,
    "lon": 100.5998
  },
  {
    "names": { "th": "สมุทรสงคราม", "en": "Samut Songkhram" },
    "lat": 13.4125,
    "lon": 100.0024
  },
  {
    "names": { "th": "สมุทรสาคร", "en": "Samut Sakhon" },
    "lat": 13.5475,
    "lon": 100.2746
  },
  {
    "names": { "th": "สระแก้ว", "en": "Sa Kaeo" },
    "lat": 13.8244,
    "lon": 102.0645
  },
  {
    "names": { "th": "สระบุรี", "en": "Saraburi" },
    "lat": 14.5289,
    "lon": 100.9108
  },
  {
    "names": { "th": "สิงห์บุรี", "en": "Sing Buri" },
    "lat": 14.8907,
    "lon": 100.3968
  },
  {
    "names": { "th": "สุโขทัย", "en": "Sukhothai" },
    "lat": 17.0068,
    "lon": 99.8265
  },
  {
    "names": { "th": "สุพรรณบุรี", "en": "Suphan Buri" },
    "lat": 14.4744,
    "lon": 100.1177
  },
  {
    "names": { "th": "สุราษฎร์ธานี", "en": "Surat Thani" },
    "lat": 9.1381,
    "lon": 99.3217
  },
  {
    "names": { "th": "สุรินทร์", "en": "Surin" },
    "lat": 14.8820,
    "lon": 103.4960
  },
  {
    "names": { "th": "หนองคาย", "en": "Nong Khai" },
    "lat": 17.8783,
    "lon": 102.7470
  },
  {
    "names": { "th": "หนองบัวลำภู", "en": "Nong Bua Lamphu" },
    "lat": 17.2216,
    "lon": 102.4262
  },
  {
    "names": { "th": "อ่างทอง", "en": "Ang Thong" },
    "lat": 14.5896,
    "lon": 100.4549
  },
  {
    "names": { "th": "อำนาจเจริญ", "en": "Amnat Charoen" },
    "lat": 15.8656,
    "lon": 104.6265
  },
  {
    "names": { "th": "อุดรธานี", "en": "Udon Thani" },
    "lat": 17.4064,
    "lon": 102.7872
  },
  {
    "names": { "th": "อุตรดิตถ์", "en": "Uttaradit" },
    "lat": 17.6200,
    "lon": 100.0993
  },
  {
    "names": { "th": "อุทัยธานี", "en": "Uthai Thani" },
    "lat": 15.3835,
    "lon": 100.0248
  },
  {
    "names": { "th": "อุบลราชธานี", "en": "Ubon Ratchathani" },
    "lat": 15.2400,
    "lon": 104.8470
  }
]

const checkDuplicates = (p) => {
  // Check total count
  console.log('Total provinces:', p.length);

  // Check for duplicate names
  const thNames = p.map(province => province.names.th);
  const enNames = p.map(province => province.names.en);
  
  const duplicateThNames = thNames.filter((name, index) => thNames.indexOf(name) !== index);
  const duplicateEnNames = enNames.filter((name, index) => enNames.indexOf(name) !== index);

  // Check for duplicate coordinates
  const coordinates = p.map(province => `${province.lat},${province.lon}`);
  const duplicateCoords = coordinates.filter((coord, index) => coordinates.indexOf(coord) !== index);

  // Find provinces with same coordinates
  const coordDuplicates = duplicateCoords.map(coord => {
    const [lat, lon] = coord.split(',');
    return p.filter(province => province.lat === Number(lat) && province.lon === Number(lon));
  });

  console.log('\nResults:');
  console.log('Duplicate Thai names:', duplicateThNames);
  console.log('Duplicate English names:', duplicateEnNames);
  
  if (coordDuplicates.length > 0) {
    console.log('\nProvinces with same coordinates:');
    coordDuplicates.forEach(group => {
      console.log(group.map(p => p.names.th).join(', '));
    });
  }
};

// Run the check
checkDuplicates(p);