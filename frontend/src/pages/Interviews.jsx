import { useState, useEffect } from 'react';
import { getInterviews, createInterview, deleteInterview, updateFeedback } from '../api/interviewApi';
import { getApplications } from '../api/applicationApi';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Plus, Trash2, Calendar, MessageSquare } from 'lucide-react';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(null);
  const [form, setForm] = useState({ applicationId: '', scheduledAt: '', interviewType: 'VIDEO', interviewerName: '' });
  const [feedback, setFeedback] = useState({ feedback: '', result: 'PENDING' });

  const fetchInterviews = () => {
    getInterviews().then(({ data }) => setInterviews(data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchInterviews(); getApplications().then(r => setApplications(r.data)); }, []);

  const handleCreate = async () => {
    try {
      await createInterview({ ...form, applicationId: parseInt(form.applicationId) });
      setShowModal(false); fetchInterviews();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleFeedback = async () => {
    await updateFeedback(showFeedback.id, feedback.feedback, feedback.result);
    setShowFeedback(null); fetchInterviews();
  };

  const handleDelete = async (id) => { if (confirm('Delete?')) { await deleteInterview(id); fetchInterviews(); } };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header"><h1>Interviews</h1><p>Schedule and manage interviews</p></div>
      <div className="table-container">
        <div className="table-toolbar">
          <div className="filters" />
          <button className="btn btn-primary" onClick={() => { setForm({ applicationId: '', scheduledAt: '', interviewType: 'VIDEO', interviewerName: '' }); setShowModal(true); }}><Plus size={18} /> Schedule Interview</button>
        </div>
        {interviews.length === 0 ? (
          <div className="empty-state"><Calendar size={48} /><h3>No interviews</h3></div>
        ) : (
          <table><thead><tr><th>Candidate</th><th>Job</th><th>Date</th><th>Type</th><th>Interviewer</th><th>Result</th><th>Actions</th></tr></thead>
            <tbody>{interviews.map(i => (
              <tr key={i.id}>
                <td style={{ fontWeight: 600 }}>{i.candidateName}</td>
                <td>{i.jobTitle}</td>
                <td>{i.scheduledAt ? new Date(i.scheduledAt).toLocaleString() : '—'}</td>
                <td><StatusBadge status={i.interviewType} /></td>
                <td>{i.interviewerName || '—'}</td>
                <td><StatusBadge status={i.result} /></td>
                <td><div className="actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => { setShowFeedback(i); setFeedback({ feedback: i.feedback || '', result: i.result || 'PENDING' }); }}><MessageSquare size={14} /></button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(i.id)}><Trash2 size={14} /></button>
                </div></td>
              </tr>))}</tbody></table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule Interview"
        footer={<><button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCreate}>Schedule</button></>}>
        <div className="form-group"><label className="form-label">Application *</label>
          <select className="form-select" value={form.applicationId} onChange={(e) => setForm({ ...form, applicationId: e.target.value })}>
            <option value="">Select</option>{applications.map(a => <option key={a.id} value={a.id}>{a.candidateName} — {a.jobTitle}</option>)}
          </select></div>
        <div className="form-group"><label className="form-label">Date & Time *</label>
          <input className="form-input" type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} /></div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Type</label>
            <select className="form-select" value={form.interviewType} onChange={(e) => setForm({ ...form, interviewType: e.target.value })}>
              <option value="PHONE">Phone</option><option value="VIDEO">Video</option><option value="ONSITE">Onsite</option><option value="TECHNICAL">Technical</option>
            </select></div>
          <div className="form-group"><label className="form-label">Interviewer</label>
            <input className="form-input" value={form.interviewerName} onChange={(e) => setForm({ ...form, interviewerName: e.target.value })} /></div>
        </div>
      </Modal>

      <Modal isOpen={!!showFeedback} onClose={() => setShowFeedback(null)} title="Interview Feedback"
        footer={<><button className="btn btn-secondary" onClick={() => setShowFeedback(null)}>Cancel</button><button className="btn btn-primary" onClick={handleFeedback}>Save</button></>}>
        <div className="form-group"><label className="form-label">Feedback</label>
          <textarea className="form-textarea" value={feedback.feedback} onChange={(e) => setFeedback({ ...feedback, feedback: e.target.value })} /></div>
        <div className="form-group"><label className="form-label">Result</label>
          <select className="form-select" value={feedback.result} onChange={(e) => setFeedback({ ...feedback, result: e.target.value })}>
            <option value="PENDING">Pending</option><option value="PASSED">Passed</option><option value="FAILED">Failed</option>
          </select></div>
      </Modal>
    </>
  );
}
