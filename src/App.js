import './App.css';
import { handleLongURL } from './frontEnd/frontEnd.api';
import { useState } from 'react';
function App() {

  let [inputValue, setInputValue] = useState('');
  let [shortURL, setShortURL] = useState('');
  const handleOnSubmit = async () => {
    let resp = await handleLongURL(inputValue);
    setShortURL(resp)
  }
  const handleOnChange = (e) => {
    setInputValue(e.target.value);
  }
  const handleRedirect = async () => {
    console.log("Redirected")
  } 
  return (
    <div className="App">
      <div className="animated-background"></div>
      <main>
        <section>
          <>
            <input className="inputForLink"
              placeholder="Enter URL"
              value={inputValue}
              onChange={handleOnChange}
              type="text" />
            <br />
            <button className="submitButton" onClick={handleOnSubmit}>Submit</button>
          </>
          <div>
          {shortURL &&
              <p>short url: <tab/>
                <a href={shortURL} target="_blank" rel="noopener noreferrer" onClick={handleRedirect}>
                  {shortURL}
                </a>
              </p>}
            </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 URL SHORTNER</p>
      </footer>
    </div>
  );
}

export default App;
