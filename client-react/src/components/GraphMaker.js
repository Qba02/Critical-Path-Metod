import React, {useRef} from 'react';
import {darkTheme, GraphCanvas} from 'reagraph';
import dataTab from "./TmpData";

const uniqueValues = new Set();
const uniqueArray = [];

function GenerateNodes(data){
    if(data.length===0){
        return [];
    }else{
        const dataTab = [...data];
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
                subLabel: item.ES + " - " + item.slack + " - " + item.EF,
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
            subLabel: maxElement.ES + " - " + maxElement.slack + " - " + maxElement.EF,
            fill: '#530262'
        }
        nodes.push(tmp);
        // console.log(nodes);
        return nodes;
    }

}

function GenerateEdges(data){
    if(data.length===0){
        return [];
    }else{
        const dataTab = [...data];
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

export const GraphMaker = (props) => {
    const nodeRef = useRef(new Map());
    const nodes = GenerateNodes(props.dataTab);
    const edges = GenerateEdges(props.dataTab);
   return(<div style={{
       display: 'flex',
       flexWrap: 'wrap',
       height: 500,
       width: '100%',
       position: 'relative',
       margin: 'auto',
       borderTop:'1px solid grey',
       // display:'none'+
   }}>
       <GraphCanvas
           nodes={nodes}
           edges={edges}
           labelType="all"
           theme={darkTheme}
           edgeInterpolation="curved"
           edgeLabelPosition="above"
           layoutType="forceDirected2d"
           cameraMode="rotate"
           draggable
           layoutOverrides={{
               getNodePosition: id => {
                   return nodeRef.current.get(id)?.position;
               }
           }} onNodeDragged={node => {
           nodeRef.current.set(node.id, node);
       }} />
       <div style={{
           zIndex: 9,
           position: 'absolute',
           top: 15,
           right: 15
       }}

       />
   </div>);
};