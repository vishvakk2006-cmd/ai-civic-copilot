import { useState, useEffect } from "react";
import "./App.css";
import { checkEligibility } from "./services/api.js";
const [schemes, setSchemes] = useState([]);

function App() {

  const [backendMessage, setBackendMessage] = useState("");
  const [showResults, setShowResults] = useState(false);


  // Document states (for future OCR integration)
  const [aadhaar, setAadhaar] = useState(null);
  const [income, setIncome] = useState(null);
  const [land, setLand] = useState(null);
  const [bankPassBook, setBankPassBook] = useState(null);


  // Citizen details
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [isLandholder, setIsLandholder] = useState(false);
  const [hasBankAccount, setHasBankAccount] = useState(false);



  const [schemes, setSchemes] = useState([]);


  useEffect(() => {

    fetch("http://localhost:5000/message")

      .then((response) => response.json())

      .then((data) => {

        setBackendMessage(data.message);

      })

      .catch((error) => {

        console.error(error);

      });

  }, []);



  return (

    <div style={{ padding: "30px" }}>


      <h1>AI Civic Copilot</h1>

      <h3>{backendMessage}</h3>


      <hr />


      <h2>Upload Documents</h2>


      <h3>Upload Aadhaar</h3>

      <input

        type="file"

        onChange={(event) =>
          setAadhaar(event.target.files[0])
        }

      />


      <br /><br />



      <h3>Upload Income Certificate</h3>

      <input

        type="file"

        onChange={(event) =>
          setIncome(event.target.files[0])
        }

      />


      <br /><br />



      <h3>Upload Land Record</h3>

      <input

        type="file"

        onChange={(event) =>
          setLand(event.target.files[0])
        }

      />


      <br /><br />



      <h3>Upload Bank Passbook</h3>

      <input

        type="file"

        onChange={(event) =>
          setBankPassBook(event.target.files[0])
        }

      />


      <br /><br />


      <hr />



      <h2>Citizen Details</h2>



      <h3>Age</h3>

      <input

        type="number"

        placeholder="Enter age"

        value={age}

        onChange={(e)=>
          setAge(e.target.value)
        }

      />



      <h3>Gender</h3>

      <select

        value={gender}

        onChange={(e)=>
          setGender(e.target.value)
        }

      >

        <option value="">
          Select Gender
        </option>

        <option value="male">
          Male
        </option>

        <option value="female">
          Female
        </option>

      </select>




      <h3>Annual Household Income</h3>

      <input

        type="number"

        placeholder="Enter income"

        value={incomeAmount}

        onChange={(e)=>
          setIncomeAmount(e.target.value)
        }

      />



      <br /><br />



      <label>

        <input

          type="checkbox"

          checked={isLandholder}

          onChange={(e)=>
            setIsLandholder(e.target.checked)
          }

        />

        {" "}Land Holder

      </label>



      <br /><br />



      <label>

        <input

          type="checkbox"

          checked={hasBankAccount}

          onChange={(e)=>
            setHasBankAccount(e.target.checked)
          }

        />

        {" "}Active Bank Account

      </label>



      <br /><br />



      <button

        className="analyze-btn"

        onClick={analyzeEligibility}

      >

        Analyze Eligibility

      </button>




      <hr />



      <h2>Uploaded Files</h2>



      <p>

        <strong>Aadhaar:</strong>{" "}

        {aadhaar ? aadhaar.name : "Not Uploaded"}

      </p>



      <p>

        <strong>Income Certificate:</strong>{" "}

        {income ? income.name : "Not Uploaded"}

      </p>



      <p>

        <strong>Land Record:</strong>{" "}

        {land ? land.name : "Not Uploaded"}

      </p>



      <p>

        <strong>Bank Passbook:</strong>{" "}

        {bankPassBook ? bankPassBook.name : "Not Uploaded"}

      </p>





      {showResults && (

        <div className="results-box">


          <h2>Eligible Schemes</h2>


          <ul>

{
schemes.map((scheme)=>(
<li key={scheme.scheme_id}>

✅ {scheme.scheme_name}

<br/>

{scheme.description}

<br/>

Priority:
{scheme.priority_score}

</li>
))
}

</ul>



          <h3>Potential Benefits</h3>

          <p>₹3,80,000</p>



          <h3>Missing Document</h3>

          <p>Land Ownership Certificate</p>



          <h3>Approval Probability</h3>

          <p>92%</p>


        </div>

      )}


    </div>

  );

}


export default App;