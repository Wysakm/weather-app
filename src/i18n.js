import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// โหลดไฟล์ JSON จากโฟลเดอร์ locales
import enCommon from './locales/en/common.json';
import thCommon from './locales/th/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enCommon,  // ใช้ข้อมูลจาก common.json ของภาษาอังกฤษ
      },
      th: {
        translation: thCommon,  // ใช้ข้อมูลจาก common.json ของภาษาไทย
      },
    },
    lng: 'en', // ภาษาเริ่มต้น
    fallbackLng: 'en', // หากไม่มีการแปล
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
