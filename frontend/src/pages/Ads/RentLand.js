import React from 'react'
import Sidebar from '../../Components/Sidebar'
import AddForm from '../../Components/Form'

export default function RentLand() {
  return (
    <div>
      <h1 className='display-1 text-blue p-5'>Rent Land</h1>
     <Sidebar/>
     <div className='container mt-2'>
       <AddForm action="Rent" type="Land"/>
     </div>

    </div>
  )
}
