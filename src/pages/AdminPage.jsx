import { Link } from 'react-router-dom';
import AdminPanel from '../components/AdminPanel';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link to="/" className="text-lg font-semibold text-primary font-serif tracking-wide sm:text-xl">
          New Janta Hair Saloon
        </Link>
        <Link
          to="/"
          className="rounded-full bg-[#f6f1e8] px-4 py-2 text-sm font-semibold text-primary transition hover:bg-[#ece4d6]"
        >
          Back to site
        </Link>
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-6 sm:px-8 lg:px-12">
        <AdminPanel />
      </main>
    </div>
  );
}
