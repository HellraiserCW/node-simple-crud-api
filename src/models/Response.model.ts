import { User } from './User.model';

export interface ApiResponse {
    statusCode: number;
    message?: string;
    data?: User | User[];
}
