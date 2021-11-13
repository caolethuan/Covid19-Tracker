const covidApi = {
    getSummary: async () => {
        return await fetchRequest(covidApiEndPoints.summary())
    }
}

const covid_api_base = 'https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/npm-covid-data/'

const covidApiEndPoints = {
    summary: () => {
        return getApiPath('')
    }
}

getApiPath = (end_point) => {
    return covid_api_base + end_point
}