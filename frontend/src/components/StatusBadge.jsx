const statusConfig = {
  OPEN: 'badge-green', CLOSED: 'badge-red', DRAFT: 'badge-gray',
  APPLIED: 'badge-blue', SCREENING: 'badge-cyan', SHORTLISTED: 'badge-purple',
  INTERVIEW: 'badge-yellow', OFFERED: 'badge-green', HIRED: 'badge-green',
  REJECTED: 'badge-red', PENDING: 'badge-yellow', PASSED: 'badge-green',
  FAILED: 'badge-red', FULL_TIME: 'badge-blue', PART_TIME: 'badge-purple',
  CONTRACT: 'badge-yellow', INTERNSHIP: 'badge-cyan',
  ENTRY: 'badge-green', MID: 'badge-blue', SENIOR: 'badge-purple', LEAD: 'badge-yellow',
  PHONE: 'badge-blue', VIDEO: 'badge-purple', ONSITE: 'badge-green', TECHNICAL: 'badge-yellow',
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  const cls = statusConfig[status] || 'badge-gray';
  const label = status.replace(/_/g, ' ');
  return <span className={`badge ${cls}`}>{label}</span>;
}
