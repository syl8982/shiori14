import { Link, NavLink } from 'react-router-dom'
import { mainNavItems, subNavItems } from '../data/navigation'

function NavList({ items }) {
  return (
    <ul className="home__nav-list">
      {items.map(({ label, path }) => (
        <li key={path}>
          <NavLink to={path}>{label}</NavLink>
        </li>
      ))}
    </ul>
  )
}

function SideNav() {
  return (
    <>
      <Link to="/">
        <img
          className="home__logo"
          src="/images/title1.png"
          alt="시오:리 전시 타이틀"
        />
      </Link>
      <nav className="home__nav" aria-label="메인 메뉴">
        <div className="home__nav-group">
          <NavList items={mainNavItems} />
        </div>
        <div className="home__nav-group">
          <NavList items={subNavItems} />
        </div>
      </nav>
    </>
  )
}

export default SideNav
