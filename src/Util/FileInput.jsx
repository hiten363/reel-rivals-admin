import useMain from '@/hooks/useMain';
import React, { useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';

const FileInput = ({ value, setValue, isRequired }) => {
    const { uploadImage } = useMain();
    const [loadFlag, setLoadFlag] = useState(false);

    const handleChange = async (e) => {
        setLoadFlag(true);
        if (e?.target?.files?.[0]) {
            let ans = await uploadImage({ file: e.target.files[0] });
            if (!ans?.status) {
                alert('Something went wrong');
                return;
            }
            setValue({ ...value, [e.target.name]: ans?.data });
        }
        setLoadFlag(false);
    };

    return (
        <>
            {loadFlag && <div className='fixed bg-[#0000003b] h-full w-full left-0 top-0 flex justify-center items-center'>
                <div className='flex flex-col items-center gap-2'>
                    <RotatingLines
                        visible={true}
                        height="46"
                        width="46"
                        color="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                    <h4 className='text-white font-bold'>Uploading</h4>
                </div>
            </div>}

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file">Upload Image</label>
                <input className="block w-full text-sm text-gray-900 border p-2.5 border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" type="file" name='file' onChange={handleChange} required={isRequired} />
            </div>
        </>
    );
};

export default FileInput;
