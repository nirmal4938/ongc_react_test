export interface IResetPassword {
  password: string;
  confirmPassword: string;
}

export interface IChangePassword {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}
