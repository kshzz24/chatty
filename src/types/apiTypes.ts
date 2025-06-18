export type RegisterReqBody = {
  username: string;
  email: string;
  password: string;
  confirmPassWord: string;
};

export type LoginBody = {
  password: string;
  email: string;
};
