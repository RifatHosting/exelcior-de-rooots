import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import AdminLayout from './AdminLayout.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import AdminOrders from './AdminOrders.jsx';
import AdminChat from './AdminChat.jsx';
import AdminServices from './AdminServices.jsx';
import AdminPortfolio from './AdminPortfolio.jsx';
import AdminSettings from './AdminSettings.jsx';

export default function AdminPage() {
  const { adminSession } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');

  if (!adminSession) {
    navigate('/admin');
    return null;
  }

  const renderTab = () => {
    switch (tab) {
      case 'dashboard': return <AdminDashboard setTab={setTab} />;
      case 'orders':    return <AdminOrders />;
      case 'chat':      return <AdminChat />;
      case 'services':  return <AdminServices />;
      case 'portfolio': return <AdminPortfolio />;
      case 'settings':  return <AdminSettings />;
      default:          return <AdminDashboard setTab={setTab} />;
    }
  };

  return (
    <AdminLayout tab={tab} setTab={setTab}>
      {renderTab()}
    </AdminLayout>
  );
}
