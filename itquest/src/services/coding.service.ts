const API_BASE = 'http://localhost:5000';
const API_URL = `${API_BASE}/api/student/coding-challenges`;

const getHeaders = () => {
  // Pwede mong palitan ang key na ito kung iba ang tawag sa token mo sa localStorage
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const fetchCodingChallenges = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch coding challenges');
  }
  const result = await response.json();
  return result.data || result;
};

export const fetchCodingChallengeById = async (id: string | number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch challenge details');
  }
  const result = await response.json();
  return result.data || result;
};

export const submitChallengeSolution = async (challengeId: string | number, payload: any) => {
  const response = await fetch(`${API_URL}/${challengeId}/submit`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('Failed to submit challenge solution');
  }
  const result = await response.json();
  return result;
};