import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag, Space, Alert } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';

const { Title, Text } = Typography;

const GoogleDebugInfo = () => {
  const { googleLoaded } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const checkGoogleStatus = () => {
      const info = {
        googleLoaded,
        clientId: GOOGLE_CLIENT_ID,
        windowGoogle: !!window.google,
        googleAccounts: !!window.google?.accounts,
        googleAccountsId: !!window.google?.accounts?.id,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };
      setDebugInfo(info);
    };

    checkGoogleStatus();
    const interval = setInterval(checkGoogleStatus, 2000);
    return () => clearInterval(interval);
  }, [googleLoaded]);

  const getStatusColor = (status) => status ? 'success' : 'error';

  return (
    <Card title="Google Sign-In Debug Info" style={{ margin: '20px 0' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>Google Script Loaded: </Text>
          <Tag color={getStatusColor(debugInfo.googleLoaded)}>
            {debugInfo.googleLoaded ? 'YES' : 'NO'}
          </Tag>
        </div>
        
        <div>
          <Text strong>Window Google Available: </Text>
          <Tag color={getStatusColor(debugInfo.windowGoogle)}>
            {debugInfo.windowGoogle ? 'YES' : 'NO'}
          </Tag>
        </div>
        
        <div>
          <Text strong>Google Accounts Available: </Text>
          <Tag color={getStatusColor(debugInfo.googleAccounts)}>
            {debugInfo.googleAccounts ? 'YES' : 'NO'}
          </Tag>
        </div>
        
        <div>
          <Text strong>Google Accounts ID Available: </Text>
          <Tag color={getStatusColor(debugInfo.googleAccountsId)}>
            {debugInfo.googleAccountsId ? 'YES' : 'NO'}
          </Tag>
        </div>
        
        <div>
          <Text strong>Client ID: </Text>
          <Text code>{debugInfo.clientId}</Text>
        </div>
        
        <div>
          <Text strong>Browser: </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {debugInfo.userAgent}
          </Text>
        </div>
        
        <div>
          <Text strong>Last Check: </Text>
          <Text type="secondary">{debugInfo.timestamp}</Text>
        </div>

        {debugInfo.googleLoaded && debugInfo.googleAccountsId ? (
          <Alert 
            message="Google Sign-In is ready!" 
            type="success" 
            showIcon 
          />
        ) : (
          <Alert 
            message="Google Sign-In is not ready. Please wait or refresh the page." 
            type="warning" 
            showIcon 
          />
        )}
      </Space>
    </Card>
  );
};

export default GoogleDebugInfo;
