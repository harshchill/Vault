"use client";

import { Users, FileText, Upload, CheckCircle, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DashboardClient({ initialData }) {
  const [data, setData] = useState(initialData);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      {/* Top Stats - Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={data.totalUsers} 
          icon={<Users className="text-[#00baa4]" size={24} />} 
          trend="+12% from last month"
        />
        <StatCard 
          title="Total Papers" 
          value={data.totalPapers} 
          icon={<FileText className="text-blue-500" size={24} />} 
          trend="+5% from last month"
        />
        <StatCard 
          title="Total Uploads" 
          value={data.totalUploads} 
          icon={<Upload className="text-purple-500" size={24} />} 
          trend="All time uploads"
        />
        <StatCard 
          title="Pending Approvals" 
          value={data.pendingPapersCount} 
          icon={<CheckCircle className="text-amber-500" size={24} />} 
          trend={data.pendingPapersCount > 0 ? "Requires attention" : "All caught up"}
          highlight={data.pendingPapersCount > 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Trends */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-[#00baa4]/10 rounded-lg">
              <TrendingUp size={20} className="text-[#00baa4]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Upload Trends</h3>
          </div>
          <div className="h-[300px] w-full">
            {data.uploadTrends && data.uploadTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.uploadTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dx={-10} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)' }}
                    cursor={{ stroke: '#f0f0f0', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#00baa4" 
                    strokeWidth={3}
                    dot={{ fill: '#00baa4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Not enough data to show trends.</div>
            )}
          </div>
        </div>

        {/* Top Universities */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText size={20} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Top Universities</h3>
          </div>
          <div className="h-[300px] w-full">
            {data.topUniversities && data.topUniversities.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topUniversities} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 12, fontWeight: 500}} width={120} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="count" fill="#00baa4" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-gray-400">Not enough data to show top universities.</div>
            )}
          </div>
        </div>
      </div>

      {/* Glimpse of Pending Approvals */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock size={20} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Recent Pending Papers</h3>
          </div>
          <Link 
            href="/admin/approvals" 
            className="text-sm font-medium text-[#00baa4] hover:text-[#009b89] transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="p-0">
          {data.recentPending && data.recentPending.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {data.recentPending.map(paper => (
                <div key={paper._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="text-gray-400 mt-1 shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{paper.title || `${paper.subject} - ${paper.year}`}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{paper.institute}</span>
                        <span>•</span>
                        <span>Sem {paper.semester}</span>
                        <span>•</span>
                        <span className="text-amber-600 font-medium">Pending</span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href="/admin/approvals"
                    className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all shrink-0"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="text-gray-400" size={24} />
              </div>
              <p className="text-gray-600 font-medium">All caught up!</p>
              <p className="text-sm text-gray-400 mt-1">No pending papers to review right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, highlight }) {
  return (
    <div className={`bg-white p-5 rounded-2xl border ${highlight ? 'border-amber-200 shadow-amber-100/50' : 'border-gray-100'} shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-transform hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${highlight ? 'bg-amber-50' : 'bg-gray-50'}`}>
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
        <p className="text-2xl md:text-3xl font-black text-gray-900 mt-1 tracking-tight">{value}</p>
        {trend && <p className={`text-xs mt-2 font-medium ${highlight ? 'text-amber-600' : 'text-gray-500'}`}>{trend}</p>}
      </div>
    </div>
  );
}
