export default function StatsCard({ title, value, icon }) {
  return (
    <div className="stats-card">
      <div className="icon-container">{icon}</div>
      <div>
        <div className="title">{title}</div>
        <div className="value">{value}</div>
      </div>
    </div>
  )
}