// credit to https://profy.dev/article/react-architecture-api-client

type APIClientType = {
  baseURL: string;
}

export interface ResponseError extends Error {
  status?: number;
  response?: JSON;
}

class APIClient implements APIClientType {
  baseURL: string;

  constructor(baseURL : string) {
    this.baseURL = baseURL;
  }

  async request(url: string, options: RequestInit) {
    const response = await fetch(`${this.baseURL}${url}`, options);
    if (!response.ok) {
      const error: ResponseError = new Error("HTTP Error");
      error.status = response.status;
      try {
        error.response = await response.json();
      } catch (err) {
        console.error(err);
        throw error;
      }
      throw error;
    }
    return response.json();
  }

  get(url: string) {
    const token = localStorage.getItem("token") || "";
    const parsedToken = JSON.parse(token);
    return this.request(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: "Bearer " + parsedToken,
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post(url: string, data: any) {
    const token = localStorage.getItem("token") || "";
    const parsedToken = JSON.parse(token);
    return this.request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: "Bearer " + parsedToken,
      },
      body: JSON.stringify(data),
    });
  }

  postFormData(url: string, formData: FormData, signal: AbortSignal) {
    const token = localStorage.getItem("token") || "";
    const parsedToken = JSON.parse(token);
    return this.request(url, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        authorization: "Bearer " + parsedToken,
      },
      body: formData,
      signal,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put(url: string, data: any) {
    const token = localStorage.getItem("token") || "";
    const parsedToken = JSON.parse(token);
    return this.request(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: "Bearer " + parsedToken,
      },
      body: JSON.stringify(data),
    });
  }

  delete(url: string) {
    const token = localStorage.getItem("token") || "";
    const parsedToken = JSON.parse(token);
    return this.request(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: "Bearer " + parsedToken,
      },
    });
  }
}

export const apiClient = new APIClient(import.meta.env.VITE_API_URL);
