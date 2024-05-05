// import  { useState } from 'react';

const SearchSelectForm: React.FC = () => {


    return (

        <form className="max-w-sm mx-auto">
            <div className="flex">
            <p className="text-gray-900 text-sm border-s-2 block w-full py-2.5 ">
                    Where: 
                </p>
                <label htmlFor="states" className="sr-only focus:border-none">Choose a Country</label>
                <select id="states" className="select-input text-gray-900 text-sm block w-full p-2.5 border-none active:border-none hover:border-none focus:border-none">
                    <option className='select-input'selected>Choose a Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                </select>
             
            </div>
        </form>

    );
}

export default SearchSelectForm;
