'use client';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; 
import axios from 'axios';
import Sidebar from '@/components/dashboard/Sidebar';
import ExcelAssistant from '@/components/dashboard/ExcelAssistant';
import FormulaGenerator from '@/components/dashboard/FormulaGenerator';
import ReportGeneration from '@/components/dashboard/ReportGeneration';
import Visualization from '@/components/dashboard/Visualization';

// Tab titles mapping
const tabTitles = {
  assistant: 'Excel Assistant',
  formula: 'Formula Generator',
  report: 'Report Generation',
  visualization: 'Visualization'
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('assistant');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload._id;
          
          if (userId) {
            const res = await axios.get(`http://localhost:5000/user/getall`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            const allUsers = res.data;
            const currentUser = allUsers.find(u => u._id === userId);
            if (currentUser) {
              if (currentUser.name) setUserName(currentUser.name);
              if (currentUser.email) setUserEmail(currentUser.email);
            } else {
              if (payload.email) setUserEmail(payload.email);
            }
          }
        }
      } catch (e) {
        console.error('Failed to parse token or fetch user');
      }
    };
    fetchUserDetails();
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

  const renderModule = () => {
    switch (activeTab) {
      case 'assistant': return <ExcelAssistant />;
      case 'formula': return <FormulaGenerator />;
      case 'report': return <ReportGeneration />;
      case 'visualization': return <Visualization />;
      default: return <ExcelAssistant />;
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 min-w-0 relative">
          <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200">
            <div className="flex items-center justify-between px-6 md:px-8 py-4 pl-16 md:pl-8">
              <div>
                <h1 className="text-lg font-bold text-slate-900">{tabTitles[activeTab]}</h1>
                <p className="text-xs text-slate-400 mt-0.5">Welcome back — let's work with your data.</p>
              </div>
              
              <div className="flex items-center gap-3">
                
                <div className="relative group pe-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:scale-105 transition-transform uppercase">
                    {userName ? userName.charAt(0) : (userEmail ? userEmail.charAt(0) : 'U')}
                  </div>
                  
                  {/* Dropdown Profile Menu (Hover triggered) */}
                  <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <p className="font-bold text-slate-800 text-sm truncate capitalize">{userName || (userEmail ? userEmail.split('@')[0] : 'User Profile')}</p>
                        <p className="text-xs text-slate-500 truncate">{userEmail || 'user@exceliq.com'}</p>
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
            {renderModule()}
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