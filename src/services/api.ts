import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
});

export const uploadInvoice = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload-pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const fetchInvoices = async () => {
  const response = await api.get('/invoices');
  return response.data;
};

export const fetchInvoiceByClient = async (clientNumber: string) => {
  const response = await api.get(`/invoices?clientNumber=${clientNumber}`);
  return response.data;
};