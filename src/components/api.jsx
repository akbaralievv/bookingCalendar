import axios from 'axios';
export const url = 'https://64877e44beba62972790bb18.mockapi.io/data';

export const fetchData = ({ setInitLoading, setData, setList }) => {
  axios
    .get(url, {
      params: {
        limit: 3,
        page: 1,
      },
    })
    .then((res) => {
      setInitLoading(false);
      setData(res.data);
      setList(res.data);
    });
};
