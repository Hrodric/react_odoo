// import { useState, useEffect } from "react";
// import api from '../api';

// export const useHttp = (url) => {

//     const [dataClient, setDataCliente] = useState();
//     const [dataTareas, setDataTareas] = useState();
//     const [dataProject, setDataProject] = useState();
//     const [loadingActive, setLoadingActive] = useState();
//     const [dataCount, setDataCount] = useState(5);
//     const [selected, setSelected] = useState([]);

//     useEffect(() => {
//         setLoadingActive(true);
//         api.tareasGet().then((resp) => {
//             setDataTareas(resp);
//             var body = { customerId: 60 };

//             api.clientesGet(body).then((resp) => {
//                 setDataCliente(resp);
//             }).catch((err) => {
//                 setLoadingActive(false);
//             })

//             api.dataClienteGet(body).then((resp) => {
//                 setDataProject(resp);
//             }).catch((err) => {
//                 setLoadingActive(false);
//             })

//             setLoadingActive(false);
//         }).catch((err) => {
//             setLoadingActive(false);
//         })


//     }, []);

// }