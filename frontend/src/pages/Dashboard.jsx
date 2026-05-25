import StatsCard from '../components/StatsCard.jsx'
import PipelineFlow from '../components/PipelineFlow.jsx'
import { mockStats, mockPipeline } from '../data/mockData.js'

export default function Dashboard() {
  return (
    <div className="dashboard-container" style={{ padding: '1.5rem' }}>
      {/* Top Stats Cards */}
      <div className="stats-row" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <StatsCard title="Total Projects" value={mockStats.totalProjects} icon="📁" />
        <StatsCard title="Pipeline Status" value={mockStats.pipelineStatus} icon="🔄" />
        <StatsCard title="Deployment Status" value={mockStats.deploymentStatus} icon="🚀" />
        <StatsCard title="Active Containers" value={mockStats.activeContainers} icon="🧱" />
        <StatsCard title="Last Deployment" value={mockStats.lastDeployment} icon="⏱️" />
        <StatsCard title="System Health" value={mockStats.systemHealth} icon="💖" />
      </div>

      {/* Pipeline Visualization */}
      <h2 style={{ marginBottom: '1rem' }}>Pipeline Flow</h2>
      <PipelineFlow data={mockPipeline} />
    </div>
  )
}