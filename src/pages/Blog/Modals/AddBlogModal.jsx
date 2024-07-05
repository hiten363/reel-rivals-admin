import React from 'react';
import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../../../Util/Spinner';
import { Button } from '@material-tailwind/react';
import { baseUrl } from '@/context/MainState';
import { convert } from 'html-to-text';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  writtenBy: Yup.string().notRequired().matches(/^\D*$/, 'Author Name should not contain integers').max(30),
});

var quillObj1;

const imageHandler = async () => {
  const input = document.createElement('input');

  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    document.getElementById('loadFlagModal').classList.toggle('hidden');
    var file = input.files[0];

    let formdata = new FormData();
    formdata.append("file", file);

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
      document.getElementById('loadFlagModal').classList.toggle('hidden');
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

const AddBlogModal = (props) => {
  const { postBlog } = useMain();

  const [value, setValue] = useState({
    title: '',
    subTitle: '',
    writtenBy: '',
    file: '',
    desc: {
      richText: '',
      simpleText: '',
      textLength: 0
    },
    slug: ''
  });

  var [data1, setData1] = useState([{
    tags: ''
  }]);

  const rteChange1 = (content, delta, source, editor) => {
    handleChange({
      richText: editor.getHTML(),
      simpleText: editor.getText(),
      textLength: editor.getLength()
    }, "desc");
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
    console.log(value);

    if(convert(value.desc.richText).trim()==="")
    {
      alert('Description is required');
      return;
    }

    let temp = [];
    for (let i of data1) {
      temp.push(i.tags);
    }
    console.log(temp);

    try {
      let validate=await schema.validate(value);
      const ans = await postBlog({ ...value, desc: `<div className="quill-component">${value.desc.richText}</div>`, tags: temp });
      console.log(ans);
  
      if (ans.status) {
        setValue({
          title: '',
          subTitle: '',
          writtenBy: '',
          file: '',
          desc: {
            richText: '',
            simpleText: '',
            textLength: 0
          },
          slug: ''
        });
  
        setData1([{
          tags: ''
        }]);
  
        props.notify('success', ans.message);
        // props.setRefreshFlag(!props.refreshFlag);
        document.getElementById('addBlogModal').classList.toggle('hidden');
        window.location.reload();
      }
      else {
        props.notify('error', ans.message);
      }
    } catch (error) {
      props.notify('error', error?.message?.replace('writtenBy', 'Author Name'));
    }
  };

  return (
    <>
      <div id="addBlogModal" tabIndex="-1" className="fixed cus-modal top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Add new blog
              </h3>
              <button type="button" onClick={() => {
                document.getElementById('addBlogModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Enter Blog details</h4>
                  <div id="loadFlagModal" className='hidden flex justify-center'>
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
                      <input type="text" id="writtenBy" name="writtenBy" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Written By .." onChange={handleChange} value={value.writtenBy} />
                    </div>
                    <div>
                      <label htmlFor="slug" className="block mb-2 text-sm font-medium text-gray-900 ">Slug</label>
                      <input type="text" id="slug" name="slug" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Slug .." onChange={handleChange} value={value.slug} required />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file">Upload Image</label>
                      <input className="block w-full text-sm text-gray-900 border p-2.5 border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" id="file" type="file" name='file' onChange={handleChange} required />
                    </div>

                    <div className="admin-form">
                      <label className="block mb-2 text-sm font-medium text-gray-900">Enter Tags</label>

                      {data1.map((e, index) => {
                        return (
                          <div key={index} className="flex pt-0.5 px-0.5 mb-2 items-center">
                            <div className="flex step2-box">
                              <input type="text" id="tags" name='tags' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Tag" onChange={(e) => {
                                handleChange1(e, index);
                              }} value={data1[index]?.tags} required />
                            </div>

                            {index === 0 ? <div className="add-btn">
                              <Button onClick={handleAddBtn} children="+" size='sm' className='text-xl py-1 w-[42px] text-center ml-1' color="green">+</Button>
                            </div> : <div className="remove-btn">
                              <Button onClick={() => { handleRemoveBtn(index); }} children="-" size='sm' className='text-xl py-1 w-[42px] ml-1' color="red">-</Button>
                            </div>}
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file">Description</label>
                      <ReactQuill ref={(el) => {
                        quillObj1 = el;
                      }} theme="snow" value={value.desc.richText} placeholder="Enter Description" onChange={rteChange1} modules={{ toolbar: toolbarOptions }} style={{ minHeight: '100px' }} />
                    </div>
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

export default AddBlogModal;
