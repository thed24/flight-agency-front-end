import axios, { AxiosResponse, AxiosError } from 'axios';
import { Result, GetResponse } from 'common/hooks';
import { useState } from 'react';

const httpClient = axios.create();

export function useGet<T>(url: string): GetResponse<T> {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Result<T>>({ error: 'Undefined.' });

    const request = (query?: any) => {
        setLoading(true);

        httpClient
            .get(url, { params: query })
            .then((response: AxiosResponse<T>) => {
                setData({ data: response.data });
            })
            .catch((error: AxiosError) => {
                setData({
                    error:
                        error.response?.data?.message ??
                        'An unknown error occured.',
                });
            })
            .then(() => {
                setLoading(false);
            });
    };

    return { loading, request, payload: data };
}
