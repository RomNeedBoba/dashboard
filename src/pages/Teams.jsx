import React, { useState } from 'react';
import { Mail, ChevronDown, MoreVertical, ArrowLeft, Users, Lock, Eye, Crown, X, Copy, Check } from 'lucide-react';
import '../theme/pages/Team.css';

const TeamSettings = () => {
  const [emailInput, setEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('Annotator');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState('Name');
  const [allowDiscovery, setAllowDiscovery] = useState(true);
  const [inviteLink] = useState('https://app.roboflow.com/join/eyJhb2iG1i01J3IUzI1NiIsInR5cCI6Ikp...');
  const [copied, setCopied] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    { 
      id: 1,
      name: 'Pichphyrom', 
      email: 'rinpichphyrom1208@gmail.com', 
      role: 'Creator',
      isCreator: true 
    },
    { 
      id: 2,
      name: 'Svay Monirath', 
      email: 'monirath.svay@student.cadt.edu.kh', 
      role: 'Admin',
      isCreator: false 
    }
  ]);
  const [invitesAvailable] = useState(1);

  const roles = [
    { name: 'Admin', icon: Crown, description: 'Full access to workspace' },
    { name: 'Annotator', icon: Users, description: 'Can create and edit annotations' },
    { name: 'Reviewer', icon: Eye, description: 'Can review and approve annotations' }
  ];

  const handleSendInvite = () => {
    if (!emailInput.trim()) return;
    
    const emails = emailInput.split(',').map(e => e.trim()).filter(e => e);
    
    console.log('Sending invites to:', emails, 'with role:', selectedRole);
    alert(`Invitation sent to ${emails.join(', ')} as ${selectedRole}(s)`);
    setEmailInput('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    }
  };

  const handleChangeRole = (memberId, newRole) => {
    setTeamMembers(teamMembers.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
  };

  const sortedMembers = [...teamMembers].sort((a, b) => {
    if (sortBy === 'Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Role') return a.role.localeCompare(b.role);
    return 0;
  });

  return (
    <div className="team-settings-container">
      <div className="team-settings-wrapper">
        {/* Header */}
        <div className="team-settings-header">
          <button className="back-button">
            <ArrowLeft className="icon-md" />
          </button>
          <h1 className="team-settings-title">Team Settings</h1>
        </div>

        {/* Team Members Section */}
        <div className="team-settings-card">
          <div className="section-header">
            <h2 className="section-title">Team Members</h2>
            <p className="section-description">Invite your team to give them access to projects in this workspace.</p>
          </div>

          {/* Invite Section */}
          <div className="invite-section">
            <div className="invite-counter">
              <Mail className="icon-sm" />
              <span className="invite-counter-text">{invitesAvailable} invite(s) available</span>
            </div>

            {/* Email Input */}
            <div className="input-row">
              <input
                type="text"
                placeholder="joe@gmail.com, sara@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="email-input"
              />
              
              {/* Role Dropdown */}
              <div className="dropdown-container">
                <button
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className="dropdown-button"
                >
                  <span>{selectedRole}</span>
                  <ChevronDown className="icon-sm" />
                </button>
                
                {showRoleDropdown && (
                  <div className="dropdown-menu">
                    {roles.map((role) => (
                      <button
                        key={role.name}
                        onClick={() => {
                          setSelectedRole(role.name);
                          setShowRoleDropdown(false);
                        }}
                        className="dropdown-item"
                      >
                        <role.icon className="icon-md" />
                        <div className="dropdown-item-content">
                          <div className="dropdown-item-title">
                            {role.name}
                            {role.name === 'Reviewer' && (
                              <Lock className="icon-sm" />
                            )}
                          </div>
                          <div className="dropdown-item-description">{role.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendInvite}
                className="send-invite-button"
              >
                <Mail className="icon-sm" />
                Send Invite
              </button>
            </div>

            {/* Invite Link */}
            <div className="invite-link-section">
              <label className="invite-link-label">Or share an invite link:</label>
              <div className="invite-link-row">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="invite-link-input"
                />
                <button
                  onClick={handleCopyLink}
                  className={`copy-button ${copied ? 'copied' : ''}`}
                >
                  {copied ? (
                    <>
                      <Check className="icon-sm" />
                      <span className="copy-button-text">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="icon-sm" />
                      <span className="copy-button-text">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Discovery Checkbox */}
            <label className="discovery-checkbox-container">
              <input
                type="checkbox"
                checked={allowDiscovery}
                onChange={(e) => setAllowDiscovery(e.target.checked)}
                className="discovery-checkbox"
              />
              <span className="discovery-label">
                Allow verified <span className="discovery-domain">@gmail.com</span> emails to discover and ask to join this workspace
              </span>
            </label>
          </div>

          {/* Team Members List */}
          <div>
            <div className="members-list-header">
              <h3 className="members-list-title">Team Members with Access</h3>
              
              {/* Sort Dropdown */}
              <div className="sort-dropdown">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="sort-button"
                >
                  <span>Sort by {sortBy}</span>
                  <ChevronDown className="icon-sm" />
                </button>
                
                {showSortDropdown && (
                  <div className="sort-menu">
                    {['Name', 'Role', 'Email'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortDropdown(false);
                        }}
                        className="sort-option"
                      >
                        Sort by {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Members Table */}
            <div className="members-table-container">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMembers.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="member-info">
                          <div className="member-name">{member.name}</div>
                          <div className="member-email">{member.email}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${member.role.toLowerCase()}`}>
                          {member.role}
                        </span>
                      </td>
                      <td>
                        {!member.isCreator && (
                          <div className="member-actions">
                            <select
                              value={member.role}
                              onChange={(e) => handleChangeRole(member.id, e.target.value)}
                              className="role-select"
                            >
                              <option value="Admin">Admin</option>
                              <option value="Annotator">Annotator</option>
                              <option value="Reviewer">Reviewer</option>
                            </select>
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="remove-button"
                              title="Remove member"
                            >
                              <X className="icon-md" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSettings;