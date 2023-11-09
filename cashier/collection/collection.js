import React, { useContext, useState } from "react";
import exitIcon from "../../../global/images2/exit-icon.png"
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
export default function CashierCollection(){
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
                        <h1>Collection Report</h1>
                        <img src={exitIcon} alt="Exit Icon" onClick={togglePopupInfo} className="exit-icon"/>                 
                    </div>
                    <div className="popupInfo-content">    
                        <span><b>Date:</b> 04/28/2023</span>
                        <span><b>Name:</b> Rosalyn Balala</span>
                        <span><b>Unit:</b> 301</span>
                        <span><b>Payment Type:</b>Unit, Parking, CUSA</span>
                        <span><b>Unit Total Amount(₱):</b> 100,000</span>
                        <span><b>Parking Total Amount(₱):</b> 50,000</span>
                        <span><b>CUSA Total Amount(₱):</b> 50,000</span>
                        <span><b>Overall Amount(₱):</b> 200,000</span>
                    </div>    
                </div>
            </div>
            )}
            <div className="admin-tenants-content">
                <div className="tenants-header">
                    <h1>COLLECTION</h1>                   
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

                            <form>
                                <input type="text" className="searchbar" />
                            </form>
                        </div>
                        
                    </div>
                    
                    
                </div>

                <div className="admin-table-div">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Unit No.</th>
                                <th>Payment Type</th>
                                <th>Overall Amount(₱)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>04/28/2023</td>
                                <td>Rosalyn Balala</td>
                                <td>301</td>
                                <td>Unit, Parking, CUSA</td>
                                <td>200,000</td>
                                <td><button className="action-buttons"  onClick={togglePopupInfo}>View</button><button className="action-buttons">Download</button></td>
                            </tr>
                            
                                
                                                 
                            <tr>
                                <td>04/27/2023</td>
                                <td>Gio Barleta</td>
                                <td>603</td>
                                <td>Unit, CUSA</td>
                                <td>10,000</td>
                                <td><button className="action-buttons">View</button><button className="action-buttons">Download</button></td>   
                            </tr>
                            <tr>
                                <td>03/08/2023</td>
                                <td>Kim Jisoo</td>
                                <td>705</td>
                                <td>Unit, CUSA</td>
                                <td>150,000</td>
                                <td><button className="action-buttons">View</button><button className="action-buttons">Download</button></td>
                            </tr>
                            <tr>
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
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}