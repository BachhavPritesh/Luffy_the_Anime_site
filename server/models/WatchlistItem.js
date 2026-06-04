import mongoose from 'mongoose';

const watchlistItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  animeId: { type: Number, required: true },
  status: {
    type: String,
    enum: ['watching', 'planning', 'completed', 'dropped'],
    default: 'watching',
  },
  progress: { type: Number, default: 0 },
  score: { type: Number, min: 0, max: 10, default: null },
}, { timestamps: true });

watchlistItemSchema.index({ userId: 1, animeId: 1 }, { unique: true });

export default mongoose.model('WatchlistItem', watchlistItemSchema);
