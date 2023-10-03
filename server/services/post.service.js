// services/post.service.js
const Post = require('../models/Post.model');

async function createPost(req, res) {
    try {
        const { title, content } = req.body;
        const author=req.user.email;
        const newPost = new Post({
            title,
            content,
            author,
        });
        await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while creating the post' });
    }
}

async function getPosts(req, res) {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).select('-__v');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching posts' });
    }
}


async function updatePost(req, res) {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { title, content },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the post' });
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.postId;
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully', post: deletedPost });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the post' });
    }
}

module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
};
