import { useNavigate } from "react-router"

const Home = () => {

    const navigate = useNavigate()

  return (
    <div>
        <button
        className="bg-blue-400"
        onClick={async () => {
            const sendReq = await fetch("http://localhost:5000/api/v1/canvas/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })   
            
            const res = await sendReq.json()

            if (res.success) {
                navigate(`/canvas/${res.canvasId}`)
            }
            
        }}
        >Create</button>
    </div>
  )
}

export default Home