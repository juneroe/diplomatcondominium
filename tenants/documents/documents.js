import React, { useContext, useState } from "react";
import addIcon from "../../../global/images2/add-icon.png"
import exitIcon from "../../../global/images2/exit-icon.png"
import { LoginContext } from "../../../../context/LoginContext";
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
export default function Documents(){
    return(
        <div className="admin-tenants-container">
            
            <div className="admin-tenants-content">
                <div className="tenants-header">
                    <h1>CONTRACT</h1>
                    
                </div>
                
                <div className="tenants-addSearch-div">

                    <div className="left-header">
                        

                        <div>
                            <RangePicker className="rangedate"/>
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
                                <th>Date</th>
                                <th>Documents</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>01/22/2023</td>
                                <td className="contracts-docs"><u>unit301contract.pdf</u></td>
                                <td><button className="action-buttons">Download</button></td>
                                
                            </tr>
                            
                                
                                                 
                            <tr>
                                <td>01/22/2023</td>
                                <td className="contracts-docs"><u>paymentNotice.pdf</u></td>
                                <td><button className="action-buttons">Download</button></td>
                                
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                               
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                
                            </tr>
                            <tr>
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