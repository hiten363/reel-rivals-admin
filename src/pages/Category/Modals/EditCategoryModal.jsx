import { useState } from 'react';
import useMain from '../../../hooks/useMain';
import Spinner from '../../../Util/Spinner';
import React from 'react'
import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@material-tailwind/react';
import cloneDeep from 'clone-deep';
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
    formdata.append("name", 'event');
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

function createFileList(files) {
  console.log(files);
  return new DataTransfer(files).files;
}

function checkURL(url) {
  return /\.(jpeg|jpg|jfif|pjpeg|pjp|gif|png|webp|apng|bmp|ico|svg|svgz|tiff|tif|avif)$/i.test(url);
}

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
                        <img style={{width: '120px', height: '120px', objectFit:'contain'}} src={prevImage} />
                      </>

                      <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file">Upload Image</label>
                      <input className="block w-full text-sm text-gray-900 border p-2.5 border-gray-300 rounded-lg cursor-pointer bg-gray-50  focus:outline-none" id="file" type="file" name='file' onChange={handleChange} />
                    </div>

                    {/* <>
                      <div>
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
                      </div>

                      <div className="admin-form">
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
                          }} required={!prevImage || prevImage.length === 0} />
                        </div>

                        <div className='mt-2 flex flex-wrap'>
                          {prevImage.map((e, index) => {
                            return (
                              <div key={index} className='relative mb-3 mr-3'>
                                <svg style={{ zIndex: '9999' }} onClick={() => {
                                  deleteImg(e, index);
                                  setImagePreviewExt(imagePreviewExt.filter((a, b) => b !== index));
                                }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="absolute top-0 right-0 text-red-500 bg-white cursor-pointer" viewBox="0 0 16 16">
                                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                                </svg>

                                {imagePreviewExt[index] === 'image' ? <img key={index} className='w-20 h-20' src={e} /> : <video key={index} style={{ width: '140px', height: '100px' }} controls>
                                  <source src={e} />
                                </video>}
                              </div>
                            );
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
                                  handleChange3(e, index);
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
                        }} theme="snow" value={desc?.richText} placeholder="Enter Description" onChange={rteChange1} modules={{ toolbar: toolbarOptions }} style={{ minHeight: '100px' }} />
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
                      </div>
                    </> */}
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
