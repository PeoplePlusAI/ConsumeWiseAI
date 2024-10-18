import logo from './peopleplusai.png';
import { useState, version } from "react";
import './App.css';
import './Tabs.css';
import Footer from './Footer.js';
import Content from './ContentTab';

function App() {
  
  // Language options for translation dropdown
  const options = [
    {value: 'english', text: 'English'},
    {value: 'hindi', text: 'Hindi'},
    {value: 'marathi', text: 'Marathi'}
  ];

  // State variables to manage input, messages, and API response data
  const [claim, setClaim] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [message, setMessage] = useState("")
  const [translationMessage, setTranslationMessage] = useState("")
  const [verdictData, setVerdictData] = useState({"verdict":"Please provide input",
  "why":["Please provide input"],
  "detailed_analysis":"Please provide input"})

  const [verdictEnglishData, setVerdictEnglishData] = useState({"verdict":"Please provide input",
  "why":["Please provide input"],
  "detailed_analysis":"Please provide input"})
  const [activeContentIndex, setActiveContentIndex] = useState("verdict");
  const [langSelected, setLangSelected] = useState("English");

  const [isDisabled, setIsDisabled] = useState(true);
  let endpoint = "https://consumewise.peopleplus.ai"

  // Handle claim form submission
  let handleSubmit = async (e) => {
    e.preventDefault();
    setLangSelected("english")
    try {
      console.log("Sending Request to Backend Claims/Analyze");
      console.log(claim)
      console.log(ingredients)
      const apiUrl = `${endpoint}:8081/claims/analyze?claim=${claim}&ingredients=${ingredients}`;
      setMessage("Request Submitted. Analyzing...");
      // console.log(`Api command sent to ${apiUrl}`)
      
      const response = await fetch(apiUrl,{
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            // Additional headers if needed
        },
    })
      setMessage("Response Received");
      if (response.status === 200) {
        console.log("Successfully Recieved Response")
        let respData = await response.text()
        let jsondata = JSON.parse(JSON.parse(respData)) //TODO: Fi x double parsing needed
  
        // setVerdict(data.verdict)
        console.log("Setting Message")
        console.log(jsondata)
        setVerdictData(jsondata);
        setVerdictEnglishData(jsondata);
        setIsDisabled(false);
        }
        else {
          console.log(response.status)
          setMessage("Some error occured");
        }

    } catch (err) {
      setMessage("Some error occured");
      console.log(err);
    }
  };

  // Handle language change for translation
  let handleLangChange = async (event)  => {
    console.log(event.target.value);
    setLangSelected(event.target.value);

    // If English is selected, show English data without translation
    if(event.target.value === "english"){
      setVerdictData(verdictEnglishData)
    }

    try {
      console.log(`Sending Request to Backend Translate ${langSelected}`);
      
      const apiTranslateUrl = `${endpoint}:8081/translate/indic?input_val=${JSON.stringify(verdictData)}&language=${event.target.value}`;
      setTranslationMessage("Translation Request Submitted. Translating ...");
      const responseWhy = await fetch(apiTranslateUrl,{
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            // Additional headers if needed
        },
    })

    let respData = await responseWhy.text()
    console.log(JSON.parse(respData))
    let jsonTranslateData = JSON.parse(JSON.parse(respData))
    
    setVerdictData(jsonTranslateData);
    console.log(`Post setup ${langSelected}`)  
      

    } catch (err) {
      setTranslationMessage("Translation Error Occurred");
      console.log(err);
    }
    setTranslationMessage("Translated Successfully.")
  };


  return (
    <div className="App">
      
      <header className="App-header">
        <img src={logo} className="people-logo" alt="logo" />
        
        <form id="claimsForm" onSubmit={handleSubmit}>
          <input className="input_box" type="text" id="claim_input" 
          placeholder="Enter Product Claim [Healthy, Nutritional etc]"
          onChange={(e) => setClaim(e.target.value)}
          >
          </input>
          <br></br>
          <input className="input_box" type="text" id="ingredient_input" 
          placeholder="Enter Ingredients"
          onChange={(e) => setIngredients(e.target.value)}
          >
          </input>
          <br></br>
          <button type="submit">Submit</button>
        </form>
        <div className="message">{message ? <p>{message}</p> : null}</div>
     

      <div id="tabs">
        <menu>
          <button
            className={activeContentIndex === "verdict" ? "active" : ""}
            onClick={() => setActiveContentIndex("verdict")}
          >
            Verdict
          </button>
          <button
            className={activeContentIndex === "why" ? "active" : ""}
            onClick={() => setActiveContentIndex("why")}
          >
            Why?
          </button>
          <button
            className={activeContentIndex === "detailed_analysis" ? "active" : ""}
            onClick={() => setActiveContentIndex("detailed_analysis")}
          >
            Detailed Information
          </button>
        </menu>
        <div id="tab-content">
          <ul>
          <Content
          index={activeContentIndex}
          jsonData={verdictData}
          />
          </ul>
        </div>
        <div>

        <select value={langSelected} onChange={handleLangChange} disabled={isDisabled}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
      <div className="translatioMessage">{translationMessage ? <p>{translationMessage}</p> : null}</div>
        </div>
      </div>
      <Footer />
      </header>
   
    </div>
  );
}

export default App;
