import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const LOG_API = 'http://20.244.56.144/evaluation-service/logs';
const AUTH_API = 'http://20.244.56.144/evaluation-service/auth';

let accessToken = null;

async function authenticate() {
  try {
    const res = await axios.post(AUTH_API, {
      email: process.env.EVAL_EMAIL,
      name: process.env.EVAL_NAME,
      rollNo: process.env.EVAL_ROLLNO,
      accessCode: process.env.EVAL_ACCESS_CODE,
      clientID: process.env.EVAL_CLIENT_ID,
      clientSecret: process.env.EVAL_CLIENT_SECRET,
    });
    accessToken = res.data.access_token;
    return accessToken;
  } catch (err) {
    console.error('Auth failed:', err.message);
  }
}

// ✅ Named export here
export async function Log(stack, level, pkg, message) {
  if (!accessToken) await authenticate();

  try {
    await axios.post(
      LOG_API,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (err) {
    console.error('Log failed:', err.message);
  }
}
