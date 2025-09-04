import React, { useContext, useState, useEffect } from 'react';
import './profile.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { user, setUser, url, token } = useContext(StoreContext) || {};

  // Edit states
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Sync name state whenever user changes
  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

  // Update name
  const handleUpdateName = async () => {
    if (!name.trim()) return toast.error("Name cannot be empty");

    try {
      const res = await axios.put(
        `${url}/api/user/update`,
        { name },
        { headers: { token } }
      );

      if (res.data.success) {
        setUser({ ...user, name });
        setEditingName(false);
        toast.success("Name updated!");
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error updating name");
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!oldPassword || !password) return toast.error("Both fields are required");

    try {
      const res = await axios.put(
        `${url}/api/user/update-password`,
        { oldPassword, newPassword: password },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Password updated successfully");
        setEditingPassword(false);
        setOldPassword('');
        setPassword('');
        setPasswordMsg('');
      } else {
        setPasswordMsg(res.data.message || "Update failed");
        toast.error(res.data.message || "Failed to update password");
      }
    } catch (err) {
      setPasswordMsg("Error updating password");
      toast.error("Error updating password");
    }
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="profile-card">
        <img
          src={`https://ui-avatars.com/api/?name=${user?.name || 'Guest'}`}
          alt="Profile"
          className="profile-avatar"
        />
        <div className="profile-info">

          {/* Name */}
          <div className="profile-field">
            <b>Name:</b>
            {editingName ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <button onClick={handleUpdateName}>Save</button>
                <button onClick={() => { setEditingName(false); setName(user?.name || ''); }}>Cancel</button>
              </>
            ) : (
              <>
                <span> {user?.name || 'Guest'} </span>
                <button onClick={() => setEditingName(true)}>Edit</button>
              </>
            )}
          </div>

          {/* Password */}
          <div className="profile-field">
            <b>Password:</b>
            {editingPassword ? (
              <>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder="Old password"
                />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="New password"
                />
                <button onClick={handleUpdatePassword}>Save</button>
                <button onClick={() => { 
                  setEditingPassword(false); 
                  setOldPassword(''); 
                  setPassword(''); 
                  setPasswordMsg(''); 
                }}>Cancel</button>
                {passwordMsg && <span className="password-msg">{passwordMsg}</span>}
              </>
            ) : (
              <>
                <span> ******* </span>
                <button onClick={() => setEditingPassword(true)}>Edit</button>
              </>
            )}
          </div>

          {/* Email */}
          <p className="profile-field"><b>Email:</b> {user?.email || "Not available"}</p>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;
