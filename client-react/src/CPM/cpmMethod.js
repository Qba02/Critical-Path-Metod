// Importuj tablicę "rows" z istniejącego pliku
// const rows = require('./yourExistingFile').rows;
//todo: validate incoming data


//first test
//Tmax = 15
//A-D-E (but there is P1 in the successor/ predecessor table)
const rowsWithApparentActivities_1 = [
    {
        activity: 'A',
        prevActivity: '',
        time: 5,
    },
    {
        activity: 'B',
        prevActivity: 'A',
        time: 3,
    },
    {
        activity: 'C',
        prevActivity: '',
        time: 4,
    },
    {
        activity: 'D',
        prevActivity: 'A',
        time: 6,
    },
    {
        activity: 'E',
        prevActivity: 'D',
        time: 4,
    },
    {
        activity: 'F',
        prevActivity: 'B,C,D',
        time: 3,
    },

];

//Should return Tmax = 49 and critical path: P1-B-C-E-F-P2-H-J-K
//second test
const rowsWithApparentActivities_2 = [
    {
        activity: 'A',
        prevActivity: '',
        time: 7,
    },
    {
        activity: 'B',
        prevActivity: '',
        time: 10,
    },
    {
        activity: 'C',
        prevActivity: 'A,B',
        time: 5,
    },
    {
        activity: 'D',
        prevActivity: 'C',
        time: 11,
    },
    {
        activity: 'E',
        prevActivity: 'C',
        time: 12,
    },
    {
        activity: 'F',
        prevActivity: 'E',
        time: 7,
    },
    {
        activity: 'G',
        prevActivity: 'C',
        time: 7,
    },
    {
        activity: 'H',
        prevActivity: 'D,F,G',
        time: 5,
    },
    {
        activity: 'I',
        prevActivity: 'D,F',
        time: 6,
    },
    {
        activity: 'J',
        prevActivity: 'H',
        time: 5,
    },
    {
        activity: 'K',
        prevActivity: 'I,J',
        time: 5,
    }
]

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

    //dodajemy czynnosci pozorne jesli wystepuja
    let dummyActivityCounter = 1;

    rows.forEach(row => {
        const predecessors = row.prevActivity.split(',').map(a => a.trim());
        if (predecessors.length >= 2) {
            for (let i = 0; i < predecessors.length; i++) {
                for (let j = i + 1; j < predecessors.length; j++) {
                    const predecessor1 = predecessors[i];
                    const predecessor2 = predecessors[j];

                    let commonPredecessors = [];
                    if (rows.filter(r => r.activity === predecessor1 && r.prevActivity === '').length > 0 && rows.filter(r => r.activity === predecessor2 && r.prevActivity === '').length > 0) {
                        commonPredecessors.push('NO_PREDECESSORS');
                    } else {
                        commonPredecessors = rows.filter(r => r.activity === predecessor1 || r.activity === predecessor2)
                            .map(r => r.prevActivity.split(',').map(a => a.trim()))
                            .reduce((a, b) => a.filter(c => b.includes(c)));
                    }

                    if(commonPredecessors[0] === 'NO_PREDECESSORS'){
                        const dummyActivity = `P${dummyActivityCounter++}`;
                        const minPredecessor = predecessor1 < predecessor2 ? predecessor1 : predecessor2;
                        rows.find(r => r.activity === minPredecessor).prevActivity = dummyActivity;
                        rows.push({ activity: dummyActivity, prevActivity: '', time: 0 });
                    }
                    else if (commonPredecessors.length > 0) {
                        //bledna logika
                        const dummyActivity = `P${dummyActivityCounter++}`;
                        const maxPredecessor = predecessor1 > predecessor2 ? predecessor1 : predecessor2;
                        row.prevActivity = row.prevActivity.split(',').map(a => a.trim() === maxPredecessor ? dummyActivity : a).join(',');
                        rows.push({ activity: dummyActivity, prevActivity: commonPredecessors.join(','), time: 0 });
                    }
                }
            }
        }
    });





    activities.forEach((activity) => {
        if (activity.prevActivity === '') {
            activity.ES = 0;
            activity.EF = activity.time;
        } else {
            const prevActivities = activity.prevActivity.split(','); // Rozdziel poprzednie czynnosci
            activity.ES  = Math.max(...prevActivities.map(prev => activities.find(a => a.activity === prev).EF)); // Maksimum z EF poprzednich czynnsści
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
            activity.LF = Math.min(...successorsLS);
        }

        activity.LS = activity.LF - activity.time;
    });

    activities.forEach(activity => {
        activity.slack = activity.LF - activity.EF;
    });

    return activities;
};

const findCriticalPath = (cpmActivitiesTable) => {
    let paths = [];
    let criticalPaths = [];

    // Sortujemy tablice w kolejnosci od konca do poczatku
    cpmActivitiesTable.sort((a, b) => b.LF - a.LF);

    // Znajdujemy maksymalne LF
    let maxLF = cpmActivitiesTable[0].LF;

    // Inicjalizujemy sciezki startowe
    cpmActivitiesTable.forEach(activity => {
        if (activity.slack === 0 && activity.LF === maxLF) {
            paths.push([activity]);
        }
    });

    // Przechodzimy przez wszystkie sciezki
    while (paths.length > 0) {
        let path = paths.pop();
        let lastActivityInPath = path[path.length - 1];
        let predecessors = lastActivityInPath.prevActivity.split(',');

        // Sprawdzamy poprzednikow
        let predecessorActivities = predecessors.map(predecessor => cpmActivitiesTable.find(a => a.activity === predecessor)).filter(a => a && a.slack === 0);

        if (predecessorActivities.length === 0) {
            // Jesli nie ma poprzedniksw, dodajemy sciezke do sciezek krytycznych
            criticalPaths.push(path);
        } else if (predecessorActivities.length === 1) {
            // Jesli jest tylko jeden poprzednik, kontynuujemy ta sciezke
            // dodajemy aktywnosc na sciezce i cala sczeżke do paths
            path.push(predecessorActivities[0]);
            paths.push(path);
        } else {
            // Jesli jest wiecej niz jeden poprzednik, tworzymy nowe sciezki
            predecessorActivities.forEach(predecessorActivity => {
                let newPath = [...path, predecessorActivity];
                paths.push(newPath);
            });
        }
    }

    // Obliczamy czas dla kazdej sciezki krytycznej
    let maxTime = 0;
    let criticalPath;

    criticalPaths.forEach(path => {
        let pathTime = path.reduce((sum, activity) => sum + activity.time, 0);
        if (pathTime > maxTime) {
            maxTime = pathTime;
            criticalPath = path;
        }
    });

    // Odwracamy sciezke krytyczna, aby była w odpowiedniej kolejnosci
    criticalPath.reverse();

    return {
        criticalPath,
        maxTime
    };
};




const cpmActivities = calculateCPM(rows);

cpmActivities.forEach(activity => {
    console.log(`Activity: ${activity.activity}, time: ${activity.time}, [ES,EF] = [${activity.ES},${activity.EF}], [LS,LF] = [${activity.LS},${activity.LF}], slack: ${activity.slack}`);
})

let result = findCriticalPath(cpmActivities);
let criticalPathStr = result.criticalPath.map(activity => activity.activity).join(' -> ');

console.log(`Critical path: ${criticalPathStr}, critical time = ${result.maxTime}`);

