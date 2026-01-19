import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../../../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import PasswordStrengthBar from "react-password-strength-bar";
import "./Signup.css";

import signupimage from "../../../assets/Signup.png";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    region: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { name, email, password, region } = formData;

      // 1️⃣ Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 2️⃣ Send email verification
      await sendEmailVerification(user);

      // 3️⃣ Save supervisor in MongoDB
      const response = await fetch(
        "http://localhost:3000/supervisor/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            region,
            firebaseUid: user.uid,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.warn("MongoDB sync failed, but Firebase signup succeeded");
      }

      alert(
        "Signup successful! Please verify your email. Admin approval is required before login."
      );

      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err);

      if (err.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email already registered.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        region: "",
      });
    }
  };

 return (
    <div className="signup-container">
      <div className="image-section">
        <img src={signupimage} alt="Supervisor Illustration" className="Signup-image" />
      </div>

      <div className="form-section">
        <h2 className="heading">Create Supervisor Account</h2>
        <p style={{ color: '#64748b', marginBottom: '25px', fontSize: '0.95rem' }}>
            Join our command network to start managing regional emergencies.
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-msg">{error}</div>
          )}

          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Work Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Region Assignment</label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="e.g. Solapur, Maharashtra"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Security Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
            <PasswordStrengthBar
              password={formData.password}
              style={{ marginTop: "12px" }}
              barColors={['#e2e8f0', '#ef4444', '#f59e0b', '#3b82f6', '#10b981']}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Establishing Account..." : "Register as Supervisor"}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#64748b' }}>
            Already have an account? <a href="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Log In</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
