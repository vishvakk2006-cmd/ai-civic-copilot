function SchemeCard({ scheme }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "20px",
      }}
    >
      <h2>{scheme.scheme_name}</h2>

      <p>{scheme.description}</p>

      <p>
        <b>Benefit:</b> {scheme.benefit}
      </p>

      <p>
        <b>Category:</b> {scheme.category}
      </p>

      <p>
        <b>Priority Score:</b> {scheme.priority_score}
      </p>

      <h3>Why Eligible?</h3>
      <h3>Required Documents</h3>

      <ul>
        {scheme.explanation?.map((reason, index) => (
          <li key={index}>✅ {reason}</li>
        ))}
      </ul>
    </div>
  );
}

export default SchemeCard;