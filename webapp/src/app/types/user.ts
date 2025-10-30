

export interface User {
  _id: string;
  name: string;
  email: string;
//   password?: string; // For secure backend use only, optional frontend
  isAdmin: boolean;
}
