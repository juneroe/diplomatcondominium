import React, { useEffect, useState } from "react";
import "../../../global/sidebarStyle.css"
import userIcon from "../../../global/sidebarImages/person.png"
import dashboardIcon from "../../../global/images2/dashboard-icon.png"
import complaintsIcon from "../../../global/images2/complaints-icon.png"
import helpIcon from "../../../global/images2/help-icon.png"
import settingsIcon from "../../../global/images2/settings-icon.png"
import maintenanceIcon from "../../../global/images2/maintenance-icon.png"
import diplomatLogo from "../../../global/sidebarImages/diplomat-logo.png"
import ledgersIcon from "../../../global/images2/ledger-icon.png"
import documentsIcon from "../../../global/images2/documents-icon.png"
import { Link, Outlet, useNavigate} from "react-router-dom";
import {  useContext } from "react";
import { LoginContext } from "../../../../context/LoginContext";
import { auth } from "../../../../firebase-config";

export default function TenantSidebar(){
    
    const { authUser, setAuthUser, isLoggedIn, setIsLoggedIn} = useContext(LoginContext)
    const [activeUser, setActiveUser] = useState("")
    const [photoURL, setPhotoUrl] = useState(activeUser?.photoURL || userIcon);
    const navigate = useNavigate()


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
                                <h3 className="user-info">{localStorage.getItem("userFullName")}</h3>
                                <h4 className="user-info">Tenant</h4>
                            </div>
                        </header>
                        
                        <ul className="link-list">
                            <Link to="" className="link">
                                <img src={dashboardIcon} className="icon" alt="Dashboard Icon"/>
                                <li>Dashboard</li>
                            </Link>

                            <Link to="maintenance" className="link">
                                <img src={maintenanceIcon} className="icon" alt="Maintenance Icon"/>
                                <li>Maintenance</li>
                            </Link>

                            <Link to="complaints" className="link">
                                <img src={complaintsIcon} className="icon" alt="Maintenance Icon"/>
                                <li>Complaints</li>
                            </Link>

                            <Link to="ledger" className="link">
                                <img src={ledgersIcon} className="icon" alt="Maintenance Icon"/>
                                <li>Ledger</li>
                            </Link>

                            <Link to="contract" className="link">
                                <img src={documentsIcon} className="icon" alt="document Icon"/>
                                <li>Contract</li>
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