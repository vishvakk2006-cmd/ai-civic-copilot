export function parseCitizen(text) {

    const citizen = {};

    const age = text.match(/Age[:\s]+(\d+)/i);

    if (age)
        citizen.age = Number(age[1]);

    const income = text.match(/Income[:\s₹]*([\d,]+)/i);

    if (income)
        citizen.annual_household_income =
            Number(
                income[1].replace(/,/g, "")
            );

    if (text.toLowerCase().includes("male"))
        citizen.gender = "Male";

    if (text.toLowerCase().includes("female"))
        citizen.gender = "Female";

    return citizen;

}