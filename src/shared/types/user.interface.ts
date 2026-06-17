export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  name: string;
}

export interface UserRow extends UserRegister {
  id: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface UserInformation {
  id: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  name: string;
  email: string;
}
