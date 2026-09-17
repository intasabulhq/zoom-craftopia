const products = [
  { number: '01', name: 'Bronze Study I', type: 'Digital sculpture', price: '$1,240', tone: 'bronze' },
  { number: '02', name: 'The Silent Form', type: 'Limited edition', price: '$980', tone: 'blue' },
  { number: '03', name: 'Molten Memory', type: 'Artist proof', price: '$1,680', tone: 'ember' },
]

export default function SiteContent() {
  return (
    <main className="site-content">
      <section className="intro-section section-shell">
        <p className="section-kicker">The collection / 2026</p>
        <div className="intro-grid">
          <h2>Ancient form,<br /><em>new matter.</em></h2>
          <div className="intro-copy">
            <p>Laocoön studies the tension between permanence and motion. Each work begins as a digital gesture, then takes shape through light, material and time.</p>
            <a href="#collection">Explore the collection <span>↘</span></a>
          </div>
        </div>
      </section>

      <section className="feature-section section-shell">
        <div className="feature-visual">
          <img src="https://api.getlayers.ai/storage/v1/object/public/public/assets/laocoon-59f84455c6/1.png" alt="Editorial bronze sculpture study" />
          <span className="image-index">No. 01</span>
        </div>
        <div className="feature-copy">
          <p className="section-kicker">Featured work</p>
          <h2>Material<br />Remembers</h2>
          <p>A study of weight, reflection and the instant before movement. The surface carries every trace of its imagined making.</p>
          <dl>
            <div><dt>Material</dt><dd>Patinated bronze</dd></div>
            <div><dt>Edition</dt><dd>12 + 2 AP</dd></div>
            <div><dt>Year</dt><dd>2026</dd></div>
          </dl>
          <button type="button">View the work <span>↗</span></button>
        </div>
      </section>

      <section className="collection-section section-shell" id="collection">
        <div className="section-heading">
          <div><p className="section-kicker">Selected works</p><h2>The bronze<br />series</h2></div>
          <p>Three studies in stillness, energy and transformation.</p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.number}>
              <div className={`product-art ${product.tone}`}><span>{product.number}</span><i /></div>
              <div className="product-meta">
                <div><h3>{product.name}</h3><p>{product.type}</p></div>
                <strong>{product.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto-section">
        <div className="manifesto-orbit" aria-hidden="true"><i /><i /><i /></div>
        <p className="section-kicker">Our approach</p>
        <h2>Not a copy of the past.<br /><em>A conversation with it.</em></h2>
        <p className="manifesto-copy">We use contemporary tools to explore the emotional force of classical sculpture—preserving its gravity while allowing it to move again.</p>
      </section>

      <section className="journal-section section-shell">
        <div className="section-heading"><div><p className="section-kicker">Journal</p><h2>Notes from<br />the studio</h2></div></div>
        <div className="journal-list">
          {[
            ['Process', 'Casting light as if it were metal', '08.09.2026'],
            ['Material', 'Why bronze continues to endure', '21.08.2026'],
            ['Archive', 'Looking again at Laocoön', '02.07.2026'],
          ].map(([tag,title,date]) => <a href="#" className="journal-row" key={title}><span>{tag}</span><h3>{title}</h3><time>{date}</time><b>↗</b></a>)}
        </div>
      </section>
    </main>
  )
}

export function Footer() { return null }
