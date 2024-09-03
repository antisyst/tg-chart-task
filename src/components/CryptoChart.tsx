import React, { useEffect, useCallback, useState } from 'react';
import ApexCharts from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useStore } from './useStore';

const CryptoChart: React.FC = () => {
  const { series, setSeries } = useStore();
  const [isTapped, setIsTapped] = useState(false);
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: 'candlestick',
      height: '100%',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      type: 'datetime',
      min: new Date().getTime(),
      max: new Date().getTime() + 500000,
      tickPlacement: 'on',
      labels: {
        formatter: (val) => new Date(val).toLocaleTimeString(),
        style: {
          fontSize: '10px',
        },
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        style: {
          fontSize: '10px',
        },
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#00B746',
          downward: '#EF403C'
        }
      }
    },
    title: {
      text: 'Real-Time Cryptocurrency Chart',
      align: 'left',
      style: {
        fontSize: '16px',
        color: '#333',
      }
    }
  });

  const addNewCandlestick = useCallback(() => {
    const lastCandle = series[series.length - 1];
    const time = lastCandle.x + 10000;
    const open = lastCandle.y[3];

    const shouldGoUp = Math.random() > 0.5;
    const randomFactor = 1 + (shouldGoUp ? Math.random() * 0.02 : -Math.random() * 0.02);
    const close = open * randomFactor;

    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    const newCandle = {
      x: time,
      y: [open, high, low, close]
    };

    setSeries((prevSeries) => {
      const updatedSeries = [...prevSeries, newCandle];
      return updatedSeries.length > 50 ? updatedSeries.slice(1) : updatedSeries;
    });
  }, [series, setSeries]);

  useEffect(() => {
    const interval = setInterval(() => {
      addNewCandlestick();
    }, 10000);

    return () => clearInterval(interval);
  }, [addNewCandlestick]);

  useEffect(() => {
    const handleTap = () => {
      setIsTapped(true);
      setTimeout(() => setIsTapped(false), 10000); 
    };

    window.addEventListener('touchstart', handleTap);

    return () => window.removeEventListener('touchstart', handleTap);
  }, []);

  useEffect(() => {
    const latestCandle = series[series.length - 1];
    const minTime = latestCandle.x - 500000;
    const maxTime = latestCandle.x;
    
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        min: minTime,
        max: maxTime,
      },
    }));
  }, [series]);

  return (
    <div id="chart-container">
      {isTapped && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 183, 70, 0.3)',
          zIndex: 1,
          pointerEvents: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#00B746',
          fontSize: '2rem',
        }}>
          Green Mode
        </div>
      )}
      <ApexCharts
        options={options}
        series={[{ data: series }]}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

export default CryptoChart;