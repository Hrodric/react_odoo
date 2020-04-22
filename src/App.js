import React, { Component } from 'react';
import { useState, useEffect } from "react";
import './App.css';
import Partners from './components/Partners';

const App = props =>  {
  const [partners, setPartners] = useState({
    partners: []
  });
  
  return (
    <div className='App'>
      <ul>
      { props.partners.map(item => (
        <li key={ item.partners.id }>
          <ul>
            <li href={ item.partners.name }>{ item.partners.name }></li>
          </ul>
        </li>
      )) }
      </ul>        
    </div>
  );  

}
export default App;