'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Component imports
import AdminSidebar  from '@/components/admin/AdminSidebar';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminUsers    from '@/components/admin/AdminUsers';
import AdminContact  from '@/components/admin/AdminContact';

const tabTitles = {
  dashboard: { title: 'System Overview', desc: 'Real-time platform monitoring.' },
  users:     { title: 'Manage Users', desc: 'Manage platform accounts and roles.' },
  contact:   { title: 'Contact Queries', desc: 'Handle user support messages and submit internal queries.' },
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats]   = useState({ totalUsers: 0, totalFiles: 0 });
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile states
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

        // Fetch admin details directly from returned users array
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentAdmin = usersRes.data.find(u => u._id === payload._id);
        
        if (currentAdmin) {
          if (currentAdmin.name) setAdminName(currentAdmin.name);
          if (currentAdmin.email) setAdminEmail(currentAdmin.email);
        } else {
          if (payload.email) setAdminEmail(payload.email);
        }

      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) return toast.error('Please fill all fields');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error('Not authenticated');
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload._id;

      if (!userId) return toast.error('User ID not found');

      toast.loading('Changing password...', { id: 'pwd' });

      await axios.put(`http://localhost:5000/user/update/${userId}`, 
        { password: newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success('Password changed successfully!', { id: 'pwd' });
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('Error changing password', { id: 'pwd' });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminOverview stats={stats} users={users} />;
      case 'users':     return <AdminUsers users={users} setUsers={setUsers} setStats={setStats} />;
      case 'contact':   return <AdminContact />;
      default:          return <AdminOverview stats={stats} users={users} />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 text-indigo-600 animate-spin" /></div>;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 min-w-0 relative">
          {/* Top Header */}
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200">
            <div className="flex items-center justify-between px-6 md:px-8 py-4 pl-16 md:pl-8">
              <div>
                <h1 className="text-lg font-bold text-slate-900">{tabTitles[activeTab].title}</h1>
                <p className="text-xs text-slate-400 mt-0.5">{tabTitles[activeTab].desc}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative group pe-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform uppercase shadow-md">
                    {adminName ? adminName.charAt(0) : (adminEmail ? adminEmail.charAt(0) : 'A')}
                  </div>
                  
                  {/* Dropdown Profile Menu (Hover triggered) */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <p className="font-bold text-slate-800 text-sm truncate capitalize">{adminName || (adminEmail ? adminEmail.split('@')[0] : 'Admin Profile')}</p>
                        <p className="text-xs text-slate-500 truncate">{adminEmail || 'admin@exceliq.com'}</p>
                      </div>
                      <div className="p-2">
                        <button 
                          onClick={() => setIsPasswordModalOpen(true)}
                          className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 rounded-lg transition"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </header>

          <div className="p-6 md:p-8">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl relative top-0 animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-3 mt-6 pt-2">
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleChangePassword}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
