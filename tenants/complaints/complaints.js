import React, { useContext, useEffect, useState } from "react";
import addIcon from "../../../global/images2/add-icon.png"
import exitIcon from "../../../global/images2/exit-icon.png"
import { DatePicker } from 'antd';
import { LoginContext } from "../../../../context/LoginContext";
import { auth } from "../../../../firebase-config";
import { addDoc } from "firebase/firestore";
const { RangePicker } = DatePicker;

export default function TenantComplaints(){
    const {tenants, complaintsCollection, complaints, setComplaints } = useContext(LoginContext)
    const [unitNum, setUnitNum] = useState("")
    const [senderID, setSenderID] = useState("")
    const [date, setDate] = useState(formatDate(new Date()));
    const [popup, setPopup] = useState(false)
    const [popupInfo, setPopupInfo] = useState(false)
    const [formData, setFormData] = useState({
        subject: "",
        description: "",
    });
    const [selectedComplaint, setSelectedComplaint] = useState(null)
    const [isEmptyField, setIsEmptyField] = useState(false)

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
                    setSenderID(user.uid)
                }
            } catch (error) {
                console.error(error.message);
            }
        } else {
            console.log("No user is signed in.");
        }
    }

    const togglePopupInfo = (complaint) => {
        setSelectedComplaint(complaint)
        setPopupInfo(!popupInfo)
    }
    const togglePopupForm = () => {
        setPopup(!popup)
    }
    
    
    //Get the user input
    function handleChange(event){
        const {name, value} = event.target
        
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]:  value
                
            }
        })  
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
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

            await addDoc(complaintsCollection, {
                date: date,
                unit: unitNum,
                subject: formData.subject,
                description: formData.description,
                senderID : senderID,
                receiver : "Admin",
                status: "Pending",
                lastUpdateTime: currentTime,
            })

            setComplaints((prevComplaints) => [
                ...prevComplaints,
                {
                    date: date,
                    unit: unitNum,
                    subject: formData.subject,
                    description: formData.description,
                    senderID : senderID,
                    Receiver : "Admin",
                    status: "Pending",
                    lastUpdateTime: currentTime,
                }
            ])
        
            setFormData({
                unit: "",
                subject: "",
                description: "",
            });

              setPopup(false)
        } catch (error) {
            console.error("Error adding document: ", error);
        }
        
    }  
    const [searchSentComplaints, setSearchSentComplaints] = useState(""); // State for Sent Complaints search
  const [searchReceivedComplaints, setSearchReceivedComplaints] = useState("");
    return(
        
        <div className="tenant-maintenance-container">
            {popup && (
            <div className="popup-form">
                <div className="popup-overlay" onClick={togglePopupForm}></div>
                <div className="popup-box" id="popup-maintenance-req">

                    <div className="popup-header">
                        <h1>Send Complaints</h1>
                        <img src={exitIcon} alt="Exit Icon" onClick={togglePopupForm} className="exit-icon"/>                 
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
                                    value={date}
                                    id="maintenance-req"
                                    disabled
                                    />
                                </div>

                                <div>
                                    <label>Unit No.:</label>
                                    <input 
                                    
                                    type="text"  
                                    id="maintenance-req" 
                                    value={unitNum} 
                                    disabled/>
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
                                        // value={formData.subject}
                                        />
                                    
                                </div>  
                            </div>
                            <div className="complaints-desc-input">
                                <label>Description:</label>
                                <textarea 
                                onChange={handleChange}
                                name="description"
                                // value={formData.description}
                                />
                            </div>
                            {/* {isEmptyField && <p className="emptyField">Please answer all the required fields.</p>} */}
                            
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
                        <span><b>Date:</b> {selectedComplaint.date}</span>
                        {selectedComplaint.receiver === "Admin" ? <span><b>Status:</b> {selectedComplaint.status} </span> :
                        ""
                        }
                        <span><b>Subject:</b> {selectedComplaint.subject}</span>
                        <span><b>Description:</b> {selectedComplaint.description}</span>
                    </div>   
                </div>
            </div>
            )}
            <div className="tenant-maintenance-content">
                <div className="tenant-maintenance-header">
                    <h1>COMPLAINTS</h1>
                </div>

                <div className="admin-table-div" id="tenant-maintenance-req">
                    <div className="maintenance-req-header">
                        <h2>Sent Complaints</h2>   
                    </div>
                    
                    <div className="sent-complaints">
                    
                        <img src={addIcon} alt="Add Icon" className="add-icon"  onClick={togglePopupForm} 
                        id="maintenance-req-add"/>
                        <input
                                
                        className="searchbar"
                        type="text"
                        placeholder="Search..."
                        value={searchSentComplaints}
                        onChange={(e) => setSearchSentComplaints(e.target.value)}
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
                            {complaints
                            .filter((complaint) => complaint.senderID === senderID)
                            .filter((complaint) =>
                            complaint.subject.toLowerCase().includes(searchSentComplaints.toLowerCase()) ||
                            complaint.date.toLowerCase().includes(searchSentComplaints.toLowerCase()) ||
                            complaint.subject.toLowerCase().includes(searchSentComplaints.toLowerCase()) ||
                            complaint.description.toLowerCase().includes(searchSentComplaints.toLowerCase()) 
                            )
                            .map((complaint) => (
                                <tr key={complaint.id}>
                                    <td>{complaint.date}</td>
                                    <td>{complaint.status}</td>
                                    <td>{complaint.subject}</td>
                                    <td><button className="action-buttons" onClick={() => togglePopupInfo(complaint)}>View</button> 
                                    {complaint.status === "Pending" ? 
                                    <button 
                                    className={new Date() < complaint.lastUpdateTime ? "action-buttons" : ""} 
                                    id={new Date() > complaint.lastUpdateTime ? "action-buttons-disabled" : ""
                                    
                                    } > Update</button> : ""}
                                    </td>                               
                                </tr>
                                
                            ))}
                           
                        </tbody>
                    </table>
                </div>

                <div className="admin-table-div" id="tenant-maintenance-rec">
                    <div className="maintenance-req-header">
                        <h2>Received Complaints</h2>
                    </div>
                    <div className="tenants-addSearch-div">
                
                    <div className="right-header" id="received-complaints">
                        
                        <input
                        className="searchbar"
                            type="text"
                            placeholder="Search..."
                            value={searchReceivedComplaints}
                            onChange={(e) => setSearchReceivedComplaints(e.target.value)}
                        />
                    </div>
                    
                    
                </div>
                    <table className="admin-table" id="maintenance-rec-tbl">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Subject</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                        {complaints
                        .filter((complaint) => complaint.unit === unitNum && complaint.receiver === "Tenant")
                        .filter((complaint) =>
                            complaint.subject.toLowerCase().includes(searchReceivedComplaints.toLowerCase()) ||
                            complaint.date.toLowerCase().includes(searchReceivedComplaints.toLowerCase()) ||
                            complaint.subject.toLowerCase().includes(searchReceivedComplaints.toLowerCase()) ||
                            complaint.description.toLowerCase().includes(searchReceivedComplaints.toLowerCase()) 
                        )
                        .map((complaint) =>  (
                            <tr key={complaint.id}>
                                <td>{complaint.date}</td>  
                                <td>{complaint.subject}</td>
                                <td><button className="action-buttons" onClick={() => togglePopupInfo(complaint)}>View</button></td>

                                                          
                            </tr>            
                            ))}
                           
                           
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    )
}