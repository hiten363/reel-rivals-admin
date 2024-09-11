import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import React from 'react'
import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@material-tailwind/react';
import Spinner1 from '@/Util/Spinner1';
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
    formdata.append("name", 'terms');
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

const EditTermsModal = ({ flag, data, setRefreshFlag, refreshFlag, notify }) => {
  const { updateTerms, deleteTermsImage } = useMain();

  const [value, setValue] = useState({
    id: '',
  });
  const [desc, setDesc] = useState({
    richText: '',
    simpleText: '',
    textLength: 0
  });

  const [prevImage, setPrevImage] = useState('');
  const [loadFlag, setLoadFlag] = useState(true);

  useEffect(() => {
    if (data) {
      // console.log(data);
      if (Object.keys(data).length > 0) {
        setValue({ id: data._id });
        // console.log(data.desc);
        setDesc({
          richText: data.desc,
          simpleText: data.desc,
          textLength: data.desc.length
        });
      }
    }
  }, [data, flag]);

  const rteChange1 = (content, delta, source, editor) => {
    handleChange2({
      richText: editor.getHTML(),
      simpleText: editor.getText(),
      textLength: editor.getLength()
    });
  };

  const handleChange2 = (e) => {
    setDesc({
      richText: e.richText,
      simpleText: e.simpleText,
      textLength: e.textLength
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(value);
    // console.log(desc);

    if (convert(desc.richText).trim() === "") {
      alert('Description is required');
      return;
    }

    const ans = await updateTerms({ ...value, desc: `<div className="quill-component">${desc.richText}</div>` });
    if (ans.status) {
      notify('success', ans.message);
      setRefreshFlag(!refreshFlag);
      document.getElementById('editTermsModal').classList.toggle('hidden');
    }
    else {
      notify('error', ans.message);
    }
  };

  return (
    <>
      <div id="editTermsModal" tabIndex="-1" className="fixed top-0 left-0 right-0 z-50 cus-modal hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        {!loadFlag ? <Spinner1 /> : <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Update Terms and Conditions
              </h3>
              <button type="button" onClick={() => {
                document.getElementById('editTermsModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Update details</h4>

                  <div id="loadFlagModal1" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className="grid px-0.5 py-0.5 mb-6">
                    <ReactQuill
                      ref={(el) => {
                        quillObj1 = el;
                      }}
                      theme="snow" value={desc.richText} placeholder="Enter Description" onChange={rteChange1} modules={{ toolbar: toolbarOptions }} />
                  </div>

                  <div className='text-right'>
                    <Button color="green" type="submit" children="Submit">Submit</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>}
      </div>
    </>
  );
};

export default EditTermsModal;
