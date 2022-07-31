import ejs from 'ejs';
import path from 'path';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

import { AccountDocument } from '../models/Account';
import { createRandomToken } from '../util/tokens';
import {
    AUTH_URL,
    SECURE_KEY,
    WALLET_URL,
    EMAIL,
    EMAIL_REFRESH_TOKEN,
    EMAIL_CLIENT_SECRET,
    EMAIL_CLIENT_ID,
} from '../util/secrets';
import { encryptString } from '../util/encrypt';
import { logger } from '../util/logger';

const OAuth2 = google.auth.OAuth2;

export class MailService {
    static async sendConfirmationEmail(account: AccountDocument, returnUrl: string) {
        account.signupToken = createRandomToken();
        account.signupTokenExpires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours,

        const verifyUrl = `${returnUrl}/verify?signup_token=${account.signupToken}&return_url=${returnUrl}`;
        const html = await ejs.renderFile(
            path.dirname(__dirname) + '/views/mail/signupConfirm.ejs',
            {
                verifyUrl,
                returnUrl,
                baseUrl: AUTH_URL,
            },
            { async: true },
        );

        await this.sendMail(account.email, 'Please complete the sign up for your THX Account', html, verifyUrl);

        await account.save();
    }

    static async sendLoginLinkEmail(account: AccountDocument, password: string) {
        const secureKey = encryptString(password, SECURE_KEY.split(',')[0]);
        const authToken = createRandomToken();
        const encryptedAuthToken = encryptString(authToken, password);

        const loginUrl = `${WALLET_URL}/login?authentication_token=${encryptedAuthToken}&secure_key=${secureKey}`;
        const html = await ejs.renderFile(
            path.dirname(__dirname) + '/views/mail/loginLink.ejs',
            {
                loginUrl,
                returnUrl: WALLET_URL,
                baseUrl: AUTH_URL,
            },
            { async: true },
        );

        await this.sendMail(account.email, 'A sign in is requested for your Web Wallet', html, loginUrl);

        account.authenticationToken = encryptedAuthToken;
        account.authenticationTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await account.save();
    }

    static async sendResetPasswordEmail(account: AccountDocument, returnUrl: string) {
        account.passwordResetToken = createRandomToken();
        account.passwordResetExpires = Date.now() + 1000 * 60 * 20; // 20 minutes,

        const resetUrl = `${returnUrl}/reset?passwordResetToken=${account.passwordResetToken}`;
        const html = await ejs.renderFile(
            path.dirname(__dirname) + '/views/mail/resetPassword.ejs',
            {
                resetUrl,
                returnUrl,
                baseUrl: AUTH_URL,
            },
            { async: true },
        );

        await this.sendMail(account.email, 'Reset your THX Password', html, resetUrl);

        await account.save();
    }

    static createTransporter = async () => {
        const oauth2Client = new OAuth2(
            EMAIL_CLIENT_ID,
            EMAIL_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground',
        );

        oauth2Client.setCredentials({
            refresh_token: EMAIL_REFRESH_TOKEN,
        });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject('Failed to create access token :(');
                }
                resolve(token);
            });
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: EMAIL,
                accessToken,
                clientId: EMAIL_CLIENT_ID,
                clientSecret: EMAIL_CLIENT_SECRET,
                refreshToken: EMAIL_REFRESH_TOKEN,
            },
        });

        return transporter;
    };

    static sendMail = (to: string, subject: string, html: string, link = '') =>
        new Promise((resolve, reject) => {
            this.createTransporter().then(
                (emailTransporter) => {
                    emailTransporter.sendMail({ subject, html, to, from: EMAIL, replyTo: 'info@aqarchain.com' }).then(
                        (info: any) => resolve(info),
                        (err: any) => {
                            logger.info(`Email not sent: ${link}`);
                            return reject(err);
                        },
                    );
                },
                (err) => {
                    logger.info(`Email not sent: ${link}`);
                    return reject(err);
                },
            );
        });
}
