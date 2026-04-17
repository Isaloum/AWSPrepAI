import { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

/* ════════════════════════════════════════════════════════════
   CARD 1 — Electrical Engineering → Cloud
   220 × 140  |  chip  →  particle wire  →  aws cloud
════════════════════════════════════════════════════════════ */
function IllustrationElectrical() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      <defs>
        <linearGradient id="g1-chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eff6ff"/>
          <stop offset="100%" stopColor="#bfdbfe"/>
        </linearGradient>
        <linearGradient id="g1-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f9ff"/>
          <stop offset="100%" stopColor="#dbeafe"/>
        </linearGradient>
      </defs>

      {/* ── CHIP ── */}
      <rect x="12" y="8" width="62" height="124" rx="10" fill="url(#g1-chip)" stroke="#3b82f6" strokeWidth="2.5"/>
      {/* Blue header */}
      <rect x="12" y="8" width="62" height="28" rx="10" fill="#1d4ed8"/>
      <rect x="12" y="26" width="62" height="10" fill="#1d4ed8"/>
      <text x="19" y="27" fontSize="9" fontWeight="900" fill="white" letterSpacing="1">ELEC.ENG</text>

      {/* 4 CPU cores — blinking in sequence */}
      {[{x:18,y:44,id:'C1',d:'0s'},{x:46,y:44,id:'C2',d:'0.4s'},{x:18,y:72,id:'C3',d:'0.8s'},{x:46,y:72,id:'C4',d:'1.2s'}].map(c=>(
        <g key={c.id}>
          <rect x={c.x} y={c.y} width="24" height="24" rx="5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" begin={c.d} repeatCount="indefinite"/>
          </rect>
          <text x={c.x+7} y={c.y+16} fontSize="9" fontWeight="800" fill="white">{c.id}</text>
        </g>
      ))}
      {/* Core trace connectors */}
      <line x1="42" y1="56" x2="46" y2="56" stroke="#bfdbfe" strokeWidth="2"/>
      <line x1="42" y1="84" x2="46" y2="84" stroke="#bfdbfe" strokeWidth="2"/>
      <line x1="30" y1="68" x2="30" y2="72" stroke="#bfdbfe" strokeWidth="2"/>
      <line x1="58" y1="68" x2="58" y2="72" stroke="#bfdbfe" strokeWidth="2"/>

      {/* Chip footer */}
      <text x="15" y="107" fontSize="7" fontWeight="900" fill="#1d4ed8" letterSpacing="1.5">ELECTRICAL</text>
      <text x="19" y="120" fontSize="7" fontWeight="700" fill="#3b82f6" letterSpacing="1">ENGINEER</text>

      {/* Left pins × 6 */}
      {[30,46,62,78,94,110].map((y,i)=>(
        <g key={`lp${i}`}>
          <line x1="12" y1={y} x2="3" y2={y} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="1" y={y-4} width="6" height="8" rx="2" fill="#60a5fa"/>
        </g>
      ))}
      {/* Right pins × 6 */}
      {[30,46,62,78,94,110].map((y,i)=>(
        <g key={`rp${i}`}>
          <line x1="74" y1={y} x2="83" y2={y} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
          <rect x="81" y={y-4} width="6" height="8" rx="2" fill="#60a5fa"/>
        </g>
      ))}

      {/* ── DATA WIRE ── */}
      <line x1="88" y1="70" x2="120" y2="70" stroke="#93c5fd" strokeWidth="5" strokeLinecap="round"/>
      <line x1="88" y1="70" x2="120" y2="70" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5,3">
        <animate attributeName="strokeDashoffset" values="16;0" dur="0.7s" repeatCount="indefinite"/>
      </line>
      {/* Particles */}
      {[0, 0.23, 0.46].map((delay,i)=>(
        <circle key={i} r="5" fill={['#1d4ed8','#3b82f6','#93c5fd'][i]}>
          <animateMotion path="M88,70 L120,70" dur="0.7s" begin={`${delay}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0;1;1;0" dur="0.7s" begin={`${delay}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      {/* Arrow */}
      <polyline points="113,62 122,70 113,78" stroke="#1d4ed8" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite"/>
      </polyline>

      {/* ── AWS CLOUD — symmetric, vertically centered at y=70 same as chip ── */}
      <path d="M 112 99 Q 112 83 120 79 Q 116 65 130 61 Q 130 47 144 45 Q 150 37 165 35 Q 180 37 186 45 Q 200 47 200 61 Q 214 65 218 79 Q 218 83 218 99 Q 218 105 210 105 L 120 105 Q 112 105 112 99 Z"
        fill="url(#g1-cloud)" stroke="#2563eb" strokeWidth="2.5">
        <animate attributeName="opacity" values="0.85;1;0.85" dur="2.5s" repeatCount="indefinite"/>
      </path>
      {/* AWS text — centered in cloud */}
      <text x="165" y="77" fontSize="26" fontWeight="900" fill="#1d4ed8" textAnchor="middle">AWS</text>
      {/* Service dot row — 5 dots symmetric around cx=165, cy=94 (bottom of cloud) */}
      {[{cx:131,lb:'EC2',d:'0s'},{cx:148,lb:'S3',d:'0.35s'},{cx:165,lb:'RDS',d:'0.7s'},{cx:182,lb:'λ',d:'1.05s'},{cx:199,lb:'VPC',d:'1.4s'}].map(s=>(
        <g key={s.lb}>
          <circle cx={s.cx} cy="94" r="10" fill="#2563eb">
            <animate attributeName="opacity" values="0.45;1;0.45" dur="2s" begin={s.d} repeatCount="indefinite"/>
            <animate attributeName="r" values="9;11;9" dur="2s" begin={s.d} repeatCount="indefinite"/>
          </circle>
          <text x={s.cx} y="98" fontSize="6.5" fontWeight="900" fill="white" textAnchor="middle">{s.lb}</text>
        </g>
      ))}
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════
   CARD 2 — Cloud is Lego
   220 × 140  |  3 floating service blocks  →  assembled result
════════════════════════════════════════════════════════════ */
function IllustrationLego() {
  // Blocks at y=20 so studs (cy=20, ry=6) + max float (6px) = top at y=8 — safe
  // EC2 x=10, S3 x=80, Lambda x=150 (10px gaps), all 60×52
  // Architecture box below at y=86, height=38
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">

      {/* ── Block: EC2 — center x=40 ── */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="2.2s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" repeatCount="indefinite"/>
        <rect x="10" y="20" width="60" height="52" rx="8" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2.5"/>
        <ellipse cx="28" cy="20" rx="9" ry="6" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
        <ellipse cx="52" cy="20" rx="9" ry="6" fill="#86efac" stroke="#16a34a" strokeWidth="2"/>
        <text x="40" y="48" fontSize="11" fontWeight="900" fill="#166534" textAnchor="middle">🖥 EC2</text>
        <text x="40" y="62" fontSize="8.5" fill="#15803d" fontWeight="600" textAnchor="middle">compute</text>
      </g>

      {/* ── Block: S3 — center x=110 ── */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="2.8s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" repeatCount="indefinite"/>
        <rect x="80" y="20" width="60" height="52" rx="8" fill="#6ee7b7" stroke="#059669" strokeWidth="2.5"/>
        <ellipse cx="98" cy="20" rx="9" ry="6" fill="#34d399" stroke="#059669" strokeWidth="2"/>
        <ellipse cx="122" cy="20" rx="9" ry="6" fill="#34d399" stroke="#059669" strokeWidth="2"/>
        <text x="110" y="48" fontSize="11" fontWeight="900" fill="#065f46" textAnchor="middle">🪣 S3</text>
        <text x="110" y="62" fontSize="8.5" fill="#047857" fontWeight="600" textAnchor="middle">storage</text>
      </g>

      {/* ── Block: Lambda — center x=180 ── */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="2.5s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" repeatCount="indefinite"/>
        <rect x="150" y="20" width="60" height="52" rx="8" fill="#a7f3d0" stroke="#10b981" strokeWidth="2.5"/>
        <ellipse cx="168" cy="20" rx="9" ry="6" fill="#6ee7b7" stroke="#10b981" strokeWidth="2"/>
        <ellipse cx="192" cy="20" rx="9" ry="6" fill="#6ee7b7" stroke="#10b981" strokeWidth="2"/>
        <text x="180" y="48" fontSize="11" fontWeight="900" fill="#065f46" textAnchor="middle">⚡ λ</text>
        <text x="180" y="62" fontSize="8.5" fill="#047857" fontWeight="600" textAnchor="middle">serverless</text>
      </g>

      {/* ── Vertical connecting lines ── */}
      <line x1="40" y1="72" x2="40" y2="86" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,3">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite"/>
      </line>
      <line x1="110" y1="72" x2="110" y2="86" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,3">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" begin="0.3s" repeatCount="indefinite"/>
      </line>
      <line x1="180" y1="72" x2="180" y2="86" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,3">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" begin="0.6s" repeatCount="indefinite"/>
      </line>

      {/* ── Assembled Result ── */}
      <rect x="10" y="86" width="200" height="46" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.5">
        <animate attributeName="opacity" values="0.75;1;0.75" dur="2s" repeatCount="indefinite"/>
      </rect>
      <text x="110" y="106" fontSize="10.5" fontWeight="900" fill="#166534" textAnchor="middle">🏗 Architecture</text>
      <text x="110" y="121" fontSize="8.5" fill="#15803d" fontWeight="600" textAnchor="middle">EC2  +  S3  +  Lambda</text>

      {/* Snap sparkles at junctions */}
      {[[40,86],[110,86],[180,86]].map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r="4" fill="#16a34a">
          <animate attributeName="r" values="3;7;3" dur="1.8s" begin={`${i*0.4}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="1;0;1" dur="1.8s" begin={`${i*0.4}s`} repeatCount="indefinite"/>
        </circle>
      ))}
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════
   CARD 3 — Visual Learning
   220 × 140  |  boring notes ❌  →  eye  →  live diagram ✓
════════════════════════════════════════════════════════════ */
function IllustrationVisual() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">

      {/* ── LEFT: Notes panel ── */}
      <rect x="4" y="8" width="82" height="124" rx="9" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2"/>
      {/* Panel header */}
      <rect x="4" y="8" width="82" height="24" rx="9" fill="#7c3aed"/>
      <rect x="4" y="22" width="82" height="10" fill="#7c3aed"/>
      <text x="11" y="24.5" fontSize="8.5" fontWeight="800" fill="white">📄  Notes.txt</text>
      {/* Text lines — blurred/boring */}
      {[38,50,62,74,86,98,110,122].map((y,i)=>(
        <rect key={i} x="12" y={y} width={i%3===0?54:i%3===1?44:60} height="7" rx="3" fill="#c4b5fd" opacity="0.65"/>
      ))}
      {/* ❌ badge — top right corner of panel */}
      <circle cx="81" cy="12" r="9" fill="#fecaca" stroke="#ef4444" strokeWidth="2">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </circle>
      <line x1="75" y1="7" x2="87" y2="17" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="87" y1="7" x2="75" y2="17" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"/>

      {/* ── CENTER: Animated eye ── */}
      {/* Eye whites */}
      <ellipse cx="110" cy="70" rx="14" ry="10" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="2">
        <animate attributeName="ry" values="10;4;10" dur="3.5s" repeatCount="indefinite"/>
      </ellipse>
      {/* Pupil */}
      <circle cx="110" cy="70" r="6" fill="#6d28d9">
        <animate attributeName="r" values="6;2.5;6" dur="3.5s" repeatCount="indefinite"/>
      </circle>
      {/* Shine */}
      <circle cx="113" cy="67" r="2" fill="white"/>
      {/* Arrow → */}
      <polyline points="126,64 135,70 126,76" stroke="#6d28d9" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>
      </polyline>

      {/* ── RIGHT: Architecture diagram ── */}
      <rect x="138" y="8" width="78" height="124" rx="9" fill="#f5f3ff" stroke="#8b5cf6" strokeWidth="2"/>
      {/* Panel header — centered at x=177 */}
      <rect x="138" y="8" width="78" height="24" rx="9" fill="#6d28d9"/>
      <rect x="138" y="22" width="78" height="10" fill="#6d28d9"/>
      <text x="177" y="24.5" fontSize="8.5" fontWeight="800" fill="white" textAnchor="middle">🏗  Diagram</text>

      {/* ✅ badge — top right corner of panel */}
      <circle cx="211" cy="12" r="9" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
      </circle>
      <polyline points="206,12 210,17 217,7" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Node: User — x=144, width=66, center=177 */}
      <rect x="144" y="34" width="66" height="22" rx="6" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="1.8"/>
      <text x="177" y="49" fontSize="9" fontWeight="800" fill="#5b21b6" textAnchor="middle">👤  User</text>

      {/* Arrow 1 — centered at x=177 */}
      <line x1="177" y1="56" x2="177" y2="68" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/>
      </line>
      <polyline points="172,65 177,70 182,65" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/>
      </polyline>

      {/* Node: ALB — x=144, width=66, center=177 */}
      <rect x="144" y="70" width="66" height="22" rx="6" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1.8"/>
      <text x="177" y="85" fontSize="9" fontWeight="800" fill="#4c1d95" textAnchor="middle">⚖  ALB</text>

      {/* Arrow 2 — centered at x=177 */}
      <line x1="177" y1="92" x2="177" y2="104" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" begin="0.3s" repeatCount="indefinite"/>
      </line>
      <polyline points="172,101 177,106 182,101" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" begin="0.3s" repeatCount="indefinite"/>
      </polyline>

      {/* Node: EC2 cluster — x=144, width=66, center=177 */}
      <rect x="144" y="106" width="66" height="22" rx="6" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.8"/>
      <text x="177" y="121" fontSize="9" fontWeight="800" fill="white" textAnchor="middle">🖥  EC2 × 3</text>
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════
   CARD 4 — Too many subscriptions
   220 × 140  |  3 receipts  →  merge  →  1 unified card
════════════════════════════════════════════════════════════ */
function IllustrationSubscriptions() {
  return (
    <svg width="240" height="162" viewBox="0 0 240 162" fill="none">

      {/* ── LEFT: 3 subscription cards — each 38px tall, 10px gap ── */}

      {/* Udemy — y=6..44 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="2.2s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" repeatCount="indefinite"/>
        <rect x="4" y="6" width="84" height="38" rx="7" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
        <text x="10" y="24" fontSize="9.5" fontWeight="900" fill="#92400e">Udemy</text>
        <text x="10" y="36" fontSize="8" fill="#b45309">Video Course</text>
        <rect x="56" y="10" width="28" height="16" rx="4" fill="#f59e0b"/>
        <text x="70" y="22" fontSize="8.5" fontWeight="900" fill="white" textAnchor="middle">$23+</text>
      </g>

      {/* + centered between y=44 and y=62 */}
      <text x="46" y="57" fontSize="18" fontWeight="900" fill="#fb923c" textAnchor="middle">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite"/>+
      </text>

      {/* YouTube — y=62..100 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-3;0,0" dur="2.7s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" repeatCount="indefinite"/>
        <rect x="4" y="62" width="84" height="38" rx="7" fill="#fee2e2" stroke="#ef4444" strokeWidth="2"/>
        <text x="10" y="80" fontSize="9.5" fontWeight="900" fill="#991b1b">YouTube</text>
        <text x="10" y="92" fontSize="8" fill="#b91c1c">Walk-throughs</text>
        <rect x="56" y="66" width="28" height="16" rx="4" fill="#dc2626"/>
        <text x="70" y="78" fontSize="8.5" fontWeight="900" fill="white" textAnchor="middle">free?</text>
      </g>

      {/* + centered between y=100 and y=118 */}
      <text x="46" y="113" fontSize="18" fontWeight="900" fill="#fb923c" textAnchor="middle">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" begin="0.2s" repeatCount="indefinite"/>+
      </text>

      {/* Dojo — y=118..156 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;0,-4;0,0" dur="2s" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" repeatCount="indefinite"/>
        <rect x="4" y="118" width="84" height="38" rx="7" fill="#ffedd5" stroke="#f97316" strokeWidth="2"/>
        <text x="10" y="136" fontSize="9.5" fontWeight="900" fill="#9a3412">T. Dojo</text>
        <text x="10" y="148" fontSize="8" fill="#c2410c">Practice Tests</text>
        <rect x="56" y="122" width="28" height="16" rx="4" fill="#ea580c"/>
        <text x="70" y="134" fontSize="8.5" fontWeight="900" fill="white" textAnchor="middle">$15</text>
      </g>

      {/* ── MERGE ARROW — centered at y=81 (mid of left area 6..156) ── */}
      <line x1="92" y1="81" x2="108" y2="81" stroke="#f97316" strokeWidth="4" strokeLinecap="round">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite"/>
      </line>
      <polyline points="102,73 110,81 102,89" stroke="#ea580c" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite"/>
      </polyline>

      {/* ── CertiPrepAI result card — y=6..156, height=150 ── */}
      <rect x="114" y="6" width="122" height="150" rx="12" fill="#fff7ed" stroke="#ea580c" strokeWidth="2.5">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="2.5s" repeatCount="indefinite"/>
      </rect>
      {/* Header */}
      <rect x="114" y="6" width="122" height="32" rx="12" fill="#ea580c"/>
      <rect x="114" y="28" width="122" height="10" fill="#ea580c"/>
      <text x="175" y="27" fontSize="11.5" fontWeight="900" fill="white" textAnchor="middle">CertiPrepAI</text>

      {/* Feature rows — 20px spacing, comfortable padding */}
      {[
        {y:62, t:'✓  Practice Questions'},
        {y:84, t:'✓  Mock Exams'},
        {y:106, t:'✓  Visual Diagrams'},
        {y:128, t:'✓  Explanations'},
      ].map((f,i)=>(
        <text key={i} x="124" y={f.y} fontSize="9.5" fontWeight="700" fill="#c2410c">
          {f.t}
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin={`${i*0.35}s`} repeatCount="indefinite"/>
        </text>
      ))}

      {/* "1 tab" badge — 6px margin from card bottom */}
      <rect x="118" y="133" width="112" height="16" rx="7" fill="#16a34a">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite"/>
      </rect>
      <text x="174" y="145" fontSize="9" fontWeight="900" fill="white" textAnchor="middle">1 tab. Everything. ✓</text>
    </svg>
  )
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const faqs = [
    { q: 'Can I try before buying?', a: 'Yes — create a free account and get 20 questions. No credit card needed. See the quality before you pay.' },
    { q: "What's the pass rate for AWS exams?", a: "AWS exams require 72% or higher. My questions are scenario-based and match the real exam difficulty — the same style you'll face on test day." },
    { q: 'Does Lifetime include future certs?', a: 'Yes. Every new AWS certification I add is automatically included in your Lifetime plan at no extra cost, forever.' },
    { q: 'Can I cancel Monthly or Yearly anytime?', a: 'Absolutely. Cancel from your dashboard with one click. No cancellation fees, no questions asked.' },
    { q: 'How do explanations work?', a: 'Every question includes a detailed explanation of why the correct answer is right and why the others are wrong — written in plain English, not AWS jargon.' },
  ]

  const features = [
    { icon: '📝', title: '3,958 Questions', desc: '260 per cert across all 12 AWS certifications, updated regularly', color: '#eff6ff', border: '#bfdbfe' },
    { icon: '⏱️', title: 'Mock Exams', desc: '65-question timed tests that mirror the real exam format exactly', color: '#f0fdf4', border: '#bbf7d0' },
    { icon: '💡', title: 'Instant Explanations', desc: 'Every answer explained — learn why options are right or wrong', color: '#faf5ff', border: '#e9d5ff' },
    { icon: '🎯', title: 'Domain Filtering', desc: 'Filter by exam domain to focus on your weakest areas first', color: '#fff7ed', border: '#fed7aa' },
    { icon: '🏗️', title: 'Architecture Builder', desc: 'Drag-and-drop AWS diagrams — learn by building, not just reading', color: '#eff6ff', border: '#bfdbfe' },
    { icon: '🖼️', title: 'Visual Exam', desc: 'Diagram-based questions so you see the problem, not just read it', color: '#f0fdf4', border: '#bbf7d0' },
  ]

  const certs = [
    { code: 'CLF-C02', name: 'Cloud Practitioner', level: 'Foundational', color: '#dcfce7', text: '#15803d' },
    { code: 'AIF-C01', name: 'AI Practitioner', level: 'Foundational', color: '#dcfce7', text: '#15803d' },
    { code: 'SAA-C03', name: 'Solutions Architect Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'DVA-C02', name: 'Developer Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'SOA-C02', name: 'SysOps Administrator', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'DEA-C01', name: 'Data Engineer Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'MLA-C01', name: 'ML Engineer Associate', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'GAI-C01', name: 'Generative AI Developer', level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
    { code: 'SAP-C02', name: 'Solutions Architect Pro', level: 'Professional', color: '#ede9fe', text: '#6d28d9' },
    { code: 'DOP-C02', name: 'DevOps Engineer Pro', level: 'Professional', color: '#ede9fe', text: '#6d28d9' },
    { code: 'SCS-C03', name: 'Security Specialty', level: 'Specialty', color: '#fce7f3', text: '#be185d' },
    { code: 'ANS-C01', name: 'Advanced Networking', level: 'Specialty', color: '#fce7f3', text: '#be185d' },
  ]

  const stats = [
    { value: '3,958', label: 'Practice Questions' },
    { value: '12', label: 'AWS Certifications' },
    { value: '72%', label: 'Pass Mark Required' },
    { value: '4', label: 'Exam Levels' },
  ]

  return (
    <Layout>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)', padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '10%', width: '400px', height: '400px', background: 'rgba(96,165,250,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '10%', width: '300px', height: '300px', background: 'rgba(139,92,246,0.1)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Built by an engineer, for engineers</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Hi, I'm Ihab.<br />This is why I built CertiPrepAI.
          </h1>
          <p style={{ color: '#93c5fd', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 3rem' }}>
            An electrical engineer shifting into cloud — and tired of paying for five different things just to study for one exam.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 600, marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* ── My Story ── */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '1.5rem' }}>My Story</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Card 1 */}
            <div style={{ background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)', border: '1px solid #bfdbfe', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#1d4ed8', marginBottom: '0.5rem', fontSize: '1rem' }}>From Electrical Engineering to Cloud</h3>
                <p style={{ color: '#1e40af', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  I'm originally an electrical engineer. Like a lot of engineers today, I realized that to shift my career and stay relevant, I needed to go deep into cloud engineering and backend. That meant AWS certifications — and that meant studying.
                </p>
              </div>
              <div style={{ flexShrink: 0 }}><IllustrationElectrical /></div>
            </div>

            {/* Card 2 */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#15803d', marginBottom: '0.5rem', fontSize: '1rem' }}>Cloud is Lego — and I love Lego</h3>
                <p style={{ color: '#166534', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  My personal take: to succeed in cloud, you need to be good at building Lego and genuinely love finding solutions to problems. You need to be solutions-oriented. Cloud architecture is exactly that — you take pieces, understand how they connect, and build something that works. That mindset is everything.
                </p>
              </div>
              <div style={{ flexShrink: 0 }}><IllustrationLego /></div>
            </div>

            {/* Card 3 */}
            <div style={{ background: 'linear-gradient(135deg, #faf5ff, #ede9fe)', border: '1px solid #e9d5ff', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#6d28d9', marginBottom: '0.5rem', fontSize: '1rem' }}>I learn by seeing, not just reading</h3>
                <p style={{ color: '#5b21b6', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  I personally learn best when I can see the problem and visualize the solution — understanding what the elements are and how they fit together. That's exactly why I built the Visual Exam and the Architecture Builder. I wanted to see the architecture, not just memorize bullet points about it.
                </p>
              </div>
              <div style={{ flexShrink: 0 }}><IllustrationVisual /></div>
            </div>

            {/* Card 4 */}
            <div style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '1px solid #fed7aa', borderRadius: '1.25rem', padding: '1.75rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 800, color: '#c2410c', marginBottom: '0.5rem', fontSize: '1rem' }}>The real problem: too many tabs, too many subscriptions</h3>
                <p style={{ color: '#9a3412', lineHeight: 1.75, margin: 0, fontSize: '0.925rem' }}>
                  When I started studying, the typical path looked like this: a Udemy course — which is genuinely great, easily worth more than $23 — then YouTube to find someone walking through exam questions, then a platform like Dojo for more practice. These are all legitimate, high-quality resources. My only problem wasn't the quality — it was the fragmentation. Suddenly you've paid for three separate things and you're still jumping between tabs. I built CertiPrepAI to bring everything into one place: the questions, the explanations, the diagrams, and the resources — so you can focus on learning, not on managing five browser tabs.
                </p>
              </div>
              <div style={{ flexShrink: 0 }}><IllustrationSubscriptions /></div>
            </div>

          </div>
        </div>

        {/* ── What I Built ── */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '1.25rem' }}>What I Built Into It</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3.5rem' }}>
          {features.map((f, i) => (
            <div key={f.title}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={{
                background: hoveredFeature === i ? f.color : '#fff',
                border: `1px solid ${hoveredFeature === i ? f.border : '#e5e7eb'}`,
                borderRadius: '1rem', padding: '1.25rem',
                transition: 'all 0.2s', cursor: 'default',
                transform: hoveredFeature === i ? 'translateY(-3px)' : 'none',
                boxShadow: hoveredFeature === i ? '0 8px 24px rgba(0,0,0,0.08)' : 'none',
              }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.625rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem', marginBottom: '0.375rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Certifications ── */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '0.5rem' }}>12 Certifications Covered</h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.25rem' }}>All active AWS certification paths — from Foundational to Specialty.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            { level: 'Foundational', color: '#dcfce7', text: '#15803d' },
            { level: 'Associate', color: '#dbeafe', text: '#1d4ed8' },
            { level: 'Professional', color: '#ede9fe', text: '#6d28d9' },
            { level: 'Specialty', color: '#fce7f3', text: '#be185d' },
          ].map(l => (
            <div key={l.level} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: l.color, border: `1px solid ${l.text}40` }} />
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{l.level}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3.5rem' }}>
          {certs.map(cert => (
            <span key={cert.code} style={{ padding: '0.4rem 0.875rem', background: cert.color, borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, color: cert.text, border: `1px solid ${cert.text}30` }}>
              {cert.code} · {cert.name}
            </span>
          ))}
        </div>

        {/* ── FAQ ── */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '1.25rem' }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '3.5rem' }}>
          {faqs.map((faq, i) => (
            <div key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ background: '#fff', border: `1px solid ${openFaq === i ? '#bfdbfe' : '#e5e7eb'}`, borderRadius: '0.875rem', padding: '1.1rem 1.25rem', cursor: 'pointer', transition: 'border-color 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '0.9rem' }}>{faq.q}</p>
                <span style={{ color: '#3b82f6', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0, transition: 'transform 0.2s', display: 'inline-block', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </div>
              {openFaq === i && (
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.75rem 0 0', lineHeight: 1.65 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ background: 'linear-gradient(160deg, #0f172a, #1e3a8a)', borderRadius: '1.5rem', padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', left: '20%', width: '200px', height: '200px', background: 'rgba(96,165,250,0.15)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', marginBottom: '0.75rem' }}>Stop juggling tabs. Start here.</h2>
            <p style={{ color: '#93c5fd', marginBottom: '2rem', fontSize: '1rem' }}>
              Everything you need to pass your AWS exam — in one place.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ padding: '0.875rem 2rem', background: '#2563eb', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}>
                Create Free Account
              </Link>
              <Link to="/pricing" style={{ padding: '0.875rem 2rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '0.875rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>
                View Plans →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
