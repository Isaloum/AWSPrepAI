import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const certs = [
  { id: 'clf-c02', icon: '☁️', name: 'Cloud Practitioner', code: 'CLF-C02', level: 'foundation', forRole: 'IT managers, sales, non-technical roles new to cloud', salary: '$95K–$115K', domains: ['Cloud Concepts','Security','Technology','Billing'] },
  { id: 'aif-c01', icon: '🤖', name: 'AI Practitioner', code: 'AIF-C01', level: 'foundation', forRole: 'Anyone exploring AI/ML on AWS — no ML background needed', salary: '$105K–$130K', domains: ['AI Fundamentals','ML Concepts','Generative AI','Responsible AI'] },
  { id: 'saa-c03', icon: '🏗️', name: 'Solutions Architect Associate', code: 'SAA-C03', level: 'associate', forRole: 'Cloud architects, DevOps engineers, backend developers', salary: '$130K–$160K', domains: ['Secure 30%','Resilient 26%','Performant 24%','Cost 20%'] },
  { id: 'dva-c02', icon: '💻', name: 'Developer Associate', code: 'DVA-C02', level: 'associate', forRole: 'Software developers building and deploying on AWS', salary: '$125K–$155K', domains: ['Development','Security','Deployment','Troubleshooting'] },
  { id: 'soa-c02', icon: '⚙️', name: 'SysOps Administrator', code: 'SOA-C02', level: 'associate', forRole: 'System admins and ops engineers managing AWS infrastructure', salary: '$120K–$150K', domains: ['Monitoring','Reliability','Deployment','Networking'] },
  { id: 'dea-c01', icon: '📊', name: 'Data Engineer Associate', code: 'DEA-C01', level: 'associate', forRole: 'Data engineers building pipelines and analytics on AWS', salary: '$130K–$160K', domains: ['Ingestion','Data Store','Operations','Security'] },
  { id: 'mla-c01', icon: '🧠', name: 'ML Engineer Associate', code: 'MLA-C01', level: 'associate', forRole: 'ML engineers deploying and operationalizing models on AWS', salary: '$145K–$175K', domains: ['Data Preparation','Model Development','Deployment','Monitoring'] },
  { id: 'gai-c01', icon: '✨', name: 'Generative AI Developer', code: 'GAI-C01', level: 'associate', forRole: 'Developers building generative AI apps with Bedrock & LLMs', salary: '$150K–$185K', domains: ['Gen AI Fundamentals','Bedrock','Foundation Models','Responsible AI'] },
  { id: 'sap-c02', icon: '🏆', name: 'Solutions Architect Professional', code: 'SAP-C02', level: 'professional', forRole: 'Senior architects designing complex, multi-account AWS environments', salary: '$165K–$200K', domains: ['Complex Org Design','New Solutions','Migration','Cost Optimization'] },
  { id: 'dop-c02', icon: '🔧', name: 'DevOps Engineer Professional', code: 'DOP-C02', level: 'professional', forRole: 'DevOps engineers automating CI/CD and cloud operations at scale', salary: '$160K–$195K', domains: ['SDLC Automation','Config & Incident','Monitoring','High Availability'] },
  { id: 'scs-c03', icon: '🔒', name: 'Security Specialty', code: 'SCS-C03', level: 'specialty', forRole: 'Security engineers and compliance-focused cloud professionals', salary: '$155K–$190K', domains: ['Threat Detection','IAM','Data Protection','Infrastructure'] },
  { id: 'ans-c01', icon: '🌐', name: 'Advanced Networking Specialty', code: 'ANS-C01', level: 'specialty', forRole: 'Network engineers designing hybrid and advanced VPC architectures', salary: '$150K–$185K', domains: ['Network Design','Implementation','Management','Security'] },
]

const levelColors: Record<string, string> = {
  foundation: 'bg-blue-100 text-blue-700',
  associate: 'bg-green-100 text-green-700',
  professional: 'bg-purple-100 text-purple-700',
  specialty: 'bg-orange-100 text-orange-700',
}

const paths = [
  { icon: '☁️', label: 'New to cloud → CLF-C02' },
  { icon: '🏗️', label: 'Architect / DevOps → SAA-C03' },
  { icon: '💻', label: 'Developer → DVA-C02' },
  { icon: '🔒', label: 'Security role → SCS-C03' },
  { icon: '🤖', label: 'AI / ML track → AIF-C01 → MLA-C01' },
]

type Level = 'all' | 'foundation' | 'associate' | 'professional' | 'specialty'

export default function Certifications() {
  const [filter, setFilter] = useState<Level>('all')
  const navigate = useNavigate()

  const filtered = filter === 'all' ? certs : certs.filter(c => c.level === filter)

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">☁️ Choose Your AWS Certification</h1>
          <p className="text-gray-500 max-w-xl mx-auto">High-quality scenario-based questions for every active AWS certification.</p>
          <div className="flex justify-center gap-8 mt-4">
            <div className="text-center"><div className="text-2xl font-black text-blue-600">3,120</div><div className="text-xs text-gray-400 uppercase font-semibold">Questions</div></div>
            <div className="text-center"><div className="text-2xl font-black text-blue-600">12</div><div className="text-xs text-gray-400 uppercase font-semibold">Certs Live</div></div>
            <div className="text-center"><div className="text-2xl font-black text-blue-600">90</div><div className="text-xs text-gray-400 uppercase font-semibold">Min Mock Exam</div></div>
          </div>
        </div>

        {/* Which cert banner */}
        <div className="bg-gray-900 rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div>
            <h3 className="text-white font-bold text-base">🤔 Not sure which cert to pick?</h3>
            <p className="text-gray-400 text-sm">Start with the path that matches your role — each leads to a salary bump.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {paths.map((p, i) => (
              <span key={i} className="bg-white/10 border border-white/20 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full">{p.icon} {p.label}</span>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {(['all','foundation','associate','professional','specialty'] as Level[]).map(l => (
            <button key={l} onClick={() => setFilter(l)} className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${filter === l ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>{l}</button>
          ))}
        </div>

        {/* Cert grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filtered.map(cert => (
            <div key={cert.id} onClick={() => navigate(`/cert/${cert.id}`)}
              className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col">
              <div className="text-3xl mb-2">{cert.icon}</div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize w-fit mb-2 ${levelColors[cert.level]}`}>{cert.level}</span>
              <h3 className="font-bold text-gray-900 mb-0.5 leading-snug">{cert.name}</h3>
              <p className="text-blue-600 text-xs font-bold mb-2">{cert.code}</p>
              <p className="text-xs text-gray-500 mb-2 leading-relaxed"><span className="font-semibold text-gray-700">Best for:</span> {cert.forRole}</p>
              <span className="inline-block bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2 py-1 rounded-lg mb-3">💰 {cert.salary}</span>
              <div className="flex flex-wrap gap-1 mt-auto mb-3">
                {cert.domains.map(d => <span key={d} className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">{d}</span>)}
              </div>
              <button className="w-full py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors mt-auto">
                Start Practicing →
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
