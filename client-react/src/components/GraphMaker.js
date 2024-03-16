import React from 'react';
import {darkTheme, GraphCanvas} from 'reagraph';
import dataTab from "./TmpData";

const uniqueValues = new Set();
const uniqueArray = [];

function GenerateNodes(){
    dataTab.sort((a, b) => a.slack - b.slack);
    dataTab.forEach(item => {
        if (!uniqueValues.has(item.ES)) {
                uniqueValues.add(item.ES);
                uniqueArray.push(item);
        }
    });

    const nodes = uniqueArray.map((item, index) => (
        {
        id: item.ES.toString(),
        label: "id: " + item.ES.toString(),
        // label: "id: " + (index + 1).toString(),
        subLabel: item.ES + " - " + item.slack + " - " + item.LS,
        fill: (item.slack === 0 ? '#530262' : "grey")
    }));

    dataTab.sort((a, b) => b.slack - a.slack);
    const maxElement = dataTab.reduce((max, current) => {
        return max.LF > current.LF ? max : current;
    });
    uniqueValues.add(maxElement.ES);

    const tmp = {
        id: maxElement.LF.toString(),
        label: "id: " +maxElement.LF.toString(),
        subLabel: maxElement.EF + " - " + maxElement.slack + " - " + maxElement.LF,
        fill: '#530262'
    }
    nodes.push(tmp);
    console.log(nodes);
    return nodes;
}

function GenerateEdges(){
    const edges = [];
    dataTab.forEach(item => {
        if(uniqueValues.has(item.EF)){
            edges.push({
                source: item.ES.toString(),
                target: item.EF.toString(),
                id: item.activity,
                label: item.activity + " (" + item.time.toString() + ")",
                size: (item.slack === 0 ? 6 : 2)
            });
        }else{
            edges.push({
                source: item.ES.toString(),
                target: item.LF.toString(),
                id: item.activity,
                label: item.activity + " (" + item.time.toString() + ")",
                size: (item.slack === 0 ? 6 : 2),
            });
        }
    })
    return edges;
}

// function GenerateEdges(){
//     const edges = [];
//     dataTab.forEach(item => {
//         const prevNumber = item.prevActivity.length;
//         if( prevNumber === 1){
//             edges.push({
//                 source: item.ES.toString(),
//                 target: item.LF.toString(),
//                 id: item.activity,
//                 label: item.time.toString()
//                 // label: item.activity + " (" + item.time.toString() + ")"
//             });
//         }else if(prevNumber > 1){
//             const prevActivitiesArray = item.prevActivity.split(',');
//             for (let i= 0; i<prevNumber ;i++){
//                 edges.push({
//                     source: prevActivitiesArray[i],
//                     target: item.LF,
//                     id: item.activity + i,
//                     label: item.time.toString()
//                 });
//             }
//         }
//     })
//     return edges;
// }

export const GraphMaker = () => {
    const nodes = GenerateNodes();
    const edges = GenerateEdges();
   return(<div style={{
       display: 'flex',
       flexWrap: 'wrap',
       height: 500,
       width: '100%',
       position: 'relative',
       margin: 'auto',
       // border:'1px solid white',
       // display:'none'+
   }}>
       <GraphCanvas
           nodes={nodes}
           edges={edges}
           labelType="all"
           theme={darkTheme}
           edgeInterpolation="curved"
           draggable
           edgeLabelPosition="above"
           layoutType="forceDirected2d"
       />
   </div>);
};