import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updatelib } from '../../redux/libSongs'
const Library = (props) => {
    let input = useRef(null)
    let dispatch=useDispatch()
    let [lib, setlib] = useState([])
    let [song,setsong]=useState([])
    let username=props.username
    let url = 'http://localhost:3001'
    useEffect(() => {

        fetch(`${url}/lib`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.msg)
            console.log(data.playlist)
            setlib(data.playlist || [])
        })

    }, [])



    let handleclick = () => {
        let value = input.current.value
        console.log(value)
        fetch(`${url}/lib_add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username,value })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.msg)
            console.log(data.playlist)
            setlib(data.playlist)
        })



        input.current.value = ''
    }
    let songs=(e)=>{
        let lib=e.target.innerText
        console.log('songs of lib',lib)
        fetch(`${url}/lib_song`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username,lib })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.msg)
            console.log(data.song)
            setsong(data.song)
            dispatch(updatelib(data.song))
        })
    }
    return (
        <>
            <div>
                <input ref={input} type='text' placeholder='lib'></input>
                <button onClick={handleclick}>+</button>
            </div>
            <ul>
            {lib && lib.map((value,index)=>(
                <>
                <li key={index} onClick={songs}>{value.playlist_name}</li>
                </>
            ))}
            
            </ul>
        </>
    )
}

export default Library