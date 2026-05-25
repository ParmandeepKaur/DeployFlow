// src/pages/Pipelines.jsx
import { mockPipeline } from '../data/mockData.js'
import PipelineFlow from '../components/PipelineFlow.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

export default function Pipelines() {
  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Pipeline Details</h2>
      
      {/* Mock pipeline steps */}
      <PipelineFlow data={mockPipeline} />

      {/* Additional info or logs can be added here in the future */}
    </div>
  )
}