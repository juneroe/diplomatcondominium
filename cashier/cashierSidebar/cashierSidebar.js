import React, { useEffect, useState } from "react";
import "../../../global/sidebarStyle.css"
import userIcon from "../../../global/sidebarImages/person.png"
import dashboardIcon from "../../../global/images2/dashboard-icon.png"
import ledgerIcon from "../../../global/images2/ledger-icon.png"
import paymentIcon from "../../../global/images2/payment-icon.png"
import collectionIcon from "../../../global/images2/collection-icon.png"
import helpIcon from "../../../global/images2/help-icon.png"
import settingsIcon from "../../../global/images2/settings-icon.png"
import diplomatLogo from "../../../global/sidebarImages/diplomat-logo.png"
import { Link, Outlet, useNavigate} from "react-router-dom";
import {  useContext } from "react";
import { LoginContext } from "../../../../context/LoginContext";
import { auth } from "../../../../firebase-config";
export default function CashierSidebar(){
    const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useContext(LoginContext)
    const [activeUser, setActiveUser] = useState("")
    const [photoURL, setPhotoUrl] = useState(activeUser?.photoURL || userIcon);



    const logOut = () => {
        setIsLoggedIn(false)
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('userFullName')
    }

    useEffect(() => {
        if (activeUser) {
            setPhotoUrl(activeUser.photoURL || userIcon);
        }
    }, [activeUser]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            setActiveUser(user);

    
        } else {
            setActiveUser(null);
        }
        });
    
        return () => unsubscribe();
    }, [photoURL]);
    return(
        <div className="sidebar-container">
            <div className="adminSidebar">

                <div className="sidebar-content-div">

                    
                    <div className="links-div">
                        <header className="sidebar-header">
                            <img className="user-icon" src={photoURL} alt="User Icon" />

                            <div className="user-info-div">
                                <h2 className="user-info">{localStorage.getItem("userFullName")}</h2>
                                <h3 className="user-info">Cashier</h3>
                            </div>
                        </header>
                        
                        <ul className="link-list">
                            <Link to="" className="link">
                                <img src={dashboardIcon} className="icon" alt="Dashboard Icon"/>
                                <li>Dashboard</li>
                            </Link>

                            <Link to="ledger" className="link">
                                <img src={ledgerIcon} className="icon" alt="Payment Icon"/>
                                <li>Ledger</li>
                            </Link>

                            <Link to="payment" className="link">
                                <img src={paymentIcon} className="icon" alt="Maintenance Icon"/>
                                <li>Payment</li>
                            </Link>

                            <Link to="collection" className="link">
                                <img src={collectionIcon} className="icon" alt="document Icon"/>
                                <li>Collection</li>
                            </Link>

                            <Link to="help" className="link">
                                <img src={helpIcon} className="icon" alt="Help Icon"/>
                                <li>Help</li>
                            </Link>

                            <Link to="settings" className="link">
                            
                                <img src={settingsIcon} className="icon" alt="Settings Icon"/>
                                <li>Settings</li>
                            </Link>
                        
                            
                        </ul>
                         
                    </div>
                    <button onClick={logOut}>Log Out</button>

                </div>
            </div>

            <div className="topbar">
                <img src={diplomatLogo} alt="Diplomat Logo"/>
            </div>

            <div className="contentdiv">
                <Outlet />
            </div>

            <div className="footer">
                <div className="address-div">
                    <p><b>Property Address</b> GXMV+CC3, Russel Avenue, Baclaran, Pasay, Kalakhang Maynila</p>   
                </div>
                
            </div>
        </div>
    )
}