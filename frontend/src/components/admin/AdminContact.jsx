'use client';
import { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, CheckCircle, Loader2, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/admin/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load contact queries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedContact) return;
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/admin/contacts/${selectedContact._id}/reply`,
        { reply: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Reply sent to ' + selectedContact.email + ' successfully!');
      setReplyText('');
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to send reply.');
    } finally {
      setIsSending(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Incoming Queries List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col max-h-[600px]">
          <div className="p-6 border-b border-slate-100 shrink-0">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-600" /> Incoming Requests
              {contacts.filter(c => c.status === 'pending').length > 0 && (
                <span className="ml-auto bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {contacts.filter(c => c.status === 'pending').length} Pending
                </span>
              )}
            </h3>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading queries...
              </div>
            ) : contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-sm text-slate-400">No contact queries yet.</p>
              </div>
            ) : (
              contacts.map((q) => (
                <div
                  key={q._id}
                  onClick={() => { setSelectedContact(q); setReplyText(''); }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedContact?._id === q._id
                    ? 'border-indigo-400 bg-indigo-50 shadow-md'
                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-slate-800 text-sm">{q.firstName} {q.lastName}</p>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${q.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                      }`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{q.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock size={12} /> {timeAgo(q.createdAt)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-indigo-500">
                      <Mail size={12} /> {q.email}
                    </div>
                  </div>
                  {q.status === 'resolved' && q.adminReply && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Admin Reply:</p>
                      <p className="text-xs text-slate-500 italic line-clamp-2">"{q.adminReply}"</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reply Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
            <Send size={18} className="text-violet-600" /> Reply to Query
          </h3>

          {selectedContact ? (
            <div className="space-y-4">
              {/* Selected query details */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-slate-800 text-sm">{selectedContact.firstName} {selectedContact.lastName}</p>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedContact.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {selectedContact.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{selectedContact.message}</p>
                <div className="flex items-center gap-1 text-xs text-indigo-500">
                  <Mail size={12} /> Reply will be sent to: <strong>{selectedContact.email}</strong>
                </div>
              </div>

              {selectedContact.status === 'resolved' ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                  <CheckCircle className="text-emerald-500 w-12 h-12" />
                  <h4 className="text-lg font-bold text-slate-800">Already Resolved</h4>
                  <p className="text-slate-500 text-sm max-w-xs">This query has already been replied to. Select a pending query to reply.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Your Reply</label>
                    <textarea
                      rows={5}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
                      placeholder="Type your reply here. This will be sent as an email to the user..."
                    />
                  </div>
                  <button
                    onClick={handleReply}
                    disabled={isSending || !replyText.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-indigo-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {isSending ? 'Sending Email...' : 'Send Reply via Email'}
                    {!isSending && <ArrowRight size={14} />}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <h4 className="text-lg font-bold text-slate-700">Select a Query</h4>
              <p className="text-slate-400 text-sm max-w-xs">Click on any incoming request from the left panel to view details and send a reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
