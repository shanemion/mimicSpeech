import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../services/firebase/FirebaseAuth";
import useWindowSize from "../../utils/WindowSize";
import { usePricing } from "../../services/pricing/PricingContext";
import "./registration.css";

const Register = () => {
  const {
    register,
    signInWithGoogle,
    completeGoogleSignUp,
    pendingGoogleUser,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { width } = useWindowSize();
  const { pricingState, setPricingState } = usePricing();

  const isGoogleSignIn = location.state?.fromGoogle || false;

  useEffect(() => {
    if (isGoogleSignIn && pendingGoogleUser) {
      setEmail(pendingGoogleUser.email);
      setStep(2);  // Skip to username step for Google Sign-In
    }
  }, [isGoogleSignIn, pendingGoogleUser]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      if (isGoogleSignIn) {
        await completeGoogleSignUp(username, firstName, lastName);
      } else {
        const additionalData = {
          username,
          firstName,
          lastName,
          plan: "free",
          subscriptionId: ""
        };
        await register(email, password, additionalData);
      }

      if (pricingState && pricingState.fromPricingPage) {
        navigate("/dashboard");
        setPricingState({ fromPricingPage: false });
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const canProceed = () => {
    if (step === 1) return email !== "";
    if (step === 2) return username !== "" && (!isGoogleSignIn || (password !== "" && confirmPassword !== ""));
    if (step === 3) return firstName !== "" && lastName !== "";
    return false;
  };

  return (
    <div className="container">
      {width > 768 && (
        <div className="promo-section">
          <h1>Welcome to MimicSpeech!</h1>
          <p>Unlock the world with our extensive language library.</p>
          <p>
            Customize your language learning journey with our AI-powered
            application.
          </p>
        </div>
      )}
      <div className="login-section">
        <h1>{isGoogleSignIn ? "Complete Your Profile" : "Register"}</h1>
        {!isGoogleSignIn && (
          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && !isGoogleSignIn && (
            <>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="ex: email@address.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceed()}
              >
                Next
              </button>
              <div className="or">
                <p>or</p>
              </div>
              <button
                type="button"
                className="google-signin-button"
                onClick={signInWithGoogle}
              >
                Sign Up with Google
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <label>
                Username
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              {!isGoogleSignIn && (
                <>
                  <div style={{ height: "20px" }}></div>
                  <label>
                    Password
                    <input
                      name="password"
                      type="password"
                      placeholder="Password (min. 6 characters)"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                  <label>
                    Confirm Password
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                </>
              )}
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!canProceed()}
              >
                Next
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <label>
                First Name
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label>
                Last Name
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <button type="submit" disabled={!canProceed()}>
                {isGoogleSignIn ? "Complete Registration" : "Create Account"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;