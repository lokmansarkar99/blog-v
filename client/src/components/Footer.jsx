import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='footer'>
      <ul className="footer__categories">
        <li> <Link to="posts/categories/CyberSecurity">Cyber Security</Link> </li>
        <li> <Link to="posts/categories/Linux">Linux</Link> </li>
        <li> <Link to="posts/categories/Server">Server</Link> </li>
        <li> <Link to="posts/categories/Networking">Networking</Link> </li>
        <li> <Link to="posts/categories/Programming">Programming</Link> </li>
        <li> <Link to="posts/categories/WebDevelopment">Web Development</Link> </li>
        <li> <Link to="posts/categories/DevOps">DevOps</Link> </li>
        <li> <Link to="posts/categories/Uncategorized"> Uncategorized</Link> </li>
       
      </ul>

      <div className="footer__copyright">
        <small>All Right Reserved &copy;Copyright CyberStack</small>
      </div>
  </footer>
  )
}

export default Footer
