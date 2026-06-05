import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
app.use(express.json())

const prisma = new PrismaClient({
  log: ['query'],
})

// POST /api/validate-token
app.post('/api/validate-token', async (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.body

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ success: false, error: 'Token is required' })
    }

    // Special demo token
    if (token === 'XtY8ut3mrwhrUg5') {
      return res.json({
        success: true,
        balance: 5397.98,
        accountType: 'demo',
      })
    }

    // Validate token against Deriv API (placeholder logic)
    // In production, this would call the Deriv API to validate the token
    try {
      const derivRes = await fetch('https://api.derivws.com/websockets/v3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorize: token,
        }),
      })

      const data = await derivRes.json()

      if (data.error) {
        return res.json({ success: false, error: data.error.message })
      }

      return res.json({
        success: true,
        balance: data.authorize?.balance ?? 0,
        accountType: data.authorize?.loginid ? 'real' : 'demo',
      })
    } catch {
      return res.json({ success: false, error: 'Failed to validate token with Deriv' })
    }
  } catch (error) {
    console.error('Validate token error:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// POST /api/execute-trade
app.post('/api/execute-trade', async (req: express.Request, res: express.Response) => {
  try {
    const { token, market, direction, stake, tickDuration } = req.body

    if (!token || !market || !direction || !stake) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }

    // Execute trade against Deriv API (placeholder logic)
    // In production, this would call the Deriv API to place the trade
    try {
      const tradeId = `trade-${Date.now()}`
      const isWin = Math.random() > 0.45 // Simulated win rate for demo
      const profit = isWin ? stake * 0.95 : -stake

      // Record trade in database
      await prisma.tradeSession.create({
        data: {
          sessionKey: tradeId,
          market,
          direction,
          stake,
          tickDuration: tickDuration || 2,
          netProfit: profit,
          isSimulation: true,
          result: isWin ? 'win' : 'loss',
        },
      })

      return res.json({
        success: isWin,
        tradeId,
        contractId: Math.floor(Math.random() * 1000000),
        profit,
      })
    } catch {
      return res.status(500).json({ success: false, error: 'Trade execution failed' })
    }
  } catch (error) {
    console.error('Execute trade error:', error)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API service running on port ${PORT}`)
})
