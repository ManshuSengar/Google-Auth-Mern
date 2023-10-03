const { authUser } = require("./services/auth.service");
const { updatePost, deletePost, createPost, getPosts } = require("./services/post.service");
const { authorizeUserMiddleware } = require("./middleware/auth.middleware");

module.exports = (app) => {
    app.post("/auth", authUser);
    app.post('/posts', authorizeUserMiddleware, createPost);
    app.get('/posts',authorizeUserMiddleware, getPosts);
    app.put('/posts/:postId', authorizeUserMiddleware, updatePost);
    app.delete('/posts/:postId', authorizeUserMiddleware, deletePost);
}
