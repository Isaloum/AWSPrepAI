// Architecture Builder - Interactive AWS Architecture Learning Tool
// Drag-and-drop canvas for building and validating AWS architectures

// ==================== QUESTION DATA ====================

const ARCHITECTURE_QUESTIONS = [
  {
    id: 1,
    difficulty: 'beginner',
    category: 'design-resilient',
    title: 'Static Website Hosting',
    scenario: 'Build a highly available architecture to host a static website with global distribution and low latency for users worldwide.',
    requirements: [
      'Static content must be served from a durable, scalable storage service',
      'Content must be cached at edge locations globally',
      'DNS must route users to the CDN distribution'
    ],
    requiredServices: ['s3', 'cloudfront', 'route53'],
    optionalServices: ['waf'],
    correctConnections: [
      { from: 'route53', to: 'cloudfront' },
      { from: 'cloudfront', to: 's3' }
    ],
    hints: {
      1: 'Start with where your static files will be stored — which AWS service is best for static website hosting?',
      2: 'How do you distribute content globally with caching at edge locations? Think of a Content Delivery Network.',
      3: 'What AWS DNS service routes users to your CDN distribution?'
    },
    explanation: 'Route 53 routes users to the CloudFront distribution. CloudFront caches the static content from S3 at edge locations worldwide, delivering low-latency responses globally.',
    awsBestPractices: [
      'Enable S3 versioning for easy rollbacks',
      'Use CloudFront OAC (Origin Access Control) to restrict direct S3 access',
      'Configure Route 53 health checks for failover'
    ]
  },
  {
    id: 2,
    difficulty: 'beginner',
    category: 'design-secure',
    title: 'Simple Web Server',
    scenario: 'Deploy a single web application server accessible from the internet with proper network security.',
    requirements: [
      'A virtual server to run the web application',
      'Network firewall rules to allow only HTTP/HTTPS traffic',
      'A static public IP address for the server'
    ],
    requiredServices: ['ec2', 'securitygroups', 'elasticip'],
    optionalServices: ['vpc'],
    correctConnections: [
      { from: 'elasticip', to: 'ec2' },
      { from: 'securitygroups', to: 'ec2' }
    ],
    hints: {
      1: 'You need a virtual machine in AWS — which compute service provides resizable virtual servers?',
      2: 'How do you control inbound/outbound traffic to your server? Think firewall-level resource.',
      3: 'How do you assign a fixed public IP address that persists even if the instance is stopped/started?'
    },
    explanation: 'EC2 provides the virtual server. Security Groups act as a virtual firewall controlling inbound/outbound traffic. An Elastic IP provides a static public IP address that remains consistent.',
    awsBestPractices: [
      'Restrict Security Groups to only needed ports (80, 443)',
      'Use IAM roles on EC2 instead of access keys',
      'Enable detailed monitoring with CloudWatch'
    ]
  },
  {
    id: 3,
    difficulty: 'beginner',
    category: 'design-secure',
    title: 'Web App with Database',
    scenario: 'Deploy a web application with a relational database backend, ensuring the database is not directly accessible from the internet.',
    requirements: [
      'A web server to serve the application',
      'A managed relational database service',
      'Security controls isolating the database from public internet'
    ],
    requiredServices: ['ec2', 'rds', 'securitygroups'],
    optionalServices: ['vpc'],
    correctConnections: [
      { from: 'ec2', to: 'rds' },
      { from: 'securitygroups', to: 'rds' }
    ],
    hints: {
      1: 'You need a managed relational database — which AWS service handles database provisioning and backups automatically?',
      2: 'How does your web server communicate with the database? Draw a connection.',
      3: 'How do you prevent direct internet access to the database? Think about network-level controls.'
    },
    explanation: 'EC2 hosts the web application and connects to RDS for database operations. Security Groups on the RDS instance only allow traffic from the EC2 security group, blocking public access.',
    awsBestPractices: [
      'Place RDS in private subnets with no public access',
      'Use separate Security Groups for web tier and database tier',
      'Enable automated RDS backups with multi-day retention'
    ]
  },
  {
    id: 4,
    difficulty: 'beginner',
    category: 'design-secure',
    title: 'Encrypted Data Storage',
    scenario: 'Store sensitive customer data in AWS with server-side encryption to meet compliance requirements.',
    requirements: [
      'Durable object storage for the sensitive data',
      'Customer-managed encryption keys',
      'Encryption applied at rest'
    ],
    requiredServices: ['s3', 'kms'],
    optionalServices: ['cloudtrail'],
    correctConnections: [
      { from: 's3', to: 'kms' }
    ],
    hints: {
      1: 'Which AWS storage service is best for storing large amounts of unstructured data objects?',
      2: 'How do you manage your own encryption keys in AWS instead of using AWS default keys?'
    },
    explanation: 'S3 stores the data objects. KMS manages the encryption keys. S3 uses KMS keys for server-side encryption (SSE-KMS), ensuring all data is encrypted at rest with customer-controlled keys.',
    awsBestPractices: [
      'Enable S3 bucket versioning for data protection',
      'Use KMS key rotation annually',
      'Enable CloudTrail to audit KMS key usage'
    ]
  },
  {
    id: 5,
    difficulty: 'beginner',
    category: 'design-resilient',
    title: 'Load Balanced Web App',
    scenario: 'Distribute incoming web traffic across multiple web server instances to improve availability and handle more concurrent users.',
    requirements: [
      'Distribute HTTP/HTTPS traffic across multiple servers',
      'Multiple identical web server instances',
      'Security controls allowing only load balancer traffic to instances'
    ],
    requiredServices: ['alb', 'ec2', 'securitygroups'],
    optionalServices: ['route53'],
    correctConnections: [
      { from: 'alb', to: 'ec2' },
      { from: 'securitygroups', to: 'ec2' }
    ],
    hints: {
      1: 'Which AWS service distributes application-layer (HTTP/HTTPS) traffic across multiple targets?',
      2: 'You need at least one compute target — what service runs your web application code?',
      3: 'How do you restrict the EC2 instances to only accept traffic from the load balancer?'
    },
    explanation: 'The ALB (Application Load Balancer) distributes incoming traffic across EC2 instances. Security Groups on EC2 restrict inbound traffic to only the ALB, preventing direct access.',
    awsBestPractices: [
      'Deploy EC2 instances across multiple Availability Zones',
      'Configure ALB health checks to route only to healthy instances',
      'Enable access logs on the ALB for troubleshooting'
    ]
  },
  {
    id: 6,
    difficulty: 'beginner',
    category: 'design-resilient',
    title: 'Auto Scaling Web Tier',
    scenario: 'Build a web tier that automatically scales out during traffic peaks and scales in during low-traffic periods to optimize cost.',
    requirements: [
      'Automatically adjust the number of web servers based on load',
      'Distribute traffic across all active servers',
      'Monitor metrics to trigger scaling actions'
    ],
    requiredServices: ['alb', 'asg', 'ec2', 'cloudwatch'],
    optionalServices: ['sns'],
    correctConnections: [
      { from: 'alb', to: 'asg' },
      { from: 'asg', to: 'ec2' },
      { from: 'cloudwatch', to: 'asg' }
    ],
    hints: {
      1: 'Which AWS service automatically adds or removes EC2 instances based on demand?',
      2: 'How does traffic get distributed to instances managed by Auto Scaling?',
      3: 'Which monitoring service provides metrics that trigger scaling policies?'
    },
    explanation: 'CloudWatch monitors metrics like CPU utilization and triggers Auto Scaling Group to add/remove EC2 instances. The ALB distributes traffic across all healthy instances in the ASG.',
    awsBestPractices: [
      'Use target tracking scaling policies for simplicity',
      'Configure a warm-up period to avoid premature scale-in',
      'Set CloudWatch alarms for both scale-out and scale-in'
    ]
  },
  {
    id: 7,
    difficulty: 'beginner',
    category: 'design-resilient',
    title: 'Decoupled Architecture',
    scenario: 'Decouple a web frontend from a backend processing service so they can scale independently and the processing queue can buffer requests during peaks.',
    requirements: [
      'A web server to receive user requests',
      'A message queue to buffer work between tiers',
      'A worker service to process messages asynchronously'
    ],
    requiredServices: ['ec2', 'sqs'],
    optionalServices: ['sns', 'cloudwatch'],
    correctConnections: [
      { from: 'ec2', to: 'sqs' }
    ],
    hints: {
      1: 'What AWS service provides a fully managed message queue that decouples components?',
      2: 'How does the web server put work into the queue? Draw a connection from EC2 to SQS.'
    },
    explanation: 'EC2 (web tier) sends messages to the SQS queue instead of calling the processor directly. Worker EC2 instances poll the queue and process messages, enabling independent scaling and fault tolerance.',
    awsBestPractices: [
      'Use SQS FIFO queues for ordered processing when needed',
      'Set a Dead Letter Queue (DLQ) for failed messages',
      'Scale workers based on SQS queue depth using CloudWatch'
    ]
  },
  {
    id: 8,
    difficulty: 'beginner',
    category: 'design-resilient',
    title: 'Multi-AZ Database',
    scenario: 'Deploy a relational database that automatically fails over to a standby instance in a different Availability Zone for high availability.',
    requirements: [
      'Primary database instance with automatic failover',
      'Synchronous replication to a standby in another AZ',
      'Application server connecting to the database'
    ],
    requiredServices: ['rds', 'ec2'],
    optionalServices: ['securitygroups'],
    correctConnections: [
      { from: 'ec2', to: 'rds' }
    ],
    hints: {
      1: 'Which AWS managed database service supports Multi-AZ deployments with automatic failover?',
      2: 'How does the application server connect to the database?'
    },
    explanation: 'RDS Multi-AZ maintains a synchronous standby replica in a different AZ. If the primary fails, RDS automatically fails over to the standby with minimal downtime. EC2 connects via the RDS endpoint.',
    awsBestPractices: [
      'Enable Multi-AZ on production RDS instances',
      'Use RDS Read Replicas for read scaling (separate from Multi-AZ)',
      'Enable automated backups and test restore procedures'
    ]
  },
  {
    id: 9,
    difficulty: 'beginner',
    category: 'design-performant',
    title: 'Serverless REST API',
    scenario: 'Build a scalable REST API without managing any servers, connecting to a NoSQL database for fast, flexible data access.',
    requirements: [
      'HTTP API endpoint that scales automatically',
      'Serverless function to process each request',
      'Fast, scalable NoSQL database for data storage'
    ],
    requiredServices: ['apigateway', 'lambda', 'dynamodb'],
    optionalServices: ['iam', 'cloudwatch'],
    correctConnections: [
      { from: 'apigateway', to: 'lambda' },
      { from: 'lambda', to: 'dynamodb' }
    ],
    hints: {
      1: 'Which AWS service creates HTTP API endpoints that can trigger other services?',
      2: 'What serverless compute service executes code without provisioning servers?',
      3: 'Which AWS database is fully serverless and ideal for key-value and document data?'
    },
    explanation: 'API Gateway creates and manages the REST API endpoints. Each request triggers a Lambda function for processing. Lambda reads/writes data to DynamoDB, which provides single-digit millisecond performance at any scale.',
    awsBestPractices: [
      'Use Lambda layers to share code and dependencies',
      'Enable API Gateway caching to reduce Lambda invocations',
      'Use DynamoDB on-demand capacity for variable workloads'
    ]
  },
  {
    id: 10,
    difficulty: 'beginner',
    category: 'design-secure',
    title: 'Secure Static Website with WAF',
    scenario: 'Host a static website with global distribution and DDoS protection to defend against common web attacks.',
    requirements: [
      'Durable storage for static website files',
      'Global CDN for low-latency content delivery',
      'Web Application Firewall for DDoS and attack protection',
      'DNS routing to the distribution'
    ],
    requiredServices: ['s3', 'cloudfront', 'waf', 'route53'],
    optionalServices: [],
    correctConnections: [
      { from: 'route53', to: 'cloudfront' },
      { from: 'waf', to: 'cloudfront' },
      { from: 'cloudfront', to: 's3' }
    ],
    hints: {
      1: 'Start with object storage for your static content.',
      2: 'Which CDN service caches content at edge locations?',
      3: 'Which AWS service protects web applications from common attacks like SQL injection and XSS?',
      4: 'Which DNS service routes traffic to your CloudFront distribution?'
    },
    explanation: 'Route 53 routes DNS to CloudFront. WAF rules are associated with the CloudFront distribution, filtering malicious requests before they reach the origin. CloudFront serves cached content from S3 at global edge locations.',
    awsBestPractices: [
      'Enable AWS Managed WAF rule groups for common threats',
      'Use CloudFront signed URLs for private content',
      'Enable S3 Block Public Access and use CloudFront OAC'
    ]
  }
];

// ==================== STATE ====================

const archState = {
  currentQuestionIndex: 0,
  currentDifficulty: 'beginner',
  placedServices: [],   // { instanceId, serviceId, x, y }
  connections: [],      // { id, fromInstanceId, toInstanceId }
  attempts: 0,
  hintsShown: 0,
  connectingFrom: null, // instanceId being connected from
  nextInstanceId: 1,
  solutionVisible: false,
  svgConnections: null,  // SVG element for drawing connections
  canvasEl: null,
  score: 0,
  zoom: 1.0
};

// ==================== INIT ====================

function initArchitectureBuilder() {
  archState.canvasEl = document.getElementById('archCanvasInner');
  archState.svgConnections = document.getElementById('archConnectionsSvg');
  if (!archState.canvasEl || !archState.svgConnections) return;

  renderPalette();
  loadArchQuestion(0);
  updateArchStats();
  setupArchCanvasDrop();
}

// ==================== PALETTE ====================

function renderPalette(filter) {
  const container = document.getElementById('archPalette');
  if (!container) return;
  const q = getCurrentArchQuestion();
  const filterLower = filter ? filter.toLowerCase() : '';

  let html = '';
  SERVICE_CATEGORIES.forEach(cat => {
    const filteredSvcs = cat.services.filter(sid => {
      const svc = AWS_SERVICES[sid];
      if (!svc) return false;
      if (filterLower && !svc.name.toLowerCase().includes(filterLower) && !svc.id.toLowerCase().includes(filterLower)) return false;
      return true;
    });
    if (filteredSvcs.length === 0) return;

    html += `<div class="arch-palette-category" id="archCat_${cat.id}">
      <div class="arch-palette-cat-header" onclick="togglePaletteCategory('${cat.id}')" style="border-left:3px solid ${cat.color}">
        <span style="font-weight:700;color:${cat.color}">${cat.label}</span>
        <span class="arch-cat-toggle">▾</span>
      </div>
      <div class="arch-palette-cat-body" id="archCatBody_${cat.id}">`;
    filteredSvcs.forEach(sid => {
      const svc = AWS_SERVICES[sid];
      if (!svc) return;
      const isHighlighted = q && (q.requiredServices.includes(sid) || (q.optionalServices && q.optionalServices.includes(sid)));
      html += `<div class="arch-palette-item ${isHighlighted ? 'arch-palette-hint' : ''}"
          draggable="true"
          data-service-id="${sid}"
          ondragstart="handlePaletteDragStart(event)"
          ondblclick="addServiceToCenter('${sid}')"
          title="${svc.name} — double-click or drag to canvas">
        <div class="arch-palette-icon" style="color:${svc.color}">
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">${svc.svg}</svg>
        </div>
        <div class="arch-palette-label">${svc.name}</div>
      </div>`;
    });
    html += `</div></div>`;
  });
  container.innerHTML = html || '<div style="padding:1rem;color:var(--muted);text-align:center">No services match your search</div>';
}

function togglePaletteCategory(catId) {
  const body = document.getElementById('archCatBody_' + catId);
  const header = document.querySelector('#archCat_' + catId + ' .arch-cat-toggle');
  if (!body) return;
  const isCollapsed = body.style.display === 'none';
  body.style.display = isCollapsed ? '' : 'none';
  if (header) header.textContent = isCollapsed ? '▾' : '▸';
}

function filterPalette() {
  const val = document.getElementById('archSearchInput') ? document.getElementById('archSearchInput').value : '';
  renderPalette(val);
}

// ==================== DRAG & DROP ====================

function handlePaletteDragStart(e) {
  e.dataTransfer.setData('serviceId', e.currentTarget.dataset.serviceId);
  e.dataTransfer.effectAllowed = 'copy';
}

function setupArchCanvasDrop() {
  const canvas = archState.canvasEl;
  if (!canvas) return;

  canvas.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  canvas.addEventListener('drop', e => {
    e.preventDefault();
    const serviceId = e.dataTransfer.getData('serviceId');
    if (!serviceId || !AWS_SERVICES[serviceId]) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left - 36) / archState.zoom);
    const y = Math.round((e.clientY - rect.top - 36) / archState.zoom);

    placeServiceOnCanvas(serviceId, Math.max(0, x), Math.max(0, y));
  });
}

function addServiceToCenter(serviceId) {
  const canvas = archState.canvasEl;
  if (!canvas) return;
  const cx = Math.round(canvas.offsetWidth / 2 / archState.zoom) - 36;
  const cy = Math.round(canvas.offsetHeight / 2 / archState.zoom) - 36;
  const spread = archState.placedServices.length * 20;
  placeServiceOnCanvas(serviceId, cx + spread, cy + spread);
}

function placeServiceOnCanvas(serviceId, x, y) {
  const svc = AWS_SERVICES[serviceId];
  if (!svc) return;

  const instanceId = 'inst_' + (archState.nextInstanceId++);
  // Snap to 20px grid
  const sx = Math.round(x / 20) * 20;
  const sy = Math.round(y / 20) * 20;

  archState.placedServices.push({ instanceId, serviceId, x: sx, y: sy });
  renderCanvasService(instanceId, serviceId, sx, sy);
  renderConnections();
}

function renderCanvasService(instanceId, serviceId, x, y) {
  const svc = AWS_SERVICES[serviceId];
  if (!svc || !archState.canvasEl) return;

  const el = document.createElement('div');
  el.className = 'arch-canvas-service';
  el.id = instanceId;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.dataset.instanceId = instanceId;
  el.dataset.serviceId = serviceId;
  el.innerHTML = `
    <div class="arch-svc-icon" style="color:${svc.color}">
      <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden="true">${svc.svg}</svg>
    </div>
    <div class="arch-svc-label">${svc.name}</div>
    <button class="arch-svc-remove" onclick="removeServiceFromCanvas('${instanceId}')" title="Remove" aria-label="Remove ${svc.name}">✕</button>
  `;

  el.addEventListener('click', (e) => {
    if (e.target.classList.contains('arch-svc-remove')) return;
    handleCanvasServiceClick(instanceId);
  });

  // Make draggable on canvas
  makeDraggableOnCanvas(el);

  archState.canvasEl.appendChild(el);
}

function makeDraggableOnCanvas(el) {
  let isDragging = false;
  let dragOffsetX = 0, dragOffsetY = 0;

  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('arch-svc-remove')) return;
    if (archState.connectingFrom) return; // Don't drag while connecting
    isDragging = true;
    const rect = el.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    el.style.zIndex = '100';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const canvasRect = archState.canvasEl.getBoundingClientRect();
    let newX = (e.clientX - canvasRect.left - dragOffsetX) / archState.zoom;
    let newY = (e.clientY - canvasRect.top - dragOffsetY) / archState.zoom;
    // Snap to 20px grid
    newX = Math.round(newX / 20) * 20;
    newY = Math.round(newY / 20) * 20;
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);

    el.style.left = newX + 'px';
    el.style.top = newY + 'px';

    // Update state
    const inst = archState.placedServices.find(p => p.instanceId === el.dataset.instanceId);
    if (inst) { inst.x = newX; inst.y = newY; }
    renderConnections();
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      el.style.zIndex = '';
    }
  });
}

function removeServiceFromCanvas(instanceId) {
  // Remove connections involving this instance
  archState.connections = archState.connections.filter(
    c => c.fromInstanceId !== instanceId && c.toInstanceId !== instanceId
  );
  // Remove from state
  archState.placedServices = archState.placedServices.filter(p => p.instanceId !== instanceId);
  // Remove DOM element
  const el = document.getElementById(instanceId);
  if (el) el.remove();
  // Cancel connecting if applicable
  if (archState.connectingFrom === instanceId) {
    archState.connectingFrom = null;
    updateConnectingUI();
  }
  renderConnections();
}

// ==================== CONNECTION DRAWING ====================

function handleCanvasServiceClick(instanceId) {
  if (archState.solutionVisible) return;

  if (!archState.connectingFrom) {
    // Start a connection from this service
    archState.connectingFrom = instanceId;
    updateConnectingUI();
    highlightService(instanceId, true);
  } else if (archState.connectingFrom === instanceId) {
    // Cancel connecting
    archState.connectingFrom = null;
    updateConnectingUI();
    highlightAllServices(false);
  } else {
    // Complete the connection
    const from = archState.connectingFrom;
    const to = instanceId;
    archState.connectingFrom = null;
    updateConnectingUI();
    highlightAllServices(false);

    // Avoid duplicate connections
    const exists = archState.connections.some(
      c => c.fromInstanceId === from && c.toInstanceId === to
    );
    if (!exists) {
      archState.connections.push({
        id: 'conn_' + Date.now(),
        fromInstanceId: from,
        toInstanceId: to
      });
      renderConnections();
    }
  }
}

function updateConnectingUI() {
  const hint = document.getElementById('archConnectHint');
  if (hint) {
    hint.style.display = archState.connectingFrom ? 'block' : 'none';
  }
  // Update canvas cursor
  if (archState.canvasEl) {
    archState.canvasEl.style.cursor = archState.connectingFrom ? 'crosshair' : '';
  }
}

function highlightService(instanceId, on) {
  const el = document.getElementById(instanceId);
  if (el) el.classList.toggle('arch-connecting-source', on);
}

function highlightAllServices(on) {
  document.querySelectorAll('.arch-canvas-service').forEach(el => {
    el.classList.toggle('arch-connecting-source', on);
  });
}

function renderConnections() {
  const svg = archState.svgConnections;
  const canvas = archState.canvasEl;
  if (!svg || !canvas) return;

  // Resize SVG to match canvas
  svg.setAttribute('width', canvas.offsetWidth);
  svg.setAttribute('height', canvas.offsetHeight);

  svg.innerHTML = '';

  // Define arrowhead marker
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#0073BB"/>
    </marker>
    <marker id="arrowhead-solution" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#10b981"/>
    </marker>
  `;
  svg.appendChild(defs);

  archState.connections.forEach(conn => {
    const fromEl = document.getElementById(conn.fromInstanceId);
    const toEl = document.getElementById(conn.toInstanceId);
    if (!fromEl || !toEl) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const x1 = (fromRect.left + fromRect.width / 2 - canvasRect.left) / archState.zoom;
    const y1 = (fromRect.top + fromRect.height / 2 - canvasRect.top) / archState.zoom;
    const x2 = (toRect.left + toRect.width / 2 - canvasRect.left) / archState.zoom;
    const y2 = (toRect.top + toRect.height / 2 - canvasRect.top) / archState.zoom;

    const isSolution = conn.isSolution;
    const color = isSolution ? '#10b981' : '#0073BB';
    const marker = isSolution ? 'url(#arrowhead-solution)' : 'url(#arrowhead)';

    // Draw curved line
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2 - 30;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', isSolution ? '2.5' : '2');
    line.setAttribute('fill', 'none');
    line.setAttribute('marker-end', marker);
    if (isSolution) line.setAttribute('stroke-dasharray', '6 3');
    line.setAttribute('data-conn-id', conn.id);
    line.style.cursor = 'pointer';
    line.addEventListener('click', () => removeConnection(conn.id));
    line.setAttribute('title', 'Click to delete connection');

    svg.appendChild(line);
  });
}

function removeConnection(connId) {
  archState.connections = archState.connections.filter(c => c.id !== connId);
  renderConnections();
}

// ==================== CANVAS CONTROLS ====================

function clearCanvas() {
  archState.placedServices = [];
  archState.connections = [];
  archState.connectingFrom = null;
  archState.solutionVisible = false;
  if (archState.canvasEl) {
    // Remove all service elements
    archState.canvasEl.querySelectorAll('.arch-canvas-service').forEach(el => el.remove());
  }
  renderConnections();
  updateConnectingUI();
  setArchFeedback('', '');
}

function archZoom(delta) {
  archState.zoom = Math.max(0.5, Math.min(2, archState.zoom + delta));
  const inner = document.getElementById('archCanvasInner');
  if (inner) {
    inner.style.transform = `scale(${archState.zoom})`;
    inner.style.transformOrigin = 'top left';
  }
  const pct = document.getElementById('archZoomPct');
  if (pct) pct.textContent = Math.round(archState.zoom * 100) + '%';
  renderConnections();
}

// ==================== QUESTIONS ====================

function getCurrentArchQuestion() {
  const filtered = ARCHITECTURE_QUESTIONS.filter(q => q.difficulty === archState.currentDifficulty);
  return filtered[archState.currentQuestionIndex % filtered.length] || ARCHITECTURE_QUESTIONS[0];
}

function loadArchQuestion(index) {
  const filtered = ARCHITECTURE_QUESTIONS.filter(q => q.difficulty === archState.currentDifficulty);
  archState.currentQuestionIndex = index % filtered.length;
  archState.attempts = 0;
  archState.hintsShown = 0;
  archState.solutionVisible = false;

  clearCanvas();
  renderCurrentQuestion();
  renderPalette();

  const showSolBtn = document.getElementById('archShowSolBtn');
  if (showSolBtn) showSolBtn.style.display = 'none';
}

function renderCurrentQuestion() {
  const q = getCurrentArchQuestion();
  if (!q) return;

  const filtered = ARCHITECTURE_QUESTIONS.filter(qq => qq.difficulty === archState.currentDifficulty);
  const total = filtered.length;
  const num = archState.currentQuestionIndex + 1;

  const titleEl = document.getElementById('archQuestionTitle');
  const scenarioEl = document.getElementById('archScenario');
  const reqsEl = document.getElementById('archRequirements');
  const progressEl = document.getElementById('archQuestionProgress');

  if (titleEl) titleEl.textContent = q.title;
  if (progressEl) progressEl.textContent = `Question ${num} / ${total}`;
  if (scenarioEl) scenarioEl.textContent = q.scenario;
  if (reqsEl) {
    reqsEl.innerHTML = q.requirements.map(r => `<li>${r}</li>`).join('');
  }
}

function nextArchQuestion() {
  const filtered = ARCHITECTURE_QUESTIONS.filter(q => q.difficulty === archState.currentDifficulty);
  loadArchQuestion((archState.currentQuestionIndex + 1) % filtered.length);
}

function prevArchQuestion() {
  const filtered = ARCHITECTURE_QUESTIONS.filter(q => q.difficulty === archState.currentDifficulty);
  const prev = (archState.currentQuestionIndex - 1 + filtered.length) % filtered.length;
  loadArchQuestion(prev);
}

function setArchDifficulty(level) {
  archState.currentDifficulty = level;
  ['beginner', 'intermediate', 'advanced'].forEach(d => {
    const btn = document.getElementById('archDiffBtn_' + d);
    if (btn) btn.classList.toggle('active', d === level);
  });
  loadArchQuestion(0);
  updateArchStats();
}

// ==================== VALIDATION ====================

function checkArchSolution() {
  if (archState.solutionVisible) return;
  const q = getCurrentArchQuestion();
  archState.attempts++;

  // Score: 40% services present, 40% connections correct, 20% optional best practices
  const placedServiceIds = archState.placedServices.map(p => p.serviceId);

  // Check required services
  const requiredPresent = q.requiredServices.filter(sid => placedServiceIds.includes(sid));
  const requiredMissing = q.requiredServices.filter(sid => !placedServiceIds.includes(sid));
  const serviceScore = requiredPresent.length / q.requiredServices.length;

  // Check required connections (bidirectional ok)
  const connectedServicePairs = archState.connections.map(c => {
    const fromInst = archState.placedServices.find(p => p.instanceId === c.fromInstanceId);
    const toInst = archState.placedServices.find(p => p.instanceId === c.toInstanceId);
    return fromInst && toInst ? { from: fromInst.serviceId, to: toInst.serviceId } : null;
  }).filter(Boolean);

  const correctConns = q.correctConnections.filter(req =>
    connectedServicePairs.some(pair =>
      (pair.from === req.from && pair.to === req.to) ||
      (pair.from === req.to && pair.to === req.from)
    )
  );
  const connScore = q.correctConnections.length > 0
    ? correctConns.length / q.correctConnections.length
    : 1;

  // Check optional services
  const optionalPresent = (q.optionalServices || []).filter(sid => placedServiceIds.includes(sid));
  const optionalScore = (q.optionalServices && q.optionalServices.length > 0)
    ? optionalPresent.length / q.optionalServices.length
    : 1;

  const totalScore = Math.round((serviceScore * 40 + connScore * 40 + optionalScore * 20));
  archState.score = totalScore;

  // Save progress
  saveArchProgress(q.id, totalScore, archState.attempts);

  // Generate feedback
  let feedbackClass, feedbackMsg;

  if (totalScore >= 90) {
    feedbackClass = 'success';
    feedbackMsg = `✅ <strong>Perfect! (${totalScore}%)</strong> Your architecture follows AWS best practices!`;
    highlightMissingServices([]);
  } else if (totalScore >= 50) {
    feedbackClass = 'warning';
    let missing = '';
    if (requiredMissing.length > 0) {
      missing += ` Missing services: <strong>${requiredMissing.map(sid => AWS_SERVICES[sid] ? AWS_SERVICES[sid].name : sid).join(', ')}</strong>.`;
    }
    const missingConns = q.correctConnections.filter(req =>
      !connectedServicePairs.some(pair =>
        (pair.from === req.from && pair.to === req.to) ||
        (pair.from === req.to && pair.to === req.from)
      )
    );
    if (missingConns.length > 0) {
      missing += ` Missing connections: ${missingConns.map(c => {
        const fn = AWS_SERVICES[c.from] ? AWS_SERVICES[c.from].name : c.from;
        const tn = AWS_SERVICES[c.to] ? AWS_SERVICES[c.to].name : c.to;
        return `<em>${fn} → ${tn}</em>`;
      }).join(', ')}.`;
    }

    let hint = '';
    if (archState.attempts <= 3 && archState.hintsShown < archState.attempts) {
      const hintKey = Math.min(archState.attempts, Object.keys(q.hints).length);
      hint = q.hints[hintKey] ? `<br><strong>💡 Hint:</strong> ${q.hints[hintKey]}` : '';
      archState.hintsShown = archState.attempts;
    }
    feedbackMsg = `⚠️ <strong>Almost there! (${totalScore}%)</strong>${missing}${hint}`;
    highlightMissingServices(requiredMissing);
  } else {
    feedbackClass = 'error';
    let hint = '';
    if (archState.attempts <= 3) {
      const hintKey = Math.min(archState.attempts, Object.keys(q.hints).length);
      hint = q.hints[hintKey] ? `<br><strong>💡 Hint:</strong> ${q.hints[hintKey]}` : '';
      archState.hintsShown = archState.attempts;
    }
    feedbackMsg = `❌ <strong>Not quite right (${totalScore}%).</strong>${hint} Try adding the required services and connecting them.`;
    highlightMissingServices(requiredMissing);
  }

  setArchFeedback(feedbackClass, feedbackMsg);

  // Show "Show Solution" button after 3 attempts or low score
  if (archState.attempts >= 3 || totalScore < 30) {
    const showSolBtn = document.getElementById('archShowSolBtn');
    if (showSolBtn) showSolBtn.style.display = 'inline-flex';
  }

  updateArchStats();
}

function highlightMissingServices(missingIds) {
  document.querySelectorAll('.arch-palette-item').forEach(el => {
    el.classList.remove('arch-palette-missing');
  });
  if (missingIds && missingIds.length > 0) {
    missingIds.forEach(sid => {
      document.querySelectorAll(`.arch-palette-item[data-service-id="${sid}"]`).forEach(el => {
        el.classList.add('arch-palette-missing');
      });
    });
  }
}

function setArchFeedback(type, message) {
  const fb = document.getElementById('archFeedback');
  if (!fb) return;
  fb.className = 'arch-feedback' + (type ? ' arch-feedback-' + type : '');
  fb.innerHTML = message;
  fb.style.display = message ? 'block' : 'none';
}

// ==================== HINT BUTTON ====================

function showArchHint() {
  const q = getCurrentArchQuestion();
  archState.hintsShown = Math.min(archState.hintsShown + 1, Object.keys(q.hints).length);
  const hintText = q.hints[archState.hintsShown];
  if (hintText) {
    setArchFeedback('hint', `💡 <strong>Hint ${archState.hintsShown}:</strong> ${hintText}`);
  }
}

// ==================== SHOW SOLUTION ====================

function showArchSolution() {
  const q = getCurrentArchQuestion();
  archState.solutionVisible = true;

  clearCanvas();

  // Place required services in a nice layout
  const allServices = [...q.requiredServices, ...(q.optionalServices || [])];
  const cols = Math.ceil(Math.sqrt(allServices.length));
  const spacingX = 160, spacingY = 140;

  allServices.forEach((sid, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 40 + col * spacingX;
    const y = 40 + row * spacingY;
    placeServiceOnCanvas(sid, x, y);
  });

  // Draw solution connections after brief delay (let DOM render)
  setTimeout(() => {
    q.correctConnections.forEach(req => {
      const fromInst = archState.placedServices.find(p => p.serviceId === req.from);
      const toInst = archState.placedServices.find(p => p.serviceId === req.to);
      if (fromInst && toInst) {
        archState.connections.push({
          id: 'sol_' + Date.now() + Math.random(),
          fromInstanceId: fromInst.instanceId,
          toInstanceId: toInst.instanceId,
          isSolution: true
        });
      }
    });
    renderConnections();
  }, 100);

  // Show explanation
  const explanationHtml = `
    <div style="margin-bottom:.75rem"><strong>Architecture Explanation:</strong><br>${q.explanation}</div>
    <div style="margin-bottom:.75rem"><strong>AWS Best Practices:</strong>
      <ul style="margin:.5rem 0 0 1.25rem">${q.awsBestPractices.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>
  `;
  setArchFeedback('solution', `✅ <strong>Correct Solution:</strong><br>${explanationHtml}`);
}

// ==================== PROGRESS TRACKING ====================

function saveArchProgress(questionId, score, attempts) {
  const key = 'architecture_progress';
  const progress = DB.getOne(key) || {};
  if (!progress[questionId] || score > (progress[questionId].score || 0)) {
    progress[questionId] = { score, attempts, completedAt: Date.now() };
  }
  DB.setOne(key, progress);

  // Track completed per difficulty
  const q = ARCHITECTURE_QUESTIONS.find(qq => qq.id === questionId);
  if (q && score >= 90) {
    const completedKey = 'architecture_completed_' + q.difficulty;
    const completed = DB.getOne(completedKey) || [];
    if (!completed.includes(questionId)) {
      completed.push(questionId);
      DB.setOne(completedKey, completed);
    }
  }
}

function updateArchStats() {
  ['beginner', 'intermediate', 'advanced'].forEach(diff => {
    const diffQuestions = ARCHITECTURE_QUESTIONS.filter(q => q.difficulty === diff);
    const completed = DB.getOne('architecture_completed_' + diff) || [];
    const pct = diffQuestions.length > 0
      ? Math.round((completed.length / diffQuestions.length) * 100)
      : 0;
    const el = document.getElementById('archStat_' + diff);
    if (el) el.textContent = completed.length > 0 ? `${completed.length}/${diffQuestions.length}` : '0/' + diffQuestions.length;
  });

  // Update question progress indicator
  renderCurrentQuestion();
}
