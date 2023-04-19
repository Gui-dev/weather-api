import axios, { type AxiosResponse, type AxiosRequestConfig, type AxiosError } from 'axios'

export interface IRequestConfig extends AxiosRequestConfig { }
export interface IResponse<T = any> extends AxiosResponse<T> { }

export class Request {
  constructor(private readonly request = axios) { }

  public async get<T> (url: string, config: IRequestConfig = {}): Promise<IResponse<T>> {
    return await this.request.get<T, IResponse<T>>(url, config)
  }

  public static isRequestError (error: AxiosError): boolean {
    return !!(error.response?.status)
  }
}
