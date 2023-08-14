import fetch from 'node-fetch';

const HEADERS = { 'Content-Type': 'application/json' };
export const request = async (url: string, method: string, param: string) => {
  const response = await fetch(`${url}/${param}`, {
    method,
    headers: HEADERS,
  });

  return response.json();
};
