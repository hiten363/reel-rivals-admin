import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import React from 'react'
import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@material-tailwind/react';
import { convert } from 'html-to-text';

var quillObj1;

const imageHandler = async () => {
  const input = document.createElement('input');

  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    document.getElementById('loadFlagModal1').classList.toggle('hidden');
    var file = input.files[0];

    console.log(file);
    let formdata = new FormData();
    formdata.append("file", file);
    // formdata.append("upload_preset", "ji1wtvgl");

    // const url0 = "https://api.cloudinary.com/v1_1/" + 'hiten36' + "/auto/upload";
    const url0 = `${baseUrl}/util/uploadImage`;
    const resp = await fetch(url0, {
      method: 'POST',
      body: formdata
    });
    const data = await resp.json();

    // console.log(data);

    var url = data.data;
    const range1 = quillObj1.getEditorSelection();

    if (range1) {
      quillObj1.getEditor().insertEmbed(range1.index, 'image', url);
      document.getElementById('loadFlagModal1').classList.toggle('hidden');
    }
  };
};

var toolbarOptions = {
  container: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    ['link', 'image'],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'align': [] }],
    ['clean']
  ],
  handlers: {
    image: imageHandler
  }
};

const EditPartnerModal = ({ data, setRefreshFlag, refreshFlag, notify }) => {
  const { updatePartner, deletePartnerImage } = useMain();

  const [value, setValue] = useState({
    id: '',
    title: '',
    subTitle: '',
    writtenBy: '',
    file: '',
    slug: ''
    // desc: {
    //   richText: '',
    //   simpleText: '',
    //   textLength: 0
    // }
  });
  const [desc, setDesc] = useState({
    richText: '',
    simpleText: '',
    textLength: 0
  })

  const [prevImage, setPrevImage] = useState('');
  const [loadFlag, setLoadFlag] = useState(false);

  var [data1, setData1] = useState([{
    tags: ''
  }]);

  useEffect(() => {
    if (data) {
      if (Object.keys(data).length > 0) {
        console.log(data);
        setValue({
          id: data._id,
          title: data.title,
          subTitle: data.subTitle,
          writtenBy: data.writtenBy,
          file: '',
          slug: data?.slug
        });

        setDesc({
          richText: data.desc,
          simpleText: data.desc,
          textLength: data.desc.length
        });

        if(data.img)
        {
          setPrevImage({
            url: data.img.url,
            id: data.img.id
          });
        }

        let temp = [];

        for (let i of data.tags[0].split(',')) {
          temp.push({ tags: i });
          console.log(temp);
        }

        // console.log(temp);
        setData1(temp);
      }
    }
  }, [data]);

  const rteChange1 = (content, delta, source, editor) => {
    handleChange2({
      richText: editor.getHTML(),
      simpleText: editor.getText(),
      textLength: editor.getLength()
    });
  };

  const handleChange = (e, type = '') => {
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

  const deleteImg = async () => {
    setLoadFlag(true);
    console.log(prevImage.id);
    const ans = await deletePartnerImage(prevImage.id);
    console.log(ans);
    if (ans.status) {
      setPrevImage('');
    }
    else {
      notify('error', ans.message);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(value);
    if(convert(desc.richText).trim()==="")
    {
      alert('Description is required');
      return;
    }

    let temp = [];
    for (let i of data1) {
      temp.push(i.tags);
    }
    // console.log(temp);
    // console.log(desc);

    const ans = await updatePartner({ ...value, desc: `<div class="quill-component">${desc.richText}</div>`, tags: temp });
    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('editPartnerModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
    }
  };

  return (
    <>
      <div id="editPartnerModal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 cus-modal hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">Update Partner</h3>

              <button type="button" onClick={() => {
                document.getElementById('editPartnerModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Update Partner details</h4>
                  <div id="loadFlagModal1" className='hidden flex justify-center'>
                    <Spinner />
                  </div>
                  <div className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                      <input type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Title .." onChange={handleChange} value={value.title} required />
                    </div>
                    <div>
                      <label htmlFor="subTitle" className="block mb-2 text-sm font-medium text-gray-900 ">Sub Title</label>
                      <input type="text" id="subTitle" name='subTitle' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Sub-Title .." onChange={handleChange} value={value.subTitle} required />
                    </div>
                    <div>
                      <label htmlFor="writtenBy" className="block mb-2 text-sm font-medium text-gray-900 ">Author Name</label>
                      <input type="text" id="writtenBy" name="writtenBy" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Written By .." onChange={handleChange} value={value.writtenBy} required />
                    </div>
                    <div>
                      <label htmlFor="slug" className="block mb-2 text-sm font-medium text-gray-900 ">Slug</label>
                      <input type="text" id="slug" name="slug" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Slug .." onChange={handleChange} value={value.slug} required />
                    </div>

                    <div className="admin-form">
                      <label className="block mb-2 text-sm font-medium text-gray-900">Enter Tags</label>
                      {data1.map((e, index) => {
                        return (
                          <div key={index} className="flex pt-0.5 px-0.5 mb-2 items-center">
                            <div className="flex step2-box">
                              <input type="text" id="tags" name='tags' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Name of the city" onChange={(e) => {
                                handleChange1(e, index);
                              }} value={data1[index]?.tags} required />
                            </div>
                            {index === 0 ? <div className="add-btn">
                              <button type="button" className="w-full focus:outline-none ml-2 text-lg text-white bg-green-600 rounded-md btn-hover focus:ring-4 focus:ring-purple-200 font-medium py-1.5 mb-0 " onClick={handleAddBtn}><span>+</span></button>
                            </div> : <div className="remove-btn">
                              <button type="button" className="w-full focus:outline-none ml-2 text-lg rounded-md text-white bg-red-600 btn-hover focus:ring-4 focus:ring-purple-200 font-medium py-1.5 mb-0 " onClick={() => {
                                handleRemoveBtn(index);
                              }}><span>-</span></button>
                            </div>}
                          </div>
                        );
                      })}
                    </div>

                    {prevImage.url ? <div className='relative package-delete'>
                      <h5 className='mb-2 text-black'>Uploaded Image</h5>
                      <img width={200} className="rounded-md" src={prevImage.url} alt={prevImage.url} />
                      {!loadFlag ? <svg onClick={deleteImg} xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="cursor-pointer bi bi-trash hover:text-red-600" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                      </svg> : <Spinner />}
                    </div> : <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 " htmlFor="file">Upload Image</label>
                      <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none   " id="file" type="file" name='file' onChange={handleChange} required />
                    </div>}

                    <ReactQuill
                      ref={(el) => {
                        quillObj1 = el;
                      }}
                      // theme="snow" value={value.desc.richText} placeholder="Enter Description" onChange={rteChange1} modules={{ toolbar: toolbarOptions }} />
                      theme="snow" value={desc.richText} placeholder="Enter Description" onChange={rteChange1} modules={{ toolbar: toolbarOptions }} />
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

export default EditPartnerModal;
