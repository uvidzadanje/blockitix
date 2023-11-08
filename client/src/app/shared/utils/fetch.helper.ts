interface HeaderRequest {
  method: string;
  headers: {
      "Content-Type": string;
  }
  body?: any;
}

interface HeaderPayload {
  method: string;
  payload?: any;
}

function getHeader({method, payload}: HeaderPayload)
{
  const headerRequest: HeaderRequest = {
      method,
      headers: {
          "Content-Type": 'application/json'
      },
      body: JSON.stringify(payload)
  };

  return headerRequest;
}

export async function fetchResult(url: string, headerPayload: HeaderPayload)
{
  const result = await fetch(url, getHeader(headerPayload));

  const data = await result.json();

  return data;
}
