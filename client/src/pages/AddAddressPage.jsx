import {React, useState} from 'react'
import { assets } from '../assets/assets'

const InputField = ({type, placeHolder, name, handleChange, address}) => (
    <input 
    className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
    placeholder={placeHolder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
    type={type} />
)

const AddAddressPage = () => {
    const onSubmitHandler = async (e) => {
        e.preventDefault();
    } 

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(
            (prevAddress) => ({
                ...prevAddress,
                [name]: value,
            })
        )
    }


  return (
    <div className='mt-16 pb-16'>
        <p className='text-2xl md:text-3xl text-gray-500'>
            Add Shipping <span className='text-primary font-semibold'>Address</span>
        </p>

        <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
            <div className='flex-1 max-w-md'>
                <form 
                className='space-y-3 mt-6 text-sm'
                onSubmit={onSubmitHandler}>
                    <div className='grid grid-cols-2 gap-2'>
                        <InputField
                        placeHolder='First Name'
                        handleChange={handleChange}
                        name='firstName'
                        type='text'
                        address={address}
                        />
                        <InputField
                        placeHolder='Last Name'
                        handleChange={handleChange}
                        name='lastName'
                        type='text'
                        address={address}
                        />
                    </div>

                    <InputField
                    placeHolder='Email address'
                    handleChange={handleChange}
                    name='email'
                    type='email'
                    address={address}
                    />  

                    <InputField
                    placeHolder='Street'
                    handleChange={handleChange}
                    name='street'
                    type='text'
                    address={address}
                    />  

                    <div className='grid grid-cols-2 gap-4'>
                        <InputField
                        placeHolder='City'
                        handleChange={handleChange}
                        name='city'
                        type='text'
                        address={address}
                        /> 
                        <InputField
                        placeHolder='State'
                        handleChange={handleChange}
                        name='state'
                        type='text'
                        address={address}
                        /> 
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                        <InputField
                        placeHolder='Zip-code'
                        handleChange={handleChange}
                        name='zipcode'
                        type='Number'
                        address={address}
                        /> 
                        <InputField
                        placeHolder='Country'
                        handleChange={handleChange}
                        name='country'
                        type='text'
                        address={address}
                        /> 
                    </div>

                    <InputField
                    placeHolder='Phone'
                    handleChange={handleChange}
                    name='phone'
                    type='text'
                    address={address}
                    /> 

                    <button className='mt-6 bg-primary px-5 hover:bg-primary-dull text-white py-3 transiton cursor-pointer uppercase'>Save Address</button>
                </form>
            </div>
             <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="" />
        </div>
         
    </div>
  )
}

export default AddAddressPage