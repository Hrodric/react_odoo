//Este server.js es el que corresponde al backend; express - nodejs
//Acá van cargados todos los controllers que manipulan la api de odoo; por eso en vez de cada
//petición get o post en realidada iría cargada la ruta al controller.

//Estado de los endpoints: en desarrollo.

const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const Odoo = require('odoo-xmlrpc')

app.listen(port, () => console.log(`Listening on port ${port}`))

const odoo = new Odoo({
  url: 'http://ec2-3-81-45-27.compute-1.amazonaws.com:8069',
  db: 'Mondu_Contable1',
  username: 'braian@remixcom.com',
  password: 'ExoRemix'
})

const dataCustomer = [];

app.get('/projectsByClient', async (req, res) => {

  // let inParams = []
  // let domain = [['active', '=', true]]
  // inParams.push(domain)
  let params = []
  // params.push(inParams)
  params.push({
    domain: ['active', '=', true],
    is_company: true,
    fields: ['id', 'name', 'display_name', 'create_date'],
    offset: 0,
    limit: 5
  });
  await odoo.execute_kw('res.partner', 'search_read', params, function (err, value) {
    if (err) { return console.log(err) }
    console.log(value)

    var inParams = [];
    // inParams.push(req.body.ids); //ids
    inParams.push(['partner_id', 'task_id', '']); //Proyectos
    var params = [];
    params.push(inParams);
    odoo.execute_kw('project.project','read',params,(err, vals) => {
        if (err) {return console.log(err);}
        console.log()
        res.send(vals); //Todo: pasar a las props
      },
    );
  })
});

// app.post('/updateTaskName', async (req, res) => {
//   console.log(req.body);
//   var inParams = [];
//   inParams.push([
//     ['sale_line_id', '=', req.body.orderLineId]
//   ]);
//   inParams.push(['name', 'project_id', 'partner_id', 'stage_id']); //fields
//   inParams.push(0); //offset
//   inParams.push(100); //limit
//   var params = [];
//   params.push(inParams);
//   await OdooService.execute_kw(
//     'project.task',
//     'search_read',
//     params,
//     async (err, value) => {
//       if (err) {
//         return console.log(err);
//       }
//       console.log(value);
//       var inParams = [];
//       inParams.push(parseInt(value[0].id)); //id to update
//       inParams.push({
//         name: req.body.cliente.parent_id[1] + ', ' + req.body.cliente.name,
//       });
//       var params = [];
//       params.push(inParams);
//       await OdooService.execute_kw(
//         'project.task',
//         'write',
//         params,
//         (err, value) => {
//           if (err) {
//             return console.log(err);
//           }
//           console.log(value);
//           res.send({
//             result: value
//           });
//         },
//       );
//     },
//   );
// });
  app.get('/partners', (req, res) => {
    odoo.connect(function (err) {
      if (err) { return console.log(err) }
      console.log('Connected to Odoo server.')
      let inParams = []
      let domain = [['active', '=', true]]
      inParams.push(domain)
      let params = []
      params.push(inParams)
      params.push({   fields: ['id', 'name', 'display_name', 'email'], limit: 5 })
      odoo.execute_kw('res.partner', 'search_read', params, function (err, value) {
        if (err) { return console.log(err) }
        res.send({ partners: value })
        console.log(value)
      })
    })
  })


app.get('/partners2', (req, res) => {
    odoo.connect(function (err) {
        if (err) { return console.log(err); }
        console.log('Connected to Odoo server.');

        let inParams = [];
        inParams.push([['active', '=', true]]);
        inParams.push(['id', 'name', 'display_name', 'email']); //fields
        inParams.push(0); //offset
        inParams.push(5); //limit

        let params = [];
        params.push(inParams);
        odoo.execute_kw('res.partner', 'search_read', params, function (err, value) {
            if (err) { return console.log(err) }
            console.log('Result: ', value)
            res.send({partners: value})
        })
    })
})  

  app.get('/aulas', (req, res) => {
    odoo.connect(function(err) {
      if (err) {return console.log(err)}
      console.log('Connected to Odoo server.')

      let inParams = []
      let domain = []
      inParams.push(domain)
      let params = []
      params.push(inParams)
      params.push({ fields: ['id','x_nombre','x_capacidad','create_date'], limit: 5 })
      odoo.execute_kw('x_aulas', 'search_read', params, function(err, value) {
        if (err) {
          return console.log(err)
        }
        console.log(value)
        res.send({aulas: value})
      })
    })
  })

app.get('/aulas2', (req, res) => {
    odoo.connect(function (err) {
        if (err) { return console.log(err); }
        console.log('Connected to Odoo server.');

        var inParams = [];
        // inParams.push([['is_company', '=', true]]);
        inParams.push(['x_nombre','x_capacidad','x_create_date']); //fields
        inParams.push(0); //offset
        inParams.push(5); //limit
        var params = [];
        params.push(inParams);
        odoo.execute_kw('x_aulas', 'search_read', params, function (err, value) {
            if (err) { return console.log(err); }
            console.log('Result: ', value);
        });
    }); 
}) 

app.get('/projects', (req, res) => {
  odoo.connect(function (err) {
    if (err) { return console.log(err);}
    console.log('Connected to Odoo server');

    let inParams = [];
    inParams.push(['active', '=', true]);
    let params = [];
    params.push(inParams);
    odoo.execute_kw('project.task', 'read', params, function (err, value) {
      if (err) {
        return console.log(err);
      }
      let inParams = [];
      inParams.push(value); //ids
      inParams.push(['task_ids', 'user_id', 'partner_id', 'task_count'/*, 'date_deadline'*/]);
      var params = [];
      params.push(inParams);
      odoo.execute_kw('project.project', 'search_read', params, function (err2, dataCustomer){
        if (err2) {
          return console.log(err2);
        }
      })
      console.log(dataCustomer);
    })
  })
});

app.get('/projects3', (req, res) => {
  odoo.connect(function (err) {
    if (err) { return console.log(err) }
    console.log('Connected to Odoo server.')
    let inParams = []
    let domain = [['active', '=', true]]
    inParams.push(domain)
    let params = []
    params.push(inParams)
    params.push({ fields: ['id', 'name'], limit: 5 })
    odoo.execute_kw('project.project', 'search_read', params, function (err, value) {
      if (err) { return console.log(err) }
      res.send({ partners: value })
      console.log(value)
    })
  })
})

// const projectsData = [];
// const tasksData = [];


app.get('/projects2', (req, res) => {
  odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    let inParams = [];
    inParams.push(['active', '=', true]);
    inParams.push(['name']); //fields
    inParams.push(0); //offset
    inParams.push(5); //limit
    let params = [];
    params.push(inParams);
    odoo.execute_kw('project.project', 'search', params, function (err, projectsData) {
      if (err) { return console.log(err) }
      console.log('Result: ', projectsData)
      
      let inParams = [];
      inParams.push({
        project_id: projectsData.project_id,
      });
      console.log(inParams);
      let params = [];
      params.push(inParams);
      odoo.execute_kw('project.task', 'search_read', params, function (err2, tasksData) {
          if (err) {
            return console.log(err2);
          }
          console.log('Result: ', tasksData);

        },
      );
    })
  })
}) 

app.get('/workflow', (req, res) => {
  odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['customer', '=', true]]);
    inParams.push([
        'property_account_receivable',
        'property_payment_term',
        'property_account_position']); //fields
    inParams.push(0); //offset
    inParams.push(1); //limit
    var params = [];
    params.push(inParams);
    odoo.execute_kw('res.partner', 'search_read', params, function (err, value) {
        if (err) { return console.log(err); }
        var inParams = [];
        inParams.push({
            'partner_id': value[0]['id'],
            'account_id': value[0]['property_account_receivable'][0],
            'invoice_line': [0, 'False', {'name': "AAA"}]
        });
        var params = [];
        params.push(inParams);
        odoo.execute_kw('account.invoice', 'create', params, function (err2, value2) {
            if (err2) { return console.log(err2); }
            var params = [];
            params.push(value2);
            odoo.exec_workflow('account.invoice', 'invoice_open', params, function (err3, value3) {
                if (err3) { return console.log(err3); }
                console.log('Result: ' + value3);
            });
        });
    });
});
})


//COMO CONCATENAR CONSULTAS
// app.post('/getGrupoFamiliarContactos', async (req, res) => {
//   console.log(req.body);
//   var inParams = [];
//   inParams.push(req.body.ids); //ids
//   inParams.push([
//     'name',
//     'country_id',
//     'type',
//     'company_type',
//     'comment',
//     'parent_id',
//     'main_id_number',
//     'title',
//     'email',
//     'street',
//     'mobile',
//     'phone', //Field added
//     'fax',
//     'category_id', //Field added: Tags
//   ]); //fields
//   var params = [];
//   params.push(inParams);
//   await odoo.execute_kw(
//     'res.partner',
//     'read',
//     params,
//     (err, gruposfamiliares) => {
//       if (err) {
//         return console.log(err);
//       }
//       console.log(gruposfamiliares);
//       var inParams = [];
//       inParams.push({
//         parent_id: gruposfamiliares.parent_id, //Todo: array
//         category_id: gruposfamiliares.category_id,
//       });
//       console.log(inParams);
//       var params = [];
//       params.push(inParams);
//       await odoo.execute_kw(
//         'res.partner.category',
//         'search_read',
//         params,
//         function (err, tags) {
//           if (err) {
//             return console.log(err);
//           }
//           console.log('Result: ', tags);
//           res.send({ category_id: tags, });
//         },
//       );
//     });
// });


//  Todo: COPIA DE PROYECTO DEL IFEI <<ALE>>

// const Container = require('typedi').Container;
// const OdooService = Container.get('OdooService');
// const NeptunoService = Container.get('NeptunoService');
// var validator = require("email-validator");

// module.exports = app => {
//   app.post('/login', async (req, res) => {
//     console.log(req.body);
//     var inParams = [];
//     inParams.push([
//       ['name', '=', req.body.dni]
//     ]);
//     var params = [];
//     params.push(inParams);

//     OdooService.execute_kw(
//       'res.partner.id_number',
//       'search_read',
//       params,
//       (err, results) => {
//         console.log(results);
//         if (err) {
//           res.status(500).send(err);
//           return;
//         }
//         if (results === undefined) {
//           res.status(404).send({
//             message: 'User not found',
//           });
//           return;
//         }
//         console.log(results);
//         if (results[0] !== undefined) {
//           console.log(results[0]);
//           let ret = {
//             id: results[0].partner_id[0],
//             nombre: results[0].partner_id[1],
//             token: results[0].partner_id[0],
//           };
//           res.send(ret);
//         }
//       },
//     );
//   });

//   app.get('/getPartner', async (req, res) => {
//     var inParams = [];
//     inParams.push([
//       ['id', '=', req.query.id]
//     ]);
//     inParams.push([
//       'name',
//       'country_id',
//       'comment',
//       'parent_id',
//       'title',
//       'email',
//       'street',
//       'mobile',
//       'fax',
//     ]); //fields
//     inParams.push(0); //offset
//     inParams.push(5); //limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner',
//       'search_read',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         res.send(value[0]);
//       },
//     );
//   });

//   app.post('/updatePartner', async (req, res) => {
//     console.log(req.body);
//     var inParams = [];
//     inParams.push([req.body.partner.id]); //id to update
//     inParams.push({
//       name: req.body.partner.nombre,
//       email: req.body.partner.email,
//       phone: req.body.partner.phone,
//       main_id_number: req.body.main_id_number,
//       main_id_category_id: req.body.main_id_category_id,
//       mobile: req.body.partner.celular,
//       street: req.body.partner.direccion,
//     });
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner',
//       'write',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log(value);
//         res.send(value);
//       },
//     );
//   });

//   app.post('/search', async (req, res) => {
//     console.log(req.body);
//     var inParams = [];
//     inParams.push([
//       ['name', 'ilike', '%' + req.body.searchTerm + '%']
//     ]);
//     console.log(inParams);
//     inParams.push(['name', 'parent_id', 'title', 'title', 'main_id_number']); //fields
//     inParams.push(0); //offset
//     inParams.push(100); //limit
//     var params = [];
//     params.push(inParams);
//     console.log("--------Search res:" + inParams);
//     await OdooService.execute_kw(
//       'res.partner',
//       'search_read',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log(value);
//         res.send(value);
//       },
//     );
//   });

//   app.post('/updateStudent', async (req, res) => {
//     console.log(req.body);
//     var inParams = [];
//     inParams.push([req.body.student.id]); //id to update
//     inParams.push({
//       name: req.body.student.name,
//       email: req.body.student.email,
//       fax: req.body.student.fax,
//       mobile: req.body.student.mobile, //ToDo: to modify in order to alter views related to phone/mobile field 2.
//     });
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner',
//       'write',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log(value);
//         res.send(value);
//       },
//     );
//   });

//   app.get('/getStudents', async (req, res) => {
//     console.log(req.query.id);
//     var inParams = [];
//     inParams.push([
//       ['parent_id', '=', Number(req.query.id)],
//       ['title', '=', 100],
//     ]);
//     inParams.push([
//       'name',
//       'country_id',
//       'comment',
//       'parent_id',
//       'title',
//       'email',
//       'main_id_number',
//       'street',
//       'mobile',
//       'fax',
//     ]); //fields
//     inParams.push(0); //offset
//     inParams.push(5); //limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner',
//       'search_read',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log(value);
//         res.send(value);
//       },
//     );
//   });

//   app.get('/getGrupoFamiliar', async (req, res) => {
//     var inParams = [];
//     inParams.push(parseInt(req.query.id)); //ids
//     inParams.push([
//       'name',
//       'country_id',
//       'comment',
//       'street',
//       'phone',
//       'mobile',
//       'email',
//       'child_ids',
//       'main_id_number',
//       'sale_order_ids',
//       'x_neptuno_id',
//     ]); //fields
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner', 'read', params,
//       function (err2, value) {
//         if (err2) {
//           return console.log(err2);
//         }
//         for (let i = 0; i < value.length; i++) {
//           let object = value[i];
//           for (var property in object) {
//             if (!value[i][property])
//               value[i][property] = '';
//           }
//         }
//         res.send(value);
//       },
//       params);
//   });
//   app.post('/getContactTags', async (req, res) => {
//     var inParams = [];
//     inParams.push(req.body.ids); //ids
//     inParams.push(['name', 'category_id']); //Tags
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner.category',
//       'read',
//       params,
//       (err, tags) => {
//         if (err) {
//           return console.log(err);
//         }
//         let ret = [];
//         for (let i = 0; i < tags.length; i++) {
//           console.log(tags[i]);
//           ret[i] = tags[i].name;
//         }
//         res.send(ret);
//       },
//     );
//   });
//   app.post('/getContactClass', async (req, res) => {
//     var inParams = [];
//     inParams.push(req.body.ids); //ids
//     inParams.push(['project_id', 'task_id', '']); //Proyectos
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'project.project',
//       'read',
//       params,
//       (err, vals) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log()
//         res.send(vals);
//       },
//     );
//   });
//   app.post('/getGrupoFamiliarContactos', async (req, res) => {
//     var inParams = [];
//     inParams.push(req.body.ids); //ids
//     inParams.push([
//       'name',
//       'country_id',
//       'type',
//       'company_type',
//       'comment',
//       'parent_id',
//       'main_id_number',
//       'task_ids',
//       'title',
//       'email',
//       'street',
//       'mobile',
//       'phone', //Field added
//       'fax',
//       'category_id', //Field added: Tags
//     ]); //fields
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner',
//       'read',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         for (let i = 0; i < value.length; i++) {
//           let object = value[i];
//           for (var property in object) {
//             if (!value[i][property])
//               value[i][property] = '';
//           }
//         }
//         console.log(value)
//         res.send(value);
//       },
//     );
//   });
//   app.get('/getTaskProjectName', async (req, res) => {
//     console.log('getTaskProjectName')
//     console.log(req.query.id)
//     var inParams = [];
//     inParams.push([Number(req.query.id)]);
//     inParams.push(['id', 'name', 'project_id', 'list_price']); //fields

//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'project.task',
//       'read',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         res.send(value[0]['project_id'][1]);
//       },
//     );
//   });

//   app.get('/getProductos', async (req, res) => {
//     var inParams = [];
//     inParams.push([]);
//     inParams.push(['id', 'name', 'list_price']); //fields
//     inParams.push(0); //offset
//     inParams.push(10); //limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'product.template',
//       'search_read',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log(value);
//         //como iterrar un array y como iterar un objeto.
//         res.send(value);
//       },
//     );
//   });

//   app.post('/confirmSo', async (req, res) => {
//     console.log(req.body.student.id);

//     var inParams = [];
//     inParams.push({
//       partner_id: req.body.student.id,
//       fiscal_position_id: 1, // For testing.
//     });
//     console.log(inParams);
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw('sale.order', 'create', params, async function (
//       err,
//       value,
//     ) {
//       if (err) {
//         return console.log(err);
//       }
//       console.log('Result: ', value);
//       var inParams = [];
//       inParams.push({
//         order_id: value,
//         product_id: req.body.clase.id,
//       });
//       console.log(inParams);
//       var params = [];
//       params.push(inParams);
//       await OdooService.execute_kw(
//         'sale.order.line',
//         'create',
//         params,
//         function (err, value) {
//           if (err) {
//             return console.log(err);
//           }
//           console.log('Result: ', value);
//           res.send({
//             orderLineId: value,
//           });
//         },
//       );
//     });
//   });

//   app.post('/updateTaskName', async (req, res) => {
//     console.log(req.body);
//     var inParams = [];
//     inParams.push([
//       ['sale_line_id', '=', req.body.orderLineId]
//     ]);

//     inParams.push(['name', 'project_id', 'partner_id', 'stage_id']); //fields
//     inParams.push(0); //offset
//     inParams.push(100); //limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'project.task',
//       'search_read',
//       params,
//       async (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log('xxxxxxxxxxxxx');
//         console.log(value);
//         var inParams = [];
//         inParams.push(parseInt(value[0].id)); //id to update
//         inParams.push({
//           name: req.body.alumno.parent_id[1] + ', ' + req.body.alumno.name,
//         });
//         var params = [];
//         params.push(inParams);
//         await OdooService.execute_kw(
//           'project.task',
//           'write',
//           params,
//           (err, value) => {
//             if (err) {
//               return console.log(err);
//             }
//             console.log(value);
//             res.send({
//               result: value
//             });
//           },
//         );
//       },
//     );
//   });

//   app.get('/getSos', async (req, res) => {
//     console.log(req.query.studentId);
//     var inParams = [];
//     inParams.push([
//       ['partner_id', '=', parseInt(req.query.studentId)],
//       ['invoice_status', '=', 'to invoice'],
//     ]);
//     inParams.push(0); //offset
//     inParams.push(100); //Limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw('sale.order', 'search', params, async function (
//       err,
//       value,
//     ) {
//       if (err) {
//         return console.log(err);
//       }
//       var inParams = [];
//       inParams.push(value); //ids
//       var params = [];
//       params.push(inParams);
//       await OdooService.execute_kw('sale.order', 'read', params, function (
//         err2,
//         value2,
//       ) {
//         if (err2) {
//           return console.log(err2);
//         }
//         res.send(value2);
//       });
//     });
//   });

//   app.get('/getSoTask', async (req, res) => {
//     console.log(req.body);
//     var inParams = [];
//     inParams.push([
//       ['id', '=', req.query.id]
//     ]);
//     console.log(inParams);
//     inParams.push(['name', 'order_line']); //fields
//     inParams.push(0); //offset
//     inParams.push(100); //limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'sale.order',
//       'search_read',
//       params,
//       async (err, value) => {
//         if (err) {
//           return console.log(err);
//         }

//         //res.send(value);
//         console.log(value[0].order_line[0]);
//         var inParams = [];
//         inParams.push([
//           ['sale_line_id', '=', value[0].order_line[0]]
//         ]);

//         inParams.push(['name', 'project_id', 'partner_id', 'stage_id']); //fields
//         inParams.push(0); //offset
//         inParams.push(100); //limit
//         var params = [];
//         params.push(inParams);
//         await OdooService.execute_kw(
//           'project.task',
//           'search_read',
//           params,
//           async (err, value) => {
//             if (err) {
//               return console.log(err);
//             }
//             console.log('xxxxxxxxxxxxx');
//             console.log(value);

//             res.send(value);
//           },
//         );
//       },
//     );
//   });

//   app.get('/get_task_types', async (req, res) => {
//     console.log(req.query);
//     var inParams = [];
//     inParams.push([
//       ['project_ids', '=', parseInt(req.query.id)]
//     ]);

//     inParams.push(['name']); //fields
//     inParams.push(0); //offset
//     inParams.push(100); //limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'project.task.type',
//       'search_read',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log('xxxxxxxxxxxxx');
//         console.log(value);

//         res.send(value);
//       },
//     );
//   });

//   app.get('/getOrderLine', async (req, res) => {
//     console.log(req.query);
//     var inParams = [];
//     inParams.push([
//       ['id', '=', parseInt(req.query.id)]
//     ]);

//     inParams.push([
//       'id',
//       'discount',
//       'product_id',
//       'product_uom',
//       'price_unit',
//       'product_uom_qty',
//       'order_id',
//       'order_partner_id',
//     ]); //fields
//     inParams.push(0); //offset
//     inParams.push(100); //limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'sale.order.line',
//       'search_read',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log('xxxxxxxxxxxxx');
//         console.log(value);

//         res.send(value);
//       },
//     );
//   });

//   app.get('/stage_task_count', async (req, res) => {
//     var inParams = [];
//     console.log(req.query);
//     inParams.push([
//       //['stage_id', '=', parseInt(req.query.stage_id)],
//       ['project_id', '=', parseInt(req.query.project_id)],
//     ]);
//     inParams.push(['name', 'project_id', 'partner_id', 'stage_id']); //fields
//     inParams.push(0); //offset
//     inParams.push(100); //limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'project.task',
//       'search_read',
//       params,
//       async (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log('Result: ', value);
//         res.send({
//           value: value
//         });
//       },
//     );
//   });

//   app.post('/updateTask', async (req, res) => {
//     console.log(req.body);
//     var inParams = [];
//     inParams.push([req.body.task.id]); //id to update
//     inParams.push({
//       id: req.body.task.id,
//       stage_id: req.body.task.stage_id,
//     });
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'project.task',
//       'write',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log(value);
//         res.send(value);
//       },
//     );
//   });

//   app.post('/crear_contacto', async (req, res) => {
//     var inParams = [];
//     console.log(req.body);
//     inParams.push({
//       name: req.body.contacto,
//       company_type: 'person',
//       main_id_category_id: 35,
//       main_id_number: req.body.dni,
//       title: 8,
//       parent_id: req.body.grupoFamiliar.id,
//       phone: req.body.telefono, //field added
//     });
//     console.log(inParams);
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner',
//       'create',
//       params,
//       async function (err, value) {
//         if (err) {
//           return console.log(err);
//         }
//         res.send('Result ' + value);
//       },
//     );
//   });

//   app.post('/crear_factura', async (req, res) => {
//     console.log('1');
//     console.log(req.body);
//     var inParams = [];
//     inParams.push({
//       partner_id: req.body.grupoFamiliar.id,
//       afip_service_start: new Date()
//         .toJSON()
//         .slice(0, 10)
//         .replace(/-/g, '-'),
//       afip_service_end: new Date()
//         .toJSON()
//         .slice(0, 10)
//         .replace(/-/g, '-'),
//       //afip_concept: 'Servicios',
//       fiscal_position_id: 1,
//       payment_term_id: 1,
//       journal_id: 1,
//       journal_document_type_id: 19,
//     });
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'account.invoice',
//       'create',
//       params,
//       async function (err, value) {
//         if (err) {
//           return console.log(err);
//         }
//         res.send({
//           Result: value
//         });
//       },
//     );
//   });
//   app.post('/crear_linea_factura', async (req, res) => {
//     console.log('2');
//     console.log('Crear Linea de factura', req.body);
//     var inParams = [];
//     inParams.push({
//       invoice_id: req.body.invoiceId,
//       price_unit: req.body.linea.pesos,
//       product_id: 3,
//       //discount: req.body.linea.discount,
//       //origin: req.body.linea.order_id[1],
//       quantity: 1,
//       //sale_order_lines: req.body.linea.id,
//       account_id: 13,
//       //invoice_line_tax_ids: [4, 11, 0],
//       name: req.body.linea.descripcion,
//     });
//     console.log(inParams);
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'account.invoice.line',
//       'create',
//       params,
//       async function (err, invoice_line_id) {
//         if (err) {
//           return console.log(err);
//         }

//         var inParams = [];
//         console.log(invoice_line_id)
//         inParams.push([invoice_line_id]); //id to update
//         inParams.push({
//           invoice_line_tax_ids: [
//             [4, 11, 0]
//           ],
//         })
//         var params = [];
//         params.push(inParams);
//         await OdooService.execute_kw('account.invoice.line', 'write', params, async function (err, value) {
//           if (err) {
//             return console.log(err);
//           }
//           console.log('Result: ', value);

//           var inParams = [];
//           inParams.push({
//             invoice_id: req.body.invoiceId,
//             account_id: 79,
//             name: 'IVA Exento Ventas',
//             tax_id: 11,
//           });
//           console.log(inParams);
//           var params = [];
//           params.push(inParams);
//           await OdooService.execute_kw(
//             'account.invoice.tax',
//             'create',
//             params,
//             async function (err, value) {
//               if (err) {
//                 return console.log(err);
//               }
//               console.log(value)
//               var inParams = [];
//               inParams.push(req.body.invoiceId);
//               inParams.push(false); //raise_exception
//               var params = [];
//               params.push(inParams);
//               await OdooService.execute_kw('account.invoice', 'action_invoice_open', params, function (err, value) {
//                 if (err) {

//                 }
//                 res.send('OK');
//               });

//             });


//         });


//       },
//     );
//   });
//   app.post('/createPartnerFacturacion', async (req, res) => {
//     var inParams = [];
//     inParams.push({
//       x_neptuno_id: req.body.partner.x_neptuno_id,
//       name: req.body.partner.name,
//       main_id_number: req.body.partner.main_id_number,
//       main_id_category_id: 35,
//       is_company: true, // Corrected company_type:'company'
//       property_account_position_id: (0, 0, 1), //Corrected property_account_position_id: 1,
//       afip_responsability_type_id: (0, 0, 6),
//       property_payment_term_id: 1,
//       email: req.body.partner.email
//     });
//     console.log(inParams);
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner',
//       'create',
//       params,
//       async function (err, value) {
//         if (err) {
//           return console.log(err);
//         }
//         console.log('Result: ', value);

//         res.send(String(value));
//       },
//     );

//   });

//   app.get('/getPartnerFacturacion', async (req, res) => {
//     var inParams = [];
//     inParams.push([
//       ['x_neptuno_id', '=', 'gf' + req.query.id]
//     ]);
//     inParams.push([
//       'name',
//       'country_id',
//       'comment',
//       'parent_id',
//       'title',
//       'email',
//       'main_id_number',
//       'street',
//       'mobile',
//       'fax',
//     ]); //fields
//     inParams.push(0); //offset
//     inParams.push(5); //limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner',
//       'search_read',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         console.log(value)
//         res.send(value[0]);
//       },
//     );
//   })

//   // app.post('/createPartnerFacturacion'), async (req, res) => {
//   //   console.log(req.body);
//   //   res.send('ok')
//   // }

//   app.get('/getGruposFamiliares', async (req, res) => {
//     var inParams = [];
//     inParams.push([
//       ['x_neptuno_id', 'like', 'gf']
//     ]);
//     inParams.push([
//       'name',
//       'country_id',
//       'comment',
//       'parent_id',
//       'title',
//       'email',
//       'main_id_number',
//       'street',
//       'mobile',
//       'fax',
//       'x_neptuno_id'
//     ]); //fields
//     inParams.push(0); //offset
//     inParams.push(5000); //limit
//     var params = [];
//     params.push(inParams);
//     await OdooService.execute_kw(
//       'res.partner',
//       'search_read',
//       params,
//       (err, value) => {
//         if (err) {
//           return console.log(err);
//         }
//         let ret = []
//         value.forEach(element => {
//           console.log(element)
//           if (element.email == false)
//             ret.push(element)
//         })

//         res.send(ret);
//       },
//     );
//   })


//   // #########################################################################
//   // Neptuno
//   // #########################################################################

//   app.post('/npt_crear_grupo_familiar', async (req, res) => {
//     await NeptunoService.crearGrupoFamilar(req.body.gf, async (err, result) => {
//       if (err) {
//         res.status(500).send(err);
//         return;
//       }
//       if (!result) {
//         res.status(404).send({
//           message: 'User not found',
//         });
//       }
//       var inParams = [];
//       inParams.push({
//         x_neptuno_id: 'gf' + result.dataValues.id,
//         name: 'Familia ' + req.body.gf.name,
//         main_id_number: req.body.gf.id_number,
//         main_id_category_id: 35,
//         is_company: true, // Corrected company_type:'company'
//         property_account_position_id: (0, 0, 1), //Corrected property_account_position_id: 1,
//         afip_responsability_type_id: (0, 0, 6),
//         property_payment_term_id: 1,
//         email: req.body.gf.email,
//         street: req.body.gf.direccion,
//         phone: req.body.gf.telefono, //field added
//       });
//       console.log(inParams);
//       var params = [];
//       params.push(inParams);
//       await OdooService.execute_kw(
//         'res.partner',
//         'create',
//         params,
//         async function (err, value) {
//           if (err) {
//             return console.log(err);
//           }
//           console.log('Result: ', value);
//           var inParams = [];
//           inParams.push({
//             name: req.body.gf.contact_name,
//             email: req.body.gf.email,
//             street: req.body.gf.direccion,
//             main_id_number: req.body.gf.id_number,
//             main_id_category_id: 35,
//             phone: req.body.gf.telefono, //field added
//             parent_id: value,
//             is_company: false, // Correction: company_type: 'person'
//             title: 8,
//           });
//           console.log(inParams);
//           var params = [];
//           params.push(inParams);
//           await OdooService.execute_kw(
//             'res.partner',
//             'create',
//             params,
//             async function (err, value) {
//               if (err) {
//                 return console.log(err);
//               }
//             },
//           );
//           res.send(String(value));
//         },
//       );
//     });
//   });

//   app.post('/npt_registrar_factura', async (req, res) => {
//     console.log(req.body);
//     await NeptunoService.registrarFactura(req.body.data,
//       async (err, result) => {
//         console.log(result)
//         res.send('OK')
//       }
//     )
//   });

//   app.post('/npt_crear_alumno', async (req, res) => {
//     console.log(req.body);
//     let nptId = '';
//     if (req.body.grupoFamiliar.x_neptuno_id !== undefined) {
//       nptId = req.body.grupoFamiliar.x_neptuno_id.substring(2);
//     }
//     await NeptunoService.crearStudent({
//       grupos_familiare_id: req.body.grupoFamiliar.x_neptuno_id.substring(2),
//       first_name: req.body.alumno,
//     },
//       async (err, result) => {
//         if (err) {
//           res.status(500).send(err);
//           return;
//         }
//         if (!result) {
//           res.status(404).send({
//             message: 'User not found',
//           });
//         }
//         console.log(result);
//         var inParams = [];
//         inParams.push({
//           x_neptuno_id: 'st' + result.dataValues.id,
//           name: result.dataValues.first_name,
//           company_type: 'person',
//           main_id_category_id: 35,
//           main_id_number: req.body.dni,
//           property_payment_term_id: 1,
//           title: 10,
//           street: req.body.grupoFamiliar.direccion,
//           parent_id: req.body.grupoFamiliar.id,
//         });
//         console.log(inParams);
//         var params = [];
//         params.push(inParams);
//         await OdooService.execute_kw(
//           'res.partner',
//           'create',
//           params,
//           async function (err, value) {
//             if (err) {
//               return console.log(err);
//             }
//             console.log('Result: ', value);

//             res.send('Result: ' + value);
//           },
//         );
//       },
//     );
//   });

//   app.get('/npt_get_pago', async (req, res) => {

//     await NeptunoService.getPago({
//       id: req.query.id
//     },
//       async (err, result) => {
//         console.log('Routes.js --', result)
//         res.send(result)
//       });
//   });

//   app.get('/npt_get_pagos_mes', async (req, res) => {
//     console.log(req.query)
//     await NeptunoService.getPagosMes({
//       mes: req.query.mes
//     },
//       async (err, result) => {
//         console.log(result)
//         res.send(result)
//       });
//   });

//   // app.get('/npt_get_grupos_familiares', async (req, res) => {
//   //   console.log(req.query)
//   // }

//   app.post('/npt_update_email', async (req, res) => {
//     console.log('UPDATE MAIL', req.body);
//     id = req.body.data.x_neptuno_id.slice(2)
//     console.log(id)
//     await NeptunoService.getEmail(id,
//       async (err, result) => {
//         console.log('NUEVO EMAIL ', result.email_padre)
//         let newEmail = ''
//         if (validator.validate(result.email_padre)) {
//           newEmail = result.email_padre;
//           if (validator.validate(result.email_madre)) {
//             newEmail = newEmail + ';' + result.email_madre
//           }
//         }
//         if (newEmail == '') {
//           res.send('Nothing to Do.')
//         } else {
//           var inParams = [];
//           inParams.push([req.body.data.id]); //id to update
//           inParams.push({
//             id: req.body.data.id,
//             email: newEmail,
//           });
//           var params = [];
//           params.push(inParams);
//           await OdooService.execute_kw(
//             'res.partner',
//             'write',
//             params,
//             (err, value) => {
//               if (err) {
//                 return console.log(err);
//               }
//               console.log('PARTNER ACTUALIZADO ', value);
//               console.log('nuevo email', newEmail)
//               console.log('gf id', req.body.data.id)
//               res.send('ok')
//             },
//           );
//         }


//       }
//     )

//   });

//   app.get('/npt_get_grupos_familiares', async (req, res) => {
//     console.log(req.query)
//     await NeptunoService.getGruposFamiliares({},
//       async (err, result) => {
//         console.log(result)
//         let email = false
//         result.forEach(async (element) => {
//           if (element.dataValues['email_padre'] != '') {
//             email = element.dataValues['email_padre'];
//           }
//           if (element.dataValues['email_madre'] != '') {
//             email = email + ',' + element.dataValues['email_madre'];
//           }
//           console.log(element['id'], email)
//           if (email != false) {
//             var inParams = [];
//             inParams.push([
//               ['x_neptuno_id', '=', 'gf' + element['id']],
//             ]);

//             inParams.push([
//               'id',
//               'name',
//               'email',
//             ]); //fields
//             inParams.push(0); //offset
//             inParams.push(1); //limit
//             var params = [];
//             params.push(inParams);
//             await OdooService.execute_kw(
//               'res.partner',
//               'search_read',
//               params,
//               async (err, value) => {
//                 if (err) {
//                   return console.log(err);
//                 }
//                 if (value[0]) {
//                   if ((value[0]['email'] == false)) {
//                     console.log('ODOO, ', value);
//                     console.log('email, ', email)

//                   }
//                 }
//               },
//             );
//             email = false
//           }
//         });
//         res.send(result)
//       });
//   });
// }