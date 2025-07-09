import React from 'react'
import Library from './library'
import Main from './main'
import './page.css'
import { useSelector } from 'react-redux'

const Page = (props) => {
  let username=props.username
  let lib_song=false
 let lib_songs=useSelector((state)=>state.lib_song.value)
 console.log(lib_songs)
  return (
    <>
      <div className='page' >
        <div className='lib'>
          <Library username={username}/>
        </div>
        <div className='main'>
          {lib_song ? "sdsd":<Main />}
        </div>
      </div>
    </>
  )
}

export default Page