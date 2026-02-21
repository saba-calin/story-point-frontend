import {useNavigate} from "react-router-dom";

const Welcome = () => {

  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to Story Point</h1>
      <br/>
      <button onClick={() => navigate("log-in")}>Log In</button>
      <br/>
      <button onClick={() => navigate("sign-up")}>Sign Up</button>
    </>
  );
}

export default Welcome;
