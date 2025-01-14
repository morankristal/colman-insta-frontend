import axios from "axios";

// פונקציה לקביעת ה-URL של ה-API
function backEnv(): string {
    return process.env.NODE_ENV === 'production' ? 'https://node23.cs.colman.ac.il:80' : 'http://localhost:3000';
}

// יצירת אינסטנציה של axios
const apiClient = axios.create({
    baseURL: backEnv(),
});

export default apiClient;
