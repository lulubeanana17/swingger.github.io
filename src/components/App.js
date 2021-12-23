import RouterHome from './Router';
import { useEffect, useState } from "react";
import "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./App.css";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState("");
  const auth = getAuth();
  const [newsArray, setNewsArray] = useState([]);

  const newsApi = async() => {
    await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=8eddaa72e664440ebd783d3d293e9fa4`).
    then(res => res.json())
    .then((result) => setNewsArray(result.articles));
  };
 
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
        setUserObj("");
      }
      setInit(true);
    });
    newsApi();
  }, []);

  return (
    <div className='AppOutsideContainer'>
      {init ? (
        <RouterHome isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "Initializing"
      )}
      {isLoggedIn ? (
        <div className="AppContainer">
        <h4 className='AppContainerTitle'>Breaking News</h4>
        <div className="newsContainer">
          {newsArray &&
            newsArray.slice(0, 10).map((news) => (
              <div className="newsArticle">
              <a href={news.url}>
                <img
                  src={news.urlToImage}
                  alt="newsImage"
                  className="newsImage"
                />
                <p className="newsTitle">{news.title}</p>
              </a>
              </div>
            ))}
        </div>
        <footer>&copy; {new Date().getFullYear()} Swingger</footer>
      </div>
      ) : null}
    </div>
  );
}

export default App;
