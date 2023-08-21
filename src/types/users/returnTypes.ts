import { User } from '../../interfaces';

export type userResult = {
  statusCode: number;
  message?: string;
  user?: User;
};
