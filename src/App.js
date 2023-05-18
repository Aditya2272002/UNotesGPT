// Import React and other necessary modules

import { useState, useEffect } from "react";
// import "./App.css"; // Import the CSS file for styling

const App = () => {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniTitle) => {
    setCurrentTitle(uniTitle);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const API_KEY = "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";
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: value }],
        max_tokens: 100,
      }),
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(`Error from frontend ${error}`);
    }
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  const currentChat = previousChats.filter(
    (preChat) => preChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((preChat) => preChat.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniTitle, index) => (
            <li key={index} onClick={() => handleClick(uniTitle)}>
              {uniTitle}
            </li>
          ))}
        </ul>
        <nav className="name">
          <p>Made by Aditya</p>
        </nav>
      </section>

      <section className="main">
        {!currentTitle && <h1 className="logoName">UNotes</h1>}
        <ul className="feed">
          {currentChat?.map((chatMsg, index) => (
            <li key={index}>
              <p className="role">{chatMsg.role}</p>
              <p>{chatMsg.content}</p>
            </li>
          ))}
        </ul>

        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>

          <p className="info">
            Chat GPT Mar 14 Version. Free Research Preview. Our goal is to make
            AI systems more natural and safe to interact with. Your feedback
            will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
