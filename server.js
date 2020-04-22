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

const getPartners = async function() {
  app.get('/partners', (req, res) => {
    odoo.connect(function (err) {
      if (err) { return console.log(err) }
      console.log('Connected to Odoo server.')
      let inParams = []
      let domain = [['active', '=', true]]
      inParams.push(domain)
      let params = []
      params.push(inParams)
      params.push({ fields: ['id', 'name', 'display_name', 'create_date'], limit: 5 })
      odoo.execute_kw('res.partner', 'search_read', params, function (err, value) {
        if (err) { return console.log(err) }
        res.send({ partners: value })
        console.log(value)
      })
    })
  })
}

app.get('/partners2', (req, res) => {
    odoo.connect(function (err) {
        if (err) { return console.log(err); }
        console.log('Connected to Odoo server.');

        let inParams = [];
        inParams.push([['is_company', '=', true]]);
        inParams.push(['name', 'company_id', 'email']); //fields
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
    // inParams.push(['active', '=', true]);
    let params = [];
    params.push(inParams);
    odoo.execute_kw('project.project', 'read', params, function (err, value) {
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

const projectsData = [];
const tasksData = [];
app.get('/projects2', (req, res) => {
  odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    let inParams = [];
    inParams.push([['is_company', '=', true]]);
    inParams.push(['name', 'company_id', 'email']); //fields
    inParams.push(0); //offset
    inParams.push(2); //limit
    let params = [];
    params.push(inParams);
    odoo.execute_kw('project.project', 'read', params, function (err, projectsData) {
      if (err) { return console.log(err) }
      console.log('Result: ', projectsData)
      // res.send({ project: projectsData })

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