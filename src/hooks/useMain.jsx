import { useContext } from "react"
import MainContext from "../context/MainContext"

const useMain = () => {
    return useContext(MainContext);
};

export default useMain;
