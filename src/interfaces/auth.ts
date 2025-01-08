export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}
