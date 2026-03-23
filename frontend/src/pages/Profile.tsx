import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera, Save } from "lucide-react";
import { apiRequest } from "../lib/api";
import { getStoredSession, updateStoredUser, type SessionUser } from "../lib/session";

function Profile() {
  const session = getStoredSession();
  const [form, setForm] = useState<SessionUser>({
    id: session?.user.id || "",
    username: session?.user.username || "",
    email: session?.user.email || "",
    avatarUrl: session?.user.avatarUrl || "",
    bio: session?.user.bio || "",
  });
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!session?.token) {
      return;
    }

    apiRequest<{ user: SessionUser }>("/api/profile", {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    })
      .then((result) => {
        setForm(result.user);
        updateStoredUser(result.user);
      })
      .catch(() => {
        setForm((current) => current);
      });
  }, [session?.token]);

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        avatarUrl: String(reader.result || ""),
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session?.token) {
      setMessage("Log in to save profile changes.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const result = await apiRequest<{ user: SessionUser }>("/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          username: form.username,
          bio: form.bio,
          avatarUrl: form.avatarUrl,
        }),
      });

      setForm(result.user);
      updateStoredUser(result.user);
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="profile-layout">
      <article className="page-card profile-hero">
        <div className="profile-hero__body">
          <div className="profile-hero__avatar">
            {form.avatarUrl ? <img src={form.avatarUrl} alt={form.username || "Profile"} /> : <Camera size={26} />}
          </div>
          <div className="profile-hero__copy">
            <span className="eyebrow">Profile studio</span>
            <h1>{form.username || "Guest profile"}</h1>
            <p>{form.bio || "Add a short bio so people know what you are working on."}</p>
            <div className="profile-hero__chips">
              <span>{form.email || "No email"}</span>
              <span>Account synced</span>
            </div>
          </div>
        </div>
        <div className="profile-hero__aside">
          <strong>Personal brand</strong>
          <p>Keep your avatar, bio, and display name aligned so the rest of the app feels consistent.</p>
        </div>
      </article>

      <form className="page-card profile-form" onSubmit={handleSubmit}>
        <div className="profile-form__row">
          <label>
            <span>Username</span>
            <input
              type="text"
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              required
            />
          </label>

          <label>
            <span>Email</span>
            <input type="email" value={form.email} disabled />
          </label>
        </div>

        <label>
          <span>Bio</span>
          <textarea
            rows={4}
            value={form.bio || ""}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
            placeholder="What are you building right now?"
          />
        </label>

        <label className="file-input">
          <span>Avatar image</span>
          <input type="file" accept="image/*" onChange={handleAvatarUpload} />
        </label>

        <div className="profile-form__actions">
          <button type="submit" className="primary-button" disabled={isSaving}>
            <Save size={16} />
            {isSaving ? "Saving..." : "Save profile"}
          </button>
          {message ? <p className="form-message">{message}</p> : null}
        </div>
      </form>
    </section>
  );
}

export default Profile;
