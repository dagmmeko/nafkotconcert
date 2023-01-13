export const actions = {
    create: async ({request}: any) =>{
        const formData = await request.formData()
        
        return "data"
    }
}