import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleAuthButton = () => {
  const buttonRef = useRef(null);
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          await googleLogin(response.credential);
          navigate("/dashboard");
        } catch (err) {
          alert("Google sign-in failed. Please try again.");
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "filled_black",
      size: "large",
      width: Math.min(containerWidth, 400),
      // width: 320,
      text: "continue_with",
      shape: "rectangular",
    });
  }, [googleLogin, navigate]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="text-xs text-muted text-center">
        Google sign-in not configured (missing VITE_GOOGLE_CLIENT_ID)
      </p>
    );
  }

  return <div ref={buttonRef} className="w-full flex justify-center overflow-hidden" />;
};

export default GoogleAuthButton;


