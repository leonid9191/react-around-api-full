export class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    console.log(res.ok)
    return res.ok ? res.json() : Promise.reject(res.statusText);
  }

  _request(url, options) {
    console.log(options.headers)
    return fetch(url, options.headers).then(this._checkResponse);
  }

  /**
   * get info about user from server
   * @returns Object
   */
  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  //get all cards
  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  editUserInfo(newUserInfo) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(newUserInfo),
    });
  }

  addCard(newCardInfo) {
    return this._request(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(newCardInfo),
    });
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  changeLikeCardStatus(cardId, like) {
    return this._request(this._baseUrl + "/cards/likes/" + cardId, {
      headers: this._headers,
      method: like ? "PUT" : "DELETE",
    });
  }

  editUserAvatar(avatar) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar }),
    });
  }
}
const jwt = localStorage.getItem('jwt');
const api = new Api({
  baseUrl: "https://localhost:3000",
  headers: {
    authorization: `Bearer ${jwt}`,
    "Content-Type": "application/json",
  },
});


export default api;
