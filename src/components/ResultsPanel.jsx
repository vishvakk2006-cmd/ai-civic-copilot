function ResultsPanel({ schemes }) {

    if (!schemes || schemes.length === 0) {

        return (
            <h3>No Eligible Schemes Found</h3>
        );

    }

    return (

        <div>

            <h2>Eligible Government Schemes</h2>

            {schemes.map((scheme) => (

                <div
                    key={scheme.scheme_id}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "20px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                >

                    <h3>{scheme.scheme_name}</h3>

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

                    <p>
                        <b>Approval Probability:</b> {scheme.approval_probability}%
                    </p>

                    <p>
                        <b>AI Reason:</b> {scheme.explanation}
                    </p>

                    <hr />

                    <h4>📄 Required Documents</h4>

                    <ul>
                        {scheme.required_documents?.map((doc, index) => (
                            <li key={index}>{doc}</li>
                        ))}
                    </ul>

                    <h4>📝 Application Process</h4>

                    <ol>
                        {scheme.application_process?.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>

                    <p>

                        <b>🌐 Official Website:</b>

                        <br />

                        <a
                            href={scheme.official_website}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {scheme.official_website}
                        </a>

                    </p>

                    <p>

                        <b>⏳ Estimated Processing Time:</b>

                        {" "}

                        {scheme.estimated_processing_days} days

                    </p>

                </div>

            ))}

        </div>

    );

}

export default ResultsPanel;