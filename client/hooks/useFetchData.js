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

export const useFetchLeaveRequests = ({id}) => {
    const [leavefromapi, setLeavefromapi] = useState([]);
    useEffect(() => {
        const fetchLeaveRequest = async () => {
            try {
                const res = await fetch(`/api/getleaverequest/${id}`);
                const data = await res.json();
                if (res.ok) {
                  setLeavefromapi(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchLeaveRequest();
    }, []);
    return leavefromapi;
};