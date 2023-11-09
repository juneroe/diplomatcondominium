import React, { useContext, useState } from "react";
import exitIcon from "../../../global/images2/exit-icon.png"
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
export default function CashierLedger(){
    const [popupInfo, setPopupInfo] = useState(false)
    
    const togglePopupInfo = () => {
        setPopupInfo(!popupInfo)
    }     
    
    return(
        <div className="admin-tenants-container">
            {popupInfo && (
            <div className="popup-form">
                <div className="popup-overlay" onClick={togglePopupInfo}></div>
                <div className="popup-box">

                    <div className="popup-header">
                        <h1>Tenant Balance</h1>
                        <img src={exitIcon} alt="Exit Icon" onClick={togglePopupInfo} className="exit-icon"/>                 
                    </div>
                    <div className="popupInfo-content">
                        
                        <span><b>Unit:</b> 301</span>
                        <span><b>Name:</b> Rosalyn Balala</span>
                        <span><b>Status:</b> Pending</span>
                        <span><b>Duedate:</b> 03/29/2023</span>
                        <span><b>Unit Rate:</b> 200,000</span>
                        <span><b>Plus(+)12% VAT:</b> 24000</span>
                        <span><b>Minus(-)5% WHT:</b> 10000</span>
                        <span><b>Amount to Pay:</b> 214,000</span>
                        <span><b>Amount Paid:</b> 150,000</span>
                        <span><b>Remaining Balance:</b> 64,000</span>   

                    </div>
                </div>
            </div>
            )}
            <div className="admin-tenants-content">
                <div className="tenants-header">
                    <h1>LEDGER</h1>
                    
                </div>
                
                <div className="tenants-addSearch-div">
                
                    <div className="left-header">
                        <div style={{display: !popupInfo ? 'block' : 'none' }}>
                            <RangePicker className="rangedate" />
                        </div>
                        

                    </div>
                    <div className="right-header">
                        <div className="entries">

                            
                            <span>Show</span>

                            <form>
                                <select>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                </select>
                            </form>
                            <span>Entries</span>
                        </div>
                        
                        <form>
                            <input type="text" className="searchbar" />
                        </form>
                    </div>
                    
                    
                </div>

                <div className="admin-table-div">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Floor</th>
                                <th>Unit</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Balance</th>
                                <th>Due Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Third</td>
                                <td>301</td>
                                <td>Rosalyn Balala</td>
                                <td>Pending</td>
                                <td>₱64,000</td>
                                <td>05/05/2023</td>
                                <td><button className="action-buttons">Notice</button><button className="action-buttons"  onClick={togglePopupInfo}>View</button><button className="action-buttons">Download</button></td>
                                
                            </tr>
                            
                                
                                                 
                            <tr>
                                <td>Sixth</td>
                                <td>603</td>
                                <td>Gio Barleta</td>
                                <td>Paid</td>
                                <td>0</td>
                                <td>N/A</td>
                                <td><button className="action-buttons">View</button><button className="action-buttons">Download</button></td>   
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                            <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}