import jsPDF from "jspdf";

export function generateEligibilityReport(schemes) {

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("AI Civic Copilot", 20, 20);

    doc.setFontSize(16);
    doc.text("Eligibility Report", 20, 35);

    let y = 50;

    schemes.forEach((scheme, index) => {

        doc.setFontSize(12);

        doc.text(
            `${index + 1}. ${scheme.scheme_name}`,
            20,
            y
        );

        y += 8;

        doc.text(
            `Benefit: ${scheme.benefit}`,
            25,
            y
        );

        y += 8;

        doc.text(
            `Priority Score: ${scheme.priority_score}`,
            25,
            y
        );

        y += 8;

        doc.text(
            "Rule-based potential match; final eligibility is determined by the scheme authority.",
            25,
            y,
            { maxWidth: 165 }
        );

        y += 20;

        if (y > 260) {

            doc.addPage();

            y = 20;

        }

    });

    doc.save("Eligibility_Report.pdf");

}