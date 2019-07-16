class ApexAPI {
  constructor (keys) {
    this.headers = {
      'x-api-key': keys['x-api-key'],
      'x-id-key': keys['x-id-key'],
      school: keys['school'],
    };
  }
  get (path) {
    return fetch (`https://www.apexschools.co/api/v1/${path}`, {
      method: 'GET',
      headers: {
        ...this.headers,
      },
    });
  }
  post (path, body) {
    return fetch (`https://www.apexschools.co/api/v1/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
      },
      body: JSON.stringify (body),
    });
  }
  put (path, body) {
    return fetch (`https://www.apexschools.co/api/v1/${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
      },
      body: JSON.stringify (body),
    });
  }
  delete (path) {
    return fetch (`https://www.apexschools.co/api/v1/${path}`, {
      method: 'DELETE',
      headers: {
        ...this.headers,
      },
    });
  }
  postBlob(path, callback) {
    
  }
  static getSchoolList = () => {
    return fetch ('https://www.apexschools.co/api/v1/schools', {
      method: 'GET',
    });
  };
  static authenticate = (username, password, school) => {
    return fetch ('https://www.apexschools.co/api/v1/app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify ({username, password, school}),
    });
  };
}

export default ApexAPI;
