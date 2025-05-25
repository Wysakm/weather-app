import { Button, Modal } from 'antd'
import React, { useState } from 'react'
import Login from './Login'
import { useTranslation } from 'react-i18next';
import './styles/Navbar.css';

const LoginButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button className='botton-login' onClick={showModal}>
        {t('auth.login')}
      </Button>
      <Modal
        // title="Basic Modal"
        // closable={{ 'aria-label': 'Custom Close Button' }}
        closable={false}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        header={null}
        width={400}
        styles={{
          content: {
            // padding: '2rem',
          },
        }}
      >
        <Login handleCancel={handleCancel} />
      </Modal>
    </>
  )
}

export default LoginButton