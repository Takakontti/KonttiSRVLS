import './App.css'

function App() {
  return (
    <main className="welcome-page">
      <header className="welcome-header">
        <a className="wordmark" href="#top" aria-label="KonttiSRVLS home"><span className="wordmark-mark">K</span><span>KonttiSRVLS</span></a>
      </header>

      <section className="welcome-content" id="top">
        <p className="eyebrow">Where nothing ever happens</p>
        <h1>Welcome to<br /><em>KonttiSRVLS.</em></h1>
        <p className="welcome-copy">A place for useful ideas, thoughtful experiments, and large changes to dissapear.</p>
        <a className="primary-link" href="mailto:hello@konttisrvls.com">Say hello <span aria-hidden="true">↗</span></a>
      </section>

      <footer><span>KonttiSRVLS</span><span>Kontti Kontterton</span></footer>
    </main>
  )
}

export default App
