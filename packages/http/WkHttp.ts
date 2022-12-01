import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import {
  MethodEnum,
  AxiosOptions,
  RequestInterceptors,
  ResponseInterceptors,
  ErrorInterceptors,
} from "./types/http";

class WkHttp {
  private options: AxiosOptions;
  private axiosInstance: AxiosInstance;
  constructor(options: AxiosOptions) {
    this.options = options;
    this.axiosInstance = this.createAxios(options);
  }

  clone() {
    return new WkHttp(this.options);
  }

  createAxios(options: AxiosOptions) {
    return axios.create(options);
  }

  async request<D>(config: AxiosRequestConfig): Promise<D> {
    try {
      const res: D = await this.axiosInstance.request(config);
      return res;
    } catch (e) {
      return await Promise.reject(e);
    }
  }

  /**
   *
   * @param success 请求前成功拦截器
   * @param fail 请求前失败拦截器
   */
  setRequestInterceptors(success: RequestInterceptors, fail?: ErrorInterceptors): WkHttp {
    this.axiosInstance.interceptors.request.use(success, fail);
    return this;
  }

  /**
   *
   * @param success 响应后成功拦截器
   * @param fail 响应后失败拦截器
   */
  setResponseInterceptors(success: ResponseInterceptors, fail?: ErrorInterceptors): WkHttp {
    this.axiosInstance.interceptors.response.use(success, fail);
    return this;
  }

  stringify(obj: Record<string, string>, options: any) {
    const resArr = [];
    for (const key in obj) {
      resArr.push(`${key}=${String(obj[key])}`);
    }
    return resArr.join("&");
  }

  /**
   *
   * @param url 请求地址
   * @param baseURL 请求前缀
   * @param params url参数
   * @param headers 请求头
   */
  get<Q, D>(url: string, baseURL: string, params?: Q, headers?: AxiosRequestHeaders) {
    return this.request<D>({
      url,
      baseURL: baseURL || this.options.baseUrl || undefined,
      method: MethodEnum.get,
      params,
      headers,
      paramsSerializer: (params) => {
        return this.stringify(params, { indices: false });
      },
    });
  }

  /**
   *
   * @param url 请求地址
   * @param baseURL 请求前缀
   * @param data body参数
   * @param params url参数
   * @param headers 请求头
   */
  post<Q, D>(
    url: string,
    baseURL: string,
    data?: Q,
    params?: Record<string, string | number>,
    headers?: AxiosRequestHeaders
  ): Promise<D> {
    return this.request<D>({
      url,
      baseURL: baseURL || this.options.baseUrl || undefined,
      method: MethodEnum.post,
      data,
      params,
      headers,
      paramsSerializer: (params) => {
        return this.stringify(params, { indices: false });
      },
    });
  }

  /**
   *
   * @param url 请求地址
   * @param baseURL 请求前缀
   * @param data body参数
   * @param headers 请求头
   */
  put<Q, D>(url: string, baseURL: string, data?: Q, headers?: AxiosRequestHeaders): Promise<D> {
    return this.request<D>({
      url,
      baseURL: baseURL || this.options.baseUrl || undefined,
      method: MethodEnum.put,
      data,
      headers,
    });
  }

  /**
   *
   * @param url 请求地址
   * @param baseURL 请求前缀
   * @param params url参数
   * @param headers 请求头
   */
  del<Q, D>(url: string, baseURL: string, params?: Q, headers?: AxiosRequestHeaders): Promise<D> {
    return this.request<D>({
      url,
      baseURL: baseURL || this.options.baseUrl || undefined,
      method: MethodEnum.delete,
      params,
      headers,
      paramsSerializer: (params) => {
        return this.stringify(params, { indices: false });
      },
    });
  }
}

export default WkHttp;
