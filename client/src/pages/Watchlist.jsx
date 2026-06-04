import { useState } from 'react';
import { WATCHLIST_STATUS } from '../utils/constants';
import { FiTrash2 } from 'react-icons/fi';

const tabs = Object.entries(WATCHLIST_STATUS);

export default function Watchlist() {
  const [activeTab, setActiveTab] = useState('watching');
  const [items] = useState([]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8">
      <h1 className="font-display text-4xl md:text-5xl text-luffy-text mb-6">Watchlist</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded text-sm font-medium transition-all cursor-pointer ${
              activeTab === key
                ? 'bg-luffy-red text-white'
                : 'bg-luffy-surface2 text-luffy-muted hover:text-luffy-text border border-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-luffy-faint border border-dashed border-white/5 rounded">
          <p className="text-lg mb-1">No anime in this list</p>
          <p className="text-sm">Add anime to your watchlist from their detail page</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.animeId} className="flex items-center gap-4 p-4 glass rounded border border-white/5">
              <div className="flex-1">
                <p className="text-luffy-text font-medium">Anime #{item.animeId}</p>
              </div>
              <button className="p-2 text-luffy-faint hover:text-luffy-red transition-colors cursor-pointer">
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
