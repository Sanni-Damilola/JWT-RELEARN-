export interface IUsers {
  fullName: string;
  lastName: string;
  phoneNumber: string;
  DOB: string;
  password: string;
  confirmPassword: string;
  email: string;
  OTP?: string;
  OTPExpiry?: string | undefined;
  isVerified?: boolean;
  token?: string;
}
