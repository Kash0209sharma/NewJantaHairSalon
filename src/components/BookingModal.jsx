import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL, getApiBaseError } from '../lib/api';

const services = [
  'Signature Haircut - ₹150',
  'Beard Sculpting - ₹100',
  'Heritage Color - ₹100',
  'Classic Shave - ₹150',
  'Young Master - ₹200',
];

const slotTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export default function BookingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    services: [],
    date: '',
    time: '',
    notes: '',
  });
  const [slots, setSlots] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!formData.date) {
      setSlots([]);
      return;
    }

    if (!API_BASE_URL) {
      setSlots([]);
      setMessage(getApiBaseError());
      return;
    }

    const fetchSlots = async () => {
      setFetchingSlots(true);
      setMessage('');

      try {
        const response = await fetch(`${API_BASE_URL}/appointments/available/${formData.date}`);
        const data = await response.json();

        if (response.ok) {
          const normalizedSlots = Array.isArray(data)
            ? data.map((time) => ({ time, available: true, bookedBy: null }))
            : data.slots || [];
          setSlots(normalizedSlots);
        } else {
          setSlots([]);
          setMessage(data.error || 'Unable to load slots.');
        }
      } catch (err) {
        setSlots([]);
        setMessage('Unable to load available slots. Please try again later.');
      } finally {
        setFetchingSlots(false);
      }
    };

    fetchSlots();
  }, [formData.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.time) {
      setMessage('Please select an available time slot before booking.');
      return;
    }
    if (formData.services.length === 0) {
      setMessage('Please select at least one service.');
      return;
    }

    setLoading(true);
    setMessage('');

    if (!API_BASE_URL) {
      setLoading(false);
      setMessage(getApiBaseError());
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Appointment booked successfully!');
        setFormData({ name: '', email: '', phone: '', services: [], date: '', time: '', notes: '' });
        setSlots([]);
        setTimeout(onClose, 2000);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to book appointment');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name === 'date' && value < getTodayDate()) {
      setMessage('Please select today or a future date.');
      setFormData({ ...formData, time: '', [name]: '' });
      return;
    }

    if (type === 'checkbox') {
      const updatedServices = checked
        ? [...formData.services, value]
        : formData.services.filter((s) => s !== value);
      setFormData({ ...formData, services: updatedServices });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg rounded-3xl bg-white p-5 shadow-soft sm:p-6 lg:p-7 flex flex-col"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-3 text-lg sm:text-xl font-semibold text-primary">Book Your Appointment</h2>
            <form id="booking-form" onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 overflow-y-auto flex-1 pr-2">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#ded0bb] p-2.5 sm:p-3 text-sm focus:border-accent focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#ded0bb] p-2.5 sm:p-3 text-sm focus:border-accent focus:outline-none"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#ded0bb] p-2.5 sm:p-3 text-sm focus:border-accent focus:outline-none"
              />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-primary">Select Services</h3>
                {services.map((service) => (
                  <label key={service} className="flex items-center gap-2.5 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      name="services"
                      value={service}
                      checked={formData.services.includes(service)}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-[#ded0bb] accent-accent"
                    />
                    <span className="text-primary">{service}</span>
                  </label>
                ))}
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={getTodayDate()}
                className="w-full rounded-lg border border-[#ded0bb] p-2.5 sm:p-3 text-sm focus:border-accent focus:outline-none"
              />
              <div className="rounded-2xl sm:rounded-3xl border border-[#ded0bb] p-3 sm:p-4">
                <div className="mb-2 sm:mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-primary">Select a time slot</h3>
                    <p className="text-xs text-muted">Booked slots are disabled; tap available slot.</p>
                  </div>
                  {formData.time && (
                    <span className="rounded-full bg-[#e7f7ed] px-3 py-1 text-xs font-semibold text-[#0f6f3c] whitespace-nowrap">
                      Selected: {formData.time}
                    </span>
                  )}
                </div>

                {formData.date ? (
                  fetchingSlots ? (
                    <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                      <div className="mb-2 h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-[#ded0bb] border-t-accent"></div>
                      <p className="text-xs sm:text-sm text-muted">Loading available slots…</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {slots.length > 0
                        ? slots.map((slot) => {
                            const active = formData.time === slot.time;
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={!slot.available}
                                onClick={() => setFormData({ ...formData, time: slot.time })}
                                className={`rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition ${
                                  slot.available
                                    ? active
                                      ? 'bg-accent text-primary shadow-lg'
                                      : 'bg-[#f8fbf6] text-primary hover:bg-[#eef7ec]'
                                    : 'cursor-not-allowed bg-[#fde5e2] text-[#b24c39]'
                                }`}
                              >
                                {slot.time}
                                {!slot.available && <span className="block text-[9px] sm:text-[10px] font-medium">Booked</span>}
                              </button>
                            );
                          })
                        : slotTimes.map((time) => (
                            <button
                              key={time}
                              type="button"
                              disabled
                              className="rounded-xl sm:rounded-2xl bg-[#f3f3f3] px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-muted"
                            >
                              {time}
                            </button>
                          ))}
                    </div>
                  )
                ) : (
                  <p className="text-xs sm:text-sm text-muted">Choose a date first to see available and booked slots.</p>
                )}
              </div>
              <input type="hidden" name="time" value={formData.time} />
              <textarea
                name="notes"
                placeholder="Special requests (optional)"
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#ded0bb] p-2.5 sm:p-3 focus:border-accent focus:outline-none text-sm"
                rows="2"
              />
            </form>
            <button
              type="submit"
              form="booking-form"
              disabled={loading}
              className="mt-3 sm:mt-4 w-full rounded-full bg-accent py-2.5 sm:py-3 text-sm font-semibold text-primary transition hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
            {message && <p className="mt-2 text-center text-xs sm:text-sm text-terracotta">{message}</p>}
            <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-primary">
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
