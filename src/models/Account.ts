import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';
import { AccountPlanType } from '../types/enums/AccountPlanType';
import { TAccount } from '../types/TAccount';
import { encryptString } from '../util/encrypt';

export interface IAccountUpdates {
    acceptTermsPrivacy?: boolean;
    acceptUpdates?: boolean;
    address?: string;
    privateKey?: string;
    googleAccess?: boolean;
    twitterAccess?: boolean;
    spotifyAccess?: boolean;
    authenticationToken?: string;
    authenticationTokenExpires?: number;
    lastLoginAt?: number;
    firstName?: string;
    lastName?: string;
    plan?: AccountPlanType;
    organisation?: string;
}

export type AccountDocument = mongoose.Document & TAccount;

const accountSchema = new mongoose.Schema(
    {
        active: Boolean,
        firstName: String,
        lastName: String,
        name: String,
        organisation: String,
        plan: Number,
        email: { type: String, unique: true },
        password: String,
        address: String,
        privateKey: String,
        signupToken: String,
        otpSecret: String,
        signupTokenExpires: Date,
        authenticationToken: String,
        authenticationTokenExpires: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        googleAccessToken: String,
        googleRefreshToken: String,
        googleAccessTokenExpires: Number,
        twitterAccessToken: String,
        twitterRefreshToken: String,
        twitterAccessTokenExpires: Number,
        spotifyAccessToken: String,
        spotifyRefreshToken: String,
        spotifyAccessTokenExpires: Number,
        acceptTermsPrivacy: Boolean,
        acceptUpdates: Boolean,
        lastLoginAt: Date,
    },
    { timestamps: true },
);

/**
 * Password hash middleware.
 */
accountSchema.pre('save', function save(next) {
    const account = this as AccountDocument;

    if (!account.isModified('password')) {
        return next();
    }

    // if (account.privateKey) {
    //     account.privateKey = encryptString(account.privateKey, account.password);
    // }

    const hash = bcrypt.hashSync(account.password);
    account.password = hash;
    next();
});

const comparePassword = function (candidatePassword: string) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

accountSchema.methods.comparePassword = comparePassword;

export const Account = mongoose.model<AccountDocument>('Account', accountSchema);
