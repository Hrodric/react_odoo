import React, { useState, useEffect } from 'react';
import api from '../api';
import { Icon, Button, Input, Popup, Dimmer, Grid, Loader, Header } from 'semantic-ui-react';
import AuthenticatedHeader from './common/AuthenticatedHeader';
import Footer from './common/Footer';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import "./PartialViewClient.css";
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    }

});

const dataMock = [{
    equipo: "Equipo1",
    razonSocial: "DISTRITO AB",
    proxVenc: "Hoy",
    cantidad: "2",
    tareas: '10',
    estado: 'En conflicto',
    socio: 'Fernando',
    cuit: '78578667'
},
{
    equipo: "Equipo2",
    razonSocial: "SOCIEDAD ANONIMA",
    proxVenc: "Hoy",
    cantidad: "1",
    tareas: '6',
    estado: 'En conflicto',
    socio: 'Hugo',
    cuit: '578578578'
},
{
    equipo: "Equipo3",
    razonSocial: "SOCIEDAD AGRICOLA",
    proxVenc: "2 Dias",
    cantidad: "1",
    tareas: '3',
    estado: 'En conflicto',
    socio: 'Pepe',
    cuit: '57856757'
},
{
    equipo: "Equipo4",
    razonSocial: "SOCIEDAD RURAL",
    proxVenc: "10 Dias",
    cantidad: "3",
    tareas: '1',
    estado: 'En conflicto',
    socio: 'Juan',
    cuit: '5875875'
},
{
    equipo: "Equipo5",
    razonSocial: "EMPRESA AB",
    proxVenc: "30/06/2020",
    cantidad: "2",
    tareas: '5',
    estado: 'En conflicto',
    socio: 'Fernando',
    cuit: '5878587'
}
]

export default function PartialViewClient({ dataErrorPopup, setDataErrorPopup }) {
    const [dataClient, setDataCliente] = useState();
    const [dataTareas, setDataTareas] = useState();
    const [dataProject, setDataProject] = useState();
    const [loadingActive, setLoadingActive] = useState();
    const [dataCount, setDataCount] = useState(5);
    const [selected, setSelected] = useState([]);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = dataMock.map((n) => n.equipo);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    useEffect(() => {
        var lala = dataErrorPopup;
        setLoadingActive(true);
        api.tareasGet().then((resp) => {
            setDataTareas(resp);
            var body = { customerId: 60 };

            api.clientesGet(body).then((resp) => {
                setDataCliente(resp);
            }).catch((err) => {
                setLoadingActive(false);
            })

            api.dataClienteGet(body).then((resp) => {
                setDataProject(resp);
            }).catch((err) => {
                setLoadingActive(false);
            })

            setLoadingActive(false);
        }).catch((err) => {
            setLoadingActive(false);
        })


    }, []);

    const classes = useStyles();
    const [indexAcordion, setIndexAcordion] = useState('');

    const handleClickViewAcordion = (dataRow) => {
        if (indexAcordion === dataRow) {
            setIndexAcordion('');
        }
        else {
            setIndexAcordion(dataRow);
        }
    }

    const PopupFilters = () => {
        return <Popup className="responsive-popup-filters" trigger={ <Button disabled={ indexAcordion !== '' } primary><Icon name='tasks' /> Filtros</Button> } on='click' flowing>
            <Grid centered columns={ 3 }>
                <Grid.Column textAlign='left' className="responsive-total-width-column">
                    <Header className="paddding-top-responsive color-font-blue-light" as='h4'>Filtrar por</Header>
                    <span className="font-weight-bold">Estado</span>
                    <Grid.Row>
                        <FormControlLabel control={ <Checkbox className="padding-checks-filters" /*checked={state.checkedB} onChange={handleChange}*/ name="checkedB" color="primary" /> }
                            label="Conflicto"
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <FormControlLabel control={ <Checkbox className="padding-checks-filters" /*checked={state.checkedB} onChange={handleChange}*/ name="checkedB" color="primary" /> }
                            label="Vencido"
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <FormControlLabel control={ <Checkbox className="padding-checks-filters" /*checked={state.checkedB} onChange={handleChange}*/ name="checkedB" color="primary" /> }
                            label="Pendiente"
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <FormControlLabel control={ <Checkbox className="padding-checks-filters" /*checked={state.checkedB} onChange={handleChange}*/ name="checkedB" color="primary" /> }
                            label="Hecho"
                        />
                    </Grid.Row>
                    <Grid.Row className="display-media-big-resposive">
                        <Button primary style={ { marginTop: 35 } }><Icon name='check' /> Aplicar</Button>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column textAlign='left' className="responsive-total-width-column">
                    <Header style={ { marginBottom: 33 } } className="paddding-top-responsive display-media-big-resposive" as='h4'></Header>
                    <span className="font-weight-bold">Asignado</span>
                    <Grid.Row>
                        <FormControlLabel control={ <Checkbox className="padding-checks-filters" /*checked={state.checkedB} onChange={handleChange}*/ name="checkedB" color="primary" /> }
                            label="Todos"
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <FormControlLabel control={ <Checkbox className="padding-checks-filters" /*checked={state.checkedB} onChange={handleChange}*/ name="checkedB" color="primary" /> }
                            label="A mi"
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <FormControlLabel control={ <Checkbox className="padding-checks-filters" /*checked={state.checkedB} onChange={handleChange}*/ name="checkedB" color="primary" /> }
                            label="Mi equipo"
                        />
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column textAlign='left' className="responsive-total-width-column">
                    <Header style={ { marginBottom: 33 } } className="paddding-top-responsive display-media-big-resposive" as='h4'></Header>
                    <span className="font-weight-bold">Vencimiento</span>
                    <Grid.Row>
                        <FormControlLabel control={ <Checkbox className="padding-checks-filters" /*checked={state.checkedB} onChange={handleChange}*/ name="checkedB" color="primary" /> }
                            label="Pr&oacute;x. Semana"
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <FormControlLabel control={ <Checkbox className="padding-checks-filters" /*checked={state.checkedB} onChange={handleChange}*/ name="checkedB" color="primary" /> }
                            label="Pr&oacute;x. Mes"
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <FormControlLabel control={ <Checkbox className="padding-checks-filters" /*checked={state.checkedB} onChange={handleChange}*/ name="checkedB" color="primary" /> }
                            label="Vencidas"
                        />
                    </Grid.Row>
                    <Grid.Row className="display-media-small-resposive">
                        <Button primary><Icon name='check' /> Aplicar</Button>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        </Popup>
    }

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const TableRowClient = ({ item }) => {
        const isItemSelected = isSelected(item.equipo);
        return <>
            <TableRow key={ item.equipo }>

                <TableCell className="letter-body-table not-padding-table-task">
                    <Checkbox onClick={ (event) => handleClick(event, item.equipo) } className="no-padding-checkbox" checked={ isItemSelected } color="primary" />
                    { item.equipo === 'Equipo1' &&
                        <span className="style-imp-task">IMP</span>
                    }
                    { item.equipo === 'Equipo2' &&
                        <span className="style-sue-task">SUE</span>
                    }
                    { item.equipo === 'Equipo3' &&
                        <span className="style-aud-task">AUD</span>
                    }
                    { item.equipo !== 'Equipo3' &&
                        <span className="style-aud-task">AUD</span>
                    }
                </TableCell>
                <TableCell className="letter-body-table">{ item.razonSocial }</TableCell>
                <TableCell className="letter-body-table">
                    { item.proxVenc === 'Hoy' &&
                        <span className="style-one-day-task">{ item.cantidad }</span>
                    }
                    { item.proxVenc === '2 Dias' &&
                        <span className="style-three-day-task">{ item.cantidad }</span>
                    }
                    { item.proxVenc === '10 Dias' &&
                        <span className="style-ten-day-task">{ item.cantidad }</span>
                    }
                    { item.proxVenc != 'Hoy' && item.proxVenc != '10 Dias' && item.proxVenc != '2 Dias' &&
                        <span className="style-rest-day-task">{ item.cantidad }</span>
                    }
                    { item.proxVenc }
                </TableCell>

                { indexAcordion === item.equipo
                    ?
                    <TableCell colSpan={ 4 }>{ item.tareas } <a className="text-underline-blue" style={ { marginLeft: 10 } }>Ver todas</a></TableCell>
                    :
                    <>
                        <TableCell className="letter-body-table">{ item.tareas }</TableCell>
                        <TableCell className="letter-body-table"><span className="style-one-day-task">{ item.cantidad }</span>{ item.estado }</TableCell>
                        <TableCell className="letter-body-table">{ item.socio }</TableCell>
                        <TableCell className="letter-body-table">{ item.cuit }</TableCell>
                    </>
                }
                <TableCell>  {
                    indexAcordion === item.equipo ?
                        <Icon onClick={ () => handleClickViewAcordion(item.equipo) } className="change-color-hover-chevron" name='chevron up' /> :
                        <Icon onClick={ () => handleClickViewAcordion(item.equipo) } className="change-color-hover-chevron" name='chevron down' /> }</TableCell>
            </TableRow>
            {
                indexAcordion === item.equipo &&
                <TableRowTasks item={ item } />
            }
        </>
    }

    const TableRowTasks = ({ item }) => {
        return <TableRow>
            <TableCell colSpan={ 8 }>
                <TableContainer component={ Paper }>
                    <Table className={ classes.table } aria-label="spanning table">
                        <TableHead>
                            <TableRow colSpan={ 6 }>
                                <TableCell colSpan={ 6 }>
                                    <Button primary><Icon name='file text outline' /> Documentos</Button>
                                    <Button primary><Icon name='send' /> Mail</Button>
                                    <Button primary><Icon name='calendar outline' /> Calendario</Button>
                                    <Button primary><Icon name='add' /> Tarea</Button>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableHead>
                            <TableRow>
                                <TableCell className="letter-title-table">TAREA</TableCell>
                                <TableCell className="letter-title-table">VENCIMIENTO</TableCell>
                                <TableCell className="letter-title-table">ESTADO</TableCell>
                                <TableCell className="letter-title-table">DEADLINE</TableCell>
                                <TableCell className="letter-title-table">ASIGNADA A</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={ item.equipo }>
                                <TableCell className="letter-body-table" style={ { padding: 0 } }><Checkbox color="primary" />Tarea</TableCell>
                                <TableCell className="letter-body-table no-padding-checkbox">Vencimiento</TableCell>
                                <TableCell className="letter-body-table no-padding-checkbox">Estado</TableCell>
                                <TableCell className="letter-body-table no-padding-checkbox">Deadline</TableCell>
                                <TableCell className="letter-body-table no-padding-checkbox">Facundo Banno</TableCell>
                                <TableCell className="letter-body-table no-padding-checkbox"><span><a><Icon name='external alternate' /></a><a className="text-underline-blue">Abrir</a></span></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </TableCell>
        </TableRow>
    }


    function find_duplicate_in_array(arra1) {
        const object = {};
        const result = [];

        arra1.forEach(item => {
            if (!object[item])
                object[item] = 0;
            object[item] += 1;
        })

        for (const prop in object) {
            if (object[prop] >= 2) {
                result.push(prop);
            }
        }
        return result;
    }

    function clickTest() {
        var lala = dataClient;
        var lala2 = dataTareas;
        var lala3 = dataProject;
        debugger;
    }

    return (
        <div>
            <AuthenticatedHeader />
            <div style={ { margin: 50 } }>
                { loadingActive ?
                    <Dimmer active inverted className="loader-size">
                        <Loader size='big'>Cargando...</Loader>
                    </Dimmer>
                    :
                    <>
                        <TableContainer component={ Paper } id="color-letter-table-tasks">
                            <Table className={ classes.table } aria-label="spanning table">
                                <TableHead>
                                    <TableRow colSpan={ 8 }>
                                        <TableCell colSpan={ 8 } className="not-border-bottom">
                                            <span className="size-font-tarea"><b>Tareas</b></span>
                                            <Input icon='search' placeholder='Buscar' style={ { marginLeft: 60, marginRight: 30, width: '25%' } } />
                                            <PopupFilters />
                                            <Button onClick={ clickTest } disabled={ indexAcordion !== '' } primary><Icon name='file text outline' /> Documentos</Button>
                                            <Button disabled={ indexAcordion !== '' } primary><Icon name='send' /> Mail</Button>
                                            <Button disabled={ indexAcordion !== '' } primary><Icon name='calendar outline' /> Calendario</Button>
                                            <Button disabled={ indexAcordion !== '' } primary><Icon name='add' /> Tarea</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableHead className="color-letter-inTable">
                                    <TableRow>
                                        <TableCell className="letter-title-table not-padding-table-task">
                                            <Checkbox
                                                checked={ dataCount > 0 && selected.length === dataCount }
                                                onChange={ handleSelectAllClick }
                                                inputProps={ { 'aria-label': 'select all desserts' } }
                                                color="primary"
                                            />
                                            <b>EQUIPO</b></TableCell>
                                        <TableCell className="letter-title-table"><b>RAZ&Oacute;N SOCIAL</b></TableCell>
                                        <TableCell className="letter-title-table"><b>PROX VENC</b></TableCell>
                                        <TableCell className="letter-title-table"><b>TAREAS</b></TableCell>
                                        <TableCell className="letter-title-table"><b>ESTADO</b></TableCell>
                                        <TableCell className="letter-title-table"><b>SOCIO</b></TableCell>
                                        <TableCell className="letter-title-table"><b>CUIT</b></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                { !loadingActive &&
                                    <TableBody>
                                        { dataMock.map((item) => (
                                            <TableRowClient key={ item.equipo } item={ item } />
                                        )) }
                                    </TableBody>
                                }
                            </Table>
                        </TableContainer>
                        <Grid style={ { marginTop: 15 } }>
                            <Grid.Column id="responsive-selected-pagination" width={ 5 }>
                                <span className="letter-body-table">1 de 30 Seleccionados</span>
                            </Grid.Column>
                            <Grid.Column id="responsive-pagination" style={ { textAlign: 'center' } } width={ 11 }>
                                <Pagination count={ 10 } />
                            </Grid.Column>
                        </Grid>
                    </>
                }
            </div >
        </div >
    );
}