/**
 * AifGuide.tsx — The Complete AIF-C01 Study Encyclopedia
 * Tabs: Decision Matrix · Exam Traps · Deep Dives · Study Plan · Quick Reference · Exam Strategy
 * Cert-based gating via useCertAccess('aif-c01'). AIF-C01 exclusive.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
import { useCertAccess } from '../hooks/useCertAccess'

type Tab = 'matrix' | 'traps' | 'deepdives' | 'studyplan' | 'reference' | 'strategy' | 'codex'

const STORAGE_KEY = 'certiprepai-aif-study-plan'

// ─── DECISION MATRIX ─────────────────────────────────────────────────────────
interface MatrixRow { requirement: string; solution: string; why: string }

const MATRIX: MatrixRow[] = [
  { requirement: 'Text generation, summarization, Q&A with no infrastructure', solution: 'Amazon Bedrock', why: 'Managed FM API. Access Claude, Titan, Llama, Mistral via API — no servers to manage.' },
  { requirement: 'Custom ML model training and hosting', solution: 'Amazon SageMaker', why: 'Full MLOps platform. Use when you need to train your own model from scratch.' },
  { requirement: 'Augment FM with company data without retraining', solution: 'RAG + Bedrock Knowledge Bases', why: 'Retrieves relevant docs at inference time. Cheaper and more current than fine-tuning.' },
  { requirement: 'Adapt FM to specific domain style or format', solution: 'Bedrock Fine-tuning', why: 'Adjusts model weights for specialized tasks. Use for tone/style, NOT for knowledge updates.' },
  { requirement: 'Build AI agent that queries APIs and takes actions', solution: 'Bedrock Agents', why: 'Orchestrates multi-step workflows. Calls action groups (Lambda), retrieves from Knowledge Bases.' },
  { requirement: 'Block competitor mentions in model responses', solution: 'Bedrock Guardrails — Denied Topics', why: 'Infrastructure-level content filtering. Cannot be bypassed by prompt tricks.' },
  { requirement: 'Redact PII from model responses', solution: 'Bedrock Guardrails — Sensitive Information', why: 'Detects and masks names, SSNs, credit cards, medical data in model output.' },
  { requirement: 'Prevent hallucination in RAG responses', solution: 'Bedrock Guardrails — Grounding Check', why: 'Scores how faithful the response is to the retrieved context. Blocks low-score responses.' },
  { requirement: 'Extract text and structure from documents/forms', solution: 'Amazon Textract', why: 'OCR + structured extraction. Handles tables, forms, checkboxes — not just raw text.' },
  { requirement: 'Sentiment analysis, entity detection, key phrases', solution: 'Amazon Comprehend', why: 'Managed NLP service. No ML expertise needed. HIPAA-eligible.' },
  { requirement: 'Speech to text transcription', solution: 'Amazon Transcribe', why: 'Managed ASR. Custom vocabulary, speaker diarization, medical variant available.' },
  { requirement: 'Text to speech', solution: 'Amazon Polly', why: 'Neural TTS. 60+ voices, 30+ languages. SSML support for pronunciation control.' },
  { requirement: 'Image and video analysis — objects, faces, moderation', solution: 'Amazon Rekognition', why: 'Pre-trained CV models. Real-time and batch analysis. No CV expertise needed.' },
  { requirement: 'Build a conversational chatbot with NLU', solution: 'Amazon Lex', why: 'Same NLU as Alexa. Intent recognition + slot filling. Integrates with Lambda for fulfillment.' },
  { requirement: 'Intelligent enterprise search over documents', solution: 'Amazon Kendra', why: 'ML-powered search with natural language queries. Reads S3, SharePoint, Confluence, etc.' },
  { requirement: 'Product or content recommendations', solution: 'Amazon Personalize', why: 'Real-time personalization ML. Trains on your interaction data — no ML skills required.' },
  { requirement: 'Time series forecasting', solution: 'Amazon Forecast', why: 'AutoML for time-series. Related datasets improve accuracy over pure time-series models.' },
  { requirement: 'Translate text between languages', solution: 'Amazon Translate', why: 'Neural MT. 75+ languages. Custom terminology for domain-specific words.' },
  { requirement: 'Store and query document embeddings for semantic search', solution: 'OpenSearch with k-NN or Aurora pgvector', why: 'Vector similarity search. OpenSearch scales; Aurora pgvector integrates with existing RDS.' },
  { requirement: 'Detect bias in ML model predictions', solution: 'SageMaker Clarify', why: 'Pre-training and post-training bias detection. Generates explainability reports.' },
  { requirement: 'Human review of low-confidence AI predictions', solution: 'Amazon Augmented AI (A2I)', why: 'Human-in-the-loop workflows. Integrates with Rekognition and Textract natively.' },
  { requirement: 'Label training data at scale', solution: 'SageMaker Ground Truth', why: 'Active learning reduces labeling cost. Human + automated labeling pipeline.' },
  { requirement: 'Batch process many FM prompts at lower cost', solution: 'Bedrock Batch Inference', why: 'Async processing. Up to 50% cheaper than on-demand. For non-real-time workloads.' },
  { requirement: 'Multi-modal input — text + image in same prompt', solution: 'Bedrock with Claude 3 / Amazon Nova', why: 'Multi-modal FMs accept image + text. Nova Pro and Claude 3 Sonnet support vision.' },
  { requirement: 'Evaluate FM output quality automatically', solution: 'Bedrock Model Evaluation', why: 'Built-in eval jobs with automated metrics + human review. Compare models side-by-side.' },
  { requirement: 'AI coding assistant in IDE', solution: 'Amazon Q Developer', why: 'Code suggestions, security scans, test generation. Formerly CodeWhisperer.' },
  { requirement: 'Business Q&A over enterprise data', solution: 'Amazon Q Business', why: 'Connects to 40+ data sources. Role-based access controls on answers.' },
  { requirement: 'Cheapest FM for simple classification or extraction', solution: 'Claude Haiku / Amazon Titan Lite', why: 'Smallest, fastest, cheapest models. Always use smallest model that meets your quality bar.' },
  { requirement: 'Highest quality reasoning for complex tasks', solution: 'Claude 3.5 Sonnet / Amazon Nova Pro', why: 'Best performance at higher cost. Reserve for tasks where quality outweighs cost.' },
  { requirement: 'Deploy FM inside your own VPC', solution: 'SageMaker JumpStart', why: 'Deploy open-source FMs (Llama, Mistral) into your own infrastructure. Full data isolation.' },
  // ── SageMaker tooling ──
  { requirement: 'Build ML model without writing any code — business analyst use case', solution: 'SageMaker Canvas', why: 'Visual no-code ML tool. Import CSV, join datasets, auto-train classification or regression model — no data science skills needed. Point-and-click from data to prediction.' },
  { requirement: 'Visual data preparation and cleaning before ML training — no code', solution: 'SageMaker Data Wrangler', why: '300+ built-in data transforms. Import, explore, clean, and prepare datasets visually. Exports directly to S3 or feeds a SageMaker training job. Separate from Canvas (prep only, not training).' },
  { requirement: 'Offline batch predictions on a large dataset — no real-time endpoint needed', solution: 'SageMaker Batch Transform', why: 'Runs inference on an entire S3 dataset using a temporary fleet. No persistent endpoint — cost-effective for overnight or scheduled jobs. Results saved back to S3. Not for real-time use cases.' },
  // ── Pre-built AI services ──
  { requirement: 'Call center audio — transcription + sentiment + PII redaction + agent insights', solution: 'Amazon Transcribe Call Analytics', why: 'Optimized for call center audio. Produces transcripts, extracts call sentiment, non-talk time, interruption rate, and redacts PII (SSN, card numbers). Separate from standard Transcribe.' },
  { requirement: 'Cloud contact center with integrated chatbot and voice bot', solution: 'Amazon Connect + Amazon Lex', why: 'Connect = omnichannel contact center (chat, voice, email). Lex provides NLU intent recognition for bots. Polly provides TTS responses. Full call center deployable in minutes on AWS.' },
  { requirement: 'Computer vision on existing on-premises IP cameras — no cloud streaming', solution: 'AWS Panorama', why: 'Hardware appliance + SDK. Runs CV models locally at the edge, analyzing video without sending it to the cloud. Low latency for real-time factory quality control or security monitoring.' },
  { requirement: 'Human labeling / crowdsourced annotation for training data', solution: 'Amazon Mechanical Turk (MTurk)', why: 'Crowdsourcing marketplace for human intelligence tasks (data labeling, content moderation, survey). SageMaker Ground Truth can use MTurk as its human workforce for labeling pipelines.' },
]

// ─── EXAM TRAPS ───────────────────────────────────────────────────────────────
interface Trap {
  title: string; icon: string; trigger: string
  wrong: string; wrongWhy: string
  correct: string; correctWhy: string; tip: string
}

const TRAPS: Trap[] = [
  {
    title: 'RAG vs Fine-tuning — knowledge vs style',
    icon: '🧠',
    trigger: '"adapt model to our company data" or "model doesn\'t know about our products"',
    wrong: 'Fine-tune the model on company documents',
    wrongWhy: 'Fine-tuning bakes knowledge into weights at training time. It becomes stale immediately and costs thousands of dollars to repeat.',
    correct: 'RAG with Bedrock Knowledge Bases',
    correctWhy: 'Retrieves live company data at inference time. Always current. No retraining needed. 10-100x cheaper.',
    tip: 'RAG = knowledge updates. Fine-tuning = style/format/behavior changes. If the question mentions "current data" or "up-to-date" → RAG always wins.',
  },
  {
    title: 'Bedrock vs SageMaker — managed vs custom',
    icon: '🏗️',
    trigger: '"use foundation models without managing servers" or "call a pre-built AI model via API"',
    wrong: 'Amazon SageMaker',
    wrongWhy: 'SageMaker is for training and hosting custom models. It requires ML expertise, infrastructure setup, and model management.',
    correct: 'Amazon Bedrock',
    correctWhy: 'Bedrock is the serverless FM API. You call Claude, Titan, Llama via API — zero infrastructure. Bedrock = managed FMs.',
    tip: 'SageMaker = build/train/host YOUR model. Bedrock = use AMAZON\'S or third-party FMs via API. Never confuse these two on the exam.',
  },
  {
    title: 'Temperature vs Top-P — which controls creativity',
    icon: '🌡️',
    trigger: '"make the model more deterministic" or "reduce randomness in responses"',
    wrong: 'Decrease Top-P to 0',
    wrongWhy: 'Top-P (nucleus sampling) controls vocabulary breadth — how many tokens are considered. It\'s a secondary creativity control.',
    correct: 'Decrease Temperature toward 0',
    correctWhy: 'Temperature is the primary randomness lever. Temperature = 0 → most deterministic, always picks highest probability token.',
    tip: 'Temperature = how wild the model is. Top-P = how many words it considers. For determinism → Temperature. For focused vocab → Top-P. Temperature is tested more.',
  },
  {
    title: 'Guardrails vs IAM — content vs access',
    icon: '🛡️',
    trigger: '"prevent model from discussing competitor products" or "block harmful topics in responses"',
    wrong: 'IAM policy or resource-based policy',
    wrongWhy: 'IAM controls who can call AWS APIs. It cannot read or filter what a model says in its response.',
    correct: 'Bedrock Guardrails — Denied Topics',
    correctWhy: 'Guardrails inspect model input and output. Denied Topics block specific subject matter at the infrastructure level before responses reach users.',
    tip: 'IAM = who can USE the service. Guardrails = what the model can SAY. Completely different layers. Topic blocking always → Guardrails.',
  },
  {
    title: 'Hallucination — cause and fix',
    icon: '👻',
    trigger: '"model is making up facts" or "responses aren\'t grounded in our documents"',
    wrong: 'Decrease temperature to reduce creativity',
    wrongWhy: 'Hallucination is a knowledge gap problem. The model invents facts because it doesn\'t have the right information — temperature doesn\'t fix this.',
    correct: 'Implement RAG + Bedrock Guardrails Grounding Check',
    correctWhy: 'RAG provides real source documents. Grounding Check scores faithfulness of the response to those documents and blocks low-score answers.',
    tip: 'Temperature ≠ hallucination fix. Hallucination = knowledge problem → fix with RAG + Grounding Check. One of the most common AIF-C01 traps.',
  },
  {
    title: 'Knowledge Bases vs Agents — retrieve vs act',
    icon: '🤖',
    trigger: '"automatically query our database AND send an email based on the result"',
    wrong: 'Bedrock Knowledge Bases',
    wrongWhy: 'Knowledge Bases only retrieve and return information. They cannot take actions, call APIs, write to databases, or send emails.',
    correct: 'Bedrock Agents',
    correctWhy: 'Agents orchestrate multi-step workflows. They call action groups (Lambda functions), query Knowledge Bases, and chain multiple steps together.',
    tip: 'Knowledge Bases = read only. Agents = read + act. If the scenario involves DOING something (calling API, writing data, sending notification) → Agents.',
  },
  {
    title: 'Embeddings vs Raw text for semantic search',
    icon: '🔍',
    trigger: '"find documents similar in meaning to a user query" or "semantic search"',
    wrong: 'Store raw text in DynamoDB and use keyword search',
    wrongWhy: 'Keyword search matches exact words. "automobile" and "car" would not match. DynamoDB has no vector search capability.',
    correct: 'Convert to embeddings → store in vector store (OpenSearch k-NN / Aurora pgvector)',
    correctWhy: 'Embeddings capture semantic meaning. Similar concepts are close in vector space regardless of exact words used.',
    tip: '"Semantic search" or "find similar meaning" always points to embeddings + vector store. Keyword search is NOT semantic search.',
  },
  {
    title: 'Responsible AI — bias fix',
    icon: '⚖️',
    trigger: '"ensure our model doesn\'t discriminate" or "hiring AI shows bias toward certain groups"',
    wrong: 'Add more training data to fix bias',
    wrongWhy: 'If the additional data has the same bias patterns, adding more data amplifies rather than fixes the problem.',
    correct: 'SageMaker Clarify for bias detection + human review workflow (A2I)',
    correctWhy: 'Clarify detects pre/post-training bias with statistical measures. A2I adds human oversight for high-stakes decisions.',
    tip: 'More data ≠ less bias. You need bias DETECTION first (Clarify), then targeted data correction + human oversight (A2I). Both are tested.',
  },
  {
    title: 'Prompt injection — user manipulating the AI',
    icon: '💉',
    trigger: '"user is overriding the system prompt" or "adversarial input hijacking the AI\'s behavior"',
    wrong: 'Validate user input with Lambda before sending to model',
    wrongWhy: 'Input validation catches known patterns but prompt injection uses novel, creative phrasing that regex or rule-based checks miss.',
    correct: 'Bedrock Guardrails + system prompt isolation + least-privilege action groups',
    correctWhy: 'Guardrails provide infrastructure-level filtering. System prompt in separate API field (not concatenated). Agents with minimal permissions limit blast radius.',
    tip: 'Prompt injection = attacker controlling the model through crafted input. Defense = Guardrails + proper prompt architecture + minimal agent permissions.',
  },
  {
    title: 'RLHF vs Prompt Engineering — improvement without retraining',
    icon: '🎯',
    trigger: '"improve response quality without retraining the model"',
    wrong: 'RLHF (Reinforcement Learning from Human Feedback)',
    wrongWhy: 'RLHF IS a retraining technique. It requires a reward model and additional training runs — expensive and time-consuming.',
    correct: 'Prompt engineering — few-shot examples, chain-of-thought, system prompt tuning',
    correctWhy: 'Prompt engineering changes model behavior with zero model changes. Few-shot examples guide format and quality at inference time.',
    tip: '"Without retraining" → prompt engineering always. RLHF, fine-tuning, and continued pre-training all involve retraining. Know the distinction.',
  },
  {
    title: 'Token cost optimization',
    icon: '💰',
    trigger: '"reduce cost of FM calls" or "API costs are too high"',
    wrong: 'Use a smaller context window',
    wrongWhy: 'Context window is a model capability limit, not a cost dial you set. Truncating context randomly degrades quality unpredictably.',
    correct: 'Use smaller model (Haiku/Lite) + optimize prompt efficiency + Batch Inference for async workloads',
    correctWhy: 'Model size is the #1 cost driver. Concise prompts reduce input tokens. Batch Inference cuts costs up to 50% for non-real-time jobs.',
    tip: 'Cost levers in order: (1) smaller model, (2) fewer tokens in prompt, (3) Batch Inference. Context window ≠ cost control.',
  },
  {
    title: 'Continued pre-training vs Instruction fine-tuning',
    icon: '📚',
    trigger: '"model doesn\'t understand our industry terminology" vs "model doesn\'t follow our response format"',
    wrong: 'Same fine-tuning approach for both',
    wrongWhy: 'These are different problems requiring different fine-tuning types. Using the wrong type wastes compute and produces poor results.',
    correct: 'Domain terminology → Continued pre-training. Response format/style → Instruction fine-tuning',
    correctWhy: 'Continued pre-training exposes model to domain text to learn vocabulary. Instruction fine-tuning trains on input→output pairs to shape behavior.',
    tip: 'Domain knowledge gaps → continued pre-training. Behavior/format issues → instruction fine-tuning. Both still lose to RAG for factual knowledge updates.',
  },
]

// ─── DEEP DIVES ────────────────────────────────────────────────────────────────
interface DeepDive { id: string; icon: string; title: string; badge: string; summary: string }

const DEEP_DIVES: DeepDive[] = [
  { id: 'fm_basics', icon: '🧠', title: 'Foundation Models — How They Work', badge: '3–4 questions', summary: 'Transformers, tokens, parameters, training vs inference, emergent capabilities.' },
  { id: 'bedrock_arch', icon: '🏗️', title: 'Amazon Bedrock Architecture', badge: '4–5 questions', summary: 'Model access, API patterns, on-demand vs provisioned throughput, cross-region inference.' },
  { id: 'rag', icon: '📚', title: 'RAG — Retrieval Augmented Generation', badge: '4–5 questions', summary: 'Embed → store → retrieve → augment → generate pipeline. When to use vs fine-tuning.' },
  { id: 'finetuning', icon: '🎛️', title: 'Fine-tuning Decision Framework', badge: '2–3 questions', summary: 'Continued pre-training vs instruction fine-tuning. When neither is the answer.' },
  { id: 'kb', icon: '🗄️', title: 'Bedrock Knowledge Bases', badge: '3–4 questions', summary: 'Chunking strategies, embedding models, vector store options, sync schedules.' },
  { id: 'agents', icon: '🤖', title: 'Bedrock Agents', badge: '2–3 questions', summary: 'Action groups, Lambda integration, memory, orchestration trace, agent collaboration.' },
  { id: 'guardrails', icon: '🛡️', title: 'Bedrock Guardrails — All 5 Types', badge: '3–4 questions', summary: 'Content filters, Denied Topics, Word Filters, Sensitive Info, Grounding Check.' },
  { id: 'prompt_eng', icon: '✍️', title: 'Prompt Engineering Techniques', badge: '3–4 questions', summary: 'Zero-shot, few-shot, CoT, ReAct, Prompt Chaining. System vs user message.' },
  { id: 'inference', icon: '⚙️', title: 'Inference Parameters', badge: '2–3 questions', summary: 'Temperature, Top-P, Top-K, Max Tokens, Stop Sequences, Repetition Penalty.' },
  { id: 'ai_services', icon: '🔧', title: 'AWS AI Services — Full Map', badge: '3–4 questions', summary: 'Rekognition, Comprehend, Transcribe, Polly, Textract, Lex, Kendra, Personalize, Forecast.' },
  { id: 'responsible_ai', icon: '⚖️', title: 'Responsible AI', badge: '3–4 questions', summary: 'Bias, fairness, transparency, explainability, human oversight. SageMaker Clarify + A2I.' },
  { id: 'ai_security', icon: '🔐', title: 'AI Security Threats', badge: '2–3 questions', summary: 'Prompt injection, data poisoning, model inversion, membership inference, jailbreaking.' },
  { id: 'mlops', icon: '🔄', title: 'MLOps on AWS', badge: '1–2 questions', summary: 'SageMaker pipelines, model registry, monitoring, drift detection, A/B testing.' },
  { id: 'vectors', icon: '📐', title: 'Embeddings & Vector Databases', badge: '2–3 questions', summary: 'Cosine similarity, OpenSearch k-NN, Aurora pgvector, chunking, embedding models.' },
  { id: 'eval', icon: '📊', title: 'Model Evaluation', badge: '2–3 questions', summary: 'ROUGE, BLEU, BERTScore, perplexity. Bedrock Model Evaluation jobs. Human eval.' },
  { id: 'model_catalog', icon: '📋', title: 'Bedrock Model Catalog', badge: '2–3 questions', summary: 'Claude family, Amazon Nova, Titan, Llama, Mistral. Strengths per model family.' },
]

// ─── STUDY PLAN ───────────────────────────────────────────────────────────────
interface StudyDay { day: number; week: number; title: string; topics: string[] }

const STUDY_PLAN: StudyDay[] = [
  { day: 1, week: 1, title: 'ML Fundamentals', topics: ['Supervised vs unsupervised vs reinforcement learning', 'Training data, labels, features', 'Overfitting, underfitting, bias-variance tradeoff', 'Classification vs regression vs clustering'] },
  { day: 2, week: 1, title: 'Neural Networks & Transformers', topics: ['Neural network layers, activation functions', 'Deep learning basics', 'Transformer architecture — attention mechanism', 'Why transformers power modern LLMs'] },
  { day: 3, week: 1, title: 'Foundation Model Fundamentals', topics: ['What makes a foundation model', 'Tokens, tokenization, context window', 'Parameters and emergent capabilities', 'Pre-training vs fine-tuning vs inference'] },
  { day: 4, week: 1, title: 'AWS AI Services Part 1', topics: ['Amazon Rekognition — image/video CV', 'Amazon Textract — document extraction', 'Amazon Comprehend — NLP + sentiment', 'Amazon Translate — neural MT'] },
  { day: 5, week: 1, title: 'AWS AI Services Part 2', topics: ['Amazon Transcribe — ASR', 'Amazon Polly — TTS', 'Amazon Lex — conversational AI', 'Amazon Kendra — enterprise search'] },
  { day: 6, week: 1, title: 'Amazon Bedrock Introduction', topics: ['Bedrock architecture and model access', 'On-demand vs provisioned throughput', 'Model IDs and API basics', 'Pricing model — per token'] },
  { day: 7, week: 1, title: 'Practice Quiz — Week 1 Review', topics: ['20 questions covering ML fundamentals', 'AWS AI services identification', 'Bedrock basics', 'Review all wrong answers carefully'] },
  { day: 8, week: 2, title: 'Prompt Engineering Basics', topics: ['Zero-shot and few-shot prompting', 'Chain-of-thought (CoT) reasoning', 'System prompt vs user message', 'ReAct framework — reason + act'] },
  { day: 9, week: 2, title: 'Inference Parameters Deep Dive', topics: ['Temperature — creativity vs determinism', 'Top-P nucleus sampling', 'Top-K vocabulary restriction', 'Max tokens, stop sequences, repetition penalty'] },
  { day: 10, week: 2, title: 'RAG Architecture', topics: ['Embed → store → retrieve → augment → generate', 'Chunking strategies (fixed, semantic, hierarchical)', 'Embedding models (Titan Embeddings, Cohere)', 'Why RAG beats fine-tuning for knowledge'] },
  { day: 11, week: 2, title: 'Bedrock Knowledge Bases', topics: ['Setup: data source → sync → vector store', 'Supported vector stores: OpenSearch, Aurora, Pinecone', 'Overlap and chunk size tuning', 'Query types: semantic + hybrid search'] },
  { day: 12, week: 2, title: 'Fine-tuning Decision Framework', topics: ['When fine-tuning beats RAG (style, format, behavior)', 'Continued pre-training vs instruction fine-tuning', 'Fine-tuning data requirements', 'Cost and time tradeoffs'] },
  { day: 13, week: 2, title: 'Bedrock Agents', topics: ['Action groups → Lambda functions', 'Orchestration trace and reasoning chain', 'Memory — session vs long-term', 'Agent collaboration (supervisor + sub-agents)'] },
  { day: 14, week: 2, title: '🎯 Practice Exam — 65 Questions', topics: ['Full timed mock exam', 'Focus on Bedrock vs SageMaker distinction', 'RAG vs fine-tuning questions', 'Review every wrong answer with explanation'] },
  { day: 15, week: 3, title: 'Bedrock Guardrails', topics: ['Content Filters — hate/violence/sexual/self-harm severity levels', 'Denied Topics — block specific subject matter', 'Word Filters — block specific terms', 'Sensitive Information — PII/PHI redaction', 'Grounding Check — hallucination prevention'] },
  { day: 16, week: 3, title: 'Responsible AI Principles', topics: ['Fairness and bias — types and causes', 'Transparency and explainability', 'Privacy and data minimization', 'Human oversight and accountability'] },
  { day: 17, week: 3, title: 'SageMaker Clarify + A2I', topics: ['Pre-training vs post-training bias detection', 'SHAP-based feature importance', 'Amazon A2I — human-in-the-loop workflows', 'SageMaker Ground Truth — data labeling'] },
  { day: 18, week: 3, title: 'AI Security Threats', topics: ['Prompt injection — direct and indirect', 'Data poisoning — training data manipulation', 'Model inversion — extracting training data', 'Membership inference, jailbreaking, adversarial examples'] },
  { day: 19, week: 3, title: 'AI Security Defenses', topics: ['Guardrails for prompt injection', 'Data validation pipeline for poisoning prevention', 'Least-privilege agent action groups', 'Logging and monitoring with CloudTrail + CloudWatch'] },
  { day: 20, week: 3, title: 'Governance and Compliance', topics: ['GDPR, HIPAA, and AI compliance', 'AWS Shared Responsibility Model for AI', 'Model cards and documentation', 'Data residency and cross-region considerations'] },
  { day: 21, week: 3, title: 'Practice Quiz — Responsible AI', topics: ['20 questions on responsible AI + security', 'Focus on Clarify vs A2I vs Guardrails', 'Bias detection and mitigation scenarios', 'Governance and compliance edge cases'] },
  { day: 22, week: 4, title: 'Embeddings & Vector Databases', topics: ['What embeddings represent semantically', 'Cosine similarity vs dot product vs Euclidean', 'OpenSearch k-NN vs Aurora pgvector', 'Embedding model selection (dimension vs quality)'] },
  { day: 23, week: 4, title: 'Model Evaluation', topics: ['ROUGE — recall-oriented summary evaluation', 'BLEU — precision-oriented translation evaluation', 'BERTScore — semantic similarity metric', 'Bedrock Model Evaluation jobs + human eval'] },
  { day: 24, week: 4, title: 'MLOps Basics', topics: ['SageMaker Pipelines — training automation', 'Model Registry — versioning and approval', 'Model Monitor — drift detection', 'Shadow mode and A/B testing deployments'] },
  { day: 25, week: 4, title: 'Bedrock Model Catalog Deep Dive', topics: ['Claude family — Haiku vs Sonnet vs Opus', 'Amazon Nova — Micro, Lite, Pro, Premier', 'Amazon Titan — Text, Embeddings, Image', 'Llama and Mistral — open models in Bedrock'] },
  { day: 26, week: 4, title: 'Cost Optimization', topics: ['Model tier selection — always smallest that works', 'Batch Inference — async, up to 50% cheaper', 'Prompt caching — reduce repeated context costs', 'Provisioned throughput for predictable workloads'] },
  { day: 27, week: 4, title: '🎯 Full Practice Exam — 65 Questions', topics: ['Second full timed mock exam', 'Target 80%+ before sitting real exam', 'Review Domain 4 (Guidelines for Responsible AI) carefully', 'Note any repeated wrong topics'] },
  { day: 28, week: 4, title: 'Exam Traps Review', topics: ['All 12 traps in this guide', 'RAG vs fine-tuning — 10 scenario variations', 'Bedrock vs SageMaker — draw the line clearly', 'Guardrails use cases vs IAM vs other services'] },
  { day: 29, week: 4, title: 'Decision Matrix Drill', topics: ['All 30 rows from scratch — cover the "solution" column', 'Focus on AWS AI services (Rekognition/Comprehend/Textract/Transcribe)', 'Bedrock service family — KB vs Agents vs Guardrails', 'Vector store choices and when to use each'] },
  { day: 30, week: 4, title: '🏆 Exam Day Prep', topics: ['Review exam strategy tips', 'Light review of inference parameters table', 'Get 8 hours sleep — no cramming', 'Flag and return — never leave a question blank'] },
]

// ─── QUICK REFERENCE DATA ─────────────────────────────────────────────────────
const MODELS = [
  { family: 'Claude (Anthropic)', models: 'Haiku · Sonnet · Opus', strengths: 'Best reasoning, long context, instruction following', useCase: 'Q&A, summarization, coding, analysis' },
  { family: 'Amazon Nova', models: 'Micro · Lite · Pro · Premier', strengths: 'AWS-native, multi-modal (Pro+), competitive pricing', useCase: 'Text generation, image understanding, agentic tasks' },
  { family: 'Amazon Titan', models: 'Text Lite · Text Express · Embeddings · Image', strengths: 'AWS-native, embeddings for RAG, image generation', useCase: 'RAG embeddings, text generation, image gen' },
  { family: 'Llama (Meta)', models: 'Llama 3 8B · 70B', strengths: 'Open weights, customizable, deployable in VPC', useCase: 'Custom fine-tuning, on-premises deployment' },
  { family: 'Mistral', models: 'Mistral 7B · Mixtral 8x7B', strengths: 'Efficient, strong reasoning for size, open weights', useCase: 'Cost-efficient inference, multilingual tasks' },
  { family: 'Cohere', models: 'Command R · Command R+', strengths: 'Optimized for RAG, enterprise search, multilingual', useCase: 'RAG pipelines, enterprise Q&A' },
]

const AI_SERVICES = [
  { service: 'Rekognition', category: 'Vision', trigger: 'detect objects / faces / unsafe content in images/video' },
  { service: 'Textract', category: 'Documents', trigger: 'extract text + structure from PDFs, forms, tables' },
  { service: 'Comprehend', category: 'NLP', trigger: 'sentiment, entities, key phrases, language detection' },
  { service: 'Transcribe', category: 'Speech', trigger: 'speech to text, medical transcription, diarization' },
  { service: 'Polly', category: 'Speech', trigger: 'text to speech, multiple voices, SSML' },
  { service: 'Translate', category: 'Language', trigger: 'translate between 75+ languages' },
  { service: 'Lex', category: 'Chatbot', trigger: 'conversational chatbot, intent recognition, slot filling' },
  { service: 'Kendra', category: 'Search', trigger: 'natural language enterprise search over documents' },
  { service: 'Personalize', category: 'ML', trigger: 'real-time personalized recommendations' },
  { service: 'Forecast', category: 'ML', trigger: 'time series forecasting with related datasets' },
]

const DOMAINS = [
  { domain: 'Domain 1', title: 'Fundamentals of AI and ML', pct: '20%', color: '#7c3aed' },
  { domain: 'Domain 2', title: 'Fundamentals of Generative AI', pct: '24%', color: '#6d28d9' },
  { domain: 'Domain 3', title: 'Applications of Foundation Models', pct: '28%', color: '#5b21b6' },
  { domain: 'Domain 4', title: 'Guidelines for Responsible AI', pct: '14%', color: '#4c1d95' },
  { domain: 'Domain 5', title: 'Security, Compliance, and Governance', pct: '14%', color: '#3b0764' },
]

const STRATEGY_TIPS = [
  { icon: '🎯', tip: 'Domain 3 (28%) is the highest weight — Applications of Foundation Models. Bedrock, RAG, Knowledge Bases, Agents, and Guardrails all live here. Master this domain first.' },
  { icon: '🔑', tip: 'The #1 trap on every sitting: RAG vs fine-tuning. Default to RAG unless the question explicitly says "no internet", "style change", or "behavioral change". If unsure → RAG.' },
  { icon: '🏗️', tip: 'Bedrock = managed FMs. SageMaker = custom model training. These are never interchangeable. Write this on your scratch paper before question 1.' },
  { icon: '⚖️', tip: 'Domain 4 + 5 together = 28% of the exam. Responsible AI is not a soft topic — SageMaker Clarify, A2I, Guardrails, and governance questions are very specific. Don\'t skip them.' },
  { icon: '💡', tip: 'When a question says "without changing the model" → prompt engineering. When it says "adapt behavior" → fine-tuning. When it says "current/live data" → RAG. These phrases are reliable signals.' },
  { icon: '🛡️', tip: 'Guardrails is tested in 5 specific policy types. Know all 5 cold: Content Filters, Denied Topics, Word Filters, Sensitive Information, Grounding Check. Know what each one does and doesn\'t do.' },
  { icon: '💰', tip: 'Cost optimization questions: (1) smaller model, (2) fewer prompt tokens, (3) Batch Inference for async jobs. Temperature, Top-P, and context window are NOT cost controls.' },
  { icon: '🚀', tip: 'AIF-C01 is Associate-level difficulty — it tests breadth over depth. You don\'t need to know API syntax. You need to know WHICH service for WHICH scenario and WHY.' },
]

const TAB_LIST: { id: Tab; label: string; count: string }[] = [
  { id: 'matrix',    label: '🎯 Decision Matrix', count: `${MATRIX.length}` },
  { id: 'traps',     label: '⚠️ Exam Traps',      count: `${TRAPS.length}` },
  { id: 'deepdives', label: '🔬 Deep Dives',       count: `${DEEP_DIVES.length}` },
  { id: 'studyplan', label: '📅 Study Plan',       count: '30 days' },
  { id: 'reference', label: '🔌 Quick Reference',  count: `${AI_SERVICES.length} services` },
  { id: 'strategy',  label: '🏆 Exam Strategy',    count: `${STRATEGY_TIPS.length} tips` },
  { id: 'codex',    label: "🧭 AIF Codex",         count: '' },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const tip = (text: string) => (
  <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '0.875rem 1rem', marginTop: '0.75rem' }}>
    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: '0.35rem' }}>💡 Exam tip</div>
    <div style={{ fontSize: '0.85rem', color: '#4c1d95', lineHeight: 1.6 }}>{text}</div>
  </div>
)
const heading = (text: string) => (
  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginTop: '1rem', marginBottom: '0.35rem', borderLeft: '3px solid #7c3aed', paddingLeft: '0.6rem' }}>{text}</div>
)
const bullets = (items: string[]) => (
  <ul style={{ margin: '0.35rem 0 0 1rem', padding: 0 }}>
    {items.map((b, i) => <li key={i} style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7 }}>{b}</li>)}
  </ul>
)
const table = (headers: string[], rows: string[][]) => (
  <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
      <thead>
        <tr>{headers.map(h => <th key={h} style={{ background: '#f5f3ff', padding: '6px 10px', textAlign: 'left' as const, fontWeight: 700, color: '#4c1d95', borderBottom: '2px solid #ddd6fe' }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#faf5ff' }}>
          {r.map((c, j) => <td key={j} style={{ padding: '6px 10px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>{c}</td>)}
        </tr>)}
      </tbody>
    </table>
  </div>
)
const text = (content: string) => <p style={{ fontSize: '0.84rem', color: '#374151', lineHeight: 1.7, marginTop: '0.5rem' }}>{content}</p>

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function AifGuide() {
  const { isPremium } = useAuth()
  const { hasAccess, loading: certLoading } = useCertAccess('aif-c01')
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('matrix')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [checkedDays, setCheckedDays] = useState<Set<number>>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      return s ? new Set<number>(JSON.parse(s)) : new Set<number>()
    } catch { return new Set<number>() }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedDays]))
  }, [checkedDays])

  const toggleDay = (day: number) => {
    setCheckedDays(prev => {
      const next = new Set(prev)
      next.has(day) ? next.delete(day) : next.add(day)
      return next
    })
  }

  const filteredMatrix = search.trim()
    ? MATRIX.filter(r =>
        r.requirement.toLowerCase().includes(search.toLowerCase()) ||
        r.solution.toLowerCase().includes(search.toLowerCase()) ||
        r.why.toLowerCase().includes(search.toLowerCase())
      )
    : MATRIX

  // Loading
  if (certLoading) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      </Layout>
    )
  }

  // Free user
  if (!isPremium) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Members only</h2>
          <p style={{ color: '#6b7280', maxWidth: '420px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            The AIF-C01 Deep Study Guide is available on any paid plan that includes AIF-C01.
          </p>
          <button onClick={() => navigate('/pricing')} style={{ padding: '12px 28px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            See Plans →
          </button>
        </div>
      </Layout>
    )
  }

  // Paid but wrong cert
  if (!hasAccess) {
    return (
      <Layout>
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🚫</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>AIF-C01 not in your plan</h2>
          <p style={{ color: '#6b7280', maxWidth: '440px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Your current plan doesn't include AIF-C01. Switch your cert selection or upgrade to Yearly / Lifetime to access all guides.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
              Switch Cert →
            </button>
            <button onClick={() => navigate('/billing')} style={{ padding: '12px 24px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
              Upgrade Plan →
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const progress = Math.round((checkedDays.size / 30) * 100)

  const renderDeepDive = (id: string) => {
    switch (id) {
      case 'fm_basics': return (
        <div>
          {heading('What is a Foundation Model?')}
          {text('A Foundation Model (FM) is a large neural network trained on massive datasets using self-supervised learning. It learns general representations that can be adapted to many downstream tasks without task-specific training.')}
          {heading('Transformer Architecture')}
          {bullets(['Attention mechanism: each token "attends" to all other tokens in context', 'Self-attention: allows model to weigh relationships between words regardless of distance', 'Encoder-decoder: encoder understands input, decoder generates output', 'Decoder-only (GPT-style): most modern LLMs — predict next token autoregressively'])}
          {heading('Key Concepts')}
          {table(['Term','Definition'],[ ['Token','Word piece (~4 chars average). "Hello" = 1 token. "Unbelievable" = 3-4 tokens.'], ['Context Window','Max tokens the model can process at once (input + output combined).'], ['Parameters','Model weights learned during training. More params ≠ always better.'], ['Inference','Running the trained model to generate output. Separate from training.'], ['Emergent Capabilities','Abilities that appear at scale — not explicitly trained. Chain-of-thought reasoning is one example.'] ])}
          {tip('Exam tests: tokens vs words (tokens are smaller), context window limits (not adjustable by user), and why larger models are more expensive (more params = more compute per token).')}
        </div>
      )
      case 'bedrock_arch': return (
        <div>
          {heading('Amazon Bedrock Overview')}
          {text('Bedrock is a fully managed service providing API access to foundation models from Amazon, Anthropic, Meta, Mistral, Cohere, and others. No servers to provision, no model weights to download.')}
          {heading('Access Modes')}
          {table(['Mode','Use Case','Pricing'],[ ['On-Demand','Default. Pay per input/output token.','Per token, no commitment'], ['Provisioned Throughput','Predictable, high-volume production.','Hourly rate, reserved capacity'], ['Batch Inference','Async, large-scale, non-real-time jobs.','Up to 50% cheaper than on-demand'] ])}
          {heading('Cross-Region Inference')}
          {bullets(['Automatically routes requests to regions with available capacity', 'Reduces throttling during peak demand', 'Useful for production workloads with strict latency requirements', 'Enabled at model access level — transparent to application'])}
          {tip('Bedrock does NOT use your data to train base models — this is explicitly tested. Your prompts and responses stay in your AWS account.')}
        </div>
      )
      case 'rag': return (
        <div>
          {heading('RAG Pipeline')}
          {bullets(['1. Ingest: load documents into Knowledge Base', '2. Chunk: split into smaller pieces (overlap recommended)', '3. Embed: convert chunks to vector representations', '4. Store: save vectors in vector store (OpenSearch, Aurora, Pinecone)', '5. Query: embed user question, find similar chunks via k-NN search', '6. Augment: inject retrieved chunks into prompt as context', '7. Generate: FM produces answer grounded in retrieved context'])}
          {heading('RAG vs Fine-tuning Decision')}
          {table(['Signal in Question','Answer'],[ ['"Current/live/up-to-date data"','RAG'], ['"Company documents/knowledge base"','RAG'], ['"Style, tone, format change"','Fine-tuning'], ['"Domain-specific behavior/persona"','Fine-tuning'], ['"Reduce hallucination"','RAG + Grounding Check'], ['"No retraining"','RAG or Prompt Engineering'] ])}
          {heading('Chunking Strategies')}
          {bullets(['Fixed size: simple, predictable. Risk: splits sentences mid-thought.', 'Semantic: splits on meaning boundaries. Better coherence, more complex.', 'Hierarchical: parent + child chunks. Parent for context, child for precision.', 'Overlap: 10-20% overlap between chunks prevents context loss at boundaries.'])}
          {tip('"Current data" or "no retraining" in the question → RAG. Fine-tuning is for behavioral changes, not knowledge updates. This is the #1 AIF-C01 trap.')}
        </div>
      )
      case 'finetuning': return (
        <div>
          {heading('Two Types of Fine-tuning')}
          {table(['Type','When to Use','Example'],[ ['Continued Pre-training','Model lacks domain vocabulary/concepts','Medical, legal, or financial domain text'], ['Instruction Fine-tuning','Model needs to follow specific format or behavior','Always respond in JSON / match company tone'] ])}
          {heading('Fine-tuning Requirements')}
          {bullets(['Training data: labeled input→output pairs (instruction fine-tuning) or raw text (continued pre-training)', 'Data format: JSONL with "prompt" and "completion" fields', 'Minimum data: hundreds to thousands of examples for meaningful improvement', 'Cost: significantly more expensive than RAG — only justified for clear behavioral need'])}
          {heading('When Fine-tuning is NOT the Answer')}
          {bullets(['Knowledge updates (quarterly product catalog) → use RAG — data gets stale', 'Factual Q&A over documents → use RAG — cheaper and more accurate', '"Without retraining" in question → use prompt engineering', 'One-time format requirement → use system prompt, not fine-tuning'])}
          {tip('Fine-tuning costs thousands of dollars and takes hours/days. RAG costs cents per query. Exam default: RAG, unless question specifically demands behavioral/style change with no alternative.')}
        </div>
      )
      case 'kb': return (
        <div>
          {heading('Bedrock Knowledge Bases Architecture')}
          {bullets(['Data source: S3, Confluence, SharePoint, Salesforce, web crawler', 'Embedding model: Titan Embeddings or Cohere Embed — converts chunks to vectors', 'Vector store: OpenSearch Serverless, Aurora pgvector, Pinecone, Redis Enterprise, MongoDB Atlas', 'Sync: manual or scheduled — re-embeds changed documents only'])}
          {heading('Chunking Strategy Impact')}
          {table(['Strategy','Chunk Size','Best For'],[ ['Fixed size','256–1024 tokens','Simple documents, fast setup'], ['Semantic','Variable','Coherent paragraphs, better retrieval'], ['Hierarchical','Parent + child','Complex documents needing context'], ['Custom Lambda','Any','Pre-processing heavy PDFs, tables'] ])}
          {heading('Query Types')}
          {bullets(['Semantic search: vector similarity — finds conceptually related chunks', 'Hybrid search: combines vector + keyword — best for mixed queries', 'Metadata filtering: filter chunks by document attributes before vector search'])}
          {tip('Knowledge Bases = retrieval only. If the question needs the model to take an action after retrieval → Bedrock Agents. This distinction appears on almost every sitting.')}
        </div>
      )
      case 'agents': return (
        <div>
          {heading('Bedrock Agents Architecture')}
          {bullets(['Agent: the orchestrator — receives user request, plans steps, executes', 'Action Group: a set of API operations the agent can call (backed by Lambda or inline code)', 'Knowledge Base: attached for retrieval during agent reasoning', 'Memory: stores conversation context across sessions (session memory) or long-term facts'])}
          {heading('Orchestration Flow')}
          {bullets(['1. User sends request to agent', '2. Agent reasons about which action group to invoke (ReAct loop)', '3. Agent calls Lambda via action group with structured parameters', '4. Lambda returns result to agent', '5. Agent reasons again — call another action or respond to user', '6. Orchestration trace records every step (useful for debugging)'])}
          {heading('Agent Collaboration')}
          {bullets(['Supervisor agent: receives user request, delegates to sub-agents', 'Sub-agents: specialized for specific domains or tasks', 'Reduces complexity of single-agent prompts', 'Each sub-agent has its own action groups and knowledge bases'])}
          {tip('Agent = reason + act (multi-step). Knowledge Base = retrieve only (single step). If scenario says "query database AND then send email" → Agents, not Knowledge Bases.')}
        </div>
      )
      case 'guardrails': return (
        <div>
          {heading('5 Guardrail Policy Types')}
          {table(['Policy','What It Does','Exam Trigger Phrase'],[ ['Content Filters','Block hate/violence/sexual/self-harm at severity levels None→High','Prevent harmful content in responses'], ['Denied Topics','Block specific subject matter (competitors, legal advice)','Block competitor mentions / restrict topics'], ['Word Filters','Block exact words or phrases','Block profanity / brand-specific terms'], ['Sensitive Information','Detect + redact PII/PHI (SSN, credit cards, names, medical data)','Redact PII from responses'], ['Grounding Check','Score response faithfulness to RAG context — block hallucinations','Prevent model from making up facts'] ])}
          {heading('Where Guardrails Apply')}
          {bullets(['Input filtering: screens user prompt before sending to model', 'Output filtering: screens model response before returning to user', 'Both: apply at both input and output for maximum protection', 'Applies to Bedrock API calls, Knowledge Bases queries, and Agent responses'])}
          {tip('Know all 5 types cold — exam gives scenarios and asks which policy type. Grounding Check ≠ Content Filter. Denied Topics ≠ Word Filters. Each has a specific, distinct function.')}
        </div>
      )
      case 'prompt_eng': return (
        <div>
          {heading('Core Techniques')}
          {table(['Technique','When to Use','Example'],[ ['Zero-shot','Simple tasks, capable models','Summarize this paragraph:'], ['Few-shot','Format-sensitive, complex output','Here are 3 examples: ... Now do:'], ['Chain-of-Thought','Math, logic, multi-step reasoning','Think step by step before answering'], ['ReAct','Agent tasks requiring tools','Reason about action, observe result, repeat'], ['Prompt Chaining','Complex tasks split into subtasks','Output of step 1 becomes input of step 2'] ])}
          {heading('System Prompt vs User Message')}
          {bullets(['System prompt: persistent instructions, persona, constraints — set by developer', 'User message: the actual user input — variable per turn', 'Keep system prompt separate from user message in API calls — critical for prompt injection defense', 'System prompt is NOT visible to users in properly architected systems'])}
          {heading('Common Prompt Mistakes')}
          {bullets(['Vague instructions: "write something good" → model guesses what you want', 'No examples for complex formats: model invents its own format', 'Concatenating user input into system prompt: enables prompt injection', 'Too long a prompt: relevant context gets "lost in the middle"'])}
          {tip('"Without changing the model / without retraining" always → prompt engineering. Few-shot beats zero-shot when format consistency matters. System + user separation is a security best practice.')}
        </div>
      )
      case 'inference': return (
        <div>
          {heading('All Inference Parameters')}
          {table(['Parameter','Range','Effect','Use Case'],[ ['Temperature','0.0–1.0','0 = deterministic, 1 = very random','0 for facts/code, 0.7 for creative writing'], ['Top-P','0.0–1.0','Limits vocab to top P probability mass','Lower = more focused vocabulary choices'], ['Top-K','1–500','Limits to K most probable next tokens','Hard vocab cap regardless of probability'], ['Max Tokens','Model dependent','Max output length in tokens','Prevents runaway responses'], ['Stop Sequences','String list','Halt generation at pattern match','Control structured output end markers'], ['Repetition Penalty','>1.0','Penalizes already-used tokens','Reduces repetitive output loops'] ])}
          {heading('Temperature Decision Guide')}
          {bullets(['0.0: Code generation, math, factual Q&A — need determinism', '0.3–0.5: Business writing, summarization — balanced', '0.7–0.9: Creative writing, brainstorming — want variety', '1.0: Maximum diversity — often too random for production use'])}
          {tip('Temperature is the PRIMARY creativity control — tested most. Top-P and Top-K are secondary. "More deterministic" → lower Temperature. Never increase temperature to fix hallucinations.')}
        </div>
      )
      case 'ai_services': return (
        <div>
          {heading('AWS AI Services — Exam Trigger Map')}
          {table(['Service','What it does','Key differentiators'],[ ['Rekognition','Image/video analysis — objects, faces, text, moderation','Real-time video analysis, custom labels'], ['Textract','Document extraction — text + tables + forms','Understands structure, not just raw text'], ['Comprehend','NLP — sentiment, entities, topics, PII','Comprehend Medical for clinical text, HIPAA-eligible'], ['Transcribe','Speech-to-text','Speaker diarization, custom vocabulary, medical variant'], ['Polly','Text-to-speech','SSML for pronunciation, neural voices, streaming'], ['Lex','Chatbot NLU','Intent + slot filling, same tech as Alexa'], ['Kendra','Enterprise search','Natural language, reads 40+ data source connectors'], ['Personalize','Recommendations','Real-time, trains on YOUR interaction data'], ['Forecast','Time series forecasting','Related datasets (weather, price) improve accuracy'], ['Translate','Language translation','Custom terminology for domain-specific words'] ])}
          {tip('Exam pattern: describes a task, asks which service. Key: Textract ≠ Rekognition (Textract = documents, Rekognition = images/video). Comprehend ≠ Kendra (Comprehend = NLP analysis, Kendra = search).')}
        </div>
      )
      case 'responsible_ai': return (
        <div>
          {heading('Core Responsible AI Principles (AWS)')}
          {bullets(['Fairness: model treats all demographic groups equitably', 'Explainability: stakeholders can understand why the model made a prediction', 'Privacy: data minimization, user consent, right to be forgotten', 'Robustness: model performs reliably across edge cases and adversarial inputs', 'Transparency: documentation of training data, model limitations, intended use', 'Governance: human oversight, audit trails, accountability mechanisms'])}
          {heading('AWS Tools for Responsible AI')}
          {table(['Tool','Purpose','Key Feature'],[ ['SageMaker Clarify','Bias detection + explainability','Pre/post-training bias reports, SHAP values'], ['Amazon A2I','Human-in-the-loop review','Low-confidence predictions reviewed by humans'], ['SageMaker Ground Truth','Data labeling','Active learning reduces labeling cost'], ['Bedrock Guardrails','Content safety at inference','Real-time filtering of harmful content'], ['Model Cards','Documentation standard','Record training data, eval metrics, intended use'] ])}
          {tip('Domain 4 = 14% of exam. "Ensure model doesn\'t discriminate" → SageMaker Clarify. "Human review for high-stakes decisions" → A2I. These are the two most tested Responsible AI services.')}
        </div>
      )
      case 'ai_security': return (
        <div>
          {heading('AI-Specific Threat Types')}
          {table(['Threat','Description','Defense'],[ ['Prompt Injection','Malicious input hijacks model instructions','Guardrails + system prompt isolation'], ['Indirect Prompt Injection','Attacker embeds instructions in retrieved documents (RAG)','Sanitize retrieved content + Guardrails'], ['Data Poisoning','Corrupt training data to embed backdoors','Data validation pipeline + provenance tracking'], ['Model Inversion','Query model to reconstruct training data','Differential privacy + output perturbation'], ['Membership Inference','Determine if specific data was in training set','Privacy-preserving training techniques'], ['Jailbreaking','Bypass safety filters with adversarial prompts','Guardrails + red-teaming + diverse safety testing'] ])}
          {heading('Agent-Specific Security')}
          {bullets(['Least-privilege action groups: agents should only access what they need', 'Input/output guardrails on agent: apply at both ends of agent loop', 'Audit logging: CloudTrail for Bedrock API calls + orchestration trace', 'Prompt leakage: agent system prompt can be extracted — treat as non-secret'])}
          {tip('Prompt injection is the most tested AI security threat. Defense = Guardrails (not Lambda validation alone) + proper prompt architecture where system prompt is separate from user input.')}
        </div>
      )
      case 'mlops': return (
        <div>
          {heading('SageMaker MLOps Services')}
          {table(['Service','Purpose'],[ ['SageMaker Pipelines','Automate training → evaluation → registration workflow'], ['Model Registry','Version, stage (Staging/Production), and approve models'], ['Model Monitor','Detect data drift and model quality degradation in production'], ['SageMaker Clarify','Bias monitoring in production (not just at training time)'], ['Shadow Mode','Run new model alongside old — compare outputs before cutover'], ['A/B Testing','Route % of traffic to new model — gradual rollout'] ])}
          {heading('Model Drift Types')}
          {bullets(['Data drift: input distribution changes (seasonal patterns, world events)', 'Concept drift: relationship between input and output changes', 'Model quality drift: accuracy degrades without obvious data change', 'Bias drift: fairness metrics worsen over time in production'])}
          {tip('MLOps is lightly tested on AIF-C01 (1-2 questions). Know Model Registry (versioning + approval workflow) and Model Monitor (drift detection). SageMaker Pipelines = CI/CD for ML.')}
        </div>
      )
      case 'vectors': return (
        <div>
          {heading('What are Embeddings?')}
          {text('Embeddings are numerical vector representations of text (or images) that capture semantic meaning. Similar concepts are close together in vector space — "cat" and "feline" are near each other, far from "database".')}
          {heading('Similarity Metrics')}
          {table(['Metric','Formula','Best For'],[ ['Cosine Similarity','Angle between vectors (0–1)','Text embeddings — most common'], ['Dot Product','Magnitude × cosine','Normalized vectors — same as cosine'], ['Euclidean Distance','Straight-line distance','Image embeddings, lower-dim vectors'] ])}
          {heading('Vector Store Options in AWS')}
          {table(['Store','Integration','Best For'],[ ['OpenSearch Serverless (k-NN)','Native Bedrock KB integration','Large scale, existing OpenSearch users'], ['Aurora PostgreSQL (pgvector)','Bedrock KB + RDS','Already using Aurora, need SQL + vectors'], ['Pinecone','Bedrock KB integration','Purpose-built vector DB, managed'], ['Redis Enterprise','Bedrock KB integration','Low-latency, in-memory vector search'] ])}
          {tip('Semantic search requires embeddings — keyword search does NOT do semantic matching. "Find documents similar in meaning" → embeddings + vector store. The exam tests this distinction.')}
        </div>
      )
      case 'eval': return (
        <div>
          {heading('Automated Evaluation Metrics')}
          {table(['Metric','Measures','Best For','Weakness'],[ ['ROUGE','Recall of n-gram overlap','Summarization','Ignores semantics — misses paraphrases'], ['BLEU','Precision of n-gram overlap','Translation','Brevity penalty, poor for long text'], ['BERTScore','Semantic similarity via embeddings','Any generation task','Compute-intensive, needs GPU'], ['Perplexity','How well model predicts test set','Language model comparison','Lower ≠ better for downstream tasks'] ])}
          {heading('Bedrock Model Evaluation')}
          {bullets(['Automated eval: built-in metrics (accuracy, ROUGE, BERTScore) on your dataset', 'Human eval: send samples to human reviewers via SageMaker Ground Truth', 'Model comparison: run same prompts on multiple models side-by-side', 'Custom metrics: bring your own evaluation logic via Lambda'])}
          {heading('When to Use Each')}
          {bullets(['Summarization → ROUGE (measures coverage)', 'Translation → BLEU (measures precision)', 'Q&A / RAG → BERTScore or human eval (semantics matter)', 'Model selection → Bedrock Model Evaluation with your own test set'])}
          {tip('AIF-C01 tests metric selection by task. ROUGE = summarization recall. BLEU = translation precision. BERTScore = semantic. Perplexity = model quality during training. Know which metric fits which task.')}
        </div>
      )
      case 'model_catalog': return (
        <div>
          {heading('Model Families in Amazon Bedrock')}
          {table(['Family','Provider','Key Strength','Cost Tier'],[ ['Claude Haiku','Anthropic','Fastest, cheapest, still strong quality','Low'], ['Claude Sonnet','Anthropic','Best balance of quality and speed','Medium'], ['Claude Opus','Anthropic','Highest capability, complex reasoning','High'], ['Nova Micro','Amazon','Text only, ultra-low latency','Lowest'], ['Nova Lite','Amazon','Multi-modal (text+image), low cost','Low'], ['Nova Pro','Amazon','High capability, multi-modal','Medium'], ['Titan Text Lite/Express','Amazon','AWS-native, enterprise-ready','Low-Medium'], ['Titan Embeddings','Amazon','Convert text to vectors for RAG','Per-token'], ['Llama 3 8B/70B','Meta','Open weights, fine-tunable, VPC-deployable','Low-Medium'], ['Mistral 7B / Mixtral','Mistral','Efficient, multilingual, open weights','Low'] ])}
          {heading('Model Selection Framework')}
          {bullets(['Start with smallest model that meets quality bar — measure, then upgrade', 'Simple extraction/classification → Haiku or Nova Micro', 'Balanced production workloads → Sonnet or Nova Pro', 'Complex reasoning, long context → Opus or Nova Premier', 'Embeddings for RAG → Titan Embeddings V2 or Cohere Embed'])}
          {tip('Exam tests: which model for which use case, cost optimization (always smallest first), and multi-modal requirements (Nova Lite+ or Claude 3+). Know the tier hierarchy within each family.')}
        </div>
      )
      default: return <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Content loading…</div>
    }
  }

  return (
    <Layout>
      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)', padding: '2.5rem 1.5rem 2rem', textAlign: 'center', color: '#fff' }}>
        <div style={{ display: 'inline-block', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#c4b5fd', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          ☁️ AIF-C01 · COMPLETE STUDY GUIDE
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, color: '#fff', marginBottom: '0.6rem', letterSpacing: '-0.02em' }}>
          The AIF-C01 Encyclopedia
        </h1>
        <p style={{ color: '#c4b5fd', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.25rem', lineHeight: 1.7 }}>
          Every decision matrix, exam trap, deep dive, and study plan you need to pass — in one place. Covers all 5 domains and ~90% of real exam questions.
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[`✅ ${MATRIX.length} Decision Matrix rows`, `✅ ${TRAPS.length} Exam traps`, `✅ ${DEEP_DIVES.length} Deep dive sections`].map(s => (
            <div key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#c4b5fd' }}>{s}</div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 1rem', display: 'flex', gap: '0', overflowX: 'auto', justifyContent: 'center' }}>
        {TAB_LIST.map(t => (
          <button key={t.id} onClick={() => { setActiveTab(t.id); setExpanded(null); setSearch('') }}
            style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', fontWeight: activeTab === t.id ? 700 : 500, color: activeTab === t.id ? '#7c3aed' : '#6b7280', background: 'none', border: 'none', borderBottom: activeTab === t.id ? '2px solid #7c3aed' : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}>
            {t.label}
            <span style={{ background: '#f3f4f6', color: '#6b7280', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, padding: '1px 7px' }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* DECISION MATRIX */}
        {activeTab === 'matrix' && (
          <div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by requirement, service, or keyword…"
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '0.875rem', marginBottom: '1rem', outline: 'none', boxSizing: 'border-box' as const }} />
            {filteredMatrix.length === 0
              ? <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem', fontSize: '0.875rem' }}>No matches for "{search}"</div>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {filteredMatrix.map((row, i) => (
                    <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.875rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5, marginBottom: '0.35rem' }}>{row.requirement}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.45 }}>{row.why}</div>
                      </div>
                      <div style={{ background: '#f5f3ff', color: '#7c3aed', padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>{row.solution}</div>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}

        {/* EXAM TRAPS */}
        {activeTab === 'traps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
              {TRAPS.length} traps that appear on every AIF-C01 sitting. Know why the wrong answer looks right.
            </p>
            {TRAPS.map(t => {
              const isOpen = expanded === t.title
              const trapId = `aif-trap-${t.title.replace(/\s+/g, '-')}`
              return (
                <div id={trapId} key={t.title} style={{ background: '#fff', border: `1px solid ${isOpen ? '#7c3aed' : '#e5e7eb'}`, borderRadius: '14px', overflow: 'hidden', boxShadow: isOpen ? '0 0 0 3px rgba(124,58,237,0.08)' : 'none', transition: 'all 0.15s' }}>
                  <button onClick={() => { const opening = !isOpen; setExpanded(opening ? t.title : null); if (opening) setTimeout(() => document.getElementById(trapId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80) }}
                    style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem', textAlign: 'left' as const }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{t.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>{t.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.15rem' }}>Triggered by: {t.trigger}</div>
                    </div>
                    <span style={{ color: '#6b7280', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f3f4f6', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.875rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#991b1b', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: '0.35rem' }}>❌ Wrong answer</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7f1d1d', marginBottom: '0.35rem' }}>{t.wrong}</div>
                          <div style={{ fontSize: '0.8rem', color: '#991b1b', lineHeight: 1.5 }}>{t.wrongWhy}</div>
                        </div>
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.875rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: '0.35rem' }}>✅ Correct answer</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#14532d', marginBottom: '0.35rem' }}>{t.correct}</div>
                          <div style={{ fontSize: '0.8rem', color: '#166534', lineHeight: 1.5 }}>{t.correctWhy}</div>
                        </div>
                      </div>
                      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.875rem 1rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: '0.35rem' }}>💡 Remember this</div>
                        <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{t.tip}</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* DEEP DIVES */}
        {activeTab === 'deepdives' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
              {DEEP_DIVES.length} sections covering every heavily-tested AIF-C01 topic. Expand any section to see comparison tables, decision rules, and exam tips.
            </p>
            {DEEP_DIVES.map(d => {
              const isOpen = expanded === d.id
              const diveId = `aif-dive-${d.id}`
              return (
                <div id={diveId} key={d.id} style={{ background: '#fff', border: `1px solid ${isOpen ? '#7c3aed' : '#e5e7eb'}`, borderRadius: '14px', overflow: 'hidden', boxShadow: isOpen ? '0 0 0 3px rgba(124,58,237,0.08)' : 'none', transition: 'all 0.15s' }}>
                  <button onClick={() => { const opening = !isOpen; setExpanded(opening ? d.id : null); if (opening) setTimeout(() => document.getElementById(diveId)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80) }}
                    style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem', textAlign: 'left' as const }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{d.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827' }}>{d.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.15rem' }}>{d.summary}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <span style={{ background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px' }}>{d.badge}</span>
                      <span style={{ color: '#6b7280' }}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f3f4f6', padding: '1.25rem' }}>
                      {renderDeepDive(d.id)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* STUDY PLAN */}
        {activeTab === 'studyplan' && (
          <div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Overall Progress</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#7c3aed' }}>{checkedDays.size} / 30 days</div>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: '999px', transition: 'width 0.3s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{progress}% complete</span>
                {checkedDays.size > 0 && (
                  <button onClick={() => setCheckedDays(new Set())} style={{ fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Reset</button>
                )}
              </div>
            </div>
            {[1, 2, 3, 4].map(week => {
              const weekDays = STUDY_PLAN.filter(d => d.week === week)
              const weekLabels = ['AI/ML Fundamentals', 'Bedrock Deep Dive', 'Responsible AI & Security', 'Advanced Topics & Exam Prep']
              return (
                <div key={week} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                    Week {week} — {weekLabels[week - 1]}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {weekDays.map(day => {
                      const done = checkedDays.has(day.day)
                      const isExam = day.title.includes('🎯') || day.title.includes('🏆')
                      return (
                        <div key={day.day} onClick={() => toggleDay(day.day)}
                          style={{ background: done ? '#f5f3ff' : '#fff', border: `1px solid ${done ? '#ddd6fe' : isExam ? '#e5e7eb' : '#e5e7eb'}`, borderRadius: '12px', padding: '0.875rem 1rem', cursor: 'pointer', display: 'flex', gap: '0.875rem', alignItems: 'flex-start', transition: 'all 0.15s' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: done ? '#7c3aed' : '#f3f4f6', border: `2px solid ${done ? '#7c3aed' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, color: done ? '#fff' : '#9ca3af' }}>
                            {done ? '✓' : day.day}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: done ? '#6d28d9' : '#111827' }}>{day.title}</span>
                              {isExam && <span style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 700, padding: '1px 8px' }}>Milestone</span>}
                            </div>
                            <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                              {day.topics.map((t, i) => <li key={i} style={{ fontSize: '0.78rem', color: done ? '#7c3aed' : '#6b7280', lineHeight: 1.6 }}>{t}</li>)}
                            </ul>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* QUICK REFERENCE */}
        {activeTab === 'reference' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Model Families */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>🤖 Bedrock Model Families</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr>{['Family', 'Models', 'Strengths', 'Use Case'].map(h => <th key={h} style={{ background: '#f5f3ff', padding: '8px 10px', textAlign: 'left' as const, fontWeight: 700, color: '#4c1d95', borderBottom: '2px solid #ddd6fe' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {MODELS.map((m, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#faf5ff' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 700, color: '#374151', borderBottom: '1px solid #f3f4f6' }}>{m.family}</td>
                        <td style={{ padding: '8px 10px', color: '#6b7280', borderBottom: '1px solid #f3f4f6' }}>{m.models}</td>
                        <td style={{ padding: '8px 10px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>{m.strengths}</td>
                        <td style={{ padding: '8px 10px', color: '#374151', borderBottom: '1px solid #f3f4f6' }}>{m.useCase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AWS AI Services */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>🔧 AWS AI Services — Exam Trigger Map</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {AI_SERVICES.map(s => (
                  <div key={s.service} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{s.service}</span>
                      <span style={{ background: '#f5f3ff', color: '#7c3aed', fontSize: '0.68rem', fontWeight: 700, padding: '1px 7px', borderRadius: '999px' }}>{s.category}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.5 }}>{s.trigger}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AIF-C01 Exam Domains */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>📋 AIF-C01 Exam Domains</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {DOMAINS.map(d => (
                  <div key={d.domain} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>{d.pct}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{d.domain}</div>
                      <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{d.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inference Parameters */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>⚙️ Inference Parameters Cheat Sheet</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr>{['Parameter', 'Low value', 'High value', 'Exam default'].map(h => <th key={h} style={{ background: '#f5f3ff', padding: '8px 10px', textAlign: 'left' as const, fontWeight: 700, color: '#4c1d95', borderBottom: '2px solid #ddd6fe' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {[
                      ['Temperature', 'Deterministic, repetitive', 'Creative, random', '0 for facts, 0.7 for creative'],
                      ['Top-P', 'Narrow vocabulary pool', 'Broad vocabulary pool', '0.9 — rarely tuned first'],
                      ['Top-K', 'Few token choices', 'Many token choices', '50 — rarely tuned first'],
                      ['Max Tokens', 'Short output', 'Long output', 'Set based on expected response length'],
                      ['Repetition Penalty', 'Allows repetition', 'Avoids repeated tokens', '>1.0 to reduce loops'],
                    ].map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#faf5ff' }}>
                        {r.map((c, j) => <td key={j} style={{ padding: '8px 10px', color: j === 0 ? '#7c3aed' : '#374151', fontWeight: j === 0 ? 700 : 400, borderBottom: '1px solid #f3f4f6' }}>{c}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* EXAM STRATEGY */}
        {activeTab === 'strategy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
              {STRATEGY_TIPS.length} exam-specific strategies for AIF-C01. Read these the night before.
            </p>
            {STRATEGY_TIPS.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.75rem', flexShrink: 0, lineHeight: 1 }}>{s.icon}</div>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7, margin: 0 }}>{s.tip}</p>
              </div>
            ))}

            {/* Keyword → Service grid */}
            <div style={{ background: '#1e1b4b', borderRadius: '14px', padding: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>⚡ Keyword → Service Instant Map</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
                {[
                  ['managed FM API', 'Bedrock'],
                  ['RAG / current data', 'Knowledge Bases'],
                  ['multi-step agent', 'Bedrock Agents'],
                  ['content moderation', 'Guardrails'],
                  ['domain style change', 'Fine-tuning'],
                  ['semantic search', 'Embeddings + Vector Store'],
                  ['document extraction', 'Textract'],
                  ['sentiment / NLP', 'Comprehend'],
                  ['speech to text', 'Transcribe'],
                  ['image / video', 'Rekognition'],
                  ['chatbot / intent', 'Lex'],
                  ['enterprise search', 'Kendra'],
                  ['recommendations', 'Personalize'],
                  ['bias detection', 'SageMaker Clarify'],
                  ['human review', 'Amazon A2I'],
                  ['custom training', 'SageMaker'],
                  ['block topic', 'Guardrails Denied Topics'],
                  ['redact PII', 'Guardrails Sensitive Info'],
                  ['prevent hallucination', 'RAG + Grounding Check'],
                  ['translate language', 'Amazon Translate'],
                ].map(([kw, svc]) => (
                  <div key={kw} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#c4b5fd' }}>"{kw}"</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fff', background: 'rgba(167,139,250,0.2)', padding: '2px 8px', borderRadius: '999px', flexShrink: 0 }}>{svc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
             AIF CODEX TAB
             ════════════════════════════════════════════════════════════ */}
        {activeTab === 'codex' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* SECTION 1 — ML FUNDAMENTALS */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#7c3aed,#4c1d95)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🧠</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Section 1 — AI/ML Fundamentals</h3>
              </div>

              {/* 4 ML Types */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                {[
                  { type: 'Supervised Learning', icon: '🏷️', color: '#1d4ed8', bg: '#eff6ff', data: 'Labeled data (input + correct output)', uses: 'Classification (spam/not-spam) · Regression (price prediction)', algos: 'Linear regression, decision trees, neural networks' },
                  { type: 'Unsupervised Learning', icon: '🔍', color: '#059669', bg: '#ecfdf5', data: 'Unlabeled data — finds patterns', uses: 'Clustering (customer segments) · Anomaly detection', algos: 'K-means, PCA, autoencoders' },
                  { type: 'Reinforcement Learning', icon: '🎮', color: '#d97706', bg: '#fffbeb', data: 'Agent learns via rewards/punishments', uses: 'Robotics · Game AI · Autonomous vehicles', algos: 'Q-learning, policy gradients' },
                  { type: 'Generative AI ⭐', icon: '✨', color: '#7c3aed', bg: '#f5f3ff', data: 'Creates NEW content from training patterns', uses: 'Chatbots · Content creation · Code generation · Design', algos: 'LLMs, diffusion models, GANs' },
                ].map(m => (
                  <div key={m.type} style={{ background: m.bg, border: `1.5px solid ${m.color}22`, borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{m.icon}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: m.color }}>{m.type}</span>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#374151', lineHeight: 1.6 }}>
                      <div style={{ marginBottom: '3px' }}><span style={{ fontWeight: 700 }}>Data: </span>{m.data}</div>
                      <div style={{ marginBottom: '3px' }}><span style={{ fontWeight: 700 }}>Uses: </span>{m.uses}</div>
                      <div><span style={{ fontWeight: 700 }}>Algos: </span>{m.algos}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key AI Terminology */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', background: '#faf5ff', borderBottom: '1px solid #e9d5ff' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#6b21a8', margin: 0 }}>📖 Key AI Terminology — Know These Definitions</h4>
                </div>
                {[
                  { term: 'Model', def: 'Mathematical representation learned from data. The output of training.' },
                  { term: 'Training', def: 'Process of teaching a model using data. Computationally intensive — use Trainium chips.' },
                  { term: 'Inference', def: 'Using a trained model to make predictions on new, unseen data.' },
                  { term: 'Prompt', def: 'Input text that guides what a generative AI model produces.' },
                  { term: 'Fine-tuning', def: 'Adapting a pre-trained foundation model to a specific domain or task using new data.' },
                  { term: 'RAG', def: 'Retrieval-Augmented Generation — combine LLM with external knowledge base to reduce hallucinations.' },
                  { term: 'Hallucination', def: 'When AI generates plausible-sounding but incorrect/fabricated information. Mitigate with RAG + grounding.' },
                  { term: 'Token', def: 'Unit of text (word or subword) that LLMs process. Affects cost and context limits.' },
                  { term: 'Embedding', def: 'Numerical vector representation of text. Enables semantic search in vector stores.' },
                  { term: 'Temperature', def: 'Controls output randomness. Low = deterministic/factual. High = creative/diverse.' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '10px', padding: '8px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#faf5ff', alignItems: 'start' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#7c3aed' }}>{t.term}</span>
                    <span style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.55 }}>{t.def}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2 — AWS AI/ML SERVICES */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#0891b2,#0e7490)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🛠️</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Section 2 — AWS AI/ML Services</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>

                {/* Bedrock */}
                <div style={{ background: '#fff', border: '2px solid #a78bfa', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: 'linear-gradient(90deg,#4c1d95,#7c3aed)', }}>
                    <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', margin: 0 }}>🏗️ Amazon Bedrock ⭐ — Exam Centrepiece</h4>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.6, margin: '0 0 10px' }}>Fully managed service to access <strong>Foundation Models (FMs)</strong> from AWS and third parties via API. No infrastructure to manage.</p>
                    {[
                      { label: 'Models available', val: 'Anthropic Claude · Meta Llama · AI21 Labs · Cohere · Amazon Titan · Amazon Nova' },
                      { label: 'Use cases', val: 'Text generation · Summarisation · Q&A · Chatbots · Code generation' },
                      { label: 'Knowledge Bases', val: 'RAG — connect FM to your data sources (S3, databases)' },
                      { label: 'Agents', val: 'Autonomous multi-step task execution via Lambda action groups' },
                      { label: 'Guardrails', val: 'Content filters · PII redaction · Denied topics · Prompt safety' },
                      { label: 'Data privacy', val: '⚠️ Your data is NEVER used to train AWS models' },
                    ].map((r, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', padding: '6px 0', borderTop: '1px solid #f3f4f6', alignItems: 'start' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.75rem', color: '#7c3aed' }}>{r.label}</span>
                        <span style={{ fontSize: '0.76rem', color: '#374151', lineHeight: 1.5 }}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pre-built AI Services */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#f0f9ff', borderBottom: '1px solid #bae6fd' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0369a1', margin: 0 }}>🔧 Pre-Built AI Services (No ML Expertise Needed)</h4>
                  </div>
                  {[
                    { cat: 'Language', services: [
                      { svc: 'Comprehend', desc: 'NLP: sentiment, entities, key phrases, language detection' },
                      { svc: 'Translate', desc: 'Real-time translation across 75+ languages' },
                      { svc: 'Polly', desc: 'Text-to-speech — natural voices in 60+ languages' },
                      { svc: 'Transcribe', desc: 'Speech-to-text — call analytics, subtitles, medical' },
                      { svc: 'Lex', desc: 'Build chatbots/voice assistants — powers Alexa' },
                    ]},
                    { cat: 'Vision', services: [
                      { svc: 'Rekognition', desc: 'Image/video: faces, objects, text, content moderation' },
                      { svc: 'Textract', desc: 'Extract text/tables from documents, forms, invoices' },
                    ]},
                    { cat: 'Search & Recommendations', services: [
                      { svc: 'Kendra', desc: 'Intelligent enterprise search — natural language Q&A over docs' },
                      { svc: 'Personalize', desc: 'Real-time product/content recommendations — no ML expertise' },
                      { svc: 'Forecast', desc: 'Time-series forecasting: demand, inventory, traffic' },
                    ]},
                  ].map(cat => (
                    <div key={cat.cat}>
                      <div style={{ padding: '6px 14px', background: '#f8fafc', borderTop: '1px solid #e5e7eb', fontSize: '0.7rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.cat}</div>
                      {cat.services.map((s, i) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '8px', padding: '7px 14px', borderTop: '1px solid #f3f4f6', background: '#fff', alignItems: 'start' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.77rem', color: '#0369a1' }}>{s.svc}</span>
                          <span style={{ fontSize: '0.76rem', color: '#374151', lineHeight: 1.5 }}>{s.desc}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* SageMaker */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#fff7ed', borderBottom: '1px solid #fed7aa' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#c2410c', margin: 0 }}>⚗️ Amazon SageMaker ⭐ — End-to-End ML Platform</h4>
                  </div>
                  {[
                    { component: 'Studio', desc: 'Web-based IDE for all ML development tasks' },
                    { component: 'Autopilot', desc: 'AutoML — automatically builds, trains, tunes models (no-code)' },
                    { component: 'Built-in Algos', desc: 'Pre-optimised for XGBoost, k-means, linear learner, and more' },
                    { component: 'Pipelines', desc: 'CI/CD for ML workflows — reproducible, automated' },
                    { component: 'Model Monitor', desc: 'Detect data drift and concept drift in production models' },
                    { component: 'Clarify', desc: 'Detect bias in data/model + explain predictions (feature attribution)' },
                    { component: 'Ground Truth', desc: 'Human labeling service to create training datasets' },
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px', padding: '7px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fff7ed', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.77rem', color: '#c2410c' }}>{c.component}</span>
                      <span style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.5 }}>{c.desc}</span>
                    </div>
                  ))}
                  <div style={{ padding: '10px 14px', background: '#fffbeb', borderTop: '1px solid #fed7aa' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#92400e', marginBottom: '4px' }}>⚖️ SageMaker vs Bedrock</div>
                    <div style={{ fontSize: '0.76rem', color: '#78350f', lineHeight: 1.6 }}>
                      <strong>SageMaker</strong> = build/train/customize your own models (full control, more work) ·
                      <strong> Bedrock</strong> = use pre-trained FMs via API (less control, fastest time-to-value)
                    </div>
                  </div>
                </div>

                {/* AI Chips */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>🖥️ AI-Optimised Infrastructure</h4>
                  </div>
                  {[
                    { chip: 'Trainium (Trn1)', purpose: 'TRAINING', desc: 'Custom AWS chips for cost-effective model training at scale.' },
                    { chip: 'Inferentia (Inf1/Inf2)', purpose: 'INFERENCE', desc: 'Custom chips for low-latency, high-throughput predictions in production.' },
                    { chip: 'EC2 P4/P5 instances', purpose: 'GPU', desc: 'NVIDIA GPU-powered instances for intensive ML training workloads.' },
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'flex-start' }}>
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#111827' }}>{c.chip}</div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, background: c.purpose === 'TRAINING' ? '#dbeafe' : c.purpose === 'INFERENCE' ? '#dcfce7' : '#f3e8ff', color: c.purpose === 'TRAINING' ? '#1d4ed8' : c.purpose === 'INFERENCE' ? '#15803d' : '#7c3aed', padding: '1px 6px', borderRadius: '4px' }}>{c.purpose}</span>
                      </div>
                      <span style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.55 }}>{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3 — RESPONSIBLE AI */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#dc2626,#991b1b)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>⚖️</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Section 3 — Responsible AI &amp; Governance</h3>
              </div>

              {/* 4 Pillars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                {[
                  { num: '1', pillar: 'Fairness', color: '#1d4ed8', bg: '#eff6ff', desc: 'Models must not discriminate against protected groups. Use diverse training data. Detect bias with SageMaker Clarify before and after training.' },
                  { num: '2', pillar: 'Transparency & Explainability', color: '#059669', bg: '#ecfdf5', desc: 'Understand WHY a model made a prediction. Tools: SageMaker Clarify (feature attribution), model cards, explainability reports.' },
                  { num: '3', pillar: 'Privacy & Security', color: '#7c3aed', bg: '#f5f3ff', desc: 'Protect training data and model outputs. KMS encryption, VPC isolation, Bedrock data privacy (your data never used for AWS training).' },
                  { num: '4', pillar: 'Robustness & Safety', color: '#dc2626', bg: '#fef2f2', desc: 'Models perform reliably and prevent harmful outputs. Bedrock Guardrails: block toxic content, PII, jailbreaks. Human-in-the-loop for high-stakes decisions.' },
                ].map(p => (
                  <div key={p.num} style={{ background: p.bg, border: `1.5px solid ${p.color}22`, borderRadius: '12px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ width: '24px', height: '24px', background: p.color, color: '#fff', borderRadius: '50%', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.num}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: p.color }}>{p.pillar}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                  </div>
                ))}
              </div>

              {/* AI Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>🛡️ Bedrock Guardrails — 5 Control Types</h4>
                  </div>
                  {[
                    { ctrl: 'Content Filters', desc: 'Block hate speech, violence, sexual content by severity level.' },
                    { ctrl: 'Denied Topics', desc: 'Prevent discussion of specified sensitive subjects entirely.' },
                    { ctrl: 'Word Filters', desc: 'Block specific words, phrases, or profanity from inputs/outputs.' },
                    { ctrl: 'Sensitive Info (PII)', desc: 'Redact personal information — names, SSNs, credit cards, emails.' },
                    { ctrl: 'Grounding Check', desc: 'Verify FM responses are grounded in provided source material (reduces hallucinations).' },
                  ].map((g, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '8px', padding: '8px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.77rem', color: '#7c3aed' }}>{g.ctrl}</span>
                      <span style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.5 }}>{g.desc}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: '0 0 10px' }}>🔄 Human-in-the-Loop (HITL)</h4>
                  <p style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.6, margin: '0 0 10px' }}>Use <strong>Amazon A2I (Augmented AI)</strong> to route uncertain or low-confidence predictions to human reviewers.</p>
                  <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '10px 12px', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#7c3aed', marginBottom: '4px' }}>When to use HITL:</div>
                    <div style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.6 }}>Medical diagnosis · Financial decisions · Legal document review · Content moderation at edge cases · Any prediction with severe consequences if wrong</div>
                  </div>
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '8px 12px' }}>
                    <div style={{ fontSize: '0.77rem', color: '#991b1b', lineHeight: 1.5 }}><strong>Exam tip:</strong> "High-stakes decisions" + "uncertain AI output" → Amazon A2I</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4 — USE CASE DECISION FRAMEWORK */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#059669,#0d9488)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🗺️</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Section 4 — Use Case Decision Framework</h3>
              </div>

              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ padding: '12px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: 0 }}>What AI problem am I solving? → Which service?</h4>
                </div>
                <pre style={{ margin: 0, padding: '1rem', fontSize: '0.76rem', fontFamily: 'monospace', color: '#1f2937', background: '#f9fafb', lineHeight: 1.8, overflowX: 'auto', whiteSpace: 'pre' }}>{`What AI problem am I solving?
│
├─► "Chatbot / content generation / summarisation / Q&A"
│   └─► Amazon Bedrock (Claude / Titan / Nova) + Guardrails + Knowledge Bases (RAG)
│
├─► "Analyse text (sentiment, entities, language, translation)"
│   └─► Amazon Comprehend / Translate / Polly / Transcribe (pre-built APIs)
│
├─► "Analyse images or video (faces, objects, moderation)"
│   └─► Amazon Rekognition (images/video) or Textract (documents/forms)
│
├─► "Real-time product or content recommendations"
│   └─► Amazon Personalize (no ML expertise required)
│
├─► "Forecast demand, inventory, or time-series data"
│   └─► Amazon Forecast (automatic model selection)
│
├─► "Search enterprise documents with natural language"
│   └─► Amazon Kendra (intelligent semantic search)
│
├─► "Build a custom ML model with full control"
│   └─► Amazon SageMaker (full pipeline) or SageMaker Autopilot (no-code)
│
├─► "Detect bias in data or explain model predictions"
│   └─► SageMaker Clarify + Model Cards
│
├─► "Route uncertain predictions to human reviewers"
│   └─► Amazon A2I (Augmented AI) — Human-in-the-Loop
│
└─► "Reduce hallucinations from LLM"
    └─► RAG with Bedrock Knowledge Bases + Grounding Check Guardrail`}</pre>
              </div>

              {/* Quick Service → Keyword map */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#111827', margin: '0 0 10px' }}>⚡ Exam Keyword → Service Instant Map</h4>
                  {[
                    { kw: '"managed FM / foundation model API"', svc: 'Amazon Bedrock' },
                    { kw: '"RAG / real-time data / reduce hallucinations"', svc: 'Bedrock Knowledge Bases' },
                    { kw: '"multi-step autonomous agent"', svc: 'Bedrock Agents' },
                    { kw: '"content moderation / block toxic output"', svc: 'Bedrock Guardrails' },
                    { kw: '"domain-specific style / behavior change"', svc: 'Fine-tuning' },
                    { kw: '"semantic search / vector similarity"', svc: 'Embeddings + Vector Store' },
                    { kw: '"extract text from forms/invoices"', svc: 'Amazon Textract' },
                    { kw: '"sentiment / NLP / language detection"', svc: 'Amazon Comprehend' },
                    { kw: '"speech to text / transcription"', svc: 'Amazon Transcribe' },
                    { kw: '"image/video analysis"', svc: 'Amazon Rekognition' },
                    { kw: '"chatbot / intent recognition"', svc: 'Amazon Lex' },
                    { kw: '"enterprise document search"', svc: 'Amazon Kendra' },
                    { kw: '"bias detection in model"', svc: 'SageMaker Clarify' },
                    { kw: '"human review / uncertain prediction"', svc: 'Amazon A2I' },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '5px 0', borderBottom: i < 13 ? '1px solid #f3f4f6' : 'none', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.76rem', color: '#6b7280', fontStyle: 'italic' }}>{m.kw}</span>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#7c3aed', flexShrink: 0 }}>→ {m.svc}</span>
                    </div>
                  ))}
                </div>

                {/* Bedrock vs SageMaker decision */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>🆚 Bedrock vs SageMaker — Decision Table</h4>
                    </div>
                    {[
                      { signal: '"No ML expertise needed"', winner: 'Bedrock', why: 'Use FM via API with zero setup' },
                      { signal: '"Fastest time to value"', winner: 'Bedrock', why: 'No training, no infrastructure' },
                      { signal: '"Build + train custom model"', winner: 'SageMaker', why: 'Full pipeline control' },
                      { signal: '"AutoML, no-code training"', winner: 'SageMaker Autopilot', why: 'Hands-off model building' },
                      { signal: '"Monitor production drift"', winner: 'SageMaker Monitor', why: 'Continuous model quality checks' },
                      { signal: '"Detect training data bias"', winner: 'SageMaker Clarify', why: 'Pre/post-training bias reports' },
                    ].map((r, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '8px', padding: '8px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', alignItems: 'start' }}>
                        <span style={{ fontSize: '0.76rem', color: '#6b7280', fontStyle: 'italic', lineHeight: 1.5 }}>{r.signal}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.76rem', color: '#7c3aed' }}>{r.winner}</div>
                          <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{r.why}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: '0 0 10px' }}>✂️ Quick Elimination Tricks</h4>
                    {[
                      '"Use EC2 to host an LLM" → WRONG (use Bedrock or SageMaker endpoint)',
                      '"No guardrails needed" for customer-facing AI → WRONG (always include safety)',
                      '"Train model from scratch" for a common task → WRONG (use pre-built or fine-tune)',
                      '"Store PII in prompts without filtering" → WRONG (use Guardrails Sensitive Info)',
                      '"Bedrock trains on your data" → WRONG (your data is never used for training)',
                    ].map((e, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: i < 4 ? '7px' : 0 }}>
                        <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>❌</span>
                        <span style={{ fontSize: '0.77rem', color: '#374151', lineHeight: 1.5 }}>{e}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5 — COST */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#059669,#065f46)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>💰</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>Section 5 — Cost &amp; Optimisation</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>💲 Pricing Models for AI Services</h4>
                  </div>
                  {[
                    { svc: 'Bedrock', model: 'Per token (input + output)', tip: 'Use shorter prompts + cache frequent responses. Enable provisioned throughput for predictable high-volume.' },
                    { svc: 'SageMaker', model: 'Notebook time + training instance-hours + endpoint hours', tip: 'Spot Instances for training. Auto-scale endpoints. Shut down notebooks when idle.' },
                    { svc: 'Pre-built Services', model: 'Per API call / per image / per minute of audio', tip: 'Batch process when possible. Cache results. Use async APIs for large jobs.' },
                  ].map((r, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#059669' }}>{r.svc}</span>
                        <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>— {r.model}</span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#374151', lineHeight: 1.5 }}>💡 {r.tip}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1.25rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#065f46', margin: '0 0 10px' }}>✅ AI Cost Optimisation Checklist</h4>
                  {[
                    'Use Bedrock for generative AI (zero infrastructure overhead)',
                    'Choose Inferentia chips for inference workloads; Trainium for training',
                    'Enable auto-scaling on SageMaker endpoints (scale to zero when idle)',
                    'Use S3 Intelligent-Tiering for training data sets',
                    'Monitor with Cost Explorer — tag all AI resources by project/team',
                    'Start with pre-built AI services before building custom models',
                    'Use batch transforms for large inference jobs instead of real-time endpoints',
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: i < 6 ? '7px' : 0 }}>
                      <span style={{ color: '#16a34a', fontWeight: 800, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '0.78rem', color: '#166534', lineHeight: 1.5 }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MDLC + EVAL METRICS + DRIFT + SAGEMAKER INFERENCE + Q */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg,#7c3aed,#4c1d95)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>📐</div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827', margin: 0 }}>ML Lifecycle, Metrics, Drift & Deployment Patterns</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                {/* MDLC 7 phases */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', background: '#f5f3ff', borderBottom: '1px solid #ddd6fe' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#5b21b6', margin: 0 }}>🔄 ML Development Lifecycle (MDLC) — 7 Phases</h4>
                  </div>
                  {[
                    { phase: '1 — Business Goal', action: 'Define the problem in business terms', detail: 'What KPI are you moving? Is ML even needed? Success criteria must be measurable before any data work begins.' },
                    { phase: '2 — Problem Framing', action: 'Translate to ML task type', detail: 'Decide: regression (continuous output), classification (categorical output), or clustering (no labels). This choice drives all downstream decisions.' },
                    { phase: '3 — Data Collection & Prep', action: 'Collect, clean, and engineer features', detail: 'Most time-consuming phase. Handle missing values, remove duplicates, normalize, one-hot encode. Feature engineering creates new variables. "Garbage in, garbage out."' },
                    { phase: '4 — Model Training', action: 'Feed labeled data to algorithm', detail: 'Algorithm iteratively learns weights and parameters mapping inputs → outputs. SageMaker Training Jobs = fully managed, pay-per-use training compute.' },
                    { phase: '5 — Model Evaluation', action: 'Test on hold-out data never seen during training', detail: 'Measure accuracy, precision, recall, F1. Use confusion matrix for classification. A model that performs well on training data but poorly on hold-out data = overfitting.' },
                    { phase: '6 — Deployment', action: 'Integrate model into production application', detail: 'Real-time endpoint (low latency), serverless endpoint (intermittent traffic), or batch transform (large offline dataset). Choose based on traffic pattern.' },
                    { phase: '7 — Monitoring', action: 'Continuously watch production model', detail: 'Detect data drift (input distribution changes) and concept drift (relationship between input and output changes). SageMaker Model Monitor automates this.' },
                  ].map((p, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '155px 145px 1fr', padding: '9px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa', gap: '10px', alignItems: 'start' }}>
                      <span style={{ fontSize: '0.77rem', fontWeight: 700, color: '#7c3aed' }}>{p.phase}</span>
                      <span style={{ fontSize: '0.76rem', fontWeight: 600, color: '#111827' }}>{p.action}</span>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.55 }}>{p.detail}</span>
                    </div>
                  ))}
                </div>

                {/* Evaluation Metrics */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', background: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#991b1b', margin: 0 }}>📊 Classification Evaluation Metrics — Know the Formulas</h4>
                  </div>
                  {[
                    { metric: 'Accuracy', formula: 'Correct Predictions ÷ Total Predictions', when: 'Balanced datasets', trap: 'Misleading on imbalanced data — a model predicting "not fraud" 99% of the time looks 99% accurate if fraud is 1% of data.' },
                    { metric: 'Precision', formula: 'True Positives ÷ (True Positives + False Positives)', when: 'When false positives are costly', trap: 'High precision = few false alarms. Use when flagging something wrongly is expensive (e.g., spam filter — you don\'t want legit emails deleted).' },
                    { metric: 'Recall', formula: 'True Positives ÷ (True Positives + False Negatives)', when: 'When false negatives are costly', trap: 'High recall = few misses. Use when missing a real case is dangerous (e.g., cancer screening — you don\'t want to miss a real case).' },
                    { metric: 'F1 Score', formula: 'Harmonic mean of Precision and Recall', when: 'Imbalanced datasets', trap: 'Best single metric when you care about both precision and recall equally. Harmonic mean punishes extreme imbalance between the two.' },
                  ].map((m, i) => (
                    <div key={i} style={{ padding: '10px 14px', borderTop: i > 0 ? '1px solid #f3f4f6' : 'none', background: i % 2 === 0 ? '#fff' : '#fef2f2' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#dc2626' }}>{m.metric}</span>
                        <code style={{ fontSize: '0.72rem', background: '#fee2e2', color: '#991b1b', padding: '1px 8px', borderRadius: '4px' }}>{m.formula}</code>
                        <span style={{ fontSize: '0.68rem', background: '#f3f4f6', color: '#6b7280', padding: '1px 7px', borderRadius: '4px', flexShrink: 0 }}>Use when: {m.when}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.5 }}>{m.trap}</div>
                    </div>
                  ))}
                </div>

                {/* Data Drift vs Concept Drift */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { type: '📈 Data Drift', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe', definition: 'The statistical distribution of the input features changes from the distribution seen during training.', example: 'You trained a model on summer sales data. In winter, purchasing patterns are completely different — the model sees new inputs it was never trained on.', detect: 'SageMaker Model Monitor — compares live input distribution against training baseline.' },
                    { type: '🔀 Concept Drift', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', definition: 'The relationship between the input features and the target outcome changes — even if the input distribution looks the same.', example: 'A credit-scoring model trained before COVID. After COVID, the same income/debt ratio now predicts default differently — the world changed.', detect: 'SageMaker Model Monitor — compares predicted label distribution against ground truth labels (if available).' },
                  ].map((d, i) => (
                    <div key={i} style={{ background: d.bg, border: `1px solid ${d.border}`, borderRadius: '10px', padding: '1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: d.color, marginBottom: '8px' }}>{d.type}</div>
                      <div style={{ fontSize: '0.77rem', color: '#374151', marginBottom: '8px', lineHeight: 1.55 }}><strong>Definition:</strong> {d.definition}</div>
                      <div style={{ fontSize: '0.77rem', color: '#374151', marginBottom: '8px', lineHeight: 1.55 }}><strong>Example:</strong> {d.example}</div>
                      <div style={{ fontSize: '0.75rem', color: d.color, lineHeight: 1.5 }}><strong>Detection:</strong> {d.detect}</div>
                    </div>
                  ))}
                </div>

                {/* SageMaker Inference Types */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', background: '#f0fdf4', borderBottom: '1px solid #bbf7d0' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#15803d', margin: 0 }}>⚡ SageMaker Inference Types — Pick the Right Deployment</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#f9fafb', padding: '8px 14px', fontSize: '0.72rem', fontWeight: 700, color: '#374151', gap: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    {['Type', 'Traffic Pattern', 'Cost Model', 'Exam Trigger'].map(h => <span key={h}>{h}</span>)}
                  </div>
                  {[
                    { type: 'Real-Time Inference', traffic: 'Steady, continuous, low-latency required', cost: 'Pay for instance uptime 24/7', trigger: '"Real-time predictions", "low-latency endpoint", "online inference"' },
                    { type: 'Serverless Inference', traffic: 'Intermittent or unpredictable — traffic spikes then silence', cost: 'Pay only for compute used during requests (scales to zero)', trigger: '"Minimize cost", "unpredictable traffic", "no idle server cost"' },
                    { type: 'Batch Transform', traffic: 'Large offline dataset — not real-time', cost: 'Pay for temporary fleet only during job run', trigger: '"Millions of records overnight", "batch scoring", "no live endpoint needed"' },
                    { type: 'Async Inference', traffic: 'Large payloads or long inference time (up to 1 hour)', cost: 'Pay for instance uptime + queue', trigger: '"Large input payload", "video processing", "document analysis with long wait"' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '9px 14px', borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#f0fdf4', gap: '8px', alignItems: 'start' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#15803d' }}>{r.type}</span>
                      <span style={{ fontSize: '0.75rem', color: '#374151' }}>{r.traffic}</span>
                      <span style={{ fontSize: '0.75rem', color: '#374151' }}>{r.cost}</span>
                      <span style={{ fontSize: '0.73rem', color: '#6b7280', fontStyle: 'italic' }}>{r.trigger}</span>
                    </div>
                  ))}
                </div>

                {/* Amazon Q Business vs Developer */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', background: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.88rem', color: '#92400e', margin: 0 }}>🆚 Amazon Q Business vs Amazon Q Developer — Know the Difference</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', background: '#f9fafb', padding: '8px 14px', fontSize: '0.72rem', fontWeight: 700, color: '#374151', gap: '8px', borderBottom: '1px solid #e5e7eb' }}>
                    {['Attribute', 'Q Business', 'Q Developer'].map(h => <span key={h}>{h}</span>)}
                  </div>
                  {[
                    { attr: 'Audience', biz: 'Business users and employees', dev: 'Software developers' },
                    { attr: 'Primary use case', biz: 'Ask questions about company data — HR policies, sales docs, internal wikis', dev: 'Write code, scan for vulnerabilities, generate tests, upgrade legacy code' },
                    { attr: 'Data sources', biz: 'S3, SharePoint, Salesforce, Slack, Confluence, 40+ connectors', dev: 'IDE (VS Code, JetBrains), CLI, AWS Console' },
                    { attr: 'Key differentiator', biz: 'Respects existing access controls — if user can\'t see doc in source system, Q won\'t show it', dev: 'Security scans for OWASP Top 10 vulnerabilities with one-click remediation' },
                    { attr: 'Killer feature', biz: 'Role-based access control on AI answers', dev: 'Code Transformation Agent — auto-upgrades Java 8 → 17' },
                    { attr: 'Formerly known as', biz: 'N/A (new product)', dev: 'Amazon CodeWhisperer' },
                    { attr: 'Exam trigger', biz: '"Employee self-service", "internal chatbot", "enterprise knowledge base"', dev: '"AI coding assistant", "code security scan", "legacy code upgrade"' },
                  ].map((r, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', padding: '8px 14px', borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fffbeb', gap: '8px', alignItems: 'start' }}>
                      <span style={{ fontSize: '0.77rem', fontWeight: 700, color: '#92400e' }}>{r.attr}</span>
                      <span style={{ fontSize: '0.75rem', color: '#374151' }}>{r.biz}</span>
                      <span style={{ fontSize: '0.75rem', color: '#374151' }}>{r.dev}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* AIF MANTRA */}
            <div style={{ background: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 50%, #4c1d95 100%)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🤖</div>
              <h3 style={{ color: '#f5f3ff', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 1rem' }}>The AI Practitioner's Mantra</h3>
              <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  '"Bedrock = use foundation models. SageMaker = build your own. Never swap them."',
                  '"RAG reduces hallucinations. Guardrails prevent harmful outputs. Both together = responsible AI."',
                  '"Supervised = labeled data. Unsupervised = find patterns. Generative = create new content."',
                  '"Bedrock never trains on your data. Privacy is built in by default."',
                  '"Trainium trains. Inferentia infers. Remember the function, not just the name."',
                  '"Responsible AI: Fairness, Explainability, Privacy, Robustness — Clarify detects bias, A2I adds humans."',
                ].map((m, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 16px' }}>
                    <span style={{ color: '#e0e7ff', fontSize: '0.84rem', fontStyle: 'italic', lineHeight: 1.55 }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </Layout>
  )
}
