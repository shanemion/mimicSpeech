import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/firebase/FirebaseAuth';
import PricingContext from '../../../services/pricing/PricingContext';
import './PopupMenu.css';

const PopupMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null); // Create a ref
  const { logout } = useAuth();
  const { setPricingState } = useContext(PricingContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check if clicked outside of menu
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Add the click event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this useEffect runs once when component mounts

  const handleEditAccount = () => navigate("/edit-account");
  const handleManagePlan = () => navigate("/manage-plan");
  const handleUpdatePlan = () => navigate("/update-plan");
  const handleLogout = async () => {
    try {
      await logout();
      setPricingState(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="profile-container" ref={popupRef}>
      <div className="profile-icon" onClick={() => setIsOpen(!isOpen)}>
        S
      </div>
      {isOpen && (
        <div className="popup-menu">
          <button onClick={handleEditAccount}>Edit Account</button>
          <button onClick={handleManagePlan}>Manage Plan</button>
          <button onClick={handleUpdatePlan}>Update Plan</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default PopupMenu;
