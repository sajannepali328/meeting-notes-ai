import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchQuery = (url) => {

    const query = useQuery({
        queryKey: [url],
        queryFn: async () => {
            const response = await axios.get(url);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, 
        retry: 2,
    });

    return {
        data: query.data ?? [],      
        isLoading: query.isLoading, 
    };
};

export const useApiMutation = () => {
    return useMutation({
        mutationFn: async ({ method, url, payload = {} }) => {
            const res = await axios({
                method,
                url,
                data: payload,
            });
            return res.data;
        },
    });
};