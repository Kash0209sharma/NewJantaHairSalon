import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const services = [
  'Signature Haircut - $45',
  'Beard Sculpting - $30',
  'Heritage Color - $65',
  'Classic Shave - $35',
  'Young Master - $25',
];

export default function BookingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Appointment booked successfully!');
        setFormData({ name: '', email: '', phone: '', service: '', date: '', time: '', notes: '' });
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-soft sm:p-8"
            style={{ maxHeight: 'calc(100vh - 3rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-semibold text-primary">Book Your Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#ded0bb] p-3 focus:border-accent focus:outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#ded0bb] p-3 focus:border-accent focus:outline-none"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#ded0bb] p-3 focus:border-accent focus:outline-none"
              />
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#ded0bb] p-3 focus:border-accent focus:outline-none"
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#ded0bb] p-3 focus:border-accent focus:outline-none"
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#ded0bb] p-3 focus:border-accent focus:outline-none"
              />
              <textarea
                name="notes"
                placeholder="Special requests (optional)"
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#ded0bb] p-3 focus:border-accent focus:outline-none"
                rows="3"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-primary transition hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-terracotta">{message}</p>}
            <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-primary">
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}