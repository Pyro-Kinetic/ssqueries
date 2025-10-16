import {useEffect, useState} from 'react'
import axios from 'axios'

function App() {
    const [data, setData] = useState({
        userName: 'Delta',
        password: 'Delta1'
    })

    const [logData, setLogData] = useState({
        username: 'Delta',
        password: 'Delta1'
    })

    const [postUserCount, setPostUserCount] = useState(0)
    const [logInCount, setLogInCount] = useState(0)

    const logUser = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login/user', logData)
            if (response) {
                console.log('Success, user is logged in: ', response.data)
            }
        } catch (error) {
            console.log('Error logging in user: ', error)
        }
    }

    const postUser = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register/user', data);
            if (response) {
                console.log('Response from server:', response.data);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    }

    useEffect(() => {
        postUser()
    }, [postUserCount])

    useEffect(() => {
        logUser()
    }, [logInCount])

    return (
        <>
            <div onClick={() => {
                setPostUserCount(postUserCount + 1)
            }}>post user
            </div>
            <div onClick={() => {
                setLogInCount(logInCount + 1)
            }}>log user
            </div>
        </>
    )
}

export default App
