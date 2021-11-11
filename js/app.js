const COLORS = {
    confirmed: '#ff0000',
    recovered: '#008000',
    deaths: '#373c43',
    
    serious_critical: '#D830EB',
    new_cases: '#FF6178',
    total_cases_per_1m: '#FEBC3B'
}

const CASE_STATUS = {
    confirmed: 'confirmed',
    recovered: 'recovered',
    deaths: 'deadths',
    serious_critical: 'serious_critical',
    new_cases: 'new_cases',
    total_cases_per_1m: 'total_cases_per_1m_population'
}

let body = document.querySelector('body')

let countries_list

let summaryData

let summary_countries

window.onload = async () => {
    console.log('ready . . .')

    initCountryFilter()

    await loadData('World')

    await loadCountrySelectList()

    document.querySelector('#country-select-toggle').onclick = () => {
        document.querySelector('#country-select-list').classList.toggle('active')
    }
}

loadData = async (country) => {
    startLoading()
    
    await loadSummary(country)
       
    endLoading()

}

startLoading = () => {
    body.classList.add('loading')
}

endLoading = () => {
    body.classList.remove('loading')
}

isGlobal = (country) => {
    return country === 'World'
}

numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

numberWithCommas2 = (x) => {
    return x.replace(/,/g, '')
}

showConfirmedTotal = (total) => {
    document.querySelector('#confirmed-total').textContent = numberWithCommas(total)
}

showRecoveredTotal = (total) => {
    document.querySelector('#recovered-total').textContent = numberWithCommas(total)
}

showDeathsTotal = (total) => {
    document.querySelector('#death-total').textContent = numberWithCommas(total)
}


loadSummary = async (country) => {

    //country = slug

    summaryData = await covidApi.getSummary()
    let summary = summaryData["world_total"]

    //list name of country
    countries_list = summaryData["countries_stat"].map(e => e.country_name)
    //sort list name
    countries_list.sort((a,b) => {
        if(a < b) { return -1; }
        if(a > b) { return 1; }
        return 0
    })
    //add world select
    countries_list.unshift('World')

    summary_countries = summaryData["countries_stat"]

    if (!isGlobal(country)) {
        let summary_country = summary_countries.find(function(e) {
           return e["country_name"] === country
        })
        console.log(summary_country)

        showConfirmedTotal(summary_country["cases"])
        showRecoveredTotal(summary_country["total_recovered"])
        showDeathsTotal(summary_country["deaths"])

       
    }
    else {
        showConfirmedTotal(summary["total_cases"])
        showRecoveredTotal(summary["total_recovered"])
        showDeathsTotal(summary["total_deaths"])


    }


}


// country select
renderCountrySelectList = (list) => {
    let country_select_list = document.querySelector('#country-select-list')
    country_select_list.querySelectorAll('div').forEach(e => e.remove())
    
    list.forEach(e => {
        let item = document.createElement('div')
        item.classList.add('country-item')
        item.textContent = e.toString()

        item.onclick = async () => {
            document.querySelector('#country-select span').textContent = e.toString()
            country_select_list.classList.toggle('active')
            await loadData(e.toString())
        }
        
        country_select_list.appendChild(item)
    })
}

loadCountrySelectList = async () => {
    let country_select_list = document.querySelector('#country-select-list')

    let item = document.createElement('div')
    item.classList.add('country-item')
    item.textContent = 'World'
    item.onclick = async () => {
        document.querySelector('#country-select span').textContent = 'World'
        country_select_list.classList.toggle('active')
        await loadData('World')
    }
    country_select_list.appendChild(item)

    renderCountrySelectList(countries_list)
}

// Country filter
initCountryFilter = () => {
    let input = document.querySelector('#country-select-list input')
    input.onkeyup = () => {
        let filtered = countries_list.filter(e => e.toLowerCase().includes(input.value.toLowerCase()))
        renderCountrySelectList(filtered)
    }
}