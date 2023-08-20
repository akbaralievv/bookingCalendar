import { useState, useEffect } from 'react';
import { Button, DatePicker, Form, Input } from 'antd';
import { url } from '../components/api';

const Main = () => {
  const [values, setValues] = useState({
    name: '',
    date: '',
  });
  const [form] = Form.useForm();
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (object) => {
    const { inputField, datePickerField } = object;
    if (inputField && datePickerField) {
      setValues((prev) => ({
        ...prev,
        name: inputField,
        date: new Date(datePickerField).toString(),
      }));
    }
  };

  useEffect(() => {
    if (values.name && values.date) {
      const sendRequest = async () => {
        setLoading(true);
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(values),
          });

          if (response.ok) {
            // const task = await response.json();
            form.resetFields();
            fetchBookedDates();
          } else {
            // handle error
          }
        } catch (error) {
          // handle error
        } finally {
          setLoading(false);
        }
      };

      sendRequest();
    }
  }, [values, form]);

  const isBookedDate = (date) => {
    const dateFormatted = date.format('YYYY-MM-DD');
    return bookedDates.includes(dateFormatted);
  };

  return (
    <div className="form">
      <Form
        form={form}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        onFinish={handleSubmit}
        style={{
          maxWidth: 600,
        }}>
        <Form.Item label="Name" name="inputField">
          <Input />
        </Form.Item>
        <Form.Item label="Date" name="datePickerField">
          <DatePicker
            disabledDate={isBookedDate}
            cellRender={(current) => {
              if (isBookedDate(current)) {
                return <div className="highlighted-date">{current.date()}</div>;
              }
              return current.date();
            }}
          />
        </Form.Item>
        <Form.Item label="Submit">
          <Button htmlType="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Click'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Main;
