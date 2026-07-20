export function parseCitizenData(text) {

    const citizen = {};

    const age =
        text.match(/Age\s*:\s*(\d+)/i);

    if (age)
        citizen.age = Number(age[1]);

    const gender =
        text.match(/Gender\s*:\s*(Male|Female)/i);

    if (gender)
        citizen.gender = gender[1];

    const income =
        text.match(/Annual Household Income\s*:\s*(\d+)/i);

    if (income)
        citizen.annual_household_income =
            Number(income[1]);

    const land =
        text.match(/Land Holder\s*:\s*(Yes|No)/i);

    if (land)
        citizen.is_landholder =
            land[1].toLowerCase() === "yes";

    const bank =
        text.match(/Active Bank Savings Account\s*:\s*(Yes|No)/i);

    if (bank)
        citizen.has_active_bank_savings_account =
            bank[1].toLowerCase() === "yes";

    return citizen;

}