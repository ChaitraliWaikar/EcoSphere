/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import {
  Search, MapPin, Grid, Heart, Calendar, Users, Award, TrendingUp,
  Leaf, Droplet, Recycle, BookOpen, Settings, Bell, Lock, Eye, Globe,
  Moon, Sun, Mail, MessageSquare, HelpCircle, FileText, Shield,
  Loader2, CheckCircle, Clock, Star, XCircle
} from 'lucide-react';

const API = 'http://localhost:5000';
const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/* ─── Progress bar helper ───────────────────────────────────────────────── */
const ProgressBar = ({ value }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(value, 100)}%` }} />
  </div>
);

const ConnectrustLanding = () => {
  const { user, isLoaded } = useUser();
  const didSyncUser = useRef(false);

  /* ── UI state ─────────────────────────────────────────────────────────── */
  const [activeTab,        setActiveTab]        = useState('home');
  const [searchQuery,      setSearchQuery]      = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedUrgency,  setSelectedUrgency]  = useState('all');
  const [showMap,          setShowMap]          = useState(false);

  /* ── Dynamic data ─────────────────────────────────────────────────────── */
  const [events,        setEvents]        = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [userStats,     setUserStats]     = useState(null);
  const [contributions, setContributions] = useState([]);
  const [monthlyChart,  setMonthlyChart]  = useState([]);
  const [statsLoading,  setStatsLoading]  = useState(true);

  /* Registration state: eventId -> 'loading' | 'registered' | null */
  const [regState, setRegState] = useState({});

  /* ── Settings state (UI only for now) ──────────────────────────────────── */
  const [notifications, setNotifications] = useState({
    email: true, push: true, sms: false,
    eventReminders: true, weeklyDigest: true, urgentAlerts: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public', showContributions: true,
    showBadges: true, allowMessages: true
  });
  const [theme,    setTheme]    = useState('light');
  const [language, setLanguage] = useState('english');

  /* Help & support */
  const [supportQuery,  setSupportQuery]  = useState('');
  const [message,       setMessage]       = useState('');
  const [submitStatus,  setSubmitStatus]  = useState('');

  /* ── Sync user to Postgres on login ──────────────────────────────────── */
  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || didSyncUser.current) return;
      didSyncUser.current = true;
      try {
        await fetch(`${API}/api/users/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerkUserId: user.id,
            email:     user.primaryEmailAddress?.emailAddress || '',
            firstName: user.firstName || '',
            lastName:  user.lastName  || '',
            fullName:  user.fullName  || '',
            imageUrl:  user.imageUrl  || ''
          })
        });
      } catch (err) {
        console.error('User sync failed:', err);
      }
    };
    syncUser();
  }, [isLoaded, user]);

  /* ── Fetch all public events ─────────────────────────────────────────── */
  const fetchEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const res  = await fetch(`${API}/api/events`);
      const data = await res.json();
      if (data.success) setEvents(data.events || []);
    } catch (err) {
      console.error('fetchEvents:', err);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  /* ── Fetch user stats + contributions ───────────────────────────────── */
  const fetchStats = useCallback(async () => {
    if (!isLoaded || !user) return;
    setStatsLoading(true);
    try {
      const res  = await fetch(`${API}/api/users/stats?clerkUserId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setUserStats(data.stats);
        setContributions(data.contributions || []);
        setMonthlyChart(data.monthlyChart   || []);
        // Pre-populate regState from contributions
        const rs = {};
        (data.contributions || []).forEach(c => { rs[c.event_id] = 'registered'; });
        setRegState(rs);
      }
    } catch (err) {
      console.error('fetchStats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [isLoaded, user]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  /* ── Register / cancel for an event ─────────────────────────────────── */
  const handleRegister = async (eventId) => {
    if (!user) return;
    const already = regState[eventId] === 'registered';
    setRegState(s => ({ ...s, [eventId]: 'loading' }));
    try {
      const url    = `${API}/api/events/${eventId}/register`;
      const method = already ? 'DELETE' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerkUserId: user.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRegState(s => ({ ...s, [eventId]: already ? null : 'registered' }));
        fetchStats();
        fetchEvents();
      } else {
        setRegState(s => ({ ...s, [eventId]: already ? 'registered' : null }));
        alert(data.message || 'Something went wrong');
      }
    } catch {
      setRegState(s => ({ ...s, [eventId]: already ? 'registered' : null }));
    }
  };

  /* ── Helpers ─────────────────────────────────────────────────────────── */
  const getUserInitials = () => {
    if (!user) return 'U';
    const name  = user.fullName || user.firstName || user.primaryEmailAddress?.emailAddress || '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (!parts.length) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  /* ── Logo ─────────────────────────────────────────────────────────────── */
  const Logo = () => (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-lg">E</div>
        </div>
      </div>
      <div>
        <div className="text-xl font-bold text-gray-800">Connectrust</div>
        <div className="text-xs text-gray-500">Make a difference</div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════════════════
     renderHome
  ════════════════════════════════════════════════════════════════════════ */
  const urgentEvents = events.filter(e => e.urgency === 'urgent').slice(0, 3);
  const recentEvents = events.slice(0, 3);

  const renderHome = () => (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 md:p-12 text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Welcome{user ? `, ${user.firstName || 'Friend'}` : ''}! 👋
        </h1>
        <p className="text-xl mb-8 text-green-50">Connect with local communities and make a real difference today.</p>
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for causes, locations, or communities…"
            className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-md"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Personal stats (if logged in) */}
      {isLoaded && user && (
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Events Registered', value: userStats?.events_registered ?? '—', icon: <Calendar className="w-6 h-6 text-blue-500" />, color: 'border-blue-100' },
            { label: 'Events Attended',   value: userStats?.events_attended   ?? '—', icon: <CheckCircle className="w-6 h-6 text-green-500" />, color: 'border-green-100' },
            { label: 'Points Earned',     value: (userStats?.total_points ?? 0).toLocaleString(), icon: <Award className="w-6 h-6 text-yellow-500" />, color: 'border-yellow-100' },
            { label: 'Hours Volunteered', value: Number(userStats?.total_hours ?? 0).toFixed(1),  icon: <Clock className="w-6 h-6 text-purple-500" />, color: 'border-purple-100' }
          ].map((s, i) => (
            <div key={i} className={`bg-white rounded-xl p-5 border ${s.color} shadow-sm flex items-center gap-4`}>
              {s.icon}
              <div>
                <p className="text-2xl font-bold text-gray-800">{statsLoading ? <Loader2 className="w-5 h-5 animate-spin inline" /> : s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Urgent needs */}
      {urgentEvents.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Bell className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800">Urgent Needs</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {urgentEvents.map(ev => (
              <div key={ev.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-orange-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{ev.icon}</div>
                  <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">URGENT</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{ev.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ev.description}</p>
                <div className="flex items-center text-gray-500 text-xs mb-4">
                  <MapPin className="w-3 h-3 mr-1" />{ev.city}{ev.state ? `, ${ev.state}` : ''}
                </div>
                <button onClick={() => setActiveTab('discover')}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition text-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent opportunities */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-800">Latest Opportunities</h2>
          <button onClick={() => setActiveTab('discover')} className="text-green-600 font-medium text-sm hover:underline">
            View All ({events.length}) →
          </button>
        </div>
        {eventsLoading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto" /></div>
        ) : events.length === 0 ? (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-12 text-center border border-gray-100">
            <Leaf className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Events Yet</h3>
            <p className="text-gray-500">Organizations and communities are setting up events. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {recentEvents.map(ev => (
              <EventCard key={ev.id} ev={ev} regState={regState} onRegister={handleRegister} user={user} />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border border-gray-100 text-center">
        <Heart className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Impact Starts Here 💝</h2>
        <p className="text-gray-600 mb-5">Register for events, volunteer, and track your contributions.</p>
        <button onClick={() => setActiveTab('discover')}
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition inline-flex items-center gap-2 shadow-md">
          <TrendingUp className="w-5 h-5" /> Discover Opportunities
        </button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════════════════
     renderDiscover
  ════════════════════════════════════════════════════════════════════════ */
  const filtered = events.filter(ev => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q ||
      ev.title?.toLowerCase().includes(q) ||
      ev.description?.toLowerCase().includes(q) ||
      ev.community_name?.toLowerCase().includes(q) ||
      ev.city?.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchLoc = selectedLocation === 'all' || ev.city === selectedLocation;
    const matchUrg = selectedUrgency  === 'all' || ev.urgency === selectedUrgency;
    return matchSearch && matchCat && matchLoc && matchUrg;
  });

  const allCities = [...new Set(events.map(e => e.city).filter(Boolean))];
  const allCats   = [...new Set(events.map(e => e.category).filter(Boolean))];

  const renderDiscover = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Discover Opportunities</h1>
        <p className="text-gray-500">Find the perfect cause that matches your passion</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input type="text" placeholder="Search by event name, community, or location…"
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">Filters</h2>
          <button onClick={() => { setSelectedCategory('all'); setSelectedLocation('all'); setSelectedUrgency('all'); setSearchQuery(''); }}
            className="text-sm text-green-600 hover:underline font-medium">Clear All</button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              <option value="all">All Categories</option>
              {allCats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              <option value="all">All Locations</option>
              {allCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select value={selectedUrgency} onChange={e => setSelectedUrgency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
              <option value="all">All</option>
              <option value="urgent">Urgent Only</option>
              <option value="normal">Regular</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Showing {filtered.length} of {events.length} events
        </p>
      </div>

      {/* Events grid */}
      {eventsLoading ? (
        <div className="text-center py-16"><Loader2 className="w-10 h-10 animate-spin text-green-500 mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {events.length === 0
              ? 'No events available yet. Organizations are setting up events — check back soon!'
              : 'No events match your filters.'}
          </p>
          {events.length > 0 && (
            <button onClick={() => { setSelectedCategory('all'); setSelectedLocation('all'); setSelectedUrgency('all'); setSearchQuery(''); }}
              className="mt-4 text-green-600 font-medium text-sm hover:underline">Clear filters</button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(ev => (
            <EventCard key={ev.id} ev={ev} regState={regState} onRegister={handleRegister} user={user} />
          ))}
        </div>
      )}
    </div>
  );

  /* ════════════════════════════════════════════════════════════════════════
     renderContributions
  ════════════════════════════════════════════════════════════════════════ */
  const maxPoints = Math.max(...monthlyChart.map(m => m.points), 1);

  const renderContributions = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">My Contributions</h1>
        <p className="text-gray-500">Your volunteer journey and impact</p>
      </div>

      {/* Stats row */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Events Registered', value: userStats?.events_registered ?? 0, icon: <Calendar className="w-6 h-6 text-blue-500" />, color: 'border-blue-100' },
          { label: 'Events Attended',   value: userStats?.events_attended   ?? 0, icon: <CheckCircle className="w-6 h-6 text-green-500" />, color: 'border-green-100' },
          { label: 'Total Points',      value: (userStats?.total_points ?? 0).toLocaleString(), icon: <Award className="w-6 h-6 text-yellow-500" />, color: 'border-yellow-100' },
          { label: 'Hours Volunteered', value: Number(userStats?.total_hours ?? 0).toFixed(1),  icon: <Clock className="w-6 h-6 text-purple-500" />, color: 'border-purple-100' }
        ].map((s, i) => (
          <div key={i} className={`bg-white rounded-xl p-5 border ${s.color} shadow-sm flex items-center gap-4`}>
            {s.icon}
            <div>
              <p className="text-2xl font-bold text-gray-800">{statsLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly points chart */}
      {monthlyChart.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Points Earned (Last 6 Months)</h2>
          <div className="flex items-end gap-4 h-40">
            {monthlyChart.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-gray-700">{m.points}</span>
                <div className="w-full bg-green-500 rounded-t-lg"
                  style={{ height: `${Math.round((m.points / maxPoints) * 120)}px` }} />
                <span className="text-xs text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Registered Events</h2>
        {statsLoading ? (
          <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin text-green-500 mx-auto" /></div>
        ) : contributions.length === 0 ? (
          <div className="text-center py-10">
            <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You haven't registered for any events yet.</p>
            <button onClick={() => setActiveTab('discover')}
              className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 transition text-sm">
              Discover Events
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.map((c) => (
              <div key={c.registration_id} className={`flex items-start gap-4 p-4 rounded-xl border ${c.attended ? 'border-green-100 bg-green-50' : 'border-gray-100'}`}>
                <span className="text-3xl">{c.icon || '🌿'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-800">{c.title}</h3>
                    {c.attended
                      ? <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Attended</span>
                      : <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">Registered</span>
                    }
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {c.community_name} • {formatDate(c.date)}{c.city ? ` • ${c.city}` : ''}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><Award className="w-3 h-3 text-yellow-500" />{c.points_reward} pts {c.attended ? 'earned' : 'on attendance'}</span>
                    {c.hours_logged > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-purple-400" />{Number(c.hours_logged).toFixed(1)}h logged</span>}
                  </div>
                </div>
                <button onClick={() => handleRegister(c.event_id)}
                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1 flex-shrink-0">
                  <XCircle className="w-3 h-3" /> Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════════════════
     renderSettings (UI preferences — stored locally for now)
  ════════════════════════════════════════════════════════════════════════ */
  const renderSettings = () => (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and privacy</p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-5"><Bell className="w-6 h-6 text-green-600" /><h2 className="text-xl font-bold text-gray-800">Notifications</h2></div>
        <div className="space-y-4">
          {[
            { key: 'email',          label: 'Email Notifications',  desc: 'Receive updates via email' },
            { key: 'push',           label: 'Push Notifications',   desc: 'Get browser notifications' },
            { key: 'sms',            label: 'SMS Notifications',    desc: 'Text messages for urgent updates' },
            { key: 'eventReminders', label: 'Event Reminders',      desc: 'Reminders for upcoming events' },
            { key: 'weeklyDigest',   label: 'Weekly Digest',        desc: 'Summary of your activity' },
            { key: 'urgentAlerts',   label: 'Urgent Alerts',        desc: 'Immediate notifications for critical needs' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div><p className="font-medium text-gray-800">{item.label}</p><p className="text-sm text-gray-500">{item.desc}</p></div>
              <button onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                className={`relative w-14 h-7 rounded-full transition ${notifications[item.key] ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${notifications[item.key] ? 'translate-x-7' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-5"><Lock className="w-6 h-6 text-green-600" /><h2 className="text-xl font-bold text-gray-800">Privacy</h2></div>
        <div className="space-y-5">
          <div>
            <label className="block font-medium text-gray-800 mb-2">Profile Visibility</label>
            <select value={privacy.profileVisibility} onChange={e => setPrivacy(p => ({ ...p, profileVisibility: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="public">Public — Anyone can view</option>
              <option value="members">Members Only</option>
              <option value="private">Private — Only me</option>
            </select>
          </div>
          {[
            { key: 'showContributions', label: 'Show My Contributions', desc: 'Display your volunteer history publicly' },
            { key: 'showBadges',        label: 'Show My Badges',        desc: 'Display earned badges on your profile' },
            { key: 'allowMessages',     label: 'Allow Messages',        desc: 'Let organizations contact you directly' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div><p className="font-medium text-gray-800">{item.label}</p><p className="text-sm text-gray-500">{item.desc}</p></div>
              <button onClick={() => setPrivacy(p => ({ ...p, [item.key]: !p[item.key] }))}
                className={`relative w-14 h-7 rounded-full transition ${privacy[item.key] ? 'bg-green-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${privacy[item.key] ? 'translate-x-7' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-5"><Eye className="w-6 h-6 text-green-600" /><h2 className="text-xl font-bold text-gray-800">Appearance</h2></div>
        <div className="flex gap-4">
          {[{ value: 'light', icon: <Sun className="w-5 h-5" />, label: 'Light' }, { value: 'dark', icon: <Moon className="w-5 h-5" />, label: 'Dark' }, { value: 'auto', icon: <Globe className="w-5 h-5" />, label: 'Auto' }].map(o => (
            <button key={o.value} onClick={() => setTheme(o.value)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition ${theme === o.value ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'}`}>
              {o.icon}{o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-5"><Shield className="w-6 h-6 text-green-600" /><h2 className="text-xl font-bold text-gray-800">Account Management</h2></div>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <p className="font-medium text-gray-800">Change Password</p>
            <p className="text-sm text-gray-500">Update your account password via Clerk</p>
          </button>
          <button className="w-full text-left px-4 py-3 border border-red-200 rounded-xl hover:bg-red-50 transition text-red-600">
            <p className="font-medium">Delete Account</p>
            <p className="text-sm text-red-400">Permanently remove your account and data</p>
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition shadow-md">Save Changes</button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════════════════
     renderHelpSupport
  ════════════════════════════════════════════════════════════════════════ */
  const renderHelpSupport = () => {
    const faqs = [
      { q: 'How do I sign up for an event?', a: 'Browse events on the Discover page and click "Register". Your registration is saved to our database and you can track it in My Contributions.' },
      { q: 'Can I earn certificates for volunteering?', a: 'Yes! After completing verified volunteer activities (when the org marks your attendance), you\'ll see your points and hours in My Contributions.' },
      { q: 'How do I start my own initiative?', a: 'Organizations and communities can register through our partner program on the home page. Click "Organization / Community" to get started.' },
      { q: 'Is my data secure?', a: 'We use industry-standard encryption. Your personal information is stored securely and never shared without your consent.' },
      { q: 'How do I track my impact?', a: 'Visit "My Contributions" to see your registered events, attended count, total points earned, and hours volunteered — all pulled live from our database.' }
    ];
    const handleSubmit = (e) => {
      e.preventDefault();
      setSubmitStatus('success');
      setSupportQuery(''); setMessage('');
      setTimeout(() => setSubmitStatus(''), 3000);
    };
    return (
      <div className="space-y-8 max-w-4xl">
        <div><h1 className="text-3xl font-bold text-gray-800 mb-1">Help & Support</h1><p className="text-gray-500">We're here to help</p></div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: <FileText className="w-7 h-7 text-blue-500" />, title: 'Documentation', desc: 'Browse guides and tutorials', action: 'View Docs →', color: 'from-blue-50 to-blue-100 border-blue-200', textColor: 'text-blue-600' },
            { icon: <MessageSquare className="w-7 h-7 text-green-500" />, title: 'Community Forum', desc: 'Connect with other volunteers', action: 'Join Forum →', color: 'from-green-50 to-green-100 border-green-200', textColor: 'text-green-600' },
            { icon: <Mail className="w-7 h-7 text-purple-500" />, title: 'Email Support', desc: 'Get help from our team', action: 'support@connectrust.org', color: 'from-purple-50 to-purple-100 border-purple-200', textColor: 'text-purple-600' }
          ].map((c, i) => (
            <div key={i} className={`bg-gradient-to-br ${c.color} rounded-xl p-5 border`}>
              {c.icon}<h3 className="font-bold text-gray-800 mt-3 mb-1">{c.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{c.desc}</p>
              <button className={`${c.textColor} font-medium text-sm hover:underline`}>{c.action}</button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-5"><HelpCircle className="w-6 h-6 text-green-600" /><h2 className="text-xl font-bold text-gray-800">Frequently Asked Questions</h2></div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group">
                <summary className="flex justify-between items-center cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="font-medium text-gray-800">{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition text-xs">▼</span>
                </summary>
                <div className="p-4 text-gray-600 text-sm border-l-2 border-green-500 ml-4 mt-2">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-5"><MessageSquare className="w-6 h-6 text-green-600" /><h2 className="text-xl font-bold text-gray-800">Contact Support</h2></div>
          {submitStatus === 'success' && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Message sent! We'll get back within 24 hours.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium text-gray-800 mb-1">Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4}
                placeholder="Describe your issue or question…"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-700 transition">Send Message</button>
          </form>
        </div>
      </div>
    );
  };

  /* ════════════════════════════════════════════════════════════════════════
     Main return
  ════════════════════════════════════════════════════════════════════════ */
  const navItems = [
    { id: 'home',          icon: <Leaf className="w-5 h-5" />,     label: 'Home' },
    { id: 'discover',      icon: <Search className="w-5 h-5" />,   label: 'Discover' },
    { id: 'contributions', icon: <Heart className="w-5 h-5" />,    label: 'My Contributions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10 flex flex-col border-r border-gray-100">
        <div className="p-5 border-b">
          <Logo />
          {isLoaded && user && (
            <div className="mt-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-3 border border-green-100 space-y-2">
              <div className="flex items-center gap-3">
                {user.imageUrl
                  ? <img src={user.imageUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-green-200" />
                  : <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">{getUserInitials()}</div>
                }
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-800 truncate text-sm">{user.fullName || 'Connectrust User'}</div>
                  <div className="text-xs text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</div>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
              <Link to="/account" className="text-xs font-medium text-green-700 hover:text-green-900">✏️ Edit profile</Link>
            </div>
          )}
        </div>

        <div className="flex-1 py-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 mb-3">Menu</p>
          <nav className="space-y-1 px-3">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm ${
                  activeTab === item.id ? 'bg-green-50 text-green-700 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                {item.icon}{item.label}
                {item.id === 'contributions' && contributions.length > 0 && (
                  <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold rounded-full px-2 py-0.5">{contributions.length}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3 border-t space-y-1">
          {[
            { id: 'settings', icon: <Settings className="w-5 h-5" />,    label: 'Settings' },
            { id: 'help',     icon: <HelpCircle className="w-5 h-5" />,  label: 'Help & Support' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm ${
                activeTab === item.id ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'home'          && renderHome()}
          {activeTab === 'discover'      && renderDiscover()}
          {activeTab === 'contributions' && renderContributions()}
          {activeTab === 'settings'      && renderSettings()}
          {activeTab === 'help'          && renderHelpSupport()}
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   EventCard component (shared between Home + Discover)
════════════════════════════════════════════════════════════════════════════ */
const EventCard = ({ ev, regState, onRegister, user }) => {
  const isRegistered = regState[ev.id] === 'registered';
  const isLoading    = regState[ev.id] === 'loading';
  const progress     = Math.min(100, Math.round((ev.registration_count / Math.max(ev.capacity, 1)) * 100));
  const isFull       = ev.registration_count >= ev.capacity;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-5 border border-gray-100 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{ev.icon || '🌿'}</div>
        <div className="flex flex-col items-end gap-1">
          <span className={`${ev.badge_color || 'bg-green-600'} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
            {ev.badge || ev.type || 'EVENT'}
          </span>
          {ev.community_verified === 'verified' && (
            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-1">{ev.title}</h3>
      <p className="text-sm text-gray-500 mb-1">{ev.community_name}</p>
      {ev.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ev.description}</p>}

      <div className="space-y-1.5 mb-4 text-sm text-gray-600">
        {ev.city && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 flex-shrink-0" />{ev.location ? `${ev.location}, ${ev.city}` : ev.city}</div>}
        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 flex-shrink-0" />{new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}{ev.time_slot ? ` • ${ev.time_slot}` : ''}</div>
        <div className="flex items-center gap-2"><Users className="w-4 h-4 flex-shrink-0" />{ev.registration_count} / {ev.capacity} registered</div>
      </div>

      {ev.goal && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>🎯 {ev.goal}</span><span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1 text-green-600">
          <Award className="w-4 h-4" />
          <span className="text-sm font-semibold">{ev.points_reward} pts</span>
        </div>
        {user ? (
          <button
            onClick={() => onRegister(ev.id)}
            disabled={isLoading || (isFull && !isRegistered)}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition flex items-center gap-1.5 disabled:opacity-60 ${
              isRegistered
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                : isFull
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
            }`}>
            {isLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Wait…</>
              : isRegistered
                ? <><XCircle className="w-4 h-4" /> Unregister</>
                : isFull
                  ? 'Full'
                  : <><Star className="w-4 h-4" /> Register</>
            }
          </button>
        ) : (
          <span className="text-xs text-gray-400">Sign in to register</span>
        )}
      </div>
    </div>
  );
};

export default ConnectrustLanding;
