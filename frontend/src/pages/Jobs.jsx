import { useState, useEffect } from 'react';
import { getJobs, createJob, updateJob, deleteJob } from '../api/jobApi';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Plus, Pencil, Trash2, Search, Briefcase } from 'lucide-react';

const emptyForm = {
  title: '', description: '', department: '', location: '',
  employmentType: 'FULL_TIME', experienceLevel: 'MID', requiredSkills: '',
  salaryMin: '', salaryMax: '', status: 'DRAFT', deadline: '',
};

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchJobs = () => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    getJobs(params).then(({ data }) => setJobs(data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, [search, statusFilter]);

  const openCreate = () => { setEditingJob(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (job) => {
    setEditingJob(job);
    setForm({
      title: job.title, description: job.description || '', department: job.department || '',
      location: job.location || '', employmentType: job.employmentType || 'FULL_TIME',
      experienceLevel: job.experienceLevel || 'MID', requiredSkills: job.requiredSkills || '',
      salaryMin: job.salaryMin || '', salaryMax: job.salaryMax || '',
      status: job.status, deadline: job.deadline ? job.deadline.substring(0, 16) : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, salaryMin: form.salaryMin || null, salaryMax: form.salaryMax || null, deadline: form.deadline || null };
    try {
      if (editingJob) await updateJob(editingJob.id, payload);
      else await createJob(payload);
      setShowModal(false);
      fetchJobs();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    await deleteJob(id);
    fetchJobs();
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <>
      <div className="page-header">
        <h1>Jobs</h1>
        <p>Manage job postings and openings</p>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="filters">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
              <input className="form-input" style={{ paddingLeft: 32, width: 240 }}
                placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: 140 }} value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> New Job</button>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={48} />
            <h3>No jobs found</h3>
            <p>Create your first job posting to get started</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Department</th><th>Type</th><th>Level</th>
                <th>Status</th><th>Applications</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td style={{ fontWeight: 600 }}>{job.title}</td>
                  <td>{job.department || '—'}</td>
                  <td><StatusBadge status={job.employmentType} /></td>
                  <td><StatusBadge status={job.experienceLevel} /></td>
                  <td><StatusBadge status={job.status} /></td>
                  <td>{job.applicationCount}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(job)}><Pencil size={14} /></button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
        title={editingJob ? 'Edit Job' : 'Create New Job'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingJob ? 'Save Changes' : 'Create Job'}
            </button>
          </>
        }>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select className="form-select" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select className="form-select" value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
                <option value="ENTRY">Entry</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Required Skills (comma separated)</label>
            <input className="form-input" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Min Salary</label>
              <input className="form-input" type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Max Salary</label>
              <input className="form-input" type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="DRAFT">Draft</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input className="form-input" type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
