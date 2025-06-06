# Default Images Implementation Summary

## วัตถุประสงค์
เพิ่มระบบรูปภาพ default สำหรับกรณีที่รูปภาพไม่สามารถโหลดได้ โดยแบ่งตาม type ของ post:
- **camp/camping**: ใช้ `camp.webp`
- **stay/accommodation/hotel/resort**: ใช้ `stay.webp`
- **อื่นๆ**: ใช้ `province.webp`

## ไฟล์ที่เปลี่ยนแปลง

### 1. สร้างไฟล์ใหม่: `/src/utils/imageUtils.js`
```javascript
/**
 * Utility functions for handling default images based on post types
 */

export const getDefaultImageByType = (type) => {
  switch (type?.toLowerCase()) {
    case 'camp':
    case 'camping':
      return './image/camp.webp';
    case 'stay':
    case 'accommodation':
    case 'hotel':
    case 'resort':
      return './image/stay.webp';
    default:
      return './image/province.webp'; // Default for other types
  }
};

export const handleImageError = (event, type) => {
  const defaultImage = getDefaultImageByType(type);
  if (event.target.src !== defaultImage) {
    event.target.src = defaultImage;
  }
};

export const getImageWithFallback = (imgUrl, type) => {
  return imgUrl || getDefaultImageByType(type);
};
```

### 2. อัพเดต `/src/components/CardTourist.jsx`
**เปลี่ยนแปลงหลัก:**
- เพิ่ม prop `type` 
- ใช้ `getImageWithFallback()` สำหรับ initial image
- เพิ่ม `onError` handler สำหรับ fallback กรณีรูปไม่โหลด

```jsx
import { getImageWithFallback, handleImageError } from "../utils/imageUtils";

const CardTourist = ({ id, province, name, imgUrl, type }) => {
  const imageSrc = getImageWithFallback(imgUrl, type);

  return (
    <div className="card-tourist">
      <div className="card-tourist-image">
        <img 
          src={imageSrc} 
          alt={name} 
          onError={(e) => handleImageError(e, type)}
          style={{...}} 
        />
      </div>
      // ...existing code...
    </div>
  );
};
```

### 3. อัพเดต Components ที่ใช้ CardTourist

#### `/src/components/CardCampBox.jsx`
```jsx
<CardTourist 
  key={index}
  province={item.province}
  name={item.name}
  imgUrl={item.imgUrl}
  type="camp"  // ✅ เพิ่ม
/>
```

#### `/src/components/CardStayBox.jsx`
```jsx
<CardTourist 
  key={index}
  province={item.province}
  name={item.name}
  imgUrl={item.imgUrl}
  type="stay"  // ✅ เพิ่ม
/>
```

#### `/src/components/CardCampcontainer.jsx`
```jsx
<CardTourist
  key={index}
  id={item.id_post}
  province={item.place.province.name}
  name={item.title}
  imgUrl={item.image}
  type="camp"  // ✅ เพิ่ม
/>
```

#### `/src/components/CardStayContainer.jsx`
```jsx
<CardTourist
  key={index}
  id={item.id_post}
  province={item.place.province.name}
  name={item.title}
  imgUrl={item.image}
  type="stay"  // ✅ เพิ่ม
/>
```

#### `/src/components/CardTravelerContainer.jsx`
```jsx
<CardTourist
  key={index}
  id={item.id_post}
  province={item.place.province.name}
  name={item.title}
  imgUrl={item.image}
  type={item.place?.place_types?.name || "tourist"}  // ✅ เพิ่ม (ดึงจาก API)
/>
```

## รูปภาพที่ใช้

### รูปภาพที่มีอยู่ในโปรเจกต์:
- ✅ `public/image/camp.webp` - สำหรับ camp/camping
- ✅ `public/image/stay.webp` - สำหรับ stay/accommodation  
- ✅ `public/image/province.webp` - สำหรับ type อื่นๆ

## วิธีการทำงาน

### 1. การเลือกรูป Default
```javascript
// เมื่อไม่มี imgUrl หรือ imgUrl เป็น null/undefined
const imageSrc = getImageWithFallback(imgUrl, type);
// ระบบจะเลือกรูป default ตาม type ที่ส่งมา
```

### 2. การจัดการ Error
```javascript
// เมื่อรูปภาพโหลดไม่ได้ (404, network error, etc.)
onError={(e) => handleImageError(e, type)}
// ระบบจะเปลี่ยนเป็นรูป default ตาม type
```

### 3. การแยก Type
- **Static Components** (CardCampBox, CardStayBox): ส่ง type แบบ hardcode
- **Dynamic Components** (CardTravelerContainer): ดึง type จาก API
- **Specific Components** (CardCampcontainer, CardStayContainer): ส่ง type ตามชื่อ component

## ประโยชน์

1. **User Experience ดีขึ้น**: ไม่มีรูปแตก (broken image) ในระบบ
2. **Visual Consistency**: รูป default ที่เหมาะสมกับเนื้อหา
3. **Performance**: รูป fallback โหลดเร็วกว่าการรอ timeout
4. **Maintainable**: ง่ายต่อการแก้ไขและเพิ่ม type ใหม่

## การทดสอบ

✅ **Compile สำเร็จ**: ไม่มี compilation errors
✅ **Type Detection**: ระบบแยก type ได้ถูกต้อง  
✅ **Fallback หลายระดับ**: imgUrl → default by type → ultimate fallback
✅ **Error Handling**: จัดการกรณีรูปโหลดไม่ได้

## Future Enhancements

1. **เพิ่ม type ใหม่**: สามารถเพิ่มใน `getDefaultImageByType()`
2. **Loading State**: เพิ่ม placeholder ระหว่างโหลด
3. **Image Optimization**: ใช้ webp หรือ compression
4. **Cache Strategy**: เก็บ default images ใน cache
