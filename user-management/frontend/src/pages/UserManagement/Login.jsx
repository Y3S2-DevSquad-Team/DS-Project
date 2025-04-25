import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Email and password are required");
    }

    // TODO: Add your API call here
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg">
      <div className="bg-[#1c1c1c] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          Login to YumGo
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-[#2a2a2a] text-white border border-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-[#2a2a2a] text-white border border-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full bg-primary text-black font-bold py-3 rounded hover:bg-primaryDark transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-muted mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-primary underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
