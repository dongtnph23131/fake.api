import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
    return (
        <div>
            <h2>BNK48 Facial Recognition App</h2>
            <li>
                <Link to="/image">Photo Input</Link>
            </li>
            <li>
                <Link to="/video">Video Camera</Link>
            </li>
        </div>
    )
}

export default HomePage