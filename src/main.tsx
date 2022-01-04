import React, { Component } from 'react'
// import "./style/index.css"
// import 'antd/dist/antd.css';
import { HashRouter, Route, Switch, Redirect } from "react-router-dom"
import Routes from "@/router/index"
import Loadable from "@/loadable/index.tsx"
export default class button extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          {
            Routes.map(item => (
              <Route exact path={item.path} key={item.path} component={Loadable(item.component)}></Route>
            ))
          }
        </Switch>
      </HashRouter>)
  }
}
