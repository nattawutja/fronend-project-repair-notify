"use client";
import Image from "next/image";
import { FaTimes,FaCog,FaPaperPlane,FaSearch,FaFileExport,FaPrint} from 'react-icons/fa';
import React,{ useState,useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function RepairNotify() {

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [countData, setShowcountData] = useState(0);
  const [data, setData] = useState();

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

  const [formDataSearch, setFormDataSearch] = useState({
    tbDateNotiStartSearch: '',
    tbDateNotiEndSearch: '',
    tbDptCodeSearch: '',
    tbDptNameSearch: '',
    tbSystemTypeSearch: '',
    tbToolSearch: '',
    tbOtherToolSearch: '',
    tbToolNumberSearch: '',
    tbModelSearch: '',
    tbAssetIDSearch: '',
    tbDocNoSearch: '',
    tbStatusWorkSearch: '',
    tbEmpNameSearch: '',
    tbpage: 0
  });

  const [devices, setDevices] = useState([]);
  const [departments, setDepartment] = useState([]);

  const [currentPage, setCurrentPage] = useState(0); // 0-based index

  // คำนวณข้อมูลที่จะแสดงในแต่ละหน้า
  const itemsPerPage = 15;
  const offset = currentPage * itemsPerPage;
  const currentItems = data;
  // คำนวณจำนวนหน้าจาก countData
  const pageCount = Math.ceil(countData / itemsPerPage);

  useEffect(() => {
    // กรองให้เหลือเฉพาะตัวเลข
    const onlyNumbers = formData.tbToolNumber.replace(/[^0-9]/g, "");
    if (formData.tbToolNumber !== onlyNumbers) {
      setFormData((prev) => ({
        ...prev,
        tbToolNumber: onlyNumbers,
      }));
    }
  }, [formData.tbToolNumber]);

  useEffect(() => {

    const fetchIndex = async () => {
      try {
        const res = await fetch("http://localhost:8000/index.php");
        const json = await res.json();
        setData(json.data);
        setShowcountData(json.countdata);

      } catch (err) {
        console.error("เกิดข้อผิดพลาด fetch index:", err);
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

    const fetchDepartment = async () => {
      try {
        const res = await fetch("http://localhost:8000/getMasterDpt.php");
        const json = await res.json();
        setDepartment(json);
      } catch (err) {
        console.error("เกิดข้อผิดพลาด fetch department:", err);
      }
    };

  fetchIndex();
  fetchDevices();
  fetchDepartment();
  }, []);

  const openModalAdd = async () => {
    setShowModalAdd(true);
  };

  const closeModalAdd = async () => {
    setShowModalAdd(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(formData.tbDateNoti == ""){
      alert("กรุณาระบุวันที่แจ้ง");
      return false;
    }

    if(formData.tbNameEmp == ""){
      alert("กรุณาระบุชื่อพนักงาน");
      return false;
    }

    if(formData.tbSystemType == ""){
      alert("กรุณาระบุประเภท");
      return false;
    }

    if(formData.tbTool == ""){
      alert("กรุณาระบุชนิดอุปกรณ์");
      return false;
    }

    if(formData.tbToolNumber == ""){
      alert("กรุณาระบุหมายเลขเครื่อง");
      return false;
    }

    if(formData.tbModel == ""){
      alert("กรุณาระบุรุ่น");
      return false;
    }
    
    if(formData.tbAssetID == ""){
      alert("กรุณาระบุรหัสทรัพย์สิน");
      return false;
    }

    if(formData.tbDesc == ""){
      alert("กรุณาระบุรายละเอียด");
      return false;
    }

    const fullname = localStorage.getItem("fullname");
    const id = localStorage.getItem("ID");

    const dataToSend = {
      ...formData,
      fullname: fullname,
      userID: id
    };

    try {
      const response = await fetch("http://localhost:8000/save.php", {
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

  const SearchData = async (e) => {
    e.preventDefault();
    //console.log(formDataSearch);

    try {
      const params = new URLSearchParams({
        tbDocNoSearch: formDataSearch.tbDocNoSearch,
        tbDateNotiStartSearch: formDataSearch.tbDateNotiStartSearch,
        tbDateNotiEndSearch: formDataSearch.tbDateNotiEndSearch,
        tbDptNameSearch: formDataSearch.tbDptNameSearch,
        tbDptCodeSearch: formDataSearch.tbDptCodeSearch,
        tbSystemTypeSearch: formDataSearch.tbSystemTypeSearch,
        tbToolSearch: formDataSearch.tbToolSearch,
        tbToolNumberSearch: formDataSearch.tbToolNumberSearch,
        tbModelSearch: formDataSearch.tbModelSearch,
        tbAssetIDSearch: formDataSearch.tbAssetIDSearch,
        tbStatusWorkSearch: formDataSearch.tbStatusWorkSearch,
        tbEmpNameSearch: formDataSearch.tbEmpNameSearch
      });

      const response = await fetch(`http://localhost:8000/searchData.php?${params}`, {
        method: "GET",
      });

      const data = await response.json();

      setData(data.data);
      setShowcountData(data.countdata);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด", error);
    }
  };

  const exportExcel = async () => {
    try {

      // เปลี่ยนเมาส์เป็น loading
      document.body.style.cursor = 'wait';

      const params = new URLSearchParams({
        tbDocNoSearch: formDataSearch.tbDocNoSearch,
        tbDateNotiStartSearch: formDataSearch.tbDateNotiStartSearch,
        tbDateNotiEndSearch: formDataSearch.tbDateNotiEndSearch,
        tbDptNameSearch: formDataSearch.tbDptNameSearch,
        tbDptCodeSearch: formDataSearch.tbDptCodeSearch,
        tbSystemTypeSearch: formDataSearch.tbSystemTypeSearch,
        tbToolSearch: formDataSearch.tbToolSearch,
        tbToolNumberSearch: formDataSearch.tbToolNumberSearch,
        tbModelSearch: formDataSearch.tbModelSearch,
        tbAssetIDSearch: formDataSearch.tbAssetIDSearch,
        tbStatusWorkSearch: formDataSearch.tbStatusWorkSearch,
        tbEmpNameSearch: formDataSearch.tbEmpNameSearch
      });

      const response = await fetch(`http://localhost:8000/exportExcel.php?${params}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('การดาวน์โหลดล้มเหลว');
      }

      const blob = await response.blob();

      // สร้าง URL และ trigger ดาวน์โหลด
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // ตั้งชื่อไฟล์
      link.download = 'RepairNoifyExcel.xlsx';

      document.body.appendChild(link);
      link.click();

      // ล้างหลังใช้
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดาวน์โหลด:', error);
    }finally {
    // เปลี่ยนเมาส์กลับเป็นปกติ ไม่ว่า success หรือ error
    document.body.style.cursor = 'default';
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(event.selected);
    //console.log(event.selected);

    try {
      const params = new URLSearchParams({
        tbDocNoSearch: formDataSearch.tbDocNoSearch,
        tbDateNotiStartSearch: formDataSearch.tbDateNotiStartSearch,
        tbDateNotiEndSearch: formDataSearch.tbDateNotiEndSearch,
        tbDptNameSearch: formDataSearch.tbDptNameSearch,
        tbDptCodeSearch: formDataSearch.tbDptCodeSearch,
        tbSystemTypeSearch: formDataSearch.tbSystemTypeSearch,
        tbToolSearch: formDataSearch.tbToolSearch,
        tbToolNumberSearch: formDataSearch.tbToolNumberSearch,
        tbModelSearch: formDataSearch.tbModelSearch,
        tbAssetIDSearch: formDataSearch.tbAssetIDSearch,
        tbStatusWorkSearch: formDataSearch.tbStatusWorkSearch,
        tbEmpNameSearch: formDataSearch.tbEmpNameSearch,
        tbpage: event.selected.toString()
      });

      const response = await fetch(`http://localhost:8000/searchData.php?${params}`, {
        method: "GET",
      });

      const data = await response.json();

      setData(data.data);
      setShowcountData(data.countdata);
    } catch (error) {
      console.error("เกิดข้อผิดพลาด", error);
    }

  };

  const handleRowClick = (id) => {
    window.open(`/repairNoti/view?id=${id}`, '_blank');
  };

  return loading ? (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 pt-5 bg-white ">
      <div className="loader">
        
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-start min-h-screen gap-4 pt-5 bg-white ">
      <Head>
        <title>ระบบการแจ้งซ่อมเครื่อง</title>
      </Head>
      <Image
        src="/waiwailogo.png"
        alt="My Photo"
        width={200}
        height={50}
      />
      <label className="text-xl font-bold text-black ">
        ระบบการแจ้งซ่อมเครื่องและอุปกรณ์คอมพิวเตอร์
      </label>

      <form onSubmit={SearchData}>
        <div className="grid grid-cols-12 gap-4 mt-5 fw-auto p-7" style={{backgroundColor:"rgb(236, 240, 240)"}}>
          
          <div className="flex flex-col items-end justify-center col-span-3 mt-5 md:col-span-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-300 text-white font-small py-1 px-3 rounded shadow-md transition duration-200 cursor-pointer max-w-[120px]"
              onClick={() => openModalAdd()}
            >
              <span className="text-xl">+</span>
              <span>เพิ่มรายการ</span>
            </button>
          </div>
        
          <div className="flex flex-col justify-center col-span-2 ml-2 md:col-span-2">
            <label className="mb-1 text-sm font-medium text-black">เลขที่เอกสาร</label>
            <input
              name="tbDocNoSearch"
              type="text"
              value={formDataSearch.tbDocNoSearch}
              onChange={(e) =>
                setFormDataSearch({ ...formDataSearch, tbDocNoSearch: e.target.value })
              }
              placeholder="ระบุเลขที่เอกสาร"
              className="w-full px-3 py-1 text-black transition bg-white border rounded-md shadow-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col justify-center col-span-2 ml-4 md:col-span-2">
            <label className="mb-1 text-sm font-medium text-black">แผนก</label>
            <select
              name="tbDptNameSearch"
              value={formDataSearch.tbDptNameSearch}
              onChange={(e) =>
                setFormDataSearch({ ...formDataSearch, tbDptNameSearch: e.target.value })
              }
              className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">กรุณาเลือก</option>
              {departments.map((department) => (
                <option key={department.name} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-center col-span-2 ml-4 md:col-span-2">
            <label className="mb-1 text-sm font-medium text-black">รหัสแผนก</label>

            <select
              name="tbDptCodeSearch"
              value={formDataSearch.tbDptCodeSearch}
              onChange={(e) =>
                setFormDataSearch({ ...formDataSearch, tbDptCodeSearch: e.target.value })
              }
              className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">กรุณาเลือก</option>
              {departments.map((department) => (
                <option key={department.code} value={department.code}>
                  {department.code}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-start col-span-2 ml-4 md:col-span-2">
            <label className="mb-1 text-sm font-medium text-black">ชนิดอุปกรณ์</label>
            <select
              name="tbToolSearch"
              value={formDataSearch.tbToolSearch}
              onChange={(e) =>
                setFormDataSearch({ ...formDataSearch, tbToolSearch: e.target.value })
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

          <div className="flex flex-col justify-center col-span-2 ml-4 md:col-span-2">
            <label className="mb-1 text-sm font-medium text-black">รุ่น</label>
            <input
              name="tbModelSearch"
              type="text"
              value={formDataSearch.tbModelSearch}
              onChange={(e) =>
                setFormDataSearch({ ...formDataSearch, tbModelSearch: e.target.value })
              }
              placeholder="โปรดระบุรุ่นอุปกรณ์"
              className="w-full px-3 py-1 text-black transition bg-white border rounded-md shadow-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col justify-center col-span-2 mt-2 ml-4 md:col-span-2">
            <label className="mb-1 text-sm font-medium text-black">วันที่แจ้ง</label>
            <input
              name="tbDateNotiStartSearch"
              type="date"
              value={formDataSearch.tbDateNotiStartSearch}
              onChange={(e) =>
                setFormDataSearch({ ...formDataSearch, tbDateNotiStartSearch: e.target.value })
              }
              className="w-full px-3 py-1 text-black transition bg-white border rounded-md shadow-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col justify-center col-span-2 mt-2 ml-4 md:col-span-2">
            <label className="mb-1 text-sm font-medium text-black">ถึงวันที่</label>
            <input
              name="tbDateNotiEndSearch"
              type="date"
              value={formDataSearch.tbDateNotiEndSearch}
              onChange={(e) =>
                setFormDataSearch({ ...formDataSearch, tbDateNotiEndSearch: e.target.value })
              }
              className="w-full px-3 py-1 text-black transition bg-white border rounded-md shadow-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>


          <div className="flex flex-col justify-center col-span-3 mt-2 ml-4 md:col-span-3">
            <label className="mb-1 text-sm font-medium text-black">หมายเลขเครื่อง</label>
            <input
              name="tbToolNumberSearch"
              type="text"
              value={formDataSearch.tbToolNumberSearch}
              onChange={(e) =>
                setFormDataSearch({ ...formDataSearch, tbToolNumberSearch: e.target.value })
              }
              placeholder="โปรดระบุหมายเลขเครื่อง"
              className="w-full px-3 py-1 text-black transition bg-white border rounded-md shadow-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
              
          <div className="flex flex-col justify-center col-span-3 mt-2 ml-4 md:col-span-3">
            <label className="mb-1 text-sm font-medium text-black">รหัสทรัพย์สิน</label>
            <input
              name="tbAssetIDSearch"
              type="text"
              value={formDataSearch.tbAssetIDSearch}
              onChange={(e) =>
                setFormDataSearch({ ...formDataSearch, tbAssetIDSearch: e.target.value })
              }
              className="w-full px-3 py-1 text-black transition bg-white border rounded-md shadow-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col justify-center col-span-2 mt-2 ml-4 md:col-span-2">
            <label className="mb-1 text-sm font-medium text-black">ผู้แจ้ง</label>
            <input
              name="tbEmpNameSearch"
              type="text"
              value={formDataSearch.tbEmpNameSearch}
              onChange={(e) =>
                setFormDataSearch({ ...formDataSearch, tbEmpNameSearch: e.target.value })
              }
              className="w-full px-3 py-1 text-black transition bg-white border rounded-md shadow-sm border-black-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col justify-center col-span-2 mt-1 ml-4 md:col-span-2">
            <label className="mb-1 text-sm font-medium text-black">ประเภท</label>
            <select
                name="tbSystemTypeSearch"
                    value={formDataSearch.tbSystemTypeSearch}
                  onChange={(e) =>
                    setFormDataSearch({ ...formDataSearch, tbSystemTypeSearch: e.target.value })
                  }
                className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">กรุณาเลือก</option>
                <option value="P">P/C</option>
                <option value="A">AS/400</option>
              </select>
          </div>

          <div className="flex flex-col justify-center col-span-2 ml-4 md:col-span-2">
            <label className="mb-1 text-sm font-medium text-black">สถานะ</label>
              <select
                name="tbStatusWorkSearch"
                    value={formDataSearch.tbStatusWorkSearch}
                  onChange={(e) =>
                    setFormDataSearch({ ...formDataSearch, tbStatusWorkSearch: e.target.value })
                  }
                className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">กรุณาเลือก</option>
                <option value="0">รอ IT ตรวจสอบ</option>
                <option value="1">รอผู้แจ้งตรวจสอบ</option>
                <option value="2">จบงาน</option>
              </select>
          </div>

          

          <div className="flex flex-col items-end justify-end col-span-1 mb-1 md:col-span-1">
            <button 
              type="submit"  
              className="inline-flex items-center gap-1 bg-green-700 hover:bg-green-500 text-white font-small py-1 px-3 rounded shadow-md transition duration-200 cursor-pointer max-w-[150px]">
              <FaSearch size={13} /> 
              ค้นหา
            </button>
          </div>

          <div className="flex flex-col items-start justify-end col-span-1 mb-1 md:col-span-1">
            <button
              type="button"
              className="inline-flex items-center gap-1 bg-green-700 hover:bg-green-500 text-white font-small py-1 px-3 rounded shadow-md transition duration-200 cursor-pointer max-w-[150px]"
              onClick={() => exportExcel()}
            >
              <FaFileExport size={13} />
              <span>Export</span>
            </button>
          </div>
          
        </div>
      </form>
          
        <div className="flex flex-col justify-center mt-5 ">
          <div className="flex flex-col items-end justify-end mb-2 text-black underline" >
            <label className="">จำนวนข้อมูลทั้งหมด : {countData} รายการ</label>
          </div>
          
          <table className="w-full border border-collapse border-gray-300 rounded shadow-md table-auto">
            <thead>
              <tr className="text-xs text-black " style={{backgroundColor:"#fdd70a82"}}>
                <th className="px-4 py-2 text-center border">ลำดับ</th>
                <th className="px-4 py-2 text-center border">เลขที่เอกสาร</th>
                <th className="px-4 py-2 text-center border">รหัสแผนก</th>
                <th className="px-4 py-2 text-center border">แผนก</th>
                <th className="px-4 py-2 text-center border">ประเภท</th>
                <th className="px-4 py-2 text-center border">ชนิดอุปกรณ์</th>
                <th className="px-4 py-2 text-center border">หมายเลขเครื่อง</th>
                <th className="px-4 py-2 text-center border">รุ่น</th>
                <th className="px-4 py-2 text-center border">รหัสทรัพย์สิน</th>
                <th className="px-4 py-2 text-center border">รายละเอียด</th>
                <th className="px-4 py-2 text-center border">วันที่แจ้ง</th>
                <th className="px-4 py-2 text-center border">ผู้แจ้ง</th>
                <th className="px-4 py-2 text-center border">สถานะ</th>
              </tr>
            </thead>
            <tbody> 
              {(data || []).map((item, index) => (
                <tr onClick={() => handleRowClick(item.RepairID)} key={item.RepairID} className={`cursor-pointer text-black text-xs  hover:bg-blue-100 ${item.status == 'จบงาน' ? 'bg-green-400' : item.status == 'รอผู้แจ้งตรวจสอบ' ? 'bg-orange-400' : 'even:bg-white odd:bg-[#ecf0f0]'} `}>
                  <td className="px-4 py-2 text-center border">{index + 1 + (currentPage * itemsPerPage)}</td>
                  <td className="px-4 py-2 text-center border">{item.RepairNo}</td>
                  <td className="px-4 py-2 border">{item.DptCode}</td>
                  <td className="px-4 py-2 border">{item.DptName}</td>
                  <td className="px-4 py-2 text-center border">{item.systemname}</td>
                  <td className="px-4 py-2 border">{item.name_Device}</td>
                  <td className="px-4 py-2 text-center border">{item.DeviceToolID}</td>
                  <td className="px-4 py-2 border">{item.Model}</td>
                  <td className="px-4 py-2 border">{item.ToolAssetID}</td>
                  <td className="px-4 py-2 border">{item.description}</td>
                  <td className="px-4 py-2 text-center border">{item.cvcreatedate}</td>
                  <td className="px-4 py-2 border">{item.EmpName}</td>
                  <td className="px-4 py-2 text-center border">{item.status}</td>
                </tr>
              ))}
            </tbody>

          </table>

            <ReactPaginate
              previousLabel={"Prev"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"flex justify-center mt-4 space-x-2"}
              pageClassName={"border border-gray-300 rounded px-3 py-1 cursor-pointer bg-gray-50 text-black"}
              activeClassName={"bg-gray-200 text-black"}
              previousClassName={"text-black border border-gray-300 rounded px-3 py-1 cursor-pointer bg-gray-200"}
              nextClassName={"text-black border border-gray-300 rounded px-3 py-1 cursor-pointer bg-gray-200"}
              disabledClassName={"opacity-50 cursor-not-allowed bg-gray-50"}
            />



          <div className="flex flex-col items-center justify-center mt-2" >
            <label className="text-black underline " style={{textDecoration: 'underline',textDecorationStyle: 'double'}}>คำอธิบายเพิ่มเติม</label>
          
          </div>

          <div className="flex flex-row items-center justify-center" >
            <div className="w-5 h-5 mt-2 bg-orange-400 ms-10"></div>
            <div className="mt-2 text-black ms-3">: รอผู้แจ้งตรวจสอบ</div>
          </div>

          <div className="flex flex-row items-center justify-center mb-3" >
            <div className="w-5 h-5 mt-2 bg-green-400 me-3"></div>
            <div className="mt-2 text-black me-8">: จบงาน</div>
          </div>

        </div>
        
            
          {showModalAdd && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                onClick={closeModalAdd} // ปิด modal เมื่อคลิกข้างนอกกล่อง
              >
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-4xl bg-white border border-black rounded-lg"
                  onClick={(e) => e.stopPropagation()} // ป้องกันคลิกในกล่องไม่ให้ปิด
                >
                  {/* Head */}
                  
                <div
                    className="flex items-center justify-between px-6 py-4 border-b border-black"
                    style={{ backgroundColor: "#fec235" }}
                  >
                    {/* ฝั่งซ้าย */}
                    <div>
                      <h2 className="flex items-center gap-1 font-semibold text-black text-md">
                        <span>เพิ่มรายการ</span>
                        <FaCog size={18} />
                      </h2>
                    </div>

                    {/* ฝั่งขวา */}
                    <div>
                      <button
                        onClick={closeModalAdd}
                        className="mt-2 text-black cursor-pointer hover:text-red-600 focus:outline-none"
                        aria-label="Close modal"
                      >
                        <FaTimes size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 px-6 py-4 md:grid-cols-4">
                    {/* ชุดที่ 1 */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-black">วันที่</label>
                      <input
                        name="tbDateNoti"
                        value={formData.tbDateNoti}
                        onChange={(e) =>
                          setFormData({ ...formData, tbDateNoti: e.target.value })
                        }
                        type="date"
                        className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {/* ชุดที่ 2 */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-black">รหัสแผนก</label>
                        <select
                          name="tbDptCode"
                          value={formData.tbDptCode}
                          onChange={(e) =>
                            setFormData({ ...formData, tbDptCode: e.target.value })
                          }
                          className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">กรุณาเลือก</option>
                          {departments.map((department) => (
                            <option key={department.code} value={department.code}>
                              {department.code}
                            </option>
                          ))}
                        </select>
                    </div>

                    {/* ชุดที่ 3 */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-black">แผนก</label>

                          <select
                          name="tbDptName"
                          value={formData.tbDptName}
                          onChange={(e) =>
                            setFormData({ ...formData, tbDptName: e.target.value })
                          }
                          className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">กรุณาเลือก</option>
                          {departments.map((department) => (
                            <option key={department.name} value={department.name}>
                              {department.name}
                            </option>
                          ))}
                        </select>

                    
                    </div>

                    {/* ชุดที่ 4 */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-black">ชื่อ - นามสกุล</label>
                      <input
                        name="tbNameEmp"
                        type="text"
                        value={formData.tbNameEmp}
                        onChange={(e) =>
                          setFormData({ ...formData, tbNameEmp: e.target.value })
                        }
                        className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-3 gap-4 px-6 py-4 md:grid-cols-3">
                    {/* ชุดที่ 1 */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-black">ประเภท</label>
                        <select
                          name="tbSystemType"
                          value={formData.tbSystemType}
                          onChange={(e) =>
                            setFormData({ ...formData, tbSystemType: e.target.value })
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
                          value={formData.tbTool}
                          onChange={(e) =>
                            setFormData({ ...formData, tbTool: e.target.value })
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
                        value={formData.tbOtherTool}
                        onChange={(e) =>
                          setFormData({ ...formData, tbOtherTool: e.target.value })
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
                        value={formData.tbToolNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, tbToolNumber: e.target.value })
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
                        value={formData.tbModel}
                        onChange={(e) =>
                          setFormData({ ...formData, tbModel: e.target.value })
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
                        value={formData.tbAssetID}
                        onChange={(e) =>
                          setFormData({ ...formData, tbAssetID: e.target.value })
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
                      value={formData.tbDesc}
                      onChange={(e) =>
                        setFormData({ ...formData, tbDesc: e.target.value })
                      }
                      placeholder="กรอกข้อความรายละเอียดที่นี่..."
                      className="w-full px-4 py-2 text-black transition bg-white border border-gray-300 rounded-md shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  {/* Footer */}
                  <div className="flex justify-end gap-2 px-6 py-4 border-t border-black">
                    <button
                      type="submit"
                      className="flex items-center gap-1 px-4 py-2 text-white bg-green-600 rounded cursor-pointer hover:bg-green-800" 
                    >
                      <FaPaperPlane size={18} />
                      <span>บันทึกรายการ</span>
                    </button>
                    <button
                      onClick={closeModalAdd}
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
  );
}
