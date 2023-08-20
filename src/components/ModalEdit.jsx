import { useState, useEffect } from 'react';
import { Modal, DatePicker } from 'antd';
import PropTypes from 'prop-types';

import { url } from './api';
import { fetchData } from './api';

const ModalEdit = ({
  open,
  setOpen,
  idData,
  setData,
  setList,
  setInitLoading,
  setHasMoreData,
  setCountPage,
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [changedDate, setChangedDate] = useState('');
  const [bookedDates, setBookedDates] = useState([]);

  const fetchBookedDates = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const bookedDatesArray = data.map((item) => {
        const date = new Date(item.date);
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
          .getDate()
          .toString()
          .padStart(2, '0')}`;
      });
      setBookedDates(bookedDatesArray);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchBookedDates();
  }, []);

  const handleOk = () => {
    setConfirmLoading(true);
    fetch(url + '/' + idData, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ date: changedDate }),
    })
      .then((res) => {
        if (res.ok) {
          fetchData({ setInitLoading, setList, setData });
          setCountPage(1);
          setHasMoreData(true);
          setOpen(false);
          setConfirmLoading(false);
          return res.json();
        }
        // handle error
      })
      //   .then((task) => {
      //     // Do something with updated task
      //   })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const onChange = (date) => {
    if (date) {
      return setChangedDate(new Date(date).toString());
    }
    return setChangedDate('');
  };
  const isBookedDate = (date) => {
    const dateFormatted = date.format('YYYY-MM-DD');
    return bookedDates.includes(dateFormatted);
  };
  return (
    <>
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: !changedDate && (idData === 0 || idData),
        }}>
        <DatePicker
          onChange={onChange}
          disabledDate={isBookedDate}
          cellRender={(current) => {
            if (isBookedDate(current)) {
              return <div className="highlighted-date">{current.date()}</div>;
            }
            return current.date();
          }}
        />
      </Modal>
    </>
  );
};
ModalEdit.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  idData: PropTypes.string.isRequired,
  setData: PropTypes.func.isRequired,
  setList: PropTypes.func.isRequired,
  setInitLoading: PropTypes.func.isRequired,
  setHasMoreData: PropTypes.func.isRequired,
  setCountPage: PropTypes.func.isRequired,
};
export default ModalEdit;
