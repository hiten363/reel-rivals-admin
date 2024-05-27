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

const imageHandler = async () => {
  const input = document.createElement('input');

  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    document.getElementById('loadFlagModal').classList.toggle('hidden');
    var file = input.files[0];

    console.log(file);
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

function checkURL(url) {
  return /\.(jpeg|jpg|jfif|pjpeg|pjp|gif|png|webp|apng|bmp|ico|svg|svgz|tiff|tif|avif)$/i.test(url);
}

const AddCategoryModal = (props) => {
  const { postCategory, uploadImage } = useMain();

  const [value, setValue] = useState({
    title: '',
    file: ''
    // subTitle: '',
    // subTitle1: '',
    // subTitle2: '',
    // images: [],
    // desc: {
    //   richText: '',
    //   simpleText: '',
    //   textLength: 0
    // },
    // keyHighlightImg1: '',
    // keyHighlightTitle1: '',
    // keyHighlightDesc1: '',
    // keyHighlightImg2: '',
    // keyHighlightTitle2: '',
    // keyHighlightDesc2: '',
    // keyHighlightImg3: '',
    // keyHighlightTitle3: '',
    // keyHighlightDesc3: '',
    // keyHighlightImg4: '',
    // keyHighlightTitle4: '',
    // keyHighlightDesc4: ''
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [imagePreviewExt, setImagePreviewExt] = useState([]);
  const [uploadFlag, setUploadFlag] = useState(false);

  var [data1, setData1] = useState([{
    tags: ''
  }]);

  var [data2, setData2] = useState([{
    imgDesc: ''
  }]);

  const rteChange1 = (content, delta, source, editor) => {
    handleChange({
      richText: editor.getHTML(),
      simpleText: editor.getText(),
      textLength: editor.getLength()
    }, "desc");
  };

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

  const handleChange2 = (e, index) => {
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
    setUploadFlag(true);

    // if (data2.length !== value.images?.length) {
    //   alert('Image description count must be same as of uploaded images count');
    //   return;
    // }

    // if (convert(value.desc.richText).trim() === "") {
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

    console.log(value);

    const ans = await postCategory({
      ...value
    });

    if (ans.status) {
      setValue({
        title: '',
        file: ''
      });

      e?.target?.reset();
      // window.location.reload();
      props.notify('success', ans.message);
      props.setRefreshFlag(!props.refreshFlag);
      document.getElementById('addCategoryModal').classList.toggle('hidden');
      setUploadFlag(false);
    }
    else {
      props.notify('error', ans.message);
    }
  };

  return (
    <>
      <div id="addCategoryModal" tabIndex="-1" className="fixed cus-modal top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
        <div className="cus-modal1 relative w-full h-full max-w-7xl md:h-auto">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-5 border-b rounded-t ">
              <h3 className="text-xl font-medium text-gray-900 ">
                Add new category
              </h3>

              <button type="button" onClick={() => {
                document.getElementById('addCategoryModal').classList.toggle('hidden');
              }} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="bus-form">
                  <h4 className="text-xl text-center mb-4 font-bold">Enter Category details</h4>

                  <div id="loadFlagModal" className='hidden flex justify-center'>
                    <Spinner />
                  </div>

                  <div className="grid gap-6 px-0.5 py-0.5 mb-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 ">Title</label>
                      <input type="text" id="title" name="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Title .." onChange={handleChange} value={value.title} required />
                    </div>

                    {/* <div>
                      <label htmlFor="subTitle" className="block mb-2 text-sm font-medium text-gray-900 ">Sub Title</label>
                      <input type="text" id="subTitle" name='subTitle' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Sub-Title .." onChange={handleChange} value={value.subTitle} required />
                    </div>

                    <div>
                      <label htmlFor="subTitle1" className="block mb-2 text-sm font-medium text-gray-900 ">Sub Title 2</label>
                      <input type="text" id="subTitle1" name='subTitle1' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Sub-Title 2 .." onChange={handleChange} value={value.subTitle1} required />
                    </div>

                    <div>
                      <label htmlFor="subTitle2" className="block mb-2 text-sm font-medium text-gray-900 ">Sub Title 3</label>
                      <input type="text" id="subTitle2" name='subTitle2' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Enter Sub-Title 3 .." onChange={handleChange} value={value.subTitle2} required />
                    </div> */}

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file">Upload Image</label>
                      <input className="block w-full text-sm text-gray-900 border p-2.5 border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" id="file" type="file" name='file' onChange={handleChange} required />
                    </div>

                    {/* <div className="admin-form">
                      <label className="block mb-2 text-sm font-medium text-gray-900">Enter Tags</label>

                      {data1.map((e, index) => {
                        return (
                          <div key={index} className="flex pt-0.5 px-0.5 mb-2 items-center">
                            <div className="flex step2-box">
                              <input type="text" name='tags' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Tag" onChange={(e) => {
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

                    <div className="admin-form">
                      <label className="block mb-2 text-sm font-medium text-gray-900">Upload Images</label>

                      <div className="flex step2-box">
                        <input type="file" multiple name='images' id='images' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={(e) => {
                          handleChange(e);
                        }} required />
                      </div>

                      <div className='mt-2 flex flex-wrap'>
                        {imagePreview.map((e, index) => {
                          if (imagePreviewExt[index] === 'image') {
                            return (
                              <img key={index} className='w-20' src={e} />
                            );
                          }
                          else {
                            return (
                              <video key={index} style={{ width: '140px', height: '100px' }} controls>
                                <source src={e} />
                              </video>
                            );
                          }
                        })}
                      </div>
                    </div>

                    <div className="admin-form">
                      <label className="block mb-2 text-sm font-medium text-gray-900">Enter Image Description</label>

                      {data2.map((e, index) => {
                        return (
                          <div key={index} className="flex pt-0.5 px-0.5 mb-2 items-center">
                            <div className="flex step2-box">
                              <input type="text" name='imgDesc' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Image Description" onChange={(e) => {
                                handleChange2(e, index);
                              }} value={data2[index]?.imgDesc} required />
                            </div>

                            {index === 0 ? <div className="add-btn">
                              <Button onClick={handleAddBtn1} children="+" size='sm' className='text-xl py-1 w-[42px] text-center ml-1' color="green">+</Button>
                            </div> : <div className="remove-btn">
                              <Button onClick={() => { handleRemoveBtn1(index); }} children="-" size='sm' className='text-xl py-1 w-[42px] ml-1' color="red">-</Button>
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

                    <div>
                      <h4 className='font-semibold text-xl mb-2'>Key Highlight 1</h4>

                      <div>
                        <div className='mb-2'>
                          {value?.keyHighlightImg1 && value?.keyHighlightImg1 !== '' && <div>
                            <img src={value?.keyHighlightImg1} />
                          </div>}

                          <label className="block mb-2 text-sm font-medium text-gray-900">Upload Image</label>

                          <div className="flex step2-box">
                            <input type="file" name='keyHighlightImg1' id='keyHighlightImg1' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={(e) => {
                              handleChange(e);
                            }} required />
                          </div>
                        </div>

                        <div className='mb-2'>
                          <label className="block mb-2 text-sm font-medium text-gray-900">Enter Title</label>

                          <div className="flex step2-box">
                            <input type="text" name='keyHighlightTitle1' id='keyHighlightTitle1' value={value?.keyHighlightTitle1} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={(e) => {
                              handleChange(e);
                            }} required />
                          </div>
                        </div>

                        <div className='mb-2'>
                          <label className="block mb-2 text-sm font-medium text-gray-900">Enter Description</label>

                          <div className="flex step2-box">
                            <textarea id='keyHighlightDesc1' name='keyHighlightDesc1' value={value?.keyHighlightDesc1} onChange={(g) => {
                              handleChange(g);
                            }} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Description..." required></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className='font-semibold text-xl mb-2'>Key Highlight 2</h4>

                      <div>
                        <div className='mb-2'>
                          {value?.keyHighlightImg2 && value?.keyHighlightImg2 !== '' && <div>
                            <img src={value?.keyHighlightImg2} />
                          </div>}

                          <label className="block mb-2 text-sm font-medium text-gray-900">Upload Image</label>

                          <div className="flex step2-box">
                            <input type="file" name='keyHighlightImg2' id='keyHighlightImg2' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={(e) => {
                              handleChange(e);
                            }} required />
                          </div>
                        </div>

                        <div className='mb-2'>
                          <label className="block mb-2 text-sm font-medium text-gray-900">Enter Title</label>

                          <div className="flex step2-box">
                            <input type="text" name='keyHighlightTitle2' id='keyHighlightTitle2' value={value?.keyHighlightTitle2} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={(e) => {
                              handleChange(e);
                            }} required />
                          </div>
                        </div>

                        <div className='mb-2'>
                          <label className="block mb-2 text-sm font-medium text-gray-900">Enter Description</label>

                          <div className="flex step2-box">
                            <textarea id='keyHighlightDesc2' name='keyHighlightDesc2' value={value?.keyHighlightDesc2} onChange={(g) => {
                              handleChange(g);
                            }} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Description..." required></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className='font-semibold text-xl mb-2'>Key Highlight 3</h4>

                      <div>
                        <div className='mb-2'>
                          {value?.keyHighlightImg3 && value?.keyHighlightImg3 !== '' && <div>
                            <img src={value?.keyHighlightImg3} />
                          </div>}

                          <label className="block mb-2 text-sm font-medium text-gray-900">Upload Image</label>

                          <div className="flex step2-box">
                            <input type="file" name='keyHighlightImg3' id='keyHighlightImg3' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={(e) => {
                              handleChange(e);
                            }} required />
                          </div>
                        </div>

                        <div className='mb-2'>
                          <label className="block mb-2 text-sm font-medium text-gray-900">Enter Title</label>

                          <div className="flex step2-box">
                            <input type="text" name='keyHighlightTitle3' id='keyHighlightTitle3' value={value?.keyHighlightTitle3} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={(e) => {
                              handleChange(e);
                            }} required />
                          </div>
                        </div>

                        <div className='mb-2'>
                          <label className="block mb-2 text-sm font-medium text-gray-900">Enter Description</label>

                          <div className="flex step2-box">
                            <textarea id='keyHighlightDesc3' name='keyHighlightDesc3' value={value?.keyHighlightDesc3} onChange={(g) => {
                              handleChange(g);
                            }} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Description..." required></textarea>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className='font-semibold text-xl mb-2'>Key Highlight 4</h4>

                      <div>
                        <div className='mb-2'>
                          {value?.keyHighlightImg4 && value?.keyHighlightImg4 !== '' && <div>
                            <img src={value?.keyHighlightImg4} />
                          </div>}

                          <label className="block mb-2 text-sm font-medium text-gray-900">Upload Image</label>

                          <div className="flex step2-box">
                            <input type="file" name='keyHighlightImg4' id='keyHighlightImg4' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={(e) => {
                              handleChange(e);
                            }} required />
                          </div>
                        </div>

                        <div className='mb-2'>
                          <label className="block mb-2 text-sm font-medium text-gray-900">Enter Title</label>

                          <div className="flex step2-box">
                            <input type="text" name='keyHighlightTitle4' id='keyHighlightTitle4' value={value?.keyHighlightTitle4} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-blue-500 block w-full p-2.5 " onChange={(e) => {
                              handleChange(e);
                            }} required />
                          </div>
                        </div>

                        <div className='mb-2'>
                          <label className="block mb-2 text-sm font-medium text-gray-900">Enter Description</label>

                          <div className="flex step2-box">
                            <textarea id='keyHighlightDesc4' name='keyHighlightDesc4' value={value?.keyHighlightDesc4} onChange={(g) => {
                              handleChange(g);
                            }} rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Description..." required></textarea>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div className='text-right'>
                    <Button color="green" disabled={uploadFlag} type={uploadFlag ? "button" : "submit"} children="Submit">{uploadFlag ? "Uploading .." : "Submit"}</Button>
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

export default AddCategoryModal;
