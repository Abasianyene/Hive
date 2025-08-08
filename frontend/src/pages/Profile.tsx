import '../index.css'

const Profile = () => {
  return (
    <div>
      {/* Simple profile page */}
      <input type="file" onChange={handleAvatarUpload} />
      <img src={user.avatarUrl} alt="avatar" />
    </div>
  )
}

export default Profile