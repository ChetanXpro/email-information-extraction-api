import { OpenAIApi, Configuration, ChatCompletionResponseMessageRoleEnum } from 'openai'

if (!process.env.OPENAI_API_KEY) {
	throw new Error('OPENAI_API_KEY is not set')
}
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const functionDescriptions = [
	{
		name: 'extractEmailInformation',
		description:
			'categorise & extract key info from an email, such as use case, company name, contact details, etc.',
		parameters: {
			type: 'object',
			properties: {
				companyName: {
					type: 'string',
					description: 'the name of the company that sent the email',
				},
				product: {
					type: 'string',
					description: 'Try to identify which product the email is about, if any',
				},
				amount: {
					type: 'string',
					description: 'Try to identify the amount of products the client wants to purchase or sell, if any',
				},
				category: {
					type: 'string',
					description:
						'Try to categorise this email into categories like those: 1. Sales 2. customer support; 3. consulting; 4. partnership; 5. opportunity; etc.',
				},
				nextStep: {
					type: 'string',
					description: 'What is the suggested next step to move this forward?',
				},
				priority: {
					type: 'string',
					description:
						'Try to give a priority score to this email based on how likely this email will leads to a good opportunity, from 0 to 10; 10 most important',
				},
			},
			required: ['companyName', 'product', 'amount', 'category', 'nextStep', 'priority'],
		},
	},
]

export const extractEmailInformation = async (query: string) => {
	try {
		const messages: any = [{ role: ChatCompletionResponseMessageRoleEnum.User, content: query }]

		console.log(messages)

		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo-0613',
			messages: messages,
			functions: functionDescriptions,
		})

		console.log(JSON.parse(response.data.choices[0].message?.function_call?.arguments!))

		return JSON.parse(response.data.choices[0].message?.function_call?.arguments!)
	} catch (error: any) {
		console.log(error.response.data)
	}
}
