
export default class Request {

  constructor(fetchInstance) {
    this.fetch = fetchInstance;
  }

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
  parseJSON(response) {
    if (response.status === 204) {
      return {};
    }
    return response.json();
  }

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
  checkStatus(response) {
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
  request(url, options) {
    return this.fetch(`${url}`, options)
    .then(this.checkStatus)
    .then(this.parseJSON);
  }

  get(url, options) {
    const newOptions = Object.assign({}, options, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return this.request(url, newOptions);
  }

  post(url, data, options) {
    const newOptions = Object.assign({}, options, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return this.request(url, newOptions);
  }

  put(url, data, options) {
    const newOptions = Object.assign({}, options, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return this.request(url, newOptions);
  }

  dlte(url, data, options) {
    const newOptions = Object.assign({}, options, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return this.request(url, newOptions);
  }

}
