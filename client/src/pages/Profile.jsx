import { useSelector } from 'react-redux';
import { FiClock, FiFilm, FiHeart } from 'react-icons/fi';
import Badge from '../components/ui/Badge';

export default function Profile() {
  const { user } = useSelector((s) => s.auth);

  const stats = [
    { icon: FiFilm, label: 'Total Watched', value: '—' },
    { icon: FiClock, label: 'Hours Watched', value: '—' },
    { icon: FiHeart, label: 'Favorite Genre', value: '—' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-luffy-red/20 flex items-center justify-center text-luffy-red text-3xl font-bold font-display">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="font-display text-4xl text-luffy-text">{user?.username || 'User'}</h1>
          <p className="text-luffy-muted">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-6 border border-white/5">
            <stat.icon className="w-6 h-6 text-luffy-red mb-3" />
            <p className="text-2xl font-display text-luffy-text">{stat.value}</p>
            <p className="text-sm text-luffy-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl border border-white/5 p-6">
        <h2 className="font-display text-xl text-luffy-text mb-4">Account Settings</h2>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-luffy-muted">Email</span>
            <span className="text-luffy-text">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-luffy-muted">Username</span>
            <span className="text-luffy-text">{user?.username}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-luffy-muted">Member Since</span>
            <span className="text-luffy-text">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
