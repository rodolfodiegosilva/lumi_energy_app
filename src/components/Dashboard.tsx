import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clientNumbers, setClientNumbers] = useState<string[]>([]);
  const [selectedClientNumber, setSelectedClientNumber] = useState<string>("");
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/invoices`)
      .then(response => {
        const invoicesData: any[] = response.data;
        setInvoices(invoicesData);
        const uniqueClientNumbers: string[] = Array.from(new Set(invoicesData.map(invoice => invoice.clientNumber).filter(Boolean)));
        setClientNumbers(uniqueClientNumbers);
        setFilteredInvoices(invoicesData); // Inicialmente mostra todos os dados
      })
      .catch(error => {
        console.error("There was an error fetching the invoices!", error);
      });
  }, []);

  useEffect(() => {
    if (selectedClientNumber) {
      const filtered = invoices.filter(invoice => invoice.clientNumber === selectedClientNumber);
      setFilteredInvoices(filtered);
    } else {
      const groupedInvoices = groupInvoicesByMonth(invoices);
      setFilteredInvoices(groupedInvoices);
    }
  }, [selectedClientNumber, invoices]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedClientNumber(event.target.value as string);
  };

  const groupInvoicesByMonth = (invoices: any[]) => {
    const grouped: { [key: string]: any } = {};

    invoices.forEach(invoice => {
      const month = invoice.referenceMonth;
      if (!grouped[month]) {
        grouped[month] = { ...invoice, count: 1 };
      } else {
        grouped[month].energyConsumption += invoice.energyConsumption;
        grouped[month].sceeEnergy += invoice.sceeEnergy;
        grouped[month].totalCost += invoice.totalCost;
        grouped[month].gdCost += invoice.gdCost;
        grouped[month].count += 1;
      }
    });

    return Object.keys(grouped).map(month => ({
      ...grouped[month],
      energyConsumption: grouped[month].energyConsumption / grouped[month].count,
      sceeEnergy: grouped[month].sceeEnergy / grouped[month].count,
      totalCost: grouped[month].totalCost / grouped[month].count,
      gdCost: grouped[month].gdCost / grouped[month].count,
    }));
  };

  const getChartData = (filteredInvoices: any[], keys: string[], labels: string[], colors: string[], yAxisID?: string[]) => {
    return {
      labels: filteredInvoices.map(invoice => invoice.referenceMonth),
      datasets: keys.map((key, index) => ({
        label: labels[index],
        data: filteredInvoices.map(invoice => invoice[key]),
        borderColor: colors[index],
        backgroundColor: colors[index].replace('1)', '0.2)'),
        yAxisID: yAxisID ? yAxisID[index] : undefined,
      })),
    };
  };

  const energyChartColors = [
    'rgba(75, 192, 192, 1)',  // Aqua
    'rgba(255, 206, 86, 1)',  // Yellow
  ];

  const costChartColors = [
    'rgba(54, 162, 235, 1)',  // Blue
    'rgba(255, 99, 132, 1)',  // Red
  ];

  return (
    <div className="dashboard">
      <Typography variant="h2">Dashboard</Typography>
      <FormControl className="form-control">
        <InputLabel id="clientNumber-select-label">Client Number</InputLabel>
        <Select
          labelId="clientNumber-select-label"
          value={selectedClientNumber}
          onChange={handleChange}
        >
          <MenuItem value="">
            All Clients
          </MenuItem>
          {clientNumbers.map(clientNumber => (
            <MenuItem key={clientNumber} value={clientNumber}>
              {clientNumber}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {filteredInvoices.length > 0 && (
        <div className="charts">
          <div className="chart-container">
            <Line 
              data={getChartData(filteredInvoices, ["energyConsumption", "sceeEnergy"], ["Energy Consumption (kWh)", "Compensated Energy (kWh)"], energyChartColors)} 
            />
          </div>
          <div className="chart-container">
            <Line 
              data={getChartData(filteredInvoices, ["totalCost", "gdCost"], ["Total Cost (R$)", "GD Savings (R$)"], costChartColors, ['y', 'y1'])} 
              options={{
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                      drawOnChartArea: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
