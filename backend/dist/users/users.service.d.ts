import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findById(id: string): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<import("mongoose").FlattenMaps<User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    findAll(filters?: {
        role?: string;
        status?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateStatus(userId: string, status: string): Promise<import("mongoose").FlattenMaps<User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
}
