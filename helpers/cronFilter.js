
function currentWeek()
{
    const today = new Date();
    // today.setHours(0, 0, 0, 0);

    const prevWeek = new Date(today);
    prevWeek.setDate(today.getDate() - 7);

    return {
        start:prevWeek,
        end:today
    }

}


function currentMonth()
{
    const today = new Date()
    // today.setHours(0,0,0,0)

    const prevMonth = new Date(today)
    prevMonth.setMonth(today.getMonth() - 1)

    return {
        start:prevMonth,
        end:today
    }
}

function currentYear()
{
    const today = new Date()
    // today.setHours(0,0,0,0)

    const prevYear = new Date(today)
    prevYear.setFullYear(today.getFullYear() - 1)

    return {
        start:prevYear,
        end:today
    }
}


function weekly()
{
    const today = new Date()

    const firstWeek = new Date(today)
    firstWeek.setDate(today.getDate() - 28)
    firstWeek.setHours(0,0,0,0)

    const secondWeek = new Date(today)
    secondWeek.setDate(today.getDate() - 21)

    const thirdWeek = new Date(today)
    thirdWeek.setDate(today.getDate() - 14)

    const fourthWeek = new Date(today)
    fourthWeek.setDate(today.getDate() - 7)
    
    return { 
        firstWeek,
        secondWeek,
        thirdWeek,
        fourthWeek,
        fifthWeek:today
    }
}

function getMonthName(index)
{
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    return months[index]
}


function monthly()
{


        const today = new Date();
        let monthdata = [];
        
        const thisMonth = today;
        
        for (let i = 11; i >= 0; i--) {
            const monthStart = new Date(thisMonth);
            const monthEnd = new Date(thisMonth);
        
            monthStart.setMonth(thisMonth.getMonth() - i);
            monthEnd.setMonth(thisMonth.getMonth() - i + 1);
            let monthName = getMonthName(monthEnd.getMonth())
            monthdata.push({
                monthName,
                monthStart,
                monthEnd
            });
        }
        

        
        return monthdata

}

function yearly()
{

    let today = new Date()
    let startYear = new Date(today)
    startYear.setFullYear(2023)
    let endYear = today
    let length = endYear.getFullYear() - startYear.getFullYear()
    let years = []
    for(let i=0; i <= length ; i++)
    {
        const yearStart = new Date(endYear)
        const yearEnd = new Date(endYear)

        yearStart.setFullYear(endYear.getFullYear() - i -1)
        yearEnd.setFullYear(endYear.getFullYear() - i )
        years.push({yearStart,yearEnd})
    }

    return years.reverse()
}

module.exports = {
    currentWeek,
    currentMonth,
    currentYear,
    weekly,
    monthly,
    yearly
}