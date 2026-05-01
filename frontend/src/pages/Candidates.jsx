import { useState, useEffect } from 'react';
import { getCandidates, createCandidate, updateCandidate, deleteCandidate, uploadResume } from '../api/candidateApi';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Search, Upload, Users, FileDown } from 'lucide-react';

const emptyForm = { fullName: '', email: '', phone: '', skills: '', experienceYears: '' };

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skill, setSkill] = useState('');
  const [minExp, setMinExp] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCandidates = () => {
    const params = {};
    if (skill) params.skill = skill;
    if (minExp) params.minExperience = minExp;
    getCandidates(params).then(({ data }) => setCandidates(data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCandidates(); }, [skill, minExp]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ fullName: c.fullName, email: c.email, phone: c.phone || '', skills: c.skills || '', experienceYears: c.experienceYears || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, experienceYears: form.experienceYears ? parseInt(form.experienceYears) : null };
    try {
      if (editing) await updateCandidate(editing.id, payload);
      else await createCandidate(payload);
      setShowModal(false); fetchCandidates();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleResume = async (id) => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.pdf';
    input.onchange = async (e) => {
      if (!e.target.files[0]) return;
      try { await uploadResume(id, e.target.files[0]); fetchCandidates(); } catch { alert('Upload failed'); }
    };
    input.click();
  };

  const handleDelete = async (id) => { if (confirm('Delete?')) { await deleteCandidate(id); fetchCandidates(); } };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header"><h1>Candidates</h1><p>Manage candidate pool and resumes</p></div>
      <div className="table-container">
        <div className="table-toolbar">
          <div className="filters">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
              <input className="form-input" style={{ paddingLeft: 32, width: 200 }} placeholder="Filter by skill..." value={skill} onChange={(e) => setSkill(e.target.value)} />
            </div>
            <input className="form-input" style={{ width: 140 }} type="number" placeholder="Min exp" value={minExp} onChange={(e) => setMinExp(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add Candidate</button>
        </div>
        {candidates.length === 0 ? (
          <div className="empty-state"><Users size={48} /><h3>No candidates</h3></div>
        ) : (
          <table><thead><tr><th>Name</th><th>Email</th><th>Skills</th><th>Exp</th><th>Resume</th><th>Actions</th></tr></thead>
            <tbody>{candidates.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.fullName}</td><td>{c.email}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.skills || '—'}</td>
                <td>{c.experienceYears != null ? `${c.experienceYears}y` : '—'}</td>
                <td>{c.resumePath ? <a href={`http://localhost:8080/api/candidates/${c.id}/resume`} className="btn btn-sm btn-secondary" target="_blank"><FileDown size={14} /></a> : <button className="btn btn-sm btn-secondary" onClick={() => handleResume(c.id)}><Upload size={14} /></button>}</td>
                <td><div className="actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => handleResume(c.id)}><Upload size={14} /></button>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                </div></td>
              </tr>))}</tbody></table>
        )}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Candidate' : 'Add Candidate'}
        footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSubmit}>{editing ? 'Save' : 'Add'}</button></>}>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Skills</label><input className="form-input" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Experience (years)</label><input className="form-input" type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} /></div>
        </form>
      </Modal>
    </>
  );
}
