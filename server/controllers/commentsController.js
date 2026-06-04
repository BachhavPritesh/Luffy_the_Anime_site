import Comment from '../models/Comment.js';

export async function getComments(req, res) {
  try {
    const comments = await Comment.find({ animeId: req.params.animeId })
      .populate('userId', 'username avatar')
      .sort('-createdAt');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createComment(req, res) {
  try {
    const comment = await Comment.create({
      userId: req.user._id,
      animeId: req.params.animeId,
      text: req.body.text,
      parentId: req.body.parentId || null,
    });
    const populated = await comment.populate('userId', 'username avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateComment(req, res) {
  try {
    const comment = await Comment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!comment) return res.status(404).json({ message: 'Not found' });
    comment.text = req.body.text;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteComment(req, res) {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!comment) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
