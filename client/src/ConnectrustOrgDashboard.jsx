/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Heart, Calendar, Users, Award, TrendingUp, Leaf, Bell,
  Settings, BarChart3, Plus, Edit, CheckCircle, AlertCircle,
  MessageSquare, Clock, Trophy, Download, Loader2, X, Save,
  UserCheck, Activity, Sparkles
} from 'lucide-react';
import Advisor from './Advisor';

const API = 'http://localhost:5000';

const formatINR = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const pct = (count, cap) => Math.min(100, Math.round((count / Math.max(cap, 1)) * 100));

/* ─── Small reusable components ─────────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl p-6 border`}>
    <div className="flex items-center justify-between mb-2">{icon}<TrendingUp className="w-4 h-4 opacity-50" /></div>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

const ProgressBar = ({ value, color = 'bg-green-500' }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${value}%` }} />
  </div>
);

/* ─── Create Event Modal ─────────────────────────────────────────────────── */
const CATEGORY_OPTIONS = [
  'Environment & Afforestation', 'Waste Management', 'Water Conservation',
  'Food & Hunger Relief', 'Animal Welfare', 'Women Empowerment',
  'Education', 'Health', 'Community Development', 'General'
];
const ICON_OPTIONS = ['🌿','🌳','♻️','💧','🍛','🐾','👩‍🏭','📚','🏥','🤝','🎯','🌍'];

const CreateEventModal = ({ token, onClose, onCreated }) => {
  const [form, setForm] = useState({
    title: '', description: '', category: 'Environment & Afforestation',
    location: '', city: '', state: '', date: '', timeSlot: '', duration: '',
    capacity: '100', goal: '', urgency: 'normal', type: 'Volunteer Event',
    badge: '', badgeColor: 'bg-green-600', icon: '🌿', pointsReward: '30'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          capacity: parseInt(form.capacity) || 100,
          pointsReward: parseInt(form.pointsReward) || 30,
          badge: form.badge || form.type.toUpperCase()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onCreated(data.event);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Create New Event</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title + Icon */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tree Planting Drive" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <select value={form.icon} onChange={e => set('icon', e.target.value)}
                className="w-full px-2 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-xl">
                {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe the event..." />
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                {['Volunteer Event','Workshop','Donation Drive','Awareness Campaign','Other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date + Time + Duration */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input required type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <input type="text" value={form.timeSlot} onChange={e => set('timeSlot', e.target.value)}
                placeholder="9:00 AM - 1:00 PM"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input type="text" value={form.duration} onChange={e => set('duration', e.target.value)}
                placeholder="4 hours"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={form.location} onChange={e => set('location', e.target.value)}
                placeholder="Aarey Colony"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input value={form.city} onChange={e => set('city', e.target.value)}
                placeholder="Mumbai"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input value={form.state} onChange={e => set('state', e.target.value)}
                placeholder="Maharashtra"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          {/* Capacity + Goal + Points + Urgency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input type="number" min="1" value={form.capacity} onChange={e => set('capacity', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points Reward per Volunteer</label>
              <input type="number" min="0" value={form.pointsReward} onChange={e => set('pointsReward', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <input value={form.goal} onChange={e => set('goal', e.target.value)}
                placeholder="Plant 500 trees"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select value={form.urgency} onChange={e => set('urgency', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</> : <><Plus className="w-5 h-5" /> Create Event</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */
const ConnectrustOrgDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]           = useState('home');
  const [showNotif, setShowNotif]           = useState(false);
  const [showCreate, setShowCreate]         = useState(false);
  const [loading, setLoading]               = useState(true);
  const [dash, setDash]                     = useState(null);
  const [savingProfile, setSavingProfile]   = useState(false);
  const [profileSaved, setProfileSaved]     = useState(false);
  const [profileForm, setProfileForm]       = useState({
    name: '', mission: '', contactPhone: '', website: ''
  });

  const token   = localStorage.getItem('communityToken') || '';
  const profile = (() => { try { return JSON.parse(localStorage.getItem('communityProfile') || '{}'); } catch { return {}; } })();

  const fetchDash = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/communities/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDash(data);
        if (data.community) {
          setProfileForm({
            name:         data.community.name          || '',
            mission:      data.community.mission       || '',
            contactPhone: data.community.contact_phone  || '',
            website:      data.community.website       || ''
          });
        }
      } else {
        console.error('Dashboard error:', data.message);
      }
    } catch (err) {
      console.error('fetchDash:', err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchDash(); }, [fetchDash]);

  const handleSignOut = () => {
    localStorage.removeItem('communityToken');
    localStorage.removeItem('communityProfile');
    navigate('/');
  };

  const handleEventCreated = () => {
    setShowCreate(false);
    fetchDash();
  };

  const handleStatusChange = async (eventId, status) => {
    await fetch(`${API}/api/events/${eventId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    fetchDash();
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await fetch(`${API}/api/communities/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
      fetchDash();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  /* ── Logo ── */
  const Logo = () => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg">E</div>
      <div>
        <div className="text-xl font-bold text-gray-800">Connectrust</div>
        <div className="text-xs text-gray-500">Organization / Community Portal</div>
      </div>
    </div>
  );

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-green-600 mx-auto" />
          <p className="text-gray-600 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const stats   = dash?.stats   || {};
  const events  = dash?.events  || [];
  const activity= dash?.activity|| [];
  const monthly = dash?.monthlyChart || [];
  const cats    = dash?.categoryBreakdown || [];
  const comm    = dash?.community || {};

  const upcomingEvents = events.filter(e => ['upcoming','active'].includes(e.status) && new Date(e.date) >= new Date());
  const pastEvents     = events.filter(e => e.status === 'completed' || new Date(e.date) < new Date());

  /* ═══════ renderHome ═════════════════════════════════════════════════════ */
  const renderHome = () => (
    <div className="space-y-8">
      {/* Heading */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-800">{comm.name || profile.name}</h1>
            {comm.verification_status === 'verified' && (
              <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Verified
              </span>
            )}
            {comm.verification_status === 'pending' && (
              <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <Clock className="w-4 h-4" /> Verification Pending
              </span>
            )}
          </div>
          <p className="text-gray-500 mt-1 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition shadow-md flex items-center gap-2">
          <Plus className="w-5 h-5" /> Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-5">
        <StatCard
          icon={<Users className="w-8 h-8 text-blue-600" />}
          label="Total Registrations"
          value={stats.totalRegistrations?.toLocaleString() || '0'}
          sub={`${stats.totalAttended || 0} attended`}
          color="from-blue-50 to-blue-100 border-blue-200"
        />
        <StatCard
          icon={<Heart className="w-8 h-8 text-green-600" />}
          label="Total Donations"
          value={formatINR(stats.totalDonations)}
          sub={`${stats.donationCount || 0} donor(s)`}
          color="from-green-50 to-green-100 border-green-200"
        />
        <StatCard
          icon={<Calendar className="w-8 h-8 text-purple-600" />}
          label="Active Events"
          value={stats.activeEvents || '0'}
          sub={`${stats.completedEvents || 0} completed`}
          color="from-purple-50 to-purple-100 border-purple-200"
        />
        <StatCard
          icon={<Trophy className="w-8 h-8 text-orange-600" />}
          label="Points Distributed"
          value={(stats.totalPoints || 0).toLocaleString()}
          sub="To verified attendees"
          color="from-orange-50 to-orange-100 border-orange-200"
        />
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Upcoming & Active Events</h2>
          <button onClick={() => setActiveTab('events')}
            className="text-green-600 font-medium text-sm hover:underline">View All →</button>
        </div>
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming events. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map(ev => {
              const progress = pct(ev.registration_count, ev.capacity);
              return (
                <div key={ev.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ev.icon}</span>
                      <div>
                        <h3 className="font-bold text-gray-800">{ev.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDate(ev.date)}{ev.time_slot ? ` • ${ev.time_slot}` : ''}</p>
                      </div>
                    </div>
                    <span className={`${ev.badge_color} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                      {ev.status === 'active' ? 'Active' : 'Upcoming'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                    <div><p className="text-xs text-gray-500">Registrations</p><p className="font-semibold">{ev.registration_count} / {ev.capacity}</p></div>
                    <div><p className="text-xs text-gray-500">Points Reward</p><p className="font-semibold">{ev.points_reward} pts</p></div>
                    <div><p className="text-xs text-gray-500">Fill Rate</p><p className="font-semibold">{progress}%</p></div>
                  </div>
                  <ProgressBar value={progress} color={progress > 80 ? 'bg-orange-500' : 'bg-green-500'} />
                  <div className="flex gap-2 mt-3">
                    <select onChange={e => handleStatusChange(ev.id, e.target.value)} defaultValue={ev.status}
                      className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400">
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Mark Active</option>
                      <option value="completed">Mark Completed</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity + Growth Suggestions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
          </div>
          {activity.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No activity yet. Activity shows here when volunteers register.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activity.slice(0, 6).map((a, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                    {(a.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{a.full_name || a.email || 'A volunteer'}</span>
                      {a.attended ? ' attended ' : ' registered for '}
                      <span className="font-medium text-green-700">{a.event_title}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(a.registered_at)}
                    </p>
                  </div>
                  {a.attended && (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-800">Impact Summary</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Volunteer attendance rate</span>
                <span className="font-semibold">
                  {stats.totalRegistrations > 0
                    ? Math.round((stats.totalAttended / stats.totalRegistrations) * 100)
                    : 0}%
                </span>
              </div>
              <ProgressBar
                value={stats.totalRegistrations > 0
                  ? Math.round((stats.totalAttended / stats.totalRegistrations) * 100)
                  : 0}
                color="bg-purple-500"
              />
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Events completed</span>
                <span className="font-semibold">
                  {(stats.activeEvents || 0) + (stats.completedEvents || 0) > 0
                    ? Math.round((stats.completedEvents / ((stats.activeEvents || 0) + (stats.completedEvents || 0))) * 100)
                    : 0}%
                </span>
              </div>
              <ProgressBar
                value={(stats.activeEvents || 0) + (stats.completedEvents || 0) > 0
                  ? Math.round((stats.completedEvents / ((stats.activeEvents || 0) + (stats.completedEvents || 0))) * 100)
                  : 0}
                color="bg-blue-500"
              />
            </div>
            {events.length === 0 && (
              <div className="bg-white rounded-xl p-4">
                <p className="font-semibold text-gray-800 text-sm mb-1">🚀 Get started</p>
                <p className="text-xs text-gray-500">Create your first event to start tracking volunteers and impact.</p>
                <button onClick={() => setShowCreate(true)}
                  className="mt-2 text-green-600 font-medium text-xs hover:underline">
                  Create Event →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  /* ═══════ renderEvents ════════════════════════════════════════════════════ */
  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Events & Campaigns</h1>
          <p className="text-gray-500 mt-1 text-sm">{events.length} event(s) created so far</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-700 transition shadow-md flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-12 text-center border border-gray-200">
          <Calendar className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Events Yet</h3>
          <p className="text-gray-500 mb-6">Create your first event to start building your volunteer community.</p>
          <button onClick={() => setShowCreate(true)}
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition inline-flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create First Event
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(ev => {
            const progress = pct(ev.registration_count, ev.capacity);
            const isPast   = new Date(ev.date) < new Date();
            return (
              <div key={ev.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ev.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{ev.title}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(ev.date)}{ev.time_slot ? ` • ${ev.time_slot}` : ''}
                        {ev.city ? ` • ${ev.city}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      ev.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                      ev.status === 'active'    ? 'bg-green-100 text-green-700' :
                      ev.urgency === 'urgent'   ? 'bg-orange-100 text-orange-700' :
                                                  'bg-blue-100 text-blue-700'
                    }`}>
                      {ev.status.charAt(0).toUpperCase() + ev.status.slice(1)}
                    </span>
                    {ev.urgency === 'urgent' && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">Urgent</span>}
                  </div>
                </div>

                {ev.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ev.description}</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div><p className="text-xs text-gray-500">Registrations</p><p className="font-bold text-gray-800">{ev.registration_count}/{ev.capacity}</p></div>
                  <div><p className="text-xs text-gray-500">Attended</p><p className="font-bold text-gray-800">{ev.attended_count}</p></div>
                  <div><p className="text-xs text-gray-500">Points/Person</p><p className="font-bold text-gray-800">{ev.points_reward} pts</p></div>
                  <div><p className="text-xs text-gray-500">Fill Rate</p><p className="font-bold text-gray-800">{progress}%</p></div>
                </div>

                <ProgressBar value={progress} color={progress > 80 ? 'bg-orange-500' : progress > 50 ? 'bg-blue-500' : 'bg-green-500'} />

                {ev.goal && (
                  <p className="text-xs text-gray-500 mt-2">🎯 Goal: {ev.goal}</p>
                )}

                <div className="flex gap-2 mt-4">
                  <select onChange={e => handleStatusChange(ev.id, e.target.value)} defaultValue={ev.status}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400">
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ═══════ renderAnalytics ════════════════════════════════════════════════ */
  const maxMonthly = Math.max(...monthly.map(m => m.registrations), 1);
  const maxCat     = Math.max(...cats.map(c => c.volunteer_count), 1);

  const renderAnalytics = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Impact & Analytics</h1>
        <p className="text-gray-500 mt-1 text-sm">Real-time data from your events and volunteers</p>
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-4xl font-bold text-green-600">{stats.totalRegistrations || 0}</p>
          <p className="text-gray-600 mt-1">Total Volunteer Registrations</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-4xl font-bold text-blue-600">{stats.totalAttended || 0}</p>
          <p className="text-gray-600 mt-1">Verified Attendances</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-4xl font-bold text-purple-600">{(stats.totalPoints || 0).toLocaleString()}</p>
          <p className="text-gray-600 mt-1">Points Distributed</p>
        </div>
      </div>

      {/* Monthly registrations chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Monthly Volunteer Registrations (Last 6 Months)</h2>
        {monthly.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No data yet. Registrations will appear here once volunteers sign up.</p>
          </div>
        ) : (
          <div className="flex items-end gap-4 h-48">
            {monthly.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">{m.registrations}</span>
                <div className="w-full bg-green-500 rounded-t-lg transition-all"
                  style={{ height: `${Math.round((m.registrations / maxMonthly) * 160)}px` }} />
                <span className="text-xs text-gray-500 text-center">{m.month}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Volunteer Count by Category</h2>
        {cats.length === 0 ? (
          <p className="text-gray-400 text-sm">Create events to see category breakdown.</p>
        ) : (
          <div className="space-y-4">
            {cats.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{c.category}</span>
                  <span className="text-gray-500">{c.volunteer_count} volunteers • {c.event_count} events</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full"
                    style={{ width: `${Math.round((c.volunteer_count / maxCat) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 transition flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>
    </div>
  );

  /* ═══════ renderProfile ══════════════════════════════════════════════════ */
  const renderProfile = () => (
    <div className="space-y-7 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Organization / Community Profile</h1>
        <p className="text-gray-500 mt-1 text-sm">Update your public-facing information</p>
      </div>

      {/* Verification status */}
      <div className={`rounded-xl p-5 border ${
        comm.verification_status === 'verified'
          ? 'bg-blue-50 border-blue-200'
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center gap-3">
          {comm.verification_status === 'verified'
            ? <CheckCircle className="w-7 h-7 text-blue-600" />
            : <AlertCircle className="w-7 h-7 text-yellow-600" />}
          <div>
            <h3 className="font-bold text-gray-800">
              {comm.verification_status === 'verified' ? 'Verified Organization / Community' : 'Verification Pending'}
            </h3>
            <p className="text-sm text-gray-600">
              {comm.verification_status === 'verified'
                ? 'Your account has been verified. Trust badge is shown on your events.'
                : 'Our team will review your submission. You can still create events while pending.'}
            </p>
          </div>
        </div>
      </div>

      {/* Editable form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 space-y-5">
        <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization / Community Name</label>
          <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mission Statement</label>
          <textarea rows={3} value={profileForm.mission}
            onChange={e => setProfileForm(f => ({ ...f, mission: e.target.value }))}
            placeholder="We are committed to…"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (read-only)</label>
            <input value={comm.email || ''} readOnly
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input value={profileForm.contactPhone}
              onChange={e => setProfileForm(f => ({ ...f, contactPhone: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input value={profileForm.website}
            onChange={e => setProfileForm(f => ({ ...f, website: e.target.value }))}
            placeholder="https://yourorg.org"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        {profileSaved && (
          <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Profile updated successfully!
          </p>
        )}
        <div className="flex justify-end">
          <button type="submit" disabled={savingProfile}
            className="bg-green-600 text-white px-7 py-2.5 rounded-xl font-medium hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-70">
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {savingProfile ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Membership since */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Account Info</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div><p className="text-gray-500">Member Since</p><p className="font-semibold">{comm.created_at ? formatDate(comm.created_at) : '—'}</p></div>
          <div><p className="text-gray-500">Address</p><p className="font-semibold">{comm.address || '—'}</p></div>
          <div><p className="text-gray-500">Contact Person</p><p className="font-semibold">{comm.contact_person || '—'}</p></div>
        </div>
      </div>
    </div>
  );

  /* ═══════ renderRewards ══════════════════════════════════════════════════ */
  const renderRewards = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Rewards & Recognition</h1>
        <p className="text-gray-500 mt-1 text-sm">Points distributed to volunteers who attended your events</p>
      </div>

      {/* Points overview */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-orange-200 text-center">
          <Trophy className="w-10 h-10 text-orange-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-800">{(stats.totalPoints || 0).toLocaleString()}</p>
          <p className="text-gray-600 text-sm mt-1">Total Points Distributed</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 text-center">
          <UserCheck className="w-10 h-10 text-blue-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-800">{stats.totalAttended || 0}</p>
          <p className="text-gray-600 text-sm mt-1">Verified Attendances</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
          <Award className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalAttended > 0
              ? Math.round(stats.totalPoints / stats.totalAttended)
              : 0}
          </p>
          <p className="text-gray-600 text-sm mt-1">Avg Points per Volunteer</p>
        </div>
      </div>

      {/* Event-wise points breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Points by Event</h2>
        {events.length === 0 ? (
          <p className="text-gray-400 text-sm">Create events and mark attendance to see points breakdown.</p>
        ) : (
          <div className="space-y-4">
            {events.map(ev => (
              <div key={ev.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{ev.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{ev.title}</p>
                    <p className="text-xs text-gray-500">{formatDate(ev.date)} • {ev.attended_count} attended</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">{(ev.points_reward * ev.attended_count).toLocaleString()} pts</p>
                  <p className="text-xs text-gray-500">{ev.points_reward} pts × {ev.attended_count}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderAdvisor = () => (
    <Advisor communityData={comm} stats={stats} events={events} />
  );

  /* ═══════ Sidebar nav items ══════════════════════════════════════════════ */
  const navItems = [
    { id: 'home',      icon: <Grid className="w-5 h-5" />,     label: 'Dashboard' },
    { id: 'events',    icon: <Calendar className="w-5 h-5" />, label: 'Events & Campaigns' },
    { id: 'advisor',   icon: <Sparkles className="w-5 h-5 text-purple-500" />, label: 'Advisor (AI)' },
    { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />,label: 'Analytics' },
    { id: 'rewards',   icon: <Trophy className="w-5 h-5" />,   label: 'Rewards' },
    { id: 'profile',   icon: <Users className="w-5 h-5" />,    label: 'Profile' }
  ];

  /* ═══════ Main render ════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-20 flex items-center justify-between px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <button onClick={handleSignOut}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition">
            Sign Out
          </button>
          <button onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-5 h-5 text-gray-600" />
            {activity.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {(comm.name || profile.name || 'O').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-60 bg-white shadow-sm z-10 flex flex-col border-r border-gray-100">
        <nav className="flex-1 py-5 space-y-1 px-3">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm ${
                activeTab === item.id
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t">
          <button onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm ${
              activeTab === 'profile' ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            <Settings className="w-5 h-5" /> Settings / Profile
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-60 mt-14 p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'home'      && renderHome()}
          {activeTab === 'events'    && renderEvents()}
          {activeTab === 'advisor'   && renderAdvisor()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'rewards'   && renderRewards()}
          {activeTab === 'profile'   && renderProfile()}
        </div>
      </div>

      {/* Notifications panel */}
      {showNotif && (
        <div className="fixed top-14 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-30">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-bold text-gray-800">Recent Registrations</h3>
            <button onClick={() => setShowNotif(false)}><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {activity.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No activity yet</p>
            ) : activity.slice(0, 8).map((a, i) => (
              <div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{a.full_name || a.email || 'A volunteer'}</span>
                  {a.attended ? ' attended ' : ' registered for '}
                  <span className="font-medium text-green-700">{a.event_title}</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(a.registered_at)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreate && (
        <CreateEventModal
          token={token}
          onClose={() => setShowCreate(false)}
          onCreated={handleEventCreated}
        />
      )}
    </div>
  );
};

export default ConnectrustOrgDashboard;
