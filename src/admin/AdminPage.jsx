import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminChat from './AdminChat';
import AdminServices from './AdminServices';
import AdminPortfolio from './AdminPortfolio';
import AdminSettings from './AdminSettings';

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
      case 'orders': return <AdminOrders />;
      case 'chat': return <AdminChat />;
      case 'services': return <AdminServices />;
      case 'portfolio': return <AdminPortfolio />;
      case 'settings': return <AdminSettings />;
      default: return <AdminDashboard setTab={setTab} />;
    }
  };

  return (
    <AdminLayout tab={tab} setTab={setTab}>
      {renderTab()}
    </AdminLayout>
  );
}
