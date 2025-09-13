"use client";
import { FaUserCircle,FaPrint,FaTrash,FaTimes,FaCheck } from 'react-icons/fa';
import React,{ useState,useEffect } from 'react';
import { useSearchParams,useRouter } from 'next/navigation';
import Head from 'next/head';

export default function RepairNotifyView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [data, setData] = useState(null); //ถ้า obj ใช้แบบนี้
  const [dataApprove, setDataApprove] = useState([]);  //ถ้า Array ใช้แบบนี้
  const [formData, setFormData] = useState({
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
  const [fullname, setFullname] = useState("");

useEffect(() => {
  const queryId = searchParams.get("id");
  const name = localStorage.getItem("fullname");

  if (!queryId) {
    return;
  }
  
  if (name) {
    setFullname(name);
  }

  const fetchIndex = async () => {
    try {
      const res = await fetch(`http://localhost:8000/getDataView.php?id=${queryId}`);
      const json = await res.json();
      console.log("ข้อมูลที่ได้:", json);
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
    }finally {
      setLoading(false);
    }
  };

  fetchIndex();
  fetchDataApprove();

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
  };

  const closeModalDelete = () => {
    setOpenModalDelete(false);
  }

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
                <span>{data?.EmpName}</span>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="mb-2">
                <span className="text-xs font-semibold">วันที่บันทึก : {data?.cvcreatedate} น.</span>
                <button  onClick={PrintPdf} title="พิมพ์" className="text-gray-600 cursor-pointer hover:text-black ms-2">
                  <FaPrint size={13} />
                </button>
                <button  onClick={openModalDeleteData} className={`text-red-600 ms-2 cursor-pointer ${fullname != data?.EmpName ? "hidden" : ""}`} 
                disabled={data?.EmpName != fullname}
                >
                  <FaTrash size={13} />
                </button>

              

              </div>

              {/* ตารางข้อมูลคำร้องเรียน */}
              <table className="w-full mb-4 border border-gray-300 table-auto">
                <thead>
                  <tr className="text-sm text-white " style={{backgroundColor:"#fdd70a82"}}>
                    <th colSpan={2} className="px-4 py-2 text-center text-black">ข้อมูลคำร้อง</th>
                  </tr>
                </thead>
                <tbody className="text-sm bg-white">
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
                    <td className="px-4 py-2 font-medium border border-gray-300 text-end">แผนก :</td>
                    <td className="px-4 py-2 border border-gray-300">{data?.DptName}</td>
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
                  <tr className="text-sm text-black bg-blue-200">
                    <th colSpan={3} className="px-4 py-2 text-center">ผู้ตรวจสอบ</th>
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
                      <td className="px-4 py-2 text-center border border-gray-300">{index + 1}</td>
                      <td className="px-4 py-2 text-center border border-gray-300">{item.fullName}</td>
                      <td className="px-4 py-2 text-center border border-gray-300">
                        {
                          item.Approve == "Y" ? 
                          ( 
                            <label className="font-bold text-green-600">Complete<br></br>{item.cvdateapprovedate} {item.cvdateapprovetime} น.</label>
                          ) : 
                          (
                            <button onClick={() => (sendDataApprove(item.ApproveID,item.pos_id))} type="button" className={`px-3 py-2 text-center text-white bg-green-600 rounded hover:bg-green-400 disabled:bg-green-600 disabled:cursor-not-allowed ${fullname != item.fullName ? 'opacity-50' : '' }
                            `}  
                            disabled={fullname != item.fullName}>
                              ส่งงาน / รับงาน
                            </button>
                          )
                        }
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
    

  </div>
)}
