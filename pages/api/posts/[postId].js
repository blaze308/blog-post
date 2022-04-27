import dbConnect from "../../../libs/dbConnect";
import Post from "../../../models/post.model";

export default async function handler(req, res) {
  const { method, body, query } = req;

  if (method === "GET") {
    const post = await Post.findById(query.postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ post });
  } else if (method === "PATCH") {
    let post = await Post.findById(query.postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }

    //finding and uploading the post
    post = await Post.findByIdAndUpdate(query.postId, body, { new: true });
    res.status(200).json({ post });
  } else if (method === "DELETE") {
    let post = await Post.findById(query.postId);
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    }
    await Post.findByIdAndDelete(query.postId);
    res.status(200).json({ msg: "Post deleted successfully" });
  }
}
