import { useState, useEffect } from "react";
import "./App.css";

import { API_CONFIG_ERROR, apiUrl, checkEligibility } from "./services/api";
import { uploadDocument } from "./services/uploadApi";

import ResultsPanel from "./components/ResultsPanel";
import AIInsights from "./components/AIInsights";
import ChatBot from "./components/ChatBot";
import { generateEligibilityReport } from "./services/pdfGenerator";
import SchemeCharts from "./components/SchemeCharts";

function App() {

  const [backendMessage, setBackendMessage] = useState(API_CONFIG_ERROR);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Citizen Details
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [income, setIncome] = useState("");
  const [isLandholder, setIsLandholder] = useState("");
  const [hasBankAccount, setHasBankAccount] = useState("");

  // Documents
  const [aadhaar, setAadhaar] = useState(null);
  const [incomeCertificate, setIncomeCertificate] = useState(null);
  const [land, setLand] = useState(null);
  const [bankPassBook, setBankPassBook] = useState(null);

  // Schemes
  const [schemes, setSchemes] = useState([]);
  const [incompleteSchemes, setIncompleteSchemes] = useState([]);
  const [providedDocuments, setProvidedDocuments] = useState([]);
  const [search, setSearch] = useState("");
const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    if (API_CONFIG_ERROR) return;

    fetch(apiUrl("/healthz"))
      .then((res) => {
        if (!res.ok) throw new Error("Backend health check failed.");
        return res.json();
      })
      .then(() => setBackendMessage("Connected"))
      .catch(() => setBackendMessage("Unavailable"));

  }, []);

  function buildCitizen(overrides = {}, documents = providedDocuments) {
    const citizen = { provided_documents: documents };
    const valueFor = (field, currentValue) =>
      Object.prototype.hasOwnProperty.call(overrides, field)
        ? overrides[field]
        : currentValue;

    const ageValue = valueFor("age", age);
    if (ageValue !== "" && ageValue !== undefined && ageValue !== null) {
      citizen.age = Number(ageValue);
    }

    const incomeValue = valueFor("annual_household_income", income);
    if (incomeValue !== "" && incomeValue !== undefined && incomeValue !== null) {
      citizen.annual_household_income = Number(incomeValue);
    }

    const genderValue = valueFor("gender", gender);
    if (genderValue) citizen.gender = genderValue;

    for (const [field, currentValue] of [
      ["is_landholder", isLandholder],
      ["has_active_bank_savings_account", hasBankAccount]
    ]) {
      const value = valueFor(field, currentValue);
      if (value === true || value === "true") citizen[field] = true;
      if (value === false || value === "false") citizen[field] = false;
    }

    return citizen;
  }

  async function uploadAllDocuments() {
    const selectedDocuments = [
      [aadhaar, "Aadhaar Card"],
      [incomeCertificate, "Income Certificate"],
      [land, "Land Ownership Record"],
      [bankPassBook, "Bank Passbook"]
    ].filter(([file]) => file);

    if (selectedDocuments.length === 0) {
      setErrorMessage("Choose at least one document to upload.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setStatusMessage("");
    try {
      const extractedCitizen = {};
      const documents = [];
      const extractionNotes = [];
      for (const [file, documentType] of selectedDocuments) {
        const result = await uploadDocument(file);
        Object.assign(extractedCitizen, result.extractedData || {});
        documents.push(documentType);
        if (result.note) extractionNotes.push(result.note);
      }

      const overrides = {
        age: extractedCitizen.age ?? age,
        gender: extractedCitizen.gender ?? gender,
        annual_household_income:
          extractedCitizen.annual_household_income ?? income,
        is_landholder: extractedCitizen.is_landholder ?? isLandholder,
        has_active_bank_savings_account:
          extractedCitizen.has_active_bank_savings_account ?? hasBankAccount
      };

      if (extractedCitizen.age !== undefined) setAge(String(extractedCitizen.age));
      if (extractedCitizen.gender !== undefined) setGender(extractedCitizen.gender);
      if (extractedCitizen.annual_household_income !== undefined) {
        setIncome(String(extractedCitizen.annual_household_income));
      }
      if (extractedCitizen.is_landholder !== undefined) {
        setIsLandholder(String(extractedCitizen.is_landholder));
      }
      if (extractedCitizen.has_active_bank_savings_account !== undefined) {
        setHasBankAccount(
          String(extractedCitizen.has_active_bank_savings_account)
        );
      }

      setProvidedDocuments(documents);
      const citizen = buildCitizen(overrides, documents);
      const analyzed = await analyzeEligibility(citizen);
      if (analyzed && extractionNotes.length > 0) {
        setStatusMessage(extractionNotes.join(" "));
      }
    }
    catch (err) {
      setErrorMessage(err.message || "Document upload failed.");
    } finally {
      setIsLoading(false);
    }
  }

  async function analyzeEligibility(citizen = buildCitizen()) {
    setIsLoading(true);
    setErrorMessage("");
    setStatusMessage("");
    try {
      const result = await checkEligibility(citizen);
      setSchemes(result.schemes || []);
      setIncompleteSchemes(result.incompleteSchemes || []);
      setStatusMessage("Eligibility rules evaluated using the details provided.");
      return true;
    } catch (err) {
      setSchemes([]);
      setIncompleteSchemes([]);
      setErrorMessage(err.message || "Eligibility check failed.");
      return false;
    } finally {
      setIsLoading(false);
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

  <p>These are rule-based matches, not a guarantee of government approval.</p>

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

    <p>Rule-based recommendation only; government approval is not guaranteed.</p>

  </div>
)}

      <p><b>Backend Status:</b> {backendMessage}</p>
      {statusMessage && <p role="status">{statusMessage}</p>}
      {errorMessage && <p role="alert">{errorMessage}</p>}

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

        Land Holder
        <select
          value={isLandholder}
          onChange={(e) => setIsLandholder(e.target.value)}
        >
          <option value="">Not provided</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

      </label>

      <br /><br />

      <label>

        Active Bank Savings Account
        <select
          value={hasBankAccount}
          onChange={(e) => setHasBankAccount(e.target.value)}
        >
          <option value="">Not provided</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

      </label>

      <br /><br />
            

      <hr />
      <br /><br />
<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
<button onClick={uploadAllDocuments} className="primary-btn" disabled={isLoading}>
  {isLoading ? "Processing..." : "Upload Documents"}
</button>

      <button onClick={() => analyzeEligibility()} className="primary-btn" disabled={isLoading}>

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
      <ResultsPanel
        schemes={filteredSchemes}
        incompleteSchemes={incompleteSchemes}
      />

      <ChatBot />

    </div>

  );

}

export default App;