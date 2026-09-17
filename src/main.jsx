import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SiteContent from './SiteContent.jsx'
import './index.css'
import './site.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <section className="front-experience" aria-label="Laocoön cinematic introduction">
      <App />
    </section>
    <SiteContent />
  </>,
)
