export const mockStats = {
  totalProjects: 12,
  pipelineStatus: 'Healthy',
  deploymentStatus: 'Stable',
  activeContainers: 5,
  lastDeployment: '2023-10-12 14:35',
  systemHealth: 'Good'
}

export const mockPipeline = {
  steps: [
    { name: 'GitHub', status: 'Success' },
    { name: 'Jenkins Triggered', status: 'Running' },
    { name: 'Docker Build', status: 'Warning' },
    { name: 'Deploy Container', status: 'Failed' },
    { name: 'Running', status: 'Failed' }
  ]
}

export const mockProjects = [
  { id: 1, name: 'Frontend Revamp', techStack: ['React', 'Vite'], deploymentStatus: 'Deployed', lastUpdated: '2023-10-10' },
  { id: 2, name: 'Backend API', techStack: ['Node.js', 'Express'], deploymentStatus: 'Pending', lastUpdated: '2023-10-11' },
  { id: 3, name: 'Mobile App', techStack: ['React Native'], deploymentStatus: 'Deployed', lastUpdated: '2023-10-09' },
]

export const mockDeployments = [
  { id: 1, appName: 'Frontend Revamp', environment: 'Production', port: 80, healthStatus: 'Healthy', deploymentTime: '2023-10-12 14:00', status: 'Success' },
  { id: 2, appName: 'Backend API', environment: 'Staging', port: 3000, healthStatus: 'Degraded', deploymentTime: '2023-10-11 16:30', status: 'Warning' },
  { id: 3, appName: 'Mobile App', environment: 'Development', port: 8081, healthStatus: 'Healthy', deploymentTime: '2023-10-10 10:15', status: 'Success' },
]

export const mockLogs = [
  { timestamp: '2023-10-12 14:35:21', level: 'INFO', message: 'Pipeline started.' },
  { timestamp: '2023-10-12 14:36:05', level: 'SUCCESS', message: 'Docker build completed.' },
  { timestamp: '2023-10-12 14:37:10', level: 'WARNING', message: 'Container restart delay.' },
  { timestamp: '2023-10-12 14:38:45', level: 'ERROR', message: 'Deployment failed: timeout.' },
  { timestamp: '2023-10-12 14:39:10', level: 'INFO', message: 'Pipeline ended.' },
]

export const mockEnvironments = [
  { name: 'Development', healthStatus: 'Healthy', uptime: '72h', deploymentsCount: 15 },
  { name: 'Staging', healthStatus: 'Warning', uptime: '48h', deploymentsCount: 10 },
  { name: 'Production', healthStatus: 'Healthy', uptime: '200h', deploymentsCount: 25 },
]

export const mockNotifications = [
  { type: 'Build Success', message: 'Frontend Revamp build succeeded.', time: '2023-10-12 14:35' },
  { type: 'Deployment Success', message: 'Backend API deployed to staging.', time: '2023-10-11 16:30' },
  { type: 'Pipeline Failed', message: 'Mobile App pipeline failed.', time: '2023-10-10 10:15' },
  { type: 'New Project', message: 'New project "Analytics Dashboard" created.', time: '2023-10-09 09:00' },
]