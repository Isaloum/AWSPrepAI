/**
 * awsprepai-db Lambda
 * Auth via Cognito GetUser (access token).
 * DynamoDB CRUD for monthly_cert, free_usage, and progress.
 */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoIdentityProviderClient, GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const lambdaClient = new LambdaClient({ region: 'us-east-1' });
const EMAIL_DRIP_FUNCTION = process.env.EMAIL_DRIP_FUNCTION || 'awsprepai-email-drip';

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));
const cognito = new CognitoIdentityProviderClient({ region: 'us-east-1' });

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  const method = event.requestContext?.http?.method || 'UNKNOWN';
  const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  // ── capture_lead — no auth required ─────────────────────────────
  try {
    const body = JSON.parse(event.body || '{}');
    if (body.action === 'capture_lead') {
      const email = (body.data?.email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid email' }) };
      }
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-leads',
        Item: { email, captured_at: new Date().toISOString(), source: body.data?.source || 'homepage' },
        ConditionExpression: 'attribute_not_exists(email)', // skip if already captured
      }));
      // Fire-and-forget welcome email (async invoke — doesn't block response)
      lambdaClient.send(new InvokeCommand({
        FunctionName: EMAIL_DRIP_FUNCTION,
        InvocationType: 'Event', // async
        Payload: Buffer.from(JSON.stringify({ email, type: 'welcome' })),
      })).catch(err => console.error('email-drip invoke failed:', err.message));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
    }
  } catch (e) {
    // ConditionalCheckFailedException = duplicate email, that's fine
    if (e.name !== 'ConditionalCheckFailedException') {
      console.error('capture_lead error:', e.message);
    }
  }

  if (!token) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Missing token' }) };
  }

  let userId;
  try {
    const userInfo = await cognito.send(new GetUserCommand({ AccessToken: token }));
    userId = userInfo.Username;
  } catch (err) {
    console.error('Auth error:', err.message);
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    const { action, data } = JSON.parse(event.body || '{}');

    // ── Monthly cert ─────────────────────────────────────────────
    if (action === 'get_monthly_cert') {
      const res = await dynamo.send(new GetCommand({ TableName: 'awsprepai-monthly-cert', Key: { user_id: userId } }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ data: res.Item || null }) };
    }

    if (action === 'set_monthly_cert') {
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-monthly-cert',
        Item: { user_id: userId, cert_id: data.cert_id, selected_at: new Date().toISOString() },
      }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    // ── Free usage ────────────────────────────────────────────────
    if (action === 'get_free_usage') {
      const res = await dynamo.send(new GetCommand({ TableName: 'awsprepai-free-usage', Key: { user_id: userId } }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ data: res.Item || null }) };
    }

    if (action === 'update_free_usage') {
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-free-usage',
        Item: { user_id: userId, cert_id: data.cert_id, count: data.count, updated_at: new Date().toISOString() },
      }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    // ── Progress: get all ─────────────────────────────────────────
    if (action === 'get_progress') {
      const res = await dynamo.send(new QueryCommand({
        TableName: 'awsprepai-progress',
        KeyConditionExpression: 'user_id = :uid',
        ExpressionAttributeValues: { ':uid': userId },
      }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ data: res.Items || [] }) };
    }

    // ── Progress: save full exam result (accumulates across exams) ─
    if (action === 'save_exam_result') {
      // data = { cert_id, questions_attempted, correct_answers, domain_scores }
      // domain_scores = { [domainKey]: { attempted: N, correct: N } }
      const { cert_id, questions_attempted, correct_answers, domain_scores } = data;

      // Fetch existing record to accumulate
      const existing = await dynamo.send(new GetCommand({
        TableName: 'awsprepai-progress',
        Key: { user_id: userId, cert_id },
      }));
      const prev = existing.Item || {};

      // Accumulate overall counts
      const newAttempted = (prev.questions_attempted || 0) + (questions_attempted || 0);
      const newCorrect   = (prev.correct_answers || 0) + (correct_answers || 0);

      // Accumulate per-domain counts
      const prevDomains = prev.domain_scores || {};
      const newDomains  = { ...prevDomains };
      for (const [domain, scores] of Object.entries(domain_scores || {})) {
        const p = newDomains[domain] || { attempted: 0, correct: 0 };
        newDomains[domain] = {
          attempted: p.attempted + (scores.attempted || 0),
          correct:   p.correct   + (scores.correct   || 0),
        };
      }

      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-progress',
        Item: {
          user_id: userId,
          cert_id,
          questions_attempted: newAttempted,
          correct_answers: newCorrect,
          domain_scores: newDomains,
          last_practiced: new Date().toISOString(),
        },
      }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    // ── Bundle cert selection ──────────────────────────────────────
    if (action === 'get_bundle_certs') {
      const res = await dynamo.send(new GetCommand({ TableName: 'awsprepai-bundle-certs', Key: { user_id: userId } }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ data: res.Item || null }) };
    }

    if (action === 'set_bundle_certs') {
      if (!Array.isArray(data.cert_ids) || data.cert_ids.length !== 3) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Exactly 3 cert_ids required' }) };
      }
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-bundle-certs',
        Item: { user_id: userId, cert_ids: data.cert_ids, selected_at: new Date().toISOString() },
      }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    // Legacy: single-question update (keep for backward compat)
    if (action === 'update_progress') {
      const { cert_id, correct } = data;
      const existing = await dynamo.send(new GetCommand({
        TableName: 'awsprepai-progress',
        Key: { user_id: userId, cert_id },
      }));
      const prev = existing.Item || {};
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-progress',
        Item: {
          user_id: userId,
          cert_id,
          questions_attempted: (prev.questions_attempted || 0) + 1,
          correct_answers: (prev.correct_answers || 0) + (correct ? 1 : 0),
          domain_scores: prev.domain_scores || {},
          last_practiced: new Date().toISOString(),
        },
      }));
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    console.error('[awsprepai-db] Error:', err.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
