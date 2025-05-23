import React from 'react';
import './ProfilePage.css'; // This is for styling

const ProfilePage = () => {
  return (
    <div className="profile-container">
      <div className="cover-photo">
        <button className="edit-cover-btn">Edit Cover</button>
      </div>
      <div className="profile-header">
        <div className="profile-pic"></div>
        <button className="edit-profile-pic-btn">Edit</button>
        <div className="profile-info">
          <h2>Emmanuel Chiemelie</h2>
          <p>@EmmanuelFlame • Gospel Minister</p>
        </div>
      </div>
      <div className="nav-tabs">
        <button className="active">Posts</button>
        <button>About</button>
        <button>Media</button>
        <button>Followers</button>
        <button>Prayer Wall</button>
      </div>
      <div className="profile-content">
        <div className="post">
          <h4>🔥 Revival is Here!</h4>
          <p>The fire of God is moving on campus today. Join us at 6 PM.</p>
          <div className="actions">
            <span>Like</span>
            <span>Comment</span>
            <span>Share</span>
          </div>
        </div>
        <div className="post">
          <h4>Testimony Time</h4>
          <p>I got healed during the prayer session last week. Glory to God!</p>
          <div className="actions">
            <span>Like</span>
            <span>Comment</span>
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage
import ProfilePage from './ProfilePage';
