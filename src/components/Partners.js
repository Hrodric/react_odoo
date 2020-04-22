import React, { useState, useEffect } from 'react';

export const Partners = props => {

    const [partners, setPartners] = useState([]);

    useEffect(() => {
        getPartners()
        console.log('Effect working on...');
        setIsLoading(true);
    }, [input]);

    let content = <p>Loading partners...</p>;



    // render(){
    //     console.log(this.props)
    //     const { partners, error, items } = this.props;
    //     const partnerList = partners.map(partner => {
    //         return (
    //             <div className="partner" key={partner.id}>
    //                 <div>Id: {partner.id}</div>
    //                 <div>Name: {partner.name}</div>
    //                 <div>Display_name: {partner.display_name}</div>
    //                 <div>Create_date: {partner.create_date}</div>
    //                 <ul>
    //                     {items.map(item=>(
    //                         <li key={item.id}>
    //                             {item}
    //                         </li>
    //                     ))}
    //                 </ul>
    //             </div>
    //         )
    //     })
    //     return(
    //         <div className="partner-list">
    //             { partnerList }
    //         </div>
    //     )
    // }
}