import got from 'got';
import { SECRET_API_END, SECRET_API_SIG, SECRET_STATIC_IP } from '$env/static/private';

export const actions = {
	create: async ({ request }: any) => {
		let ticketValue = 0;
		const formData = await request.formData();

		const cardOrPhoneType = await formData.get('inputType');
		const cardOrPhoneNumber = await formData.get('cpnumber');
		const numberOfTickets = await formData.get('noTickets');
		const ticketType = await formData.get('typeTicket');
		const otpOrPin = await formData.get('otpOrPin');
		const expMonth = await formData.get('expMonth');
		const expYear = await formData.get('expYear');

		console.log({
			cpt: cardOrPhoneType,
			cpn: cardOrPhoneNumber,
			nt: numberOfTickets,
			tt: ticketType,
			op: otpOrPin,
			expM: expMonth,
			expY: expYear
		});

		if (Number(ticketType) <= 0 && Number(ticketType) > 3) {
			throw new Error('Invalid ticket type.');
		} else if (Number(ticketType) === 1) {
			ticketValue = 1500;
		} else if (Number(ticketType) === 2) {
			ticketValue = 3000;
		} else if (Number(ticketType) === 3) {
			ticketValue = 5000;
		}

		console.log({ t: ticketValue });

		try {
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
					BODY_ExpirationDate: cardOrPhoneType === 'CARD' ? `${expMonth}${expYear}` : '',
					BODY_PIN: otpOrPin,
					BODY_PaymentAction: '01',
					BODY_AmountX: ticketValue * numberOfTickets,
					BODY_AmoleMerchantID: 'RAMADAA', //TODO,
					BODY_OrderDescription: '',
					BODY_SourceTransID: 0, //TODO
					BODY_VendorAccount: '',
					BODY_AdditionalInfo1: '',
					BODY_AdditionalInfo2: '',
					BODY_AdditionalInfo3: '',
					BODY_AdditionalInfo4: '',
					BODY_AdditionalInfo5: ''
				},
				responseType: 'json'
			});

			if (!['Success', 'SuccessWithWarning'].includes(body[0].HDR_Acknowledge)) {
				throw new Error(
					`Amole transaction failed: ${body[0].MSG_LongMessage} (${body[0].HDR_Acknowledge} code ${body[0].MSG_ErrorCode})`
				);
			}

			// await input.onSucceeded();

			return {
				processor_response_data: {}
			};
		} catch (e) {
			// await input.onFailed();
			console.log(e);
			throw e;
		}

		return 'data';
	}
};
