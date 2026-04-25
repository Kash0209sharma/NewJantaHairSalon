import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiRefreshCw,
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMail,
  FiList,
  FiLock,
  FiLogOut,
} from 'react-icons/fi';
import { API_BASE_URL, getApiBaseError } from '../lib/api';

const statusStyles = {
  booked: 'bg-[#fff3d9] text-[#8a6200] ring-1 ring-[#f0d38b]',
  confirmed: 'bg-[#e7f7ed] text-[#0f6f3c] ring-1 ring-[#a8dfbf]',
  completed: 'bg-[#e6f0ff] text-[#1f4f99] ring-1 ring-[#a9c2f3]',
  cancelled: 'bg-[#fde5e2] text-[#b24c39] ring-1 ring-[#efb1a3]',
};

function formatDate(value) {
  if (!value) return 'Unknown date';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getStatusLabel(value) {
  if (!value) return 'Booked';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getStoredToken() {
  return sessionStorage.getItem('adminToken') || '';
}

export default function AdminPanel() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [authError, setAuthError] = useState('');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(getStoredToken());
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const clearSession = () => {
    sessionStorage.removeItem('adminToken');
    setToken('');
    setIsAuthenticated(false);
    setAppointments([]);
    setLastUpdated(null);
  };

  const fetchAppointments = async (showSpinner = false, tokenOverride = token) => {
    if (!tokenOverride) return;
    if (!API_BASE_URL) {
      setAuthError(getApiBaseError());
      return;
    }

    if (showSpinner) setRefreshing(true);
    else setLoading(true);

    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${tokenOverride}`,
        },
      });
      const data = await response.json();

      if (response.status === 401) {
        clearSession();
        setAuthError('Your admin session expired. Please sign in again.');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load appointments');
      }

      setAppointments(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Unable to load appointments.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setAuthChecking(false);
        return;
      }

      if (!API_BASE_URL) {
        setAuthError(getApiBaseError());
        setAuthChecking(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: authHeaders,
        });

        if (!response.ok) {
          clearSession();
          setAuthError('Please sign in to view the admin panel.');
          return;
        }

        setIsAuthenticated(true);
        await fetchAppointments(false, token);
      } catch (err) {
        setAuthError(err.message || 'Unable to verify admin session.');
      } finally {
        setAuthChecking(false);
      }
    };

    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedAppointments = useMemo(
    () =>
      appointments.map((appointment) => ({
        ...appointment,
        status: appointment.status || 'booked',
      })),
    [appointments]
  );

  const visibleAppointments = useMemo(() => {
    if (statusFilter === 'all') return normalizedAppointments;
    return normalizedAppointments.filter((appointment) => appointment.status === statusFilter);
  }, [normalizedAppointments, statusFilter]);

  const summary = useMemo(() => {
    return normalizedAppointments.reduce(
      (acc, appointment) => {
        acc.total += 1;
        acc[appointment.status] = (acc[appointment.status] || 0) + 1;
        return acc;
      },
      { total: 0, booked: 0, confirmed: 0, completed: 0, cancelled: 0 }
    );
  }, [normalizedAppointments]);

  const stats = [
    { label: 'Total bookings', value: summary.total },
    { label: 'Booked', value: summary.booked },
    { label: 'Confirmed', value: summary.confirmed },
    { label: 'Completed', value: summary.completed },
  ];

  const filterButtons = [
    { key: 'all', label: 'All' },
    { key: 'booked', label: 'Booked' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setAuthError('');
    setError('');

    if (!API_BASE_URL) {
      setLoginLoading(false);
      setAuthError(getApiBaseError());
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid admin credentials');
      }

      sessionStorage.setItem('adminToken', data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      setLoginForm({ username: '', password: '' });
      await fetchAppointments(false, data.token);
    } catch (err) {
      setAuthError(err.message || 'Login failed.');
    } finally {
      setLoginLoading(false);
      setAuthChecking(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setAuthError('You have been signed out.');
    setStatusFilter('all');
  };

  return (
    <motion.section
      id="admin"
      className="mt-24 overflow-hidden rounded-[2rem] border border-[#e7dfd1] bg-white/90 px-5 py-8 shadow-soft sm:px-8 lg:px-10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75 }}
      viewport={{ once: true, amount: 0.18 }}
    >
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Admin Panel</p>
          <h2 className="section-heading mt-2 text-3xl font-semibold text-primary sm:text-4xl">
            Booked slots at a glance
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Only signed-in admins can view this dashboard. It stays hidden behind an authenticated session and loads
            appointment data from the protected backend API.
          </p>
        </div>

        {isAuthenticated && (
          <div className="flex flex-wrap items-center gap-3">
            {lastUpdated && (
              <span className="rounded-full bg-[#f8fbf6] px-4 py-2 text-xs font-medium text-muted">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              type="button"
              onClick={() => fetchAppointments(true)}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-primary transition hover:shadow-lg disabled:opacity-60"
              disabled={loading || refreshing}
            >
              <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-[#f6f1e8] px-4 py-2 text-sm font-semibold text-primary transition hover:bg-[#ece4d6]"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        )}
      </div>

      {authChecking ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#e1d6c5] bg-[#fcfaf6] py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ded0bb] border-t-accent" />
          <p className="mt-4 text-sm text-muted">Checking admin session…</p>
        </div>
      ) : !isAuthenticated ? (
        <div className="grid gap-8 rounded-[2rem] border border-[#ebe2d3] bg-[#fcfaf6] p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div>
            <div className="inline-flex rounded-full bg-[#f6f1e8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Private Access
            </div>
            <h3 className="section-heading mt-4 text-2xl font-semibold text-primary">Sign in to view appointments</h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              This area is protected by the backend. Only an admin with the correct credentials can load bookings and
              change their status later.
            </p>
            <div className="mt-6 space-y-3 text-sm text-muted">
              <div className="flex items-center gap-2">
                <FiLock className="shrink-0" />
                <span>Backend-enforced login</span>
              </div>
              <div className="flex items-center gap-2">
                <FiLock className="shrink-0" />
                <span>Signed admin token stored in session storage</span>
              </div>
              <div className="flex items-center gap-2">
                <FiLock className="shrink-0" />
                <span>Protected appointment endpoint</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="rounded-[1.75rem] border border-[#ebe2d3] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-primary">
              <FiLock />
              <h3 className="text-lg font-semibold">Admin Login</h3>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                name="username"
                placeholder="Admin username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full rounded-lg border border-[#ded0bb] p-3 text-sm focus:border-accent focus:outline-none"
                autoComplete="username"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full rounded-lg border border-[#ded0bb] p-3 text-sm focus:border-accent focus:outline-none"
                autoComplete="current-password"
                required
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-full bg-accent px-4 py-3 text-sm font-semibold text-primary transition hover:shadow-lg disabled:opacity-60"
              >
                {loginLoading ? 'Signing in...' : 'Access Admin Panel'}
              </button>
            </div>
            {authError && <p className="mt-3 text-sm text-terracotta">{authError}</p>}
          </form>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-[#ece4d6] bg-[#fcfaf6] p-5">
                <p className="text-sm text-muted">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold text-primary">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {filterButtons.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setStatusFilter(item.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === item.key
                    ? 'bg-primary text-white'
                    : 'bg-[#f6f1e8] text-primary hover:bg-[#ece4d6]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#e1d6c5] bg-[#fcfaf6] py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ded0bb] border-t-accent" />
                <p className="mt-4 text-sm text-muted">Loading appointments…</p>
              </div>
            ) : error ? (
              <div className="rounded-[2rem] border border-[#efb1a3] bg-[#fff5f2] px-5 py-4 text-sm text-[#b24c39]">
                {error}
              </div>
            ) : visibleAppointments.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[#e1d6c5] bg-[#fcfaf6] px-5 py-12 text-center">
                <FiList className="mx-auto text-3xl text-muted" />
                <h3 className="mt-4 text-lg font-semibold text-primary">No appointments found</h3>
                <p className="mt-2 text-sm text-muted">
                  {statusFilter === 'all'
                    ? 'Once customers book slots, they will appear here with their status.'
                    : `There are no ${statusFilter} appointments yet.`}
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-hidden rounded-[2rem] border border-[#ebe2d3] lg:block">
                  <table className="w-full border-collapse bg-white">
                    <thead className="bg-[#fcfaf6] text-left text-xs uppercase tracking-[0.18em] text-muted">
                      <tr>
                        <th className="px-5 py-4 font-semibold">Customer</th>
                        <th className="px-5 py-4 font-semibold">Schedule</th>
                        <th className="px-5 py-4 font-semibold">Services</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                        <th className="px-5 py-4 font-semibold">Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleAppointments.map((appointment) => {
                        const statusKey = appointment.status || 'booked';
                        const statusClass = statusStyles[statusKey] || statusStyles.booked;

                        return (
                          <tr key={appointment._id} className="border-t border-[#f0e8db] align-top">
                            <td className="px-5 py-5">
                              <p className="font-semibold text-primary">{appointment.name}</p>
                              <p className="mt-1 text-sm text-muted">{appointment.notes || 'No notes provided'}</p>
                            </td>
                            <td className="px-5 py-5">
                              <div className="flex items-center gap-2 text-sm text-primary">
                                <FiCalendar className="text-muted" />
                                <span>{formatDate(appointment.date)}</span>
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                                <FiClock className="text-muted" />
                                <span>{appointment.time}</span>
                              </div>
                            </td>
                            <td className="px-5 py-5">
                              <div className="flex flex-wrap gap-2">
                                {(appointment.services || []).map((service) => (
                                  <span
                                    key={service}
                                    className="rounded-full bg-[#f6f1e8] px-3 py-1 text-xs font-medium text-primary"
                                  >
                                    {service}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-5 py-5">
                              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                                {getStatusLabel(statusKey)}
                              </span>
                            </td>
                            <td className="px-5 py-5">
                              <div className="space-y-2 text-sm text-muted">
                                <div className="flex items-center gap-2">
                                  <FiPhone className="shrink-0" />
                                  <span>{appointment.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FiMail className="shrink-0" />
                                  <span>{appointment.email}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4 lg:hidden">
                  {visibleAppointments.map((appointment) => {
                    const statusKey = appointment.status || 'booked';
                    const statusClass = statusStyles[statusKey] || statusStyles.booked;

                    return (
                      <div key={appointment._id} className="rounded-[1.75rem] border border-[#ebe2d3] bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-primary">{appointment.name}</h3>
                            <p className="mt-1 text-sm text-muted">{appointment.email}</p>
                          </div>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                            {getStatusLabel(statusKey)}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm text-primary">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-muted" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiClock className="text-muted" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiPhone className="text-muted" />
                            <span>{appointment.phone}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <FiUser className="mt-0.5 text-muted" />
                            <div className="flex flex-wrap gap-2">
                              {(appointment.services || []).map((service) => (
                                <span
                                  key={service}
                                  className="rounded-full bg-[#f6f1e8] px-3 py-1 text-xs font-medium text-primary"
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </motion.section>
  );
}
