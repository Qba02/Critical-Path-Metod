import * as React from 'react';
import '../css/EditableTable.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CancelIcon from '@mui/icons-material/Close';
import { Modal } from '@mui/base/Modal';
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
    randomId,
} from '@mui/x-data-grid-generator';
import PropTypes from 'prop-types';
import clsx from "clsx";
import {styled} from "@mui/material";


const initialRows = [{id: 'first', activity: '', prevActivity: '', time:0}]

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [...oldRows, { id, activity: '', prevActivity: '', time:0, isNew: true }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    return (
        <GridToolbarContainer className={"grid-toolbar"}>
            <Button color="secondary" startIcon={<AddIcon />} onClick={handleClick}>
                Dodaj rekord
            </Button>
        </GridToolbarContainer>
    );
}

export default function EditableTable() {
    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState({});

    //modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const Backdrop = React.forwardRef((props, ref) => {
        const { open, className, ...other } = props;
        return (
            <div
                className={clsx({ 'base-Backdrop-open': open }, className)}
                ref={ref}
                {...other}
            />
        );
    });

    Backdrop.propTypes = {
        className: PropTypes.string.isRequired,
        open: PropTypes.bool,
    };

    const StyledBackdrop = styled(Backdrop)`
      z-index: -1;
      position: fixed;
      inset: 0;
      background-color: rgb(0 0 0 / 0.5);
      -webkit-tap-highlight-color: transparent;
`;

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
            setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    //Z TEJ FUNKCJI TRZEBA POBRAC DANE DO GRAFU
    const getGraphData = () => {
        for (let key in rows){
            if (rows[key].time === null || rows[key].activity === "" || rows[key].prevActivity === ""){
                handleOpen();
                return;
            }else
                console.log(rows);  // TUTAJ
        }
    };

    const columns = [
        {
            field: 'activity',
            headerName: 'Czynność',
            width: 180,
            editable: true,
            cellClassName: 'column',
            headerClassName: 'header'
        },
        {
            field: 'prevActivity',
            headerName: 'Czynność poprzedzająca',
            width: 240,
            editable: true,
            cellClassName: 'column',
            headerClassName: 'header'
        },
        {
            field: 'time',
            headerName: 'Czas',
            type: 'number',
            width: 180,
            align: 'left',
            headerAlign: 'left',
            editable: true,
            cellClassName: 'column',
            headerClassName: 'header'
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Edytuj/Usuń',
            width: 100,
            cellClassName: 'actions',
            headerClassName: 'header',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: '#61dafb',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="#61dafb"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="#61dafb"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="secondary"
                    />,
                ];
            },
        },
    ];

    return (
        <>
            <Box className={"table-box"}
                sx={{
                    height: 500,
                    width: '100%',
                    '& .actions': {
                        color: '#61dafb',
                    },
                    '& .textPrimary': {
                        color: '#61dafb',
                    },
                }}
            >

                <DataGrid
                    rows={rows}
                    style={{ width:"60%"}}
                    columns={columns}
                    editMode="row"
                    hideFooter={true}
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar,
                    }}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                    }}
                />

                <Button onClick={getGraphData}  color="secondary" variant="outlined" style={{ margin: '10px' }}>
                    Wygeneruj graf
                </Button>
                <Modal
                    className={"modal"}
                    aria-labelledby="unstyled-modal-title"
                    aria-describedby="unstyled-modal-description"
                    open={open}
                    onClose={handleClose}
                    slots={{ backdrop: StyledBackdrop }}
                >
                    <div className={"alert-div"}>

                        <h2 id="unstyled-modal-title" className="modal-title" >
                            Błąd&nbsp;
                            <ErrorOutlineIcon style={{color:"red"}}/>

                        </h2>
                        <p id="unstyled-modal-description" className="modal-description">
                            Wypełnij wszystkie pola tabeli!
                        </p>
                    </div>
            </Modal>
            </Box>
        </>
    );


}