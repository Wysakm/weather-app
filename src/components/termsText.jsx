import React from 'react';
import { Typography, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

const TermsText = () => {
  return (
    <div style={{ width: '80%', margin: '0 auto', textAlign: 'justify', padding: '30px' }}>
      <Typography>
        <h1 style={{ color: 'var(--color-primary)' }}>Terms of Service / ข้อกำหนดและเงื่อนไขการใช้บริการ</h1>

        <div style={{ marginBottom: '20px' }}>
          <Text type="secondary">
            Last updated: May 27, 2025
            <br />
            อัปเดตล่าสุด: 27 พฤษภาคม 2025
          </Text>
        </div>

        <div>
          <Title level={3}>1. Terms of Service (ToS) / ข้อกำหนดการใช้บริการ</Title>
          <Paragraph>
            By accessing or using our website or services, you agree to comply with these Terms of Service.
            Users are prohibited from engaging in unlawful, offensive, or disruptive behavior.
            <br /><br />
            โดยการเข้าถึงหรือใช้เว็บไซต์หรือบริการของเรา คุณตกลงที่จะปฏิบัติตามข้อกำหนดการใช้บริการเหล่านี้
            ผู้ใช้ห้ามมีพฤติกรรมที่ผิดกฎหมาย น่ารังเกียจ หรือก่อให้เกิดการรบกวน
          </Paragraph>
          <Text strong>User Rights and Limitations / สิทธิและข้อจำกัดของผู้ใช้:</Text>
          <ul>
            <li>Users may access and use content for personal, non-commercial purposes only. / ผู้ใช้สามารถเข้าถึงและใช้เนื้อหาเพื่อวัตถุประสงค์ส่วนบุคคลและไม่เชิงพาณิชย์เท่านั้น</li>
            <li>Unauthorized duplication, redistribution, or misuse of content is strictly prohibited. / ห้ามทำสำเนา เผยแพร่ หรือใช้เนื้อหาในทางที่ผิดโดยไม่ได้รับอนุญาต</li>
          </ul>
          <Text strong>Content Posting Rules / กฎการโพสต์เนื้อหา:</Text>
          <ul>
            <li>No hate speech, false information, threats, or illegal material. / ห้ามโพสต์คำพูดที่แสดงความเกลียดชัง ข้อมูลเท็จ การข่มขู่ หรือเนื้อหาที่ผิดกฎหมาย</li>
            <li>Respect intellectual property rights of others. / เคารพสิทธิในทรัพย์สินทางปัญญาของผู้อื่น</li>
          </ul>
          <Divider />
        </div>

        <div>
          <Title level={3}>2. Cookie Policy / นโยบายคุกกี้</Title>
          <Paragraph>
            We use cookies to improve your experience and personalize content and ads.
            <br /><br />
            เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณและปรับแต่งเนื้อหาและโฆษณา
          </Paragraph>
          <Text strong>Types of Cookies / ประเภทของคุกกี้:</Text>
          <ul>
            <li><Text strong>Essential Cookies / คุกกี้ที่จำเป็น</Text> – Necessary for site functionality. / จำเป็นสำหรับการทำงานของเว็บไซต์</li>
            <li><Text strong>Analytical Cookies / คุกกี้เชิงวิเคราะห์</Text> – Help us understand how users interact with the site. / ช่วยให้เราเข้าใจว่าผู้ใช้โต้ตอบกับเว็บไซต์อย่างไร</li>
            <li><Text strong>Functional Cookies / คุกกี้เชิงฟังก์ชัน</Text> – Enable enhanced features. / เปิดใช้งานคุณสมบัติขั้นสูง</li>
          </ul>
          <Text strong>Purpose of Cookies / วัตถุประสงค์ของคุกกี้:</Text>
          <Paragraph>To enhance usability, analyze traffic, and improve service quality. / เพื่อเพิ่มความสะดวกในการใช้งาน วิเคราะห์การเข้าชม และปรับปรุงคุณภาพบริการ</Paragraph>
          <Text strong>Managing Cookies / การจัดการคุกกี้:</Text>
          <Paragraph>You can manage or disable cookies via your browser settings. / คุณสามารถจัดการหรือปิดการใช้งานคุกกี้ผ่านการตั้งค่าเบราว์เซอร์ของคุณ</Paragraph>
          <Text strong>Effect of Disabling Cookies / ผลของการปิดคุกกี้:</Text>
          <Paragraph>Some site features may not function properly if cookies are disabled. / คุณสมบัติบางอย่างของเว็บไซต์อาจไม่ทำงานอย่างถูกต้องหากปิดการใช้งานคุกกี้</Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>3. Community Guidelines / หลักเกณฑ์ชุมชน</Title>
          <Paragraph>
            To maintain a safe and respectful environment, users must adhere to these guidelines.
            <br /><br />
            เพื่อรักษาสภาพแวดล้อมที่ปลอดภัยและเคารพซึ่งกันและกัน ผู้ใช้ต้องปฏิบัติตามหลักเกณฑ์เหล่านี้
          </Paragraph>
          <Text strong>Review Posting Rules / กฎการโพสต์รีวิว:</Text>
          <ul>
            <li>Be honest, respectful, and constructive in your feedback. / ให้คำติชมที่สุจริต เคารพ และสร้างสรรค์</li>
          </ul>
          <Text strong>Content Standards / มาตรฐานเนื้อหา:</Text>
          <ul>
            <li>No profanity, hate speech, harassment, or inappropriate content. / ห้ามใช้คำหยาบ คำพูดแสดงความเกลียดชัง การคุกคาม หรือเนื้อหาที่ไม่เหมาะสม</li>
          </ul>
          <Text strong>Handling Violations / การจัดการการฝ่าฝืน:</Text>
          <Paragraph>We reserve the right to remove content and suspend or ban offending users. / เราขอสงวนสิทธิ์ในการลบเนื้อหาและระงับหรือแบนผู้ใช้ที่ฝ่าฝืน</Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>4. Disclaimer / ข้อปฏิเสธความรับผิดชอบ</Title>
          <Paragraph>
            <Text strong>Weather Forecast Accuracy / ความแม่นยำของการพยากรณ์อากาศ:</Text> We do not guarantee the accuracy or timeliness of weather data. / เราไม่รับประกันความแม่นยำหรือความทันเวลาของข้อมูลสภาพอากาศ
          </Paragraph>
          <Paragraph>
            <Text strong>User-Generated Content / เนื้อหาที่ผู้ใช้สร้างขึ้น:</Text> We are not responsible for the accuracy or legality of content posted by users. / เราไม่รับผิดชอบต่อความแม่นยำหรือความถูกต้องตามกฎหมายของเนื้อหาที่ผู้ใช้โพสต์
          </Paragraph>
          <Paragraph>
            <Text strong>General Disclaimers / ข้อปฏิเสธทั่วไป:</Text> Use of the service is at your own risk. / การใช้บริการเป็นความเสี่ยงของคุณเอง
          </Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>5. Copyright Notice / ประกาศลิขสิทธิ์</Title>
          <Paragraph>
            <Text strong>Site Content Ownership / ความเป็นเจ้าของเนื้อหาเว็บไซต์:</Text> All content and materials on this website are owned or licensed by us. / เนื้อหาและสื่อทั้งหมดในเว็บไซต์นี้เป็นของเราหรือได้รับอนุญาต
          </Paragraph>
          <Paragraph>
            <Text strong>User Content / เนื้อหาของผู้ใช้:</Text> You retain ownership of your content but grant us a non-exclusive license to use, display, and share it. / คุณยังคงเป็นเจ้าของเนื้อหาของคุณ แต่ให้สิทธิ์เราในการใช้ แสดง และแบ่งปันแบบไม่เอกสิทธิ์
          </Paragraph>
          <Paragraph>
            <Text strong>Reuse Policy / นโยบายการใช้ซ้ำ:</Text> Unauthorized reuse or reproduction is prohibited. / ห้ามนำไปใช้ซ้ำหรือทำซ้ำโดยไม่ได้รับอนุญาต
          </Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>6. User Content License Agreement / ข้อตกลงใบอนุญาตเนื้อหาผู้ใช้</Title>
          <Paragraph>By submitting content, you: / โดยการส่งเนื้อหา คุณ:</Paragraph>
          <ul>
            <li>Grant us permission to use, modify, display, and distribute your content. / ให้สิทธิ์เราในการใช้ แก้ไข แสดง และเผยแพร่เนื้อหาของคุณ</li>
            <li>Confirm that you own or have rights to such content, including images. / ยืนยันว่าคุณเป็นเจ้าของหรือมีสิทธิ์ในเนื้อหาดังกล่าว รวมถึงรูปภาพ</li>
          </ul>
          <Divider />
        </div>

        <div>
          <Title level={3}>7. Data Deletion Policy / นโยบายการลบข้อมูล</Title>
          <Paragraph>
            <Text strong>Account Deletion / การลบบัญชี:</Text> Users may request account deletion at any time. / ผู้ใช้สามารถขอลบบัญชีได้ตลอดเวลา
          </Paragraph>
          <Paragraph>
            <Text strong>Post-Deletion Data Handling / การจัดการข้อมูลหลังลบ:</Text> Personal data will be permanently deleted within 30 days of the request. / ข้อมูลส่วนบุคคลจะถูกลบอย่างถาวรภายใน 30 วันหลังจากคำขอ
          </Paragraph>
          <Paragraph>
            <Text strong>Data Retention Period / ระยะเวลาการเก็บข้อมูล:</Text> Some anonymized or legally required data may be retained as permitted by law. / ข้อมูลที่ไม่ระบุตัวตนหรือข้อมูลที่กฎหมายกำหนดอาจถูกเก็บไว้ตามที่กฎหมายอนุญาต
          </Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>8. Accessibility Statement / แถลงการณ์การเข้าถึง</Title>
          <Paragraph>
            We strive to make our services accessible to all users, including people with disabilities.
            <br /><br />
            เรามุ่งมั่นที่จะทำให้บริการของเราเข้าถึงได้สำหรับผู้ใช้ทุกคน รวมถึงผู้ที่มีความพิการ
          </Paragraph>
          <Paragraph>
            <Text strong>Accessibility Standards / มาตรฐานการเข้าถึง:</Text> We follow WCAG 2.1 guidelines. / เราปฏิบัติตามแนวทาง WCAG 2.1
          </Paragraph>
          <Paragraph>
            <Text strong>Reporting Accessibility Issues / การรายงานปัญหาการเข้าถึง:</Text> Email us at: accessibility@example.com / ส่งอีเมลถึงเราที่: accessibility@example.com
          </Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>9. Security Policy / นโยบายความปลอดภัย</Title>
          <Paragraph>
            <Text strong>Security Measures / มาตรการความปลอดภัย:</Text> We use SSL encryption, data access controls, and regular audits. / เราใช้การเข้ารหัส SSL การควบคุมการเข้าถึงข้อมูล และการตรวจสอบเป็นประจำ
          </Paragraph>
          <Paragraph>
            <Text strong>Data Protection / การป้องกันข้อมูล:</Text> Personal data is handled according to industry standards. / ข้อมูลส่วนบุคคลได้รับการจัดการตามมาตรฐานอุตสาหกรรม
          </Paragraph>
          <Paragraph>
            <Text strong>Reporting Vulnerabilities / การรายงานช่องโหว่:</Text> Please notify us at: security@example.com / กรุณาแจ้งเราที่: security@example.com
          </Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>10. Refund Policy / นโยบายการคืนเงิน (หากมีบริการแบบเสียค่าใช้จ่าย)</Title>
          <Paragraph>
            <Text strong>Refund Conditions / เงื่อนไขการคืนเงิน:</Text> Refund requests must be made within 7 days of purchase. / คำขอคืนเงินต้องทำภายใน 7 วันหลังจากการซื้อ
          </Paragraph>
          <Paragraph>
            <Text strong>Refund Process / ขั้นตอนการคืนเงิน:</Text> Submit your request with proof of payment via our support channel. / ส่งคำขอพร้อมหลักฐานการชำระเงินผ่านช่องทางสนับสนุนของเรา
          </Paragraph>
          <Paragraph>
            <Text strong>Processing Time / เวลาดำเนินการ:</Text> Refunds will be processed within 7–14 business days. / การคืนเงินจะดำเนินการภายใน 7-14 วันทำการ
          </Paragraph>
          <Divider />
        </div>

        <div>
          <Title level={3}>11. Contact Us / ติดต่อเรา</Title>
          <Paragraph>Email: support@example.com / อีเมล: support@example.com</Paragraph>
          <Paragraph>This page is available in both English and Thai. / หน้านี้มีทั้งภาษาอังกฤษและไทย</Paragraph>
        </div>
      </Typography>
    </div>
  );
};

export default TermsText;