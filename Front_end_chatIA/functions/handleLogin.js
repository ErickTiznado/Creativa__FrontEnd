import axios from "axios";

export const handleLogin = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:3000/auth/login')
    }
}