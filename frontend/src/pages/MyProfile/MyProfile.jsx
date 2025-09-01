import React, { useContext, useState } from 'react'
import './profile.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const { user, setUser, url, token } = useContext(StoreContext) || {};
  const [editingName, setEditingName] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const handleUpdateName = async () => {
    try {
      const response = await axios.put(
        `${url}/api/user/update`,
        { name },
        { headers: { token } }
      );
      if (response.data.success) {
        setUser({ ...user, name });
        setEditingName(false);
        toast.success("Name updated!");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Error updating name");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await axios.put(
        `${url}/api/user/update-password`,
        { oldPassword, newPassword: password },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Password updated successfully");
        setEditingPassword(false);
        setPassword("");
        setOldPassword("");
        setPasswordMsg("Password updated!");
      } else {
        setPasswordMsg(response.data.message || "Update failed");
        toast.error(response.data.message || "Failed to update password");
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
          src="https://ui-avatars.com/api/?name=User"
          alt="Profile"
          className="profile-avatar"
        />
        <div className="profile-info">
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
                <button onClick={() => { setEditingName(false); setName(user?.name || ""); }}>Cancel</button>
              </>
            ) : (
              <>
                <span> {user?.name || "Guest"}</span>
                <button onClick={() => setEditingName(true)}>Edit</button>
              </>
            )}
          </div>
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
                <button onClick={() => { setEditingPassword(false); setPassword(""); setOldPassword(""); setPasswordMsg(""); }}>Cancel</button>
                {passwordMsg && <span className="password-msg">{passwordMsg}</span>}
              </>
            ) : (
              <>
                <span> ****** </span>
                <button onClick={() => setEditingPassword(true)}>Edit</button>
              </>
            )}
          </div>
          
          <p className='profile-field'><b>Email:</b> {user?.email || "Not available"}</p>
        </div>
      </div>
    </div>
  )
}

export default MyProfile