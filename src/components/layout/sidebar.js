import React from "react"

import sidebarStyles from 'styles/sidebar.module.css'

const Sidebar = () => (
  <>
    <section className={ sidebarStyles.sidebar }>
      <img src="/flying-grizzly.png" alt="a flying grizzly bear" />
      <h1>Flying Grizzly</h1>
    </section>
  </>
)

export default Sidebar
