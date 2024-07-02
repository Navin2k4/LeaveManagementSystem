import { useState,useEffect } from "react";

export const useFetchDepartments = () => {
    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await fetch(`/api/departments/getdepartments`);
                const data = await res.json();
                if (res.ok) {
                    setDepartments(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchDepartments();
    }, []);
    return departments;
};