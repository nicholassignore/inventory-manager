import {useEffect, useState} from "react";
import Form from "./components/Form.jsx";

const Card = ({title}) => {
    const [count, setCount] = useState(0)
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        console.log(`${title} has been liked: ${hasLiked}`)
    }, [hasLiked]);



    return (
        <div className="card" onClick={() => setCount(count + 1)}>
            <h2>{title} - {count || null}</h2>

            <button onClick={() => { setHasLiked(!hasLiked)}}>
                { hasLiked ? 'Liked' : 'Like' }
            </button>
        </div>
    )
}



const App = () => {


    return (
        <>
            <Form/>
        </>
    )

}
export default App
