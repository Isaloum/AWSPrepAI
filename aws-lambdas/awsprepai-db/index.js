/**
 * awsprepai-db
 * DynamoDB CRUD for monthly_cert_selection and free_usage.
 * Protected by Cognito JWT (Authorization header).
 */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID,
});

const ALLOWED_ORIGINS = [
  'https://certiprepai.com',
  'https://www.certiprepai.com',
  'https://main.d2pm3jfcsesli7.amplifyapp.com',
  'https://awsprepai.isaloumapps.com',
  'https://awsprepai.netlify.app',
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const headers = corsHeaders(origin);

  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Verify JWT
  const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
  const token = authHeader.replace('Bearer ', '');
  let claims;
  try {
    claims = await verifier.verify(token);
  } catch (err) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }
  const userId = claims.sub;

  try {
    const { action, data } = JSON.parse(event.body || '{}');

    // --- monthly_cert_selection ---
    if (action === 'get_monthly_cert') {
      const res = await dynamo.send(new GetCommand({
        TableName: 'awsprepai-monthly-cert',
        Key: { user_id: userId },
      }));
      return { statusCode: 200, headers, body: JSON.stringify({ data: res.Item || null }) };
    }

    if (action === 'set_monthly_cert') {
      const { cert_id } = data;
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-monthly-cert',
        Item: { user_id: userId, cert_id, selected_at: new Date().toISOString() },
      }));
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    // --- free_usage ---
    if (action === 'get_free_usage') {
      const res = await dynamo.send(new GetCommand({
        TableName: 'awsprepai-free-usage',
        Key: { user_id: userId },
      }));
      return { statusCode: 200, headers, body: JSON.stringify({ data: res.Item || null }) };
    }

    if (action === 'update_free_usage') {
      const { cert_id, count } = data;
      await dynamo.send(new PutCommand({
        TableName: 'awsprepai-free-usage',
        Item: { user_id: userId, cert_id, count, updated_at: new Date().toISOString() },
      }));
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (err) {
    console.error('[awsprepai-db] Error:', err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
