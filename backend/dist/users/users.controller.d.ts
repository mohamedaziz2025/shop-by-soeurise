import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<import("../schemas/user.schema").UserDocument>;
    updateProfile(user: any, updateUserDto: UpdateUserDto): Promise<import("mongoose").FlattenMaps<import("../schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
    changePassword(user: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    deleteAccount(user: any): Promise<{
        message: string;
    }>;
    findAll(filters: {
        role?: string;
        status?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/user.schema").UserDocument, {}, {}> & import("../schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findById(id: string): Promise<import("../schemas/user.schema").UserDocument>;
    updateStatus(id: string, status: string): Promise<import("mongoose").FlattenMaps<import("../schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>>;
}
