export default function PasswordStrengthMeter({ password }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#]/.test(password)) score++;

    return score;
  };

  const strength = getStrength();

  const labels = ["Very Weak", "Weak", "Okay", "Good", "Strong", "Very Strong"];
  const colors = ["#ccc", "red", "orange", "yellow", "blue", "green"];

  return (
    <div style={{ marginTop: "5px" }}>
      <div
        style={{
          height: "8px",
          width: `${(strength / 5) * 100}%`,
          backgroundColor: colors[strength],
          transition: "0.3s",
        }}
      />
      <small>{labels[strength]}</small>
    </div>
  );
}
