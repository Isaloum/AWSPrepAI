const AIF_QUESTIONS = [
  {
    "cat": "ai-fundamentals",
    "q": "A company wants to predict customer churn based on historical usage data. They have labeled data showing which customers churned. Which ML approach is most appropriate?",
    "options": [
      "Supervised binary classification using labeled churn data",
      "Unsupervised clustering to group customers",
      "Reinforcement learning with customer reward signals",
      "Generative AI to synthesize churn scenarios"
    ],
    "answer": 0,
    "explain": "Supervised learning uses labeled historical data (churned vs not churned) to train a model that predicts outcomes for new customers. Binary classification is the correct approach when the output is one of two classes."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A data scientist notices their model performs perfectly on training data but poorly on new data. What is this phenomenon called?",
    "options": [
      "Overfitting due to high variance",
      "Underfitting due to high bias",
      "Data drift causing distribution shift",
      "Feature leakage from the test set"
    ],
    "answer": 0,
    "explain": "Overfitting occurs when a model memorizes training data including noise, resulting in high training accuracy but poor generalization to unseen data. It is characterized by high variance."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company needs to detect fraudulent transactions in real time. The dataset has 1 million legitimate transactions and only 500 fraud cases. What challenge does this represent?",
    "options": [
      "Class imbalance requiring specialized techniques",
      "Overfitting due to too many features",
      "Underfitting due to insufficient model complexity",
      "Data leakage from overlapping train and test sets"
    ],
    "answer": 0,
    "explain": "Class imbalance occurs when one class vastly outnumbers another. Techniques like SMOTE, class weighting, or using precision-recall metrics instead of accuracy help handle this challenge."
  },
  {
    "cat": "ai-fundamentals",
    "q": "Which AWS service provides a fully managed platform for building, training, and deploying machine learning models at scale?",
    "options": [
      "Amazon Rekognition",
      "AWS DeepLens",
      "Amazon SageMaker",
      "Amazon Comprehend"
    ],
    "answer": 2,
    "explain": "Amazon SageMaker is the fully managed ML platform on AWS covering the entire ML lifecycle: data labeling, feature engineering, training, tuning, deployment, and monitoring."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company wants to classify customer support emails into categories without any labeled training data. Which approach should they use?",
    "options": [
      "Unsupervised clustering with K-Means or topic modeling",
      "Supervised multi-class classification",
      "Reinforcement learning with email response rewards",
      "Fine-tuning a pre-trained classifier on labeled data"
    ],
    "answer": 0,
    "explain": "Unsupervised learning discovers patterns without labels. Clustering algorithms like K-Means or topic models like LDA group emails into natural categories without requiring pre-labeled examples."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A retail company wants to recommend products to users based on purchase history of similar users. What type of recommendation system is this?",
    "options": [
      "Collaborative filtering based on user behavior",
      "Content-based filtering using item attributes",
      "Knowledge-based recommendations using rules",
      "Hybrid approach combining content and demographics"
    ],
    "answer": 0,
    "explain": "Collaborative filtering finds patterns across users with similar behavior to make recommendations. Amazon Personalize implements this approach for real-time personalized recommendations."
  },
  {
    "cat": "ai-fundamentals",
    "q": "Which metric is most appropriate for evaluating a model that detects rare diseases, where false negatives (missing a disease) are much more costly than false positives?",
    "options": [
      "Accuracy",
      "Specificity",
      "Recall (Sensitivity)",
      "F1 Score"
    ],
    "answer": 2,
    "explain": "Recall measures the proportion of actual positives correctly identified. High recall minimizes false negatives, which is critical in medical diagnosis where missing a disease has serious consequences."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company uses Amazon SageMaker to train a model. Training is taking 6 hours and costs are high. What SageMaker feature can reduce training time across multiple GPUs?",
    "options": [
      "SageMaker Distributed Training with data parallelism",
      "SageMaker Automatic Model Tuning",
      "SageMaker Debugger for bottleneck detection",
      "SageMaker Clarify for bias detection"
    ],
    "answer": 0,
    "explain": "SageMaker Distributed Training splits training data or model layers across multiple GPUs/instances, significantly reducing training time for large models and datasets."
  },
  {
    "cat": "ai-fundamentals",
    "q": "What is the purpose of a train/validation/test split in machine learning?",
    "options": [
      "To increase the amount of training data available",
      "To train on all data then evaluate on a subset",
      "To train the model, tune hyperparameters, and provide an unbiased final evaluation",
      "To reduce overfitting by limiting training data size"
    ],
    "answer": 2,
    "explain": "The train set trains the model, the validation set guides hyperparameter tuning, and the test set provides a final unbiased evaluation of generalization performance on completely unseen data."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company wants to extract key phrases and detect the sentiment of customer reviews automatically. Which AWS service handles this without any ML expertise?",
    "options": [
      "Amazon Comprehend",
      "Amazon Textract",
      "Amazon Kendra",
      "Amazon Transcribe"
    ],
    "answer": 0,
    "explain": "Amazon Comprehend is a natural language processing (NLP) service that extracts key phrases, entities, sentiment, and language from text without requiring ML expertise."
  },
  {
    "cat": "ai-fundamentals",
    "q": "Which type of ML algorithm learns by receiving rewards and penalties through interaction with an environment?",
    "options": [
      "Supervised learning with labeled feedback",
      "Unsupervised learning from unlabeled data",
      "Reinforcement learning through trial and error",
      "Semi-supervised learning with partial labels"
    ],
    "answer": 2,
    "explain": "Reinforcement learning trains agents to maximize cumulative reward through interaction with an environment. The agent learns which actions lead to positive outcomes through trial and error."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A model trained on data from 2020 is deployed in 2024. Its accuracy has degraded because user behavior has changed significantly. What is this called?",
    "options": [
      "Data drift or model drift requiring retraining",
      "Model overfitting from stale training data",
      "Concept drift due to infrastructure changes",
      "Feature engineering failure"
    ],
    "answer": 0,
    "explain": "Data drift (or concept drift) occurs when the statistical properties of input data or the relationship between inputs and outputs changes over time, degrading model performance. Regular monitoring and retraining addresses this."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company wants to convert audio from customer service calls into text for analysis. Which AWS service should they use?",
    "options": [
      "Amazon Comprehend",
      "Amazon Polly",
      "Amazon Transcribe",
      "Amazon Lex"
    ],
    "answer": 2,
    "explain": "Amazon Transcribe is a speech-to-text service that converts audio to text. It supports batch and streaming transcription, speaker identification, and custom vocabularies."
  },
  {
    "cat": "ai-fundamentals",
    "q": "Which component of Amazon SageMaker automatically searches for the best hyperparameter values to optimize model performance?",
    "options": [
      "SageMaker Automatic Model Tuning (Hyperparameter Optimization)",
      "SageMaker Experiments",
      "SageMaker Autopilot",
      "SageMaker Feature Store"
    ],
    "answer": 0,
    "explain": "SageMaker Automatic Model Tuning (HPO) uses Bayesian optimization or random search to find the best hyperparameter combinations, reducing the manual effort of tuning model configuration."
  },
  {
    "cat": "ai-fundamentals",
    "q": "What is feature engineering in machine learning?",
    "options": [
      "Transforming raw data into meaningful inputs that improve model performance",
      "Selecting the best ML algorithm for a given problem",
      "Evaluating model accuracy on a test dataset",
      "Deploying a trained model to a production endpoint"
    ],
    "answer": 0,
    "explain": "Feature engineering transforms raw data into features that better represent the underlying problem, improving model performance. Examples include normalization, encoding categorical variables, and creating interaction terms."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company uses Amazon Rekognition to scan uploaded images for inappropriate content. What category of ML does this represent?",
    "options": [
      "Computer Vision",
      "Natural Language Processing (NLP)",
      "Time Series Forecasting",
      "Tabular Data Classification"
    ],
    "answer": 0,
    "explain": "Computer vision applies ML to image and video analysis. Amazon Rekognition uses deep learning to detect objects, faces, scenes, and content moderation labels in images and videos."
  },
  {
    "cat": "ai-fundamentals",
    "q": "What does the ROC-AUC metric measure in a binary classification model?",
    "options": [
      "The model's ability to distinguish between classes across all thresholds",
      "The average loss across all training examples",
      "The ratio of true positives to total predicted positives",
      "The percentage of correctly classified examples"
    ],
    "answer": 0,
    "explain": "ROC-AUC (Area Under the ROC Curve) measures the probability that a randomly chosen positive example ranks higher than a randomly chosen negative example, aggregated across all classification thresholds."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A healthcare company needs to store and share curated features used across multiple ML models. Which SageMaker feature should they use?",
    "options": [
      "SageMaker Feature Store",
      "SageMaker Data Wrangler",
      "SageMaker Model Registry",
      "SageMaker Pipelines"
    ],
    "answer": 0,
    "explain": "SageMaker Feature Store is a centralized repository for storing, retrieving, and sharing ML features. It supports both online (low-latency) and offline (batch) feature access, ensuring consistency across models."
  },
  {
    "cat": "ai-fundamentals",
    "q": "Which AWS service provides pre-built ML models for common use cases like image recognition, translation, and text-to-speech without training custom models?",
    "options": [
      "AWS AI Services (Rekognition, Translate, Polly, etc.)",
      "Amazon SageMaker Autopilot",
      "Amazon SageMaker JumpStart",
      "AWS DeepRacer"
    ],
    "answer": 0,
    "explain": "AWS AI Services provide pre-trained ML capabilities via simple APIs — no ML expertise required. They cover vision (Rekognition), language (Comprehend, Translate), speech (Transcribe, Polly), and more."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A data scientist wants to automatically build, train, and tune ML models with minimal code. Which SageMaker feature enables this?",
    "options": [
      "SageMaker Ground Truth",
      "SageMaker Clarify",
      "SageMaker Autopilot",
      "SageMaker Debugger"
    ],
    "answer": 2,
    "explain": "SageMaker Autopilot automatically explores ML algorithms, preprocesses data, trains multiple models, and tunes hyperparameters, providing a fully automated ML pipeline with explainability reports."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company needs to label thousands of images to train an object detection model. Which AWS service manages this labeling workflow?",
    "options": [
      "Amazon SageMaker Ground Truth",
      "Amazon Rekognition Custom Labels",
      "AWS Batch for parallel processing",
      "Amazon Mechanical Turk directly"
    ],
    "answer": 0,
    "explain": "SageMaker Ground Truth manages data labeling workflows combining automated labeling (using active learning) with human labelers, reducing labeling costs by up to 70%."
  },
  {
    "cat": "ai-fundamentals",
    "q": "What type of neural network is most effective for processing sequential data like text or time series?",
    "options": [
      "Recurrent Neural Network (RNN) or Transformer",
      "Convolutional Neural Network (CNN)",
      "Generative Adversarial Network (GAN)",
      "Autoencoder"
    ],
    "answer": 0,
    "explain": "RNNs and Transformers are designed for sequential data. Transformers (used in modern LLMs) use attention mechanisms to capture long-range dependencies in text, outperforming traditional RNNs."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company wants to forecast product demand for the next 30 days using historical sales data. Which AWS service is purpose-built for this?",
    "options": [
      "Amazon Forecast",
      "Amazon Lookout for Metrics",
      "Amazon SageMaker Canvas",
      "Amazon QuickSight ML Insights"
    ],
    "answer": 0,
    "explain": "Amazon Forecast is a fully managed time-series forecasting service using ML. It automatically selects the best algorithm (e.g., DeepAR+) and handles missing data, seasonality, and related time series."
  },
  {
    "cat": "ai-fundamentals",
    "q": "Which technique helps a model generalize better by randomly dropping neurons during training?",
    "options": [
      "Dropout regularization",
      "Batch normalization",
      "L2 weight regularization",
      "Data augmentation"
    ],
    "answer": 0,
    "explain": "Dropout randomly deactivates a percentage of neurons during each training step, preventing co-adaptation and reducing overfitting, forcing the network to learn more robust features."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company wants to detect anomalies in IoT sensor data without labeled examples of failures. Which approach is appropriate?",
    "options": [
      "Unsupervised anomaly detection using statistical outlier methods",
      "Supervised anomaly detection with labeled failure data",
      "Reinforcement learning with failure rewards",
      "Transfer learning from a pre-trained failure model"
    ],
    "answer": 0,
    "explain": "Unsupervised anomaly detection identifies statistical outliers from normal patterns without requiring labeled failure examples. Amazon Lookout for Equipment and Lookout for Metrics use this approach."
  },
  {
    "cat": "generative-ai",
    "q": "A company wants to build a chatbot that answers questions about their internal documentation. Which generative AI architecture is most appropriate?",
    "options": [
      "Using Retrieval Augmented Generation (RAG) to ground responses in company docs",
      "Training a new LLM from scratch on company data",
      "Fine-tuning an LLM on all company documents",
      "Using a rules-based chatbot with keyword matching"
    ],
    "answer": 0,
    "explain": "RAG retrieves relevant documents from a knowledge base and provides them as context to an LLM, enabling accurate, grounded responses without the cost of training or full fine-tuning."
  },
  {
    "cat": "generative-ai",
    "q": "What is a foundation model in the context of generative AI?",
    "options": [
      "A large pre-trained model on broad data that can be adapted to many tasks",
      "A small specialized model trained on domain-specific data",
      "A rules-based model that generates outputs from templates",
      "An ensemble of small models combined for better accuracy"
    ],
    "answer": 0,
    "explain": "Foundation models are large-scale models trained on massive datasets that develop general capabilities transferable to many downstream tasks through prompting or fine-tuning."
  },
  {
    "cat": "generative-ai",
    "q": "Which AWS service provides access to multiple foundation models from providers like Anthropic, Meta, and Amazon through a single API?",
    "options": [
      "Amazon Bedrock",
      "Amazon SageMaker JumpStart",
      "AWS Lambda with model containers",
      "Amazon Comprehend Advanced"
    ],
    "answer": 0,
    "explain": "Amazon Bedrock is a fully managed service providing access to foundation models from multiple providers (Anthropic Claude, Meta Llama, Amazon Titan, Mistral, etc.) via a single API without managing infrastructure."
  },
  {
    "cat": "generative-ai",
    "q": "A developer wants to improve an LLM's responses without modifying model weights. Which technique should they use?",
    "options": [
      "Prompt engineering using system prompts and few-shot examples",
      "Fine-tuning with supervised training",
      "Retraining the model on domain data",
      "Increasing model parameters via scaling"
    ],
    "answer": 0,
    "explain": "Prompt engineering shapes LLM behavior through carefully crafted instructions, system prompts, and few-shot examples. It is the fastest and cheapest way to improve responses without changing model weights."
  },
  {
    "cat": "generative-ai",
    "q": "What does 'hallucination' mean in the context of large language models?",
    "options": [
      "The model generating factually incorrect or fabricated information confidently",
      "The model refusing to answer a question",
      "The model producing outputs slower than expected",
      "The model producing outputs that violate safety guidelines"
    ],
    "answer": 0,
    "explain": "Hallucination refers to LLMs generating confident but factually incorrect or fabricated information. It occurs because LLMs predict likely text rather than retrieving verified facts."
  },
  {
    "cat": "generative-ai",
    "q": "A company wants to give an LLM the ability to check real-time stock prices during a conversation. What capability enables this?",
    "options": [
      "Fine-tuning the model with financial data",
      "RAG with a financial document database",
      "Connecting the LLM to external APIs using tool use/function calling",
      "Expanding the model's context window"
    ],
    "answer": 2,
    "explain": "Tool use (function calling) allows LLMs to call external APIs, databases, or services to retrieve real-time information beyond their training data, enabling dynamic and up-to-date responses."
  },
  {
    "cat": "generative-ai",
    "q": "What is the context window of a large language model?",
    "options": [
      "The maximum amount of text (tokens) the model can process in a single interaction",
      "The maximum number of training examples used during fine-tuning",
      "The number of attention heads in the transformer architecture",
      "The temperature parameter controlling output randomness"
    ],
    "answer": 0,
    "explain": "The context window is the maximum number of tokens (words/subwords) an LLM can process at once, including input prompt and output. Larger context windows allow processing longer documents."
  },
  {
    "cat": "generative-ai",
    "q": "Which Amazon Bedrock feature allows you to customize a foundation model with your own labeled data without managing training infrastructure?",
    "options": [
      "Bedrock Model Customization (Fine-tuning)",
      "Bedrock Knowledge Bases",
      "Bedrock Agents",
      "Bedrock Guardrails"
    ],
    "answer": 0,
    "explain": "Amazon Bedrock Model Customization allows fine-tuning or continued pre-training of supported foundation models using your own data, improving performance on domain-specific tasks."
  },
  {
    "cat": "generative-ai",
    "q": "A company wants to automate multi-step tasks like researching, drafting, and sending emails using an LLM. What Amazon Bedrock feature enables autonomous task execution?",
    "options": [
      "Bedrock Knowledge Bases for document retrieval",
      "Bedrock Guardrails for content filtering",
      "Bedrock Agents for multi-step task orchestration",
      "Bedrock Provisioned Throughput for consistent latency"
    ],
    "answer": 2,
    "explain": "Amazon Bedrock Agents orchestrate multi-step workflows by breaking tasks into steps, calling APIs, querying knowledge bases, and executing actions autonomously using LLMs."
  },
  {
    "cat": "generative-ai",
    "q": "What is the temperature parameter in LLM inference?",
    "options": [
      "The GPU temperature during model training",
      "The number of tokens generated per second",
      "A parameter controlling the randomness and creativity of model outputs",
      "The confidence threshold for content filtering"
    ],
    "answer": 2,
    "explain": "Temperature controls output randomness. Low temperature (near 0) produces deterministic, focused responses. High temperature produces more creative, diverse outputs. Set to 0 for factual tasks, higher for creative writing."
  },
  {
    "cat": "generative-ai",
    "q": "A company needs to build a Q&A system over a 10,000-page document library. What is the best architecture?",
    "options": [
      "Load all documents into the LLM context window",
      "Fine-tune an LLM on all 10,000 pages",
      "Use RAG with embeddings stored in a vector database for semantic search",
      "Use Amazon Kendra alone without an LLM"
    ],
    "answer": 2,
    "explain": "RAG uses embeddings to semantically search relevant document chunks, then provides them as context to an LLM. This scales to any document size without fitting everything in the context window."
  },
  {
    "cat": "generative-ai",
    "q": "What is an embedding in the context of generative AI?",
    "options": [
      "A compression technique for storing model weights",
      "The process of injecting context into an LLM prompt",
      "A numerical vector representation of text capturing semantic meaning",
      "A type of attention mechanism in transformer models"
    ],
    "answer": 2,
    "explain": "Embeddings convert text into dense numerical vectors where semantically similar text has similar vectors. They enable semantic search, clustering, and retrieval in RAG systems."
  },
  {
    "cat": "generative-ai",
    "q": "Which technique involves providing examples of desired input-output behavior directly in the prompt to guide LLM responses?",
    "options": [
      "Zero-shot prompting with no examples",
      "Chain-of-thought prompting for reasoning",
      "Few-shot prompting with input-output examples",
      "Retrieval augmentation for grounding"
    ],
    "answer": 2,
    "explain": "Few-shot prompting includes example input-output pairs in the prompt to demonstrate the desired format and behavior to the LLM, improving performance on structured tasks without fine-tuning."
  },
  {
    "cat": "generative-ai",
    "q": "A user asks an LLM to show its reasoning step by step before giving a final answer to a complex math problem. What prompting technique is this?",
    "options": [
      "Few-shot prompting",
      "Zero-shot prompting",
      "Chain-of-thought prompting",
      "Role prompting"
    ],
    "answer": 2,
    "explain": "Chain-of-thought prompting asks the model to show intermediate reasoning steps before the final answer. This significantly improves accuracy on complex reasoning, math, and logic tasks."
  },
  {
    "cat": "generative-ai",
    "q": "What is the primary difference between fine-tuning and RAG for customizing LLM behavior?",
    "options": [
      "Fine-tuning is cheaper; RAG requires expensive GPU training",
      "RAG produces permanent changes to model behavior; fine-tuning is temporary",
      "Fine-tuning modifies model weights with training; RAG retrieves context at inference without changing weights",
      "Fine-tuning works only for text; RAG works for all modalities"
    ],
    "answer": 2,
    "explain": "Fine-tuning permanently modifies model weights through supervised training, improving style and task performance. RAG retrieves external knowledge at inference time without modifying the model, keeping knowledge updatable."
  },
  {
    "cat": "generative-ai",
    "q": "Amazon Bedrock Knowledge Bases automates which part of a RAG pipeline?",
    "options": [
      "Fine-tuning the foundation model on retrieved documents",
      "Output validation and hallucination detection",
      "Document ingestion, chunking, embedding, and vector storage",
      "Provisioning GPU infrastructure for inference"
    ],
    "answer": 2,
    "explain": "Bedrock Knowledge Bases automates the entire RAG data pipeline: ingesting documents from S3, chunking them, generating embeddings, and storing them in a managed vector store for semantic retrieval."
  },
  {
    "cat": "generative-ai",
    "q": "A company wants LLM outputs to always stay within a specific topic domain and never reveal confidential information. Which Amazon Bedrock feature helps enforce this?",
    "options": [
      "Bedrock Agents with action groups",
      "Bedrock Knowledge Bases with filtered retrieval",
      "Bedrock Guardrails with topic restrictions and content filters",
      "Bedrock Provisioned Throughput"
    ],
    "answer": 2,
    "explain": "Amazon Bedrock Guardrails lets you configure topic filters, content filters, PII redaction, and word blocklists to control what topics the model can discuss and prevent information leakage."
  },
  {
    "cat": "generative-ai",
    "q": "What does 'grounding' mean in the context of LLM applications?",
    "options": [
      "Converting LLM responses to speech output",
      "Setting the LLM temperature to zero for deterministic outputs",
      "Anchoring LLM responses to verified external data sources to reduce hallucinations",
      "Deploying the LLM on dedicated hardware for consistency"
    ],
    "answer": 2,
    "explain": "Grounding anchors LLM responses to external, verified data (through RAG or tool use), reducing hallucinations by ensuring responses are based on retrieved facts rather than model memorization."
  },
  {
    "cat": "generative-ai",
    "q": "A developer wants to use Amazon Bedrock to generate text with consistent low latency for a production application with predictable volume. What should they configure?",
    "options": [
      "On-demand inference with automatic scaling",
      "AWS Lambda with model containers",
      "Bedrock Provisioned Throughput for reserved model capacity",
      "SageMaker real-time endpoints"
    ],
    "answer": 2,
    "explain": "Bedrock Provisioned Throughput reserves model capacity for consistent, low-latency inference at predictable costs, suitable for production workloads requiring guaranteed throughput."
  },
  {
    "cat": "generative-ai",
    "q": "Which AWS service provides a vector database for storing embeddings used in RAG applications?",
    "options": [
      "Amazon DynamoDB with vector extensions",
      "Amazon Redshift for vector similarity search",
      "Amazon Aurora with pgvector or Amazon OpenSearch Serverless",
      "Amazon ElastiCache with vector search plugin"
    ],
    "answer": 2,
    "explain": "Amazon OpenSearch Serverless (with vector engine) and Amazon Aurora with pgvector support vector similarity search. Bedrock Knowledge Bases integrates with these for managed RAG vector storage."
  },
  {
    "cat": "generative-ai",
    "q": "What is the purpose of system prompts in LLM applications?",
    "options": [
      "To train the model on new data at inference time",
      "To increase the model's context window size",
      "To set the model's persona, behavior constraints, and task instructions before the conversation",
      "To configure inference hardware parameters"
    ],
    "answer": 2,
    "explain": "System prompts define the LLM's role, behavior, tone, constraints, and instructions at the start of a conversation. They shape all subsequent responses without requiring user input."
  },
  {
    "cat": "generative-ai",
    "q": "A company uses an LLM to summarize legal contracts. The model sometimes ignores important clauses. What is the most effective solution?",
    "options": [
      "Increase the temperature parameter for more creative summaries",
      "Switch to a smaller model for faster processing",
      "Use chain-of-thought prompting to guide the model through each clause systematically",
      "Reduce the context window to force focus on key sections"
    ],
    "answer": 2,
    "explain": "Chain-of-thought prompting guides the model to systematically analyze each section step by step, reducing the chance of important clauses being skipped in complex document summarization tasks."
  },
  {
    "cat": "generative-ai",
    "q": "What is token in the context of large language models?",
    "options": [
      "A security credential for API authentication",
      "A memory unit storing model weights",
      "A unit of text (roughly 3-4 characters or 0.75 words) that LLMs process",
      "A billing unit equal to one API call"
    ],
    "answer": 2,
    "explain": "Tokens are the basic units LLMs process. A token is roughly 3-4 characters or 0.75 words. LLM pricing, context windows, and throughput are all measured in tokens."
  },
  {
    "cat": "generative-ai",
    "q": "A developer is building a customer service bot using Amazon Bedrock. They need the bot to look up order status from a database during the conversation. What Bedrock feature enables this?",
    "options": [
      "Bedrock Knowledge Bases for static document retrieval",
      "Bedrock Guardrails with API access permissions",
      "Bedrock Agents with action groups connected to a Lambda function",
      "Bedrock Model Customization with order data fine-tuning"
    ],
    "answer": 2,
    "explain": "Bedrock Agents with action groups use Lambda functions to call external APIs and databases in real time. The agent decides when to call which action based on the conversation context."
  },
  {
    "cat": "foundation-models",
    "q": "A company wants to use a foundation model to classify customer emails without providing any training examples. The model uses its pre-trained knowledge to classify. What is this called?",
    "options": [
      "One-shot learning with a single example",
      "Fine-tuning on email classification data",
      "Zero-shot classification using the model's general knowledge",
      "Transfer learning from a related domain"
    ],
    "answer": 2,
    "explain": "Zero-shot classification leverages a foundation model's broad pre-trained knowledge to classify inputs into categories it has never explicitly been trained on, using only a task description."
  },
  {
    "cat": "foundation-models",
    "q": "Which statement best describes how transformer-based foundation models process text?",
    "options": [
      "They process words one at a time sequentially like RNNs",
      "They use convolutional filters to detect local text patterns",
      "They use attention mechanisms to weigh relationships between all tokens simultaneously",
      "They compress text into fixed-size vectors before processing"
    ],
    "answer": 2,
    "explain": "Transformers use self-attention to compute relationships between all tokens simultaneously, regardless of distance. This parallel processing and long-range dependency modeling is why transformers outperform RNNs on language tasks."
  },
  {
    "cat": "foundation-models",
    "q": "A company needs a foundation model that can analyze both images and text in the same prompt. What capability does the model need?",
    "options": [
      "Extended context window for long documents",
      "Retrieval augmentation with an image database",
      "Fine-tuning on image-text pairs",
      "Multimodal capability supporting both image and text inputs"
    ],
    "answer": 3,
    "explain": "Multimodal models accept inputs in multiple formats (text, images, audio). Models like Claude claude-sonnet-4-6 can analyze images and text together, enabling tasks like visual question answering."
  },
  {
    "cat": "foundation-models",
    "q": "When should a company choose fine-tuning over prompt engineering for a foundation model?",
    "options": [
      "When they need real-time access to external data sources",
      "When the task requires accessing information newer than the model's training cutoff",
      "When they want to reduce inference latency without model changes",
      "When the model needs to adopt a specific style, format, or domain expertise not achievable through prompting"
    ],
    "answer": 3,
    "explain": "Fine-tuning is appropriate when prompt engineering cannot achieve required performance — typically for consistent style, specialized vocabulary, or complex domain knowledge. It permanently modifies model behavior through supervised training."
  },
  {
    "cat": "foundation-models",
    "q": "A company deployed an Amazon Bedrock model that generates SQL queries from natural language. Users report the model sometimes generates incorrect table names. What is the best fix?",
    "options": [
      "Increase the model temperature for more varied outputs",
      "Enable streaming inference for faster responses",
      "Switch to a larger foundation model",
      "Add the database schema to the system prompt as context"
    ],
    "answer": 3,
    "explain": "Providing the database schema in the system prompt grounds the model's SQL generation in actual table and column names, significantly reducing hallucinated table names and incorrect queries."
  },
  {
    "cat": "foundation-models",
    "q": "What is the primary advantage of using Amazon Bedrock over self-hosting an open-source foundation model on EC2?",
    "options": [
      "Bedrock models are always more capable than open-source alternatives",
      "Bedrock provides lower inference costs in all scenarios",
      "Bedrock allows unrestricted fine-tuning of any model",
      "Bedrock eliminates infrastructure management, scaling, and model serving complexity"
    ],
    "answer": 3,
    "explain": "Amazon Bedrock is fully managed — no infrastructure to provision, patch, or scale. You pay per token with no upfront costs, while self-hosting requires GPU instances, serving frameworks, and operational overhead."
  },
  {
    "cat": "foundation-models",
    "q": "A company uses a foundation model for code generation. They want to evaluate output quality automatically. Which approach is most appropriate?",
    "options": [
      "Human evaluation by senior developers for every output",
      "Using a judge LLM to score code correctness and style automatically",
      "Running unit tests on generated code and measuring pass rate",
      "Measuring BLEU score against reference implementations"
    ],
    "answer": 2,
    "explain": "Running automated unit tests on generated code and measuring pass rates provides objective, scalable code quality evaluation. This is more reliable than BLEU scores for code and more scalable than human review."
  },
  {
    "cat": "foundation-models",
    "q": "Which parameter controls how many top token candidates are considered during text generation, balancing quality and diversity?",
    "options": [
      "Temperature for randomness control",
      "Frequency penalty reducing repetition",
      "Max tokens limiting output length",
      "Top-P (nucleus sampling) controlling the cumulative probability threshold"
    ],
    "answer": 3,
    "explain": "Top-P (nucleus sampling) selects tokens from the smallest set whose cumulative probability exceeds P. Lower values produce focused, predictable outputs; higher values allow more diverse token selection."
  },
  {
    "cat": "foundation-models",
    "q": "A legal firm uses Claude on Amazon Bedrock to review contracts. They need all outputs to cite the specific contract clauses they reference. What technique should they use?",
    "options": [
      "Set temperature to 0 for deterministic outputs",
      "Enable Bedrock Guardrails for citation enforcement",
      "Use fine-tuning with citation examples",
      "Instruct the model in the system prompt to always cite source clauses with quotes"
    ],
    "answer": 3,
    "explain": "System prompt instructions are the most effective way to enforce consistent output formats like citations. Instructing the model to always quote source clauses directly improves traceability and reduces fabricated references."
  },
  {
    "cat": "foundation-models",
    "q": "What is prompt injection in the context of LLM applications?",
    "options": [
      "Adding examples to a prompt to improve model performance",
      "Setting up system prompts programmatically via API",
      "Injecting retrieved documents into the context for RAG",
      "Malicious user input designed to override system prompt instructions"
    ],
    "answer": 3,
    "explain": "Prompt injection is an attack where malicious input tries to override the system prompt, changing model behavior or extracting confidential information. Input validation and Bedrock Guardrails help mitigate this."
  },
  {
    "cat": "foundation-models",
    "q": "A company needs a foundation model to process 200-page legal documents in a single request. What model attribute is most critical?",
    "options": [
      "High temperature for creative analysis",
      "Low latency for real-time responses",
      "Multimodal capability for image extraction",
      "Large context window (100K+ tokens) to process long documents"
    ],
    "answer": 3,
    "explain": "A large context window is essential for processing long documents in a single request. Models with 100K+ token context windows can process entire legal documents without chunking."
  },
  {
    "cat": "foundation-models",
    "q": "Which Amazon Bedrock foundation model family is developed by Anthropic and optimized for safety, helpfulness, and complex reasoning?",
    "options": [
      "Amazon Titan models",
      "Mistral AI models",
      "Meta Llama models",
      "Claude model family"
    ],
    "answer": 3,
    "explain": "Anthropic's Claude models (available on Bedrock) are designed with safety as a core principle using Constitutional AI, with strong performance on complex reasoning, analysis, and instruction-following tasks."
  },
  {
    "cat": "foundation-models",
    "q": "A startup wants to add AI image generation to their app. They need models that can create images from text descriptions. Which Amazon Bedrock models support this?",
    "options": [
      "Amazon Titan Text and Claude for text-based descriptions only",
      "Amazon Comprehend for image captioning",
      "Meta Llama Vision for image generation",
      "Amazon Titan Image Generator and Stability AI Stable Diffusion"
    ],
    "answer": 3,
    "explain": "Amazon Bedrock hosts image generation models including Amazon Titan Image Generator and Stability AI's Stable Diffusion, enabling text-to-image generation via API without managing model infrastructure."
  },
  {
    "cat": "foundation-models",
    "q": "What is continued pre-training of a foundation model?",
    "options": [
      "Running more inference passes to improve output quality",
      "Applying LoRA adapters to reduce model size",
      "Fine-tuning with labeled examples to improve task performance",
      "Training an already pre-trained model on additional domain-specific unlabeled data to improve domain knowledge"
    ],
    "answer": 3,
    "explain": "Continued pre-training trains a foundation model further on domain-specific unlabeled text (e.g., medical literature, legal documents) to improve its knowledge of that domain before task-specific fine-tuning."
  },
  {
    "cat": "foundation-models",
    "q": "A company wants to evaluate which foundation model performs best for their customer service use case before committing. What Amazon Bedrock feature helps?",
    "options": [
      "Bedrock Provisioned Throughput for all models simultaneously",
      "Bedrock Agents to run test scenarios",
      "Bedrock Guardrails to test model safety",
      "Bedrock Model Evaluation to compare models using custom datasets and metrics"
    ],
    "answer": 3,
    "explain": "Amazon Bedrock Model Evaluation allows you to automatically evaluate multiple foundation models against custom prompts and metrics, comparing quality, accuracy, and toxicity to select the best model for your use case."
  },
  {
    "cat": "foundation-models",
    "q": "What does RLHF (Reinforcement Learning from Human Feedback) achieve in foundation model training?",
    "options": [
      "Reduces model size for faster inference",
      "Improves retrieval accuracy in RAG applications",
      "Increases model training speed using distributed computing",
      "Aligns model outputs with human preferences for helpfulness and safety"
    ],
    "answer": 3,
    "explain": "RLHF trains a reward model from human preference data, then uses reinforcement learning to optimize the LLM toward human-preferred outputs. This alignment technique improves helpfulness, safety, and instruction-following."
  },
  {
    "cat": "foundation-models",
    "q": "A company's RAG system returns irrelevant document chunks, degrading answer quality. What is the most likely root cause?",
    "options": [
      "The LLM temperature is too high",
      "The system prompt is too long, reducing context space",
      "The vector database has too many documents stored",
      "Poor chunking strategy or low-quality embeddings causing inaccurate semantic search"
    ],
    "answer": 3,
    "explain": "RAG retrieval quality depends on chunking strategy (chunk size, overlap) and embedding model quality. Poor chunking breaks context across chunks; weak embeddings fail to capture semantic meaning for accurate retrieval."
  },
  {
    "cat": "foundation-models",
    "q": "An e-commerce company wants to use a foundation model to generate product descriptions automatically from structured attribute data. What approach minimizes cost while maintaining quality?",
    "options": [
      "Use the largest available model for best quality at any cost",
      "Use RAG to retrieve and combine existing descriptions",
      "Fine-tune a large model on product description examples",
      "Use a smaller, faster model with a well-crafted prompt template and few-shot examples"
    ],
    "answer": 3,
    "explain": "For structured, template-driven tasks like product descriptions, a well-prompted smaller model with few-shot examples often matches larger model quality at significantly lower cost and latency."
  },
  {
    "cat": "foundation-models",
    "q": "What is the purpose of Bedrock's model invocation logging?",
    "options": [
      "To reduce inference latency by caching responses",
      "To route requests to the lowest-latency model endpoint",
      "To automatically retry failed API calls",
      "To capture all input/output data for auditing, debugging, and model evaluation"
    ],
    "answer": 3,
    "explain": "Bedrock model invocation logging captures all API inputs and outputs to S3 or CloudWatch, enabling auditing, debugging, compliance, and building evaluation datasets for model improvement."
  },
  {
    "cat": "foundation-models",
    "q": "A company uses a foundation model to analyze customer sentiment. They need results in a consistent JSON format for downstream processing. What is the most reliable approach?",
    "options": [
      "Post-process model outputs with regex parsing",
      "Set temperature to 0 and hope for consistent formatting",
      "Use a separate NLP service to parse model outputs",
      "Instruct the model in the prompt to output JSON and use models supporting structured output mode"
    ],
    "answer": 3,
    "explain": "Models supporting structured output (JSON mode) are constrained to produce valid JSON. Combined with clear prompt instructions specifying the schema, this reliably produces parseable outputs for downstream systems."
  },
  {
    "cat": "foundation-models",
    "q": "What is an AI agent in the context of foundation model applications?",
    "options": [
      "A human operator who monitors AI model outputs",
      "A rule-based chatbot with predefined conversation flows",
      "A fine-tuned model specialized for a single task",
      "An LLM-powered system that autonomously plans and executes multi-step tasks using tools"
    ],
    "answer": 3,
    "explain": "AI agents combine LLMs with tool use (APIs, databases, code execution) to autonomously plan and execute multi-step tasks, making decisions dynamically based on intermediate results."
  },
  {
    "cat": "foundation-models",
    "q": "Which metric best measures the quality of text generated by a foundation model compared to a reference translation?",
    "options": [
      "ROC-AUC",
      "Mean Squared Error",
      "F1 Score",
      "BLEU Score"
    ],
    "answer": 3,
    "explain": "BLEU (Bilingual Evaluation Understudy) measures n-gram overlap between generated and reference text. It is widely used for machine translation evaluation, though human evaluation remains the gold standard for open-ended generation."
  },
  {
    "cat": "foundation-models",
    "q": "A company needs to process 1 million documents overnight with a foundation model to extract key entities. What Amazon Bedrock feature is optimized for this?",
    "options": [
      "On-demand inference with concurrent API calls",
      "Bedrock Agents for automated document processing pipelines",
      "Bedrock Provisioned Throughput for high-volume real-time inference",
      "Bedrock Batch Inference for processing large document volumes cost-effectively"
    ],
    "answer": 3,
    "explain": "Amazon Bedrock Batch Inference processes large volumes of records in a single job, offering significant cost savings (up to 50% less than on-demand) for non-time-sensitive bulk document processing."
  },
  {
    "cat": "foundation-models",
    "q": "A developer is choosing between on-demand pricing and Provisioned Throughput for a Bedrock model. The application processes 10 million tokens per day consistently. What should they choose?",
    "options": [
      "On-demand for flexibility with automatic scaling",
      "Use spot instances for Bedrock inference",
      "Deploy the model on SageMaker instead of Bedrock",
      "Provisioned Throughput for guaranteed capacity and lower per-token cost at scale"
    ],
    "answer": 3,
    "explain": "Provisioned Throughput reserves model units for consistent throughput, providing lower per-token costs at high, predictable volumes and guaranteed latency — ideal for high-volume production workloads."
  },
  {
    "cat": "responsible-ai",
    "q": "A hiring company uses an ML model to screen job applicants. Analysis shows the model rejects female applicants at a higher rate than equally qualified male applicants. What type of AI issue is this?",
    "options": [
      "Model overfitting to training data",
      "Feature engineering error in the model",
      "Data drift from changing applicant demographics",
      "Algorithmic bias causing discriminatory outcomes"
    ],
    "answer": 3,
    "explain": "Algorithmic bias occurs when an ML model produces systematically unfair outcomes for certain groups, often because training data reflected historical discrimination. This causes real-world harm and legal liability."
  },
  {
    "cat": "responsible-ai",
    "q": "Which AWS service helps detect bias in ML models and provides explanations for model predictions?",
    "options": [
      "Amazon SageMaker Debugger",
      "Amazon Rekognition Custom Labels",
      "Amazon SageMaker Model Monitor",
      "Amazon SageMaker Clarify"
    ],
    "answer": 3,
    "explain": "SageMaker Clarify detects statistical bias in training data and model predictions across demographic groups, and provides feature importance explanations (SHAP values) to make model decisions transparent."
  },
  {
    "cat": "responsible-ai",
    "q": "A company is deploying an AI system for medical diagnosis. What responsible AI practice is most important to ensure patient safety?",
    "options": [
      "Maximizing model accuracy on the training dataset",
      "Using the model with the largest parameter count for best performance",
      "Deploying the fastest model available to reduce wait times",
      "Requiring human oversight for all AI-assisted diagnoses before clinical decisions"
    ],
    "answer": 3,
    "explain": "Human-in-the-loop oversight ensures clinicians review and validate AI-assisted diagnoses before decisions affecting patient health. High-stakes applications require human judgment to catch errors and maintain accountability."
  },
  {
    "cat": "responsible-ai",
    "q": "What is explainability (XAI) in the context of AI systems?",
    "options": [
      "The ability of an AI to explain how to perform a task to users",
      "Documenting the technical architecture of an AI system",
      "AI systems that can generate natural language explanations of any topic",
      "The ability to understand and interpret how an AI model reaches its decisions"
    ],
    "answer": 3,
    "explain": "Explainability (XAI) refers to techniques that help humans understand why an AI model made a specific prediction or decision. SHAP values and LIME are common methods used in SageMaker Clarify."
  },
  {
    "cat": "responsible-ai",
    "q": "A company wants to ensure their AI model's decisions can be audited and explained to regulators. Which principle of responsible AI does this address?",
    "options": [
      "Privacy — protecting user data from disclosure",
      "Transparency and explainability — making AI decisions interpretable",
      "Robustness — ensuring consistent performance",
      "Inclusivity — serving all demographic groups equally"
    ],
    "answer": 1,
    "explain": "Transparency and explainability ensure AI decisions can be understood, audited, and justified to stakeholders including regulators, users, and affected parties — essential for building trust and accountability."
  },
  {
    "cat": "responsible-ai",
    "q": "An AI content moderation system incorrectly removes posts from users of certain ethnicities at a higher rate. What should the company do first?",
    "options": [
      "Retrain the model with more data to improve overall accuracy",
      "Audit the model for bias across demographic groups using fairness metrics",
      "Switch to a different AI provider with a better model",
      "Add more human reviewers to catch model errors"
    ],
    "answer": 1,
    "explain": "Auditing for bias using fairness metrics (equal opportunity, demographic parity) identifies whether the model systematically underperforms for specific groups, enabling targeted remediation."
  },
  {
    "cat": "responsible-ai",
    "q": "What does 'privacy by design' mean in the context of AI systems?",
    "options": [
      "Encrypting model weights to prevent theft",
      "Incorporating privacy protections into the AI system architecture from the beginning, not as an afterthought",
      "Restricting AI system access to authorized users only",
      "Using differential privacy during model inference"
    ],
    "answer": 1,
    "explain": "Privacy by design integrates data minimization, access controls, anonymization, and consent mechanisms into the AI system from the design phase, rather than retrofitting privacy controls after deployment."
  },
  {
    "cat": "responsible-ai",
    "q": "A company trains an ML model on customer purchase data. Under GDPR, a customer requests that their data be removed. What challenge does this create for AI?",
    "options": [
      "The model must be deleted and retrained from scratch",
      "The right to be forgotten conflicts with trained models that may have learned from that customer's data",
      "Customer data is anonymized in training, so there is no issue",
      "GDPR only applies to databases, not trained ML models"
    ],
    "answer": 1,
    "explain": "The right to erasure under GDPR is complex for ML models because models may have learned patterns from that individual's data. Techniques like machine unlearning, differential privacy, and model retraining address this challenge."
  },
  {
    "cat": "responsible-ai",
    "q": "What is the purpose of an AI model card?",
    "options": [
      "A business card format for marketing AI capabilities",
      "A documentation artifact describing a model's intended use, performance, limitations, and ethical considerations",
      "A security certificate verifying model integrity",
      "A pricing document outlining model inference costs"
    ],
    "answer": 1,
    "explain": "Model cards document a model's intended purpose, performance across demographic groups, known limitations, potential harms, and ethical considerations — promoting transparency and informed deployment decisions."
  },
  {
    "cat": "responsible-ai",
    "q": "A generative AI system produces a photorealistic image of a real politician saying something they never said. What AI risk does this represent?",
    "options": [
      "Model hallucination in text generation",
      "Deepfake creation enabling disinformation and reputation damage",
      "Intellectual property violation through training data reproduction",
      "Bias in facial recognition systems"
    ],
    "answer": 1,
    "explain": "Deepfakes are synthetic media depicting real people in fabricated scenarios. They pose risks including disinformation, reputation damage, fraud, and election manipulation — a key responsible AI concern for generative models."
  },
  {
    "cat": "responsible-ai",
    "q": "Which AWS service helps companies redact or detect personally identifiable information (PII) in text to protect user privacy in AI applications?",
    "options": [
      "Amazon Macie for S3 data",
      "Amazon Comprehend PII detection and Bedrock Guardrails PII redaction",
      "AWS IAM for access control",
      "Amazon Inspector for vulnerability scanning"
    ],
    "answer": 1,
    "explain": "Amazon Comprehend detects PII entities in text, and Amazon Bedrock Guardrails can automatically redact PII from LLM inputs and outputs, helping applications comply with privacy regulations."
  },
  {
    "cat": "responsible-ai",
    "q": "A company's AI model is used in a high-stakes financial lending decision. Regulators require the company to explain why a loan was denied. What AI principle is required?",
    "options": [
      "Model robustness — consistent performance across conditions",
      "Explainability — providing interpretable reasons for individual model decisions",
      "Fairness — equal approval rates across demographic groups",
      "Privacy — protecting applicant data from disclosure"
    ],
    "answer": 1,
    "explain": "Explainability is legally required for high-stakes automated decisions in regulated industries. Techniques like SHAP values, LIME, or counterfactual explanations provide interpretable reasons for individual predictions."
  },
  {
    "cat": "responsible-ai",
    "q": "What is the concept of 'human-in-the-loop' in responsible AI deployment?",
    "options": [
      "Requiring humans to manually label all training data",
      "Involving humans to review, validate, or override AI decisions in critical workflows",
      "Using human feedback to continuously retrain models in production",
      "Hiring humans to monitor AI system performance dashboards"
    ],
    "answer": 1,
    "explain": "Human-in-the-loop keeps humans in the decision-making process for high-stakes AI outputs, providing oversight, catching errors, and maintaining accountability — critical for medical, legal, and financial AI applications."
  },
  {
    "cat": "responsible-ai",
    "q": "An AI-powered hiring tool consistently scores candidates differently based on their name. What is the root cause and responsible AI solution?",
    "options": [
      "The model is overfitting — increase regularization",
      "Training data likely contains historical hiring bias — audit and debias training data and model outputs",
      "The feature engineering is incorrect — remove the name field only",
      "The model context window is too small — increase capacity"
    ],
    "answer": 1,
    "explain": "Historical bias in training data (e.g., past hiring patterns reflecting discrimination) is learned by the model. Solutions include auditing training data for representation, removing proxies for protected attributes, and testing for disparate impact."
  },
  {
    "cat": "ai-security",
    "q": "A company uses Amazon Bedrock to process confidential customer data. They need to ensure data is encrypted in transit and at rest. What does Amazon Bedrock provide by default?",
    "options": [
      "Data is unencrypted by default and must be configured manually",
      "Encryption in transit via TLS and at rest using AWS KMS by default",
      "Encryption only in transit; at-rest encryption requires custom configuration",
      "Data is stored in plaintext logs unless S3 server-side encryption is enabled"
    ],
    "answer": 1,
    "explain": "Amazon Bedrock encrypts all data in transit using TLS and at rest using AWS KMS by default. You can use customer-managed KMS keys for additional control over encryption."
  },
  {
    "cat": "ai-security",
    "q": "Which IAM policy action controls which users can invoke Amazon Bedrock foundation models?",
    "options": [
      "bedrock:ListFoundationModels",
      "bedrock:InvokeModel",
      "bedrock:CreateModelCustomizationJob",
      "bedrock:GetFoundationModel"
    ],
    "answer": 1,
    "explain": "The bedrock:InvokeModel IAM action controls who can call foundation models for inference. Restricting this action ensures only authorized users and roles can generate responses from Bedrock models."
  },
  {
    "cat": "ai-security",
    "q": "A company uses Amazon Bedrock and wants to prevent the model from being used to generate instructions for illegal activities. Which feature enforces this?",
    "options": [
      "IAM policies restricting model access by user",
      "Amazon Bedrock Guardrails with content filters for harmful topics",
      "VPC endpoints to restrict network access to Bedrock",
      "AWS Config rules for Bedrock API compliance"
    ],
    "answer": 1,
    "explain": "Bedrock Guardrails allows configuring content filters for specific harmful categories (violence, illegal activity, hate speech) and custom topic restrictions, blocking policy-violating inputs and outputs automatically."
  },
  {
    "cat": "ai-security",
    "q": "A financial company uses AI to process loan applications. They must log every model inference for regulatory compliance. What should they configure?",
    "options": [
      "CloudWatch alarms for Bedrock API errors",
      "Amazon Bedrock model invocation logging to S3 with CloudTrail API audit logs",
      "SageMaker Model Monitor for data drift detection",
      "AWS Config rules for inference compliance tracking"
    ],
    "answer": 1,
    "explain": "Bedrock model invocation logging captures every prompt and response to S3, while CloudTrail records all API calls. Together they provide the complete audit trail required for regulatory compliance in financial services."
  },
  {
    "cat": "ai-security",
    "q": "A company wants to prevent Bedrock API calls from traversing the public internet. What should they implement?",
    "options": [
      "Enable Bedrock Shield Advanced for DDoS protection",
      "Create a VPC endpoint (AWS PrivateLink) for Amazon Bedrock",
      "Use CloudFront to cache and route Bedrock API calls",
      "Configure Security Groups to restrict Bedrock API traffic"
    ],
    "answer": 1,
    "explain": "AWS PrivateLink (VPC endpoint) for Bedrock routes API traffic through the AWS private network, eliminating exposure to the public internet and meeting security requirements for sensitive workloads."
  },
  {
    "cat": "ai-security",
    "q": "What is the shared responsibility model as it applies to Amazon Bedrock?",
    "options": [
      "AWS manages everything including application security and data",
      "AWS secures the infrastructure and model serving; customers are responsible for data, prompts, outputs, and application security",
      "Customers manage the underlying GPU infrastructure; AWS manages the model weights",
      "AWS and customers share equal responsibility for all aspects of Bedrock security"
    ],
    "answer": 1,
    "explain": "AWS manages Bedrock infrastructure, model availability, and physical security. Customers are responsible for IAM access control, data classification, prompt safety, output validation, Guardrails configuration, and application-level security."
  },
  {
    "cat": "ai-security",
    "q": "A company uses SageMaker to train models on sensitive health data. They need to ensure training data never leaves their VPC. What should they configure?",
    "options": [
      "Enable SageMaker training in a public subnet with HTTPS",
      "Launch SageMaker training jobs inside a VPC with no internet access and S3 VPC endpoints",
      "Use SageMaker Spot Instances for training isolation",
      "Enable SageMaker Clarify for privacy detection during training"
    ],
    "answer": 1,
    "explain": "Running SageMaker training jobs in a VPC with network isolation and S3 VPC endpoints ensures training data stays on the AWS private network, never traversing the internet — meeting healthcare data security requirements."
  },
  {
    "cat": "ai-security",
    "q": "Which AWS service monitors ML model performance in production and alerts when data distribution shifts from what the model was trained on?",
    "options": [
      "Amazon SageMaker Clarify for bias detection",
      "Amazon SageMaker Model Monitor for data drift and quality",
      "Amazon CloudWatch for infrastructure metrics",
      "AWS Config for compliance rule evaluation"
    ],
    "answer": 1,
    "explain": "SageMaker Model Monitor continuously compares real-time inference data against a baseline captured at training time, detecting data quality issues, feature drift, and model quality degradation in production."
  },
  {
    "cat": "ai-security",
    "q": "A company stores training data for their ML models in S3. They want to ensure no unauthorized access to this sensitive data. What is the most important configuration?",
    "options": [
      "Enable S3 versioning on the training data bucket",
      "Block all public access and use bucket policies with least-privilege IAM roles for SageMaker",
      "Enable S3 Transfer Acceleration for secure uploads",
      "Use S3 Intelligent-Tiering to obscure data location"
    ],
    "answer": 1,
    "explain": "Blocking public access and applying least-privilege IAM policies ensures only authorized SageMaker roles can access training data. Combined with SSE-KMS encryption, this protects sensitive ML training datasets."
  },
  {
    "cat": "ai-security",
    "q": "What compliance certifications does Amazon Bedrock support that are relevant to regulated industries like healthcare and finance?",
    "options": [
      "Bedrock has no compliance certifications as it is a new service",
      "Bedrock supports HIPAA eligibility, SOC, ISO, and PCI DSS compliance",
      "Bedrock is only compliant for general commercial use, not regulated industries",
      "Bedrock compliance depends entirely on the customer's configuration"
    ],
    "answer": 1,
    "explain": "Amazon Bedrock inherits AWS compliance certifications including HIPAA eligibility, SOC 1/2/3, ISO 27001, and PCI DSS, enabling regulated industries to use foundation models while meeting compliance requirements."
  },
  {
    "cat": "ai-security",
    "q": "A company's AI chatbot is being exploited through prompt injection attacks where users override the system prompt. What is the most effective mitigation?",
    "options": [
      "Switch to a different foundation model provider",
      "Implement input validation, use Bedrock Guardrails, and separate system and user context with strict prompt boundaries",
      "Increase the system prompt length to overpower injections",
      "Disable user input and only allow pre-defined questions"
    ],
    "answer": 1,
    "explain": "Defense-in-depth against prompt injection combines input validation (filtering suspicious patterns), Bedrock Guardrails (topic restrictions), and strong prompt architecture (clear separation of system instructions from user input)."
  },
  {
    "cat": "ai-security",
    "q": "Under the AWS shared responsibility model, who is responsible for the quality and bias of data used to fine-tune a foundation model on Amazon Bedrock?",
    "options": [
      "AWS, as they provide the training infrastructure and process",
      "The customer, as they own and supply the fine-tuning dataset",
      "The foundation model provider (e.g., Anthropic)",
      "A shared responsibility between AWS and the customer equally"
    ],
    "answer": 1,
    "explain": "Customers are responsible for their fine-tuning data quality, representativeness, bias, and compliance with data licensing terms. AWS provides the secure infrastructure; the customer controls what data enters the training pipeline."
  },
  {
    "cat": "ai-security",
    "q": "A company wants to implement least privilege access for their Amazon Bedrock application. What is the most important IAM practice?",
    "options": [
      "Grant AdministratorAccess to all Bedrock developers for flexibility",
      "Create specific IAM roles with only the Bedrock actions and model ARNs required by each application component",
      "Use a single shared IAM user for all Bedrock API calls to simplify management",
      "Grant bedrock:* permissions scoped to the production account only"
    ],
    "answer": 1,
    "explain": "Least privilege means granting only the specific Bedrock actions (e.g., bedrock:InvokeModel) and specific model ARNs needed by each component. This minimizes the blast radius if credentials are compromised."
  },
  {
    "cat": "ai-security",
    "q": "A company is building an AI application that processes EU customer data using Amazon Bedrock. What data residency consideration must they address?",
    "options": [
      "Bedrock automatically stores all data in the customer's home region",
      "Select an AWS Region within the EU and configure Bedrock to use only that region to meet GDPR data residency requirements",
      "Data residency does not apply to AI inference, only to storage services",
      "Use Amazon CloudFront to route requests to EU edge locations"
    ],
    "answer": 1,
    "explain": "GDPR requires EU personal data to remain within the EU. Selecting eu-west-1 or eu-central-1 for Bedrock ensures inference and any logged data stay within EU boundaries, meeting data residency requirements."
  },
  {
    "cat": "ai-security",
    "q": "What is the purpose of watermarking AI-generated content?",
    "options": [
      "Protecting AI model weights from copying",
      "Embedding detectable signals in AI-generated content to identify it as machine-generated",
      "Encrypting AI outputs for secure transmission",
      "Adding copyright notices to AI-generated images"
    ],
    "answer": 1,
    "explain": "AI watermarking embeds imperceptible signals (statistical patterns, metadata) in generated content that can be detected to verify AI origin, helping combat deepfakes, disinformation, and academic dishonesty."
  },
  {
    "cat": "ai-security",
    "q": "A company needs to ensure their ML model in production cannot be reverse-engineered by analyzing its API responses. What is this threat called and how is it mitigated?",
    "options": [
      "Prompt injection — mitigated through input validation",
      "Model extraction attack — mitigated through rate limiting, output perturbation, and access controls",
      "Data poisoning — mitigated through training data validation",
      "Adversarial attack — mitigated through adversarial training"
    ],
    "answer": 1,
    "explain": "Model extraction attacks use many API queries to reconstruct an approximation of a proprietary model. Rate limiting API calls, adding slight output perturbation, and monitoring for systematic querying patterns help mitigate this threat."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company wants to predict house prices based on square footage, location, and number of rooms. Which type of ML problem is this?",
    "options": [
      "Regression predicting a continuous numeric value",
      "Binary classification predicting sale/no-sale",
      "Clustering to group houses into segments",
      "Anomaly detection to find overpriced houses"
    ],
    "answer": 0,
    "explain": "Regression predicts continuous numeric outputs. Predicting house prices is a classic regression problem because the output (price) is a continuous value rather than a discrete category."
  },
  {
    "cat": "ai-fundamentals",
    "q": "Which AWS service enables automatic model training and deployment without writing ML code, using a point-and-click interface?",
    "options": [
      "Amazon SageMaker Canvas",
      "Amazon SageMaker Studio",
      "Amazon SageMaker Pipelines",
      "Amazon SageMaker Data Wrangler"
    ],
    "answer": 0,
    "explain": "SageMaker Canvas is a no-code ML tool that lets business analysts build and deploy ML models through a visual interface without writing code, using AutoML under the hood."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A model achieves 99% accuracy on a fraud detection dataset where 99% of transactions are legitimate. What is the main problem?",
    "options": [
      "Accuracy is misleading due to class imbalance; the model likely predicts all transactions as legitimate",
      "The model is overfitting to the training data",
      "The model requires more features to improve performance",
      "The training dataset is too small for reliable results"
    ],
    "answer": 0,
    "explain": "With 99% legitimate transactions, a model that always predicts 'not fraud' achieves 99% accuracy but detects zero fraud cases. Use precision, recall, and F1 instead of accuracy for imbalanced datasets."
  },
  {
    "cat": "ai-fundamentals",
    "q": "What is the primary purpose of Amazon SageMaker Clarify?",
    "options": [
      "To detect bias in datasets and explain model predictions",
      "To automate hyperparameter tuning across training jobs",
      "To orchestrate multi-step ML training pipelines",
      "To monitor data quality in real-time streaming data"
    ],
    "answer": 0,
    "explain": "SageMaker Clarify detects statistical bias in training data and model predictions, and provides SHAP-based feature importance explanations to help understand why a model makes specific predictions."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company wants to process images from security cameras to detect unauthorized access in real time. Which approach is best?",
    "options": [
      "Use Amazon Rekognition for real-time person detection and activity analysis",
      "Train a custom model with SageMaker on labeled access events",
      "Use Amazon Comprehend to analyze text descriptions of camera footage",
      "Use Amazon Forecast to predict future access patterns"
    ],
    "answer": 0,
    "explain": "Amazon Rekognition provides real-time computer vision capabilities including person detection, activity recognition, and face analysis, purpose-built for video and image analysis use cases."
  },
  {
    "cat": "ai-fundamentals",
    "q": "Which technique helps prevent overfitting by adding a penalty term to the loss function based on model weight magnitude?",
    "options": [
      "Regularization (L1/L2) penalizing large model weights",
      "Data augmentation adding synthetic training examples",
      "Ensemble methods combining multiple model predictions",
      "Early stopping halting training before convergence"
    ],
    "answer": 0,
    "explain": "L1 (Lasso) and L2 (Ridge) regularization add penalty terms to the loss function proportional to weight magnitude, discouraging complex models and reducing overfitting on training data."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company needs to transcribe medical dictations and recognize specialized terminology. Which SageMaker feature addresses domain-specific vocabulary?",
    "options": [
      "SageMaker Feature Store for medical features",
      "Amazon Transcribe with custom vocabulary and medical models",
      "Amazon Comprehend Medical for clinical NLP",
      "SageMaker Ground Truth for medical labeling"
    ],
    "answer": 2,
    "explain": "Amazon Transcribe Medical is optimized for medical speech-to-text with healthcare terminology. Custom vocabulary in standard Transcribe can also add domain-specific terms to improve recognition accuracy."
  },
  {
    "cat": "ai-fundamentals",
    "q": "What is the key difference between batch inference and real-time inference in Amazon SageMaker?",
    "options": [
      "Batch processes large datasets offline; real-time serves individual predictions with low latency",
      "Batch inference uses GPUs; real-time inference uses CPUs",
      "Real-time inference is cheaper; batch inference is more accurate",
      "Batch inference supports all model types; real-time supports only classification"
    ],
    "answer": 0,
    "explain": "SageMaker Batch Transform processes large datasets asynchronously offline. Real-time endpoints serve individual predictions with millisecond latency. Choose based on latency requirements and data volume."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A team wants to track ML experiments, compare runs, and reproduce results across multiple model iterations. Which SageMaker feature supports this?",
    "options": [
      "SageMaker Experiments for tracking and comparing runs",
      "SageMaker Pipelines for workflow orchestration",
      "SageMaker Model Monitor for production tracking",
      "SageMaker Debugger for training diagnostics"
    ],
    "answer": 0,
    "explain": "SageMaker Experiments automatically tracks training runs, hyperparameters, metrics, and artifacts, enabling teams to compare experiments and reproduce results across multiple model iterations."
  },
  {
    "cat": "ai-fundamentals",
    "q": "Which AWS service uses ML to automatically detect anomalies in business metrics like revenue and website traffic without ML expertise?",
    "options": [
      "Amazon Lookout for Metrics",
      "Amazon SageMaker Autopilot",
      "Amazon QuickSight with ML Insights",
      "Amazon CloudWatch with anomaly detection"
    ],
    "answer": 0,
    "explain": "Amazon Lookout for Metrics automatically detects anomalies in business metrics using ML, identifies root causes, and sends alerts — no ML expertise required."
  },
  {
    "cat": "ai-fundamentals",
    "q": "What does precision measure in a binary classification model?",
    "options": [
      "The proportion of predicted positives that are actually positive",
      "The proportion of actual positives correctly identified",
      "The overall percentage of correct predictions",
      "The area under the ROC curve"
    ],
    "answer": 0,
    "explain": "Precision = True Positives / (True Positives + False Positives). It measures what fraction of positive predictions are actually correct. High precision means few false alarms."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company processes millions of product images to extract text from labels. Which AWS service handles optical character recognition (OCR) at scale?",
    "options": [
      "Amazon Textract for structured document and text extraction",
      "Amazon Rekognition for image text detection",
      "Amazon Comprehend for entity extraction",
      "Amazon Translate for multilingual text processing"
    ],
    "answer": 0,
    "explain": "Amazon Textract extracts text and structured data (tables, forms, key-value pairs) from documents using ML-based OCR, going beyond simple text detection to understand document structure."
  },
  {
    "cat": "ai-fundamentals",
    "q": "Which SageMaker component allows you to register, version, approve, and deploy models in a governed workflow?",
    "options": [
      "SageMaker Model Registry",
      "SageMaker Feature Store",
      "SageMaker Experiments",
      "SageMaker Debugger"
    ],
    "answer": 0,
    "explain": "SageMaker Model Registry provides model versioning, approval workflows, and lineage tracking. Teams register models, get approval, and deploy approved versions to production with governance controls."
  },
  {
    "cat": "ai-fundamentals",
    "q": "A company wants to identify the topics discussed in thousands of customer reviews automatically. Which approach is best?",
    "options": [
      "Unsupervised topic modeling with Amazon Comprehend or LDA",
      "Supervised multi-class classification with labeled topics",
      "Sentiment analysis to measure positive/negative tone",
      "Named entity recognition to extract product names"
    ],
    "answer": 0,
    "explain": "Topic modeling (like LDA or Amazon Comprehend Topics) discovers latent themes across documents without labeled data, automatically grouping reviews into thematic clusters."
  },
  {
    "cat": "ai-fundamentals",
    "q": "What is the purpose of Amazon SageMaker Model Monitor?",
    "options": [
      "To detect data quality issues and model drift in production",
      "To track experiment metrics during model training",
      "To automatically tune hyperparameters for better accuracy",
      "To label training data with human reviewers"
    ],
    "answer": 0,
    "explain": "SageMaker Model Monitor continuously monitors deployed models for data quality drift, model quality drift, bias drift, and feature attribution drift, alerting teams when production data deviates from training baselines."
  },
  {
    "cat": "foundation-models",
    "q": "What is the transformer architecture's key innovation over traditional RNNs for processing text?",
    "options": [
      "Self-attention mechanism that processes all tokens in parallel with context from the entire sequence",
      "Using convolutional layers to extract local text features",
      "Recurrent processing of text tokens one at a time",
      "Using random forests to classify token sequences"
    ],
    "answer": 0,
    "explain": "Transformers use self-attention to compute relationships between all tokens simultaneously, capturing long-range dependencies without the sequential bottleneck of RNNs, enabling massive parallelization during training."
  },
  {
    "cat": "foundation-models",
    "q": "Which Amazon Bedrock model family is developed by Anthropic and known for safety-focused, instruction-following capabilities?",
    "options": [
      "Anthropic Claude",
      "Amazon Titan",
      "Meta Llama",
      "Mistral"
    ],
    "answer": 0,
    "explain": "Anthropic Claude models are available through Amazon Bedrock and are known for safety alignment, strong instruction following, long context windows, and nuanced reasoning."
  },
  {
    "cat": "foundation-models",
    "q": "A company wants to use a foundation model for customer service but needs it to respond only in their brand voice and domain. What is the most cost-effective approach?",
    "options": [
      "Use prompt engineering with system prompts to define brand voice and constraints",
      "Train a new foundation model from scratch on company data",
      "Buy a dedicated model instance with custom weights",
      "Use Amazon SageMaker to build a custom NLP model"
    ],
    "answer": 0,
    "explain": "Prompt engineering with system prompts is the fastest, cheapest way to shape FM behavior. Fine-tuning is more expensive and training from scratch costs millions — start with prompting."
  },
  {
    "cat": "foundation-models",
    "q": "What is RLHF (Reinforcement Learning from Human Feedback) used for in foundation model training?",
    "options": [
      "Aligning model outputs with human preferences for helpfulness and safety",
      "Increasing model parameter count for better performance",
      "Reducing inference latency through model compression",
      "Generating synthetic training data to augment datasets"
    ],
    "answer": 0,
    "explain": "RLHF trains a reward model from human preference ratings, then uses reinforcement learning to optimize the LLM toward outputs humans rate as more helpful, harmless, and honest."
  },
  {
    "cat": "foundation-models",
    "q": "Which Amazon Titan model family is specifically optimized for generating text embeddings for semantic search and RAG?",
    "options": [
      "Amazon Titan Text Premier",
      "Amazon Titan Text Lite",
      "Amazon Titan Embeddings",
      "Amazon Titan Image Generator"
    ],
    "answer": 2,
    "explain": "Amazon Titan Embeddings converts text into dense vector representations for semantic similarity search, powering RAG pipelines, recommendation systems, and document clustering."
  },
  {
    "cat": "foundation-models",
    "q": "A company needs to process documents up to 200 pages long in a single LLM call. Which foundation model capability is critical?",
    "options": [
      "High output token limit for long responses",
      "Low temperature for deterministic outputs",
      "Large context window supporting 100K+ tokens",
      "Fast inference latency for real-time processing"
    ],
    "answer": 2,
    "explain": "A large context window allows the model to process entire long documents in a single call. Models like Claude have 100K-200K token context windows, enabling full-document analysis."
  },
  {
    "cat": "foundation-models",
    "q": "What is the difference between a base/pre-trained model and an instruction-tuned model?",
    "options": [
      "Base models are larger; instruction-tuned models are smaller",
      "Instruction-tuned models are open-source; base models are proprietary",
      "Base models predict next tokens; instruction-tuned models follow natural language instructions",
      "Base models support more languages; instruction-tuned models only support English"
    ],
    "answer": 2,
    "explain": "Base models are trained to predict next tokens. Instruction-tuned models undergo supervised fine-tuning on instruction-response pairs plus RLHF, enabling them to follow user instructions and hold conversations."
  },
  {
    "cat": "foundation-models",
    "q": "Which fine-tuning technique reduces the number of trainable parameters by adding small trainable adapter layers while keeping base model weights frozen?",
    "options": [
      "Full fine-tuning updating all model parameters",
      "Prompt tuning adding soft trainable tokens to input",
      "LoRA (Low-Rank Adaptation) with lightweight adapter matrices",
      "Distillation training a smaller model from a larger one"
    ],
    "answer": 2,
    "explain": "LoRA freezes pre-trained model weights and injects small trainable rank-decomposition matrices. This dramatically reduces memory and compute requirements while achieving fine-tuning quality."
  },
  {
    "cat": "foundation-models",
    "q": "What is a multimodal foundation model?",
    "options": [
      "A model trained on data from multiple geographic regions",
      "A model ensemble combining multiple smaller models",
      "A model that can process and generate multiple types of data like text, images, and audio",
      "A model optimized for multiple programming languages"
    ],
    "answer": 2,
    "explain": "Multimodal models process multiple data modalities. For example, they can analyze images and generate text descriptions, or accept image+text inputs and produce text outputs (like Claude or GPT-4V)."
  },
  {
    "cat": "foundation-models",
    "q": "A startup wants to quickly deploy a pre-trained foundation model for a specific use case. Which Amazon SageMaker feature provides one-click deployment of popular FMs?",
    "options": [
      "SageMaker Autopilot for automated ML",
      "SageMaker Experiments for model tracking",
      "SageMaker JumpStart with pre-trained model hub",
      "SageMaker Data Wrangler for data preparation"
    ],
    "answer": 2,
    "explain": "SageMaker JumpStart provides a hub of pre-trained models (Llama, Mistral, Stable Diffusion, etc.) that can be deployed to endpoints or fine-tuned with one click, accelerating time to production."
  },
  {
    "cat": "foundation-models",
    "q": "What does 'inference' mean in the context of foundation models?",
    "options": [
      "Training the model on new data to update weights",
      "Evaluating model performance on a validation dataset",
      "Using a trained model to generate outputs from new inputs",
      "Compressing model weights to reduce memory usage"
    ],
    "answer": 2,
    "explain": "Inference is the process of using a trained model to generate predictions or outputs from new inputs. In LLMs, inference produces text responses. Training and inference are separate phases."
  },
  {
    "cat": "foundation-models",
    "q": "Which strategy should a company use when the foundation model needs to know about proprietary product data that changes frequently?",
    "options": [
      "Retrain the foundation model weekly with updated product data",
      "Fine-tune the model on product catalogs monthly",
      "Use RAG to retrieve current product data at inference time",
      "Increase the model's temperature to generate more current responses"
    ],
    "answer": 2,
    "explain": "RAG retrieves up-to-date information from a knowledge base at inference time, making it ideal for frequently changing data. Retraining and fine-tuning are expensive and can't keep up with frequent updates."
  },
  {
    "cat": "foundation-models",
    "q": "What is 'prompt injection' in the context of LLM security?",
    "options": [
      "Injecting system prompts to improve model behavior",
      "Adding few-shot examples to improve response quality",
      "Malicious input designed to override system instructions and manipulate model behavior",
      "Compressing prompts to fit within token limits"
    ],
    "answer": 2,
    "explain": "Prompt injection attacks craft malicious user input that overrides system prompt instructions, potentially causing the model to reveal sensitive information, bypass guardrails, or take unintended actions."
  },
  {
    "cat": "foundation-models",
    "q": "A company evaluates two foundation models for customer service. Model A is faster but less accurate; Model B is more accurate but 3x slower and 5x more expensive. What framework should guide the decision?",
    "options": [
      "Always choose the most accurate model regardless of cost",
      "Choose the faster model to ensure good user experience always",
      "Evaluate based on acceptable latency, accuracy requirements, and cost budget for the specific use case",
      "Use both models in an ensemble for best results"
    ],
    "answer": 2,
    "explain": "Foundation model selection requires balancing accuracy, latency, and cost against business requirements. A customer service chatbot may tolerate lower accuracy for speed; a medical diagnosis system may require maximum accuracy."
  },
  {
    "cat": "foundation-models",
    "q": "Which Amazon Bedrock feature allows you to evaluate multiple foundation models against your specific dataset and requirements?",
    "options": [
      "Bedrock Agents for automated evaluation workflows",
      "Bedrock Guardrails for safety evaluation",
      "Bedrock Model Evaluation for comparing model quality",
      "Bedrock Knowledge Bases for retrieval benchmarking"
    ],
    "answer": 2,
    "explain": "Amazon Bedrock Model Evaluation lets you run automatic or human-based evaluations of multiple models on your dataset using metrics like accuracy, toxicity, and robustness to select the best model."
  },
  {
    "cat": "foundation-models",
    "q": "What is 'continued pre-training' of a foundation model?",
    "options": [
      "Re-running the original pre-training from scratch with new data",
      "Fine-tuning on labeled instruction-response pairs",
      "Further pre-training an existing model on domain-specific data to improve domain knowledge",
      "Distilling knowledge from a large model into a smaller one"
    ],
    "answer": 2,
    "explain": "Continued pre-training extends a foundation model's training on domain-specific unlabeled data (e.g., medical literature, legal documents) to improve domain knowledge before task-specific fine-tuning."
  },
  {
    "cat": "foundation-models",
    "q": "What is 'knowledge cutoff' in a foundation model?",
    "options": [
      "The maximum number of tokens the model can generate",
      "The minimum confidence threshold for generating responses",
      "The date after which events are not reflected in the model's training data",
      "The maximum fine-tuning dataset size supported"
    ],
    "answer": 2,
    "explain": "Foundation models have a knowledge cutoff date — the point when training data collection ended. Events after this date are unknown to the model unless provided via RAG or tools."
  },
  {
    "cat": "foundation-models",
    "q": "A company wants to use Amazon Bedrock but needs guaranteed response latency for their production application. What should they configure?",
    "options": [
      "On-demand API calls with auto-retry logic",
      "Amazon SageMaker real-time endpoints instead",
      "Provisioned Throughput reserving dedicated model capacity",
      "Lambda functions with Bedrock API calls"
    ],
    "answer": 2,
    "explain": "Bedrock Provisioned Throughput purchases reserved model units (MUs) providing consistent, predictable throughput and latency SLAs for production workloads with guaranteed capacity."
  },
  {
    "cat": "foundation-models",
    "q": "What does 'model quantization' do in the context of deploying foundation models?",
    "options": [
      "Increases model parameter count for better accuracy",
      "Distributes model layers across multiple GPUs",
      "Reduces model precision (e.g., FP32 to INT8) to decrease size and speed up inference",
      "Adds adapter layers for domain-specific fine-tuning"
    ],
    "answer": 2,
    "explain": "Quantization reduces the numerical precision of model weights (e.g., from 32-bit floats to 8-bit integers), reducing memory footprint by 4x and speeding up inference with minimal accuracy loss."
  },
  {
    "cat": "foundation-models",
    "q": "A financial services company needs to use a foundation model but cannot send data to external APIs due to compliance requirements. What is the best solution?",
    "options": [
      "Use Amazon Bedrock with VPC endpoints for private connectivity",
      "Use Claude API through Anthropic directly with TLS encryption",
      "Deploy open-source models on Amazon SageMaker endpoints in their own VPC",
      "Accept the compliance risk since data is encrypted in transit"
    ],
    "answer": 2,
    "explain": "Deploying open-source models (Llama, Mistral) on SageMaker endpoints in a private VPC ensures all data stays within the company's AWS account, meeting strict data residency and compliance requirements."
  },
  {
    "cat": "foundation-models",
    "q": "What is 'top-p' (nucleus) sampling in LLM inference?",
    "options": [
      "Setting the maximum number of tokens to generate",
      "Choosing the single most probable next token",
      "Selecting from the smallest set of tokens whose cumulative probability exceeds p",
      "Repeating the same prompt multiple times for consistency"
    ],
    "answer": 2,
    "explain": "Top-p (nucleus) sampling selects the next token from the smallest set whose cumulative probability mass exceeds threshold p. Combined with temperature, it controls output diversity while avoiding low-probability tokens."
  },
  {
    "cat": "foundation-models",
    "q": "Amazon Bedrock supports which data source types for Knowledge Bases (RAG)?",
    "options": [
      "Only structured SQL databases",
      "Only Amazon DynamoDB tables",
      "Amazon S3, Confluence, Salesforce, SharePoint, and web crawlers",
      "Only PDF files stored in EFS"
    ],
    "answer": 2,
    "explain": "Amazon Bedrock Knowledge Bases ingests data from Amazon S3 and supported connectors including Confluence, Salesforce, SharePoint, and web crawlers, enabling diverse enterprise document sources."
  },
  {
    "cat": "foundation-models",
    "q": "Which component of a RAG system converts document chunks into searchable vector representations?",
    "options": [
      "The LLM generator that produces the final response",
      "The retriever that searches for matching documents",
      "The embedding model that creates dense vector representations",
      "The chunker that splits documents into segments"
    ],
    "answer": 2,
    "explain": "The embedding model encodes document chunks into dense vectors capturing semantic meaning. These vectors are stored in a vector database enabling similarity search to retrieve relevant context for RAG."
  },
  {
    "cat": "foundation-models",
    "q": "What is 'agent memory' in the context of Amazon Bedrock Agents?",
    "options": [
      "The GPU memory used during model inference",
      "The system prompt defining agent behavior",
      "The vector database used for RAG retrieval",
      "Persistent storage of conversation history enabling agents to recall past interactions"
    ],
    "answer": 3,
    "explain": "Bedrock Agents with memory can store and retrieve conversation history across sessions, enabling personalized, context-aware interactions that remember user preferences and past interactions."
  },
  {
    "cat": "foundation-models",
    "q": "A company fine-tunes a foundation model on their customer service data. After deployment, responses improve but the model sometimes forgets its original capabilities. What is this called?",
    "options": [
      "Model drift from production data distribution shift",
      "Overfitting to domain-specific fine-tuning data",
      "Knowledge cutoff limiting model's training date",
      "Catastrophic forgetting during fine-tuning overwriting pre-trained knowledge"
    ],
    "answer": 3,
    "explain": "Catastrophic forgetting occurs when fine-tuning overwrites pre-trained weights, causing the model to lose previously learned capabilities. Techniques like LoRA mitigate this by keeping base weights frozen."
  },
  {
    "cat": "foundation-models",
    "q": "Which metric measures how well an LLM-generated summary matches a human reference summary?",
    "options": [
      "BLEU score measuring n-gram precision",
      "BERTScore measuring semantic similarity",
      "Perplexity measuring prediction uncertainty",
      "ROUGE score measuring recall of n-grams against references"
    ],
    "answer": 3,
    "explain": "ROUGE (Recall-Oriented Understudy for Gisting Evaluation) measures the overlap of n-grams between generated summaries and reference summaries, with ROUGE-L measuring longest common subsequences."
  },
  {
    "cat": "foundation-models",
    "q": "What is 'chain of thought' prompting's main advantage for complex reasoning tasks?",
    "options": [
      "It reduces the number of tokens used, lowering costs",
      "It enables parallel processing of multiple reasoning paths",
      "It allows the model to access external databases during reasoning",
      "It forces the model to articulate intermediate reasoning steps, improving accuracy on multi-step problems"
    ],
    "answer": 3,
    "explain": "Chain-of-thought prompting improves accuracy on complex tasks by guiding models to break problems into intermediate steps. This is especially effective for math, logic, and multi-step reasoning where direct answers often fail."
  },
  {
    "cat": "foundation-models",
    "q": "A company wants to automatically route user questions to either a fast cheap model or a more capable expensive model based on complexity. What pattern enables this?",
    "options": [
      "Load balancing across model endpoints",
      "Fine-tuning one model to handle all complexity levels",
      "Always using the most capable model for consistency",
      "Model routing or cascading based on query complexity classification"
    ],
    "answer": 3,
    "explain": "Model routing classifies query complexity first, directing simple queries to fast/cheap models and complex queries to capable/expensive models, optimizing the cost-quality tradeoff at scale."
  },
  {
    "cat": "foundation-models",
    "q": "What does 'grounding' with Bedrock Knowledge Bases add to a foundation model's response?",
    "options": [
      "Configures the foundation model's output format",
      "Adds domain-specific vocabulary to the model",
      "Increases model response speed through caching",
      "Source citations linking response claims to specific retrieved documents"
    ],
    "answer": 3,
    "explain": "Bedrock Knowledge Bases RAG responses include citations linking each claim to source documents, enabling users to verify accuracy and improving trust in AI-generated responses."
  },
  {
    "cat": "responsible-ai",
    "q": "A company's hiring algorithm consistently rejects candidates from certain zip codes correlated with race. What type of bias is this?",
    "options": [
      "Sample bias from using unrepresentative training data",
      "Confirmation bias from human labeler preferences",
      "Measurement bias from inaccurate data collection",
      "Indirect discrimination through proxy variables correlated with protected attributes"
    ],
    "answer": 3,
    "explain": "Proxy discrimination occurs when seemingly neutral variables (zip code) correlate with protected attributes (race), causing the model to discriminate indirectly even without using race explicitly."
  },
  {
    "cat": "responsible-ai",
    "q": "What is the purpose of Amazon Bedrock Guardrails in responsible AI?",
    "options": [
      "To optimize inference speed for production deployments",
      "To manage API rate limits for foundation model access",
      "To monitor model accuracy against ground truth labels",
      "To enforce content policies, topic restrictions, and PII protection across LLM applications"
    ],
    "answer": 3,
    "explain": "Bedrock Guardrails implements content filters, topic blocklists, PII detection/redaction, and grounding checks across LLM applications to enforce responsible AI policies consistently."
  },
  {
    "cat": "responsible-ai",
    "q": "Which principle of responsible AI ensures users can understand why an AI system made a specific decision?",
    "options": [
      "Fairness ensuring equal outcomes across groups",
      "Privacy protecting individual data from exposure",
      "Robustness maintaining performance under adversarial inputs",
      "Explainability enabling humans to understand model reasoning"
    ],
    "answer": 3,
    "explain": "Explainability (or interpretability) ensures AI decisions can be understood and audited by humans. This is especially critical in regulated industries like finance and healthcare where decisions impact individuals."
  },
  {
    "cat": "responsible-ai",
    "q": "A company deploys an AI model for loan decisions. Regulators require the company to explain each rejection to applicants. Which approach helps?",
    "options": [
      "Using a black-box neural network for maximum accuracy",
      "Auditing model outputs quarterly without individual explanations",
      "Replacing the model with a simple rules-based system",
      "Using SHAP values or LIME to provide feature-level explanations for individual predictions"
    ],
    "answer": 3,
    "explain": "SHAP (SHapley Additive exPlanations) and LIME provide post-hoc explanations showing which features contributed to each prediction, enabling model-specific explanations for regulatory compliance."
  },
  {
    "cat": "responsible-ai",
    "q": "What is 'human-in-the-loop' in AI systems?",
    "options": [
      "Replacing humans with AI in manual processes",
      "Using human feedback only during initial model training",
      "Training AI models using human-generated synthetic data",
      "Incorporating human review and oversight at critical decision points in automated AI workflows"
    ],
    "answer": 3,
    "explain": "Human-in-the-loop keeps humans involved in high-stakes decisions, combining AI efficiency with human judgment and accountability. This is critical for irreversible decisions affecting individuals."
  },
  {
    "cat": "responsible-ai",
    "q": "A generative AI system creates realistic fake videos of public figures. What responsible AI concern does this raise?",
    "options": [
      "Model drift causing performance degradation over time",
      "Model bias producing inequitable outputs across groups",
      "Training data privacy exposing personal information",
      "Deepfake generation enabling misinformation and identity fraud"
    ],
    "answer": 3,
    "explain": "Deepfakes use generative AI to create realistic fake media, enabling misinformation, defamation, and fraud. Responsible AI frameworks must address misuse potential of generative capabilities."
  },
  {
    "cat": "responsible-ai",
    "q": "Which AWS service helps identify and protect personally identifiable information (PII) in text data?",
    "options": [
      "Amazon Macie for S3 object scanning",
      "Amazon GuardDuty for threat detection",
      "AWS Shield for DDoS protection",
      "Amazon Comprehend PII detection and redaction"
    ],
    "answer": 3,
    "explain": "Amazon Comprehend detects PII entities (names, addresses, SSNs, credit card numbers) in text and can redact them, supporting data privacy compliance in AI pipelines."
  },
  {
    "cat": "responsible-ai",
    "q": "What does 'AI transparency' mean in practice?",
    "options": [
      "Making all model weights publicly available as open-source",
      "Publishing AI model benchmarks on public leaderboards",
      "Using only explainable models like decision trees",
      "Clearly disclosing how AI systems work, what data they use, and their limitations"
    ],
    "answer": 3,
    "explain": "AI transparency means openly communicating how AI systems make decisions, what training data was used, known limitations, and potential biases, enabling informed trust and accountability."
  },
  {
    "cat": "responsible-ai",
    "q": "A company's AI chatbot makes offensive responses when users use certain inputs. What responsible AI practice would have caught this earlier?",
    "options": [
      "Deploying the model with A/B testing in production first",
      "Filtering outputs based on user complaint frequency",
      "Increasing model training data to improve robustness",
      "Red teaming with adversarial testing to probe for harmful outputs before deployment"
    ],
    "answer": 3,
    "explain": "Red teaming involves deliberately trying to elicit harmful, biased, or offensive model outputs through adversarial testing before deployment, identifying safety issues in a controlled environment."
  },
  {
    "cat": "responsible-ai",
    "q": "What is 'model card' documentation in responsible AI?",
    "options": [
      "A billing summary for ML training costs",
      "A checklist for ML infrastructure deployment",
      "An API key card for accessing foundation models",
      "A standardized document describing model purpose, performance, limitations, and ethical considerations"
    ],
    "answer": 3,
    "explain": "Model cards are standardized documentation sheets covering model purpose, training data, evaluation results, known limitations, appropriate use cases, and ethical considerations, enabling informed deployment decisions."
  },
  {
    "cat": "responsible-ai",
    "q": "A medical AI system performs well on data from large urban hospitals but poorly in rural clinics. What is this a manifestation of?",
    "options": [
      "Overfitting to the training distribution in urban hospitals",
      "Data leakage from shared patient records across facilities",
      "Insufficient model complexity for rural medical cases",
      "Distribution shift and representation bias from underrepresented rural populations"
    ],
    "answer": 3,
    "explain": "Representation bias occurs when training data underrepresents certain populations (rural clinics), causing the model to generalize poorly to those groups. Diverse, representative data is essential for equitable performance."
  },
  {
    "cat": "responsible-ai",
    "q": "What is the purpose of AI governance frameworks in an organization?",
    "options": [
      "To maximize model accuracy across all deployed systems",
      "To establish policies, roles, and processes ensuring responsible AI development and deployment",
      "To manage cloud infrastructure costs for AI workloads",
      "To automate model training and deployment pipelines"
    ],
    "answer": 1,
    "explain": "AI governance frameworks define organizational policies for responsible AI including oversight structures, risk assessment processes, fairness standards, documentation requirements, and accountability mechanisms."
  },
  {
    "cat": "responsible-ai",
    "q": "A company wants to ensure their LLM never generates content about competitors. Which Bedrock feature enforces this at the application level?",
    "options": [
      "Bedrock Model Customization to retrain the model",
      "Bedrock Guardrails with denied topics blocking competitor discussions",
      "Bedrock Agents with competitor detection action groups",
      "Bedrock Model Evaluation to test for competitor mentions"
    ],
    "answer": 1,
    "explain": "Bedrock Guardrails denied topics configuration blocks specific topics (like competitor discussions) at inference time, returning a configurable message instead of engaging with prohibited content."
  },
  {
    "cat": "responsible-ai",
    "q": "What is 'data minimization' in the context of responsible AI and privacy?",
    "options": [
      "Reducing training dataset size to lower compute costs",
      "Collecting and retaining only the data necessary for the specific AI purpose",
      "Compressing training data for storage efficiency",
      "Removing outliers and noise from training datasets"
    ],
    "answer": 1,
    "explain": "Data minimization is a privacy principle (enshrined in GDPR) requiring organizations to collect only data necessary for the stated purpose, reducing privacy risk and limiting exposure in case of data breaches."
  },
  {
    "cat": "ai-security",
    "q": "A company deploys a customer-facing LLM chatbot. A user submits a prompt that causes the model to ignore its system instructions and reveal internal prompts. What attack is this?",
    "options": [
      "SQL injection exploiting database query structure",
      "Prompt injection overriding system instructions with malicious input",
      "Cross-site scripting injecting client-side scripts",
      "Denial of service overwhelming the API with requests"
    ],
    "answer": 1,
    "explain": "Prompt injection crafts user input to override system instructions, potentially revealing system prompts, bypassing safety filters, or causing unauthorized actions. It is a top security risk for LLM applications."
  },
  {
    "cat": "ai-security",
    "q": "Which AWS service provides threat detection for AI workloads by monitoring for unusual API calls and unauthorized model access?",
    "options": [
      "AWS WAF filtering malicious web requests",
      "Amazon GuardDuty detecting threats across AWS accounts and services",
      "AWS Shield protecting against DDoS attacks",
      "Amazon Inspector scanning for model vulnerabilities"
    ],
    "answer": 1,
    "explain": "Amazon GuardDuty uses ML to continuously monitor CloudTrail, VPC Flow Logs, and DNS logs, detecting threats like credential compromise, unusual API activity, and unauthorized access to ML resources."
  },
  {
    "cat": "ai-security",
    "q": "A company wants to prevent sensitive company data from being extracted by users through an LLM. Which Bedrock Guardrails feature addresses this?",
    "options": [
      "Topic restrictions blocking competitor discussions",
      "PII redaction and sensitive information filters preventing data leakage",
      "Content filters blocking harmful language",
      "Grounding checks verifying factual accuracy"
    ],
    "answer": 1,
    "explain": "Bedrock Guardrails PII detection can redact sensitive information in both inputs and outputs, preventing users from extracting personal data or proprietary information through the LLM interface."
  },
  {
    "cat": "ai-security",
    "q": "What is 'model poisoning' in AI security?",
    "options": [
      "Sending malicious inputs to confuse a deployed model",
      "Injecting malicious data into the training dataset to corrupt model behavior",
      "Overloading a model API with requests to cause downtime",
      "Stealing model weights through reverse engineering"
    ],
    "answer": 1,
    "explain": "Model poisoning injects malicious examples into training data, causing the model to learn incorrect patterns or backdoor behaviors. For example, a poisoned spam filter might be trained to always allow certain emails."
  },
  {
    "cat": "ai-security",
    "q": "A company's ML model is accessible via an API. An attacker sends thousands of carefully crafted queries to reconstruct the model's behavior and intellectual property. What is this attack?",
    "options": [
      "Adversarial attack degrading model performance",
      "Model extraction or model stealing through API queries",
      "Data poisoning corrupting training data",
      "Membership inference identifying training examples"
    ],
    "answer": 1,
    "explain": "Model extraction attacks reconstruct model behavior or steal intellectual property by querying the model API. Rate limiting, output randomization, and watermarking help detect and prevent this."
  },
  {
    "cat": "ai-security",
    "q": "Which AWS service helps protect ML training data stored in Amazon S3 from unauthorized access and data breaches?",
    "options": [
      "Amazon GuardDuty for threat detection",
      "Amazon Macie for S3 data classification and PII detection",
      "AWS Config for compliance monitoring",
      "Amazon Inspector for vulnerability scanning"
    ],
    "answer": 1,
    "explain": "Amazon Macie uses ML to automatically discover and classify sensitive data in S3 including PII, financial data, and credentials, alerting teams to access patterns that may indicate data exposure."
  },
  {
    "cat": "ai-security",
    "q": "A company uses Amazon SageMaker for model training. How should they ensure training data in S3 is encrypted at rest?",
    "options": [
      "Enable S3 Transfer Acceleration for faster encryption",
      "Use S3 server-side encryption (SSE-S3 or SSE-KMS) and SageMaker KMS key configuration",
      "Set S3 bucket policies to restrict public access only",
      "Use VPC endpoints to encrypt data in transit"
    ],
    "answer": 1,
    "explain": "S3 SSE-KMS encrypts data at rest using AWS KMS customer managed keys. SageMaker supports KMS keys for encrypting training data, model artifacts, and notebook volumes."
  },
  {
    "cat": "ai-security",
    "q": "What is 'differential privacy' in the context of ML model training?",
    "options": [
      "Using separate development and production environments",
      "A mathematical framework adding noise to protect individual training data privacy",
      "Encrypting model weights to protect intellectual property",
      "Separating training and inference infrastructure for security"
    ],
    "answer": 1,
    "explain": "Differential privacy adds calibrated noise to training processes or outputs, providing mathematical guarantees that individual training examples cannot be inferred from model outputs, protecting data privacy."
  },
  {
    "cat": "ai-security",
    "q": "An attacker adds small imperceptible noise to an image that causes an image classifier to misclassify a stop sign as a speed limit sign. What is this?",
    "options": [
      "Data poisoning in the training pipeline",
      "Adversarial example exploiting model sensitivity to input perturbations",
      "Model extraction through API queries",
      "Membership inference determining training data membership"
    ],
    "answer": 1,
    "explain": "Adversarial examples are inputs crafted with small perturbations that cause ML models to make wrong predictions confidently. They exploit the geometric properties of model decision boundaries."
  },
  {
    "cat": "ai-security",
    "q": "A company trains ML models using sensitive customer data. What AWS feature ensures the training cluster cannot communicate with the internet during training?",
    "options": [
      "VPC security groups blocking outbound rules",
      "SageMaker training jobs with network isolation mode enabled",
      "AWS WAF blocking training API calls",
      "IAM policies restricting training job permissions"
    ],
    "answer": 1,
    "explain": "SageMaker network isolation mode prevents training containers from making outbound network calls, ensuring sensitive training data cannot be exfiltrated even if the training code is compromised."
  },
  {
    "cat": "ai-security",
    "q": "What is 'membership inference attack' in ML security?",
    "options": [
      "Attackers guessing model architecture from API responses",
      "Determining whether a specific data record was used in the model's training dataset",
      "Extracting model weights by analyzing predictions",
      "Injecting malicious prompts to alter model behavior"
    ],
    "answer": 1,
    "explain": "Membership inference attacks determine if specific individuals' data was used in training, which is a privacy violation. Models that overfit are especially vulnerable since they memorize training examples."
  },
  {
    "cat": "ai-security",
    "q": "Which principle ensures that AI system components have only the permissions required for their specific function?",
    "options": [
      "Defense in depth using multiple security layers",
      "Least privilege limiting permissions to the minimum necessary",
      "Zero trust verifying every access request explicitly",
      "Data encryption protecting information at rest and in transit"
    ],
    "answer": 1,
    "explain": "Least privilege grants AI system components (SageMaker roles, Lambda functions, Bedrock agents) only the specific permissions they need, minimizing the blast radius of a security breach."
  },
  {
    "cat": "generative-ai",
    "q": "A company wants to use an LLM to analyze customer support tickets and automatically categorize them. What is the best prompting strategy?",
    "options": [
      "Few-shot: provide labeled examples of each category in the prompt",
      "Zero-shot: ask the model to classify without any examples",
      "Chain-of-thought: ask the model to reason about ticket severity",
      "Role prompting: tell the model it is a customer service manager"
    ],
    "answer": 0,
    "explain": "Few-shot prompting with labeled examples of each category guides the LLM to produce correctly formatted classifications. It outperforms zero-shot for structured classification tasks without requiring fine-tuning."
  },
  {
    "cat": "generative-ai",
    "q": "What is 'jailbreaking' in the context of LLMs?",
    "options": [
      "Crafting prompts that circumvent model safety restrictions to elicit prohibited content",
      "Bypassing API authentication to access models without credentials",
      "Extracting model weights through repeated API queries",
      "Using the model beyond its licensed usage limits"
    ],
    "answer": 0,
    "explain": "Jailbreaking uses creative prompt engineering to bypass safety alignments, causing models to generate content they are designed to refuse. Guardrails and safety classifiers help defend against this."
  },
  {
    "cat": "generative-ai",
    "q": "A user wants an LLM to write a product description in Spanish. The model defaults to English. What is the simplest fix?",
    "options": [
      "Add 'Respond only in Spanish' to the system prompt",
      "Fine-tune the model on Spanish product descriptions",
      "Use Amazon Translate to convert English output to Spanish",
      "Use a multilingual embedding model instead"
    ],
    "answer": 0,
    "explain": "Simply instructing the model to respond in Spanish via the system prompt or user instruction is the fastest solution. Modern LLMs are multilingual and follow language instructions reliably."
  },
  {
    "cat": "generative-ai",
    "q": "Which Amazon Bedrock feature enables an LLM application to automatically call your company's internal APIs as part of answering user questions?",
    "options": [
      "Bedrock Knowledge Bases for document retrieval",
      "Bedrock Guardrails for output control",
      "Bedrock Agents with Action Groups connecting to APIs",
      "Bedrock Model Customization for fine-tuning"
    ],
    "answer": 2,
    "explain": "Bedrock Agents Action Groups define which APIs (Lambda functions or OpenAPI schemas) the agent can call. This enables the agent to fetch live data, submit forms, or trigger workflows automatically."
  },
  {
    "cat": "generative-ai",
    "q": "What makes vector similarity search different from traditional keyword search?",
    "options": [
      "Vector search finds semantically similar content even without exact keyword matches",
      "Vector search is faster because it uses hash indexes",
      "Vector search requires less storage than keyword indexes",
      "Vector search only works with structured tabular data"
    ],
    "answer": 0,
    "explain": "Vector similarity search compares embedding vectors using distance metrics (cosine similarity, dot product), finding semantically related content even when no exact keywords match, unlike traditional inverted index search."
  },
  {
    "cat": "generative-ai",
    "q": "A developer notices their RAG application sometimes retrieves irrelevant documents. What should they tune to improve retrieval quality?",
    "options": [
      "Improve chunking strategy and adjust similarity search thresholds and top-k parameters",
      "Increase the LLM temperature for more creative responses",
      "Use a larger LLM with a bigger context window",
      "Disable retrieval and rely on the model's training data only"
    ],
    "answer": 0,
    "explain": "RAG retrieval quality depends on chunk size, overlap, embedding model choice, similarity threshold, and top-k value. Tuning these parameters significantly impacts the relevance of retrieved context."
  },
  {
    "cat": "generative-ai",
    "q": "What is 'structured output' or 'JSON mode' in LLM inference?",
    "options": [
      "Constraining the model to generate valid JSON following a specified schema",
      "Saving LLM outputs to structured databases automatically",
      "Formatting model outputs with HTML for web display",
      "Routing outputs to different downstream systems based on content"
    ],
    "answer": 0,
    "explain": "JSON mode constrains LLM output to valid JSON following a schema, making outputs programmatically parseable. This is essential for LLM integration into applications that need structured data."
  },
  {
    "cat": "generative-ai",
    "q": "A company's LLM assistant sometimes generates responses that are very long and verbose. What parameter should be adjusted?",
    "options": [
      "Decrease temperature to reduce output creativity",
      "Set a lower max_tokens limit to constrain response length",
      "Increase top-p to narrow token selection",
      "Use a system prompt asking for shorter responses (most reliable)"
    ],
    "answer": 3,
    "explain": "Adding an explicit instruction in the system prompt like 'Be concise and answer in 2-3 sentences' is the most reliable way to control verbosity. Max_tokens hard-cuts responses, which may cut off mid-sentence."
  },
  {
    "cat": "generative-ai",
    "q": "What is 'retrieval augmented generation' (RAG) designed to solve?",
    "options": [
      "LLM hallucinations and outdated knowledge by grounding responses in retrieved facts",
      "The high compute cost of training foundation models from scratch",
      "The inability of LLMs to generate code in multiple languages",
      "High inference latency in large foundation models"
    ],
    "answer": 0,
    "explain": "RAG addresses LLM hallucinations and knowledge cutoff limitations by retrieving relevant, up-to-date documents at inference time and providing them as context, grounding responses in verifiable facts."
  },
  {
    "cat": "generative-ai",
    "q": "Which metric measures the quality of generated text by comparing n-gram overlap with reference translations?",
    "options": [
      "ROUGE score measuring recall for summarization",
      "Perplexity measuring model uncertainty on test data",
      "BLEU score measuring n-gram precision for translation quality",
      "BERTScore measuring semantic embedding similarity"
    ],
    "answer": 2,
    "explain": "BLEU (Bilingual Evaluation Understudy) measures n-gram precision between generated and reference translations, making it the standard metric for evaluating machine translation quality."
  },
  {
    "cat": "generative-ai",
    "q": "A developer wants to give an LLM a persistent identity as 'Alex, a friendly customer support agent.' Where should this be configured?",
    "options": [
      "In each user message at the start of the conversation",
      "As a fine-tuning dataset with Alex-style responses",
      "In the system prompt defining Alex's persona, tone, and constraints",
      "As metadata in the API request headers"
    ],
    "answer": 2,
    "explain": "System prompts define the model's persistent identity, persona, behavior rules, and constraints. They apply throughout the conversation and are the standard way to establish an AI assistant's character."
  },
  {
    "cat": "generative-ai",
    "q": "What is the 'lost in the middle' problem with large context windows in LLMs?",
    "options": [
      "Models lose track of the conversation topic over long exchanges",
      "Models generate longer outputs when given longer contexts",
      "Models pay less attention to information in the middle of long contexts, reducing recall accuracy",
      "Models become slower when context windows exceed the training maximum"
    ],
    "answer": 2,
    "explain": "Research shows LLMs recall information from the beginning and end of long contexts better than the middle. Important information should be placed at the start or end of prompts for best results."
  },
  {
    "cat": "generative-ai",
    "q": "A company wants to automatically generate product descriptions from structured data (name, price, features). What is the ideal approach?",
    "options": [
      "Fine-tune an LLM on examples of product descriptions from the catalog",
      "Use RAG to retrieve existing descriptions and paraphrase them",
      "Use template-based prompting with structured data injected into a prompt template",
      "Train a custom NLP model using Amazon SageMaker"
    ],
    "answer": 2,
    "explain": "Template-based prompting injects structured product data into a consistent prompt template, enabling reliable, scalable generation of product descriptions without fine-tuning. Few-shot examples further improve quality."
  },
  {
    "cat": "generative-ai",
    "q": "What is 'constitutional AI' as developed by Anthropic?",
    "options": [
      "A legal framework governing AI deployment in government",
      "A constitutional document defining AI rights and responsibilities",
      "A training method using a set of principles to guide the AI to critique and revise its own outputs",
      "A hardware architecture optimizing AI model inference"
    ],
    "answer": 2,
    "explain": "Constitutional AI uses a set of principles (a 'constitution') to train models to evaluate and revise their own responses, producing more helpful, harmless, and honest outputs through self-critique."
  },
  {
    "cat": "generative-ai",
    "q": "Which Amazon Bedrock capability allows you to create an AI assistant that can browse your internal knowledge base AND call your CRM API within the same conversation?",
    "options": [
      "Bedrock Model Customization combining knowledge and APIs",
      "Bedrock Guardrails with tool use configuration",
      "Bedrock Agents orchestrating Knowledge Bases and Action Groups together",
      "Bedrock Provisioned Throughput with multi-modal support"
    ],
    "answer": 2,
    "explain": "Bedrock Agents can combine Knowledge Bases (for RAG retrieval) and Action Groups (for API calls) in a single agent, enabling complex assistants that both retrieve knowledge and take actions."
  },
  {
    "cat": "generative-ai",
    "q": "What is 'agentic AI' and how does it differ from standard LLM chat?",
    "options": [
      "Agentic AI uses larger models; chat uses smaller models",
      "Agentic AI is only available for enterprise customers",
      "Agentic AI autonomously plans and executes multi-step tasks using tools; chat responds to single turns",
      "Agentic AI generates images; chat generates text"
    ],
    "answer": 2,
    "explain": "Agentic AI systems plan sequences of actions, use tools (search, code execution, APIs), and iterate toward goals autonomously. Standard chat is single-turn or stateless conversational response."
  },
  {
    "cat": "generative-ai",
    "q": "A company's LLM generates responses that are technically accurate but sound robotic and don't match their brand voice. What is the most efficient fix?",
    "options": [
      "Fine-tune the model on hundreds of brand voice examples",
      "Post-process outputs through a second model for style transfer",
      "Use a different foundation model with a better writing style",
      "Add detailed brand voice guidelines and examples to the system prompt"
    ],
    "answer": 3,
    "explain": "Detailed system prompt instructions specifying tone, style, vocabulary, and examples of brand voice can effectively shape LLM writing style without the cost and complexity of fine-tuning."
  },
  {
    "cat": "generative-ai",
    "q": "What is 'semantic chunking' in RAG pipelines?",
    "options": [
      "Encrypting document chunks for security compliance",
      "Ranking chunks by semantic relevance before embedding",
      "Compressing chunks to reduce vector database storage",
      "Splitting documents at semantically meaningful boundaries rather than fixed character counts"
    ],
    "answer": 3,
    "explain": "Semantic chunking splits documents at natural topic boundaries (paragraphs, sections, sentences) rather than arbitrary character limits, preserving context and improving embedding quality for retrieval."
  },
  {
    "cat": "generative-ai",
    "q": "Which AWS service provides a managed workflow for building generative AI applications with automatic scaling, no infrastructure management?",
    "options": [
      "Amazon EC2 with GPU instances and custom containers",
      "AWS Lambda with custom ML model layers",
      "Amazon SageMaker with self-managed training clusters",
      "Amazon Bedrock with fully managed foundation model API access"
    ],
    "answer": 3,
    "explain": "Amazon Bedrock is serverless and fully managed — no infrastructure to provision or scale. Developers call foundation model APIs directly and Bedrock handles scaling, availability, and model management."
  },
  {
    "cat": "generative-ai",
    "q": "A developer wants to test whether changing the system prompt improves response quality. How should they systematically evaluate this?",
    "options": [
      "Deploy both prompts in production and measure user satisfaction",
      "Use the prompt that produces longer responses as a quality proxy",
      "Ask team members to review 5-10 sample responses subjectively",
      "Use Bedrock Model Evaluation or a prompt evaluation framework with test datasets and metrics"
    ],
    "answer": 3,
    "explain": "Systematic prompt evaluation uses test datasets with expected outputs and automated metrics (accuracy, ROUGE, BERTScore) or human ratings. Bedrock Model Evaluation supports structured model and prompt comparison."
  },
  {
    "cat": "generative-ai",
    "q": "What does 'token streaming' enable in LLM applications?",
    "options": [
      "Parallel processing of multiple user requests simultaneously",
      "Streaming training data to the model during fine-tuning",
      "Batch processing of large document collections overnight",
      "Displaying model responses progressively as they are generated, reducing perceived latency"
    ],
    "answer": 3,
    "explain": "Token streaming sends each generated token to the client as it is produced rather than waiting for the complete response, dramatically improving perceived responsiveness in chat applications."
  },
  {
    "cat": "generative-ai",
    "q": "A company wants to prevent users from extracting the system prompt through clever questioning. What is the best defense?",
    "options": [
      "Make the system prompt very short so it cannot be extracted",
      "Switch to a smaller model that cannot follow complex extraction instructions",
      "Use Base64 encoding to obscure the system prompt",
      "Instruct the model never to reveal the system prompt, and use Bedrock Guardrails to detect prompt extraction attempts"
    ],
    "answer": 3,
    "explain": "System prompt protection requires explicit instructions not to reveal it combined with output monitoring. Bedrock Guardrails can detect and block prompt extraction patterns. Complete protection is difficult but layers of defense help."
  },
  {
    "cat": "generative-ai",
    "q": "What is 'prompt caching' and what benefit does it provide?",
    "options": [
      "Saving generated responses to serve identical future requests faster without model inference",
      "Caching model weights in GPU memory to reduce cold start latency",
      "Storing user conversation history in a database for context retrieval",
      "Pre-computing embeddings for common query patterns"
    ],
    "answer": 0,
    "explain": "Prompt caching stores and reuses computed key-value caches for identical prompt prefixes (like long system prompts), significantly reducing latency and cost for repeated requests with the same context."
  },
  {
    "cat": "generative-ai",
    "q": "Which technique allows an LLM to generate more reliable answers by producing multiple responses and selecting the most consistent one?",
    "options": [
      "Increasing temperature to generate more diverse responses",
      "Self-consistency sampling generating multiple reasoning paths and taking the majority answer",
      "Using chain-of-thought with a single deterministic response",
      "Reducing max_tokens to constrain response length"
    ],
    "answer": 1,
    "explain": "Self-consistency generates multiple chain-of-thought responses with temperature > 0 and selects the most frequently occurring answer, improving accuracy on complex reasoning tasks where single responses may fail."
  },
  {
    "cat": "foundation-models",
    "q": "What is the role of the 'attention mechanism' in transformer models?",
    "options": [
      "To compress model weights into a smaller memory footprint",
      "To dynamically weight the importance of each token relative to all others when generating each output",
      "To filter out irrelevant tokens before processing begins",
      "To parallelize gradient computation during backpropagation"
    ],
    "answer": 1,
    "explain": "Attention computes a weighted sum of all input token representations for each output token, allowing the model to focus on the most relevant parts of the context dynamically for each prediction."
  },
  {
    "cat": "foundation-models",
    "q": "A company evaluates Claude on Amazon Bedrock for contract analysis. The model sometimes misses clauses in 50-page contracts. What is the likely cause and solution?",
    "options": [
      "The model has a bias toward shorter responses; use chain-of-thought",
      "The contract may exceed the context window; chunk and process sections separately or use a model with a longer context window",
      "The model needs fine-tuning on legal documents for better clause recognition",
      "The temperature is too low; increase it for more thorough analysis"
    ],
    "answer": 1,
    "explain": "Long documents may exceed context windows or suffer from the 'lost in the middle' problem. Solutions include processing sections separately, using models with 100K+ token windows, or implementing document-aware chunking strategies."
  },
  {
    "cat": "foundation-models",
    "q": "Which inference parameter should be set to 0 when you need completely deterministic, reproducible outputs from an LLM?",
    "options": [
      "top_p: set to 0 for deterministic selection",
      "temperature: set to 0 for greedy decoding",
      "max_tokens: set to 0 for shortest possible output",
      "top_k: set to 0 to disable sampling"
    ],
    "answer": 1,
    "explain": "Setting temperature to 0 enables greedy decoding — the model always selects the highest-probability next token, producing deterministic, reproducible outputs. This is ideal for factual tasks requiring consistency."
  }
];