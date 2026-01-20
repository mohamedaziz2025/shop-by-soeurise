import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare enum UserRole {
    CLIENT = "CLIENT",
    SELLER = "SELLER",
    ADMIN = "ADMIN"
}
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
}
export declare class User {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
    emailVerified: boolean;
    emailVerificationToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    refreshToken?: string;
    lastLoginAt?: Date;
    sellerProfile?: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
