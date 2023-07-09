import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

const app = express()

import { extractEmailInformation } from './function'
const PORT = process.env.PORT || 5000

app.use(express.json())

app.post('/v1/email', async (req, res) => {
	try {
		const { email } = req.body

		if (!email || typeof email !== 'string') {
			return res.status(400).json({ success: false, error: 'Please provide a valid email' })
		}

		const query = `Please extract key information from this email: ${email}`

		const result = await extractEmailInformation(query)

		if (!result) return res.status(400).json({ success: false, error: 'Something went wrong' })

		res.status(200).json({ success: true, data: result })
	} catch (error) {
		res.status(400).json({ success: false, error: 'Something went wrong' })
	}
})

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
