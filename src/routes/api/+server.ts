import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import got from 'got';
import { SECRET_API_END, SECRET_API_SIG, SECRET_STATIC_IP } from '$env/static/private';

export const POST = (async ({ request }) => {
    try {
			const { cardOrPhoneNumber } = await request.json();

			if (!cardOrPhoneNumber || !cardOrPhoneNumber.match(/^\+251[0-9]{9}$/)) {
				throw new Error('Invalid phone number format');
			}

			const { body } = await got<
				[
					{
						HDR_ResponseID: string;
						HDR_ResponseDate: string;
						HDR_Acknowledge:
							| 'Success'
							| 'SuccessWithWarning'
							| 'Failure'
							| 'FailureWithWarning'
							| 'CustomCode';
						HDR_ReferenceNumber: string;
						HDR_SourceTransID: string;
						BODY_AuthorizationCode: string;
						BODY_PaymentCardType: string;
						BODY_CardNumber: string;
						BODY_Amount: string;
						BODY_PaymentAction: '01' | '09';
						MSG_ErrorCode: string;
						MSG_ShortMessage: string;
						MSG_LongMessage: string;
					}
				]
			>(SECRET_API_END, {
				https: {
					rejectUnauthorized: false
				},
				method: 'POST',
				headers: {
					HDR_Signature: SECRET_API_SIG,
					HDR_IPAddress: SECRET_STATIC_IP,
					HDR_UserName: 'iskendere', // TODO: ...
					HDR_Password: 'test' // TODO: ...
				},
				form: {
					BODY_CardNumber: cardOrPhoneNumber,
					BODY_ExpirationDate: '',
					BODY_PIN: '',
					BODY_PaymentAction: '09',
					BODY_AmountX: '',
					BODY_AmoleMerchantID: 'RAMADAA',
					BODY_OrderDescription: '',
					BODY_SourceTransID: '',
					BODY_VendorAccount: '',
					BODY_AdditionalInfo1: '',
					BODY_AdditionalInfo2: '',
					BODY_AdditionalInfo3: '',
					BODY_AdditionalInfo4: '',
					BODY_AdditionalInfo5: ''
				},
				responseType: 'json'
			});

			return json(body);
		} catch (e) {
			console.log(e);
			return json(e);
		}
}) satisfies RequestHandler;
