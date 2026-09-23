import { useEffect, useState } from 'react'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'
import './App.css'

const outputModules = import.meta.glob('../amplify_outputs.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const amplifyOutputs = Object.values(outputModules)[0]
if (amplifyOutputs) Amplify.configure(amplifyOutputs)

const client = generateClient<Schema>()

function App() {
  const [signal, setSignal] = useState('')
  const [signals, setSignals] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [apiMessage, setApiMessage] = useState('Connecting to the field notes API')

  useEffect(() => {
    let isActive = true

    async function loadSignals() {
      try {
        const { data } = await client.models.Todo.list()
        if (isActive) {
          setSignals(data.map((item) => item.content).filter((content): content is string => Boolean(content)))
          setApiMessage('Live from the KonttiSRVLS API')
        }
      } catch {
        if (isActive) setApiMessage('Preview mode · connect Amplify to sync field notes')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadSignals()
    return () => { isActive = false }
  }, [])

  async function addSignal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedSignal = signal.trim()
    if (!trimmedSignal || isSending) return

    setIsSending(true)
    try {
      const { data } = await client.models.Todo.create({ content: trimmedSignal as never })
      setSignals((current) => [data?.content ?? trimmedSignal, ...current])
      setSignal('')
      setApiMessage('Signal synced to the KonttiSRVLS API')
    } catch {
      setSignals((current) => [trimmedSignal, ...current])
      setSignal('')
      setApiMessage('Signal saved in this session · Amplify sync unavailable')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="welcome-page">
      <header className="welcome-header">
        <a className="wordmark" href="#top" aria-label="KonttiSRVLS home"><span className="wordmark-mark">K</span><span>KonttiSRVLS</span></a>
        <p className="api-status"><span className={isLoading ? 'status-dot pulse' : 'status-dot'} />{apiMessage}</p>
      </header>

      <section className="welcome-content" id="top">
        <p className="eyebrow">Where nothing ever happens</p>
        <h1>Welcome to<br /><em>KonttiSRVLS.</em></h1>
        <p className="welcome-copy">A place for useful ideas, thoughtful experiments, and large changes to dissapear.</p>
        <a className="primary-link" href="#signal">Say hello <span aria-hidden="true">↓</span></a>

        <form className="signal-form" id="signal" onSubmit={addSignal}>
          <label htmlFor="signal-input">Leave a message</label>
          <div className="input-row">
            <input id="signal-input" value={signal} onChange={(event) => setSignal(event.target.value)} placeholder="Write something..." maxLength={140} />
            <button type="submit" disabled={isSending || !signal.trim()} aria-label="Send message">{isSending ? '...' : '↗'}</button>
          </div>
          <p className="form-note">Messages: {signals.length}</p>
        </form>
      </section>

      <footer><span>KonttiSRVLS</span><span>Kontti Kontterton</span></footer>
    </main>
  )
}

export default App
