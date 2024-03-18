import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import EditableTable from "./EditableTable";
import EditableTable2 from "./EditableTable2";

export default function MainComponent() {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '70%', typography: 'body1', color:"white", margin:"auto", marginTop:"12px"}}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 2, borderColor: 'grey', color:'white' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Czynność poprzedzająca" value="1" sx={{ color:"white"}}/>
                        <Tab label="Następstwo zdarzeń" value="2" sx={{ color:"white"}}/>
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <EditableTable/>
                </TabPanel>
                <TabPanel value="2"><EditableTable2/></TabPanel>
            </TabContext>
        </Box>
    );
}