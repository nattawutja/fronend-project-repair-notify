"use client";
import { FaUserCircle,FaPrint,FaTrash,FaTimes,FaCheck,FaCog,FaPencilAlt,FaPaperPlane,FaCalendarAlt } from 'react-icons/fa';
import React,{ useState,useEffect } from 'react';
import { useSearchParams,useRouter } from 'next/navigation';
import Head from 'next/head';

export default function RepairNotifyView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const [data, setData] = useState(null); //ถ้า obj ใช้แบบนี้
  const [dataEmp, setDataEmpIT] = useState('');
  const [dataApprove, setDataApprove] = useState([]);  //ถ้า Array ใช้แบบนี้
  const [dataApproveIT, setDataApproveIT] = useState([]);  //ถ้า Array ใช้แบบนี้
  const [checkDataEmp, setCheckDataEmp] = useState(0);
  const [formDataEdit, setFormDataEdit] = useState({
    tbDateNoti: '',
    tbDptCode: '',
    tbDptName: '',
    tbNameEmp: '',
    tbSystemType: '',
    tbTool: '',
    tbOtherTool: '',
    tbToolNumber: '',
    tbModel: '',
    tbAssetID: '',
    tbDesc: '',
  });

  const [formDataSaveIT,setFormDataSaveIT] = useState("");
  const [fullname, setFullname] = useState("");
  const [id, setId] = useState("");
  const [description,setDescription] = useState("");
  const [descriptionFirstEmp,setDescriptionFirstEmp] = useState("");
  const [devices, setDevices] = useState([]);
  
useEffect(() => {
  const queryId = searchParams.get("id");
  const name = localStorage.getItem("fullname");
  const idStorage = localStorage.getItem("ID");

  if (!queryId) {
    return;
  }
  
  if (name) {
    setFullname(name);
  }
  if (idStorage) {
    setId(idStorage);
  }

  //console.log(idStorage);

  const fetchGetEmpIT = async () => {
    try {
      const res = await fetch(`http://localhost:8000/getDataEmpIT.php`);
      const json = await res.json();
      //console.log("ข้อมูลที่ได้:", json.data[0]);

      const splitData = json.data[0].split(",");
      //console.log(splitData,"<-------splitData");

      //console.log(splitData[0],"<------splitData[0]");
      const namesString = json.data[0];  // เอาสตริงตัวแรก

      for(let i=0;i<splitData.length;i++){
        if(splitData[i] == name){
          setCheckDataEmp(1);
        }
      }
      
      // แยกด้วย comma
      setDataEmpIT(namesString); // set state ด้วย array ของ object
      //console.log(dataEmp);
    } catch (err) {
      console.error("เกิดข้อผิดพลาด fetch index:", err);
    } 
  };

  const fetchIndex = async () => {
    try {
      const res = await fetch(`http://localhost:8000/getDataView.php?id=${queryId}`);
      const json = await res.json();
      //console.log("ข้อมูลที่ได้:", json);
      setData(json[0]);
    } catch (err) {
      console.error("เกิดข้อผิดพลาด fetch index:", err);
    } 
  };

  const fetchDataApprove = async () => {
    try {
      const resApprove = await fetch(`http://localhost:8000/getDataApprove.php?id=${queryId}`);
      const json = await resApprove.json();
      setDataApprove(json);
    } catch (err){
      console.error("เกิดข้อผิดพลาด fetchDataApprove", err);
    }
  };

  const fetchDataApproveIT = async () => {
    try {
      const resApprove = await fetch(`http://localhost:8000/getDataApproveIT.php?id=${queryId}`);
      const json = await resApprove.json();
      setDataApproveIT(json);
    } catch (err){
      console.error("เกิดข้อผิดพลาด fetchDataApprove", err);
    }finally {
      setLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      const res = await fetch("http://localhost:8000/getMasterDevices.php");
      const json = await res.json();
      setDevices(json);
    } catch (err) {
      console.error("เกิดข้อผิดพลาด fetch devices:", err);
    }
  };


  fetchIndex();
  fetchDataApprove();
  fetchDataApproveIT();
  fetchGetEmpIT();
  fetchDevices();
}, [searchParams]);  // ✅ ใส่ searchParams เพื่อรีเฟรชเวลาพารามิเตอร์เปลี่ยน

  const PrintPdf = async () => {
    const queryId = searchParams.get("id");
    if (!queryId) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/printFormPdf.php?id=${queryId}`, {
        method: "GET",
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error printing PDF:", error);
    }
  };

  const DeleteData = async () => {
    const queryId = searchParams.get("id");
    if (!queryId) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/DeleteData.php?id=${queryId}`, {
        method: "GET",
      });

      router.push(`/repairNoti/`);
    } catch (error) {
      console.error("Error printing PDF:", error);
    }
  };

  
  const openModalEditData = async () => {
    setFormDataEdit({
      tbDateNoti: data?.RepairNotifyDate,
      tbSystemType: data?.SystemType,
      tbTool: data?.DeviceTypeID,
      tbToolNumber: data?.DeviceToolID,
      tbModel: data?.Model,
      tbAssetID: data?.ToolAssetID,
      tbDesc: data?.description,
      tbOtherTool: data?.OtherTool
    });
    setShowModalEdit(true);
  };  
  
  const closeModalEdit = async () => {
    setShowModalEdit(false);
  };  

  const sendDataApproveSaveITFirst = async () => {
    const queryId = searchParams.get("id");
    if (!queryId) {
      return;
    }

    if(descriptionFirstEmp == ""){
      alert("กรุณาระบุรายละเอียดก่อนดำเนินการ");
      return false;
    }

    if(formDataSaveIT == ""){
      alert("กรุณาระบุกระบวนการทำงาน");
      return false;
    }

    try {
      const response = await fetch(`http://localhost:8000/saveApproveITFirst.php?idrp=${queryId}&description=${descriptionFirstEmp}&user_id=${id}&fullname=${fullname}&process=${formDataSaveIT}`, {
        method: "GET",
      });
      const resData = await response.json();
      // console.log(resData);
      if (resData.success) {
        alert("บันทึกสำเร็จ");
        window.location.reload();
      } else {
        alert("บันทึกล้มเหลว");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด", error);
    }
  };

  const sendDataApproveSaveIT = async () => {
    const queryId = searchParams.get("id");
    if (!queryId) {
      return;
    }

    if(description == ""){
      alert("กรุณาระบุรายละเอียดก่อนดำเนินการ");
      return false;
    }

    try {
      const response = await fetch(`http://localhost:8000/saveApproveInprogress.php?idrp=${queryId}&description=${description}&user_id=${id}&fullname=${fullname}`, {
        method: "GET",
      });
      const resData = await response.json();
      //console.log(resData);
      if (resData.success) {
        alert("บันทึกสำเร็จ");
        window.location.reload();
      } else {
        alert("บันทึกล้มเหลว");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด", error);
    }
  };

    
  const sendDataApproveSendWork = async (val,posid) => {
    const queryId = searchParams.get("id");
    if (!queryId) {
      return;
    }

    if(formDataSaveIT == ""){
      alert("กรุณาระบุกระบวนการทำงาน");
      return false;
    }

    console.log(val);
    try {
      const response = await fetch(`http://localhost:8000/saveApproveSendWork.php?id=${val}&idrp=${queryId}&posid=${posid}&process=${formDataSaveIT}`, {
        method: "GET",
      });
      const resData = await response.json();
      //console.log(resData);
      if (resData.success) {
        alert("บันทึกสำเร็จ");
        window.location.reload();
      } else {
        alert("บันทึกล้มเหลว");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด", error);
    }
  };


  const sendDataApprove = async (val,posid) => {
    const queryId = searchParams.get("id");
    if (!queryId) {
      return;
    }
    console.log(val);
    try {
      const response = await fetch(`http://localhost:8000/saveApprove.php?id=${val}&idrp=${queryId}&posid=${posid}`, {
        method: "GET",
      });
      const resData = await response.json();
      //console.log(resData);
      if (resData.success) {
        alert("บันทึกสำเร็จ");
        window.location.reload();
      } else {
        alert("บันทึกล้มเหลว");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด", error);
    }
  };

  const openModalDeleteData  = async () => {
    setOpenModalDelete(true);
    console.log(data);
  };

  const closeModalDelete = () => {
    setOpenModalDelete(false);
  }

   const handleSubmit = async (e) => {
    e.preventDefault();
    const queryId = searchParams.get("id");
    if (!queryId) {
      return;
    }

    if(formDataEdit.tbDateNoti == ""){
      alert("กรุณาระบุวันที่แจ้ง");
      return false;
    }

    if(formDataEdit.tbSystemType == ""){
      alert("กรุณาระบุประเภท");
      return false;
    }

    if(formDataEdit.tbTool == ""){
      alert("กรุณาระบุชนิดอุปกรณ์");
      return false;
    }

    if(formDataEdit.tbToolNumber == ""){
      alert("กรุณาระบุหมายเลขเครื่อง");
      return false;
    }

    if(formDataEdit.tbModel == ""){
      alert("กรุณาระบุรุ่น");
      return false;
    }
    
    if(formDataEdit.tbAssetID == ""){
      alert("กรุณาระบุรหัสทรัพย์สิน");
      return false;
    }

    if(formDataEdit.tbDesc == ""){
      alert("กรุณาระบุรายละเอียด");
      return false;
    }

    const fullname = localStorage.getItem("fullname");
    const id = localStorage.getItem("ID");
    const dptcode = localStorage.getItem("dptcode");
    const dvicode = localStorage.getItem("dvicode");

    const dataToSend = {
      ...formDataEdit,
      fullname: fullname,
      userID: id,
      dpt_code: dptcode,
      dvi_code: dvicode,
      id:queryId
    };

    try {
      const response = await fetch("http://localhost:8000/editData.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const resData = await response.json();
      //console.log(resData);
      if (resData.success) {
        alert("บันทึกสำเร็จ");
        window.location.reload();
      } else {
        alert("บันทึกล้มเหลว");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return loading ? (
    
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 pt-5 bg-white ">
    <div className="loader">
      
    </div>
  </div>
) : (
  <div className="flex flex-col items-center justify-start min-h-screen gap-4 pt-5 bg-white ">
    <Head>
      <title>รายละเอียดการแจ้งซ่อม</title>
    </Head>
    <div style={{width: '60%', minHeight: '600px'}}> {/* ปรับขนาด container */}
      <table className="w-full border border-collapse border-gray-300 rounded shadow-md table-auto">
        <thead>
          <tr className="text-sm text-black" style={{backgroundColor:"#fdd70a82"}} >
            <th className="w-1/6 px-4 py-2 text-center">โดย</th>
            <th className="w-5/6 px-4 py-2 text-left">รายละเอียด</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          <tr className="text-xs text-black align-top ">
            {/* คอลัมน์: โดย */}
        
            <td className="py-4 text-center border-r border-gray-300">
              <div className="flex flex-col items-center">
                <span className="mb-2 font-semibold">{data?.RepairNo}</span>
                <FaUserCircle size={65} className="text-sky-500" />
                <span className="mt-2">{data?.EmpName}</span>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="mb-2">
                <div className='flex'>
                <FaCalendarAlt size={13} className='text-sky-500'/>
                <span className="text-xs font-semibold ms-1">วันที่บันทึก : {data?.cvcreatedate} น.</span>
                <button  onClick={PrintPdf} title="พิมพ์" className="text-gray-600 cursor-pointer hover:text-black ms-2">
                  <FaPrint size={13} />
                </button>
                
                <button  onClick={openModalEditData} className={`text-yellow-400 ms-2 cursor-pointer ${fullname != data?.EmpName || data?.StatusWork != 0 ? "hidden" : ""}`} 
                disabled={data?.EmpName != fullname}
                >
                  <FaPencilAlt size={13} />
                </button>

                <button  onClick={openModalDeleteData} className={`text-red-600 ms-2 cursor-pointer ${fullname != data?.EmpName || data?.StatusWork != 0 ? "hidden" : ""}`} 
                disabled={data?.EmpName != fullname}
                >
                  <FaTrash size={13} />
                </button>
                </div>
               
                
                
              </div>
              {/* ตารางข้อมูลคำร้องเรียน */}
              <table className="w-full mb-4 border border-gray-300 table-auto">
                <thead>
                  <tr className="text-sm text-white " style={{backgroundColor:"#fdd70a82"}}>
                    <th colSpan={2} className="px-4 py-2 text-center text-black">ข้อมูลคำร้อง</th>
                  </tr>
                </thead>
                <tbody className="text-sm bg-white ">
                  <tr>
                    <td className="w-1/3 px-4 py-2 font-medium border border-gray-300 text-end">เลขที่คำร้องเรียน :</td>
                    <td className="px-4 py-2 border border-gray-300">{data?.RepairNo}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium border border-gray-300 text-end">วันที่ได้รับแจ้ง :</td>
                    <td className="px-4 py-2 border border-gray-300"> {data?.cvdate}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium border border-gray-300 text-end">ผู้แจ้ง :</td>
                    <td className="px-4 py-2 border border-gray-300">{data?.EmpName}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium border border-gray-300 text-end">ฝ่าย :</td>
                    <td className="px-4 py-2 border border-gray-300">{data?.dviname}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium border border-gray-300 text-end">แผนก :</td>
                    <td className="px-4 py-2 border border-gray-300">{data?.name}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium border border-gray-300 text-end">ประเภท :</td>
                    <td className="px-4 py-2 border border-gray-300">{data?.systemtype}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium border border-gray-300 text-end">ชนิดอุปกรณ์ :</td>
                    <td className="px-4 py-2 border border-gray-300">{data?.name_Device}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium border border-gray-300 text-end">รุ่น :</td>
                    <td className="px-4 py-2 border border-gray-300">{data?.Model}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium border border-gray-300 text-end">รายละเอียดอาการ :</td>
                    <td className="px-4 py-2 border border-gray-300">{data?.description}</td>
                  </tr>
                </tbody>
              </table>

              {/* ตารางผู้ตรวจสอบ */}
              <table className="w-full mb-4 border border-gray-300 table-auto">
                <thead>
                  <tr className="text-sm text-black bg-pink-200">
                    <th colSpan={6} className="px-4 py-2 text-center">ผู้ตรวจสอบ</th>
                  </tr>
                  <tr className="text-sm bg-pink-100">
                    <th className="px-4 py-2 text-center border border-gray-300">ลำดับ</th>
                    <th className="px-4 py-2 text-center border border-gray-300">ชื่อ-นามสกุล</th>
                    <th className="px-4 py-2 text-center border border-gray-300">รายละเอียด</th>
                    <th className="px-4 py-2 text-center border border-gray-300">การทำงาน</th>
                    <th className="px-4 py-2 text-center border border-gray-300">สถานะ</th>
                    <th className=""></th>
                  </tr>
                </thead>
                <tbody className="text-sm bg-white">
                  {dataApproveIT.length > 0 ? (
                    dataApproveIT.map((item, index) => (
                      <tr key={item.ApproveID}>
                        <td className="px-4 py-2 text-center border border-gray-300">{index + 1}</td>
                        <td className="px-4 py-2 text-center border border-gray-300">{item.fullName}</td>
                        <td className="px-4 py-2 text-center border border-gray-300">
                          {item.description !== "" ? (
                            item.Approve === "O" || item.Approve === "S" || item.Approve === "W" ? (
                              <label className="font-bold text-blue-600">{item.description}</label>
                            ) : (
                              <label className="font-bold text-green-600">เสร็จงาน</label>
                            )
                          ) : (
                            <input
                              name="tbDescription"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              type="text"
                              placeholder="โปรดระบุรายละเอียด"
                              className="w-full px-3 py-1 text-black transition bg-white border rounded-md shadow-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          )}
                        </td>
                        
                        <td>
                          <div className="flex justify-center">
                            { item.Approve == "Y" ? (
                              <label className="font-bold text-green-600">
                                ส่งงาน
                              </label>
                            ) : (
                              <select
                              disabled={fullname !== item.fullName}
                              name="tbSaveApprove"
                              onChange={(e) =>
                                setFormDataSaveIT(e.target.value)
                              }
                              className="w-full px-2 py-3 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">กรุณาเลือก</option>
                              <option value="O">ดำเนินการ</option>
                              <option value="S">ส่งซ่อม</option>
                              <option value="W">รออะไหล่ในการซ่อม</option>
                              <option value="Y">ส่งงาน</option>
                            </select>
                            )}
                            
                          </div>
                        </td>

                        <td className="px-4 py-2 text-center border border-gray-300">
                          <div className="flex justify-center">
                            {item.Approve === "Y" ? (
                              <label className="font-bold text-green-600">
                                Complete
                                <br />
                                {item.cvdateapprovedate} {item.cvdateapprovetime} น.
                              </label>
                            ) : item.Approve === "O" || item.Approve === "S" || item.Approve === "W"  ? (
                              <label className="font-bold text-green-600">
                                {
                                  item.Approve === "O" ? (
                                    "ดำเนินการ"
                                  ) : item.Approve === "S" ? (
                                    "ส่งซ่อม"
                                  ) : (
                                    "รออะไหร่ในการซ่อม"
                                  )
                                }
                                <br />
                                {item.cvdateprocessdate} {item.cvdateprocesstime} น.
                              </label>
                            ) : (
                              <label className="font-bold text-green-600">
                                -
                              </label>
                            )
                            }
                          </div>
                        </td>

                        <td className="px-4 py-2 text-center border border-gray-300">
                          <div className="flex justify-center">
                            {
                              item.Approve === "Y" ? (
                                <label className="font-bold">
                                  -
                                </label>
                              ) : (
                                <button
                                  onClick={() => sendDataApproveSendWork(item.ApproveID, item.pos_id)}
                                  type="button"
                                  className={`px-3 py-2 text-center text-white bg-green-600 rounded hover:bg-green-400 disabled:bg-green-600 disabled:cursor-not-allowed ${
                                    fullname !== item.fullName && id !== item.user_id ? "opacity-50" : ""
                                  }`}
                                  disabled={fullname !== item.fullName}
                                >
                                  บันทึก
                                </button>
                              ) 
                            }
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                  <tr>
                    <td className="px-4 py-2 text-center border border-gray-300">1</td>
                    <td className="px-4 py-2 text-center border border-gray-300">
                      {dataEmp}
                    </td>
                    <td className="px-4 py-2 text-center border border-gray-300">
                      <input
                        name="tbDescription"
                        value={descriptionFirstEmp}
                        onChange={(e) => setDescriptionFirstEmp(e.target.value)}
                        type="text"
                        disabled={checkDataEmp == 0}
                        placeholder="โปรดระบุรายละเอียด"
                        className={`w-full px-3 py-1 text-black transition bg-white border rounded-md shadow-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        ${checkDataEmp == 0 ? "cursor-not-allowed" : ""}`}
                      />
                    </td>
                    <td className="px-4 py-2 text-center border border-gray-300">
                      <div className="flex justify-center">
                         <div className="flex justify-center">
                            <select
                              name="tbSaveApprove"
                              value={formDataSaveIT}
                              disabled={checkDataEmp == 0}
                              onChange={(e) => setFormDataSaveIT(e.target.value)}
                              className={`w-full px-2 py-3 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                              ${checkDataEmp == 0 ? "opacity-50 cursor-not-allowed" : "" }`}
                            >
                              <option value="">กรุณาเลือก</option>
                              <option value="O">ดำเนินการ</option>
                              <option value="S">ส่งซ่อม</option>
                              <option value="W">รออะไหล่ในการซ่อม</option>
                              <option value="Y">ส่งงาน</option>
                            </select>
                          </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center border border-gray-300">
                      -
                    </td>
                      <td className="px-4 py-2 text-center border border-gray-300">
                        <div className="flex justify-center">
                          <button
                            onClick={() => sendDataApproveSaveITFirst()}
                            type="button"
                            disabled={checkDataEmp == 0}
                            className={`gap-1 flex items-center justify-content-center px-3 py-2 text-center text-white  bg-green-600 rounded hover:bg-green-400 disabled:bg-green-600 disabled:cursor-not-allowed
                            ${checkDataEmp == 0 ? "opacity-50" : "" }`}
                          >
                            บันทึก
                          </button>
                        </div>
                      </td>
                  </tr>
                )}
                  
                </tbody>
                
              </table>

              <table className="w-full mb-4 border border-gray-300 table-auto">
                <thead>
                  <tr className="text-sm text-black bg-blue-200">
                    <th colSpan={4} className="px-4 py-2 text-center">ผู้แจ้งตรวจสอบ</th>
                  </tr>
                  <tr className="text-sm bg-blue-100">
                    <th className="px-4 py-2 text-center border border-gray-300">ลำดับ</th>
                    <th className="px-4 py-2 text-center border border-gray-300">ชื่อ-นามสกุล</th>
                    <th className="px-4 py-2 text-center border border-gray-300">ตรวจสอบ</th>
                  </tr>
                </thead>
                <tbody className="text-sm bg-white">
                    {dataApprove.map((item, index) => (
                      <tr key={item.ApproveID}>
                        <td className="px-4 py-2 text-center border border-gray-300">1</td>
                        <td className="px-4 py-2 text-center border border-gray-300">{item.fullName}</td>
                        <td className="px-4 py-2 text-center border border-gray-300">
                          {item.Approve === "Y" ? (
                            <label className="font-bold text-green-600">
                              Complete<br />
                              {item.cvdateapprovedate} {item.cvdateapprovetime} น.
                            </label>
                          ) : (
                            <div className="flex justify-center">
                              <button
                                onClick={() => sendDataApprove(item.ApproveID, item.pos_id)}
                                type="button"
                                className={`flex items-center gap-2 px-3 py-2 text-center text-white bg-green-600 rounded hover:bg-green-400 disabled:bg-green-600 disabled:cursor-not-allowed ${
                                  fullname !== item.fullName && id !== item.user_id || data?.StatusWork != 4 ? "opacity-50" : ""
                                }`}
                                disabled={fullname !== item.fullName || data?.StatusWork != 4}
                              >
                                <FaCheck className="text-white" />
                                รับงาน
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}

                </tbody>
                
              </table>

            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {openModalDelete && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
          <div className="px-4 py-2 border-b border-gray-200">
            <h2 className="font-bold text-red-500 text-md">ยืนยันการลบรายการนี้</h2>
          </div>
          
          <div className="px-3 py-4 text-gray-800">
            <p className="text-black ">คุณต้องการลบข้อมูลนี้ใช่หรือไม่ ?</p>
          </div>
          
          <div className="flex justify-end px-6 py-4 space-x-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={DeleteData}
              className="flex items-center gap-2 px-4 py-1 text-white bg-green-600 rounded hover:bg-green-700"
            >
              <FaCheck className="text-white" />
              ยืนยัน
            </button>
            <button
              onClick={closeModalDelete}
              className="flex items-center gap-2 px-4 py-1 text-white bg-red-600 rounded hover:bg-red-700"

            >
              <FaTimes className="text-white" />
              ยกเลิก
            </button>
          
          </div>
        </div>

      </div>
    )}
    
    {showModalEdit && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        onClick={closeModalEdit} // ปิด modal เมื่อคลิกข้างนอกกล่อง
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white border rounded-lg"
          onClick={(e) => e.stopPropagation()} // ป้องกันคลิกในกล่องไม่ให้ปิด
        >
          {/* Head */}
          
        <div
            className="flex items-center justify-between px-4 py-2 border-b border-white"
            style={{ backgroundColor: "#feeb82" }}
          >
            {/* ฝั่งซ้าย */}
            <div>
              <h2 className="flex items-center gap-1 font-semibold text-black text-md">
                <span>แก้ไขข้อมูล</span>
                <FaCog size={18} />
              </h2>
            </div>

            {/* ฝั่งขวา */}
            <div>
              <button
                onClick={closeModalEdit}
                className="mt-2 text-black cursor-pointer hover:text-red-600 focus:outline-none"
                aria-label="Close modal"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 px-6 py-4 md:grid-cols-4">
            
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-black">วันที่</label>
              <input
                name="tbDateNoti"
                value={formDataEdit.tbDateNoti}
                onChange={(e) =>
                  setFormDataEdit({ ...formDataEdit, tbDateNoti: e.target.value })
                }
                type="date"
                className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* ชุดที่ 1 */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-black">ประเภท</label>
                <select
                  name="tbSystemType"
                  value={formDataEdit.tbSystemType}
                  onChange={(e) =>
                    setFormDataEdit({ ...formDataEdit, tbSystemType: e.target.value })
                  }
                  className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">กรุณาเลือก</option>
                  <option value="P">P/C</option>
                  <option value="A">AS/400</option>
                </select>
            </div>

            {/* ชุดที่ 2 */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-black">ชนิดอุปกรณ์</label>
                <select
                  name="tbTool"
                  value={formDataEdit.tbTool}
                  onChange={(e) =>
                    setFormDataEdit({ ...formDataEdit, tbTool: e.target.value })
                  }
                  className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">กรุณาเลือก</option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.name_Device}
                    </option>
                  ))}
                </select>
            </div>
            
            
            {/* ชุดที่ 3 */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-black">อื่นๆ</label>
              <input
                name="tbOtherTool"
                type="text"
                value={formDataEdit.tbOtherTool}
                onChange={(e) =>
                  setFormDataEdit({ ...formDataEdit, tbOtherTool: e.target.value })
                }
                placeholder="โปรดระบุ.."
                className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            

          </div>

        <div className="grid grid-cols-3 gap-4 px-6 py-4 md:grid-cols-3">
            {/* ชุดที่ 1 */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-black">หมายเลขเครื่อง<span className="text-red-500"> *กรณีที่ไม่มีให้ใส่ 0</span></label>
              <input
                name="tbToolNumber"
                type="text"
                value={formDataEdit.tbToolNumber}
                onChange={(e) =>
                  setFormDataEdit({ ...formDataEdit, tbToolNumber: e.target.value })
                }
                placeholder="โปรดระบุหมายเลขเครื่อง"
                className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* ชุดที่ 2 */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-black">รุ่น</label>
              <input
                name="tbModel"
                type="text"
                value={formDataEdit.tbModel}
                onChange={(e) =>
                  setFormDataEdit({ ...formDataEdit, tbModel: e.target.value })
                }
                placeholder="โปรดระบุรุ่นอุปกรณ์"
                className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            
            {/* ชุดที่ 3 */}
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-black">รหัสทรัพย์สิน<span className="text-red-500"> *กรณีที่ไม่มีให้ใส่ 0</span></label>
              <input
                name="tbAssetID"
                type="text"
                value={formDataEdit.tbAssetID}
                onChange={(e) =>
                  setFormDataEdit({ ...formDataEdit, tbAssetID: e.target.value })
                }
                placeholder="โปรดรุบะรหัสทรัพย์สิน"
                className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            

          </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-1">
            <label className="text-sm font-medium text-black">รายละเอียดอาการ<span className="text-red-500"> * กรุณาระบุรายละเอียดอาการให้ครบถ้วน</span></label>
            <textarea
              rows={4}
              name="tbDesc"
              value={formDataEdit.tbDesc}
              onChange={(e) =>
                setFormDataEdit({ ...formDataEdit, tbDesc: e.target.value })
              }
              placeholder="กรอกข้อความรายละเอียดที่นี่..."
              className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray">
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 text-white bg-green-600 rounded cursor-pointer hover:bg-green-800" 
            >
              <FaPaperPlane size={18} />
              <span>บันทึกรายการ</span>
            </button>
            <button
              onClick={closeModalEdit}
              className="flex items-center gap-1 px-4 py-2 text-white bg-red-500 rounded cursor-pointer hover:bg-red-600"
            >
              <FaTimes size={18} />
              <span>ยกเลิก</span>
            </button>
          </div>
        </form>
      </div>

    )}


  </div>
)}
