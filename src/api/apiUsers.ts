import { checkRes, EApiParametrs, IApiInitialData, IHeaders } from './apiConstants';

class ApiUsers implements IApiUsers {
  public baseUrl = '';
  public headers: IHeaders = {} as IHeaders;
  constructor(options: IApiInitialData) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  getToken() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      this.headers.authorization = `Bearer ${token}`;
    }
  }

  /*  createNewUser
    Creates a new user
    route:  /users 

    Request body (required):
      {
        "name": "string",
        "email": "string",
        "password": "string"
      }

    Responses: 
      {
        "name": "string",
        "email": "string",
        "password": "string"
      }
  */
  public async createNewUser(newUser: IUser): Promise<Response> {
    const fetchConfig = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password
      })
    };

    const res = await fetch(`${this.baseUrl}/users`, fetchConfig);
    return checkRes(res);
  }

  /* getUserById
    Gets user
    route:  /users/{id} 

    Parameters:
      path id=userId

    Responses: 
      {
        "name": "string",
        "email": "string",
        "password": "string"
      }
  */
  public async getUserById(userId: string): Promise<IUser> {
    this.getToken();

    const fetchConfig = {
      method: 'GET',
      headers: this.headers
    };

    const res = await fetch(`${this.baseUrl}/users/${userId}`, fetchConfig);

    const wordsRes = checkRes(res) as unknown;
    return wordsRes as IUser;
  }

  /* updateUser
   Updates a user
    route:  /users/{id} 

    Parameters:
      path id=userId
    
    Request body (required):
      {
        "email": "string",
        "password": "string"
      }

    Responses: 
      {
        "name": "string",
        "email": "string",
        "password": "string"
      }
  */
  public async updateUser(userId: string, user: ILoginUserData): Promise<IUser> {
    this.getToken();

    const fetchConfig = {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify({
        email: user.email,
        password: user.password
      })
    };

    const res = await fetch(`${this.baseUrl}/users/${userId}`, fetchConfig);

    const wordsRes = checkRes(res) as unknown;
    return wordsRes as IUser;
  }

  /* deleteUserById
    Deletes a user by id
    route:  /users/{id} 

    Parameters:
      path id=userId
  
  */
  public async deleteUserById(userId: string): Promise<void> {
    this.getToken();

    const fetchConfig = {
      method: 'DELETE',
      headers: this.headers
    };

    await fetch(`${this.baseUrl}/users/${userId}`, fetchConfig);
  }

  /* getNewUserToken
    Gets new user tokens
    route:  /users/{id}/tokens 

    Parameters:
      path id=userId
  
  */
  public async getNewUserToken(userId: string): Promise<void> {
    this.getToken();

    const fetchConfig = {
      method: 'GET',
      headers: this.headers
    };

    await fetch(`${this.baseUrl}/users/${userId}/tokens`, fetchConfig);
  }

  /* signin
    Logins a user and returns a JWT-token
    route:  /signin 

    Request body (required):
      {
        "email": "string",
        "password": "string"
      }

    Responses: 
      {
        "message": "string",
        "token": "string",
        "refreshToken": "string",
        "userId": "string",
        "name": "string"
      }
  */
  public async signin(user: ILoginUserData): Promise<Response> {
    const fetchConfig = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        email: user.email,
        password: user.password
      })
    };

    const res = await fetch(`${this.baseUrl}/signin`, fetchConfig);
    return checkRes(res);
  }
}

// create instance of the api class

export const apiUsers = new ApiUsers({
  baseUrl: EApiParametrs.baseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
    // authorization: 'Bearer '
  }
});

// interfaces
export interface IApiUsers {
  baseUrl: string;
  headers: IHeaders;
  createNewUser: (newUser: IUser) => Promise<Response>;
  getUserById: (userId: string) => Promise<IUser>;
  updateUser: (userId: string, user: ILoginUserData) => Promise<IUser>;
  deleteUserById: (userId: string) => Promise<void>;
  getNewUserToken: (userId: string) => Promise<void>;
  signin: (newUser: IUser) => Promise<Response>;
}

export interface ILoginUserData {
  email: string;
  password: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}
