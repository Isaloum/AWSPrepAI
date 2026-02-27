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
  },

  // ---- Additional Compute ----
  eks: {
    id: 'eks', name: 'Amazon EKS', category: 'compute', color: '#FF9900', emoji: '☸️',
    svg: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="3" x2="12" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="15" x2="12" y2="21" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.5"/>'
  },
  fargate: {
    id: 'fargate', name: 'AWS Fargate', category: 'compute', color: '#FF9900', emoji: '📦',
    svg: '<rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="8" y="8" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="12" x2="8" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="16" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="1.5"/>'
  },
  batch: {
    id: 'batch', name: 'AWS Batch', category: 'compute', color: '#FF9900', emoji: '📋',
    svg: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="9" x2="17" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="15" x2="12" y2="15" stroke="currentColor" stroke-width="1.5"/>'
  },
  lightsail: {
    id: 'lightsail', name: 'Amazon Lightsail', category: 'compute', color: '#FF9900', emoji: '⛵',
    svg: '<path d="M12 4 L18 16 L6 16 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 4 L12 16" stroke="currentColor" stroke-width="1.5"/><path d="M4 18 L20 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  apprunner: {
    id: 'apprunner', name: 'AWS App Runner', category: 'compute', color: '#FF9900', emoji: '🚀',
    svg: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 8 L16 12 L9 16 Z" fill="currentColor"/>'
  },
  outposts: {
    id: 'outposts', name: 'AWS Outposts', category: 'compute', color: '#FF9900', emoji: '🏭',
    svg: '<rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="7" y="7" width="5" height="10" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="14" y="7" width="3" height="5" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="14" y="14" width="3" height="3" fill="currentColor" opacity="0.5"/>'
  },

  // ---- Additional Storage ----
  fsx: {
    id: 'fsx', name: 'Amazon FSx', category: 'storage', color: '#3F8624', emoji: '🗂️',
    svg: '<path d="M4 4 L12 4 L14 7 L20 7 L20 20 L4 20 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="17" x2="12" y2="17" stroke="currentColor" stroke-width="1.5"/>'
  },
  datasync: {
    id: 'datasync', name: 'AWS DataSync', category: 'storage', color: '#3F8624', emoji: '🔄',
    svg: '<path d="M5 12 Q5 6 12 6 Q17 6 18 11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15 9 L18 11 L16 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 12 Q19 18 12 18 Q7 18 6 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M9 15 L6 13 L8 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  snowball: {
    id: 'snowball', name: 'AWS Snowball', category: 'storage', color: '#3F8624', emoji: '🏔️',
    svg: '<path d="M12 3 L20 8 L20 16 L12 21 L4 16 L4 8 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 3 L12 21" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/><path d="M4 8 L20 8" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/><path d="M4 16 L20 16" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>'
  },
  storagegateway: {
    id: 'storagegateway', name: 'Storage Gateway', category: 'storage', color: '#3F8624', emoji: '🚪',
    svg: '<rect x="3" y="6" width="18" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="6" x2="12" y2="18" stroke="currentColor" stroke-width="1.5"/><path d="M6 9 L9 12 L6 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18 9 L15 12 L18 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },
  backup: {
    id: 'backup', name: 'AWS Backup', category: 'storage', color: '#3F8624', emoji: '💾',
    svg: '<path d="M12 3 C7 3 4 7 4 12 C4 17 7 21 12 21 C17 21 20 17 20 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M16 3 L20 3 L20 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },

  // ---- Additional Database ----
  neptune: {
    id: 'neptune', name: 'Amazon Neptune', category: 'database', color: '#1A73E8', emoji: '🌐',
    svg: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.6"/><circle cx="16" cy="8" r="2" fill="currentColor" opacity="0.6"/><circle cx="8" cy="16" r="2" fill="currentColor" opacity="0.6"/><circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.6"/><circle cx="12" cy="12" r="2" fill="currentColor"/><line x1="8" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1"/><line x1="16" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1"/><line x1="8" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="1"/><line x1="16" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="1"/>'
  },
  documentdb: {
    id: 'documentdb', name: 'Amazon DocumentDB', category: 'database', color: '#1A73E8', emoji: '📄',
    svg: '<path d="M4 4 L20 4 L20 17 L14 20 L4 20 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" stroke-width="1.5"/><path d="M14 17 L14 20 L20 17" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  dms: {
    id: 'dms', name: 'Database Migration Service', category: 'database', color: '#1A73E8', emoji: '🔄',
    svg: '<ellipse cx="7" cy="12" rx="4" ry="7" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="17" cy="12" rx="4" ry="7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M11 9 L13 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11 12 L13 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11 15 L13 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },
  timestream: {
    id: 'timestream', name: 'Amazon Timestream', category: 'database', color: '#1A73E8', emoji: '⏱️',
    svg: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><polyline points="12,6 12,12 16,14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
  },

  // ---- Additional Networking ----
  transitgateway: {
    id: 'transitgateway', name: 'Transit Gateway', category: 'networking', color: '#8B5CF6', emoji: '🌉',
    svg: '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="6" x2="9" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="21" y1="6" x2="15" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="18" x2="9" y2="14" stroke="currentColor" stroke-width="1.5"/><line x1="21" y1="18" x2="15" y2="14" stroke="currentColor" stroke-width="1.5"/><circle cx="3" cy="6" r="2" fill="currentColor" opacity="0.6"/><circle cx="21" cy="6" r="2" fill="currentColor" opacity="0.6"/><circle cx="3" cy="18" r="2" fill="currentColor" opacity="0.6"/><circle cx="21" cy="18" r="2" fill="currentColor" opacity="0.6"/>'
  },
  privatelink: {
    id: 'privatelink', name: 'AWS PrivateLink', category: 'networking', color: '#8B5CF6', emoji: '🔒',
    svg: '<rect x="5" y="9" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 9 L8 7 Q8 3 12 3 Q16 3 16 7 L16 9" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>'
  },
  clb: {
    id: 'clb', name: 'Classic Load Balancer', category: 'networking', color: '#8B5CF6', emoji: '🔀',
    svg: '<rect x="3" y="9" width="18" height="6" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="6" x2="7" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="6" x2="12" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="17" y1="6" x2="17" y2="9" stroke="currentColor" stroke-width="1.5"/><line x1="7" y1="15" x2="7" y2="18" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="15" x2="12" y2="18" stroke="currentColor" stroke-width="1.5"/><line x1="17" y1="15" x2="17" y2="18" stroke="currentColor" stroke-width="1.5"/>'
  },
  targetgroup: {
    id: 'targetgroup', name: 'Target Group', category: 'networking', color: '#8B5CF6', emoji: '🎯',
    svg: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="5.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'
  },

  // ---- Additional Security ----
  shield: {
    id: 'shield', name: 'AWS Shield', category: 'security', color: '#DC143C', emoji: '🛡️',
    svg: '<path d="M12 3 L20 7 L20 13 Q20 18 12 21 Q4 18 4 13 L4 7 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 7 L16 9 L16 13 Q16 16 12 18 Q8 16 8 13 L8 9 Z" fill="none" stroke="currentColor" stroke-width="1"/>'
  },
  guardduty: {
    id: 'guardduty', name: 'Amazon GuardDuty', category: 'security', color: '#DC143C', emoji: '🔍',
    svg: '<circle cx="12" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="17" y1="16" x2="21" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 9 L12 13 L14 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" stroke-width="1.5"/>'
  },
  inspector: {
    id: 'inspector', name: 'Amazon Inspector', category: 'security', color: '#DC143C', emoji: '🔎',
    svg: '<rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="14" x2="12" y2="14" stroke="currentColor" stroke-width="1.5"/><path d="M14 14 L14 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 16 L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },
  macie: {
    id: 'macie', name: 'Amazon Macie', category: 'security', color: '#DC143C', emoji: '🔎',
    svg: '<circle cx="11" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="14" x2="20" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 10 L11 12 L14 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  acm: {
    id: 'acm', name: 'Certificate Manager', category: 'security', color: '#DC143C', emoji: '📜',
    svg: '<rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 8 L16 8" stroke="currentColor" stroke-width="1.5"/><path d="M8 11 L16 11" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="16" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 18 L10 21 L12 20 L14 21 L13.5 18" fill="none" stroke="currentColor" stroke-width="1.2"/>'
  },
  nacl: {
    id: 'nacl', name: 'Network ACL', category: 'security', color: '#DC143C', emoji: '🚧',
    svg: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="1"/><line x1="3" y1="13" x2="21" y2="13" stroke="currentColor" stroke-width="1"/><path d="M8 7 L7 8 L8 9" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round"/><path d="M10 11 L9 12 L10 13" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>'
  },

  // ---- Additional Integration ----
  mq: {
    id: 'mq', name: 'Amazon MQ', category: 'integration', color: '#E87722', emoji: '📮',
    svg: '<rect x="3" y="6" width="18" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 10 L12 14 L21 10" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  ses: {
    id: 'ses', name: 'Amazon SES', category: 'integration', color: '#E87722', emoji: '📬',
    svg: '<rect x="3" y="6" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 8 L12 14 L21 8" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1.5"/>'
  },

  // ---- Analytics ----
  kinesisfirehose: {
    id: 'kinesisfirehose', name: 'Kinesis Firehose', category: 'analytics', color: '#8B5CF6', emoji: '🚰',
    svg: '<path d="M4 8 Q8 4 12 8 Q16 12 20 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 12 Q8 8 12 12 Q16 16 20 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 16 Q8 12 12 16 Q16 20 20 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18 18 L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  athena: {
    id: 'athena', name: 'Amazon Athena', category: 'analytics', color: '#8B5CF6', emoji: '🔍',
    svg: '<circle cx="11" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="15" y1="14" x2="20" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="10" x2="14" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="11" y1="7" x2="11" y2="13" stroke="currentColor" stroke-width="1.5"/>'
  },
  glue: {
    id: 'glue', name: 'AWS Glue', category: 'analytics', color: '#8B5CF6', emoji: '🔗',
    svg: '<path d="M6 12 C6 8 18 8 18 12 C18 16 6 16 6 12 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 12 L4 10 M6 12 L4 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18 12 L20 10 M18 12 L20 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'
  },
  emr: {
    id: 'emr', name: 'Amazon EMR', category: 'analytics', color: '#8B5CF6', emoji: '⚡',
    svg: '<path d="M12 3 L14 9 L20 9 L15 13 L17 19 L12 15 L7 19 L9 13 L4 9 L10 9 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="currentColor"/>'
  },
  quicksight: {
    id: 'quicksight', name: 'Amazon QuickSight', category: 'analytics', color: '#8B5CF6', emoji: '📊',
    svg: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="6" y="13" width="3" height="4" fill="currentColor" opacity="0.6"/><rect x="11" y="10" width="3" height="7" fill="currentColor" opacity="0.6"/><rect x="16" y="8" width="3" height="9" fill="currentColor" opacity="0.6"/>'
  },
  opensearch: {
    id: 'opensearch', name: 'OpenSearch', category: 'analytics', color: '#8B5CF6', emoji: '🔍',
    svg: '<circle cx="11" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="15.5" y1="14.5" x2="20" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 10 Q11 7 14 10 Q11 13 8 10 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
  lakeformation: {
    id: 'lakeformation', name: 'Lake Formation', category: 'analytics', color: '#8B5CF6', emoji: '🏞️',
    svg: '<path d="M3 17 Q7 13 12 15 Q17 17 21 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3 14 Q7 10 12 12 Q17 14 21 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/><path d="M3 5 L21 5 L21 19 L3 19 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },

  // ---- Management & Governance ----
  cloudformation: {
    id: 'cloudformation', name: 'CloudFormation', category: 'management', color: '#E05D2B', emoji: '📋',
    svg: '<rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="8" x2="16" y2="8" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="14" x2="12" y2="14" stroke="currentColor" stroke-width="1.5"/><path d="M14 16 L16 18 L20 14" fill="none" stroke="#22c55e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  organizations: {
    id: 'organizations', name: 'AWS Organizations', category: 'management', color: '#E05D2B', emoji: '🏢',
    svg: '<rect x="9" y="3" width="6" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="17" width="6" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="9" y="17" width="6" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="15" y="17" width="6" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="7" x2="12" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="12" x2="6" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="12" x2="12" y2="17" stroke="currentColor" stroke-width="1.5"/><line x1="18" y1="12" x2="18" y2="17" stroke="currentColor" stroke-width="1.5"/>'
  },
  trustedadvisor: {
    id: 'trustedadvisor', name: 'Trusted Advisor', category: 'management', color: '#E05D2B', emoji: '🎓',
    svg: '<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 20 L9 15 L12 13 L15 15 L15 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 20 L15 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },
  costexplorer: {
    id: 'costexplorer', name: 'Cost Explorer', category: 'management', color: '#E05D2B', emoji: '💰',
    svg: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 15 L9 11 L12 13 L15 8 L18 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="15" cy="8" r="1.5" fill="currentColor"/>'
  },
  ssm: {
    id: 'ssm', name: 'Systems Manager', category: 'management', color: '#E05D2B', emoji: '🔧',
    svg: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 5 L12 9 M12 15 L12 19 M5 12 L9 12 M15 12 L19 12 M7.05 7.05 L9.88 9.88 M14.12 14.12 L16.95 16.95 M16.95 7.05 L14.12 9.88 M9.88 14.12 L7.05 16.95" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
  },
  xray: {
    id: 'xray', name: 'AWS X-Ray', category: 'management', color: '#E05D2B', emoji: '🎯',
    svg: '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 16 L9 10 L12 13 L15 8 L18 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="10" r="1.5" fill="currentColor" opacity="0.5"/><circle cx="12" cy="13" r="1.5" fill="currentColor" opacity="0.5"/><circle cx="15" cy="8" r="1.5" fill="currentColor" opacity="0.5"/>'
  },

  // ---- Infrastructure Containers ----
  region: {
    id: 'region', name: 'AWS Region', category: 'infrastructure', color: '#232F3E', emoji: '🌎',
    svg: '<rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="1"/><path d="M7 12 Q12 9 17 12" fill="none" stroke="currentColor" stroke-width="1"/><path d="M12 7 Q15 12 12 17" fill="none" stroke="currentColor" stroke-width="1"/>'
  },
  availabilityzone: {
    id: 'availabilityzone', name: 'Availability Zone', category: 'infrastructure', color: '#0073BB', emoji: '📍',
    svg: '<rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/><text x="12" y="10" text-anchor="middle" font-size="5" fill="currentColor" font-weight="bold">AZ</text><rect x="5" y="12" width="6" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><rect x="13" y="12" width="6" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/>'
  },
  publicsubnet: {
    id: 'publicsubnet', name: 'Public Subnet', category: 'infrastructure', color: '#00A1C9', emoji: '🌍',
    svg: '<rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/><circle cx="12" cy="10" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M8 10 L16 10" stroke="currentColor" stroke-width="1"/><path d="M12 6 L12 14" stroke="currentColor" stroke-width="1"/><text x="12" y="19" text-anchor="middle" font-size="4" fill="currentColor">PUBLIC</text>'
  },
  privatesubnet: {
    id: 'privatesubnet', name: 'Private Subnet', category: 'infrastructure', color: '#FF9900', emoji: '🔒',
    svg: '<rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/><rect x="8" y="5" width="8" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M10 5 L10 3 Q10 2 12 2 Q14 2 14 3 L14 5" fill="none" stroke="currentColor" stroke-width="1"/><text x="12" y="20" text-anchor="middle" font-size="4" fill="currentColor">PRIVATE</text>'
  },

  // ---- ML & AI ----
  sagemaker: {
    id: 'sagemaker', name: 'Amazon SageMaker', category: 'ml', color: '#01A88D', emoji: '🧠',
    svg: '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 8 Q8 5 12 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M19 8 Q16 5 12 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 16 Q8 19 12 19" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M19 16 Q16 19 12 19" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="5" cy="12" r="2" fill="currentColor" opacity="0.6"/><circle cx="19" cy="12" r="2" fill="currentColor" opacity="0.6"/>'
  },
  rekognition: {
    id: 'rekognition', name: 'Amazon Rekognition', category: 'ml', color: '#01A88D', emoji: '👁️',
    svg: '<path d="M2 12 Q7 6 12 6 Q17 6 22 12 Q17 18 12 18 Q7 18 2 12 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>'
  },
  lex: {
    id: 'lex', name: 'Amazon Lex', category: 'ml', color: '#01A88D', emoji: '🤖',
    svg: '<path d="M4 5 L20 5 L20 15 L14 15 L12 19 L10 15 L4 15 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="13" x2="13" y2="13" stroke="currentColor" stroke-width="1.5"/>'
  }
};

// Service categories for palette rendering
const SERVICE_CATEGORIES = [
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    color: '#232F3E',
    services: ['region', 'availabilityzone', 'publicsubnet', 'privatesubnet', 'vpc']
  },
  {
    id: 'compute',
    label: 'Compute',
    color: '#FF9900',
    services: ['ec2', 'lambda', 'ecs', 'eks', 'fargate', 'asg', 'elasticbeanstalk', 'batch', 'apprunner', 'lightsail', 'outposts']
  },
  {
    id: 'storage',
    label: 'Storage',
    color: '#3F8624',
    services: ['s3', 'ebs', 'efs', 'fsx', 'glacier', 'storagegateway', 'snowball', 'datasync', 'backup']
  },
  {
    id: 'database',
    label: 'Database',
    color: '#1A73E8',
    services: ['rds', 'dynamodb', 'aurora', 'elasticache', 'redshift', 'neptune', 'documentdb', 'dms', 'timestream']
  },
  {
    id: 'networking',
    label: 'Networking',
    color: '#8B5CF6',
    services: ['cloudfront', 'alb', 'nlb', 'clb', 'targetgroup', 'route53', 'igw', 'natgw', 'vpcendpoint', 'transitgateway', 'privatelink', 'directconnect', 'vpn', 'elasticip']
  },
  {
    id: 'security',
    label: 'Security',
    color: '#DC143C',
    services: ['iam', 'securitygroups', 'nacl', 'kms', 'secretsmanager', 'cognito', 'waf', 'shield', 'guardduty', 'inspector', 'macie', 'acm']
  },
  {
    id: 'integration',
    label: 'Integration',
    color: '#E87722',
    services: ['sqs', 'sns', 'kinesis', 'kinesisfirehose', 'mq', 'ses', 'eventbridge', 'stepfunctions', 'apigateway']
  },
  {
    id: 'analytics',
    label: 'Analytics',
    color: '#8C4FFF',
    services: ['athena', 'glue', 'emr', 'quicksight', 'opensearch', 'lakeformation']
  },
  {
    id: 'management',
    label: 'Management',
    color: '#E05D2B',
    services: ['cloudwatch', 'cloudtrail', 'awsconfig', 'cloudformation', 'ssm', 'xray', 'organizations', 'trustedadvisor', 'costexplorer']
  },
  {
    id: 'ml',
    label: 'ML & AI',
    color: '#01A88D',
    services: ['sagemaker', 'rekognition', 'lex']
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
