import axios from 'axios';
export const handleLongURL = async(longURL) => {
 try {
    const response = await axios.post(`http://localhost:5000/api/shorten?longURL=${encodeURIComponent(longURL)}`)
    console.log(response)
    return response.data.shortURL;
  } catch (error) {
    console.error('Error shortening URL:', error);
  }
}
