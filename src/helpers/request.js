require('fetch-everywhere');

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options) {
  console.log(url);
  return fetch(`http://localhost:3000${url}`, options)
    .then(checkStatus)
    .then(parseJSON);
}

export function get(url, options) {
  const newOptions = Object.assign({}, options, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDczZGMwLTkxYTMtMTFlNy05OWZlLTRiZWNhM2UxZDcxYyIsIm5hbWUiOiJHZW9yZ2UgTXVyZXNhbiIsImVtYWlsIjoiZ211cmVzYW4zQGdtYWlsLmNvbSIsImlhdCI6MTUwNDU2MzM1NSwiZXhwIjoxNTA0NjQ5NzU1fQ.TEDm65vNGQqO5RszDY1hOMqpf3tVp1reGGGYD2sZBbM',
    },
  });
  return request(url, newOptions);
}

export function post(url, data, options) {
  const newOptions = Object.assign({}, options, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDczZGMwLTkxYTMtMTFlNy05OWZlLTRiZWNhM2UxZDcxYyIsIm5hbWUiOiJHZW9yZ2UgTXVyZXNhbiIsImVtYWlsIjoiZ211cmVzYW4zQGdtYWlsLmNvbSIsImlhdCI6MTUwNDU2MzM1NSwiZXhwIjoxNTA0NjQ5NzU1fQ.TEDm65vNGQqO5RszDY1hOMqpf3tVp1reGGGYD2sZBbM',
    },
  });
  return request(url, newOptions);
}

export function put(url, data, options) {
  const newOptions = Object.assign({}, options, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDczZGMwLTkxYTMtMTFlNy05OWZlLTRiZWNhM2UxZDcxYyIsIm5hbWUiOiJHZW9yZ2UgTXVyZXNhbiIsImVtYWlsIjoiZ211cmVzYW4zQGdtYWlsLmNvbSIsImlhdCI6MTUwNDU2MzM1NSwiZXhwIjoxNTA0NjQ5NzU1fQ.TEDm65vNGQqO5RszDY1hOMqpf3tVp1reGGGYD2sZBbM',
    },
  });
  return request(url, newOptions);
}

export function dlte(url, data, options) {
  const newOptions = Object.assign({}, options, {
    method: 'DELETE',
    // body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNDczZGMwLTkxYTMtMTFlNy05OWZlLTRiZWNhM2UxZDcxYyIsIm5hbWUiOiJHZW9yZ2UgTXVyZXNhbiIsImVtYWlsIjoiZ211cmVzYW4zQGdtYWlsLmNvbSIsImlhdCI6MTUwNDU2MzM1NSwiZXhwIjoxNTA0NjQ5NzU1fQ.TEDm65vNGQqO5RszDY1hOMqpf3tVp1reGGGYD2sZBbM',
    },
  });
  return request(url, newOptions);
}

