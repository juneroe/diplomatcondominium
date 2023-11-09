import React, { useContext, useEffect, useState } from "react";
import diplomatLogo from "../../../global/sidebarImages/diplomat-logo.png"
import editbtn from "../../../global/settings/images/edit-icon.png"

import "./paymentStyle.css"
import { LoginContext, units } from "../../../../context/LoginContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase-config";
import Ledger from "../../tenants/ledger/ledger";
export default function CashierPayment(){
    const {tenantsLedger, units, setTenantsLedger} = useContext(LoginContext)
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString(undefined, options);
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        unit: "",

    });

    const [unitAmount, setUnitAmount] = useState(0);
    const [unitVat, setUnitVat] = useState(0);
    const [unitWHT, setUnitWHT] = useState(0);
    const [unitTotalAmount, setUnitTotalAmount] = useState(0);
    const [parkingAmount, setParkingAmount] = useState(0);
    const [parkingVat, setParkingVat] = useState(0);
    const [parkingWHT, setParkingWHT] = useState(0);
    const [parkingTotalAmount, setParkingTotalAmount] = useState(0);
    const [occupiedUnits, setOccupiedUnits] = useState([])
    const [editMode, setEditMode] = useState(false);
    const [VATPercentage, setVATPercentage] = useState(0);
    const [WHTPercentage, setWHTPercentage] = useState(0);
    const [currentUnit, setCurrentUnit] = useState(0);
    const [cusaAmount, setCusaAmount] = useState("");
    const [overallAmount, setOverallAmount] = useState(0);
    const [cusaVat, setCusaVat] = useState(0);
    const [cusaWht, setCusaWht] = useState(0);
    const [cusaTotalAmount, setCusaTotalAmount] = useState(0);
    const [amountReceived, setAmountReceived] = useState("");
    const [tenantID, setTenantID] = useState("");
    const [currentMonth, setCurrentMonth] = useState("");
    const [currentYear, setCurrentYear] = useState("");


    function occupiedUnit(floor) {
       
        const occupiedUnit = units.filter(
            (unit) => unit.floor === Number(floor) && unit.status === "Occupied"
        )
        setOccupiedUnits(occupiedUnit) 
        
    }
    useEffect(() => {
        if (formData.unit) {
            getContents(formData.unit);
        }
    }, [cusaAmount]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        const unitAvailable = name === "floor" ? occupiedUnit(value) : value;
    
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            [name]: value,
          };
        });
    
        if (name === "unit") {
          getContents(value);
        }
      };
    
      function formatNumberWithCommas(number) {
        return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      }
    const getContents = async (unit) => {
        setCurrentUnit(unit)
        let monthlyRate = 0
        let parkingRate = 0
        let vat = 0
        let wht = 0
        let unitVatAmount = 0
        let unitWhtAmount = 0
        let baseRate = 0
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);

        const currentMonth = nextMonth.toLocaleString('default', { month: 'long' });
        setCurrentMonth(currentMonth)
        
        const currentYear = nextMonth.getFullYear();
        setCurrentYear(currentYear)

        await tenantsLedger.map((ledger) => {
            if((unit === ledger.unit && (ledger.status === "Pending" || ledger.status === "Overdue"))){
                monthlyRate += ledger.monthlyRate
                parkingRate += ledger.parkingBalance
                unitVatAmount += ledger.vatAmount
                unitWhtAmount += ledger.whtAmount
                vat = ledger.vat
                wht = ledger.wht
                baseRate += ledger.baseRate
                setTenantID(ledger.tenantID)
            }
        })

        const rentalRateWithVAT = baseRate + unitVatAmount - unitWhtAmount;
        const parkingwhtAmount = (wht / 100) * parkingRate
        const parkingvatAmount = (vat / 100) * parkingRate

        // Add VAT and WHT to the monthlyRate
        const parkingBaseAmount = parkingRate - parkingvatAmount + parkingwhtAmount;
        
        
        const cusaVat = (vat / 100) * Number(cusaAmount) 
        const cusaWht = ((wht - 3) / 100) * Number(cusaAmount) 
        const cusaTotal = Number(cusaAmount) + cusaVat - cusaWht 
        const overallAmount = rentalRateWithVAT + parkingRate + cusaTotal
        setCusaVat(cusaVat.toFixed(2).toLocaleString())
        setCusaWht(cusaWht.toFixed(2).toLocaleString())
        setCusaTotalAmount(cusaTotal.toFixed(2).toLocaleString())

        setVATPercentage(vat.toFixed(2).toLocaleString())
        setWHTPercentage(wht.toFixed(2).toLocaleString())
        setUnitAmount(baseRate.toFixed(2).toLocaleString());

        setUnitTotalAmount(rentalRateWithVAT.toFixed(2).toLocaleString());
        setUnitVat(unitVatAmount.toFixed(2).toLocaleString());
        setUnitWHT(unitWhtAmount.toFixed(2).toLocaleString());


        setParkingAmount(parkingBaseAmount.toFixed(2).toLocaleString());
        setParkingVat(parkingvatAmount.toFixed(2).toLocaleString());
        setParkingWHT(parkingwhtAmount.toFixed(2).toLocaleString());
        setParkingTotalAmount(parkingRate.toFixed(2).toLocaleString());

        setOverallAmount(overallAmount.toFixed(2).toLocaleString())
        
    }
    
    const handleSubmit = (e) => {
    e.preventDefault();
    let remainingPayment = Number(amountReceived);
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Note: Months are 0-based, so we add 1.
    const year = today.getFullYear();
    let dateString = `${year}-${month}-${day}`;
    let dates = [];
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];

    tenantsLedger.forEach(async (ledger) => {
        if (currentUnit === ledger.unit && (ledger.status === "Pending" || ledger.status === "Overdue")) {
            const ledgerDocRef = doc(db, 'tenantsLedger', ledger.id);
            let newBalance = 0;

            const month = months.indexOf((ledger.dueDate).split(' ')[0]);
            const day = (ledger.dueDate).split(' ')[1];
            const year = (ledger.dueDate).split(' ')[2];

            dates.push(month + "/" + day.slice(0, -1) + "/" + year);
        }
    });

        dates.sort();

        dates.forEach(date => {

            const month = months[date.split('/')[0]];
            const day = date.split('/')[1] + ",";
            const year = date.split('/')[2];

            const dateFormat = month + " " + day + " " + year;

            tenantsLedger.forEach(async (ledger) => {
                if (currentUnit === ledger.unit && ledger.dueDate == dateFormat) {
                    const ledgerDocRef = doc(db, 'tenantsLedger', ledger.id);
                    let newBalance = 0;

                    if (remainingPayment != 0){
                        if (ledger.monthlyBalance - remainingPayment >= 0) {
                            newBalance = ledger.monthlyBalance - remainingPayment;
                            if (ledger.monthlyBalance === remainingPayment) {
                                dateString = `${year}-${month}-${day}`;
                                await updateDoc(ledgerDocRef, {
                                    monthlyBalance: 0,
                                    transactionDate: dateString,
                                    status: "Paid",
                                    payment: remainingPayment,
                                });
                            } else {
                                dateString = "";
                                await updateDoc(ledgerDocRef, {
                                    monthlyBalance: newBalance,
                                    transactionDate: dateString,
                                    status: "Pending",
                                    payment: "",
                                });
                                setTenantsLedger((prevTenantsLedger) => [
                                    ...prevTenantsLedger,
                                    {
                                        monthlyBalance: newBalance,
                                        transactionDate: dateString,
                                        status: "Pending",
                                        payment: "",
                                    }
                                ]);
                                remainingPayment = newBalance;
                            }

                        }else if (ledger.monthlyBalance - remainingPayment < 0) {

                            newBalance = ledger.monthlyBalance - remainingPayment;
                            remainingPayment = Math.abs(newBalance);

                        }
                    }
                }
            });

        });
    // Update the value of the input field after the loop
    // setAmountReceived(remainingPayment);
    //    document.getElementById("amountReceived").value = remainingPayment;
    //  console.log("1   " + remainingPayment);
};



      
    return(

        <div className="cashier-payment-container">
            
            <div className="cashier-payment-content">
                <div className="cashier-payment-header">
                    <h1>HANDLE A PAYMENT</h1>
                </div>

                <div className="cashier-payment-receipt">
                    
                    <div className="receipt-header">
                        <img src={diplomatLogo} className="receipt-logo"/>
                    </div>

                    <div className="receipt-body">
                        <div className="receipt-form-div">

                            <form className="receipt-form">
                                <div className="receipt-inputs">
                                    <div className="name-input">
                                        <label>Name:</label>
                                        <input type="text" placeholder="First Name" name="firstName" onChange={handleInputChange}/>
                                        <input type="text" placeholder="Last Name" name="lastName" onChange={handleInputChange}/>
                                    </div>

                                    <div className="date-input">
                                    <div>
                                        <label>Date:</label>
                                        <input type="text"
                                        value={formattedDate}
                                        disabled
                                        />
                                    </div>
                                    
                                    </div>
                                </div>

                                <div className="receipt-col">

                                    <div className="receipt-col-contents">
                                        <h3>UNIT</h3>

                                        <div className="receipt-col-div">
                                            <div className="receipt-labels">
                                                <label>Floor:</label>
                                                <label>Unit:</label>
                                                <label>Base Rate:</label>
                                                <label>VAT:</label>
                                                <label>WHT:</label>
                                                <label>Total Amount:</label>
                                            </div>
                                            
                                            <div className="receipt-col-inputs">
                                            <select
                                                name="floor"
                                                onChange={handleInputChange}
                                            >
                                                <option value="">--Choose--</option>
                                                <option value="2">Second</option>
                                                <option value="3">Third</option>
                                                <option value="4">Fourth</option>
                                                <option value="5">Fifth</option>
                                                <option value="6">Sixth</option>
                                                <option value="7">Seventh</option>
                                                <option value="8">Eigth</option>
                                            </select>

                                            <select
                                            name="unit"
                                            onChange={handleInputChange}
                                            >   
                                                <option value="">--Choose--</option>
                                                {occupiedUnits.map((unit) => (                                      
                                                    <option key={unit.unitNumber} value={unit.unitNumber}>{unit.unitNumber}</option>
                                                ))}
                                            </select>
                                            
                                            <input
                                            type="number"
                                            value={unitAmount}
                                            disabled
                                            />
                                            <div className="tax-div">
                                                <input type="number" disabled className="tax-input"
                                                value={unitVat}
                                                /> 
                                                <div className="tax-edit">
                                                
                                                    <span>+{VATPercentage}%</span>


                                                </div>
                                            </div>
                                            <div className="tax-div">
                                                <input type="number" disabled className="tax-input" value={unitWHT}/> 
                                                <span>-{WHTPercentage}%</span>
                                            </div>

                                            <input type="number" disabled value={unitTotalAmount}/> 
                                            </div>
                                        </div>
                                    </div>

                                    <div className="receipt-col-contents">
                                    <h3>PARKING</h3>

                                    <div className="receipt-col-div">
                                        <div className="receipt-labels">
                                            <label>Parking Space:</label>
                                            <label>Base Rate:</label>
                                            <label>VAT:</label>
                                            <label>WHT:</label>
                                            <label>Total Amount:</label>
                                        </div>
                                        
                                        <div className="receipt-col-inputs">
                                        <select
                                        >
                                        <option value="">--Choose--</option>
                                        <option value="1">Parking 1</option>
                                        <option value="2">Parking 2</option>
                                        <option value="3">Parking 3</option>
                                        <option value="5">Parking 4</option>
                                        <option value="6">Parking 5</option>
                                        <option value="7">Parking 6</option>
                                        <option value="8">Parking 7</option>
                                        <option value="9">Parking 8</option>
                                        <option value="10">Parking 9</option>
                                        <option value="11">Parking 10</option>
                                        </select>

                                        <input type="text"
                                        value={parkingAmount}
                                        disabled
                                        />
                                        
                                        <div className="tax-div">
                                            <input type="number" disabled className="tax-input" value={parkingVat}/> 
                                            <span>+{VATPercentage}%</span>
                                            
                                        </div>
                                        <div className="tax-div">
                                            <input type="number" disabled className="tax-input" value={parkingWHT}/> 
                                            <span>-
                                                {WHTPercentage}%</span>
                                            
                                        </div>

                                            <input type="number" disabled value={parkingTotalAmount}/> 
                                        </div>
                                    </div>
                                    
                                    </div>

                                    <div className="receipt-col-contents">
                                        <h3>CUSA</h3>

                                        <div className="receipt-col-div">
                                            <div className="receipt-labels">
                                                <label>Base Rate::</label>
                                                <label>VAT:</label>
                                                <label>WHT:</label>
                                                <label>Total Amount:</label>
                                            </div>
                                            
                                            <div className="receipt-col-inputs">
                                            

                                            <input type="number"
                                                name="cusaAmount"
                                                onChange={(e) => {
                                                    
                                                    getContents(currentUnit)
                                                    setCusaAmount(e.target.value)
                                                }}  
                                            />
                                            
                                            <div className="tax-div">
                                                <input type="number" disabled className="tax-input" 
                                                value={cusaVat}
                                                /> 
                                                <span>+{VATPercentage}%</span>
                                            </div>
                                            <div className="tax-div">
                                                <input type="number" disabled className="tax-input" 
                                                    value={cusaWht}
                                                /> 
                                                <span>-{WHTPercentage === 0 ? "0" : WHTPercentage - 3}%</span>
                                            </div>

                                            <input type="number" disabled
                                                value={cusaTotalAmount}
                                            /> 
                                        </div>
                                        
                                    </div>
                                        <div className="overall-amount">
                                            <div className="overall-contents">
                                                <label>Overall Amount: </label>
                                                <input type="number" disabled value={overallAmount}/> 

                                                <label>Amount Received: </label>
                                                <input type="number" id= "amountReceived" value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)}/> 
                                            </div>

                                            
                                        </div>
                                    </div>
                                    
                                </div>

                                <div className="receipt-btn-div">
                                    <div className="saveprint">
                                    <button className="receipt-btn" onClick={handleSubmit}>Save</button>
                                    <button className="receipt-btn">Print</button>
                                    </div>
                                    <button className="receipt-btn">Reset</button>

                                    
                                </div>
                            </form>

                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}