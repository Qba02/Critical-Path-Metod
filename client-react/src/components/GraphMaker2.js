import React, {useRef} from 'react';
import {darkTheme, GraphCanvas} from 'reagraph';
import dataTab from "./TmpData";

const uniqueValues = new Set();
const uniqueArray = [];

function GenerateNodes(data){
    const nodes = [];
    if(data.length===0){
        return [];
    }else {
        const dataTab = [...data];
        dataTab.sort((a, b) => a.slack - b.slack);
        dataTab.forEach(item => {
            if (!uniqueValues.has(item.source)) {
                uniqueValues.add(item.source);
                uniqueArray.push(item);
            }
        });

        const nodes = uniqueArray.map((item, index) => (
            {
                id: item.source.toString(),
                label: "id: " + item.source.toString(),
                subLabel: item.ES + " - " + item.slack + " - " + item.LS,
                fill: (item.slack === 0 ? '#530262' : "grey")
            }));

        const maxElement = dataTab.reduce((max, current) => {
            return max.target > current.target ? max : current;
        });
        nodes.push(
        {
            id: maxElement.target.toString(),
            label: "id: " +maxElement.target.toString(),
            subLabel: maxElement.EF + " - " + maxElement.slack + " - " + maxElement.LF,
            fill: '#530262'
        }
        );

        // 2 metoda
        // const maxElement = dataTab.reduce((max, current) => {
        //     return max.target > current.target ? max : current;
        // });
        // for (let i = 1; i <= maxElement.target; i++) {
        //     nodes.push({
        //         id: i.toString(),
        //         label: "id: " + i.toString(),
        //         // fill: (item.slack === 0 ? '#530262' : "grey")
        //     });
        // }

        console.log(nodes);
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
            edges.push({
                source: item.source,
                target: item.target,
                id: item.activity,
                label: item.activity + " (" + item.time.toString() + ")",
                size: (item.slack === 0 ? 6 : 2)
            });
        });

        return edges;
    }

}

export const GraphMaker2 = (props) => {
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
            layoutType="forceDirected3d"
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