import React from 'react';
import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Spinner from '../../../Util/Spinner';
import { Button } from '@material-tailwind/react';
import { baseUrl } from '@/context/MainState';
import { convert } from 'html-to-text';

var quillObj1;
var quillObj2;
var quillObj3;
var quillObj4;

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

    const range2 = quillObj2.getEditorSelection();

    if (range2) {
      quillObj2.getEditor().insertEmbed(range2.index, 'image', url);
      document.getElementById('loadFlagModal').classList.toggle('hidden');
    }

    const range3 = quillObj3.getEditorSelection();

    if (range3) {
      quillObj3.getEditor().insertEmbed(range3.index, 'image', url);
      document.getElementById('loadFlagModal').classList.toggle('hidden');
    }

    const range4 = quillObj4.getEditorSelection();

    if (range4) {
      quillObj4.getEditor().insertEmbed(range4.index, 'image', url);
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

const AddAboutModal = (props) => {
  const { postAbout, uploadImage } = useMain();

  const [value, setValue] = useState({
    title: '',
    img: '',
    desc: '',
    subImg1: '',
    subDesc1: '',
    subImg2: '',
    subDesc2: '',
    subImg3: '',
    subDesc3: ''
  });

  const rteChange1 = (content, delta, source, editor) => {
    handleChange({
      richText: editor.getHTML(),
      simpleText: editor.getText(),
      textLength: editor.getLength()
    }, "desc");
  };

  const rteChange2 = (content, delta, source, editor) => {
    handleChange({
      richText: editor.getHTML(),
      simpleText: editor.getText(),
      textLength: editor.getLength()
    }, "subDesc1");
  };

  const rteChange3 = (content, delta, source, editor) => {
    handleChange({
      richText: editor.getHTML(),
      simpleText: editor.getText(),
      textLength: editor.getLength()
    }, "subDesc2");
  };

  const rteChange4 = (content, delta, source, editor) => {
    handleChange({
      richText: editor.getHTML(),
      simpleText: editor.getText(),
      textLength: editor.getLength()
    }, "subDesc3");
  };

  const handleChange = async (e, type = '') => {
    console.log(type);
    if (type === 'desc') {
      setValue({
        ...value, "desc": {
          richText: e.richText,
          simpleText: e.simpleText,
          textLength: e.textLength
        }
      });
    }
    else if (type === 'subDesc1') {
      setValue({
        ...value, "subDesc1": {
          richText: e.richText,
          simpleText: e.simpleText,
          textLength: e.textLength
        }
      });
    }
    else if (type === 'subDesc2') {
      setValue({
        ...value, "subDesc2": {
          richText: e.richText,
          simpleText: e.simpleText,
          textLength: e.textLength
        }
      });
    }
    else if (type === 'subDesc3') {
      setValue({
        ...value, "subDesc3": {
          richText: e.richText,
          simpleText: e.simpleText,
          textLength: e.textLength
        }
      });
    }
    else {
      if (e.target.name !== 'img' && e.target.name !== "subImg1" && e.target.name !== "subImg2" && e.target.name !== "subImg3") {
        setValue({ ...value, [e.target.name]: e.target.value });
      }
      else {
        let ans = await uploadImage({ file: e.target.files[0] });

        setValue({ ...value, [e.target.name]: ans.data });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(value);

    // if(convert(value.desc.richText).trim()==="")
    // {
    //   alert('Description is required');
    //   return;
    // }

    try {
      const ans = await postAbout({ ...value, desc: `<div className="quill-component">${value.desc.richText}</div>`, subDesc1: `<div className="quill-component">${value.subDesc1.richText}</div>`, subDesc2: `<div className="quill-component">${value.subDesc2.richText}</div>`, subDesc3: `<div className="quill-component">${value.subDesc3.richText}</div>` });
      console.log(ans);

      if (ans.status) {
        setValue({
          title: '',
          img: '',
          desc: '',
          subImg1: '',
          subDesc1: '',
          subImg2: '',
          subDesc2: '',
          subImg3: '',
          subDesc3: ''
        });

        props.notify('success', ans.message);
        // props.setRefreshFlag(!props.refreshFlag);
        document.getElementById('addAboutModal').classList.toggle('hidden');
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
      <div id="addAboutModal" tabIndex="-1" className="fixed cus-modal top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Add About Us Content
              </h3>

              <button type="button" onClick={() => {
                document.getElementById('addAboutModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Enter Content</h4>
                  <div id="loadFlagModal" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                      <input type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Title .." onChange={handleChange} value={value.title} required />
                    </div>

                    <div>
                      {value?.img && value?.img !== "" && <span className='mb-2'>Preview</span>}
                      {value?.img && value?.img !== "" && <img style={{ width: '100px', height: '100px' }} className='mb-2' src={value?.img} />}

                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="img">Upload Image</label>
                      <input className="block w-full text-sm text-gray-900 border p-2.5 border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" id="img" type="file" name='img' onChange={handleChange} required />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file">Description</label>
                      <ReactQuill ref={(el) => {
                        quillObj1 = el;
                      }} theme="snow" value={value.desc.richText} placeholder="Enter Description" onChange={rteChange1} modules={{ toolbar: toolbarOptions }} style={{ minHeight: '100px' }} />
                    </div>

                    <div>
                    {value?.subImg1 && value?.subImg1 !== "" && <span className='mb-2'>Preview</span>}
                      {value?.subImg1 && value?.subImg1 !== "" && <img style={{ width: '100px', height: '100px' }} className='mb-2' src={value?.subImg1} />}

                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="subImg1">Upload Sub Image 1</label>
                      <input className="block w-full text-sm text-gray-900 border p-2.5 border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" id="subImg1" type="file" name='subImg1' onChange={handleChange} required />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file">Sub Description 1</label>
                      <ReactQuill ref={(el) => {
                        quillObj2 = el;
                      }} theme="snow" value={value.subDesc1.richText} placeholder="Enter Description" onChange={rteChange2} modules={{ toolbar: toolbarOptions }} style={{ minHeight: '100px' }} />
                    </div>

                    <div>
                      {value?.subImg2 && value?.subImg2 !== "" && <span className='mb-2'>Preview</span>}
                      {value?.subImg2 && value?.subImg2 !== "" && <img style={{ width: '100px', height: '100px' }} className='mb-2' src={value?.subImg2} />}

                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="subImg2">Upload Sub Image 2</label>
                      <input className="block w-full text-sm text-gray-900 border p-2.5 border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" id="subImg2" type="file" name='subImg2' onChange={handleChange} required />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file">Sub Description 2</label>
                      <ReactQuill ref={(el) => {
                        quillObj3 = el;
                      }} theme="snow" value={value.subDesc2.richText} placeholder="Enter Description" onChange={rteChange3} modules={{ toolbar: toolbarOptions }} style={{ minHeight: '100px' }} />
                    </div>

                    <div>
                      {value?.subImg3 && value?.subImg3 !== "" && <span className='mb-2'>Preview</span>}
                      {value?.subImg3 && value?.subImg3 !== "" && <img style={{ width: '100px', height: '100px' }} className='mb-2' src={value?.subImg3} />}

                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="subImg3">Upload Sub Image 3</label>
                      <input className="block w-full text-sm text-gray-900 border p-2.5 border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" id="subImg3" type="file" name='subImg3' onChange={handleChange} required />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file">Sub Description 3</label>
                      <ReactQuill ref={(el) => {
                        quillObj4 = el;
                      }} theme="snow" value={value.subDesc3.richText} placeholder="Enter Description" onChange={rteChange4} modules={{ toolbar: toolbarOptions }} style={{ minHeight: '100px' }} />
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

export default AddAboutModal;
