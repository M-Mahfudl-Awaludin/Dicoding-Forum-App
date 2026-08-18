const BASE_URL = 'https://forum-api.dicoding.dev/v1';

class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const responseJson = await response.json();

    if (!response.ok || responseJson.status === 'fail' || responseJson.status === 'error') {
      throw new Error(responseJson.message || 'Terjadi kesalahan pada server');
    }

    return responseJson;
  }

  async register({ name, email, password }) {
    return this.fetchWithAuth(`${this.baseUrl}/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login({ email, password }) {
    return this.fetchWithAuth(`${this.baseUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getOwnProfile() {
    return this.fetchWithAuth(`${this.baseUrl}/users/me`);
  }

  async getAllUsers() {
    return this.fetchWithAuth(`${this.baseUrl}/users`);
  }

  async getAllThreads() {
    return this.fetchWithAuth(`${this.baseUrl}/threads`);
  }

  async getThreadDetail(threadId) {
    return this.fetchWithAuth(`${this.baseUrl}/threads/${threadId}`);
  }

  async createThread({ title, body, category }) {
    return this.fetchWithAuth(`${this.baseUrl}/threads`, {
      method: 'POST',
      body: JSON.stringify({ title, body, category }),
    });
  }

  async createComment(threadId, { content }) {
    return this.fetchWithAuth(`${this.baseUrl}/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async upVoteThread(threadId) {
    return this.fetchWithAuth(`${this.baseUrl}/threads/${threadId}/up-vote`, {
      method: 'POST',
    });
  }

  async downVoteThread(threadId) {
    return this.fetchWithAuth(`${this.baseUrl}/threads/${threadId}/down-vote`, {
      method: 'POST',
    });
  }

  async neutralizeThreadVote(threadId) {
    return this.fetchWithAuth(`${this.baseUrl}/threads/${threadId}/neutral-vote`, {
      method: 'POST',
    });
  }

  async upVoteComment(threadId, commentId) {
    return this.fetchWithAuth(
      `${this.baseUrl}/threads/${threadId}/comments/${commentId}/up-vote`,
      {
        method: 'POST',
      },
    );
  }

  async downVoteComment(threadId, commentId) {
    return this.fetchWithAuth(
      `${this.baseUrl}/threads/${threadId}/comments/${commentId}/down-vote`,
      {
        method: 'POST',
      },
    );
  }

  async neutralizeCommentVote(threadId, commentId) {
    return this.fetchWithAuth(
      `${this.baseUrl}/threads/${threadId}/comments/${commentId}/neutral-vote`,
      {
        method: 'POST',
      },
    );
  }

  async getLeaderboards() {
    return this.fetchWithAuth(`${this.baseUrl}/leaderboards`);
  }
}

const api = new Api(BASE_URL);
export default api;
