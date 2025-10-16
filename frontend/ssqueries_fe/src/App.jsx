import {useEffect, useState} from 'react'
import axios from 'axios'

function App() {
    const [data, setData] = useState({
        userName: 'Delta',
        password: 'Delta1'
    })

    const [count, setCount] = useState(0)

    function handleClick() {
        setCount(count + 1)
    }

    const postUser = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/register/user', data);
            if (response) {
                console.log('Response from server:', response.data);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    }

    useEffect(() => {
        postUser()
    }, [count])

    return (
        <div onClick={handleClick}>Working</div>
    )
}

export default App
