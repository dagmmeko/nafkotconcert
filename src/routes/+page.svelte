<script lang="ts">
	import type { AmoleProcessorDataType } from '../lib/types/amole-type';

	let amoleData: AmoleProcessorDataType = {
		cardNumber: '',
		pinNumber: '',
		type: 'CARD',
		expirationDateMM: '',
		expirationDateYY: ''
	};
	let selectedTicketTypeId: number = 0;
	let isSendingOtp:boolean = false

	$: if (amoleData.type === 'CARD') {
		if (amoleData.expirationDateMM.toString().length === 1) {
			amoleData.expirationDateMM = '0' + amoleData.expirationDateMM;
		}
		if (amoleData.expirationDateYY.toString().length === 1) {
			amoleData.expirationDateYY = '0' + amoleData.expirationDateYY;
		}
		if (
			!amoleData.expirationDateMM.toString().match(/^[0-9]{2}$/) ||
			Number(amoleData.expirationDateMM) < 1 ||
			Number(amoleData.expirationDateMM) > 12
		) {
			const e = new Error('Invalid card expiry month');
			// err(e)
			// throw e;
		}
		if (!amoleData.expirationDateYY.toString().match(/^[0-9]{2}$/)) {
			const e = new Error('Invalid card expiry year');
			// err(e)
			// throw e;
		}
	}

	async function sendOtp(){
		isSendingOtp =true

		try {
			const response = await fetch('/api', {
				method: 'POST',
				body: JSON.stringify({cardOrPhoneNumber: amoleData.cardNumber}),
				headers: {
					'content-type': 'application/json'
				}
			})
			const responseData = await response.json()

			responseData.map((res: any) => {
				console.log({r: res.MSG_LongMessage})
			})

			// console.log({resOTP: typeof responseData})
		}catch (e) {
			console.error(e)
		}
	}
</script>

<section class=" h-screen relative z-0">
	<img src={'/backimage.jpeg'} alt="" loading="lazy" class="w-full h-screen object-cover" />
	<div class="absolute inset-0 z-10 bg-black bg-opacity-50 grid content-center  ">
		<div class="grid justify-items-center ">
			<form
				method="POST"
				action="?/create"
				class="backdrop-blur rounded-md drop-shadow-md bg-white/70 p-6 w-[35rem] grid justify-items-stretch"
			>
				<div class="text-3xl justify-self-center pb-4">
					<span class="font-bold">Amole</span> Payment
				</div>
				<div>
					<div class="pb-4">
						<label class="pr-10">
							<input
								type="radio"
								checked={amoleData.type === 'CARD'}
								on:change={() => (amoleData.type = 'CARD')}
								name="amoleData.type"
								value={'CARD'}
								required
							/>
							Card number
						</label>

						<label>
							<input
								type="radio"
								checked={amoleData.type === 'PHONE'}
								on:change={() => (amoleData.type = 'PHONE')}
								name="amoleData.type"
								value={'PHONE'}
								required
							/>
							Phone number
						</label>
					</div>
				</div>
				<div class="flex flex-col">
					<div class="flex flex-row">
						<label class="pb-4">
							<select class="textfield" bind:value={selectedTicketTypeId} name="typeTicket">
								<option value={0}> Please Choose Ticket Type </option>
								<option value={1}> Regular </option>
								<option value={2}> VIP </option>
								<option value={3}> VVIP </option>
							</select>
						</label>
						<label class="pb-4">
							<input class="textfield" placeholder="Number of Tickets" pattern={`[0-9]{}`} max={selectedTicketTypeId === 1 ? '13000' : '1000'} />
						</label>
					</div>
					<label class="pb-4">
						<input
							class="textfield"
							placeholder={amoleData.type === 'CARD'
								? 'xxxx xxxx xxxx xxxx'
								: amoleData.type === 'PHONE'
								? '+251'
								: 'Choose Input Type'}
							name="cpnumber"
							pattern={`^(\\+251[0-9]{9}|57[0-9]{14})$`}
							minlength="10"
							maxlength="16"
							bind:value={amoleData.cardNumber}
							on:input={(e) => {
								if (e.currentTarget.value.match(/^0[0-9]{9}$/)) {
									amoleData.cardNumber = '+251' + e.currentTarget.value.replace(/^0/, '');
									amoleData.type = 'PHONE';
								}
							}}
						/>
					</label>

					<label class="pb-4">
						<input
							class="textfield"
							placeholder={amoleData.type === 'CARD'
								? 'PIN'
								: amoleData.type === 'PHONE'
								? 'OTP'
								: 'PIN'}
							pattern="[0-9][0-9][0-9][0-9]"
							maxlength="4"
							minlength="4"
							required
							bind:value={amoleData.pinNumber}
						/>
					</label>
					{#if amoleData.type === 'CARD'}
						<span>EXP Date </span>
						<label class="pb-4 flex flex-row">
							<input
								class="textfield"
								placeholder="MM"
								type="number"
								pattern="[0-1][0-9]"
								min={1}
								max={12}
								minlength="1"
								maxlength="2"
								bind:value={amoleData.expirationDateMM}
								name="expMonth"
							/>
							<input
								class="textfield"
								placeholder="YY"
								type="number"
								pattern="[0-9][0-9]"
								min={1}
								max={12}
								minlength="1"
								maxlength="2"
								bind:value={amoleData.expirationDateYY}
								name="expYear"
							/>
						</label>
					{/if}
					{#if amoleData.type === 'PHONE'}
						<button class="pb-4" on:click={sendOtp}> Send OTP </button>
					{/if}
				</div>

				<button
					class=" text-white bg-sendbtn py-4 rounded-md mt-4 font-medium justify-self-center w-full"
					type="submit">Buy</button
				>
			</form>
		</div>
	</div>
</section>

<style>
	.textfield {
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		display: inline-block;
		border: 1px solid #ccc;
		border-radius: 4px;
		box-sizing: border-box;
	}
</style>
