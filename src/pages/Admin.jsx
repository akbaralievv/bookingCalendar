import { useEffect, useState } from 'react';
import { Button, List, Skeleton } from 'antd';
import axios from 'axios';

import { fetchData, url } from '../components/api';
import ModalEdit from '../components/ModalEdit';

function Admin() {
  const [countPage, setCountPage] = useState(1);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [open, setOpen] = useState(false);
  const [idData, setIdData] = useState('');

  useEffect(() => {
    fetchData({ setInitLoading, setList, setData });
  }, []);

  const deleteData = (id) => {
    axios.delete(url + '/' + id).then((res) => {
      if (res.status === 200) {
        setCountPage(1);
        setHasMoreData(true);
        return fetchData({ setInitLoading, setList, setData });
      }
      // handle error
    });
  };

  const editData = (id) => {
    setOpen(true);
    setIdData(id);
  };

  const onLoadMore = () => {
    setLoading(true);
    const nextPage = countPage + 1;
    setList(
      data.concat(
        [...new Array(3)].map(() => ({
          loading: true,
          name: {},
          picture: {},
        })),
      ),
    );
    axios
      .get(url, {
        params: {
          limit: 3,
          page: nextPage,
        },
      })
      .then((res) => {
        const newData = data.concat(res.data);
        setData(newData);
        setList(newData);
        setLoading(false);
        setCountPage(nextPage);
        window.dispatchEvent(new Event('resize'));
        if (res.data.length < 3) {
          setHasMoreData(false);
        }
      });
  };
  const loadMore =
    !initLoading && hasMoreData && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}>
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  const formatDate = (date, time) => {
    const inputDate = new Date(date);

    const day = inputDate.getDate().toString().padStart(2, '0');
    const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
    const year = inputDate.getFullYear();

    return `${day}.${month}.${year} ${time}`;
  };

  return (
    <div className="list">
      {open && (
        <ModalEdit
          open={open}
          setOpen={setOpen}
          idData={idData}
          setInitLoading={setInitLoading}
          setList={setList}
          setData={setData}
          setHasMoreData={setHasMoreData}
          setCountPage={setCountPage}
        />
      )}
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit" onClick={() => editData(item.id)}>
                edit
              </a>,
              <a key="list-loadmore-more" onClick={() => deleteData(item.id)}>
                remove
              </a>,
            ]}>
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                title={<a href="https://ant.design">{item.name}</a>}
                description={formatDate(item.date, item.time)}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
}

export default Admin;
