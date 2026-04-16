"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Edit2, Trash2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminUsers({ users, setUsers }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({});
  const router = useRouter();
  const usersPerPage = 5;

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const safeUsers = Array.isArray(users) ? users : [];

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const body = { ...formState };
      if (!body.password) delete body.password;

      const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      });
      
      const updatedUser = await res.json();
      setUsers((us) => us.map((u) => (u._id === id ? { ...u, ...updatedUser } : u)));
      setEditingId(null);
    } catch {
      alert("Failed to save changes");
    }
  };

  const filteredUsers = safeUsers.filter((u) => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  const paginatedUsers = filteredUsers.slice((page - 1) * usersPerPage, page * usersPerPage);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
      <h1 className="text-2xl font-bold text-[#2E3C43] mb-8">Manage Users</h1>
      
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#00ACC1] outline-none"
          />
        </div>
        <select 
          value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded-xl px-4 py-2 bg-white text-gray-600 focus:ring-2 focus:ring-[#00ACC1] outline-none"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 border-b">
              <th className="px-6 py-4 font-semibold text-sm">Name</th>
              <th className="px-6 py-4 font-semibold text-sm">Email</th>
              <th className="px-6 py-4 font-semibold text-sm">Role</th>
              <th className="px-6 py-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  {editingId === user._id ? (
                    <input className="border p-1 rounded w-full" value={formState.name || ""} onChange={(e) => setFormState({...formState, name: e.target.value})} />
                  ) : <span className="font-medium text-gray-800">{user.name}</span>}
                </td>
                <td className="px-6 py-4">
                  {editingId === user._id ? (
                    <input className="border p-1 rounded w-full" value={formState.email || ""} onChange={(e) => setFormState({...formState, email: e.target.value})} />
                  ) : <span className="text-gray-500">{user.email}</span>}
                </td>
                <td className="px-6 py-4">
                  {editingId === user._id ? (
                    <select className="border p-1 rounded" value={formState.role || "user"} onChange={(e) => setFormState({...formState, role: e.target.value})}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {editingId === user._id ? (
                    <div className="flex gap-2">
                       <button onClick={() => saveEdit(user._id)} className="text-green-500 hover:text-green-600"><Check size={18} /></button>
                       <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-600"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button onClick={() => { setEditingId(user._id); setFormState(user); }} className="hover:text-[#00ACC1] transition"><Edit2 size={18} /></button>
                      <button onClick={() => deleteUser(user._id)} className="hover:text-red-500 transition"><Trash2 size={18} /></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}