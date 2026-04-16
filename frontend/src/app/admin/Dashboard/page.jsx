'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Component imports
import AdminSidebar  from '@/components/admin/AdminSidebar';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminUsers    from '@/components/admin/AdminUsers';
import AdminProfile  from '@/components/admin/AdminProfile';
import AdminContact  from '@/components/admin/AdminContact';
import AdminHelp     from '@/components/admin/AdminHelp';

const tabTitles = {
  dashboard: 'System Overview',
  users:     'User Management',
  profile:   'Admin Profile',
  contact:   'Contact Queries',
  help:      'Help Center',
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats]   = useState({ totalUsers: 0, totalFiles: 0 });
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [statsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/admin/system-stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminOverview stats={stats} users={users} />;
      case 'users':     return <AdminUsers users={users} setUsers={setUsers} setStats={setStats} />;
      case 'profile':   return <AdminProfile />;
      case 'contact':   return <AdminContact />;
      case 'help':      return <AdminHelp />;
      default:          return <AdminOverview stats={stats} users={users} />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 text-indigo-600 animate-spin" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200">
          <div className="flex items-center justify-between px-6 md:px-8 py-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">{tabTitles[activeTab]}</h1>
              <p className="text-xs text-slate-400 mt-0.5">Admin Control Panel</p>
            </div>
            <button
              onClick={() => setActiveTab('profile')}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform shadow-md"
            >
              A
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
