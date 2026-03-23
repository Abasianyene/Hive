import { useState, type FormEvent } from "react";
import { Heart, MessageSquareText, Sparkles } from "lucide-react";
import { getStoredSession } from "../lib/session";

type Post = {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: Array<{ user: string; text: string }>;
};

const starterPosts: Post[] = [
  {
    id: 1,
    user: {
      name: "Jane Doe",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    time: "2 hours ago",
    content: "Spent the afternoon planning our next community meetup and tightening the deployment checklist.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    likes: 24,
    comments: [{ user: "John Smith", text: "Looks solid. Share the invite when ready." }],
  },
  {
    id: 2,
    user: {
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    time: "5 hours ago",
    content: "The new build is finally clean. Next step is getting production env variables in place.",
    likes: 16,
    comments: [],
  },
];

function HomePage() {
  const session = getStoredSession();
  const [posts, setPosts] = useState(starterPosts);
  const [newPost, setNewPost] = useState("");

  const handlePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newPost.trim()) {
      return;
    }

    setPosts((current) => [
      {
        id: Date.now(),
        user: {
          name: session?.user.username || "You",
          avatar:
            session?.user.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg",
        },
        time: "Just now",
        content: newPost.trim(),
        likes: 0,
        comments: [],
      },
      ...current,
    ]);

    setNewPost("");
  };

  return (
    <section className="feed-layout">
      <div className="feed-column">
        <article className="page-card hero-card">
          <div>
            <span className="eyebrow">
              <Sparkles size={16} />
              Deployment audit complete
            </span>
            <h1>Welcome back to Hive</h1>
            <p>
              The core flow now supports sign-in, profile updates, messaging, and a single deployment target instead of a
              split dev-only service setup.
            </p>
          </div>
        </article>

        <article className="page-card composer-card">
          <div className="composer-card__header">
            <img
              src={session?.user.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg"}
              alt={session?.user.username || "Your avatar"}
            />
            <div>
              <strong>{session?.user.username || "Guest user"}</strong>
              <span>Share a quick project update</span>
            </div>
          </div>

          <form onSubmit={handlePost} className="composer-form">
            <textarea
              value={newPost}
              onChange={(event) => setNewPost(event.target.value)}
              placeholder="What changed today?"
              rows={4}
            />
            <div className="composer-form__footer">
              <span>Keep it concise. The feed is optimized for status updates and community highlights.</span>
              <button type="submit" className="primary-button">
                Publish update
              </button>
            </div>
          </form>
        </article>

        {posts.map((post) => (
          <article key={post.id} className="page-card feed-post">
            <div className="feed-post__header">
              <img src={post.user.avatar} alt={post.user.name} />
              <div>
                <strong>{post.user.name}</strong>
                <span>{post.time}</span>
              </div>
            </div>

            <p>{post.content}</p>

            {post.image ? <img src={post.image} alt="Post illustration" className="feed-post__image" /> : null}

            <div className="feed-post__stats">
              <span>
                <Heart size={16} />
                {post.likes} likes
              </span>
              <span>
                <MessageSquareText size={16} />
                {post.comments.length} comments
              </span>
            </div>

            {post.comments.length ? (
              <div className="feed-post__comments">
                {post.comments.map((comment, index) => (
                  <div key={`${post.id}-${index}`}>
                    <strong>{comment.user}</strong>
                    <span>{comment.text}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomePage;
