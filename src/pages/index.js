import React from "react"
import Layout from "components/layout"

//import my custom styles
import "./index.css"

export default () => (
  <div className="App">
    <Layout>
      <Hero />
      <hr />
      <Summary />
      <hr />
      <Projects />
      <hr />
    </Layout>
  </div>
)
