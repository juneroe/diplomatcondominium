import React, { useContext, useState, useEffect } from "react";
import exitIcon from "../../../global/images2/exit-icon.png";
import { DatePicker } from 'antd';
import { LoginContext } from "../../../../context/LoginContext";
import { auth } from "../../../../firebase-config";

const { RangePicker } = DatePicker;

export default function Ledger() {
    const { tenantsLedger } = useContext(LoginContext);
    const [activeUser, setActiveUser] = useState(null);
    const [selectedLedger, setSelectedLedger] = useState(null);
    const [popupInfo, setPopupInfo] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setActiveUser(user);
            } else {
                setActiveUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const togglePopupInfo = (ledger) => {
        setPopupInfo(!popupInfo);
        setSelectedLedger(ledger);
    };

    const formatNumber = (number) => {
        if (typeof number === 'number' && !isNaN(number)) {
            return number.toLocaleString();
        }
        return '';
    };

    const displayedLedger = tenantsLedger
        .filter((ledger) => {
            if (!activeUser) {
                return false;
            }
            if (ledger.tenantID !== activeUser.uid) {
                return false;
            }
            return true;
        })
        .map((ledger) => ({
            ...ledger,
            credit: formatNumber(ledger.credit),
            debit: formatNumber(ledger.debit),
            balance: formatNumber(ledger.monthlyBalance),
            parkingBalance: formatNumber(ledger.parkingBalance),
            outstandingBalance: formatNumber(ledger.outstandingBalance),
            monthlyRate: formatNumber(ledger.monthlyRate)
        }));

    const sortedLedger = displayedLedger.slice().sort((a, b) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const parseDate = (dateStr) => {
            const parts = dateStr.split(' ');
            const month = months.indexOf(parts[0]);
            const day = parseInt(parts[1].replace(',', ''));
            const year = parseInt(parts[2]);
            return new Date(year, month, day);
        };

        const dateA = parseDate(a.dueDate);
        const dateB = parseDate(b.dueDate);

        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        return 0;
    });
    
  
    return(
        <div className="admin-tenants-container">
            {popupInfo && (
            <div className="popup-form">
                <div className="popup-overlay" onClick={togglePopupInfo}></div>
                <div className="popup-box">

                    <div className="popup-header">
                        <h1>Payment Report</h1>
                        <img src={exitIcon} alt="Exit Icon" onClick={togglePopupInfo} className="exit-icon"/>                 
                    </div>
                    <div className="popupInfo-content">
                        
                        <span><b>Transaction Date:</b> {selectedLedger.transactionDate}</span>
                        <span><b>Debit(₱):</b> {selectedLedger.debit}</span>
                        <span><b>Credit(₱):</b> {selectedLedger.credit}</span>
                        <span><b>Balance(₱):</b> {selectedLedger.balance}</span>
                        <span><b>Duedate:</b> {selectedLedger.dueDate}</span>
                        <span><b>Unit Montly Rate(₱):</b> {selectedLedger.monthlyRate}</span>
                        <span><b>Parking Balance(₱):</b> {selectedLedger.parkingBalance}</span>
                        <span><b>Outstanding Balance(₱):</b> {selectedLedger.outstandingBalance}</span>
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
                                <th>Transaction Date</th>
                                <th>Payment</th>
                                <th>Description</th>
                                <th>Balance</th>
                                <th>Due Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sortedLedger.map((ledger) => (
                                    
                                        <tr key={ledger.id}>
                                            <td>{ledger.transactionDate}</td>
                                            <td>{ledger.payment}</td>
                                            <td>{ledger.description}</td>
                                            <td>₱{ledger.balance}</td>
                                            <td>{ledger.dueDate}</td>
                                            <td>{ledger.status}</td>
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