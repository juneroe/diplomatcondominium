import React, { useContext, useEffect, useState } from "react";
import "./maintenance.css"
import addIcon from "../../../global/images2/add-icon.png"
import exitIcon from "../../../global/images2/exit-icon.png"
import { DatePicker } from 'antd';
import { LoginContext } from "../../../../context/LoginContext";
import { auth, db } from "../../../../firebase-config";
import { addDoc, doc, updateDoc } from "firebase/firestore";
const { RangePicker } = DatePicker;

export default function TenantMaintenance(){
    
    const {tenants, maintenanceCollection, maintenance, setMaintenance} = useContext(LoginContext)
    const [popup, setPopup] = useState(false)
    const [popupInfo, setPopupInfo] = useState(false)
    const [activeUser, setActiveUser] = useState("")
    const [unitNum, setUnitNum] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [senderID, setSenderID] = useState("")
    const [date, setDate] = useState(formatDate(new Date()));
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
    });
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isEmptyField, setIsEmptyField] = useState(false)
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    function formatDate(date) {
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }).format(date);
    }

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const tenant = tenants.find((tenant) => tenant.userID === user.uid);
            if (tenant) {
                setUnitNum(tenant.unit);
                setFirstName(tenant.firstName);
                setLastName(tenant.lastName);
                setSenderID(user.uid)
            }
        } else {
            console.log("No user is signed in.");
        }
    }, [tenants]);
    
    const checkTitle = async () => {
        const user = auth.currentUser;
        console.log(user.uid);
        if (user) {
            try {
                const tenant = tenants.find((tenant) => tenant.userID === user.uid);
                if (tenant) {
                    setUnitNum(tenant.unit);
                    setFirstName(tenant.firstName);
                    setLastName(tenant.lastName);
                    setSenderID(user.uid)
                }
            } catch (error) {
                console.error(error.message);
            }
        } else {
            console.log("No user is signed in.");
        }
    }

    
    function handleChange(event){
        const {name, value} = event.target
        
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]:  value
                
            }
        })
    }   

    

    function formatDate(date) {
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    }

    const togglePopupInfo = (request) => {
        setSelectedRequest(request)
        setPopupInfo(!popupInfo)
        
    }
    const togglePopupForm = () => {
        setPopup(!popup)
        checkTitle()
    }   
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            formData.subject.trim() === "" ||
            formData.description.trim() === ""
        ){
            setIsEmptyField(true)
            return;
        }
        try {
            const currentTime = new Date();
            currentTime.setMinutes(currentTime.getMinutes() - 1);

            await addDoc(maintenanceCollection, {
                firstName: firstName,
                lastName: lastName,
                date: date,
                unit: unitNum,
                subject: formData.subject,
                description: formData.description,
                senderID : senderID,
                status: "Pending",
                lastUpdateTime: currentTime,
            })

            setMaintenance((prevMaintenance) => [
                ...prevMaintenance,
                {
                    firstName: firstName,
                    lastName: lastName,
                    date: date,
                    unit: unitNum,
                    subject: formData.subject,
                    description: formData.description,
                    senderID : senderID,
                    status: "Pending",
                    lastUpdateTime: currentTime,
                }
            ])
            // Clear the form fields after submission
            setFormData({
                unit: "",
                subject: "",
                description: "",
            });

              setPopup(false)
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }; 

    const updateRequest = async (request) => {
        try {
            if(request.lastUpdateTime < new Date()){
                const maintenanceDocRef = doc(db, 'maintenance', request.id);
            
                await updateDoc(maintenanceDocRef, {lastUpdateTime: new Date()});

            
                setMaintenance((prevMaintenance) =>
                    prevMaintenance.map((prevRequest) =>
                        prevRequest.id === request.id ? { ...prevRequest, lastUpdateTime: new Date() } : prevRequest
                    )
                );
            
            }
            
        } catch (error) {
            console.error('Error updating unit:', error);
        }
    };
    const [searchMaintenanceRequest, setSearchMaintenanceRequest] = useState(""); 
    const [searchMaintenanceRecords, setSearchMaintenanceRecords] = useState("");
    return(
        <div className="tenant-maintenance-container">
            {popup && (
            <div className="popup-form">
                <div className="popup-overlay" onClick={togglePopupForm}></div>
                <div className="popup-box" id="popup-maintenance-req">
                    <div className="popup-header">
                        <h3>Maintenance Request</h3>
                        <img src={exitIcon} alt="Exit Icon" onClick={togglePopupForm} className="exit-icon" id="maintenance-req-exit"/>                 
                    </div>
                    <div className="popup-content-complains">                       
                        <form onSubmit={handleSubmit}>
                            
                            <div className="maintenance-req-input">
                                <div className="dateUnit-input-div">

                                    <div>
                                        <label>Date: </label>
                                        <input 
                                        type="text" 
                                        placeholder="" 
                                        id="maintenance-req"
                                        value={date}
                                        disabled
                                        />
                                    </div>

                                    <div>
                                        <label>Unit No.:</label>
                                        <input 
                                        
                                        type="text"  id="maintenance-req" value={unitNum}disabled/>
                                    </div>
                                </div>

                                <div className="name-input-div">
                                    <div>
                                        <label>First Name: </label>
                                        <input 
                                        type="text" 
                                        id="maintenance-req" 
                                        value={firstName}
                                        disabled
                                        />
                                    </div>

                                    <div>
                                        <label>Last Name: </label>
                                        <input 
                                        type="text" 
                                        id="maintenance-req" 
                                        value={lastName} 
                                        disabled
                                        />
                                    </div>
                                </div>
                                <div className="unitsubj-input">

                                        <label>Subject:</label>
                                        <input 
                                        type="text"
                                        placeholder="Title" 
                                        id="maintenance-req"
                                        onChange={handleChange}
                                        name="subject"
                                        value={formData.subject}
                                        />
                                    
                                </div>  
                            </div>
                            <div className="complaints-desc-input">
                                <label>Description:</label>
                                <textarea 
                                onChange={handleChange}
                                name="description"
                                value={formData.description}
                                />
                            </div>
                            {isEmptyField && <p className="emptyField">Please answer all the required fields.</p>}
                            
                            <div className="btn-div" id="btn-div-complaints">
                            
                                    <button className="createAccBtn" id="sendBtn" onClick={handleSubmit}>Send</button>
                            </div>
                        </form>

                    </div>   
                </div>
            </div>
            )}
            {popupInfo && (
            <div className="popup-form">
                <div className="popup-overlay" onClick={togglePopupInfo}></div>
                <div className="popup-box">
                    <div className="popup-header">
                        <h1>Work Order Information</h1>
                        <img src={exitIcon} alt="Exit Icon" onClick={togglePopupInfo} className="exit-icon"/>                 
                    </div>
                    <div className="popupInfo-content">
                        
                        <span><b>Date:</b> {selectedRequest.date}</span>
                        <span><b>Status :</b> {selectedRequest.status}</span>
                        <span><b>Subject:</b> {selectedRequest.subject}</span>
                        <span><b>Description:</b> {selectedRequest.description}</span>
                    </div>   
                </div>
            </div>
            )}
            <div className="tenant-maintenance-content">
                <div className="tenant-maintenance-header">
                    <h1>MAINTENANCE</h1>
                </div>

                <div className="admin-table-div" id="tenant-maintenance-req">
                    <div className="maintenance-req-header">
                        <h2>Maintenance Request</h2>
                    </div>
                    <div className="sent-complaints">
                    
                        <img src={addIcon} alt="Add Icon" className="add-icon"  onClick={togglePopupForm} 
                        id="maintenance-req-add"/>
                        <input
                                
                        className="searchbar"
                        type="text"
                        placeholder="Search..."
                        value={searchMaintenanceRequest}
                        onChange={(e) => setSearchMaintenanceRequest(e.target.value)}
                        />
                        
        
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Subject</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {maintenance
                            .filter((request) => request.status === "Pending"  && request.senderID === senderID)
                            .filter((request) => 
                            request.subject.toLowerCase().includes(searchMaintenanceRequest.toLowerCase()) ||
                            request.status.toLowerCase().includes(searchMaintenanceRequest.toLowerCase()) ||
                            request.date.toLowerCase().includes(searchMaintenanceRequest.toLowerCase()) ||
                            request.description.toLowerCase().includes(searchMaintenanceRequest.toLowerCase()) 
                            )
                            .map((request) => (
                                <tr key={request.id}>
                                    <td>{request.date}</td>
                                    <td>{request.status}</td>
                                    <td>{request.subject}</td>
                                    <td>
                                        <button className="action-buttons" onClick={() => togglePopupInfo(request)}>View</button>
                                        <button
                                        id={new Date() > request.lastUpdateTime ? "action-buttons-disabled" : ""} 
                                        className={new Date() > request.lastUpdateTime ? "action-buttons" : ""}
                                        onClick={() => updateRequest(request)}
                                        
                                        >
                                        Update</button></td>

                                </tr>
                            ))
                            }
                                
                            

                        </tbody>
                    </table>
                </div>

                <div className="admin-table-div" id="tenant-maintenance-rec">
                    <div className="maintenance-req-header" >
                        <h2>Maintenance Records</h2>
                    </div>
                    <div className="tenants-addSearch-div" id="received-complaints">
                
                    <div className="sent-complaints">
                        <input         
                            className="searchbar"
                            type="text"
                            placeholder="Search..."
                            value={searchMaintenanceRecords}
                            onChange={(e) => setSearchMaintenanceRecords(e.target.value)}
                        />
                        
        
                    </div>
                    
                    
                    </div>
                    <table className="admin-table" id="maintenance-rec-tbl">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Subject</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>


                        {maintenance
                            .filter((request) => (request.status === "Acknowledged" || request.status === "Declined") && request.senderID === senderID)
                            .filter((request) => 
                            request.subject.toLowerCase().includes(searchMaintenanceRecords.toLowerCase()) ||
                            request.date.toLowerCase().includes(searchMaintenanceRecords.toLowerCase()) ||
                            request.subject.toLowerCase().includes(searchMaintenanceRecords.toLowerCase()) ||
                            request.description.toLowerCase().includes(searchMaintenanceRecords.toLowerCase()) 
                            )
                            .map((request) => (
                                <tr key={request.id}>
                                    <td>{request.date}</td>
                                    <td>{request.status}</td>
                                    <td>{request.subject}</td>
                                    <td>
                                        <button className="action-buttons" onClick={() => togglePopupInfo(request)}>View</button>
                                    </td>

                                </tr>
                            ))
                        }
                            
                           
                           
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    )
}