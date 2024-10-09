import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import React from 'react'
import { useEffect } from 'react';
import { Button } from '@material-tailwind/react';
import cloneDeep from 'clone-deep';
import FileInput from '@/Util/FileInput';

const EditCategoryModal = ({ data, setRefreshFlag, refreshFlag, notify }) => {
  const { updateCategory, uploadImage } = useMain();

  const [value, setValue] = useState({
    title: '',
    file: ''
  });
  const [desc, setDesc] = useState({
    richText: '',
    simpleText: '',
    textLength: 0
  })

  const [prevImage, setPrevImage] = useState(''); // previous images
  const [loadFlag, setLoadFlag] = useState(true);
  const [imagePreviewExt, setImagePreviewExt] = useState([]);
  const [imagePreviewExt1, setImagePreviewExt1] = useState([]);

  var [data1, setData1] = useState([{
    tags: ''
  }]);

  var [data2, setData2] = useState([{
    imgDesc: ''
  }]);

  useEffect(() => {
    if (data) {
      if (Object.keys(data).length > 0) {
        setLoadFlag(true);
        setValue({
          id: data._id,
          title: data.title,
          file: ''
        });
        setPrevImage(data?.img);
        setLoadFlag(false);
      }
    }
  }, [data]);

  const handleChange = async (e, type = '') => {
    if (type === 'desc') {
      setValue({
        ...value, "desc": {
          richText: e.richText,
          simpleText: e.simpleText,
          textLength: e.textLength
        }
      });
    }
    else {
      if (e.target.name !== 'file') {
        setValue({ ...value, [e.target.name]: e.target.value });
      }
      else {
        setValue({ ...value, [e.target.name]: e.target.files[0] });
      }
    }
  };

  const handleChange2 = (e) => {
    setDesc({
      richText: e.richText,
      simpleText: e.simpleText,
      textLength: e.textLength
    });
  };

  const handleChange1 = (e, index) => {
    let obj = data1[index];
    obj = { ...obj, [e.target.name]: e.target.value };
    let t = [];
    for (let i = 0; i < data1.length; i++) {
      if (i === index) {
        t.push(obj);
      }
      else {
        t.push(data1[i]);
      }
    }
    setData1(t);
  };

  const handleChange3 = (e, index) => {
    let obj = data2[index];
    obj = { ...obj, [e.target.name]: e.target.value };
    let t = [];
    for (let i = 0; i < data2.length; i++) {
      if (i === index) {
        t.push(obj);
      }
      else {
        t.push(data2[i]);
      }
    }
    setData2(t);
  };

  const deleteImg = async (link, index) => {
    setLoadFlag(true);

    // console.log(value.images);
    // console.log(link);
    // console.log(index);

    if (link.includes('s3')) {
      // previous image
      // prevImage1.splice(index, 1);
      setPrevImage1(prevImage1.filter((x, index1) => index != index1));
    }
    else {
      // newly inserted image
      let n = 0;
      if (prevImage1.length > 0) {
        n = prevImage1.length;
      }
      setValue({ ...value, images: (Array.from(value.images).filter((_, index1) => index1 !== (index - n))) });
    }

    setPrevImage(prevImage.filter((x, index1) => index !== index1));
    setLoadFlag(false);
  };

  const handleAddBtn = () => {
    setData1(data1.concat({
      tags: ''
    }));
  };

  const handleRemoveBtn = (index) => {
    setData1(() => {
      return data1.filter((e, i) => {
        return i !== index;
      });
    });
  };

  const handleAddBtn1 = () => {
    setData2(data2.concat({
      imgDesc: ''
    }));
  };

  const handleRemoveBtn1 = (index) => {
    setData2(() => {
      return data2.filter((e, i) => {
        return i !== index;
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // let imageCount = value.images.length + prevImage1.length;

    // if (data2.length !== imageCount) {
    //   alert('Image description count must be same as of uploaded images count');
    //   return;
    // }

    // if (convert(desc.richText).trim() === "") {
    //   alert('Description is required');
    //   return;
    // }

    // let temp = [];
    // for (let i of data1) {
    //   temp.push(i.tags);
    // }

    // let temp1 = [];
    // for (let i of data2) {
    //   temp1.push(i.imgDesc);
    // }

    const ans = await updateCategory({
      ...value
    });

    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      e.target.reset();
      // document.getElementById('images').value = '';
      document.getElementById('editCategoryModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
    }
  };

  return (
    <>
      <div id="editCategoryModal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 cus-modal hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">Update category details</h3>

              <button type="button" onClick={() => {
                document.getElementById('editCategoryModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {loadFlag ? 'Loading ..' : <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Enter Category Details</h4>

                  <div id="loadFlagModal" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                      <input type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Title .." onChange={handleChange} value={value.title} required />
                    </div>

                    <div>
                      <>
                        <p>Uploaded Image</p>
                        <img style={{ width: '120px', height: '120px', objectFit: 'contain' }} src={prevImage} />
                      </>

                      <FileInput value={value} setValue={setValue} />
                    </div>
                  </div>

                  <div className='text-right'>
                    <Button color="green" type="submit" children="Submit">Submit</Button>
                  </div>
                </div>
              </form>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCategoryModal;
