<script lang="ts">
  import type { AmoleProcessorDataType } from "../lib/types/amole-type"
	

  let inputType: AmoleProcessorDataType['type'] | null = 'CARD'
  let ticketTypes: {
      id: number,
      name: string, 
      price: number
  }[] = [
      {id: 1, name: 'Regular', price: 1500},
      {id: 2, name: 'VIP', price: 3000},
      {id: 3, name: 'VVIP', price: 5000}
  ]
  let selectedTicketType: {
      id: number,
      name: string, 
      price: number
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
            <div class="text-3xl justify-self-center pb-4"> <span class="font-bold">Amole</span>  Payment </div>
            <div>
                <!-- <div class="pb-2">
                    {#if inputType === 'CARD'} 
                        <span> Please insert Card Number </span>
                    {:else if inputType === 'PHONE'}
                        <span> Please Insert Phone Number </span>
                    {:else}
                        <span> Phone Number / Card Number </span>
                    {/if}
                </div> -->
                <div class="pb-4">
                    <label class="pr-10">
                        <input type=radio checked={inputType === 'CARD'} on:change={()=> inputType = 'CARD'} name="inputType" value={'CARD'} required>
                         Card number
                    </label>
                    
                    <label>
                        <input type=radio checked={inputType === 'PHONE'} on:change={()=>inputType = 'PHONE'} name="inputType" value={'PHONE'} required> 
                        Phone number
                    </label>
                </div>
            </div>
            <div class="flex flex-col">   
                <label class="pb-4">     
                    <input class="textfield" disabled={inputType === null} placeholder={inputType === 'CARD' ? 'xxxx xxxx xxxx xxxx' : inputType === 'PHONE' ? '+251' : 'Choose Input Type'} name="pcnumber" />
                </label>
                <label class="pb-4">
                    <select class="textfield" disabled={inputType === null} bind:value={selectedTicketType.id} name="typeTicket">
                        <option value={null}> Please select ticket type</option>
                        {#each ticketTypes as ticketType}
                            <option value={ticketType.id}>
                                {ticketType.name} 
                                (Price {ticketType.price}/person)
                            </option>
                        {/each}
                    </select>
                </label>
                <label class="pb-4">
                    <input class="textfield" disabled={inputType === null} placeholder="Number of Tickets"/>
                </label>
                <label class="pb-4">
                    
                    <input class="textfield" disabled={inputType === null} placeholder={inputType === 'CARD' ? 'PIN' : inputType === 'PHONE' ? 'OTP' : 'PIN'}/>
                </label>
                {#if inputType === 'CARD'}
                    <label class="pb-4">
                        <input class="textfield" disabled={inputType === null} placeholder="EXP Date"/>
                    </label>
                {/if}
                {#if inputType === 'PHONE'}
                    <button class="pb-4">
                        Send OTP
                    </button>
                {/if}
            </div>
            
        <button class=" text-white bg-sendbtn py-4 rounded-md mt-4 font-medium justify-self-center w-full" type="submit">Buy</button>
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