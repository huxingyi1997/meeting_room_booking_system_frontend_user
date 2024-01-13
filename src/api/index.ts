/**
 * DO NOT change anything under ./autogen
 * Customize your API configs HERE
 */
import axios from 'axios';
import { Configuration, PollsApi } from './autogen';

const baseApiUrl = `${window.location.protocol}//${window.location.host}:${window.location.port}`;

export const urlGenerator = (rootPath: string) => {
  return `${baseApiUrl}${rootPath}`;
};

const configGenerator = (url: string) =>
  new Configuration({
    basePath: url,
    baseOptions: {
      // axios 配置在这儿
      withCredentials: true,
    },
  });

// url for different services
// IMPORTANT: remember to add new URL paths to proxy settings in vite.config.ts!
// axios config for app size config apis
const url = urlGenerator('');
const appConfig = configGenerator(url);

// axios config for monkey test apis
export const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(config => {
  const url = config.url?.replaceAll('+', '%2B');
  config.url = url;
  return config;
});

// global request error hint
axiosInstance.interceptors.response.use(
  function (response) {
    if (response.data.message) {
      // const origin = window.location.origin;
      // const path = response.config.url?.split('?')[0] || '';
      // const pathName = path.replace(origin, '');
      // message.error(`${pathName}: ${response.data.error_msg}`);
      return Promise.reject(response.data.message);
    }
    return response;
  },
  function (error) {
    // if (error?.response?.status === 401) {
    //   if (!error.response?.config?.url.includes("api/v1/auth/login")) {
    //     authApiInterface
    //       .apiV1AuthLoginPost()
    //       .then((res) => {
    //         if (res?.status >= 200 && res?.status < 300) {
    //           window.location.reload();
    //           return Promise.resolve();
    //         }
    //       })
    //       .catch((err) => Promise.reject(err));
    //   }
    // }
    // if (error?.response?.status >= 500) {
    //   message.error("Network error");
    // } else if (error.response?.data?.message) {
    //   message.error(error.response.data?.message);
    // }
    return Promise.reject(error);
  }
);

/**
 * import these API instances in your components to use the API methods
 */
export const pollsApiInterface = new PollsApi(appConfig, undefined, axiosInstance);
