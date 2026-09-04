import { credits } from '../data/credits'

function Credits({ className }) {
  return (
    <aside className={className} aria-label="제작 크레딧">
      <ul className="home__credits-list">
        {credits.map((credit) => (
          <li key={credit.label} className="home__credit-item">
            <p className="home__credit-label">{credit.label}</p>
            {credit.names.map((line) => (
              <p key={line} className="home__credit-names">
                {line}
              </p>
            ))}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Credits
