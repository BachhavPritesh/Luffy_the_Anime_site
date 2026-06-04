import mongoose from 'mongoose';

const streamCacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  cachedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

streamCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('StreamCache', streamCacheSchema);
