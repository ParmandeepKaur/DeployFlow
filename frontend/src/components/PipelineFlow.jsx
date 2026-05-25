import StatusBadge from './StatusBadge.jsx'

export default function PipelineFlow({ data }) {
  return (
    <div className="pipeline-flow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {data.steps.map((step, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 }}>
          <div style={{ padding: '0.75rem 1.25rem', borderRadius: '4px', backgroundColor: '#3498db', color: '#fff', minWidth: '120px', textAlign: 'center' }}>
            {step.name}
          </div>
          <StatusBadge status={step.status} />
          {index < data.steps.length - 1 && (
            <div style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', width: 80, height: '2px', backgroundColor: '#ccc' }} />
          )}
        </div>
      ))}
    </div>
  )
}