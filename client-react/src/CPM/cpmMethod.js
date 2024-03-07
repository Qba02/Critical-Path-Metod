// Importuj tablicę "rows" z istniejącego pliku
// const rows = require('./yourExistingFile').rows;
//todo: validate incoming data


const rows = [
    {
        activity: 'A',
        prevActivity: '',
        time: 5,
    },
    {
        activity: 'B',
        prevActivity: '',
        time: 7,
    },
    {
        activity: 'C',
        prevActivity: 'A',
        time: 6,
    },
    {
        activity: 'D',
        prevActivity: 'A',
        time: 8,
    },
    {
        activity: 'E',
        prevActivity: 'B',
        time: 3,
    },
    {
        activity: 'F',
        prevActivity: 'C',
        time: 4,
    },
    {
        activity: 'G',
        prevActivity: 'C',
        time: 2,
    },
    {
        activity: 'H',
        prevActivity: 'E,D,F',
        time: 5,
    }
];


const calculateCPM = (activities) => {

    activities.forEach((activity, index) => {
        if (activity.prevActivity === '') {
            activity.ES = 0;
            activity.EF = activity.time;
        } else {
            const prevActivities = activity.prevActivity.split(','); // Rozdziel poprzednie czynnosci
            const maxPrevEF = Math.max(...prevActivities.map(prev => activities.find(a => a.activity === prev).EF)); // Maksimum z EF poprzednich czynnsści
            activity.ES = maxPrevEF;
            activity.EF = activity.ES + activity.time;
        }
    });


// Tworzymy mape, w ktorej kluczem jest nazwa czynnosci, a wartoscia jest tablica jej nastepnikow
    const successorsMap = new Map();
    activities.forEach(activity => {
        const successors = activity.prevActivity.split(',').map(a => a.trim());
        successors.forEach(successor => {
            if (!successorsMap.has(successor)) {
                successorsMap.set(successor, []);
            }
            successorsMap.get(successor).push(activity.activity);
        });
    });

//wypisz sukcesorow
    console.log("Mapa successorsMap:");
    successorsMap.forEach((successors, activity) => {
        console.log(`${activity} -> ${successors.join(", ")}`);
    });


//obliczamy maksymalny czas realizacji Tmax
    const lastActivites = activities.filter(activity => {
        return !successorsMap.has(activity.activity);
    })

    const Tmax = Math.max(...lastActivites.map(activity =>
        Number(activity.EF)));

    console.log(`Tmax = ${Tmax}`);


// Obliczamy LS dla wszystkich czynnosci koncowych
    activities.forEach(activity => {
        if (!successorsMap.has(activity.activity)) {
            // Czynnsc nie ma nastepnikow, wiec jest to czynnosc koncowa
            activity.LF = Tmax;
            activity.LS = activity.LF - activity.time;
        }
    });

// Obliczamy minimum ze wszystkich czasow LS czynnosci nastepujacych po danej czynnosci, UWAGA musimy przejsc te czynnosci od konca do poczatku
    activities.slice().reverse().forEach(activity => {
        if (successorsMap.has(activity.activity)) {
            const successorsLS = successorsMap.get(activity.activity).map(s => Number(activities.find(a => a.activity === s).LS));
            console.log(successorsLS);
            activity.LF = Math.min(...successorsLS);
        }

        activity.LS = activity.LF - activity.time;
    });

    activities.forEach(activity => {
        activity.slack = activity.LF - activity.EF;
    });

    return activities;
};

const cpmActivities = calculateCPM(rows);
cpmActivities.forEach(activity => {
    console.log(`Activity: ${activity.activity}, [ES,EF] = [${activity.ES},${activity.EF}], [LS,LF] = [${activity.LS},${activity.LF}], slack: ${activity.slack}`);
})

