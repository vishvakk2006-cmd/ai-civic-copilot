import { useState, useEffect } from "react";
import "./App.css";

import { checkEligibility } from "./services/api";
import { uploadDocument } from "./services/uploadApi";

import ResultsPanel from "./components/ResultsPanel";
import AIInsights from "./components/AIInsights";
import ChatBot from "./components/ChatBot";
import { generateEligibilityReport } from "./services/pdfGenerator";
import SchemeCharts from "./components/SchemeCharts";

function App() {

  const [backendMessage, setBackendMessage] = useState("");

  // Citizen Details
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [income, setIncome] = useState("");
  const [isLandholder, setIsLandholder] = useState(false);
  const [hasBankAccount, setHasBankAccount] = useState(false);

  // Documents
  const [aadhaar, setAadhaar] = useState(null);
  const [incomeCertificate, setIncomeCertificate] = useState(null);
  const [land, setLand] = useState(null);
  const [bankPassBook, setBankPassBook] = useState(null);

  // Schemes
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState("");
const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {

    fetch("http://localhost:5000/message")
      .then((res) => res.json())
      .then((data) => setBackendMessage(data.message))
      .catch(console.error);

  }, []);

async function uploadAllDocuments() {

    try {

        let extractedCitizen = {};

        if (aadhaar) {

            const result = await uploadDocument(aadhaar);

            console.log("AADHAAR RESULT:", result);

            extractedCitizen = {
                ...extractedCitizen,
                ...result.extractedData
            };

        }

        if (incomeCertificate) {

            const result = await uploadDocument(incomeCertificate);

            console.log("INCOME RESULT:", result);

            extractedCitizen = {
                ...extractedCitizen,
                ...result.extractedData
            };

        }

        if (land) {

            const result = await uploadDocument(land);

            console.log("LAND RESULT:", result);

            extractedCitizen = {
                ...extractedCitizen,
                ...result.extractedData
            };

        }

        if (bankPassBook) {

            const result = await uploadDocument(bankPassBook);

            console.log("BANK RESULT:", result);

            extractedCitizen = {
                ...extractedCitizen,
                ...result.extractedData
            };

        }

        console.log("FINAL EXTRACTED:", extractedCitizen);

        setAge(String(extractedCitizen.age ?? ""));
        setGender(extractedCitizen.gender ?? "");
        setIncome(String(extractedCitizen.annual_household_income ?? ""));
        setIsLandholder(Boolean(extractedCitizen.is_landholder));
        setHasBankAccount(
            Boolean(extractedCitizen.has_active_bank_savings_account)
        );

        alert("Citizen profile auto-filled from uploaded documents!");
        await analyzeEligibility();

    }

    catch (err) {

        console.error(err);

        alert("Upload failed.");

    }

}

  async function analyzeEligibility() {

    const citizen = {

      age: Number(age),

      gender,

      annual_household_income: Number(income),

      is_landholder: isLandholder,

      has_active_bank_savings_account: hasBankAccount

    };

    try {

      const result = await checkEligibility(citizen);

      setSchemes(result.schemes || []);

    }

    catch (err) {

      console.error(err);

      alert(err.message);

    }

  }
  const filteredSchemes = schemes.filter((scheme) => {

  const matchesSearch =
    scheme.scheme_name
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesCategory =
    categoryFilter === "All" ||
    scheme.category.includes(categoryFilter);

  return matchesSearch && matchesCategory;

});
const totalSchemes = filteredSchemes.length;

const averageApproval =
  filteredSchemes.length === 0
    ? 0
    : Math.round(
        filteredSchemes.reduce(
          (sum, scheme) => sum + scheme.approval_probability,
          0
        ) / filteredSchemes.length
      );

const topScheme =
  filteredSchemes.length > 0
    ? filteredSchemes[0].scheme_name
    : "None";
    const bestScheme =
  filteredSchemes.length > 0 ? filteredSchemes[0] : null;

  return (

    <div className="dashboard">

     <h1>
🇮🇳 AI Civic Copilot
</h1>

<p
style={{
textAlign:"center",
fontSize:"18px",
color:"#555"
}}
>

AI Powered Government Scheme Recommendation Platform

</p>
      <div className="section-card">

  <h2>Dashboard Summary</h2>

  <p><b>Eligible Schemes:</b> {totalSchemes}</p>

  <p><b>Average Approval Probability:</b> {averageApproval}%</p>

  <p><b>Top Recommendation:</b> {topScheme}</p>

</div>
{bestScheme && (
  <div className="section-card">

    <h2>⭐ Best Recommendation For You</h2>

    <h3>{bestScheme.scheme_name}</h3>

    <p>{bestScheme.description}</p>

    <p>
      <b>Benefit:</b> {bestScheme.benefit}
    </p>

    <p>
      <b>Approval Probability:</b> {bestScheme.approval_probability}%
    </p>

  </div>
)}

      <p>

        <b>Backend Status:</b> {backendMessage}

      </p>

      <hr />
<h2>📂 Upload Required Documents</h2>

<label><b>🪪 Aadhaar Card</b></label>
<input
  type="file"
  accept=".jpg,.jpeg,.png,.pdf"
  onChange={(e) => setAadhaar(e.target.files[0])}
/>

<br /><br />

<label><b>💰 Income Certificate</b></label>
<input
  type="file"
  accept=".jpg,.jpeg,.png,.pdf"
  onChange={(e) => setIncomeCertificate(e.target.files[0])}
/>

<br /><br />

<label><b>🌾 Land Ownership Document</b></label>
<input
  type="file"
  accept=".jpg,.jpeg,.png,.pdf"
  onChange={(e) => setLand(e.target.files[0])}
/>

<br /><br />

<label><b>🏦 Bank Passbook</b></label>
<input
  type="file"
  accept=".jpg,.jpeg,.png,.pdf"
  onChange={(e) => setBankPassBook(e.target.files[0])}
/>

      <h2>Citizen Details</h2>

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <br /><br />

      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >

        <option value="">Select Gender</option>

        <option value="Male">Male</option>

        <option value="Female">Female</option>

      </select>

      <br /><br />

      <input
        type="number"
        placeholder="Annual Household Income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />

      <br /><br />

      <label>

        <input
          type="checkbox"
          checked={isLandholder}
          onChange={(e) => setIsLandholder(e.target.checked)}
        />

        Land Holder

      </label>

      <br /><br />

      <label>

        <input
          type="checkbox"
          checked={hasBankAccount}
          onChange={(e) => setHasBankAccount(e.target.checked)}
        />

        Active Bank Savings Account

      </label>

      <br /><br />
            

      <hr />
      <br /><br />
<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
<button onClick={uploadAllDocuments} className="primary-btn">Upload Documents</button>

      <button onClick={analyzeEligibility} className="primary-btn">

        Analyze Eligibility

      </button>
      <button
  onClick={() => generateEligibilityReport(schemes)}
  className="primary-btn"
>
  Download Eligibility Report
</button>
</div>


      <AIInsights schemes={schemes} />
      <h2>Search Schemes</h2>

<input
  type="text"
  placeholder="Search Scheme..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

<br /><br />

<select
  value={categoryFilter}
  onChange={(e) => setCategoryFilter(e.target.value)}
>
  <option>All</option>
  <option>Agriculture</option>
  <option>Healthcare</option>
  <option>Education</option>
  <option>Housing</option>
  <option>Women</option>
</select>

<br /><br />

      <SchemeCharts schemes={filteredSchemes} />
      <ResultsPanel schemes={filteredSchemes} />

      <ChatBot />

    </div>

  );

}

export default App;