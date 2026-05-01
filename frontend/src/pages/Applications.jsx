import { useState, useEffect } from 'react';
import { getApplications, createApplication, updateApplicationStatus, deleteApplication } from '../api/applicationApi';
import { getJobs } from '../api/jobApi';
import { getCandidates } from '../api/candidateApi';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Plus, Trash2, FileText } from 'lucide-react';

const STATUSES = ['APPLIED','SCREENING','SHORTLISTED','INTERVIEW','OFFERED','HIRED','REJECTED'];

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ jobId: '', candidateId: '', coverLetter: '' });

  const fetchApps = () => {
    const params = statusFilter ? { status: statusFilter } : {};
    getApplications(params).then(({ data }) => setApps(data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); getJobs().then(r => setJobs(r.data)); getCandidates().then(r => setCandidates(r.data)); }, []);
  useEffect(() => { fetchApps(); }, [statusFilter]);

  const handleCreate = async () => {
    try {
      await createApplication({ jobId: parseInt(form.jobId), candidateId: parseInt(form.candidateId), coverLetter: form.coverLetter });
      setShowModal(false); fetchApps();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleStatus = async (id, status) => {
    await updateApplicationStatus(id, { status }); fetchApps();
  };

  const handleDelete = async (id) => { if (confirm('Delete?')) { await deleteApplication(id); fetchApps(); } };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header"><h1>Applications</h1><p>Track and manage candidate applications</p></div>
      <div className="table-container">
        <div className="table-toolbar">
          <div className="filters">
            <select className="form-select" style={{ width: 160 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => { setForm({ jobId: '', candidateId: '', coverLetter: '' }); setShowModal(true); }}><Plus size={18} /> New Application</button>
        </div>
        {apps.length === 0 ? (
          <div className="empty-state"><FileText size={48} /><h3>No applications</h3></div>
        ) : (
          <table><thead><tr><th>Candidate</th><th>Job</th><th>Status</th><th>Applied</th><th>Change Status</th><th>Actions</th></tr></thead>
            <tbody>{apps.map(a => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.candidateName}</td>
                <td>{a.jobTitle}</td>
                <td><StatusBadge status={a.status} /></td>
                <td>{a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : '—'}</td>
                <td>
                  <select className="status-select" value={a.status} onChange={(e) => handleStatus(a.id, e.target.value)}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}><Trash2 size={14} /></button></td>
              </tr>))}</tbody></table>
        )}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Application"
        footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCreate}>Create</button></>}>
        <div className="form-group"><label className="form-label">Job *</label>
          <select className="form-select" value={form.jobId} onChange={(e) => setForm({ ...form, jobId: e.target.value })}>
            <option value="">Select job</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select></div>
        <div className="form-group"><label className="form-label">Candidate *</label>
          <select className="form-select" value={form.candidateId} onChange={(e) => setForm({ ...form, candidateId: e.target.value })}>
            <option value="">Select candidate</option>{candidates.map(c => <option key={c.id} value={c.id}>{c.fullName} ({c.email})</option>)}
          </select></div>
        <div className="form-group"><label className="form-label">Cover Letter</label>
          <textarea className="form-textarea" value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} /></div>
      </Modal>
    </>
  );
}
