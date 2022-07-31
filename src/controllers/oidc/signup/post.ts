import { Request, Response } from 'express';
import { AccountService } from '../../../services/AccountService';
import { MailService } from '../../../services/MailService';
import { checkPasswordStrength } from '../../../util/passwordcheck';

async function controller(req: Request, res: Response) {
    console.log('req.body', req.body);
    function renderError(message: string) {
        return res.render('onboard', {
            uid: req.params.uid,
            params: {
                return_url: req.body.returnUrl,
                signup_email: req.body.email,
            },
            alert: { variant: 'danger', message },
        });
    }

    const isDuplicate = await AccountService.isActiveUserByEmail(req.body.email);
    const passwordStrength = checkPasswordStrength(req.body.password);

    if (isDuplicate) {
        return renderError('An account with this e-mail address already exists.');
    } else if (passwordStrength != 'strong') {
        return renderError('Please enter a strong password.');
    } else if (req.body.password !== req.body.confirmPassword) {
        return renderError('The provided passwords are not identical.');
    } else if (!req.body.email?.length) {
        return renderError('Email cannot be blank.');
    }

    const account = await AccountService.signup(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        req.body.password,
        true,
        true,
    );

    await MailService.sendConfirmationEmail(account, req.body.returnUrl);

    res.render('onboard', {
        uid: req.params.uid,
        params: {
            return_url: req.body.returnUrl,
            signup_email: req.body.email,
        },
        alert: {
            variant: 'success',
            message: 'Verify your e-mail address by clicking the link we just sent you. You can close this window.',
        },
    });
}

export default { controller };
