import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface AxiosOptions {
  baseUrl: string;
  timeout: number;
}

export type RequestInterceptors = (
  value: AxiosRequestConfig
) => AxiosRequestConfig | Promise<AxiosRequestConfig>;

export type ResponseInterceptors = (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;

export type ErrorInterceptors = (e: any) => void;

export enum MethodEnum {
  get = "get",
  post = "post",
  put = "put",
  delete = "delete",
}
