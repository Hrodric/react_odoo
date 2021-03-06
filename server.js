const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const Odoo = require('odoo-xmlrpc')

app.listen(port, () => console.log(`Listening on port ${port}`))

const odoo = new Odoo({
  url: 'http://ec2-3-81-45-27.compute-1.amazonaws.com:8069',
  db: 'Dev_IFEI',
  username: 'braian@remixcom.com',
  password: 'NewIfei62'
})

app.get('/partners', (req, res) => {
    odoo.connect(function(err) {
      if (err) {return console.log(err)}
      console.log('Connected to Odoo server.')
      let inParams = []
      let domain = [['active', '=', true]]
  inParams.push(domain)
      let params = []
      params.push(inParams)
      params.push({ fields: ['id','name','display_name','create_date'], limit: 5 })
      odoo.execute_kw('res.partner', 'search_read', params, function(err, value) {
        if (err) {return console.log(err)}
        res.send({partners: value})
      })
    })
  })

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
        res.send({
          partners: value
        })
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