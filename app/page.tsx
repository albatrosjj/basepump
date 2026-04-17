'use client'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { coinbaseWallet } from 'wagmi/connectors'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [price, setPrice] = useState(0)
  const [change, setChange] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [phase, setPhase] = useState('play')
  const [prediction, setPrediction] = useState('')
  const [won, setWon] = useState(false)
  const [earned, setEarned] = useState(0)
  const [sdkLoaded, setSdkLoaded] = useState(false)

  useEffect(() => {
    import('@farcaster/miniapp-sdk').then(({ sdk }) => {
      sdk.actions.ready()
      setSdkLoaded(true)
    })
    fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot')
      .then(r => r.json())
      .then(d => setPrice(parseFloat(d.data.amount)))
      .catch(() => setPrice(3284))
  }, [])

  function predict(dir: string) {
    if (!isConnected) {
      connect({ connector: coinbaseWallet({ appName: 'BasePump' }) })
      return
    }
    setPrediction(dir)
    setPhase('waiting')
    setTimeout(() => {
      fetch('https://api.coinbase.com/v2/prices/ETH-USD/spot')
        .then(r => r.json())
        .then(d => {
          const newPrice = parseFloat(d.data.amount)
          const w = dir === 'up' ? newPrice > price : newPrice < price
          const pts = w ? 50 + streak * 10 : 0
          setWon(w)
          setEarned(pts)
          setPrice(newPrice)
          if (w) { setScore(s => s + pts); setStreak(s => s + 1) }
          else setStreak(0)
          setPhase('result')
        })
        .catch(() => {
          const w = Math.random() > 0.4
          const pts = w ? 50 + streak * 10 : 0
          setWon(w)
          setEarned(pts)
          if (w) { setScore(s => s + pts); setStreak(s => s + 1) }
          else setStreak(0)
          setPhase('result')
        })
    }, 10000)
  }

  function reset() {
    setPhase('play')
    setPrediction('')
  }

  const short = address ? address.slice(0, 6) + '...' + address.slice(-4) : ''

  return (
    <main style={{ minHeight: '100vh', background: '#1a0533', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      
      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF3CAC', marginBottom: '4px' }}>BasePump</div>
      <div style={{ fontSize: '11px', color: '#9B30FF', marginBottom: '16px', letterSpacing: '0.1em' }}>ETH PREDICTION · BASE MAINNET</div>

      {isConnected ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FF87' }} />
          <span style={{ fontSize: '12px', color: '#C4A0FF', fontFamily: 'monospace' }}>{short}</span>
          <button onClick={() => disconnect()} style={{ fontSize: '11px', color: '#9B30FF', background: 'none', border: 'none', cursor: 'pointer' }}>disconnect</button>
        </div>
      ) : (
        <button
          onClick={() => connect({ connector: coinbaseWallet({ appName: 'BasePump' }) })}
          style={{ marginBottom: '16px', padding: '10px 24px', background: '#0052FF', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Connect Wallet
        </button>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#2a0844', border: '2px solid #9B30FF', borderRadius: '12px', padding: '10px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFD700' }}>{score}</div>
          <div style={{ fontSize: '10px', color: '#9B30FF' }}>SCORE</div>
        </div>
        <div style={{ background: '#2a0844', border: '2px solid #9B30FF', borderRadius: '12px', padding: '10px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFD700' }}>{streak}</div>
          <div style={{ fontSize: '10px', color: '#9B30FF' }}>STREAK</div>
        </div>
      </div>

      <div style={{ background: '#2a0844', border: '2px solid #9B30FF', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '340px', textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#9B30FF', marginBottom: '6px' }}>ETH / USD · LIVE</div>
        <div style={{ fontSize: '44px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>
          {price > 0 ? '$' + price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '...'}
        </div>
        <div style={{ fontSize: '11px', color: '#9B30FF' }}>Coinbase Price Feed</div>
      </div>

      {phase === 'play' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '15px', color: '#C4A0FF', marginBottom: '16px' }}>
            {isConnected ? 'Where will ETH be in 10 minutes?' : 'Connect wallet to play'}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => predict('up')} style={{ padding: '16px 28px', background: '#00FF87', border: '3px solid #00CC6A', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', color: '#003D1F', cursor: 'pointer' }}>↑ Higher</button>
            <button onClick={() => predict('down')} style={{ padding: '16px 28px', background: '#FF3CAC', border: '3px solid #CC0080', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', color: '#3D0020', cursor: 'pointer' }}>↓ Lower</button>
          </div>
        </div>
      )}

      {phase === 'waiting' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: '#C4A0FF' }}>Locked: {prediction === 'up' ? '↑ Higher' : '↓ Lower'}</div>
          <div style={{ fontSize: '13px', color: '#9B30FF', marginTop: '8px' }}>Checking price in 10 minutes...</div>
        </div>
      )}

      {phase === 'result' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '8px' }}>{won ? '🎯' : '💥'}</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: won ? '#00FF87' : '#FF3CAC', marginBottom: '8px' }}>{won ? 'NAILED IT!' : 'REKT!'}</div>
          <div style={{ fontSize: '15px', color: '#C4A0FF', marginBottom: '16px' }}>{won ? '+' + earned + ' points' : 'No points this time'}</div>
          <button onClick={reset} style={{ padding: '14px 28px', background: '#FF3CAC', border: '3px solid #CC0080', borderRadius: '16px', fontSize: '15px', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>Pop again!</button>
        </div>
      )}

    </main>
  )
}
