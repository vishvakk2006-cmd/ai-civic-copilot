export function extractCitizenData(filename) {

    const name = filename.toLowerCase();

    if (name.includes("aadhaar")) {

        return {
            age: 28,
            gender: "Male"
        };

    }

    if (name.includes("income")) {

        return {
            annual_household_income: 180000
        };

    }

    if (name.includes("land")) {

        return {
            is_landholder: true
        };

    }

    if (
        name.includes("bank") ||
        name.includes("passbook")
    ) {

        return {
            has_active_bank_savings_account: true
        };

    }

    return {};

}