import React from 'react'
import { Link } from 'react-router-dom'

export default function Button() {
  return (
    <>
  <Link to='/file'><button>File</button></Link>
  <Link to='/home'><button>Input</button></Link>
    </>
  )
}
