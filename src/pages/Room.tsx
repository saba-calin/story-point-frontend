import {useNavigate, useParams} from "react-router-dom";

const Room = () => {

  const {roomId} = useParams();

  const navigate = useNavigate();


  return (
    <>
      <div>{roomId}</div>
    </>
  );
}

export default Room;
