
export type AmoleProcessorDataType = {
    /* Phone or Card Number */
    cardNumber: string
    /* OTP from SMS or Card PIN */
    pinNumber: string
  } & (
    | {
        type: 'CARD'
        expirationDateMM: string
        expirationDateYY: string
      }
    | {
        type: 'PHONE'
      }
  )