import React from 'react'
import{RouteComponentProps} from "react-router"
// import ReactDom from "react-dom"
import {Button} from "antd"
type Props={
  history:object
}
export default function index(props:RouteComponentProps) {
  return (
    <Button onClick={()=>props.history.push('/')} type='primary'>按钮</Button>
  )
}
