// AWS Service Icons - SVG definitions and metadata for Architecture Builder
// Each service has: id, name, category, color, emoji, and SVG icon path data

const AWS_SERVICES = {
  // ---- Compute ----
  ec2: {
    id: 'ec2', name: 'EC2', category: 'compute', color: '#FF9900', emoji: '🖥️',
    svg: '<rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="18" x2="8" y2="21" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="18" x2="16" y2="21" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="21" x2="19" y2="21" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'
  },
  lambda: {
    id: 'lambda', name: 'Lambda', category: 'compute', color: '#FF9900', emoji: '⚙️',
    svg: '<path d="M6 20 L10 4 L12 10 L16 4 L18 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 20 L20 20" stroke="currentColor" stroke-width="1.5"/>'
  },
  ecs: {
    id: 'ecs', name: 'ECS', category: 'compute', color: '#FF9900', emoji: '🐳',
    svg: '<rect x="3" y="8" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="13" y="8" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="3" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="15" width="8" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  asg: {
    id: 'asg', name: 'Auto Scaling', category: 'compute', color: '#FF9900', emoji: '🔄',
    svg: '<path d="M12 4 L20 12 L12 20 L4 12 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8 L16 12 L12 16 L8 12 Z" fill="currentColor" opacity="0.3"/><path d="M4 12 Q2 8 5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M20 12 Q22 16 19 19" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },
  elasticbeanstalk: {
    id: 'elasticbeanstalk', name: 'Elastic Beanstalk', category: 'compute', color: '#FF9900', emoji: '🎯',
    svg: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'
  },

  // ---- Storage ----
  s3: {
    id: 's3', name: 'S3', category: 'storage', color: '#3F8624', emoji: '📦',
    svg: '<path d="M12 3 L20 7 L20 17 L12 21 L4 17 L4 7 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 7 L12 11 L20 7" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="11" x2="12" y2="21" stroke="currentColor" stroke-width="1.5"/>'
  },
  ebs: {
    id: 'ebs', name: 'EBS', category: 'storage', color: '#3F8624', emoji: '💾',
    svg: '<ellipse cx="12" cy="7" rx="8" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 7 L4 17 Q4 20 12 20 Q20 20 20 17 L20 7" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  efs: {
    id: 'efs', name: 'EFS', category: 'storage', color: '#3F8624', emoji: '📁',
    svg: '<path d="M4 4 L12 4 L14 7 L20 7 L20 19 L4 19 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="15" x2="14" y2="15" stroke="currentColor" stroke-width="1.5"/>'
  },
  glacier: {
    id: 'glacier', name: 'Glacier', category: 'storage', color: '#3F8624', emoji: '❄️',
    svg: '<path d="M12 3 L20 18 L4 18 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="3" x2="12" y2="18" stroke="currentColor" stroke-width="1"/><line x1="7" y1="13" x2="17" y2="13" stroke="currentColor" stroke-width="1"/>'
  },

  // ---- Database ----
  rds: {
    id: 'rds', name: 'RDS', category: 'database', color: '#1A73E8', emoji: '🗃️',
    svg: '<ellipse cx="12" cy="6" rx="8" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 6 L4 18 Q4 21 12 21 Q20 21 20 18 L20 6" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/><line x1="4" y1="14" x2="20" y2="14" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>'
  },
  dynamodb: {
    id: 'dynamodb', name: 'DynamoDB', category: 'database', color: '#1A73E8', emoji: '⚡',
    svg: '<path d="M12 4 L4 8 L4 16 L12 20 L20 16 L20 8 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 8 L16 10 L16 14 L12 16 L8 14 L8 10 Z" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M14 6 L12 10 L10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },
  aurora: {
    id: 'aurora', name: 'Aurora', category: 'database', color: '#1A73E8', emoji: '🔷',
    svg: '<path d="M12 3 L15 8 L21 9 L17 14 L18 21 L12 18 L6 21 L7 14 L3 9 L9 8 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  elasticache: {
    id: 'elasticache', name: 'ElastiCache', category: 'database', color: '#1A73E8', emoji: '🔴',
    svg: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 12 Q12 8 16 12 Q12 16 8 12 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'
  },
  redshift: {
    id: 'redshift', name: 'Redshift', category: 'database', color: '#1A73E8', emoji: '📊',
    svg: '<ellipse cx="12" cy="8" rx="8" ry="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 8 L4 16 Q4 20 12 20 Q20 20 20 16 L20 8" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="17" x2="14" y2="17" stroke="currentColor" stroke-width="1.5"/>'
  },

  // ---- Networking ----
  cloudfront: {
    id: 'cloudfront', name: 'CloudFront', category: 'networking', color: '#8B5CF6', emoji: '🌐',
    svg: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 12 Q7 8 12 12 Q17 16 21 12" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 3 Q8 7 12 12 Q16 17 12 21" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  alb: {
    id: 'alb', name: 'App Load Balancer', category: 'networking', color: '#8B5CF6', emoji: '⚖️',
    svg: '<circle cx="12" cy="5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="19" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="19" cy="19" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="7.5" x2="5" y2="16.5" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="7.5" x2="19" y2="16.5" stroke="currentColor" stroke-width="1.5"/><line x1="5" y1="19" x2="19" y2="19" stroke="currentColor" stroke-width="1.5"/>'
  },
  nlb: {
    id: 'nlb', name: 'Network Load Balancer', category: 'networking', color: '#8B5CF6', emoji: '🔀',
    svg: '<rect x="4" y="5" width="16" height="5" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="14" width="16" height="5" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="10" x2="8" y2="14" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="10" x2="16" y2="14" stroke="currentColor" stroke-width="1.5"/>'
  },
  route53: {
    id: 'route53', name: 'Route 53', category: 'networking', color: '#8B5CF6', emoji: '🌍',
    svg: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 12 L21 12" stroke="currentColor" stroke-width="1.5"/><path d="M12 3 Q16 8 16 12 Q16 16 12 21" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 3 Q8 8 8 12 Q8 16 12 21" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  vpc: {
    id: 'vpc', name: 'VPC', category: 'networking', color: '#8B5CF6', emoji: '🔗',
    svg: '<rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/><rect x="7" y="7" width="10" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  igw: {
    id: 'igw', name: 'Internet Gateway', category: 'networking', color: '#8B5CF6', emoji: '🚪',
    svg: '<path d="M12 3 L21 12 L12 21 L3 12 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5"/>'
  },
  natgw: {
    id: 'natgw', name: 'NAT Gateway', category: 'networking', color: '#8B5CF6', emoji: '🔒',
    svg: '<rect x="4" y="8" width="16" height="8" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 12 L16 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M13 9.5 L16 12 L13 14.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  vpcendpoint: {
    id: 'vpcendpoint', name: 'VPC Endpoint', category: 'networking', color: '#8B5CF6', emoji: '🔌',
    svg: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="12" x2="8" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },

  // ---- Security ----
  iam: {
    id: 'iam', name: 'IAM', category: 'security', color: '#DC143C', emoji: '🔐',
    svg: '<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 20 Q5 14 12 14 Q19 14 19 20" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/>'
  },
  securitygroups: {
    id: 'securitygroups', name: 'Security Groups', category: 'security', color: '#DC143C', emoji: '🛡️',
    svg: '<path d="M12 3 L20 7 L20 13 Q20 18 12 21 Q4 18 4 13 L4 7 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 12 L11 14 L15 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  kms: {
    id: 'kms', name: 'KMS', category: 'security', color: '#DC143C', emoji: '🔑',
    svg: '<circle cx="9" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 14 L21 14 L21 17 L19 17 L19 20 L16 20 L16 17 L14 17 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  secretsmanager: {
    id: 'secretsmanager', name: 'Secrets Manager', category: 'security', color: '#DC143C', emoji: '🎫',
    svg: '<rect x="5" y="10" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 10 L8 7 Q8 3 12 3 Q16 3 16 7 L16 10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="15" r="2" fill="currentColor"/><line x1="12" y1="17" x2="12" y2="19" stroke="currentColor" stroke-width="1.5"/>'
  },
  cognito: {
    id: 'cognito', name: 'Cognito', category: 'security', color: '#DC143C', emoji: '👤',
    svg: '<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 21 Q5 15 12 15 Q19 15 19 21" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M17 3 L19 5 L17 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="15" y1="5" x2="19" y2="5" stroke="currentColor" stroke-width="1.5"/>'
  },
  waf: {
    id: 'waf', name: 'WAF', category: 'security', color: '#DC143C', emoji: '🔰',
    svg: '<path d="M12 3 L20 7 L20 13 Q20 18 12 21 Q4 18 4 13 L4 7 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="12" x2="15" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },

  // ---- Integration ----
  sqs: {
    id: 'sqs', name: 'SQS', category: 'integration', color: '#E87722', emoji: '📬',
    svg: '<rect x="3" y="7" width="18" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="11" x2="21" y2="11" stroke="currentColor" stroke-width="1" stroke-dasharray="2 1"/><circle cx="7" cy="9" r="1" fill="currentColor"/><circle cx="11" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/>'
  },
  sns: {
    id: 'sns', name: 'SNS', category: 'integration', color: '#E87722', emoji: '📢',
    svg: '<path d="M6 10 Q6 5 12 5 Q18 5 18 10 L18 14 L20 17 L4 17 L6 14 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="17" x2="10" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="14" y1="17" x2="14" y2="19" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="19" x2="14" y2="19" stroke="currentColor" stroke-width="1.5"/>'
  },
  kinesis: {
    id: 'kinesis', name: 'Kinesis', category: 'integration', color: '#E87722', emoji: '🌊',
    svg: '<path d="M3 8 Q7 4 12 8 Q17 12 21 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 12 Q7 8 12 12 Q17 16 21 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 16 Q7 12 12 16 Q17 20 21 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
  },
  eventbridge: {
    id: 'eventbridge', name: 'EventBridge', category: 'integration', color: '#E87722', emoji: '🔔',
    svg: '<path d="M12 3 L14 8 L20 8 L15 11 L17 17 L12 14 L7 17 L9 11 L4 8 L10 8 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  stepfunctions: {
    id: 'stepfunctions', name: 'Step Functions', category: 'integration', color: '#E87722', emoji: '🔗',
    svg: '<rect x="8" y="3" width="8" height="5" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="10" width="8" height="5" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="17" width="8" height="4" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="8" x2="12" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="15" x2="12" y2="17" stroke="currentColor" stroke-width="1.5"/>'
  },
  apigateway: {
    id: 'apigateway', name: 'API Gateway', category: 'integration', color: '#E87722', emoji: '🌐',
    svg: '<rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 12 L10 9 L10 15 Z" fill="currentColor"/><line x1="12" y1="9" x2="17" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="15" x2="17" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },

  // ---- Monitoring ----
  cloudwatch: {
    id: 'cloudwatch', name: 'CloudWatch', category: 'monitoring', color: '#E05D2B', emoji: '📈',
    svg: '<rect x="3" y="5" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><polyline points="6,14 9,10 12,13 15,8 18,11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="3" y1="19" x2="21" y2="19" stroke="currentColor" stroke-width="1.5"/>'
  },
  cloudtrail: {
    id: 'cloudtrail', name: 'CloudTrail', category: 'monitoring', color: '#E05D2B', emoji: '📝',
    svg: '<path d="M4 4 L20 4 L20 16 L16 20 L4 20 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="13" x2="13" y2="13" stroke="currentColor" stroke-width="1.5"/><path d="M16 16 L16 20 L20 16" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  awsconfig: {
    id: 'awsconfig', name: 'AWS Config', category: 'monitoring', color: '#E05D2B', emoji: '⚙️',
    svg: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 2 L12 5 M12 19 L12 22 M2 12 L5 12 M19 12 L22 12 M4.22 4.22 L6.34 6.34 M17.66 17.66 L19.78 19.78 M19.78 4.22 L17.66 6.34 M6.34 17.66 L4.22 19.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },

  // ---- Extra commonly-used services ----
  directconnect: {
    id: 'directconnect', name: 'Direct Connect', category: 'networking', color: '#8B5CF6', emoji: '🔌',
    svg: '<line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 8 L3 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M21 8 L21 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="12" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/>'
  },
  vpn: {
    id: 'vpn', name: 'VPN Gateway', category: 'networking', color: '#8B5CF6', emoji: '🔒',
    svg: '<rect x="5" y="10" width="14" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 10 L8 7 Q8 3 12 3 Q16 3 16 7 L16 10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 15 L10 18 L12 17 L14 18 L14 15 Q12 13 10 15 Z" fill="currentColor"/>'
  },
  elasticip: {
    id: 'elasticip', name: 'Elastic IP', category: 'networking', color: '#8B5CF6', emoji: '📌',
    svg: '<circle cx="12" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 16 L12 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><text x="12" y="12" text-anchor="middle" font-size="7" fill="currentColor" font-weight="bold">IP</text>'
  }
};

// Service categories for palette rendering
const SERVICE_CATEGORIES = [
  {
    id: 'compute',
    label: 'Compute',
    color: '#FF9900',
    services: ['ec2', 'lambda', 'ecs', 'asg', 'elasticbeanstalk']
  },
  {
    id: 'storage',
    label: 'Storage',
    color: '#3F8624',
    services: ['s3', 'ebs', 'efs', 'glacier']
  },
  {
    id: 'database',
    label: 'Database',
    color: '#1A73E8',
    services: ['rds', 'dynamodb', 'aurora', 'elasticache', 'redshift']
  },
  {
    id: 'networking',
    label: 'Networking',
    color: '#8B5CF6',
    services: ['cloudfront', 'alb', 'nlb', 'route53', 'vpc', 'igw', 'natgw', 'vpcendpoint', 'directconnect', 'vpn', 'elasticip']
  },
  {
    id: 'security',
    label: 'Security',
    color: '#DC143C',
    services: ['iam', 'securitygroups', 'kms', 'secretsmanager', 'cognito', 'waf']
  },
  {
    id: 'integration',
    label: 'Integration',
    color: '#E87722',
    services: ['sqs', 'sns', 'kinesis', 'eventbridge', 'stepfunctions', 'apigateway']
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    color: '#E05D2B',
    services: ['cloudwatch', 'cloudtrail', 'awsconfig']
  }
];

/**
 * Render a service icon as an SVG element
 * @param {string} serviceId
 * @param {number} size - icon size in pixels
 * @returns {string} HTML string
 */
function renderServiceIcon(serviceId, size) {
  const svc = AWS_SERVICES[serviceId];
  if (!svc) return '';
  const s = size || 36;
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="color:${svc.color}" aria-label="${svc.name}">${svc.svg}</svg>`;
}
