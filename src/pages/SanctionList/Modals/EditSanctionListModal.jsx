import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import React from 'react'
import { useEffect } from 'react';
import { Button } from '@material-tailwind/react';
import { Country, State } from 'country-state-city';
import Select from 'react-select';

const EditSanctionListModal = ({ data, setRefreshFlag, refreshFlag, notify }) => {
  const { updateSanctionList } = useMain();

  const [value, setValue] = useState({
    id: '',
    countries: []
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [loadFlag, setLoadFlag] = useState(false);

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);
      
      if (Object.keys(data).length > 0) {
        setValue({
          id: data._id,
          countries: data.countries
        });
      }
    }
  }, [data]);

  const getCountries = () => {
    let countries = Country.getAllCountries();
    setCountries(countries.map((e) => {
      return { label: e.name, value: e.isoCode };
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(value);

    const ans = await updateSanctionList({ ...value });
    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('editSanctionListModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
    }
  };

  return (
    <>
      <div id="editSanctionListModal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 cus-modal hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Update faq
              </h3>
              <button type="button" onClick={() => {
                document.getElementById('editSanctionListModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Update Sanction List</h4>
                  <div id="loadFlagModal1" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className="grid gap-6 px-0.5 py-0.5 mb-6">
                    <Select
                      isMulti
                      options={countries}
                      onChange={(e) => {
                        setValue({ ...value, countries: e });
                      }}
                      value={value.countries}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>

                  <div className='text-right'>
                    <Button color="green" type="submit" children="Submit">Submit</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSanctionListModal;
