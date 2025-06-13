import React from 'react';
import { Typography, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

const PrivacyText = () => {
  return (
    <div style={{ width: '80%', margin: '0 auto', textAlign: 'justify', padding: '30px' }}>
      <Typography>
        <h1 style={{ color: 'var(--color-primary)' }}>
          Privacy Policy & Personal Data Protection Notice
          <br />
          นโยบายความเป็นส่วนตัว & การคุ้มครองข้อมูลส่วนบุคคล
        </h1>
        <div style={{ marginBottom: '20px' }}>
          <Text type="secondary">
            Last Updated: May 5, 2025 / อัปเดตล่าสุด: 5 พฤษภาคม 2025
          </Text>
        </div>

        <div>
          <Title level={3}>1. General Information / ข้อมูลทั่วไป</Title>
          <Paragraph>
            Our website is committed to protecting user privacy in accordance with the Personal Data Protection Act B.E. 2562 (PDPA).
            This policy explains how we collect, use, and protect your personal information.
            <br /><br />
            เว็บไซต์ของเรามุ่งมั่นในการปกป้องความเป็นส่วนตัวของผู้ใช้ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
            นโยบายนี้อธิบายวิธีที่เราเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณ
          </Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>2. Information We Collect / ข้อมูลที่เราเก็บรวบรวม</Title>

          <Title level={4}>2.1 Information you provide / ข้อมูลที่คุณให้มา:</Title>
          <ul>
            <li>Full name / ชื่อ-นามสกุล</li>
            <li>Email address / ที่อยู่อีเมล</li>
            <li>Password (stored in encrypted format) / รหัสผ่าน (เก็บในรูปแบบเข้ารหัส)</li>
            <li>Profile picture (if uploaded) / รูปโปรไฟล์ (หากอัปโหลด)</li>
            <li>Travel destination posts and reviews / โพสต์และรีวิวสถานที่ท่องเที่ยว</li>
            <li>Shared images in the system / รูปภาพที่แบ่งปันในระบบ</li>
          </ul>

          <Title level={4}>2.2 Automatically collected information / ข้อมูลที่เก็บรวบรวมอัตโนมัติ:</Title>
          <ul>
            <li>Location data (for weather information) / ข้อมูลตำแหน่ง (สำหรับข้อมูลสภาพอากาศ)</li>
            <li>IP Address / ที่อยู่ IP</li>
            <li>Website usage data / ข้อมูลการใช้งานเว็บไซต์</li>
            <li>Cookie information / ข้อมูลคุกกี้</li>
            <li>Device and browser information / ข้อมูลอุปกรณ์และเบราว์เซอร์</li>
          </ul>
          <Divider />
        </div>

        <div>
          <Title level={3}>3. Purpose of Data Collection / วัตถุประสงค์ของการเก็บรวบรวมข้อมูล</Title>
          <Paragraph>We collect your information to / เราเก็บรวบรวมข้อมูลของคุณเพื่อ:</Paragraph>
          <ul>
            <li>Create and manage user accounts / สร้างและจัดการบัญชีผู้ใช้</li>
            <li>Display weather information relevant to your location / แสดงข้อมูลสภาพอากาศที่เกี่ยวข้องกับตำแหน่งของคุณ</li>
            <li>Enable you to post and share travel destinations / ให้คุณสามารถโพสต์และแบ่งปันสถานที่ท่องเที่ยว</li>
            <li>Improve our services / ปรับปรุงบริการของเรา</li>
            <li>Send relevant notifications / ส่งการแจ้งเตือนที่เกี่ยวข้อง</li>
            <li>Maintain system security / รักษาความปลอดภัยของระบบ</li>
          </ul>
          <Divider />
        </div>

        <div>
          <Title level={3}>4. Data Sharing / การแบ่งปันข้อมูล</Title>
          <Paragraph>We may share your information with / เราอาจแบ่งปันข้อมูลของคุณกับ:</Paragraph>
          <ul>
            <li>Weather forecast service providers / ผู้ให้บริการพยากรณ์อากาศ</li>
            <li>Cloud storage service providers / ผู้ให้บริการจัดเก็บข้อมูลบนคลาวด์</li>
            <li>Government agencies as required by law / หน่วยงานของรัฐตามที่กฎหมายกำหนด</li>
          </ul>
          <Divider />
        </div>

        <div>
          <Title level={3}>5. Your Rights / สิทธิของคุณ</Title>
          <Paragraph>You have the following rights / คุณมีสิทธิดังต่อไปนี้:</Paragraph>
          <ul>
            <li>Access your personal data / เข้าถึงข้อมูลส่วนบุคคลของคุณ</li>
            <li>Correct your information / แก้ไขข้อมูลของคุณ</li>
            <li>Delete your personal data / ลบข้อมูลส่วนบุคคลของคุณ</li>
            <li>Object to data processing / คัดค้านการประมวลผลข้อมูล</li>
            <li>Restrict data processing / จำกัดการประมวลผลข้อมูล</li>
            <li>Withdraw consent / ถอนความยินยอม</li>
            <li>Request data in electronic format / ขอข้อมูลในรูปแบบอิเล็กทรอนิกส์</li>
          </ul>
          <Divider />
        </div>

        <div>
          <Title level={3}>6. Security Measures / มาตรการรักษาความปลอดภัย</Title>
          <Paragraph>Our security measures include / มาตรการรักษาความปลอดภัยของเรารวมถึง:</Paragraph>
          <ul>
            <li>Data encryption / การเข้ารหัสข้อมูล</li>
            <li>Intrusion prevention systems / ระบบป้องกันการบุกรุก</li>
            <li>Access control / การควบคุมการเข้าถึง</li>
            <li>Data backup / การสำรองข้อมูล</li>
            <li>Regular system monitoring / การตรวจสอบระบบอย่างสม่ำเสมอ</li>
          </ul>
          <Divider />
        </div>

        <div>
          <Title level={3}>7. Cookies / คุกกี้</Title>
          <Paragraph>We use cookies to / เราใช้คุกกี้เพื่อ:</Paragraph>
          <ul>
            <li>Remember user preferences / จดจำการตั้งค่าของผู้ใช้</li>
            <li>Analyze website usage / วิเคราะห์การใช้งานเว็บไซต์</li>
            <li>Improve user experience / ปรับปรุงประสบการณ์ผู้ใช้</li>
          </ul>
          <Paragraph>
            You can disable cookies in your browser settings. /
            คุณสามารถปิดการใช้งานคุกกี้ในการตั้งค่าเบราว์เซอร์ของคุณ
          </Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>8. Data Retention / การเก็บรักษาข้อมูล</Title>
          <ul>
            <li>User account data: Retained throughout membership / ข้อมูลบัญชีผู้ใช้: เก็บรักษาตลอดระยะเวลาสมาชิกภาพ</li>
            <li>Post data: Retained until deleted / ข้อมูลโพสต์: เก็บรักษาจนกว่าจะถูกลบ</li>
            <li>Access logs: Retained for up to 1 year / บันทึกการเข้าถึง: เก็บรักษาได้สูงสุด 1 ปี</li>
            <li>Contact information: Retained for up to 2 years / ข้อมูลการติดต่อ: เก็บรักษาได้สูงสุด 2 ปี</li>
          </ul>
          <Divider />
        </div>

        <div>
          <Title level={3}>9. Contact Us / ติดต่อเรา</Title>
          <Paragraph>
            If you have questions about our privacy policy, please contact us at: /
            หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวของเรา กรุณาติดต่อเราที่:
          </Paragraph>
          <Paragraph>Email: privacy@example.com / อีเมล: privacy@example.com</Paragraph>
          <Paragraph>Phone: +66 2-xxx-xxxx / โทรศัพท์: +66 2-xxx-xxxx</Paragraph>
          <Paragraph>Address: xxx Building, xxx Street / ที่อยู่: อาคาร xxx ถนน xxx</Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>10. Policy Updates / การอัปเดตนโยบาย</Title>
          <Paragraph>
            We may update this policy periodically. Changes will take effect when posted on the website. Continued use of the website after changes implies acceptance of the updated policy. /
            เราอาจอัปเดตนโยบายนี้เป็นระยะ การเปลี่ยนแปลงจะมีผลเมื่อโพสต์บนเว็บไซต์ การใช้งานเว็บไซต์ต่อไปหลังจากการเปลี่ยนแปลงถือว่ายอมรับนโยบายที่อัปเดตแล้ว
          </Paragraph>
        </div>
      </Typography>
    </div>
  );
};

export default PrivacyText;