import WatchlistItem from '../models/WatchlistItem.js';

export async function getFavorites(req, res) {
  try {
    const items = await WatchlistItem.find({ userId: req.user._id, status: 'completed' }).sort('-updatedAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addFavorite(req, res) {
  try {
    const item = await WatchlistItem.findOneAndUpdate(
      { userId: req.user._id, animeId: req.params.animeId },
      { status: 'completed', userId: req.user._id, animeId: req.params.animeId },
      { upsert: true, new: true }
    );
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function removeFavorite(req, res) {
  try {
    await WatchlistItem.findOneAndDelete({ userId: req.user._id, animeId: req.params.animeId });
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getWatchlist(req, res) {
  try {
    const items = await WatchlistItem.find({ userId: req.user._id }).sort('-updatedAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addToWatchlist(req, res) {
  try {
    const { animeId, status } = req.body;
    const item = await WatchlistItem.findOneAndUpdate(
      { userId: req.user._id, animeId },
      { userId: req.user._id, animeId, status: status || 'watching' },
      { upsert: true, new: true }
    );
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateWatchlistItem(req, res) {
  try {
    const item = await WatchlistItem.findOneAndUpdate(
      { userId: req.user._id, animeId: req.params.animeId },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function removeFromWatchlist(req, res) {
  try {
    await WatchlistItem.findOneAndDelete({ userId: req.user._id, animeId: req.params.animeId });
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getHistory(req, res) {
  try {
    const items = await WatchlistItem.find({ userId: req.user._id, progress: { $gt: 0 } })
      .sort('-updatedAt')
      .limit(20);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
